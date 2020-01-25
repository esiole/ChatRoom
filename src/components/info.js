import React, {Component} from "react";

export class Info extends Component{
    constructor(props) {
        super(props);
        this.state = {
            userName: this.props.userName,
            roomID: this.props.roomID
        }
    }

    render() {
        return (
            <table id="infoTable">
                <tr>
                    <th>Пользователь:</th>
                    <td>{this.state.userName}</td>
                </tr>
                <tr>
                    <th>Код комнаты:</th>
                    <td>{this.state.roomID}</td>
                </tr>
            </table>
        )
    }
}
