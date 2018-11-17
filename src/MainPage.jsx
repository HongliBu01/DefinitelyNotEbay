import React from 'react'
import ReactDOM from 'react-dom'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import CardItem from "./CardItem.jsx"
import Chip from '@material-ui/core/Chip'
import Input from '@material-ui/core/Input'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import TextField from '@material-ui/core/TextField';
import moment from 'moment'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allItems: [],
      allUsers: [],
      cartItems: [],
      watchlistItems: [],
      currentItems: [],
      categories: [],
      selectedCategories: [],
      search: ""
    };

    this.getItems = this.getItems.bind(this)
    this.getUsers = this.getUsers.bind(this)
    this.getCart = this.getCart.bind(this)
    this.getWatchlist = this.getWatchlist.bind(this)
    this.getCategories = this.getCategories.bind(this)
    this.filterCategory = this.filterCategory.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.searchItems = this.searchItems.bind(this)
  }

  componentWillMount() {
    this.getItems();
    this.getUsers();
    this.getCart();
    this.getWatchlist();
    this.getCategories();
  }

  getItems() {
    fetch('/api/items')
      .then(results => {
        return results.json()
      }).then(data => {
          console.log(data)
          var allItems = []
          // Hide expired items
          data.map((item) => {
            if (moment(Date.now()).isBefore(moment(item.endTime))) {
              allItems.push(item)
            }
          })
          this.setState({allItems: allItems})
      });
  }

  getUsers() {
    fetch('/api/users')
      .then(results => {
        return results.json()
      }).then(data => {
        console.log(data)
        this.setState({allUsers: data})
      })
  }

  getCategories() {
    fetch(`/api/categories`)
      .then(results => {
          return results.json()
      }).then(data => {
        this.setState({categories: data.data})
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

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })
    if (name === "selectedCategories") {
      this.filterCategory(event.target.value)
    }
    if (name === "search") {
      this.searchItems(event.target.value)
    }
  }

  searchItems(searchTerm) {
    var currentItems = []
    if (this.state.selectedCategories.length > 0) {
      this.state.currentItems.forEach((item) => {
        if (item.name.toLowerCase().startsWith(searchTerm.toLowerCase())) {
          currentItems.push(item)
        }
      })
    } else {
      this.state.allItems.forEach((item) => {
        console.log(item)
        if (item.name.toLowerCase().startsWith(searchTerm.toLowerCase())) {
          currentItems.push(item)
        }
      })
    }
    this.setState({currentItems})
    // console.log(currentItems)
  }

  filterCategory(selectedCategories) {
    var currentItems = []
    this.state.allItems.forEach((item) => {
      if (selectedCategories.filter(value => -1 !== item.categories.indexOf(value)).length > 0) {
        currentItems.push(item)
      }
    })
    this.setState({currentItems})
    console.log("CURRENT ITEMS", currentItems)
  }
//{`/item/${item._id.$oid ? item._id.$oid : item._id}`}
  render() {
    return (
      <div>
      <InputLabel htmlFor="select-multiple-chip">Categories </InputLabel>
      <Select
        multiple
        value={this.state.selectedCategories}
        onChange={this.handleChange("selectedCategories")}
        input={<Input id="select-multiple-chip" />}
        renderValue={selected => (
          <div>
            {selected.map(value => (
              <Chip key={value} label={value} />
            ))}
          </div>
        )}
        MenuProps={MenuProps}
      >
        {this.state.categories.map(name => (
          <MenuItem key={name} value={name}> {name}
          </MenuItem>
        ))}
      </Select>
      <TextField
          id="standard-search"
          label="Search"
          type="search"
          margin="normal"
          onChange={this.handleChange("search")}
        />
      <div style={{margin: '10px'}}>
      {this.state.currentItems.length > 0 || this.state.selectedCategories.length > 0 ? this.state.currentItems.map((item, i) => <CardItem key={item._id.$oid} itemID={item._id.$oid ? item._id.$oid : item._id} />) : this.state.allItems.map((item, i) => <CardItem key={item._id.$oid} itemID={item._id.$oid ? item._id.$oid : item._id} />)}
      </div>
      <h3>These are users</h3>
      <ul>
        {this.state.allUsers.map((user, i) => <li key={`user_${i}`}> {user.email || "nullitem"}
        <Link to={`/users/${user._id}`}> Link</Link> </li>)}
      </ul>
      <h3>This is the cart</h3>
      <ul>
        {this.state.cartItems.map((item, i) => <li key={`cart_${i}`}> {item.name || "nullitem"}</li>)}
      </ul>
      <h3>This is the watchlist</h3>
      <ul>
        {this.state.watchlistItems.map((item, i) => <li key={`watch_${i}`}> {item.name || "nullitem"}</li>)}
      </ul>
        <h3>
            <Link to={`/users/5beb3c55d5e788ace8a79665/watchlist`}>To Sample User Watchlist</Link>
        </h3>
      </div>
    )
  }
}

export default withRouter(MainPage)
