import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import withStyles from '@material-ui/core/styles/withStyles';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid'
import axios from 'axios';
import ArticleCard from '../components/ArticleCard'


const styles = theme => ({
  avatar: {
    margin: '50px',
    width: 150,
    height: 150,
    marginLeft: '200px',
  },
  container: {
    alignItems: 'center',
    display: 'flex',

  },
  divider: {
    width: '600px',
    marginLeft: '150px',
  },

  textStyle: {
    color: 'grey',
    fontStyle: 'italic',
    fontSize: '15px',
  },
  gridContainer: {
    padding: "20px 10px",
    marginLeft:'150px',
  },
});

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      featuredPosts: [],
      value: 0,
      //dpsus: ['hal', 'bel', 'bdl', 'beml', 'midhani', 'mdl', 'grse', 'gsl', 'hsl'],
      snackyOpen: false,
      snackyMessage: 'Just saying Hi!',
      snackyErrorType: false,
    }
  }

  componentDidMount() {
    axios.get('/api/bytes/mine')
      .then(res => {
        this.setState({
          featuredPosts: res.data,
        })
      })
      .catch(err => {
        console.log("Error getting all bytes: ", err)
        this.callSnacky(err.response.data.error, true)
      })

  }



  render() {

    const { classes } = this.props;
    const { featuredPosts } = this.state;
    const user = window.userDetails;


    return (

      <div>
        <div className={classes.container}>

          <div>
            <Avatar alt="User Actions"
              src="https://ruparavulakollu.000webhostapp.com/images/avatar.jpg"
              className={classes.avatar}
            />

          </div>
          <div>
            <h1>{user.name}</h1>
            <h3 className={classes.textStyle}>{user.designation}</h3>
            <h3 className={classes.textStyle}>{user.dpsuName}</h3>

          </div>

        </div>
        <Divider className={classes.divider} />
        <Grid container direction='column' spacing={24} className={classes.gridContainer}>
          {featuredPosts.map((post, i) => (
            <ArticleCard key={i} post={post} mine/>
          ))}
        </Grid>
      </div>


    );
  }
}

export default withStyles(styles)(App);
