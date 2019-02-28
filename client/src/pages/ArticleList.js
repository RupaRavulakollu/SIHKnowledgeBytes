import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

const styles = () => ({
    root: {
        color: 'cyan',
    },
})

class Article extends Component {

    render() {
        const { classes } = this.props

        return (
            <h1 className={classes.root}>{this.props.match.params.dpsu}</h1>
        )
    }
}

Article.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Article);