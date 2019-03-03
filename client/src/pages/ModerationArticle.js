import React, { Component } from 'react'
import axios from 'axios';
import withStyles from '@material-ui/core/styles/withStyles'
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Dot from '../components/Dot';
import Snacky from '../components/Snacky'


const styles = theme => ({
    container: {
        margin: 'auto',
        padding: 16,
        width: '80%',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        [theme.breakpoints.down('md')]: {
            width: '100%'
        },
    },
    title: {
        margin: '16px 0',
    },
    description: {
        color: '#9e9e9e',
        fontSize: '1.1rem',
    },
    info: {
        margin: '8px 0',
        color: '#000000',
    },
    endSection: {
        display: 'flex',
        flexDirection: 'row',
        margin: '8px auto'
    },
    responseContainer: {
        display: 'flex',
        flexDirection: 'row',
        margin: 'auto'
    },
    responseButton: {
        margin: '16px',
    }
})

class ModerationArticle extends Component {
    constructor(props) {
        super(props)
        this.state = {
            article: {},
            isFetching: true,
            snackyOpen: false,
            snackyMessage: 'Just saying Hi!',
            snackyErrorType: false,
        }
    }

    getDate = (epoch) => {
        return new Date(parseInt(epoch)).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    }

    componentDidMount() {
        axios.get(`/api/bytes/moderation/${this.props.match.params.id}`)
            .then(res => {
                this.setState({
                    article: res.data,
                })
            })
            .catch(err => {
                console.log(err)
                this.callSnacky(err.response.data.error, true)
            })
            .finally(() => {
                this.setState({
                    isFetching: false,
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

    decideApplication = (decision) => {
        console.log(decision)
        axios.post(`/api/bytes/moderation/${this.props.match.params.id}/decision`, { decision: decision })
            .then(_res => {
                window.location = '/moderate'
            })
            .catch(err => {
                console.log(err)
                this.callSnacky(err.repsonse.data.error, true)
            })
    }

    render() {
        const { classes } = this.props
        const { article, isFetching } = this.state
        return (
            isFetching ? <LinearProgress /> :
                <div className={classes.container}>
                    <Typography variant='h4' className={classes.title}>
                        {article.title}
                    </Typography>
                    <Typography className={classes.description}>
                        {article.description}
                    </Typography>
                    <div className={classes.flexBox}>
                        <div className={classes.info}>
                            <Typography>
                                {article.author.name}
                            </Typography>
                            <Typography>
                                {this.getDate(article.date)}
                            </Typography>
                        </div>
                    </div>
                    <div className={classes.content} dangerouslySetInnerHTML={{ __html: `${article.content}` }} />
                    <div className={classes.endSection}>
                        <Dot />
                        <Dot />
                        <Dot />
                    </div>
                    <div className={classes.responseContainer}>
                        <Button className={classes.responseButton} variant='outlined' style={{ color: 'red', borderColor: 'red' }} onClick={() => {
                            this.decideApplication('rejected')
                        }}>Decline</Button>
                        <Button className={classes.responseButton} variant='outlined' style={{ color: '#02b102', borderColor: '#02b102' }} onClick={() => {
                            this.decideApplication('live')
                        }}>Approve</Button>
                    </div>
                    {/* Lo and behold the legendary Snacky - Conveyor of the good and bad things, clear and concise */}
                    <Snacky message={this.state.snackyMessage} open={this.state.snackyOpen} onClose={this.handleSnackyClose} error={this.state.snackyErrorType} />
                </div>
        )
    }
}

export default withStyles(styles)(ModerationArticle)