import React, { Component } from 'react';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import withTheme from '@material-ui/core/styles/withTheme';
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from 'axios';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import DateFnsUtils from '@date-io/date-fns';

import Login from './pages/Login'
import NavigationPane from './NavigationPane'

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#673ab7',
            light: '#9a67ea',
            dark: '#320b86',
            contrastText: '#ffffff'
        },
        secondary: {
            main: '#6a1b9a',
            light: '#9c4dcc',
            dark: '#38006b',
            contrastText: '#ffffff',
        },
    },
    typography: {
        fontFamily: "'Work Sans', sans-serif",
        useNextVariants: true,
    },
});

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user: window.userDetails,
            isLoading: true,
        }
    }

    componentDidMount() {
        axios.post('/api/whoami')
            .then(res => {
                if (res.data) {
                    window.userDetails = res.data
                    this.setDetails()
                }
            })
            .catch(err => console.log(err))
            .finally(() => {
                this.setState({
                    isLoading: false
                })
            })
    }

    setDetails = () => {
        this.setState({
            user: window.userDetails
        })
    }

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                {
                    this.state.isLoading &&
                    <LinearProgress />
                }
                {!this.state.user && !this.state.isLoading &&
                    <Login setDetails={this.setDetails} />
                }
                {this.state.user && !this.state.isLoading &&
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <NavigationPane />
                    </MuiPickersUtilsProvider>
                }
            </MuiThemeProvider>
        )
    }
}

export default withTheme()(App);
