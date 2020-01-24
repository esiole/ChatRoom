//компонент для обработки ввода никнейма пользователя
import React, {Component} from "react";
import {Link} from "react-router-dom"

export class Enter extends Component{
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            roomID: this.props.roomID,
            isRedirection: this.props.isRedirection
        };
        this.onChange = this.onChange.bind(this);
        this.login = this.login.bind(this);
    }

    componentDidMount() {
        if (!this.state.isRedirection) {
            fetch('http://localhost:3333/id/get').then(response => response.json()).then(result => {
                this.setState({roomID: result.id});
            });
        }
    }

    componentWillUnmount() {
        fetch('http://localhost:3333/id/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({id: this.state.roomID})
        }).then(response => response.json()).then(result => {
            console.log('done!');
        });
    }

    onChange(event) {
        this.setState({userName: event.target.value});
        //localStorage.setItem('userName', this.state.userName);
        sessionStorage.setItem('userName', this.state.userName);
    }

    login(event) {
        //localStorage.setItem('userName', this.state.userName);
        sessionStorage.setItem('userName', this.state.userName);
        if (this.state.isRedirection) {
            event.preventDefault();
            window.location.reload();
        }
    }

    render() {
        return (
            <div>
                <input type="text" onChange={this.onChange} placeholder="Введите никнейм пользователя" autoFocus={true}/>
                <Link to={`/room/${this.state.roomID}`} onClick={this.login}>Войти</Link>
            </div>
        )
    }
}
