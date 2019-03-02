import React, { Component } from 'react';
import Link from 'react-router-dom/Link'
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    container: {
        margin: 'auto',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        height: '100%',
    },
    routeButton: {
        margin: 'auto 16px',
        height: '25%',
        width: '25%',
    }
})

class ModeratorHome extends Component {

    render() {
        const { classes } = this.props

        return (
            <div className={classes.container}>
                <Button variant='outlined' color='primary' className={classes.routeButton}
                    component={Link}
                    to={{ pathname: '/resources' }}>
                    {'Resources'}
                </Button>
                <Button variant='outlined' color='secondary' className={classes.routeButton}
                    component={Link}
                    to={{ pathname: '/trending' }}>
                    {'Bytes'}
                </Button>
            </div>
        )
    }
}

export default withStyles(styles)(ModeratorHome)