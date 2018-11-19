import React from 'react';
import { Route, Switch, Router } from 'react-router-dom'
import PrimarySearchAppBar from './NavBar.jsx';
import AddItem from './AddItem.jsx'
import MainPage from './MainPage.jsx'
import Profile from './Profile.jsx'
import ItemPage from './ItemPage.jsx'
import UserPage from './UserPage.jsx'
import EditUser from './EditUser.jsx'
import Auth from "./Auth/Auth";
import Callback from './Callback/Callback';
import WatchListPage from './WatchListPage.jsx'
import ShoppingCartPage from './ShoppingCartPage.jsx'

class App extends React.Component {
  render() {
    const auth = new Auth();

    const handleAuthentication = ({location}) => {
      if (/access_token|id_token|error/.test(location.hash)) {
        auth.handleAuthentication();
      }
    }

    return (
      <div>
        <PrimarySearchAppBar/>
        <Switch> 
          <Route exact path="/" component={MainPage} />
          <Route path="/addItem" component={AddItem} />
          <Route path="/profile" component={Profile} />
          <Route path="/item/:id" component={ItemPage} />
          <Route exact path="/users/:user_id/watchlist" component={WatchListPage} />
          <Route exact path="/users/:user_id/edit_profile" component={EditUser} />
          <Route exact path="/users/:user_id/cart" component={ShoppingCartPage} />
          {/*
          <Route exact path="users/:user_id/cart" component={CartPage}
          <Route exact path="users/:user_id/buy_history" component={BuyHistoryPage}
          <Route exact path="users/:user_id/bid_history" component={BidHistoryPage}
          <Route exact path="users/:user_id/item_history" component={ItemHistoryPage}
          */}
          <Route path="/users/:user_id" component={UserPage} /> 
          <Route path="/callback" render={(props) => {
            handleAuthentication(props);
            return <Callback {...props} />
          }}/>
        </Switch>
      </div>
    )
  }
}

export default App
