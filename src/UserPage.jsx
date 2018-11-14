import React from 'react'
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';


/*
 email = fields.Email(required=True)
    password = fields.Str(required=True)

    user_id = fields.Str(required=True)  # mongo-generated hash string, primary key
    username = fields.Str(required=True)
    shipping_address = fields.Str()
    is_admin = fields.Boolean(default=False)
    is_suspended = fields.Boolean(default=False)

    cart = fields.Nested(ItemListSchema)
    watchlist = fields.Nested(ItemListSchema)
    order_history = fields.List(fields.Nested(ItemListSchema))  # list of carts
    item_history = fields.List(fields.Str())  # list of ItemIds


  ITEM
    seller_id = fields.Str()  # seller id
    current_price = fields.Float()
    bid_history = fields.List(fields.Nested(BidSchema))

*/

// TODO: Set up button functionality
// TODO: Handle time. Use moment
class UserPage extends React.Component {
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
    return (
      <div>
        <h1>{this.state.username}</h1>
        <p> Email: {this.state.email}</p>
        <p> Address: {this.state.address} </p>
      </div>
    )
  }
}
export default UserPage