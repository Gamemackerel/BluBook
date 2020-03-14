import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import axios from 'axios';
// MUI Stuff
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
// Redux stuff
import { connect } from 'react-redux';
import { postMusic, clearErrors } from '../../redux/actions/dataActions';

const styles = {
  form: {
      textAlign: 'center'
  },
  pageTitle: {
      margin: '20px auto 20px auto'
  },
  textField: {
      margin: '10px auto 10px auto'
  },
  button: {
      marginTop: 20,
      position: 'relative'
  },
  customError: {
      color: 'red',
      fontSize: '0.8rem',
      marginTop: 10
  },
  progress: {
      position: 'absolute'
  },
  inputIcon: {
      marginTop: 20,
      marginLeft: 80,
      position: 'relative'    
  }
}

class MusicUpload extends Component {
  constructor() {
      super();
      this.state = {
          musicname: '',
          musicauthor: '',
          userhandle: '',
          loading: false,
          body: {},
          errors: {},
          clicked: true
      }
  }

  handleSubmit = (event) => {
      event.preventDefault();
      this.setState({
          loading: true
      });

      const music = this.state.body; 
      const musicName = this.state.musicname;
      const musicAuthor = this.state.musicauthor; 
      const handle = this.state.userhandle;
      const formData = new FormData();
      
      formData.append('audio', music, music.name);
      //this.props.postMusic(formData);

      axios.post('/user/music1', formData,
      {headers: {'Content-Type': 'application/json', 'handle': handle, 'name': musicName, 'author': musicAuthor}}
      )
          .then(res => {
              console.log(res.data);
              this.setState({
                  loading: false
              });
          }).catch(err => {
              this.setState({
                  errors: err.response.data,
                  loading: false
              })
          })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({
        errors: nextProps.UI.errors
      });
    }
    if (!nextProps.UI.errors && !nextProps.UI.loading) {
      this.setState({ body: '', open: false, errors: {} });
    }
  }

  handleChangeMusic = (event) => {
    this.setState({ 
      body: event.target.files[0]
    });

    if (event.target.files[0] === undefined) {
      this.setState({ 
        clicked: true
      });
    } else {
      this.setState({ 
        clicked: false
      });
    }
  };

  handleChange = (event) => {
    this.setState({
        [event.target.name]: event.target.value
    });
  }

  render() {
    const { classes } = this.props;
    const {errors, loading } = this.state;

    const enabled = this.state.clicked || loading;

    return (
      <Fragment>
          <div>
          <Grid container className={classes.form}>
                <Grid item sm/>
                <Grid item sm/>
                <Grid item sm>
                    <br/>
                    <Typography variant="h3" className={classes.pageTitle}>  
                    Upload your music!
                    </Typography>
                    <form noValidate onSubmit={this.handleSubmit}>
                        <TextField 
                            id="musicname" 
                            name="musicname" 
                            type="musicname" 
                            label="Music Name" 
                            helperText={errors.musicname}
                            error={errors.musicname ? true : false}
                            className={classes.textField} 
                            value={this.state.musicname} 
                            onChange={this.handleChange} 
                            fullwidth 
                        />
                        <br/>
                        <TextField 
                            id="musicauthor" 
                            name="musicauthor" 
                            type="musicauthor" 
                            label="Music Author" 
                            helperText={errors.musicauthor}
                            error={errors.musicauthor ? true : false}
                            className={classes.textField} 
                            value={this.state.musicauthor} 
                            onChange={this.handleChange} 
                            fullwidth 
                        />
                        <br/>
                        <TextField 
                            id="userhandle" 
                            name="userhandle" 
                            type="userhandle" 
                            label="Your Cool Name" 
                            helperText={errors.userhandle}
                            error={errors.userhandle ? true : false}
                            className={classes.textField} 
                            value={this.state.userhandle} 
                            onChange={this.handleChange} 
                            fullwidth 
                        />
                        <br/>
                        <input className={classes.inputIcon}
                          name="body"
                          type="file"
                          helperText={errors.fileselect}
                          error={errors.fileselect ? true : false}
                          onChange={this.handleChangeMusic}
                        />
                        <br/>
                        {this.state.clicked && (
                            <Typography variant="body2" className={classes.customError}>
                                Please select a mp3 file to upload. 
                            </Typography>
                        )}
                        <br/>                        
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            disabled={enabled}
                            >
                            Submit this music
                            {loading && (
                                <CircularProgress size={30} className={classes.progress} />
                            )}
                        </Button>
                        <br />
                        {this.state.loading && (
                            <Typography variant="body2" className={classes.customError}>
                                Please wait the upload to finish before attempting to submit another song.
                            </Typography>
                        )}
                    </form>
                </Grid>                    
            </Grid>
          </div>
      </Fragment>
    );
  }
}

MusicUpload.propTypes = {
  postMusic: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired,
  body: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  UI: state.UI
});

export default connect(
  mapStateToProps,
  { postMusic, clearErrors }
)(withStyles(styles)(MusicUpload));
