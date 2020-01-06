import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import axios from 'axios';
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';

import DoneRounded from '@material-ui/icons/DoneRounded';

import Snacky from './Snacky'
import { socket } from './socket'


const styles = (theme) => ({
    countdown: {
        textAlign: "center",
        marginBottom: 16,
    },
    timer: {
        display: "inline-block",
        marginBottom: 5,
    },
    time: {
        display: "inline-block",
        margin: "0 4px",
        textAlign: "left",
    },
    timeText: {
        margin: 0,
        fontSize: 16,
        color: "#46535e",
        textAlign: "center",
        fontWeight: 600,
        letterSpacing: 8
    },
    timeCaption: {
        fontWeight: 600,
        color: "#9ca3a8",
        fontSize: 8,
        textTransform: "uppercase",
    },
    media: {
        objectFit: 'cover',
    },
    bidLine: {
        padding: 10,
        backgroundColor: '#02b102',
        textAlign: 'center',
    },
    avatar: {
        width: 120,
        height: 120,
    },
    dialogContent: {
        padding: 0
    },
    dialogHeadContent: {
        display: 'flex',
        flexDirection: 'row',
        padding: 20,
        boxShadow: '0 4px 12px 0 rgba(0,0,0,.05)',
        marginBottom: 20,
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
        },
    },
    dialogSubHeadContent: {
        margin: "0 15px",
        display: 'flex',
        flexDirection: 'column',
    },
    bidContainer: {
        display: 'flex',
        flexDirection: 'row',
        margin: '8px 16px',
    },
    bidInput: {
        flexGrow: 1,
    },
    basePricePrompt: {
        margin: '16px auto',
        textAlign: 'center',
        fontSize: 20,
    },
    row: {
        '&:first-child': {
            boxShadow: 'inset #02b102 2px 0px 10px 0px'
        },
        '&:first-child td, &:first-child th': {
            fontWeight: 'bold'
        },
    },
})

class ResourceDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            resourceId: props.resource.id,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            showDetails: false,
            newBid: '',
            newBidError: false,
            newBidErrorText: '',
            isFetchingBidding: true,
            biddingHistory: [],
            snackyOpen: false,
            snackyMessage: 'Just saying Hi!',
            snackyErrorType: false,
        }
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
            newBidError: false,
            newBidErrorText: '',
        })
    }

    getDateTime = (epoch) => {
        return new Date(parseInt(epoch)).toLocaleString('en-IN',
            { day: '2-digit', month: 'short', year: 'numeric', hour12: true, hour: '2-digit', minute: '2-digit' })
    }

    componentDidMount() {
        socket.emit('join-bidding', { resource: this.state.resourceId })
        axios.get(`/api/resources/${this.props.resource.id}`)
            .then(res => {
                this.setState({
                    biddingHistory: res.data
                })
            })
            .catch(err => {
                console.log(err);
                this.callSnacky(err.response.data.error, true)
            })
            .finally(() => {
                this.setState({
                    isFetchingBidding: false
                })
            })
        socket.on('new-bid', data => {
            var newBid = data.bid
            this.setState(prevState => ({
                biddingHistory: [newBid, ...prevState.biddingHistory],
            }))
        })

        if (!this.props.closed)
            var countdown = setInterval(() => {
                var dl = new Date(parseInt(this.props.resource.deadline)).getTime()
                var now = Date.now()
                var distance = dl - now;
                // Time calculations for days, hours, minutes and seconds
                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                if (seconds < 0) {
                    clearInterval(countdown)
                    // this.props.closeResource(this.props.resource)
                }
                else {
                    this.setState({
                        days: days ? days : 0,
                        hours: hours ? hours : 0,
                        minutes: minutes ? hours : 0,
                        seconds: seconds ? seconds : 0,
                    })
                }
            }, 1000)
    }

    componentWillUnmount() {
        socket.emit('leave-bidding', { resource: this.state.resourceId })
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

    getTimeComponent = (props, ...child) => {
        const { classes } = props
        return (
            <div className={classes.time}>
                <p className={classes.timeText}>{child[1].toString().padStart(2, 0) + child[2]}</p>
                <p className={classes.timeCaption}>{child[0]}</p>
            </div>
        )
    }

    showDetails = () => {
        this.setState({
            showDetails: true,
        })
    }

    hideDetails = () => {
        this.setState({
            showDetails: false,
        })
    }

    handleNewBid = () => {
        const newBid = parseInt(this.state.newBid)
        if (!newBid) {
            this.setState({
                newBidError: true,
                newBidErrorText: 'Enter a bidding amount'
            })
        } else if (newBid < parseInt(this.props.resource.maxbid)) {
            this.setState({
                newBidError: true,
                newBidErrorText: 'Enter a bidding amount greater than the maximum bid'
            })
        } else if (newBid < parseInt(this.props.resource.base_price)) {
            this.setState({
                newBidError: true,
                newBidErrorText: 'Enter a bidding amount greater than baseprice'
            })
        } else {
            this.setState({
                isBidding: true
            })
            axios.post(`/api/resources/${this.props.resource.id}`, { price: newBid })
                .then(_res => {
                    this.setState({
                        newBid: ''
                    })
                })
                .catch(err => {
                    console.log(err)
                    this.callSnacky(err.response.data.error, true)
                })
                .finally(() => {
                    this.setState({
                        isBidding: false
                    })
                })
        }
    }

    render() {
        const { resource, classes, self, showDetails, hideDetails } = this.props
        const { biddingHistory } = this.state
        return (
            Object.keys(resource).length !== 0 &&
            <Dialog maxWidth='md' fullWidth open={showDetails} onClose={hideDetails}>
                <DialogContent className={classes.dialogContent}>
                    <div className={classes.dialogHeadContent}>
                        <Avatar src={resource.type === 'infra' ? 'https://www.capturehighered.com/wp-content/uploads/2019/02/The-Call.jpg' : 'https://greendestinations.org/wp-content/uploads/2019/05/avatar-exemple.jpg'} className={classes.avatar} />
                        <div className={classes.dialogSubHeadContent}>
                            <Typography variant="h5">
                                {resource.name}
                            </Typography>
                            <Typography>
                                {`Base Price: Rs. ${resource.base_price}`}
                            </Typography>
                            <Typography gutterBottom variant="overline">
                                {`Auctioned by ${resource.dpsu.name}`}
                            </Typography>
                            <Typography>
                                {resource.description}
                            </Typography>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', margin: 20, }}>
                        <p style={{
                            fontWeight: 600,
                            color: "#9ca3a8",
                            fontSize: 10,
                            textTransform: "uppercase",
                        }}>
                            {"Closes In"}
                        </p>
                        <div className={classes.timer}>
                            {this.getTimeComponent(this.props, 'Days', this.state.days, ':')}
                            {this.getTimeComponent(this.props, 'Hours', this.state.hours, ':')}
                            {this.getTimeComponent(this.props, 'Minutes', this.state.minutes, ':')}
                            {this.getTimeComponent(this.props, 'Seconds', this.state.seconds, '')}
                        </div>
                    </div>
                    {!self &&
                        <div className={classes.bidContainer}>
                            <TextField
                                value={this.state.newBid}
                                variant='outlined'
                                className={classes.bidInput}
                                type='number'
                                error={this.state.newBidError}
                                helperText={this.state.newBidErrorText}
                                onChange={this.handleChange('newBid')}
                                label='New Bid'
                                margin='dense'
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                                }}
                            />
                            <Button variant="outlined" size="small" color="primary" onClick={this.handleNewBid}
                                disabled={this.state.isBidding}
                                style={{ margin: 'auto 8px', height: 48, minWidth: 48, borderRadius: '50%' }}>
                                <DoneRounded />
                            </Button>
                        </div>
                    }
                    {this.state.isFetchingBidding ? <LinearProgress />
                        :
                        this.state.biddingHistory.length > 0 ?
                            <div style={{ textAlign: 'center', padding: 10, margin: 20, }}>
                                <Paper className={classes.root}>
                                    <Table className={classes.table}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>DPSU</TableCell>
                                                <TableCell>Bid amount</TableCell>
                                                <TableCell>Bidded On</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {biddingHistory.map(row => (
                                                <TableRow key={row.id} className={classes.row}>
                                                    <TableCell component="th" scope="row">
                                                        {row.dpsu.name}
                                                    </TableCell>
                                                    <TableCell>{`Rs.${row.price}`}</TableCell>
                                                    <TableCell>{this.getDateTime(row.bidded_on)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Paper>
                            </div>
                            :
                            <Typography className={classes.basePricePrompt}>{`Bid for a price greater than Rs. ${resource.base_price} (Base price)`}</Typography>
                    }
                </DialogContent>

                {/* Lo and behold the legendary Snacky - Conveyor of the good and bad things, clear and concise */}
                <Snacky message={this.state.snackyMessage} open={this.state.snackyOpen} onClose={this.handleSnackyClose} error={this.state.snackyErrorType} />
            </Dialog>
        )
    }
}

export default withStyles(styles)(ResourceDialog)