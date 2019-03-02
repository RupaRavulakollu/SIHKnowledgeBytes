import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from 'axios';

import Dot from '../components/Dot'

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
    ratingContainer: {
        display: 'flex',
        cursor: 'pointer',
        width: 'fit-content'
    },
    ratingIcon: {
        margin: 'auto 8px',
        fontSize: 24,
    },
    rating: {
        margin: 'auto 8px',
        fontSize: 24,
    },
})

class Article extends Component {

    constructor(props) {
        super(props)
        this.state = {
            article: {},
            isFetching: true
        }
    }

    componentDidMount() {
        axios.get(`/api/bytes/${this.props.match.params.id}`)
            .then(res => {
                this.setState({
                    article: res.data
                })
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                this.setState({
                    isFetching: false
                })
            })
    }

    getDate = (epoch) => {
        return new Date(parseInt(epoch)).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
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
                    <div className={classes.info}>
                        <Typography>
                            {article.author.name}
                        </Typography>
                        <Typography>
                            {this.getDate(article.date)}
                        </Typography>
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
                    {/* Comments and Rating will be resumed shortly */}
                    {/* <div className={classes.response}>
                        <div className={classes.ratingContainer}>
                            <Icon color='primary' className={classes.ratingIcon}>
                                <Star />
                            </Icon>
                            <Typography className={classes.rating}>{article.rating}</Typography>
                        </div>
                    </div> */}
                </div>
        )
    }
}

Article.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Article);
