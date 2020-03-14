const { admin, db } = require('../util/admin');

const config = require('../util/config');

const firebase = require('firebase');
firebase.initializeApp(config);

const {
  validateSignupData,
  validateLoginData,
  reduceUserDetails,
  validateUploadMusic
} = require('../util/validators');

exports.signup =  (req, res) => {  
  const publicIp = require('public-ip');
  const geolib = require('geolib');
  const geoip = require('geoip-lite');
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  };

  const { valid, errors } = validateSignupData(newUser);
  if (!valid) {
    return res.status(400).json(errors);
  }

  const noImg = 'no-img.png'

  let token, userId;
  db.doc(`/users/${newUser.handle}`).get()
    .then(doc => {
      if(doc.exists) {
        return res.status(400).json({handle : 'this handle is already taken'});
      } else {
        return firebase
        .auth()
        .createUserWithEmailAndPassword(newUser.email, newUser.password)
      }
    })
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken()
    })
    .then(idToken => {
      token = idToken;
      var myIP;
      publicIp.v4()
      .then(actualIP => {
        myIP = actualIP;
        console.log("my ip: " + myIP);
        var geo = geoip.lookup(myIP);
        console.log(geo);
        const userCredentials = {
          handle: newUser.handle,
          email: newUser.email,
          createdAt: new Date().toISOString(),
          imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
          userId: userId,
          pendingFriendRequests: [],
          sentFriendRequests: [],
          friends: [],
          ipAddress: myIP,
          coordinates: geo.ll     
        };
          
        return db.doc(`/users/${newUser.handle}`).set(userCredentials);
      })
      .catch(err => {
        console.error(err);
      })
    })
    .then(() => {
      return res.status(201).json({token});
    })
    .catch(err => {
      console.error(err);
      if (err.code == 'auth/email-already-in-use') {
        return res.status(400).json({email: 'Email is already in use'});
      } else {
        return res.status(500).json({error: err.code});
      }
    });
}

exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };

  const { valid, errors } = validateLoginData(user);

  if (!valid) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
      console.error(err);
      // auth/wrong-password
      // auth/user-not-user
      return res
        .status(403)
        .json({ general: 'Wrong credentials, please try again' });
    });
};

// Add user details
exports.addUserDetails = (req, res) => {
  let userDetails = reduceUserDetails(req.body);

  db.doc(`/users/${req.user.handle}`)
    .update(userDetails)
    .then(() => {
      return res.json({ message: 'Details added successfully' });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
// Get any user's details
exports.getUserDetails = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.params.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.user = doc.data();
        return db
          .collection('screams')
          .where('userHandle', '==', req.params.handle)
          .orderBy('createdAt', 'desc')
          .get();
      } else {
        return res.status(404).json({ errror: 'User not found' });
      }
    })
    .then((data) => {
      userData.screams = [];
      data.forEach((doc) => {
        userData.screams.push({
          body: doc.data().body,
          createdAt: doc.data().createdAt,
          userHandle: doc.data().userHandle,
          userImage: doc.data().userImage,
          likeCount: doc.data().likeCount,
          commentCount: doc.data().commentCount,
          screamId: doc.id
        });
      });
      return res.json(userData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
// Get own user details
exports.getAuthenticatedUser = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.user.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.credentials = doc.data();
        return db
          .collection('likes')
          .where('userHandle', '==', req.user.handle)
          .get();
      }
    })
    .then((data) => {
      userData.likes = [];
      data.forEach((doc) => {
        userData.likes.push(doc.data());
      });
      return db
        .collection('notifications')
        .where('recipient', '==', req.user.handle)
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get();
    })
    .then((data) => {
      userData.notifications = [];
      data.forEach((doc) => {
        userData.notifications.push({
          recipient: doc.data().recipient,
          sender: doc.data().sender,
          createdAt: doc.data().createdAt,
          screamId: doc.data().screamId,
          type: doc.data().type,
          read: doc.data().read,
          notificationId: doc.id
        });
      })
      return res.json(userData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
// Upload a profile image for user
exports.uploadImage = (req, res) => {
  const BusBoy = require('busboy');
  const path = require('path');
  const os = require('os');
  const fs = require('fs');

  const busboy = new BusBoy({ headers: req.headers });

  let imageToBeUploaded = {};
  let imageFileName;

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname, file, filename, encoding, mimetype);
    if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
      return res.status(400).json({ error: 'Wrong file type submitted' });
    }
    // my.image.png => ['my', 'image', 'png']
    const imageExtension = filename.split('.')[filename.split('.').length - 1];
    // 32756238461724837.png
    imageFileName = `${Math.round(
      Math.random() * 1000000000000
    ).toString()}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on('finish', () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype
          }
        }
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${
          config.storageBucket
        }/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${req.user.handle}`).update({ imageUrl });
      })
      .then(() => {
        return res.json({ message: 'image uploaded successfully' });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: 'something went wrong' });
      });
  });
  busboy.end(req.rawBody);
};

