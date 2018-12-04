import React from 'react'
import ReactDOM from 'react-dom';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'
import CardItem from './CardItem.jsx'
import moment from 'moment'

class UserListings extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      profile: "",
      listings: []
    }
    this.getUser = this.getUser.bind(this)
  }

  componentWillMount(){
    // Handle user details
    const { userProfile, getProfile } = this.props.auth
    if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({profile})
        this.getUser(profile.sub)
      })
    } else {
      this.getUser(userProfile.sub)
      this.setState({ profile: userProfile })
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
          <h1> Listings </h1>
          {this.state.listings.length === 0 ? <p> Have not sold anything </p>
          : <div>
            {this.state.listings.map((listing) =>
              <CardItem showBought={true} itemID={listing.$oid}/>)
            }
          </div>}
      </div>
    )
  }

}

export default UserListings