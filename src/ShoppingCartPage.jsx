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
		this.getShoppingCart()
	}

	getShoppingCart() {
    const userID = this.props.match.params.user_id;
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
          <Typography component="h2" variant="h1" gutterBottom>
              Sample User Shopping Cart:
          </Typography>
          {this.state.cart.map((item, i) => <p> {item._id} </p>)}
          {this.state.cart.map((item, i) => <CardItem itemID={item._id}/>)}

      </div>
    )
  }

}

export default ShoppingCartPage