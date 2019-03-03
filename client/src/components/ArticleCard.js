import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const styles = () => ({
    container: {
        cursor: 'pointer',
        textDecoration: 'none',
    },
    title: {
        fontWeight: 500,
    },
    description: {
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 2,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        fontSize: 16,
    },
    author: {
        fontWeight: 500,
    }
});

function getStyle(state) {
    if(state === 'live') return {color: '#02b102'}
    if(state === 'pending') return {color: '#ff8400'}
    else if(state === 'rejected') return {color: 'red'}
    else return {}
}

class ArticleCard extends Component {

    render() {
        const { post, classes, mine, moderation } = this.props
        var pathname
        if(moderation && window.userDetails.moderator)
            pathname = `/moderate/${post.id}`
        else
            pathname = `/byte/${post.id}`
        return (
            <Grid item key={post.id} xs={12} md={6}
                className={classes.container}
                component={Link}
                to={{ pathname: pathname }}
            >
                <Typography variant="h5" className={classes.title}>
                    {post.title}
                </Typography>
                <Typography variant="subtitle1" paragraph className={classes.description} color="textSecondary">
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