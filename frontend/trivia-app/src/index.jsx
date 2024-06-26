import React from 'react';
import { api_createLobby, api_joinLobby }  from './api'; 

class LoginPage extends React.Component {
    render() {
        return (
            <div id='logindiv' style={this.props.style}>
                <form onSubmit={this.props.submitHandler}>
                    <p>Username:</p>
                    <input type='text' name='username' placeholder='Sherlock Holmes' onChange={this.props.changeHandler}></input>
                    <br/>
                    <p>Lobby Code:</p>
                    <input type='text' name='lobbyCode' placeholder='ABC1' onChange={this.props.changeHandler}></input>
                    <br/>
                    <button>Join Lobby</button>
                    <button onClick={this.props.createHandler}>Create Lobby</button>
                </form>
            </div>
        );
    }
}

class GamePage extends React.Component{
    render() {
        return (
            <div className='gamePage' style={this.props.style2}>
                <h1 style={{ marginBottom: '20px' }}>{this.props.question[0] ? this.props.question[0] : '' }</h1>
                <h3 id='timer'>{this.props.timer}</h3>
                <div className='answerButtons'>
                    <button className="answerButton">{this.props.question[1] ? this.props.question[1] : '' }</button>
                    <button className="answerButton">{this.props.question[2] ? this.props.question[2] : '' }</button>
                    <button className="answerButton">{this.props.question[3] ? this.props.question[3] : '' }</button>
                    <button className="answerButton">{this.props.question[4] ? this.props.question[4] : '' }</button>
                </div>

                                
            </div>
        );
    }
}

class LobbyPage extends React.Component{
    render() {
        return (
            <div className='lobbyPage' style={this.props.style2}>
                <h1>Lobby Code: {this.props.lobbyCode}</h1>
                <h1>Player's: {this.props.playerCount}</h1>
                <button onClick={this.props.startButtonHandler}>Start</button>
            </div>
        );
    }
}

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCreatelobby = this.handleCreatelobby.bind(this);
        this.incomingMessage = this.incomingMessage.bind(this);
        this.startButtonHandler = this.startButtonHandler.bind(this);
        this.state = {
            lobbyCode: null,
            ws: null,
            playerCount: 0,
            timer: null,
            question: {},
            username: null,
        }
    }

    startButtonHandler() {
        console.log(this.state.lobbyCode);
    }

    incomingMessage(message) {
        console.log(message);
        var data = JSON.parse(message.data);
        if (data.hasOwnProperty('players')) {
            this.setState({playerCount : data['players']});
        }
        if (data.hasOwnProperty('timer')) {
            this.setState({timer : data['timer']});
        }
        if (data.hasOwnProperty('question')) {
            this.setState({question : data['question']});
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.lobbyCode) return;
        const formData = new FormData(event.target);
        const lobbyCode = formData.get('lobbyCode');
        console.log('Submitted lobby code:', lobbyCode);
        api_joinLobby(lobbyCode.toUpperCase(), (data) => {
            if (data['lobbyCode']) {
                const ws = new WebSocket('ws://localhost:8001/lobbyCode/'+data['lobbyCode']);
                ws.addEventListener('message', this.incomingMessage);
                this.setState({lobbyCode : data['lobbyCode'], ws:ws})
            }
        });
    }

    handleCreatelobby(event) {
        event.preventDefault();
        if (this.state.lobbyCode) return;
        api_createLobby((data) => {
            console.log(data);
            const ws = new WebSocket('ws://localhost:8001/lobbyCode/'+data['lobbyCode']);
            ws.addEventListener('message', this.incomingMessage);
            this.setState({lobbyCode : data['lobbyCode'], ws:ws})
        });
    }

    render() {
        return (
            <div>
                <LoginPage style={{display:this.state.lobbyCode ? 'none' : ''}} 
                            submitHandler={this.handleSubmit} 
                            createHandler={this.handleCreatelobby}/>
                <LobbyPage playerCount={this.state.playerCount} 
                            startButtonHandler={this.startButtonHandler} 
                            style={{display:this.state.lobbyCode ? '' : 'none' }} 
                            submitHandler={this.handleSubmit} 
                            createHandler={this.handleCreatelobby} 
                            lobbyCode={this.state.lobbyCode}/>
                <GamePage style={{display:this.state.timer ? '' : 'none'}} 
                            timer={this.state.timer} 
                            lobbyCode={this.state.lobbyCode} 
                            question={this.state.question}/>
            </div>
        );
    }
}

export { Main };
