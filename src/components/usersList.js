import React, {Component} from "react";

export class UsersList extends Component{
    render() {
        const list = this.props.messages.map((message) => {
            return <p key={message} className="text">{message}</p>
        });
        return <div id={this.props.id}>{list}</div>;
    }
}
