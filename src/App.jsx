import React from 'react';
import { Route, Switch, Router } from 'react-router-dom'
import PrimarySearchAppBar from './NavBar.jsx';
import AddItem from './AddItem.jsx'
import MainPage from './MainPage.jsx'
import Profile from './Profile.jsx'
import ItemPage from './ItemPage.jsx'
import EditItem from './EditItem.jsx'
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
          <Route exact path="/" render={(props) => <MainPage auth={auth} />} />
          <Route path="/addItem" render={(props) => <AddItem auth={auth} />} />
          <Route path="/profile" render={(props) => <Profile auth={auth} />} />
          <Route path="/item/:id/edit" render={(props) => <EditItem auth={auth} {...props}/>} />
          <Route path="/item/:id" render={(props) => <ItemPage auth={auth} {...props}/>} />
          <Route exact path="/watchlist" render={(props) => <WatchListPage auth={auth} {...props}/>} />
          <Route exact path="/account" render={(props) => <EditUser auth={auth} {...props}/>} />
          <Route exact path="/cart" render={(props) => <ShoppingCartPage auth={auth} {...props}/>} />
          <Route exact path="/checkout" render={(props) => <ShoppingCartPage auth={auth} {...props}/>} />
          <Route exact path="/admin/users" render={(props) => <UserPage auth={auth} {...props}/>} />
          {/*
          <Route exact path="users/:user_id/buy_history" component={BuyHistoryPage}
          <Route exact path="users/:user_id/bid_history" component={BidHistoryPage}
          <Route exact path="users/:user_id/item_history" component={ItemHistoryPage}
          */}
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
