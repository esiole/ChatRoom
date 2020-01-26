// компонент для списка сообщений в чате
import React, {Component} from "react";

export class TextList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            list: this.props.list,      // массив сообщений
            idReturnDiv: this.props.id  // id возвращаемого div
        }
    }

    render() {
        const list = this.state.list.map((element) => {
            return <p key={element.message} className="text"><span className="redText">{element.time} {element.name}: </span>{element.message}</p>
        });
        return <div id={this.state.idReturnDiv}>{list}</div>;
    }
}
