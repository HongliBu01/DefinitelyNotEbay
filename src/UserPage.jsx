import React from 'react'
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'

// Only admin should be authorized to see this
// Can change toggle isAdmin/isActive? -- to edit user

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
    this.suspendUser = this.suspendUser.bind(this)
    this.deleteUser = this.deleteUser.bind(this)
      this.makeAdmin = this.makeAdmin.bind(this)
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

  suspendUser(user) {
    console.log("Suspend:" + user._id);
    console.log("Suspend:" + user.isActive);
    fetch(`/api/users/${user._id}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            isActive: !user.isActive
        })
    }).then(results =>{
      return results.json()
    }).then( data => {
      // console.log(data)
        if (data._id) {
          location.reload();
            // this.setState({redirect: true})
        }
    })
  }

  deleteUser(userID) {
      console.log("Delete:" + userID);
      console.log(this.state.profile.sub);
      if (userID !== this.state.profile.sub) { // No self deletion here. Go to your own account to do that
          console.log("deleting " + userID);
              // No logout
              this.props.auth.deleteUser(userID)
              fetch(`/api/users/${userID}`,
                  {method: "DELETE"})
                  .then(result => {
                      console.log("deleted" + result.json()["_id"]);
                      return result.json()
                  }).then(data => {
                      if (data._id) {
                          location.reload()
                      }
              })
          } else {
              console.log("Deletn't yourself.\nNo self deletion here.\nGo to your own account to do that");
      }
  }

  makeAdmin(user) { // TODO: Merge this with suspend to flipFlag()
    console.log("make admin::" + user._id);
    if (user._id !== this.state.profile.sub) {
        fetch(`/api/users/${user._id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                isAdmin: !user.isAdmin
            })
        }).then(results => {
            return results.json()
        }).then(data => {
            // console.log(data)
            if (data._id) {
                location.reload();
                // this.setState({redirect: true})
            }
        })
    } else {
      console.log("Do not cancel your own admin status.");
      alert("Do not cancel your own admin status.")
    }
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
          <Button onClick={() => this.suspendUser(user)}> {user.isActive? 'Suspend':'Activate'} User </Button>
          <Button onClick={() => this.deleteUser(user._id)}> Delete User </Button>
          <Button onClick={() => this.makeAdmin(user)}> {user.isAdmin? 'Un-Make': 'Make'} Admin </Button>
          </ul>
          </div>)}
        </div>
      : <div> You are not authorized to view this page </div>}
      </div>
    )
  }
}
export default UserPage