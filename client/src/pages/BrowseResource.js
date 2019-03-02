import React, { Component } from 'react';
import axios from 'axios'
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress'

import ResourceCard from '../components/ResourceCard'
import Snacky from '../components/Snacky'

const styles = theme => ({
    container: {
        margin: 'auto',
        height: '100%',
        display: "flex",
        flexWrap: "wrap",
    },
})

class BrowseResource extends Component {

    constructor(props) {
        super(props)
        this.state = {
            resources: [],
            loading: true,
            snackyOpen: false,
            snackyMessage: 'Just saying Hi!',
            snackyErrorType: false,
        }
    }

    componentDidMount() {
        axios.get('/api/resources')
            .then(res => {
                console.log(res.data)
                this.setState({
                    resources: res.data,
                })
            })
            .catch(err => {
                this.callSnacky(err.response.data.error, true)
            })
            .finally(() => {
                this.setState({
                    loading: false,
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

        return (
            <div>
                {!this.state.loading ?
                    <div className={classes.container}>
                        {this.state.resources.map(resource => {
                            return <ResourceCard resource={resource} key={resource.id} />
                        })}
                        {this.state.resources.length === 0 &&
                            <Typography variant="h5" style={{ margin: '10px auto', }}>{"No Resources auctioned yet"}</Typography>
                        }
                        <Snacky message={this.state.snackyMessage} open={this.state.snackyOpen} onClose={this.handleSnackyClose} error={this.state.snackyErrorType} />
                    </div>
                    :
                    <LinearProgress color='primary' />
                }
            </div>
        )
    }
}

export default withStyles(styles)(BrowseResource)