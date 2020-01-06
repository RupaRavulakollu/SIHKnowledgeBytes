import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import ResourceDialog from './ResourceDialog';

const styles = (theme) => ({
    container: {
        width: '30%',
        [theme.breakpoints.down("md")]: {
            width: "100%",
            margin: 10,
        }
    },
    card: {
        margin: 8,
    },
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
})

class ResourceCard extends Component {
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
                    this.props.closeResource(this.props.resource)
                }
                else {
                    this.setState({
                        days: days,
                        hours: hours,
                        minutes: minutes,
                        seconds: seconds,
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
        var { resource, classes, self } = this.props
        return (
            <div className={classes.container}>
                <Card className={classes.card} onClick={this.showDetails}>
                    <CardMedia
                        image={resource.type === 'infra' ? 'https://www.capturehighered.com/wp-content/uploads/2019/02/The-Call.jpg' : 'https://greendestinations.org/wp-content/uploads/2019/05/avatar-exemple.jpg'}
                        component="img"
                        alt="Resource Image"
                        className={classes.media}
                        height="140"
                    />
                    <CardContent style={{ textAlign: 'center' }}>
                        <Typography gutterBottom variant="h5">
                            {resource.name}
                        </Typography>
                        <Typography gutterBottom variant="overline">
                            {`Auctioned by ${resource.dpsu.name}`}
                        </Typography>
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
                    </CardContent>
                    {resource.maxbid &&
                        <div className={classes.bidLine}>
                            <Typography style={{ color: 'white' }}>
                                {`Highest bid is Rs. ${resource.maxbid}`}
                            </Typography>
                        </div>
                    }
                </Card>
                <ResourceDialog self={self} showDetails={this.state.showDetails} hideDetails={this.hideDetails} resource={resource} />
            </div>
        )
    }
}

export default withStyles(styles)(ResourceCard)