// компонент для страницы с несуществующим URL
import React, {Component} from "react";

export class NotFound extends Component{
    render() {
        return (
            <div id="notExistPage">Страница не найдена!</div>
        )
    }
}
