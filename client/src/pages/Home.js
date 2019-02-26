import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

const styles = theme => ({
    root: {
        color: 'red',
    },
})

class Home extends Component {

    render() {
        const { classes } = this.props

        return (
            <h1 className={classes.root}>Home</h1>
        )
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);