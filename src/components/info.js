// компонент для отображения информации о пользователе приложения
import React, {Component} from "react";

export class Info extends Component{
    constructor(props) {
        super(props);
        this.state = {
            userName: this.props.userName,  // имя пользователя
            roomID: this.props.roomID       // id комнаты
        }
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
                </tbody>
            </table>
        )
    }
}
