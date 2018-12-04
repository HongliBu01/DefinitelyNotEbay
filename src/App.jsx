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
import AdminMainPage from './AdminMain.jsx'
import CheckoutPage from './CheckOut.jsx'
import ContactPage from './ContactPage.jsx'
import AdminSupportPage from './AdminSupportPage.jsx'
import CategoryPage from './CategoryPage.jsx'
import BuyHistory from './BuyHistory.jsx'

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
        <PrimarySearchAppBar auth={auth}/>
        <Switch>
          <Route exact path="/" render={(props) => <MainPage auth={auth} {...props}/>} />
          <Route path="/addItem" render={(props) => <AddItem auth={auth} {...props}/>} />
          <Route path="/profile" render={(props) => <Profile auth={auth} {...props}/>} />
          <Route path="/item/:id" render={(props) => <ItemPage auth={auth} {...props}/>} />
          <Route exact path="/contact" render={(props) => <ContactPage auth={auth} {...props} />} />
          <Route exact path="/watchlist" render={(props) => <WatchListPage auth={auth} {...props}/>} />
          <Route exact path="/account" render={(props) => <EditUser auth={auth} {...props}/>} />
          <Route exact path="/cart" render={(props) => <ShoppingCartPage auth={auth} {...props}/>} />
          <Route exact path="/checkout" render={(props) => <CheckoutPage auth={auth} {...props}/>} />
          <Route exact path="/admin/users" render={(props) => <UserPage auth={auth} {...props}/>} />
          <Route exact path="/admin/listings" render={(props) => <AdminMainPage auth={auth} {...props}/>} />
          <Route exact path="/admin/categories" render={(props) => <CategoryPage auth={auth} {...props}/>} />
          <Route exact path="/admin/customersupport" render={(props) => <AdminSupportPage auth={auth} {...props}/>} />
          <Route exact path="/buyHistory" render={(props) => <BuyHistory auth={auth} {...props}/>} />
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
