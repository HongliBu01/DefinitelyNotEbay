import React from 'react'
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'

// Only admin should be authorized to see this
// Can change toggle isAdmin/isActive? -- to edit user

// TODO: Set up button functionality
class UserPage extends React.Component {
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


  render() {

    console.log(this.state._id)
    return (
      <div>
        <h1> User Details </h1>
        <p> Email: {this.state.email}</p>
        <p> Admin: {String(this.state.isAdmin)} </p>
        <p> Active: {String(this.state.isActive)} </p>
        <p> Watchlist: 
          <Link to={`/users/${this.state._id}/watchlist`}> Link </Link>
        </p>
        <p> Cart: {this.state.cart} </p>
      </div>
    )
  }


  // Add functino to toggle isAdmin/isActive attribute of a user
}
export default UserPage