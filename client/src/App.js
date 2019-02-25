import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            title: 'Pinging server',
        }
    }

    componentDidMount() {
        axios.get('/api')
            .then(res => {
                this.setState({
                    title: res.data,
                })
            })
            .catch(err => console.log(err))
    }

    render() {
        return (
            <h1>{this.state.title}</h1>
        );
    }
}

export default App;
