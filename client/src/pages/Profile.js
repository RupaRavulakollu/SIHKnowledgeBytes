import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import withStyles from '@material-ui/core/styles/withStyles';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid'
import axios from 'axios';

import Snacky from '../components/Snacky'
import ArticleCard from '../components/ArticleCard'


const styles = theme => ({
  avatar: {
    width: 150,
    height: 150,
    margin: 16
  },
  gridContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
      padding: '0 8px'
    }
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: 16
  },
  divider: {
    width: '60%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  userName: {
    margin: '4px 0',
    fontWeight: 400,
    fontSize: '20px',
    color: '#212121'
  },
  textStyle: {
    color: 'grey',
    fontSize: '16px',
    margin: '4px 0',
    fontWeight: 400,
  },
});

class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      featuredPosts: [],
      value: 0,
      snackyOpen: false,
      snackyMessage: 'Just saying Hi!',
      snackyErrorType: false,
    }
  }

  componentDidMount() {
    axios.get('/api/bytes/mine')
      .then(res => {
        console.log(res.data)
        this.setState({
          featuredPosts: res.data,
        })
      })
      .catch(err => {
        console.log("Error getting all bytes: ", err)
        if (err.response)
          this.callSnacky(err.response.data.error, true)
        else
          this.callSnacky('', true)
      })
  }

  callSnacky = (message, isError) => {
    if (isError && !message) {
      message = "Something's Wrong"
    }
    this.setState({
      snackyMessage: message,
      snackyOpen: true,
      snackyErrorType: isError,
    })
  }

  handleSnackyClose = (_event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ snackyOpen: false });
  };



  render() {

    const { classes } = this.props;
    const { featuredPosts } = this.state;
    const user = window.userDetails;


    return (
      <div>
        <div className={classes.gridContainer}>
          <Avatar alt="User Actions"
            src="https://ruparavulakollu.000webhostapp.com/images/avatar.jpg"
            className={classes.avatar}
          />
          <div className={classes.userInfo}>
            <h3 className={classes.userName}>{user.name}</h3>
            <h3 className={classes.textStyle}>{user.designation}</h3>
            <h3 className={classes.textStyle}>{user.dpsuName}</h3>
          </div>
        </div>
        <Divider className={classes.divider} style={{ margin: 'auto' }} />
        <Grid container direction='column' spacing={24} className={classes.gridContainer}>
          {featuredPosts.map((post, i) => (
            <ArticleCard key={i} post={post} mine />
          ))}
        </Grid>

        {/* Lo and behold the legendary Snacky - Conveyor of the good and bad things, clear and concise */}
        <Snacky message={this.state.snackyMessage} open={this.state.snackyOpen} onClose={this.handleSnackyClose} error={this.state.snackyErrorType} />
      </div>
    );
  }
}

export default withStyles(styles)(Profile);
