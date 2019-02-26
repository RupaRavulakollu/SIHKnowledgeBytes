import React, { Component } from 'react';
import axios from 'axios';
import Login from './pages/Login'

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            username : '',
            password: '',
            errors : {},
        }
    }

    componentDidMount() {
        axios.post('/api/whoami')
            .then(res => {
                if (res.data) {
                    this.setState({
                        username: res.data
                    })
                }
            })
            .catch(err => console.log(err))
    }

    setDetails = (username) => {
        this.setState({
            username: username
        })
    }

    render() {
        if (!this.state.username)
            return (
                <Login setDetails={this.setDetails}/>
            )
        else {
            return <div>Logged in</div>
        }
    }
}

export default App;
