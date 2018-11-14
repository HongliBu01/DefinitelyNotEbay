import React from 'react';
import ReactDOM from 'react-dom';
import {Route, NavLink, BrowserRouter, Router} from 'react-router-dom'
import AddItem from './AddItem.jsx'
import App from './App.jsx'
import history from "./history";


class Main extends React.Component {
    render() {
      return (
      <Router history={history}>
          <App />
      </Router>
      );
    }
}

ReactDOM.render(<Main />, document.getElementById('app'));