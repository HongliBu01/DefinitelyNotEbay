import React from 'react'
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';

/* TODO
    cart = fields.Nested(ItemListSchema)
    watchlist = fields.Nested(ItemListSchema)
    order_history = fields.List(fields.Nested(ItemListSchema))  # list of carts
    item_history = fields.List(fields.Str())  # list of ItemIds
*/

class Profile extends React.Component {

	constructor(props) {
	  super(props);
	  this.state = {
	    email: "",
	    id: "",
	    password: "",
	    username: "",
	    address: "",
	    isAdmin: false,
	    isSuspended: false
	  }
	  this.getUser = this.getUser.bind(this)
	}

	componentWillMount() {
	  this.getUser();
	}


	getUser() {
	  const userID = this.props.match.params.id
	  fetch(`/api/users/${userID}`)
	    .then(results => {
	      return results.json()
	    }).then(data => {
	      console.log(data)
	      this.setState({...data})
	  })
	}


  render() {
    return <h1>User Profile</h1>
  }
}





export default Profile