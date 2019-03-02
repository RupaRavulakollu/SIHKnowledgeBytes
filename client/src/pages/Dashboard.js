import React, { Component } from 'react';
import axios from 'axios'
import withStyles from '@material-ui/core/styles/withStyles';
import Fab from '@material-ui/core/Fab';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { InlineDatePicker } from 'material-ui-pickers';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress'

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import Add from '@material-ui/icons/Add';
import ViewModule from '@material-ui/icons/ViewModuleRounded';
import TableChart from '@material-ui/icons/TableChartRounded';

import Snacky from '../components/Snacky'
import ResourceCard from '../components/ResourceCard'
import ResourceTable from '../components/ResourceTable'

const styles = theme => ({
    container: {
        margin: 'auto',
        height: '100%',
        display: 'flex',
        flexWrap: 'wrap',
    },
    newResButton: {
        position: 'fixed',
        bottom: 16,
        right: 16,
        margin: "8px 0",
    },
    toggleContainer: {
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        margin: `${theme.spacing.unit}px 0`,
    },
})

const rtypes = [
    {
        value: "infra",
        label: "Infrastructure"
    },
    {
        value: "human",
        label: "Human"
    }
];

class Dashboard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            resources: [],
            loading: true,
            snackyOpen: false,
            snackyMessage: 'Just saying Hi!',
            snackyErrorType: false,
            newResourceDialogOpen: false,
            name: '',
            description: '',
            duration: '',
            rtype: '',
            basePrice: 0,
            deadline: Date.now(),
            addingNew: false,
            view: 'table'
        }
    }

    componentDidMount() {
        axios.get('/api/resources/live')
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

    openNewResourceDialog = () => {
        this.setState({
            newResourceDialogOpen: true
        })
    }

    closeNewResourceDialog = () => {
        this.setState({
            newResourceDialogOpen: false
        })
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };

    handleDateChange = date => {
        date.setHours(23)
        date.setMinutes(59)
        date.setSeconds(59)
        date.setMilliseconds(999)
        this.setState({ deadline: date.getTime() });
    };

    addNewResource = () => {
        this.setState({
            addingNew: true
        })
        var body = {
            name: this.state.name,
            description: this.state.description,
            type: this.state.rtype,
            duration: this.state.duration,
            basePrice: this.state.basePrice,
            deadline: this.state.deadline
        }
        axios.post('/api/resources/', body)
            .then(res => {
                this.setState({
                    resources: this.state.resources.concat([res.data]),
                    newResourceDialogOpen: false,
                })
                this.callSnacky('Success')
            })
            .catch(err => {
                console.log(err);
                this.callSnacky(err.response.data.err, true)
            })
            .finally(() => {
                this.setState({
                    addingNew: false
                })
            })
    }

    render() {
        const { classes } = this.props
        const { view } = this.state

        return (
            this.state.loading ?
                <LinearProgress color='primary' />
                :
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
                        <ResourceTable resources={this.state.resources} self />
                    }
                    {this.state.resources.length === 0 &&
                        <Typography variant="h5" style={{ margin: '10px auto', }}>{"No Resources auctioned yet"}</Typography>
                    }
                    {/* FAB to add new resource in a DPSU */}
                    <Fab size='medium' color='primary' className={classes.newResButton} onClick={this.openNewResourceDialog} >
                        <Add />
                    </Fab>

                    {/* Dialog to add new resource in a DPSU*/}
                    <Dialog open={this.state.newResourceDialogOpen}
                        fullWidth
                        onClose={this.closeNewResourceDialog}>
                        <DialogTitle>
                            {'New Resource'}
                        </DialogTitle>
                        <DialogContent>
                            <TextField variant='outlined' label='Name'
                                onChange={this.handleChange("name")}
                                margin="normal"
                                fullWidth />
                            <TextField variant='outlined' label='Description' multiline
                                onChange={this.handleChange("description")}
                                margin="normal"
                                fullWidth />
                            <TextField variant='outlined' label='Duration'
                                onChange={this.handleChange("duration")}
                                margin="normal"
                                fullWidth
                            />
                            <TextField variant='outlined' label='Base Price'
                                onChange={this.handleChange("basePrice")}
                                margin="normal"
                                fullWidth
                            />
                            <TextField
                                id="rtype"
                                select
                                variant='outlined'
                                label="Resource Type"
                                value={this.state.rtype}
                                onChange={this.handleChange("rtype")}
                                margin="normal"
                                fullWidth
                            >
                                {rtypes.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <div className="picker"
                                style={{
                                    margin: "16px 0",
                                }}>
                                <InlineDatePicker
                                    fullWidth
                                    variant='outlined'
                                    onlyCalendar
                                    minDate={new Date()}
                                    label="Last Date For Auction"
                                    value={this.state.deadline}
                                    onChange={this.handleDateChange}
                                    format="dd/MM/yyyy"
                                />
                            </div>
                        </DialogContent>
                        {this.state.addingNew &&
                            <LinearProgress />}
                        {!this.state.addingNew &&
                            <DialogActions>
                                <Button color='default' onClick={this.closeNewResourceDialog}>
                                    {'Cancel'}
                                </Button>
                                <Button color='secondary' onClick={this.addNewResource}>
                                    {'Submit'}
                                </Button>
                            </DialogActions>}
                    </Dialog>

                    {/* Lo and behold the legendary Snacky - Conveyor of the good and bad things, clear and concise */}
                    <Snacky message={this.state.snackyMessage} open={this.state.snackyOpen} onClose={this.handleSnackyClose} error={this.state.snackyErrorType} />
                </div>
        )
    }
}

export default withStyles(styles)(Dashboard)