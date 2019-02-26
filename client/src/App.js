import React, { Component } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from 'axios';

import Login from './pages/Login'
import NavigationPane from './NavigationPane'

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
        if (this.state.isLoading) {
            return <LinearProgress />
        }
        else if (!this.state.user) {
            return <Login setDetails={this.setDetails} />
        }
        else {
            return <NavigationPane />
        }
    }
}

export default App;
