import React from 'react';
import ReactDOM from 'react-dom';
import { Route, NavLink, BrowserRouter } from 'react-router-dom'
import AddItem from './AddItem.jsx'
import App from './App.jsx'

class Main extends React.Component {
    render() {
      return (
        <BrowserRouter>
          <App />
        </BrowserRouter>
      );
    }
}

ReactDOM.render(<Main />, document.getElementById('app'));