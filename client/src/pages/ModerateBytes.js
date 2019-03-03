import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import axios from 'axios';

import ArticleCard from '../components/ArticleCard'
import { LinearProgress, Typography } from '@material-ui/core';

const styles = theme => ({
    gridContainer: {
        padding: "20px 10px",
    },
})

class ModerateBytes extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bytes: [],
            showLoader: true,
        }
    }

    componentDidMount() {
        axios.get('/api/bytes/moderation')
            .then(res => {
                this.setState({
                    bytes: res.data,
                })
            })
            .finally(() => {
                this.setState({
                    showLoader: false,
                })
            })
    }

    render() {
        var { bytes, showLoader } = this.state
        var { classes } = this.props
        return (
            showLoader ? <LinearProgress /> :
                bytes.length === 0 ? <Typography variant='overline' style={{ fontSize: 20 }}>No articles for moderation</Typography> :
                    <Grid container direction='column' spacing={24} className={classes.gridContainer}>
                        {bytes.map((post, i) => (
                            <ArticleCard key={i} post={post} moderation />
                        ))}
                    </Grid>)
    }
}

export default withStyles(styles)(ModerateBytes)