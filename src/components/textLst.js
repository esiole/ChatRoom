//компонент для списка сообщений в чате
import React, {Component} from "react";

export class TextList extends Component{
    render() {
        const list = this.props.messages.map((message) => {
            return <p key={message.message} className="text"><span className="redText">{message.time} {message.name}: </span>{message.message}</p>
        });
        return <div id={this.props.id}>{list}</div>;
    }
}
