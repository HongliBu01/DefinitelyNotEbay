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
      isActive: true,
      profile: {},
      allUsers: []
    }
    this.getUser = this.getUser.bind(this)
    this.getUsers = this.getUsers.bind(this)
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
        if (data.isAdmin) {
          this.getUsers()
        }
    })
  }

  getUsers() {
    fetch('/api/users')
      .then(results => {
        return results.json()
      }).then(data => {
        console.log(data)
        this.setState({allUsers: data})
      })
  }


  render() {
    return (
      <div>
      {this.state.isAdmin ?
        <div>
        {this.state.allUsers.map((user, key) => <div key={key}>
          <ul>
          <li> Id: {user._id} </li>
          <li> Email: {user.email} </li>
          <li> Active: {String(user.isActive)} </li>
          <li> Admin: {String(user.isAdmin)} </li>
          <Button> Suspend User </Button>
          <Button> Delete User </Button>
          <Button> Make Admin </Button>
          </ul>
          </div>)}
        </div>
      : <div> You are not authorized to view this page </div>}
      </div>
    )
  }
}
export default UserPage