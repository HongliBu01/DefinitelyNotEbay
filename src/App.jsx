import React from 'react';
import { Route, NavLink } from 'react-router-dom'
import PrimarySearchAppBar from './NavBar.jsx';
import AddItem from './AddItem.jsx'
import MainPage from './MainPage.jsx'

class App extends React.Component {
  render() {
    return (
      <div id="dashboard">
        <PrimarySearchAppBar/>
        <div className="menu">
          <NavLink exact to="/">
              Home
          </NavLink>
          <NavLink exact to="/addItem">
              Add Item
          </NavLink>
        </div>
        <div className="content">
          <Route exact path="/" component={MainPage} />
          <Route exact path="/addItem" component={AddItem} />
        </div>
      </div>
    )
  }
}

export default App