import React, {Component} from 'react';
import axios from 'axios';

class Fib extends Component{
    state = {
        seenIndexes: [],
        values: {},
        index: ''
    };

    componentDidMount(){
        this.fetchValues();
        this.fetchIndexes();
    }

    logError = (e) => {
        console.error(e.response.data);
        console.error(e.response.status);
        console.error(e.response.headers);
    };

    async fetchValues(){
        await axios.get('/api/values/current')
            .then((reponse) => this.setState({values: reponse.data}))
            .catch((err) => this.logError(err));
        
    }

    async fetchIndexes(){
        await axios.get('/api/values/all')
            .then((reponse) => this.setState({seenIndexes: reponse.data}))
            .catch((err) => this.logError(err));
    }

    renderSeenIndexes(){
        return this.state.seenIndexes.map(({ number }) => number).join(',');
    }

    renderValues(){
        const entries = [];

        for (let key in this.state.values){
            entries.push(
                <div key={key}>
                    For index {key} I calculated {this.state.values[key]}
                </div>
            );
        }

        return entries;
    }

    handleSubmit = async event => {
        event.preventDefault();

        await axios.post('/api/values', { index: this.state.index})
        .catch((err) => this.logError(err));

        this.setState({ index: '' });
    };

    render(){
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Enter your index: </label>
                    <input 
                        value={this.state.index} 
                        onChange={event => this.setState({ index: event.target.value })}
                    />
                    <button>Submit</button> 
                </form>
                <h3>Indexes I have seen:</h3>
                {this.renderSeenIndexes()}
                <h3>Calculated values: </h3>
                {this.renderValues()}
            </div>
        );
    }
}

export default Fib;