import React, { Component } from 'react';
import Link from "react-router-dom/Link";
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    container: {
        margin: '8px 0',
        textDecoration: 'none',
        padding: 16,
        '&:hover': {
            boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.1)'
        },
        [theme.breakpoints.down('md')]: {
            padding: 8,
        },
    },
    title: {
        textDecoration: 'none',
        fontWeight: 500,
    },
    description: {
        textDecoration: 'none',
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 2,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        fontSize: 16,
    },
    author: {
        fontWeight: 500,
    },
    info: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    extras: {
        cursor: 'pointer',
        margin: 'auto 8px',
        color: theme.palette.primary.light,
        '&:hover': {
            color: theme.palette.primary.dark
        }
    },
    content: {
        wordBreak: 'break-all',
    }
});

function getStyle(state) {
    if (state === 'live') return { color: '#02b102' }
    if (state === 'pending') return { color: '#ff8400' }
    else if (state === 'rejected') return { color: 'red' }
    else return {}
}

class ArticleCard extends Component {

    render() {
        const { post, classes, mine, moderation } = this.props
        var pathname
        if (moderation && window.userDetails.moderator)
            pathname = `/moderate/${post.id}`
        else
            pathname = `/byte/${post.id}`
        return (
            <Grid item key={post.id} xs={12} md={8}
                className={classes.container}
                component={Link}
                to={{ pathname: pathname }}
            >
                <Typography variant="h5" className={classes.title}>
                    {post.title}
                </Typography>
                <Typography variant="subtitle1" paragraph className={classes.description} color="textSecondary"
                    component={Link}
                    to={{ pathname: `/byte/${post.id}` }}>
                    {post.description}
                </Typography>
                <div>
                    {!mine ?
                        <Typography variant="overline" className={classes.author}>
                            {`${post.author.name} of ${post.author.dpsu}`}
                        </Typography>
                        :
                        <Typography variant="overline" className={classes.author} style={getStyle(post.state)}>
                            {post.state}
                        </Typography>
                    }
                    <Typography variant="subtitle2" color="textSecondary">
                        {new Date(parseInt(post.date)).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </Typography>
                </div>
            </Grid>
        )
    }
}

export default withStyles(styles)(ArticleCard);