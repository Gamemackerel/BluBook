import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ScreamSkeleton from '../util/ScreamSkeleton';

import Music from '../components/scream/Music';
import CircularProgress from '@material-ui/core/CircularProgress';
import MusicUpload from '../components/profile/MusicUpload';
import { Container, Section, Bar } from 'react-simple-resizer';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';



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
    container: {
        textAlign:'center',
        position: 'relative'
    },
    button: {
        marginTop: 20,
        position: 'relative'
    }
}


class musicroom extends Component {
    componentDidMount() {
        axios.get('/playlist').then(res => {
            this.setState({
                playlist: res.data
            })
        }).catch(err => console.log(err));
    }

    constructor() {
        super();
        this.state = {
            musicname: '',
            musicauthor: '',
            musicpic: '',
            playlist: [],
            loading: false,
            errors: {}
        }
    }

    refreshPage() {
        window.location.reload(false);
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({
            loading: true
        });
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        const { classes } = this.props;
 
        let recentPlaylist = this.state.playlist ? (
            this.state.playlist.map((music) => 
                <Music key={music.audioId} music={music} />)) : (<Typography>Loading...Please wait</Typography>)

        return (
            <Container style={{ height: '1000px' }} className={classes.container}>
                <Section style={{ background: '#d3d3d3' }} size={1200}> 
                    <Paper variant='outlined' style={{height: 960, overflow: 'auto', textAlign: 'left', margin: '20px auto 20px auto'}}>
                        
                        <List>
                            {recentPlaylist}
                        </List>
                    </Paper>
                </Section>    

                <Bar size={10} style={{ background: '#888888', cursor: 'col-resize' }} />
                <Section style={{ background: '#d3d3d3' }} size={300}>
                    <MusicUpload/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>                    
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <Typography>Click the below button to see your newly uploaded song in the playlist.</Typography>
                    <button className={classes.button} onClick={this.refreshPage}>Refresh the playlist!</button>
                </Section>
            </Container>
        )
    }
}

musicroom.propTypes = {
    classes: PropTypes.object.isRequired,
    getAllMusic: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
};
  
const mapStateToProps = (state) => ({
    data: state.data
});
  
  //export default connect(mapStateToProps)(musicroom);
  export default withStyles(styles)(musicroom);


  