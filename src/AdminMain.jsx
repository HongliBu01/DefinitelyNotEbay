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
      search: "",
      profile: {},
      activeType: 'all',
      sortType: 'recentSort'
    };

    this.getItems = this.getItems.bind(this)
    this.getCategories = this.getCategories.bind(this)
    this.filterCategory = this.filterCategory.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.searchItems = this.searchItems.bind(this)
    this.getUser = this.getUser.bind(this)
    this.filterActive = this.filterActive.bind(this)
    this.endSort = this.endSort.bind(this)
  }

  componentWillMount() {
    this.getItems();
    this.getCategories();
    // Handle user details
    const { userProfile, getProfile } = this.props.auth
    if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({profile})
        this.getUser(profile.sub)
      })
    } else {
      this.setState({ profile: userProfile })
      this.getUser(userProfile.sub)
    }
  }

  getUser(userID) {
    fetch(`/api/users/${userID}`)
      .then(results => {
        return results.json()
      }).then(data => {
        console.log(data)
        this.setState({...data})
    })
  }

  getItems() {
    fetch('/api/items')
      .then(results => {
        return results.json()
      }).then(data => {
          console.log(data)
          data.sort(function(a, b){return moment(a.endTime).isBefore(moment(b.endTime)) ? -1 : 1})
          console.log("Sorted", data)
          this.setState({allItems: data})
      });
  }

  getCategories() {
    fetch(`/api/categories`)
      .then(results => {
          return results.json()
      }).then(data => {
        this.setState({categories: data.data})
    })
  }


  filterActive(activeType) {
    // Filter by active
    var currentItems = []
    if (activeType === "active_only") {
      this.state.allItems.map((item) => {
        if (moment(Date.now()).isBefore(moment(item.endTime))) {
          currentItems.push(item)
        }
      })
    } else if (activeType === "all") {
      // Do nothing
    } else if (activeType === "inactive_only") {
      // Inactive only
      this.state.allItems.map((item) => {
        if (moment(Date.now()).isAfter(moment(item.endTime))) {
          currentItems.push(item)
        }
      })
    } else {
      // Sold only
      this.state.allItems.map((item) => {
        if (item.soldFlag) {
          currentItems.push(item)
        }
      })
    }
    this.setState({currentItems})

  }

  endSort(sortType) {
    //Sort by recent ending
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
    if (name === "selectActive") {
      this.filterActive(event.target.value)
    }
    if (name === "listingSort") {
      this.endSort(event.target.value)
    }
  }

  searchItems(searchTerm) {
    var currentItems = []
    if (this.state.selectedCategories.length > 0 || this.state.selectActive !== "all") {
      this.state.currentItems.forEach((item) => {
        if (item.name.toLowerCase().startsWith(searchTerm.toLowerCase())) {
          currentItems.push(item)
        }
      })
    } else {
      this.state.allItems.forEach((item) => {
        if (item.name.toLowerCase().startsWith(searchTerm.toLowerCase())) {
          currentItems.push(item)
        }
      })
    }
    this.setState({currentItems})
  }

  filterCategory(selectedCategories) {
    var currentItems = []
    if (this.state.selectActive !== "all") {
      this.state.allItems.forEach((item) => {
      if (selectedCategories.filter(value => -1 !== item.categories.indexOf(value)).length > 0) {
        currentItems.push(item)
      }
      })
    } else {
      this.state.currentItems.forEach((item) => {
      if (selectedCategories.filter(value => -1 !== item.categories.indexOf(value)).length > 0) {
        currentItems.push(item)
      }
      })
    }

    this.setState({currentItems})
  }
  render() {
    // const {profile} = this.state
    return (
      <div>
      {this.state.isAdmin ? <div>
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
      <InputLabel htmlFor="select-multiple-chip">Active Items</InputLabel>
      <Select
        value={this.state.activeType}
        onChange={this.handleChange("selectActive")}
      >
      <MenuItem key={'all'} value={'all'}> All Items </MenuItem>
      <MenuItem key={'active_only'} value={'active_only'}> Only Active </MenuItem>
      <MenuItem key={'inactive_only'} value={'inactive_only'}> Only Expired </MenuItem>
      <MenuItem key={'sold_only'} value={'sold_only'}> Only Sold </MenuItem>
      </Select>
      <Select
        value={this.state.sortType}
        onChange={this.handleChange("listingSort")}
      >
      <MenuItem key={'recentSort'} value={'recentSort'}> Most Recent </MenuItem>
      <MenuItem key={'oldestSort'} value={'oldestSort'}> Oldest </MenuItem>
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
      </div> : <p> You are not authorized to view this page </p>} </div>
    )
  }
}

export default withRouter(MainPage)
