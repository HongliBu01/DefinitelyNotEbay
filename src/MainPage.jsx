import React from 'react'
import ReactDOM from 'react-dom'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allItems: [],
<<<<<<< HEAD
=======
      allUsers: [],
      cartItems: [],
      watchlistItems: [],
>>>>>>> master
    };
    this.getItems = this.getItems.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.getCart = this.getCart.bind(this);
    this.getWatchlist = this.getWatchlist.bind(this);
  }

  componentWillMount() {
    this.getItems();
    this.getUsers();
    this.getCart();
    this.getWatchlist();
  }

  getItems() {
<<<<<<< HEAD
    fetch('/items')
=======
    fetch('/api/items')
>>>>>>> master
      .then(results => {
        return results.json()
      }).then(data => {
          console.log(data)
          this.setState({allItems: data})
      });
  }

<<<<<<< HEAD
=======
  getUsers() {
    fetch('/api/users')
      .then(results => {
        return results.json()
      }).then(data => {
        console.log(data)
        this.setState({allUsers: data})
      })
  }

  getCart() {
    fetch('/api/users/5bdd060508ffae36201e3a79/cart') // TODO: URL Parsing, get correct userID
      .then(results => {
        return results.json()
      }).then(data => {
        console.log(data)
        this.setState({cartItems: data})
      })
  }

  getWatchlist() {
    fetch('/api/users/5bdd060508ffae36201e3a79/cart') // TODO: URL Parsing
      .then(results => {
        return results.json()
      }).then(data => {
        console.log(data)
        this.setState({watchlistItems: data})
      })
  }
//{`/item/${item._id.$oid ? item._id.$oid : item._id}`}
>>>>>>> master
  render() {
    return (
      <div>
      <h1>THIS IS MAIN PAGE</h1>
      <ul>
<<<<<<< HEAD
        {this.state.allItems.map(item => <li> {item.name || "Unnamed"}</li>)}
=======
        {this.state.allItems.map((item, i) => <li key={i}> {item.name || "Unnamed"} <Link to={`/item/${item._id.$oid ? item._id.$oid : item._id}`}>Link</Link> </li>)}
      </ul>
      <h3>These are users</h3>
      <ul>
        {this.state.allUsers.map((user, i) => <li key={`user_${i}`}> {user.name || "nullitem"}</li>)}
      </ul>
      <h3>This is the cart</h3>
      <ul>
        {this.state.cartItems.map((item, i) => <li key={`cart_${i}`}> {item.name || "nullitem"}</li>)}
      </ul>
      <h3>This is the watchlist</h3>
      <ul>
        {this.state.watchlistItems.map((item, i) => <li key={`watch_${i}`}> {item.name || "nullitem"}</li>)}
>>>>>>> master
      </ul>
      </div>
    )
  }
}

export default withRouter(MainPage)
