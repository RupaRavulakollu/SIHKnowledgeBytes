import React, { Component } from 'react';
import axios from 'axios';
import { Route, Link } from "react-router-dom";
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid'

import ArticleList from './ArticleList'
import ArticleCard from '../components/ArticleCard'
import Snacky from '../components/Snacky'

const styles = theme => ({
  gridContainer: {
    padding: "20px 10px",
  },

  tabsRoot: {
    borderBottom: '1px solid #e8e8e8',
  },
  tabsIndicator: {
    backgroundColor: theme.palette.secondary.main,
  },
  tabRoot: {
    textTransform: 'initial',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing.unit * 4,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      color: theme.palette.primary.main,
      opacity: 1,
    },
    '&$tabSelected': {
      color: theme.palette.primary.main,
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: theme.palette.primary.main,
    },
  },
  tabSelected: {},
});

class Trending extends Component {

  constructor(props) {
    super(props);
    this.state = {
      featuredPosts: [],
      value: 0,
      dpsus: ['hal', 'bel', 'bdl', 'beml', 'midhani', 'mdl', 'grse', 'gsl', 'hsl'],
      snackyOpen: false,
      snackyMessage: 'Just saying Hi!',
      snackyErrorType: false,
    }
  }

  componentDidMount() {
    this.props.showSearchAndNew()
    var index = this.state.dpsus.findIndex(d => d === window.location.pathname.replace('/trending/', ''))
    this.setState({
      value: index + 1,
    })
    axios.get('/api/bytes')
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

  handleChange = (event, value) => {
    this.setState({ value });
  };

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
    const { classes } = this.props
    const { value, featuredPosts } = this.state

    return (
      <div>
        <Tabs
          variant='scrollable'
          scrollButtons='auto'
          value={value}
          onChange={this.handleChange}
          classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
        >
          <Tab
            component={Link}
            to={`/trending`}
            disableRipple
            classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
            label="HOME"
          />
          {this.state.dpsus.map(dpsu => {
            return <Tab
              key={dpsu}
              component={Link}
              to={`${this.props.match.path}/${dpsu}`}
              disableRipple
              classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
              label={`${dpsu}`.toUpperCase()}
            />
          })}
        </Tabs>
        <main>
          <Route path={`${this.props.match.path}/:dpsu`} component={ArticleList} />
          <Route exact path={`${this.props.match.path}`} render={() => {
            return <Grid container direction='column' spacing={24} className={classes.gridContainer}>
              {featuredPosts.map((post, i) => (
                <ArticleCard key={i} post={post} />
              ))}
            </Grid>
          }} />
        </main>
        {/* Lo and behold the legendary Snacky - Conveyor of the good and bad things, clear and concise */}
        <Snacky message={this.state.snackyMessage} open={this.state.snackyOpen} onClose={this.handleSnackyClose} error={this.state.snackyErrorType} />
      </div>
    );
  }
}

Trending.propTypes = {
  classes: PropTypes.object.isRequired,
  showSearchAndNew: PropTypes.func.isRequired
};

export default withStyles(styles)(Trending);
