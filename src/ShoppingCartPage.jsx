import React from 'react'
import ReactDOM from 'react-dom';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'
import CardItem from './CardItem.jsx'

// TODO: Handle price formatting
class ShoppingCartPage extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			cart :[],
      total: 0
		}
		this.getShoppingCart = this.getShoppingCart.bind(this)
	}

	componentWillMount(){
    // Handle user details
    const { userProfile, getProfile } = this.props.auth
    if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({profile})
        this.getShoppingCart(profile.sub)
      })
    } else {
      this.setState({ profile: userProfile })
      this.getShoppingCart(userProfile.sub)
    }
	}

	getShoppingCart(userID) {
    fetch(`/api/users/${userID}/cart`)
      .then(results => {
        return results.json()
    	}).then(data => {
        this.setState({cart: data})
        var total = 0
        for (var i = 0; i < data.length; i++) {
          total += data[i].price
        }
        this.setState({total})
   		})
  	}

  render() {
    return (
      <div>
          <h1> Shopping Cart </h1>
          {this.state.cart.length === 0 ? <p> No item in shopping cart </p> : this.state.cart.map((item, i) => <CardItem itemID={item._id}/>)}
          <h2> Total: ${this.state.total}</h2>
          {this.state.cart.length !== 0 ? <Button><Link exact to="/checkout" style={{ textDecoration: 'none' }}>Checkout</Link></Button> : null}
      </div>
    )
  }

}

export default ShoppingCartPage