exports.markNotificationsRead = (req, res) => {
  let batch = db.batch();
  req.body.forEach((notificationId) => {
    const notification = db.doc(`/notifications/${notificationId}`);
    batch.update(notification, { read: true });
  });
  batch
    .commit()
    .then(() => {
      return res.json({ message: 'Notifications marked read' });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.uploadMusic = (req, res) => {
  const BusBoy = require('busboy');
  const path = require('path');
  const os = require('os');
  const fs = require('fs');

  const busboy = new BusBoy({ headers: req.headers });

  let musicToBeUploaded = {};
  let musicFileName;

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname, file, filename, encoding, mimetype);
    if (mimetype !== 'audio/mp3') {
      return res.status(400).json({ error: 'Wrong file type submitted' });
    }
    // my.image.png => ['my', 'image', 'png']
    const musicExtension = filename.split('.')[filename.split('.').length - 1];
    // 32756238461724837.png
    musicFileName = `${Math.round(
      Math.random() * 1000000000000
    ).toString()}.${musicExtension}`;
    const filepath = path.join(os.tmpdir(), musicFileName);
    musicToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on('finish', () => {
    admin
      .storage()
      .bucket()
      .upload(musicToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: musicToBeUploaded.mimetype
          }
        }
      })
      .then(() => {
        const musicUrl = `https://firebasestorage.googleapis.com/v0/b/${
          config.storageBucket
        }/o/${musicFileName}?alt=media`;
        return db.doc(`/users/${req.user.handle}`).update({ musicUrl });
      })
      .then(() => {
        return res.json({ message: 'Music uploaded successfully' });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: 'something went wrong' });
      });
  });
  busboy.end(req.rawBody);
};

exports.uploadMusic1 = (req, res) => {

  const BusBoy = require('busboy');
  const path = require('path');
  const os = require('os');
  const fs = require('fs');
  
  const busboy = new BusBoy({ headers: req.headers });
  
  console.log(req.body);

  let musicToBeUploaded = {};
  let musicFileName;
  let musicName = req.headers.name;
  let musicAuthor = req.headers.author;
  let userName = req.headers.handle;

  const vadHeaders = {
    musicName,
    musicAuthor,
    userName
  }

  const { errors, valid } = validateUploadMusic(vadHeaders);

  if (!valid) return res.status(400).json(errors);

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname, file, filename, encoding, mimetype);
    
    if (mimetype !== 'audio/mpeg' && mimetype !== 'audio/mp3') {
      let newErr = {};
      newErr.fileselect = 'Wrong file type submitted';
      return res.status(400).json(newErr);
    }
    // my.image.png => ['my', 'image', 'png']
    const musicExtension = filename.split('.')[filename.split('.').length - 1];
    // 32756238461724837.png
    musicFileName = `${Math.round(
      Math.random() * 1000000000000
    ).toString()}.${musicExtension}`;
    const filepath = path.join(os.tmpdir(), musicFileName);
    musicToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  
  busboy.on('finish', () => {
    admin
      .storage()
      .bucket()
      .upload(musicToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: musicToBeUploaded.mimetype
          }
        }
      })
      .then(() => {
        const musicUrl = `https://firebasestorage.googleapis.com/v0/b/${
            config.storageBucket
          }/o/${musicFileName}?alt=media`;
        const newAudio = {
            audioId: musicFileName,
            musicUrl: musicUrl,
            userHandle: userName,
            audioName: musicName,
            audioAuthor: musicAuthor
          };
          db.collection('music')
          .add(newAudio)
          .then((doc) => {
            const resAudio = newAudio;
            resAudio.Id = doc.id;
            res.json(resAudio);
          })
          .catch((err) => {
            res.status(500).json({ userName });
            console.error(err);
          });
      });
  });
  busboy.end(req.rawBody);
};

/* 
  This method takes the user handle of the person you want to add as an argument 
  and then adds it to the "friends" field inside of your own user collection.
  This is the way we discussed would work best, although I still need to add 
  the pseudo-friends list thing you told me about!
*/
exports.addFriend = (req, res) => {
  db.doc(`/users/${req.user.handle}`).get()
  .then(doc => {

    console.log("req.user.handle", req.user.handle);
    console.log("shit", doc.data());
    // if this person doesn't exist, return error
    if (!doc.exists) {
      return res.status(404).json({error: 'User not found'});
    }
    // if friend already added, return error
    if (doc.data().friends.includes(`${req.params.handle}`)) {
      return res.status(404).json({ error: 'friend already added'});
    } 

    
    db.doc(`/users/${req.params.userHandle}`).get()
    .then(potentialFriend => {
      if (true) {
        // update this user's friends' list with req.params.handle
        db.doc(`/users/${req.user.handle}`)
        .update({
          friends: doc.data().friends.concat(req.params.userHandle)
        })
        .then(() => {
          return res.json({ friend: req.params.userHandle });
        })
        .catch(err => {
          console.error(err);
          return res.status(500).json({ error: err.code });
        })
      } else {
        return res.status(404).json({error: "The person you want to be friends is too far away!"});
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({error: err.code});
    })
  })
  .catch(err => {
    console.error(err);
    return res.status(500).json({ error: err.code });
  })
}

exports.removeFriend = (req, res) => {
  db.doc(`/users/${req.user.handle}`).get()
  .then(ourDoc => {

    if (ourDoc.data().friends.includes(`${req.params.userHandle}`)) {
      db.doc(`/users/${req.user.handle}`)
      .update({
        friends: ourDoc.data().friends.filter(friend => friend != `${req.params.userHandle}`)
      })
      .then(() => {
        db.doc(`/users/${req.params.userHandle}`).get()
        .then(friendDoc => {
          db.doc(`/users/${req.params.userHandle}`)
          .update({
            friends: friendDoc.data().friends.filter(friend => friend != `${req.user.handle}`)
          })
          .then(() => {
            return res.json({ friend: req.params.userHandle });
          })
          .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
          });
        })
        .catch(err => {
          console.error(err);
          return res.status(500).json({ error: err.code });
        })
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      })
    } else {
      return res.status(404).json({error: "The friend you want to remove is not in your friends list."});
    }
  })
  .catch(err => {
    console.error(err);
    return res.status(500).json({ error: err.code });
  })
}

exports.getFriends = (req, res) => {
  console.log("here");
  db.doc(`/users/${req.params.userHandle}`).get()
  .then(currentUser => {
    return res.json(currentUser.data().friends);
  })
  .catch(err => {
    console.log(err);
    return res.status(500).json({ error: err.code });
  })
}
