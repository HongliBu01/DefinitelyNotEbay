import React from 'react'
import ReactDOM from 'react-dom';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'
import CardItem from './CardItem.jsx'
import moment from 'moment'
// TODO: Handle price formatting
// TODO: Edit cart if not bid type item
class BuyHistory extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      profile: "",
      buyHistory: []
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
          <h1> Buy History </h1>
          {this.state.buyHistory.length === 0 ? <p> Have not bought anything </p>
          : <div>
            {this.state.buyHistory.map((cart) =>
              <div>
              <p> Bought at {moment(cart.timestamp).format('YYYY-MM-DD HH:mm')} </p>
              {cart.items.map((item) => <CardItem showBought={true} itemID={item._id}/>)}
              </div>)
            }
          </div>}
      </div>
    )
  }

}

export default BuyHistory