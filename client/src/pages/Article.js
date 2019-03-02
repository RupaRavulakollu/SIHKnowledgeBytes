import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';

import Star from '@material-ui/icons/StarRounded';

import Dot from '../components/Dot'
import { Icon } from '@material-ui/core';

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
        this.setState({
            article: {
                id: '5678-1234-5678-1234',
                title: 'Thing I wish I knew before starting my first gear development',
                description: 'Aenean semper a sem quis semper. Cras sit amet elit vestibulum, lacinia nibh eu, pretium augue. Curabitur lacinia aliquet justo, et mattis tellus. Nam cursus id libero ac pretium. Suspendisse at aliquam nunc. Sed suscipit sem at sapien consectetur, a rhoncus metus laoreet. Fusce vitae tortor auctor, lobortis lorem in, efficitur dolor.',
                content: `<h2>The three greatest things you learn from traveling</h2><p>Like all the great things on earth traveling teaches us by example. Here are some of the most precious lessons I’ve learned over the years of traveling.</p><figure class="media"><oembed url="https://www.youtube.com/watch?v=BLJ4GKKaiXw"></oembed></figure><h3>Appreciation of diversity</h3><p>Getting used to an entirely different culture can be challenging. While it’s also nice to learn about cultures online or from books, nothing comes close to experiencing cultural diversity in person. You learn to appreciate each and every single one of the differences while you become more culturally fluid.</p><blockquote><p>The real voyage of discovery consists not in seeking new landscapes, but having new eyes.</p><p><strong>Marcel Proust</strong></p></blockquote><h3>Improvisation</h3><p>Life doesn't allow us to execute every single plan perfectly. This especially seems to be the case when you travel. You plan it down to every minute with a big checklist; but when it comes to executing it, something always comes up and you’re left with your improvising skills. You learn to adapt as you go. Here’s how my travel checklist looks now:</p><ul><li>buy the ticket</li><li>start your adventure</li></ul><figure class="image image-style-side"><img src="https://images.pexels.com/photos/248797/pexels-photo-248797.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="Three Monks walking on ancient temple."><figcaption>Leaving your comfort zone might lead you to such beautiful sceneries like this one.</figcaption></figure><h3>Confidence</h3><p>Going to a new place can be quite terrifying. While change and uncertainty makes us scared, traveling teaches us how ridiculous it is to be afraid of something before it happens. The moment you face your fear and see there was nothing to be afraid of, is the moment you discover bliss.</p>`,
                author: {
                    name: 'Steven McGrath',
                    dpsu: 'Hindustan Aeronautics Limited'
                },
                date: 1551241280629,
                tags: ['android', 'iOS', 'web', 'flutter'],
                rating: 4.5,
            },
            isFetching: false
        })
    }

    getDate = (epoch) => {
        return new Date(parseInt(epoch)).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    }

    render() {
        const { classes } = this.props
        const { article, isFetching } = this.state

        return (
            isFetching ? <CircularProgress /> :
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
