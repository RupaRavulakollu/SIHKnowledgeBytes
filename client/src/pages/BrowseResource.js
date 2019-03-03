import React, { Component } from 'react';
import axios from 'axios'
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress'

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import ViewModule from '@material-ui/icons/ViewModuleRounded';
import TableChart from '@material-ui/icons/TableChartRounded';

import ResourceCard from '../components/ResourceCard'
import Snacky from '../components/Snacky'
import ResourceTable from '../components/ResourceTable'

const styles = theme => ({
    container: {
        margin: 'auto',
        height: '100%',
        display: "flex",
        flexWrap: "wrap",
    },
    toggleContainer: {
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        margin: `${theme.spacing.unit}px 0`,
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
            view: 'table',
        }
    }

    componentDidMount() {
        axios.get('/api/resources')
            .then(res => {
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

    handleView = (event, view) => {
        this.setState({
            view: view
        })
    }

    render() {
        const { classes } = this.props
        const { view } = this.state

        return (
            !this.state.loading ?
                <div>
                    <div className={classes.toggleContainer}>
                        <ToggleButtonGroup value={view} exclusive onChange={this.handleView}>
                            <ToggleButton value="table">
                                <TableChart />
                            </ToggleButton>
                            <ToggleButton value="grid">
                                <ViewModule />
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                    {view === 'grid' &&
                        <div className={classes.container}>
                            {this.state.resources.map(resource => {
                                return <ResourceCard resource={resource} key={resource.id} self />
                            })}
                        </div>
                    }
                    {view === 'table' &&
                        <ResourceTable resources={this.state.resources} />
                    }
                    <div className={classes.container}>
                        {this.state.resources.length === 0 &&
                            <Typography variant="h5" style={{ margin: '10px auto', textAlign: 'center', }}>{"No Resources auctioned yet"}</Typography>
                        }
                        <Snacky message={this.state.snackyMessage} open={this.state.snackyOpen} onClose={this.handleSnackyClose} error={this.state.snackyErrorType} />
                    </div>
                </div>
                :
                <LinearProgress color='primary' />

        )
    }
}

export default withStyles(styles)(BrowseResource)