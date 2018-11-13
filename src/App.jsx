import React from 'react';
import { Route, Switch } from 'react-router-dom'
import PrimarySearchAppBar from './NavBar.jsx';
import AddItem from './AddItem.jsx'
import MainPage from './MainPage.jsx'
import Profile from './Profile.jsx'
import ItemPage from './ItemPage.jsx'
import WatchListPage from './WatchListPage.jsx'

class App extends React.Component {
  render() {
    return (
      <div>
        <PrimarySearchAppBar/>
        <Switch>
          <Route exact path="/" component={MainPage} />
          <Route path="/addItem" component={AddItem} />
          <Route path="/profile" component={Profile} />
          <Route path="/item/:id" component={ItemPage} />
            <Route path="/users/:user_id/watchlist" component={WatchListPage} />
        </Switch>
      </div>
    )
  }
}

export default App
