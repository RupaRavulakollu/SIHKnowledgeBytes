import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Hidden from '@material-ui/core/Hidden';
import Icon from "@material-ui/core/Icon";

import Search from '@material-ui/icons/SearchRounded';
import Add from '@material-ui/icons/Add';

import Home from './pages/Home'
import Article from './pages/Article'

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
    tabsRoot: {
        borderBottom: '1px solid #e8e8e8',
    },
    tabsIndicator: {
        backgroundColor: '#1890ff',
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
            color: '#40a9ff',
            opacity: 1,
        },
        '&$tabSelected': {
            color: '#1890ff',
            fontWeight: theme.typography.fontWeightMedium,
        },
        '&:focus': {
            color: '#40a9ff',
        },
    },
    tabSelected: {},
    typography: {
        padding: theme.spacing.unit * 3,
    },
});

class NavigationPane extends Component {
    state = {
        value: 0,
    };

    handleChange = (event, value) => {
        this.setState({ value });
    };

    logout = () => {
        axios.post('/api/logout')
            .then(res => {
                window.userDetails = null
                window.location = '/'
            })
    }

    render() {
        const { classes } = this.props;
        const { value } = this.state;

        return (
            <Router>
                <div className={classes.root}>
                    <div className={classes.topBar}>
                        <Typography className={classes.title} title={"Knowledge Bytes"}>
                            {"Knowledge Bytes"}
                        </Typography>

                        <Icon className={classes.newButton} title={"New Byte"}>
                            <Add />
                        </Icon>

                        <div className={classes.search} title={"Search"}>
                            <IconButton className={classes.iconButton} aria-label="Search">
                                <Search />
                            </IconButton>
                            <Hidden mdDown>
                                <InputBase className={classes.input} placeholder="Search" />
                            </Hidden>
                        </div>

                        <Avatar alt="User Actions"
                            title={'Log out'}
                            src="https://cdn-images-1.medium.com/fit/c/64/64/0*lapz1Su8bYyvSYOg"
                            className={classes.avatar}
                            onClick={this.logout} />
                    </div>
                    <Tabs
                        variant='scrollable'
                        scrollButtons='auto'
                        value={value}
                        onChange={this.handleChange}
                        classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
                    >
                        <Tab
                            component={Link}
                            to='/'
                            disableRipple
                            classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                            label="Home"
                            onClick={() => {
                                console.log("Home")
                            }}
                        />
                        <Tab
                            component={Link}
                            to='/article'
                            disableRipple
                            classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                            label="Category 1"
                            onClick={() => {
                                console.log("Category 1")
                            }}
                        />
                        <Tab
                            disableRipple
                            classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                            label="Category 2"
                        />
                        <Tab
                            disableRipple
                            classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                            label="Category 3"
                        />
                        <Tab
                            disableRipple
                            classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                            label="Category 4"
                        />
                        <Tab
                            disableRipple
                            classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                            label="Category 5"
                        />
                        <Tab
                            disableRipple
                            classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                            label="Category 6"
                        />
                        <Tab
                            disableRipple
                            classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                            label="Category 7"
                        />
                    </Tabs>
                    <main className={classes.content}>
                        <Switch>
                            <Route path="/" component={Home} exact />
                            <Route path="/article" component={Article} exact />
                        </Switch>
                    </main>
                </div>
            </Router>
        );
    }
}

NavigationPane.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavigationPane);