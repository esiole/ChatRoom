// компонент для отображения информации о пользователе приложения
import React, {Component} from "react";

export class Info extends Component{
    constructor(props) {
        super(props);
        this.state = {
            userName: this.props.userName,  // имя пользователя
            roomID: this.props.roomID       // id комнаты
        };
        this.copyLink = this.copyLink.bind(this);
    }

    // копирование ссылки на комнату
    copyLink(event) {
        event.preventDefault();
        let tmp = document.createElement('input');
        let focus = document.activeElement;
        tmp.value = window.location;
        document.body.appendChild(tmp);
        tmp.select();
        try {
            document.execCommand('copy');
        } catch (e) {
            window.alert('Скопировать не удалось!');
        }
        document.body.removeChild(tmp);
        focus.focus();
    }

    render() {
        return (
            <table id="infoTable">
                <tbody>
                    <tr>
                        <th>Пользователь:</th>
                        <td>{this.state.userName}</td>
                    </tr>
                    <tr>
                        <th>Код комнаты:</th>
                        <td>{this.state.roomID}</td>
                    </tr>
                    <tr>
                        <td colSpan="2">
                            <form onSubmit={this.copyLink}>
                                <input type="submit" value="Копировать ссылку" id="copyButton"/>
                            </form>
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }
}
