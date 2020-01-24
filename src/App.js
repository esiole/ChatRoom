import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import {Enter} from "./components/enter";

import logo from './logo.svg';
import './App.css';

import {NotFound} from "./components/notFound";
import {Chat} from "./components/chat";

class App extends Component {
  render() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Enter} isRedirection={false}/>
                <Route path="/room/:id" component={Chat}/>
                <Route path="/test/:id" component={NotFound}/>
            </Switch>
        </BrowserRouter>
    )
  }
}

export default App;
