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

// TODO: Set up bid_history, buy_history, listings
class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      _id: "",
      watchlist: [],
      cart: [],
      isAdmin: false,
      isActive: true,
      profile: {}
    }
    this.getUser = this.getUser.bind(this)
  }

  componentWillMount() {
    // Handle user details
    const { userProfile, getProfile } = this.props.auth
    if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({profile})
        this.getUser(profile.sub)
      })
    } else {
      this.setState({ profile: userProfile })
      this.getUser(userProfile.sub)
    }
  }


  getUser(userID) {
    fetch(`/api/users/${userID}`)
      .then(results => {
        return results.json()
      }).then(data => {
        console.log(data)
        this.setState({...data})
    })
  }

  render() {
    return (
      <div>
        {this.state.profile ?
        <div><h1> User Profile </h1>
        <p> Email: {this.state.profile.email}</p>
        <p> Active: {String(this.state.isActive)} </p>
        <p> <Link to={`/watchlist`}> Watchlist </Link> </p>
        <p> <Link to={`/cart`}> Cart </Link> </p>
        <p> <Link to={`/users/${this.state._id}/buy_history`}> Past Purchases </Link> </p>
        <p> <Link to={`/users/${this.state._id}/bid_history`}> Past Bids </Link></p>
        <p> <Link to={`/users/${this.state._id}/item_history`}> Your Item Listings </Link></p>

        <h1> My Account </h1>
        <p> <Link to={`/users/${this.state._id}/account`}> Edit Account Details </Link></p></div> :
        <p> Please log in to view this page. </p>}
      </div>
    )
  }
}


export default Profile