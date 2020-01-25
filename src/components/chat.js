//компонент для основого содержимого приложения
import React, {Component} from "react";
import openSocket from 'socket.io-client';
import {Enter} from "./enter";
import {TextList} from "./textLst";
import {Info} from "./info";
import {UsersList} from "./usersList";

export class Chat extends Component{
    constructor(props) {
        super(props);
        this.state = {
            //userName: localStorage.userName
            userName: sessionStorage.userName,
            roomID: this.props.match.params.id,
            messages: [],
            userMessage: '',
            usersInChat: [],
            isShowUserList: false
        };
        this.userLogout = this.userLogout.bind(this);
        this.setUserName = this.setUserName.bind(this);
        this.changeMessage = this.changeMessage.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.toggleUserList = this.toggleUserList.bind(this);

        if (this.state.userName !== undefined) {
            this.socket = openSocket(`http://localhost:3030/${this.state.roomID}`);
            this.socket.on('connect', (msg) => {this.socket.json.emit('start', {"name": this.state.userName});});
            this.socket.on('users', (msg) => {
                this.setState({usersInChat: msg.users});
                //this.setState({usersInChat: [...msg.users]}); //для Set
            });
            this.socket.on('msg', (msg) => {
                let messages = this.state.messages;
                //messages.push(`${msg.time}: ${msg.name}: ${msg.message}`);
                messages.push({'time': msg.time, 'name': msg.name, 'message': msg.message});
                this.setState({messages: messages});

                document.getElementById('messagesList').scrollTop = document.getElementById('messagesList').scrollHeight;
            });
            this.socket.on('badName', (msg) => {
               //имя было занято в этой комнате
            });
        }
    }

    setUserName(name) {
        this.setState({userName: name})
    }

    changeMessage(event) {
        if (event.target.value !== '') {
            document.getElementById('submit').disabled = false;
        } else {
            document.getElementById('submit').disabled = true;
        }
        this.setState({userMessage: event.target.value});
    }

    sendMessage(event) {
        event.preventDefault();
        this.socket.json.emit('msg', {'message': this.state.userMessage, 'name': this.state.userName});
        this.setState({userMessage: ''});
        document.getElementById('submit').disabled = true;
    }

    toggleUserList(event) {
        this.setState({isShowUserList: !this.state.isShowUserList});
        event.preventDefault();
    }

    userLogout(event) {
        /*fetch('http://localhost:3333/user/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({userName: this.state.userName})
        }).then(response => response.json()).then(result => console.log(result));*/

        //delete localStorage.userName;
        event.preventDefault();
        delete sessionStorage.userName;
        window.location.assign(`http://localhost:3000/`);
    }

    render() {
        if (this.state.userName === undefined) {
            return <Enter isRedirection={true} roomID={this.state.roomID} onUserNameChange={this.setUserName}/>
        }
        else {
            let userList;
            if (this.state.isShowUserList) {
                userList = <UsersList messages={this.state.usersInChat} id={'usersList'}/>;
            }
            return (
                <div>
                    <Info userName={this.state.userName} roomID={this.props.match.params.id}/>
                    <form onSubmit={this.userLogout} id="exitButton">
                        <input type="submit" value="Выйти"/>
                    </form>
                    {userList}
                    <div id="chatArea">
                        <h2 id="headingChat" className="inlineBlock">Чат комната</h2>
                        <form onSubmit={this.toggleUserList} className="inlineBlock">
                            <input type="submit" value="" id="userShowButton" title="Показать/скрыть список пользователей"/>
                        </form>
                        <div id="messageArea">
                            <TextList messages={this.state.messages} id={'messagesList'}/>
                            <form onSubmit={this.sendMessage}>
                                <input type="text" onChange={this.changeMessage} placeholder="Сообщение..." value={this.state.userMessage} id="input"/>
                                <input type="submit" value="Отправить" id="submit" disabled="true"/>
                            </form>
                        </div>
                    </div>
                </div>
            )
        }
    }
}
