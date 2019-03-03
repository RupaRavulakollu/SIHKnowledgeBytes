import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Divider } from '@material-ui/core';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import Edit from '@material-ui/icons/Edit';

const styles = theme => ({
    gridContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        [theme.breakpoints.down('md')]: {
            padding: '0 8px'
        }
    },
    listItemContainer: {
        display: 'flex',
        padding: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid grey',
        marginBottom: 10,
        width: '50%',
        fontSize: 40,
    },
    icon: {
        margin: 5,
        borderRadius: '50%',
        border: '1px solid grey',
        padding: 10,
    }
});

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            drafts: [],
            value: 0,
            snackyOpen: false,
            snackyMessage: 'Just saying Hi!',
            snackyErrorType: false,
            loading: true,
        }
    }

    deleteDraft = (id) => {
        axios.delete(`/api/drafts/${id}`)
            .then(_ => {
                console.log("Deleted draft")
                var drafts = this.state.drafts
                var index = drafts.findIndex(d => d.id === id)
                if(index !== -1) drafts.splice(index, 1)
                this.setState({
                    drafts: drafts,
                })
            })
            .catch(err => console.log("Error deleting draft: ", err))
    }

    componentDidMount() {
        axios.get('/api/drafts')
            .then(res => {
                console.log(res.data)
                this.setState({
                    drafts: res.data,
                })
            })
            .catch(err => {
                console.log("Error getting all bytes: ", err)
                this.callSnacky(err.response.data.error, true)
            })
            .finally(() => {
                this.setState({
                    loading: false,
                })
            })

    }

    render() {

        const { classes } = this.props;
        const { drafts } = this.state;
        console.log(drafts)

        return (
            <div>
                <Typography variant='h4' style={{margin: '20px 0',}}>{"Your Drafts"}</Typography>
                <Divider />
                {this.state.loading && <LinearProgress />}
                <List container className={classes.gridContainer}>
                    {drafts.map((draft, i) => (
                        <ListItem key={i} className={classes.listItemContainer}>
                            <ListItemText>
                                <Typography variant='h5'>{draft.title ? draft.title : 'Untitled'}</Typography>
                            </ListItemText>
                            <div>
                                <IconButton component={Link} to={`/new-byte/${draft.id}`} className={classes.icon} style={{ color: '#02b102' }}>
                                    <Edit />
                                </IconButton>
                                <IconButton onClick={() => this.deleteDraft(draft.id)} className={classes.icon} style={{ color: 'red' }}>
                                    <DeleteOutlinedIcon />
                                </IconButton>
                            </div>
                        </ListItem>
                    ))}
                </List>
            </div>
        );
    }
}

export default withStyles(styles)(Profile);
