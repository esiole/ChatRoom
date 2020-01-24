//компонент для списка сообщений в чате
import React, {Component} from "react";

export class ListMessage extends Component{
    render() {
        const list = this.props.messages.map((message) => {
            return <li key={message}>{message}</li>
        });
        return <ul>{list}</ul>;
    }
}
