import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from 'axios';
import Radio from '@material-ui/core/Radio';
import Dot from '../components/Dot';
import green from '@material-ui/core/colors/green';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import NearMe from '@material-ui/icons/NearMe';
import StarRate from '@material-ui/icons/StarRate';

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
    tags: {
        margin: 0
    },
    tag: {
        margin: theme.spacing.unit,
    },
    endSection: {
        display: 'flex',
        flexDirection: 'row',
        margin: '8px auto'
    },
    response: {
        margin: '16px 0'
    },
    ratingIcon: {
        margin: 'auto 8px',
        fontSize: 24,
    },
    rating: {
        margin: 'auto 8px',
        fontSize: 24,
    },
    root: {
        color: green[600],
        '&:checked': {
            color: green[500],
        },
    },
    radioContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    commentContainer: {
        display: 'flex',
    },
    commentTF: {
        flexGrow: 1
    },
    fab: {
        margin: theme.spacing.unit,
    },
    flexBox: {
        display: 'flex',
        alignItems: 'center',
    },
    commentSheet: {
        padding: '0 8px',
    },
    hr: {
        border: 0,
        margin: "16px 0",
        height: 1,
        backgroundImage: "-webkit-linear-gradient(left, #f0f0f0, #8c8b8b, #f0f0f0)",
    },
    '@keyframes blink': {
        '0%': { opacity: 0.2 },
        '30%': { opacity: 1 },
        '100%': { opacity: 0.2 },
    },
    loadingDots: {
        display: 'flex',
        flexDirection: 'row',
        margin: 'auto'
    },
    loadingDot: {
        background: theme.palette.secondary.dark,
        width: 8,
        height: 8,
        borderRadius: '50%',
        margin: '0 4px',
        animationName: 'blink',
        animationIterationCount: 'infinite',
        animationDuration: '1s',
    },
    commentDate: {
        fontSize: '0.75rem',
    },
})

class Article extends Component {

    constructor(props) {
        super(props)
        this.state = {
            article: {},
            comments: [],
            isFetching: true,
            isCommentsFetching: true,
            myRating: null,
            myComment: '',
            snackyOpen: false,
            snackyMessage: 'Just saying Hi!',
            snackyErrorType: false,
            isCommenting: false,
        }
    }

    componentDidMount() {
        axios.get(`/api/bytes/${this.props.match.params.id}`)
            .then(res => {
                this.setState({
                    article: res.data,
                })
                if (res.data.rating) {
                    this.setState({
                        myRating: res.data.rating,
                        hasAlreadyRated: true,
                    })
                }
            })
            .catch(err => {
                console.log(err)
                this.callSnacky(err.response.data.error, true)
            })
            .finally(() => {
                this.setState({
                    isFetching: false
                })
            })
        axios.get(`/api/bytes/${this.props.match.params.id}/comments`)
            .then(res => {
                this.setState({
                    comments: res.data
                })
            })
            .catch(err => {
                console.log(err)
                this.callSnacky(err.response.data.error, true)
            })
            .finally(() => {
                this.setState({
                    isCommentsFetching: false,
                })
            })
        axios.get(`/api/bytes/${this.props.match.params.id}/rating`)
            .then(res => {
                this.setState({
                    rating: res.data.rating,
                })
            })
            .catch(err => {
                console.log(err)
                this.callSnacky(err.response.data.error, true)
            })
    }

    getDate = (epoch) => {
        return new Date(parseInt(epoch)).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    }

    getDateTime = (epoch) => {
        return new Date(parseInt(epoch)).toLocaleString('en-IN', 
        { day: '2-digit', month: 'short', year: 'numeric', hour12: true, hour: '2-digit', minute: '2-digit'})
    }

    handleChange = event => {
        this.setState({
            myRating: parseInt(event.target.value),
            hasAlreadyRated: false,
        });
    }

    handleCommentChange = event => {
        this.setState({
            myComment: event.target.value,
        })
    }

    comment = () => {
        if (this.state.myComment) {
            var myComment = this.state.myComment
            this.setState({
                myComment: '',
                isCommenting: true
            })
            axios.post(`/api/bytes/${this.props.match.params.id}/comment`, { comment: myComment })
                .then(res => {
                    this.setState(prevState => ({
                        comments: [res.data, ...prevState.comments],
                    }))
                })
                .catch(err => {
                    console.log("Error posting comment: ", err)
                    this.callSnacky(err.response.data.error, true)
                    this.setState({
                        myComment: myComment,
                    })
                })
                .finally(() => {
                    this.setState({
                        isCommenting: false
                    })
                })
        }
    }

