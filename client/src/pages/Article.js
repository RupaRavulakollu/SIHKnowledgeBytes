import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from 'axios';
import Radio from '@material-ui/core/Radio';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import Dot from '../components/Dot';
import green from '@material-ui/core/colors/green';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
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
    textField: {
        width: '600px',
        marginLeft: '20PX',
    },
    commentContainer: {
        display: 'flex',
    },
    fab: {
        margin: theme.spacing.unit,
    },
    extendedIcon: {
        marginRight: theme.spacing.unit,
        marginLeft: '7px',
        size: '30px'
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
            isRatingsFetching: true,
            myRating: null,
            myComment: null,
            snackyOpen: false,
            snackyMessage: 'Just saying Hi!',
            snackyErrorType: false,
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
        axios.get(`/api/bytes/${this.props.match.params.id}/rating`)
            .then(res => {
                this.setState({
                    rating: res.data.rating,
                })
            })
    }

    getDate = (epoch) => {
        return new Date(parseInt(epoch)).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    }

    handleChange = event => {
        this.setState({
            myRating: parseInt(event.target.value),
            hasAlreadyRated: false,
        });
    }

    comment = () => {
        if (this.state.myComment) {
            axios.post(`/api/bytes/${this.props.match.params.id}/comment`, { comment: this.state.myComment })
                .then(res => {
                    this.setState(prevState => ({
                        comments: [res.data, ...prevState.comments],
                    }))
                })
                .catch(err => {
                    console.log("Error posting comment: ", err)
                    this.callSnacky(err.response.data.error, true)
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
        const user = window.userDetails

        return (
            isFetching ? <LinearProgress /> :
                <div className={classes.container}>
                    <Typography variant='h4' className={classes.title}>
                        {article.title}
                    </Typography>
                    <Typography className={classes.description}>
                        {article.description}
                    </Typography>
                    <div className={classes.infoWrap}>
                        <div className={classes.info}>
                            <Typography>
                                {article.author.name}
                            </Typography>
                            <Typography>
                                {this.getDate(article.date)}
                            </Typography>
                        </div>
                        {this.state.rating.count &&
                            <div>
                                <StarRate />
                                <Typography variant='h3'>
                                    {`Rated ${Number((this.state.rating.value).toFixed(1))}/10 by ${this.state.rating.count} readers`}
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

                    <div style={{ textAlign: 'center' }}>
                        <h2>Rate the article</h2>
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
                    <h2>Comments</h2>
                    <div>
                        <h5>{user.name}</h5>
                        <h4>Comments read only</h4>
                        {/* <TextField
                        disabled
                        id="outlined-disabled"
                        label={user.name+"    timing"}
                        defaultValue="Hello World"
                        className={classes.textField}
                        margin="normal"
                        variant="outlined"
                    /> */}
                    </div>
                    <div className={classes.commentContainer}>
                        <TextField
                            id="outlined-comment-input"
                            placeholder="Write a comment"
                            className={classes.textField}
                            type="text"
                            name="comment"
                            margin="dense"
                            variant="outlined"

                        />
                        <Fab size='medium' color="primary" className={classes.fab}>
                            <NearMe className={classes.extendedIcon} />
                        </Fab>
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
