import React from 'react'
import ReactDOM from 'react-dom';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import CardItem from './CardItem.jsx'

class ShoppingCartPage extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			cart :[]
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
		this.getShoppingCart()
	}

	getShoppingCart(userID) {
    fetch(`/api/users/${userID}/cart`)
      .then(results => {
        return results.json()
    	}).then(data => {
        this.setState({cart: data})
   		})
  	}

  render() {
    return (
      <div>
          <h1> Shopping Cart </h1>
          {this.state.cart.length === 0 ? <p> No item in shopping cart </p> : this.state.cart.map((item, i) => <CardItem itemID={item._id}/>)}

      </div>
    )
  }

}

export default ShoppingCartPage