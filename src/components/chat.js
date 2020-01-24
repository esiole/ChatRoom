//компонент для основого содержимого приложения
import React, {Component} from "react";
import openSocket from 'socket.io-client';
import {Enter} from "./enter";
import {ListMessage} from "./listMessage";

export class Chat extends Component{
    constructor(props) {
        super(props);
        this.state = {
            //userName: localStorage.userName
            userName: sessionStorage.userName,
            roomID: this.props.match.params.id,
            messages: ['Привет!', 'Хай!', 'Как дела?'],
            userMessage: ''
        };
        this.userLogout = this.userLogout.bind(this);
        this.setUserName = this.setUserName.bind(this);
        this.changeMessage = this.changeMessage.bind(this);
        this.sendMessage = this.sendMessage.bind(this);

        this.socket = openSocket(`http://localhost:3030/${this.state.roomID}`);
        this.socket.on('connect', (msg) => {this.socket.json.emit('start', {"name": 'connect'});});
        this.socket.on('msg', (msg) => {
            let messages = this.state.messages;
            messages.push(msg.message);
            this.setState({messages: messages});
        });
    }

    setUserName(name) {
        this.setState({userName: name})
    }

    changeMessage(event) {
        this.setState({userMessage: event.target.value});
    }

    sendMessage(event) {
        event.preventDefault();
        this.socket.json.emit('msg', {'message': this.state.userMessage});
        this.setState({userMessage: ''});
    }

    userLogout() {
        /*fetch('http://localhost:3333/user/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({userName: this.state.userName})
        }).then(response => response.json()).then(result => console.log(result));*/

        //delete localStorage.userName;
        delete sessionStorage.userName;
    }

    render() {
        if (this.state.userName === undefined) {
            return <Enter isRedirection={true} roomID={this.state.roomID} onUserNameChange={this.setUserName}/>
        }
        else {
            return (
                <div>
                    ЧАТ
                    <p>{this.props.match.params.id}</p>
                    <p>{this.state.userName}</p>
                    <form onSubmit={this.userLogout}>
                        <input type="submit" value="Выйти"/>
                    </form>
                    <ListMessage messages={this.state.messages}/>
                    <form onSubmit={this.sendMessage}>
                        <input type="text" onChange={this.changeMessage} placeholder="Сообщение..." value={this.state.userMessage}/>
                        <input type="submit" value="Отправить"/>
                    </form>
                </div>
            )
        }
    }
}
