import React from 'react'
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'

/* TODO
    cart = fields.Nested(ItemListSchema)
    watchlist = fields.Nested(ItemListSchema)
    order_history = fields.List(fields.Nested(ItemListSchema))  # list of carts
    item_history = fields.List(fields.Str())  # list of ItemIds
*/

// Users can only see their own profiles (authorization), must be logged in (authenticated)
// Link to watchlist, cart, bid_history, buy_history, item_history
// Can edit email

// TODO: Figure out how to pass in logged in session info
class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      _id: "",
      watchlist: [],
      cart: [],
      isAdmin: false,
      isActive: true
    }
    this.getUser = this.getUser.bind(this)
  }

  componentWillMount() {
    this.getUser();
  }


  getUser() {
    const userID = this.props.match.params.user_id
    fetch(`/api/users/${userID}`)
      .then(results => {
        return results.json()
      }).then(data => {
        console.log(data)
        this.setState({...data})
    })
  }

  // TODO: replace this.state._id with the user_id of whoever's logged in
  render() {

    console.log("ID", this.state._id)
    return (
      <div>
        <h1> User Profile </h1>
        <p> Email: {this.state.email}</p>
        <p> Active: {String(this.state.isActive)} </p>
        <p> <Link to={`/users/${this.state._id}/watchlist`}> Watchlist </Link> </p>
        <p> <Link to={`/users/${this.state._id}/cart`}> Cart </Link> </p>
        <p> <Link to={`/users/${this.state._id}/buy_history`}> Past Purchases </Link> </p>
        <p> <Link to={`/users/${this.state._id}/bid_history`}> Past Bids </Link></p>
        <p> <Link to={`/users/${this.state._id}/item_history`}> Your Item Listings </Link></p>

        <h1> Edit Profile </h1>
        <p> <Link to={`/users/${this.state._id}/edit_profile`}> Edit Profile </Link></p>
      </div>
    )
  }
}


export default Profile