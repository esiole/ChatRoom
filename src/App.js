import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import './App.css';
import {Enter} from "./components/enter";
import {NotFound} from "./components/notFound";
import {Chat} from "./components/chat";

class App extends Component {
  render() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Enter} isRedirection={false}/>
                <Route path="/room/:id" component={Chat}/>
                <Route component={NotFound}/>
            </Switch>
        </BrowserRouter>
    )
  }
}

export default App;