    rate = () => {
        if (this.state.myRating) {
            axios.post(`/api/bytes/${this.props.match.params.id}/rate`, { rating: this.state.myRating })
                .then(res => {
                    this.setState({
                        rating: res.data.rating,
                        hasAlreadyRated: true,
                    })
                })
                .catch(err => {
                    console.log("Error posting rating: ", err)
                    this.callSnacky(err.response.data.error, true)
                })
        }
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
                        {this.state.rating && this.state.rating.count &&
                            <div className={classes.flexBox} >
                                <StarRate style={{ color: '#FFBF00', margin: "0 10px 0 15px" }} />
                                <Typography variant='h6'>
                                    {`${Number((this.state.rating.value).toFixed(1))}/10`}
                                </Typography>
                                <Typography variant="subtitle1" style={{ marginLeft: 5 }}>
                                    {`by ${this.state.rating.count} readers`}
                                </Typography>
                            </div>
                        }
                    </div>
                    <div className={classes.content} dangerouslySetInnerHTML={{ __html: `${article.content}` }} />
                    <div className={classes.endSection}>
                        <Dot />
                        <Dot />
                        <Dot />
                    </div>
                    <div className={classes.tags}>
                        {article.tags.map(tag => (
                            <Chip
                                key={tag}
                                label={tag}
                                variant='outlined'
                                clickable
                                className={classes.tag}
                            />
                        ))}
                    </div>

                    <div style={{ textAlign: 'center', margin: 10, }}>
                        <Typography variant='h5'>Rate the article</Typography>
                        <div className={classes.radioContainer}>
                            <Radio
                                checked={this.state.myRating === 1}
                                onChange={this.handleChange}
                                style={{ color: '#FF0000' }}
                                value={1}
                            />
                            <Radio
                                checked={this.state.myRating === 2}
                                onChange={this.handleChange}
                                style={{ color: '#FF3400' }}
                                value={2}
                            />
                            <Radio
                                checked={this.state.myRating === 3}
                                onChange={this.handleChange}
                                style={{ color: '#FF6900' }}
                                value={3}
                            />
                            <Radio
                                checked={this.state.myRating === 4}
                                onChange={this.handleChange}
                                style={{ color: '#FF9E00' }}
                                value={4}
                            />
                            <Radio
                                checked={this.state.myRating === 5}
                                onChange={this.handleChange}
                                value={5}
                                style={{ color: '#FFD300' }}
                            />
                            <Radio
                                checked={this.state.myRating === 6}
                                onChange={this.handleChange}
                                value={6}
                                style={{ color: '#e8f000' }}
                            />
                            <Radio
                                checked={this.state.myRating === 7}
                                onChange={this.handleChange}
                                value={7}
                                style={{ color: '#eef602' }}
                            />
                            <Radio
                                checked={this.state.myRating === 8}
                                onChange={this.handleChange}
                                value={8}
                                style={{ color: '#8DFF00' }}
                            />
                            <Radio
                                checked={this.state.myRating === 9}
                                onChange={this.handleChange}
                                value={9}
                                style={{ color: '#58FF00' }}
                            />
                            <Radio
                                checked={this.state.myRating === 10}
                                onChange={this.handleChange}
                                value={10}
                                style={{ color: '#24FF00' }}
                            />
                        </div>
                        {this.state.hasAlreadyRated ? <Typography gutterBottom variant='overline'>{`You have rated ${this.state.myRating}/10`}</Typography> :
                            <div>
                                {this.state.myRating &&
                                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10, }}>
                                        <h3 style={{ margin: 10 }}>{this.state.myRating}/10</h3>
                                        <Button onClick={this.rate} color='primary' variant='outlined'>
                                            {"Rate"}
                                        </Button>
                                    </div>
                                }
                            </div>
                        }
                    </div>

                    <div className={classes.endSection}>
                        <Dot />
                        <Dot />
                        <Dot />
                    </div>
                    <div className={classes.commentSection}>
                        <Typography>Comments</Typography>
                        <div className={classes.commentContainer}>
                            <TextField
                                multiline
                                id="outlined-comment-input"
                                placeholder="Write a comment"
                                className={classes.commentTF}
                                type="text"
                                name="comment"
                                margin="dense"
                                variant="outlined"
                                value={this.state.myComment}
                                onChange={this.handleCommentChange}
                            />
                            {/* {this.state.isCommenting ?
                                <div className={classes.loadingDots}>
                                    <div className={classes.loadingDot} />
                                    <div className={classes.loadingDot} />
                                    <div className={classes.loadingDot} />
                                </div>
                                : */}
                            <Fab size='medium' color="primary" className={classes.fab} onClick={this.comment} disabled={this.state.isCommenting}>
                                <NearMe />
                            </Fab>
                            {/* } */}
                        </div>
                        {!this.state.isCommentsFetching &&
                            this.state.comments.map(comment => (
                                <div key={comment.id} className={classes.commentSheet}>
                                    <hr className={classes.hr} />
                                    <Typography color='primary'>{`${comment.posted_by.name} (${comment.posted_by.dpsu.toUpperCase()})`}</Typography>
                                    <Typography color='default' className={classes.commentDate}>{`${this.getDateTime(comment.posted_on)}`}</Typography>
                                    <Typography className={classes.commentBox} variant='body1'>{comment.comment}</Typography>
                                </div>
                            ))
                        }
                    </div>
                    {/* Lo and behold the legendary Snacky - Conveyor of the good and bad things, clear and concise */}
                    <Snacky message={this.state.snackyMessage} open={this.state.snackyOpen} onClose={this.handleSnackyClose} error={this.state.snackyErrorType} />

                </div>
        )
    }
}

Article.propTypes = {
    classes: PropTypes.object.isRequired
};


export default withStyles(styles)(Article);
