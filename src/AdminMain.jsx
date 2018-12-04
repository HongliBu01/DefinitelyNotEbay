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
      selectActive: 'all',
      listingSort: 'recentSort',
      startDate: '',
      endDate: '',
      filterFlag: 'all'
    };

    this.getItems = this.getItems.bind(this)
    this.getCategories = this.getCategories.bind(this)
    this.filterCategory = this.filterCategory.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.searchItems = this.searchItems.bind(this)
    this.getUser = this.getUser.bind(this)
    this.filterActive = this.filterActive.bind(this)
    this.endSort = this.endSort.bind(this)
    this.filterFlag = this.filterFlag.bind(this)
    this.filterTimeframe = this.filterTimeframe.bind(this)
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
          data.sort(function(a, b){return moment(a.endTime).isBefore(moment(b.endTime)) ? -1 : 1})
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
    const otherFilters = (this.state.flagged !== "all") || (this.state.startDate !== "" || this.state.endDate !== "")
    // Filter by active
    var currentItems = []
    if (activeType === "active_only") {
      if (otherFilters) {
        this.state.currentItems.map((item) => {
        if (moment(Date.now()).isBefore(moment(item.endTime))) {
          currentItems.push(item)
        }
        })
      } else {
        this.state.allItems.map((item) => {
        if (moment(Date.now()).isBefore(moment(item.endTime))) {
          currentItems.push(item)
        }
      })
      }
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

  endSort(listingSort) {
    if (listingSort === 'recentSort') {
      var allItems = this.state.allItems
      allItems.sort(function(a, b){return moment(a.endTime).isBefore(moment(b.endTime)) ? -1 : 1})
      this.setState({allItems})
    } else {
      var allItems = this.state.allItems
      allItems.sort(function(a, b){return moment(a.endTime).isBefore(moment(b.endTime)) ? 1 : -1})
      this.setState({allItems})
    }
  }

  filterFlag(filterFlag) {
    // Filter by flag
    var currentItems = []
    if (filterFlag === "flagged") {
      if (this.state.selectActive !== "all") {
        this.state.currentItems.map((item) => {
          if (item.reportFlag) {
            currentItems.push(item)
          }
        })
      } else {
        this.state.allItems.map((item) => {
          if (item.reportFlag) {
            currentItems.push(item)
          }
        })
      }
    }
    this.setState({currentItems})
  }

  filterTimeframe(timeframe, timeType) {
    // Filter by timeframe
    if (timeType === "start") {
      this.setState({startDate: timeframe})
    } else {
      this.setState({endDate: timeframe})
    }
    var currentItems = []
    if (this.state.selectActive !== "all") {
      this.state.currentItems.map((item) => {
        if (this.state.startDate !== "" && this.state.endDate !== "" && moment(item.endTime).isSameOrBefore(moment(this.state.endDate)) && moment(item.startTime).isSameOrAfter(moment(this.state.startDate))) {
          currentItems.push(item)
        } else if (this.state.startDate !== "" && moment(item.startTime).isSameOrAfter(moment(this.state.startDate))) {
          currentItems.push(item)
        } else if (this.state.endDate !== "" && moment(item.endTime).isSameOrBefore(moment(this.state.endDate))) {
          currentItems.push(item)
        }
      })
    } else {
      this.state.allItems.map((item) => {
        if (this.state.startDate !== "" && this.state.endDate !== "" && moment(item.endTime).isSameOrBefore(moment(this.state.endDate)) && moment(item.startTime).isSameOrAfter(moment(this.state.startDate))) {
          currentItems.push(item)
        } else if (this.state.startDate !== "" && moment(item.startTime).isSameOrAfter(moment(this.state.startDate))) {
          currentItems.push(item)
        } else if (this.state.endDate !== "" && moment(item.endTime).isSameOrBefore(moment(this.state.endDate))) {
          currentItems.push(item)
        }
      })
    }
    this.setState({currentItems})
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
    if (name === "filterFlag") {
      this.filterFlag(event.target.value)
    }
    if (name === "timeFrameStart") {
      this.filterTimeframe(event.target.value, "start")
    }
    if (name === "timeFrameEnd") {
      this.filterTimeframe(event.target.value, "end")
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
        value={this.state.selectActive}
        onChange={this.handleChange("selectActive")}
        inputProps={{
              name: 'active',
              id: 'active-simple',
            }}
      >
      <MenuItem key={'all'} value={'all'}> All Items </MenuItem>
      <MenuItem key={'active_only'} value={'active_only'}> Only Active </MenuItem>
      <MenuItem key={'inactive_only'} value={'inactive_only'}> Only Expired </MenuItem>
      <MenuItem key={'sold_only'} value={'sold_only'}> Only Sold </MenuItem>
      </Select>
      <InputLabel htmlFor="filled-recency-simple">Sort by Recency</InputLabel>
      <Select
        value={this.state.listingSort}
        onChange={this.handleChange("listingSort")}
        inputProps={{
              name: 'recency',
              id: 'recency-simple',
            }}
      >
      <MenuItem key={'recentSort'} value={'recentSort'}> Most Recent </MenuItem>
      <MenuItem key={'oldestSort'} value={'oldestSort'}> Oldest </MenuItem>
      </Select>
      <InputLabel htmlFor="filled-flag-simple">Flagged Items</InputLabel>
      <Select
        value={this.state.filterFlag}
        onChange={this.handleChange("filterFlag")}
        inputProps={{
              name: 'flag',
              id: 'flag-simple',
            }}
      >
      <MenuItem key={'all'} value={'all'}> Show All </MenuItem>
      <MenuItem key={'flagged'} value={'flagged'}> Only Flagged </MenuItem>
      </Select>
      <TextField
        id="date"
        label="Ending Time Start Range"
        type="date"
        defaultValue=""
        InputLabelProps={{
          shrink: true,
        }}
        value={this.state.startDate}
        onChange={this.handleChange("timeFrameStart")}
      />
      <TextField
        id="date"
        label="Ending Time End Range"
        type="date"
        defaultValue=""
        InputLabelProps={{
          shrink: true,
        }}
        value={this.state.endDate}
        onChange={this.handleChange("timeFrameEnd")}
      />
      <TextField
          id="standard-search"
          label="Search"
          type="search"
          margin="normal"
          onChange={this.handleChange("search")}
        />
      <div style={{margin: '10px'}}>
      {this.state.currentItems.length > 0 || this.state.selectedCategories.length > 0 || this.state.selectActive !== 'all' || this.state.filterFlag !== 'all' || this.state.endDate !== "" || this.state.startDate !== "" ? this.state.currentItems.map((item, i) => <CardItem key={item._id.$oid} itemID={item._id.$oid ? item._id.$oid : item._id} />) : this.state.allItems.map((item, i) => <CardItem key={item._id.$oid} itemID={item._id.$oid ? item._id.$oid : item._id} />)}
      </div>
      </div> : <p> You are not authorized to view this page </p>} </div>
    )
  }
}

export default withRouter(MainPage)
