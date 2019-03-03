import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import axios from 'axios';
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'

import ArticleCard from '../components/ArticleCard'
import Snacky from '../components/Snacky'

const styles = () => ({
    root: {
        color: 'cyan',
    },
    gridContainer: {
        padding: "20px 10px",
    },
    authorContainer: {
    }
})

class Article extends Component {
    constructor(props) {
        super(props)
        this.state = {
            featuredPosts: [],
            isFetching: true,
            snackyOpen: false,
            snackyMessage: 'Just saying Hi!',
            snackyErrorType: false,
        }
    }

    componentDidMount() {
        var dpsu = this.props.match.params.dpsu
        var url = dpsu ? `/api/bytes?dpsu=${dpsu}` : `/api/bytes`
        axios.get(url)
            .then(res => {
                this.setState({
                    featuredPosts: res.data
                })
            })
            .catch(err => {
                console.log(err);
                this.callSnacky(err.response.data.error, true)
            })
            .finally(() => {
                this.setState({
                    isFetching: false
                })
            })
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.match.params.dpsu !== prevProps.match.params.dpsu) {
            this.fetchData();
        }
    }

    fetchData = () => {
        this.setState({
            isFetching: true
        })
        var dpsu = this.props.match.params.dpsu
        var url = dpsu ? `/api/bytes?dpsu=${dpsu}` : `/api/bytes`
        axios.get(url)
            .then(res => {
                this.setState({
                    featuredPosts: res.data
                })
            })
            .catch(err => {
                console.log(err);
                this.callSnacky(err.response.data.error, true)
            })
            .finally(() => {
                this.setState({
                    isFetching: false
                })
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
        const { classes } = this.props
        const { featuredPosts, isFetching } = this.state

        return (isFetching ? <LinearProgress />
            :
            <div>
                {featuredPosts.length !== 0 &&
                    <Grid container direction='column' spacing={16} className={classes.gridContainer}>
                        {featuredPosts.map((post, i) => (
                            <ArticleCard key={i} post={post} />
                        ))}
                    </Grid>
                }
                {featuredPosts.length === 0 &&
                    <Typography style={{ textAlign: 'center', margin: 16, fontSize: 20, }} >
                        {'No articles'}
                    </Typography>
                }

                {/* Lo and behold the legendary Snacky - Conveyor of the good and bad things, clear and concise */}
                <Snacky message={this.state.snackyMessage} open={this.state.snackyOpen} onClose={this.handleSnackyClose} error={this.state.snackyErrorType} />
            </div>
        )
    }
}

Article.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Article);