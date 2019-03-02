import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";

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
})

class ResourceDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            showDetails: false,
        }
    }

    componentDidMount() {
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

    render() {
        var { resource, classes, self, showDetails, hideDetails } = this.props
        return (
            Object.keys(resource).length !== 0 &&
            <Dialog fullWidth open={showDetails} onClose={hideDetails}>
                <DialogContent className={classes.dialogContent}>
                    <div className={classes.dialogHeadContent}>
                        <Avatar src={resource.type === 'infra' ? 'http://icons-for-free.com/free-icons/png/512/1054957.png' : 'https://ruparavulakollu.000webhostapp.com/images/avatar.jpg'} className={classes.avatar} />
                        <div className={classes.dialogSubHeadContent}>
                            <Typography variant="h5">
                                {resource.name}
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
                    <div style={{ textAlign: 'center', padding: 10, margin: 20, }}>
                        {"- Bidders come here -"}
                    </div>
                    {!self &&
                        <div style={{ textAlign: 'center', padding: 10, margin: 20, }}>
                            {"- Bidding options come here -"}
                        </div>
                    }
                </DialogContent>
            </Dialog>
        )
    }
}

export default withStyles(styles)(ResourceDialog)