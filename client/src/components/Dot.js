import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types';

const styles = theme => ({
    dot: {
        background: theme.palette.primary.dark,
        width: 8,
        height: 8,
        borderRadius: '50%',
        margin: '0 8px'
    }
})

class Dot extends Component {
    render() {
        const { classes } = this.props

        return (
            <div className={classes.dot} />
        )
    }
}

Dot.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Dot)