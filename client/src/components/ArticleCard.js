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

class ArticleCard extends Component {
    render() {
        const { post, classes } = this.props
        return (
            <Grid item key={post.id} xs={12} md={6}
                className={classes.container}
                component={Link}
                to={{pathname: `/byte/${post.id}`}}
            >
                <Typography variant="h5" className={classes.title}>
                    {post.title}
                </Typography>
                <Typography variant="subtitle1" paragraph className={classes.description} color="textSecondary">
                    {post.description}
                </Typography>
                <div>
                    <Typography variant="overline" className={classes.author}>
                        {`${post.author.name} of ${post.author.dpsu}`}
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                        {new Date(post.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </Typography>
                </div>
            </Grid>
        )
    }
}

export default withStyles(styles)(ArticleCard);