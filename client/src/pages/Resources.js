import React, { Component } from 'react'
import Link from 'react-router-dom/Link'
import withStyles from '@material-ui/core/styles/withStyles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { Route } from 'react-router';
import BrowseResource from './BrowseResource';
import Dashboard from './Dashboard';

const styles = theme => ({
    container: {
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: 8,
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
    tabContainer: {
        flexGrow: 1
    },
})

class Resources extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: 0,
        }
    }

    handleChange = (event, value) => {
        this.setState({ value });
    };

    componentDidMount() {
        this.props.hideSearchAndNew()
        this.setState({
            value: window.location.pathname.includes('browse') ? 1 : 0,
        })
    }

    render() {
        const { classes } = this.props
        const { value } = this.state

        return (
            <div className={classes.container}>
                <Tabs
                    variant='fullWidth'
                    value={value}
                    onChange={this.handleChange}
                    classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
                >
                    <Tab
                        component={Link}
                        to={`${this.props.match.path}`}
                        disableRipple
                        classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                        label={'Dashboard'}
                    />
                    <Tab
                        component={Link}
                        to={`${this.props.match.path}/browse`}
                        disableRipple
                        classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                        label={'Browse'}
                    />
                </Tabs>
                <main className={classes.tabContainer}>
                    <Route exact path={`${this.props.match.path}/browse`} component={BrowseResource} />
                    <Route exact path={`${this.props.match.path}`} component={Dashboard} />
                </main>
            </div>
        )
    }
}

export default withStyles(styles)(Resources)