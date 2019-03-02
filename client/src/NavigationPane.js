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
import Icon from "@material-ui/core/Icon";

import Search from '@material-ui/icons/SearchRounded';
import Add from '@material-ui/icons/Add';

import Trending from './pages/Trending'
import NewByte from './pages/NewByte'
import Snacky from './components/Snacky'
import LinearProgress from "@material-ui/core/LinearProgress";

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        height: '100%',
        width: '75%',
        margin: 'auto',
        [theme.breakpoints.down("md")]: {
            width: '100%',
        }
    },
    topBar: {
        display: 'flex',
        flexDirection: 'row',
        padding: 8
    },
    avatar: {
        margin: 'auto 10px',
    },
    title: {
        fontFamily: 'Work Sans',
        fontSize: '24px',
        fontWeight: '500',
        margin: 'auto 0',
        flexGrow: '1',
        [theme.breakpoints.down("md")]: {
            fontSize: '18px',
        }
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
        margin: 'auto 16px',
        cursor: 'pointer',
        color: '#0000008a',
        '&:hover': {
            color: '#1890ff',
        }
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
        }
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

    render() {
        const { classes } = this.props;

        return (
            <Router>
                <div className={classes.root}>
                    <div className={classes.topBar}>
                        <Typography className={classes.title} title={"Knowledge Bytes"}>
                            {"Knowledge Bytes"}
                        </Typography>

                        <Icon className={classes.newButton} title={"New Byte"} component={Link} to='/new-byte'>
                            <Add />
                        </Icon>
                        {window.location.pathname.toLowerCase().includes('trending') &&
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
                    <main className={classes.content}>
                        <Switch>
                            <Route exact path="/" render={() => (<Redirect to="/trending" />)} />
                            <Route exact path="/home" render={() => (<Redirect to="/trending" />)} />
                            <Route path="/trending" component={Trending} />
                            <Route path="/article" component={() => '<h3>Article</h3>'} exact />
                            <Route path="/new-byte" component={NewBytePreLoader} exact />
                            <Route path="/new-byte/:id" component={NewByte} />
                        </Switch>
                    </main>
                    {/* Lo and behold the legendary Snacky - Conveyor of the good and bad things, clear and concise */}
                    <Snacky message={this.state.snackyMessage} open={this.state.snackyOpen} onClose={this.handleSnackyClose} error={this.state.snackyErrorType} />
                </div>
            </Router>
        );
    }
}

NavigationPane.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NavigationPane);