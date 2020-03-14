import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';

import Scream from '../components/scream/Scream';
import Profile from '../components/profile/Profile';
import ScreamSkeleton from '../util/ScreamSkeleton';
import MusicPlayer from 'react-responsive-music-player';

import { connect } from 'react-redux';
import { getScreams } from '../redux/actions/dataActions';
import axios from 'axios';

const imageUrl = 'https://firebasestorage.googleapis.com/v0/b/bluebook-5f792.appspot.com/o/Music.JPG?alt=media&token=32249b58-fd5e-4988-aa9c-ba86c7db1cbe';

const styles = {

};

class home extends Component {
  componentDidMount() {
    this.props.getScreams();
    axios.get('/playlist').then(res => {
      this.setState({
          playlist: res.data
      })

      let recentPlaylist = [];
      recentPlaylist = this.state.playlist.map((music) => {
        // music contains: audioId, userHandle, audioName, musicUrl, audioAuthor
        let piece = {};
        piece.url = music.musicUrl;
        piece.cover = imageUrl;
        piece.title = music.audioName;
        piece.artist = [];
        piece.artist.push(music.audioAuthor);
        return piece;
      })

      this.setState({
        finalList: recentPlaylist,
        startPlay: true
      })
      console.log(recentPlaylist);

    }).catch(err => console.log(err));
  }

  constructor() {
    super();
    this.state = {
        playlist: [],
        gotData: false,
        startPlay: false,
        finalList: []
    }
  }



  render() {
    const { screams, loading } = this.props.data;

    //let recentPlaylist = [];
    // recentPlaylist = gotData ? (this.state.playlist.map((music) => {
    //   // music contains: audioId, userHandle, audioName, musicUrl, audioAuthor
    //   let piece = {};
    //   piece.url = music.musicUrl;
    //   piece.cover = imageUrl;
    //   piece.title = music.audioName;
    //   piece.artist = music.audioAuthor;
    //   return piece;
    // })) : (console.log('hi'));
    
    

    let recentScreamsMarkup = !loading ? (
      screams.map((scream) => <Scream key={scream.screamId} scream={scream} />)
    ) : (
      <ScreamSkeleton />
    );
    return (
      <Grid container spacing={16}>
        <Grid item sm={8} xs={12}>
          {recentScreamsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile />
          <br/>
          <br/>
          {this.state.startPlay && (
              <MusicPlayer mode='vertical' playlist={this.state.finalList} />
          )}
        </Grid>
      </Grid>
    );
  }
}

home.propTypes = {
  getScreams: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  data: state.data
});

export default connect(
  mapStateToProps,
  { getScreams }
)(home);
