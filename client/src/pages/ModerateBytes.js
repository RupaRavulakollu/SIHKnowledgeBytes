import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import axios from 'axios';

import ArticleCard from '../components/ArticleCard'

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
        }
    }

    componentDidMount() {
        axios.get('/api/bytes/moderation')
            .then(res => {
                this.setState({
                    bytes: res.data,
                })
            })
    }

    render() {
        var { bytes } = this.state
        var { classes } = this.props
        return (
            <Grid container direction='column' spacing={24} className={classes.gridContainer}>
                {bytes.map((post, i) => (
                    <ArticleCard key={i} post={post} moderation/>
                ))}
            </Grid>)
    }
}

export default withStyles(styles)(ModerateBytes)