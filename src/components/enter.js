// компонент для обработки ввода никнейма пользователя
import React, {Component} from "react";

export class Enter extends Component{
    constructor(props) {
        super(props);
        this.state = {
            userName: '',                               // имя пользователя
            roomID: this.props.roomID,                  // полученный id комнаты при загрузке
            isRedirection: this.props.isRedirection,    // является ли это перенаправлением со входа по ссылке в чат комнату
            isBadName: this.props.isBadName             // является ли это перенаправление с некорректно введённым именем
        };
        this.onChange = this.onChange.bind(this);
        this.login = this.login.bind(this);
        this.removeWarning = this.removeWarning.bind(this);
    }

    componentDidMount() {
        if (!this.state.isRedirection) {    // получение id комнаты при загрузке
            fetch('http://localhost:3333/id/get').then(response => response.json()).then(result => {
                this.setState({'roomID': result.id});
            });
        }
        if (this.state.isRedirection && this.state.isBadName) { // если введённое имя было некорректно, то вывести предупреждение
            let entryArea = document.getElementById('entryArea');
            entryArea.classList.add('redText');
            entryArea.value = 'Имя уже занято в этой комнате!';
            entryArea.blur();
        }
    }

    // отслеживает изменение ввода имени, при пустом имени кнопка входа недоступной остаётся
    onChange(event) {
        this.setState({'userName': event.target.value});
        sessionStorage.setItem('userName', this.state.userName);
        document.getElementById('enterButton').disabled = event.target.value === '';
    }

    // переход в чат-комнату
    login(event) {
        sessionStorage.setItem('userName', this.state.userName);
        if (this.state.isRedirection) { // если этот компонент открылся по ссылке-приглашению, то переходить на другую
            event.preventDefault();     // страницу ненужно, надо обновить текущую для получения данных из sessionStorage
            window.location.reload();
        }
    }

    // удаление предупреждения в поле ввода при получении фокуса
    removeWarning(event) {
        let entryArea = event.target;
        entryArea.classList.remove('redText');
        entryArea.value = '';
    }

    render() {
        return (
            <div className="enterWindow">
                <h1>Chat Room</h1>
                <form action={`/room/${this.state.roomID}`} onSubmit={this.login}>
                    <input type="text" onChange={this.onChange} placeholder="Введите никнейм пользователя" autoFocus={true} id="entryArea" onFocus={this.removeWarning}/><br/>
                    <input type="submit" value="Войти" id="enterButton" disabled={true}/>
                </form>
            </div>
        )
    }
}
