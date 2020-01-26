// компонент для списка пользователей в чате
import React, {Component} from "react";

export class UsersList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            list: this.props.list,      // массив пользователей
            idReturnDiv: this.props.id  // id возвращаемого div
        }
    }

    render() {
        const list = this.state.list.map((element) => {
            return <p key={element} className="text">{element}</p>
        });
        return <div id={this.state.idReturnDiv}>{list}</div>;
    }
}
