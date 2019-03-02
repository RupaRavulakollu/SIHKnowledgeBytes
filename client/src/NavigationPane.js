import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import axios from 'axios';
import PropTypes from 'prop-types';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Hidden from '@material-ui/core/Hidden';
import Button from "@material-ui/core/Button";

import Search from '@material-ui/icons/SearchRounded';
import Add from '@material-ui/icons/Add';

import Trending from './pages/Trending'
import NewByte from './pages/NewByte'
import Snacky from './components/Snacky'
import LinearProgress from "@material-ui/core/LinearProgress";
import Article from './pages/Article'

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        height: '100%',
    },
    topBar: {
        boxShadow: '0 4px 12px 0 rgba(0,0,0,.05)'
    },
    innerContainer: {
        display: 'flex',
        flexDirection: 'row',
        padding: 8,
        width: '75%',
        margin: 'auto',
        [theme.breakpoints.down("md")]: {
            width: '100%',
        }
    },
    avatar: {
        margin: 'auto 10px',
    },
    titleContainer: {
        flexGrow: '1',
    },
    title: {
        fontFamily: 'Merienda',
        fontSize: '36px',
        fontWeight: 'bold',
        width: 'fit-content',
        margin: 'auto 0',
        color: theme.palette.primary.main,
        [theme.breakpoints.down("md")]: {
            fontSize: '18px',
        },
        cursor: 'pointer',
        textDecoration: 'none',
    },
    search: {
        width: 275,
        margin: 'auto 0',
        [theme.breakpoints.down("md")]: {
            width: 'auto',
        },
        [theme.breakpoints.up("md")]: {
            border: '1px solid #0000008a',
            borderRadius: 4,
        }
    },
    newButton: {
        borderRadius: 24,
        minWidth: 36,
        width: 36,
        height: 36,
        padding: 0,
        margin: 'auto 16px'
    },
    input: {
        marginLeft: 8,
        flex: 1,
    },
    iconButton: {
        padding: 0,
        height: 36,
        width: 36,
    },
    typography: {
        padding: theme.spacing.unit * 3,
    },
    content: {
        width: '75%',
        margin: 'auto',
        [theme.breakpoints.down("md")]: {
            width: '100%',
        }
    }
});

class NewBytePreLoader extends Component {
    componentDidMount() {
        axios.post('/api/drafts', {})
            .then(res => {
                this.props.history.push(`/new-byte/${res.data.id}`)
            })
            .catch(err => {
                console.log("Error creating draft: ", err)
                this.callSnacky(err.response.data.error, true)
            })
    }

    render() {
        return <LinearProgress color='primary' />
    }
}

class NavigationPane extends Component {

    constructor(props) {
        super(props)
        this.state = {
            snackyOpen: false,
            snackyMessage: 'Just saying Hi!',
            snackyErrorType: false,
            showSearchAndNew: !window.location.pathname.toLowerCase().includes('new-byte'),
        }
    }

    componentDidMount() {
        this.setState({
            showSearchAndNew: !window.location.pathname.toLowerCase().includes('new-byte')
        })
    }

    logout = () => {
        axios.post('/api/logout')
            .then(res => {
                window.userDetails = null
                window.location = '/'
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
    hideSearchAndNew = () => {
        this.setState({
            showSearchAndNew: false
        })
    }

    showSearchAndNew = () => {
        this.setState({
            showSearchAndNew: true
        })
    }

    render() {
        const { classes } = this.props;
        const { showSearchAndNew } = this.state

        return (
            <Router>
                <div className={classes.root}>
                    <div className={classes.topBar}>
                        <div className={classes.innerContainer}>
                            <div className={classes.titleContainer}>
                                <Typography className={classes.title} title={"Knowledge Bytes"}
                                    component={Link} to='/trending'
                                    onClick={this.showSearchAndNew}>
                                    {"Knowledge Bytes"}
                                </Typography>
                            </div>
                            {showSearchAndNew &&
                                <Button title={"New Byte"} variant='outlined'
                                    classes={{
                                        outlined: classes.newButton
                                    }}
                                    color='primary'
                                    component={Link} to='/new-byte'
                                    onClick={this.hideSearchAndNew}>
                                    <Add />
                                </Button>
                            }
                            {showSearchAndNew &&
                                <div className={classes.search} title={"Search"}>
                                    <IconButton className={classes.iconButton} aria-label="Search">
                                        <Search />
                                    </IconButton>
                                    <Hidden mdDown>
                                        <InputBase className={classes.input} placeholder="Search" />
                                    </Hidden>
                                </div>
                            }

                            <Avatar alt="User Actions"
                                title={'Log out'}
                                src="https://cdn-images-1.medium.com/fit/c/64/64/0*lapz1Su8bYyvSYOg"
                                className={classes.avatar}
                                onClick={this.logout} />
                        </div>
                    </div>
                    <main className={classes.content}>
                        <Switch>
                            <Route exact path="/" render={() => (<Redirect to="/trending" />)} />
                            <Route exact path="/home" render={() => (<Redirect to="/trending" />)} />
                            <Route path="/trending" render={(props) => (<Trending  {...props} showSearchAndNew={this.showSearchAndNew} />)} />
                            <Route path="/byte/:id" component={Article} exact />
                            <Route path="/new-byte" component={NewBytePreLoader} exact />
                            <Route path="/new-byte/:id" component={NewByte} />
                        </Switch>
                    </main>
                    {/* Lo and behold the legendary Snacky - Conveyor of the good and bad things, clear and concise */}
                    <Snacky message={this.state.snackyMessage} open={this.state.snackyOpen} onClose={this.handleSnackyClose} error={this.state.snackyErrorType} />
                </div>
            </Router >
        );
    }
}

NavigationPane.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NavigationPane);