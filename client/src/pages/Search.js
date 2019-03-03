import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import axios from 'axios'
import LinearProgress from '@material-ui/core/LinearProgress'
import ArticleCard from '../components/ArticleCard';

const styles = theme => ({
    gridContainer: {
        padding: "20px 10px",
    },
})

class Search extends Component {

    constructor(props) {
        super(props)
        this.state = {
            results: [],
            snackyOpen: false,
            snackyMessage: 'Just saying Hi!',
            snackyErrorType: false,
            loading: true,
        }
    }

    componentDidMount() {
        var params = new URLSearchParams(this.props.location.search)
        var query = params.get('q').split('+').join(' ')
        axios.post('/api/search', { query: query })
            .then(res => {
                this.setState({
                    results: res.data
                })
                if (res.data.length === 0) {
                    this.setState({
                        errorText: "No results match your query"
                    })
                }
            })
            .catch(err => {
                console.log(err)
                this.setState({
                    errorText: err.response ? err.response.data.error : "Something's Wrong"
                })
            })
            .finally(() => {
                this.setState({
                    loading: false,
                })
            })
    }

    render() {
        const { classes } = this.props
        return (
            this.state.loading ? <LinearProgress /> :
            <div>
                <Grid container direction='column' spacing={16} className={classes.gridContainer}>
                    {this.state.results.map((result, i) => {
                        return <ArticleCard post={result} key={i} />
                    })}
                </Grid>
                {this.state.results.length === 0 &&
                    <Typography style={{ textAlign: 'center', margin: 16, fontSize: 20, color: 'red' }} >
                        {this.state.errorText}
                    </Typography>
                }
            </div>
        )
    }
}

export default withStyles(styles)(Search)