import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
// MUI Stuff
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
// Redux
import { connect } from 'react-redux';

const imageUrl = 'https://firebasestorage.googleapis.com/v0/b/bluebook-5f792.appspot.com/o/Music.JPG?alt=media&token=32249b58-fd5e-4988-aa9c-ba86c7db1cbe';

const styles = {
  card: {
    position: 'relative',
    display: 'flex',
    marginBottom: 20
  },
  image: {
    minWidth: 200
  },
  content: {
    padding: 25,
    objectFit: 'cover'
  }
};

class Music extends Component {
  render() {
    const {
      classes,
      music: {
        audioId,
        userHandle,
        audioName,
        musicUrl,
        audioAuthor
      },
      user: {
        authenticated,
        credentials: { handle }
      }
    } = this.props;

    // const deleteButton =
    //   authenticated && userHandle === handle ? (
    //     <DeleteScream screamId={screamId} />
    //   ) : null;
    return (
      <Card className={classes.card}>
        <CardMedia
          image={imageUrl}
          title={audioName}
          className={classes.image}
        />
        <CardContent className={classes.content}>
          <Typography
            variant="h5"
            color="primary"
          >
            {audioName}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Uploaded by:
          </Typography>
          <Typography
            variant="body1"
            component={Link}
            to={`/users/${userHandle}`}
            color="primary"
          >
            {userHandle}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Audio Author:
          </Typography>
          <Typography variant="body1">{audioAuthor}</Typography>
        </CardContent>
      </Card>
    );
  }
}

Music.propTypes = {
  user: PropTypes.object.isRequired,
  music: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(Music));
