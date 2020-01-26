// компонент для основого содержимого приложения
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
            userName: sessionStorage.userName,  // имя пользователя
            roomID: this.props.match.params.id, // id комнаты
            messages: [],                       // список сообщений
            userMessage: '',                    // введённое пользователем сообщение для отправки
            usersInChat: [],                    // список пользователей в чате
            isShowUserList: false,              // нужно ли показать список пользователей
            isBadName: false                    // является ли введённое имя пользователя некорректным
        };
        this.userLogout = this.userLogout.bind(this);
        this.setUserName = this.setUserName.bind(this);
        this.changeMessage = this.changeMessage.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.toggleUserList = this.toggleUserList.bind(this);
        this.setSocket = this.setSocket.bind(this);
        this.setSocket();
    }

    // подключение сокетов
    setSocket() {
        if (this.state.userName !== undefined) {
            this.socket = openSocket(`http://localhost:3030/${this.state.roomID}`);
            this.socket.on('connect', (msg) => {this.socket.json.emit('start', {'name': this.state.userName});});
            this.socket.on('users', (msg) => {      // новый массив пользователей
                this.setState({usersInChat: msg.users});
            });
            this.socket.on('msg', (msg) => {        // новое сообщение в чате
                let messages = this.state.messages;
                messages.push({'time': msg.time, 'name': msg.name, 'message': msg.message});
                this.setState({messages: messages});
                document.getElementById('messagesList').scrollTop = document.getElementById('messagesList').scrollHeight;
            });
            this.socket.on('badName', (msg) => {    // некоррректное имя
                delete sessionStorage.userName;
                this.setState({'userName': undefined, 'isBadName': true});
            });
        }
    }

    // для передачи изменения состояния из дочернего компонента
    setUserName(name) {
        this.setState({'userName': name, 'isBadName': false});
    }

    // отслеживание изменения ввода сообщения, при пустом сообщении кнопка отправления недоступна
    changeMessage(event) {
        document.getElementById('submit').disabled = event.target.value === '';
        this.setState({'userMessage': event.target.value});
    }

    // отправка сообщения
    sendMessage(event) {
        event.preventDefault();
        this.socket.json.emit('msg', {'message': this.state.userMessage, 'name': this.state.userName});
        this.setState({'userMessage': ''});                     // после отправки сообщения нужно очистить поле ввода
        document.getElementById('submit').disabled = true;  // и сделать кнопку отправки недоступной
    }

    // переключение отображения/скрытия списка пользователей
    toggleUserList(event) {
        this.setState({'isShowUserList': !this.state.isShowUserList});
        event.preventDefault();
    }

    // выход пользователя из приложения и удаления ника из sessionStorage
    userLogout(event) {
        event.preventDefault();
        delete sessionStorage.userName;
        window.location.assign(`http://localhost:3000/`);
    }

    render() {
        if (this.state.userName === undefined) {
            return <Enter isRedirection={true} roomID={this.state.roomID} onUserNameChange={this.setUserName} isBadName={this.state.isBadName}/>
        }
        else {
            let userList;
            if (this.state.isShowUserList) {
                userList = <UsersList list={this.state.usersInChat} id={'usersList'}/>;
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
                            <TextList list={this.state.messages} id={'messagesList'}/>
                            <form onSubmit={this.sendMessage}>
                                <input type="text" onChange={this.changeMessage} placeholder="Сообщение..." value={this.state.userMessage} id="input"/>
                                <input type="submit" value="Отправить" id="submit" disabled={true}/>
                            </form>
                        </div>
                    </div>
                </div>
            )
        }
    }
}
