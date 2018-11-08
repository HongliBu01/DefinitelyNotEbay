import React from 'react'
import ReactDOM from 'react-dom';

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allItems: [],
      allUsers: [],
      cartItems: [],
      watchlistItems: [],
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
    fetch('/items')
      .then(results => {
        return results.json()
      }).then(data => {
          console.log(data)
          this.setState({allItems: data})
      });
  }

  getUsers() {
    fetch('/users')
      .then(results => {
        return results.json()
      }).then(data => {
        console.log(data)
        this.setState({allUsers: data})
      })
  }

  getCart() {
    fetch('/users/5bdd060508ffae36201e3a79/cart') // TODO: URL Parsing, get correct userID
      .then(results => {
        return results.json()
      }).then(data => {
        console.log(data)
        this.setState({cartItems: data})
      })
  }

  getWatchlist() {
    fetch('/users/5bdd060508ffae36201e3a79/cart') // TODO: URL Parsing
      .then(results => {
        return results.json()
      }).then(data => {
        console.log(data)
        this.setState({watchlistItems: data})
      })
  }

  render() {
    return (
      <div>
      <h1>THIS IS MAIN PAGE</h1>
      <ul>
        {this.state.allItems.map(item => <li> {item.name || "Unnamed"}</li>)}
      </ul>
      <h3>These are users</h3>
      <ul>
        {this.state.allUsers.map(user => <li> {user.name || "nullitem"}</li>)}
      </ul>
      <h3>This is the cart</h3>
      <ul>
        {this.state.cartItems.map(item => <li> {item.name || "nullitem"}</li>)}
      </ul>
      <h3>This is the watchlist</h3>
      <ul>
        {this.state.watchlistItems.map(item => <li> {item.name || "nullitem"}</li>)}
      </ul>
      </div>
    )
  }
}
export default MainPage
