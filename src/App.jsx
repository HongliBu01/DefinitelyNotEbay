import React from 'react';
import { Route, Switch, Router } from 'react-router-dom'
import PrimarySearchAppBar from './NavBar.jsx';
import AddItem from './AddItem.jsx'
import MainPage from './MainPage.jsx'
import Profile from './Profile.jsx'
import ItemPage from './ItemPage.jsx'
import Auth from "./Auth/Auth";
import Callback from './Callback/Callback';



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