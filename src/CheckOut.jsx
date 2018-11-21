import React from 'react'
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core/styles';

class CheckoutPage extends React.Component{
  constructor(props){
    super(props)
    this.state = {
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
      this.setState({ profile: userProfile })
    }
  }

  handleTransaction() {
    // Remove everything from cart
    // Remove from listings
    // Remove from other user's carts and bidHistory
    // Store in user's buyHistory under timestamp
  }

  render() {
    return (
      <div>
          <h1> Transaction </h1>
          <h2> Pretend you paid for it. If we actually implemented this, we'd probably use Stripe API to handle the transaction </h2>
          <Button onClick={()=> handleTransaction()}> Complete Transaction </Button>
      </div>
    )
  }

}

export default CheckoutPage