import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ResourceDialog from './ResourceDialog';
import { Hidden } from '@material-ui/core';

const CustomTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.secondary.dark,
        color: theme.palette.secondary.contrastText,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const styles = theme => ({
    root: {
        width: '100%',
        margin: `${theme.spacing.unit * 3}px 0`,
        overflowX: 'auto',
    },
    row: {
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: theme.palette.grey[200],
        },
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
        '&:nth-of-type(odd):hover': {
            backgroundColor: theme.palette.grey[300],
        },
    },
});

class ResourceTable extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showDetails: false,
            selectedResource: {}
        }
    }

    showDetails = (resource) => {
        this.setState({
            showDetails: true,
            selectedResource: resource
        })
    }

    hideDetails = () => {
        this.setState({
            showDetails: false,
            selectedResource: {}
        })
    }

    getDate = (epoch) => {
        return new Date(parseInt(epoch)).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    }

    render() {
        const { classes, resources, self } = this.props;

        return (
            <Paper className={classes.root}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell>Resource Name</CustomTableCell>
                            <CustomTableCell>DPSU</CustomTableCell>
                            <Hidden smDown>
                                <CustomTableCell>Resource Type</CustomTableCell>
                                <CustomTableCell>Closes On</CustomTableCell>
                                <CustomTableCell>Highest Bid</CustomTableCell>
                            </Hidden>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {resources.map(resource => (
                            <TableRow className={classes.row} key={resource.id} onClick={() => {
                                this.showDetails(resource)
                            }}>
                                <CustomTableCell component="th" scope="row">
                                    {resource.name}
                                </CustomTableCell>
                                <Hidden smDown>
                                    <CustomTableCell>{resource.dpsu.name}</CustomTableCell>
                                    <CustomTableCell>{resource.type === 'infra' ? 'Infrastructure' : 'Human Resource'}</CustomTableCell>
                                    <CustomTableCell>{this.getDate(parseInt(resource.deadline))}</CustomTableCell>
                                    <CustomTableCell>{resource.maxbid}</CustomTableCell>
                                </Hidden>
                                <Hidden mdUp>
                                    <CustomTableCell>{resource.dpsu.shortname.toUpperCase()}</CustomTableCell>
                                </Hidden>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {Object.keys(this.state.selectedResource).length !== 0 &&
                    <ResourceDialog self={self} showDetails={this.state.showDetails} hideDetails={this.hideDetails} resource={this.state.selectedResource} />
                }
            </Paper>
        );
    }
}

ResourceTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ResourceTable);