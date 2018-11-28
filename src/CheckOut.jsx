import React from 'react'
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

// TODO: Handle transaction
class CheckoutPage extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      transactionComplete: false,
      profile: {}
    }
    this.handleTransaction = this.handleTransaction.bind(this)
  }

  componentWillMount(){
    // Handle user details
    const { userProfile, getProfile } = this.props.auth
    if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({profile})
      })
    } else {
      this.setState({profile: userProfile})
    }
  }

  handleTransaction(userID) {
    fetch(`/api/users/${userID}/checkout`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }).then(results => {
        return results.json()
      }).then(data => {
        this.setState({transactionComplete: true})
      });
  }

  render() {
    return (
      <div>
        {this.state.transactionComplete ? <div>
          <h1> Transaction complete </h1>
          <Button> <Link exact to="/" style={{ textDecoration: 'none' }}>Return to main page </Link> </Button>
          </div> :
          <div>
          <h1> Transaction </h1>
          <h2> Pretend you paid for it. If we actually implemented this, we'd probably use Stripe API to handle the transaction </h2>
          {this.state.profile ? <Button onClick={()=> this.handleTransaction(this.state.profile.sub)}>Complete Transaction</Button> : <p> Log in first </p>}
          </div>}
      </div>
    )
  }

}

export default CheckoutPage