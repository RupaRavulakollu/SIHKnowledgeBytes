import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

const styles = theme => ({
    root: {
        color: 'cyan',
    },
})

class Article extends Component {

    render() {
        const { classes } = this.props

        return (
            <h1 className={classes.root}>Article</h1>
        )
    }
}

Article.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Article);