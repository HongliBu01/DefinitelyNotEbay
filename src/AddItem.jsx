import React from 'react'
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { withRouter, Redirect } from 'react-router';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

var moment = require('moment')

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});

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
// TODO: Sanitize inputs (prevent ending times in past)
// TODO: Add active flag.
class AddItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: "",
      description: "",
      name: "",
      quantity: 1,
      startPrice: "0.00",
      buyPrice: "0.00",
      shippingPrice: "0.00",
      startTime: moment().format('YYYY-MM-DDTHH:mm'),
      endTime: "",
      category: "",
      redirect: false,
      selectedCategories: [],
      availableCategories: [],
      invalidCategory: false,
      profile: {},
      invalidName: true,
      invalidQuantity: false,
      invalidStartPrice: false,
      invalidBuyPrice: false,
      invalidShippingPrice: false,
      invalidStartTime: false,
      invalidEndTime: true,
      isActive: true
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.addCategory = this.addCategory.bind(this);
  }

  componentWillMount() {
    this.getCategories()
    // Handle user details
    const { userProfile, getProfile } = this.props.auth
    if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({profile})
      })
    } else {
      this.setState({ profile: userProfile })
    }
  }
  getCategories() {
    fetch(`/api/categories`)
      .then(results => {
          return results.json()
      }).then(data => {
        this.setState({availableCategories: data.data})
    })
  }


  /* Validations
  - Must provide a name
  - Must provide a quantity (validate that it's an int > 0)
  - Validate starting bid price (float >= 0), default = 0
  - Buy now (float >= 0), default = 0
  - Shipping price (float >= 0), default = 0
  - Start time must be after now, if not set, default to current time
  - End time must be after start time
  */
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });

    // name must be provided
    if (name === "name") {
      if (event.target.value === "") {
        this.setState({invalidName: true})
      } else {
        this.setState({invalidName: false})
      }
    }

    // quantity must be an int > 0
    if (name === "quantity") {
      if (isNaN(event.target.value) || event.target.value != parseInt(Number(event.target.value)) || event.target.value <= 0) {
        this.setState({invalidQuantity: true})
      } else {
        this.setState({invalidQuantity: false})
      }
    }

    // startPrice must be a float >= 0
    if (name === "startPrice") {
      if (isNaN(event.target.value) || event.target.value < 0) {
        this.setState({invalidStartPrice: true})
      } else {
        this.setState({invalidStartPrice: false})
      }
    }

    // buyPrice must be a float >= 0
    if (name === "buyPrice") {
      if (isNaN(event.target.value) || event.target.value < 0) {
        this.setState({invalidBuyPrice: true})
      } else {
        this.setState({invalidBuyPrice: false})
      }
    }

    // shippingPrice must be a float >= 0
    if (name === "shippingPrice") {
      if (isNaN(event.target.value) || event.target.value < 0) {
        this.setState({invalidShippingPrice: true})
      } else {
        this.setState({invalidShippingPrice: false})
      }
    }

    // startTime must be on or after current time
    if (name === "startTime") {
      if (moment(event.target.value).isBefore()) {
        this.setState({invalidStartTime: true})
      } else {
        this.setState({invalidStartTime: false})
      }

      if (moment(event.target.value).isAfter()) {
        this.setState({isActive: false})
      } else {
        this.setState({isActive: true})
      }
    }

    // endTime must be after startTime
    if (name === "endTime") {
      if (moment(event.target.value).isSameOrBefore(moment(this.state.startTime))) {
        this.setState({invalidEndTime: true})
      } else {
        this.setState({invalidEndTime: false})
      }
    }

    // category duplicates not allowed
    if (name === "category") {
      if (this.state.availableCategories.indexOf(event.target.value) !== -1) {
        this.setState({invalidCategory: false})
      } else {
        this.setState({invalidCategory: true})
      }
    }



  };

  handleSubmit() {
    // TODO: Handle check if auction is currently active (current time between start time and end time)
    fetch('/api/items', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        seller: this.state.profile.sub,
        description: this.state.description,
        name: this.state.name,
        quantity: this.state.quantity,
        startPrice: this.state.startPrice,
        buyPrice: this.state.buyPrice,
        shippingPrice: this.state.shippingPrice,
        startTime: this.state.startTime,
        endTime: this.state.endTime,
        reportFlag: false,
        categories: this.state.selectedCategories,
        soldFlag: false,
        activeFlag: this.state.active
      })
    }).then(results => {
        return results.json()
      }).then(data => {
          if (data._id) {
            this.setState({_id: data._id.$oid})
            this.setState({redirect: true})
          }
      });
  }

  addCategory() {
    var newCategories = this.state.availableCategories
    newCategories.push(this.state.category)
    var selectedCategories = this.state.selectedCategories
    selectedCategories.push(this.state.category)
    this.setState({availableCategories: newCategories})
    this.setState({selectedCategories: selectedCategories})
    // Add to global list of categories
    fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state.category)
    }).then(results => {
        return results.json()
      });
    this.setState({category: ""})
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to={`/item/${this.state._id}`} />;
    }
    console.log(this.state.invalidName)
    return(
      <div style={{ margin: '10px'}}>
        <h1>Add an Item</h1>
        <form noValidate autoComplete="off">
          <TextField
            required
            label="Name"
            id="item_name"
            defaultValue=""
            margin="dense"
            value={this.state.name}
            onChange={this.handleChange('name')}
          />
          <br />
          <TextField
            required
            label="Quantity"
            id="item_quantity"
            defaultValue="1"
            margin="dense"
            value={this.state.quantity}
            onChange={this.handleChange('quantity')}
          />
          <br />
          <TextField
            required
            label="Starting Bid Price"
            id="item_start_price"
            defaultValue="0.00"
            margin="dense"
            InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                $
              </InputAdornment>
            ),
          }}
            value={this.state.startPrice}
            onChange={this.handleChange('startPrice')}
          />
          <br />
          <TextField
            label="Buy Now Price"
            id="item_buy_price"
            defaultValue="0.00"
            margin="dense"
            InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                $
              </InputAdornment>
            ),
          }}
            value={this.state.buyPrice}
            onChange={this.handleChange('buyPrice')}
          />
          <br />
          <TextField
            label="Shipping Cost"
            id="item_shipping"
            defaultValue="0.00"
            margin="dense"
            InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                $
              </InputAdornment>
            ),
          }}
            value={this.state.shippingPrice}
            onChange={this.handleChange('shippingPrice')}
          />
          <br />
          <TextField
          required
          id="start_date_time"
          label="Start Day and Time"
          type="datetime-local"
          InputLabelProps={{
            shrink: true,
          }}
          value={this.state.startTime}
          onChange={this.handleChange('startTime')}
        />
          <br />
          <TextField
          required
          id="end_date_time"
          label="End Day and Time"
          type="datetime-local"
          InputLabelProps={{
            shrink: true,
          }}
          value={this.state.endTime}
          onChange={this.handleChange('endTime')}
        />
        <br />
          <InputLabel htmlFor="select-multiple-chip">Categories </InputLabel>
          <Select
            multiple
            value={this.state.selectedCategories}
            onChange={this.handleChange('selectedCategories')}
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
            {this.state.availableCategories.map(name => (
              <MenuItem key={name} value={name}> {name}
              </MenuItem>
            ))}
          </Select>
        <br />
        <TextField
            label="Add New Category"
            id="item_categories"
            defaultValue=""
            margin="dense"
            value={this.state.category}
            onChange={this.handleChange('category')}
          />
          <Button disabled={!this.state.invalidCategory} onClick={()=>this.addCategory()}> Add Category </Button>
          {!this.state.invalidCategory && this.state.category.length > 0 ? "Category already exists" : null}
          <br />
          <TextField
            id="standard-multiline-flexible"
            label="Description"
            multiline
            rowsMax="4"
            value={this.state.description}
            onChange={this.handleChange('description')}
            margin="dense"
          />
      </form>
      <Button disabled={this.state.invalidName || this.state.invalidQuantity || this.state.invalidStartPrice || 
        this.state.BuyPrice || this.state.invalidShippingPrice || this.state.invalidStartTime} onClick={()=>this.handleSubmit()}> Submit </Button>
      {this.state.invalidName ? <div><font color="red">Item name cannot be empty</font></div> : null}
      {this.state.invalidQuantity ? <div><font color="red">Quantity must be an integer value greater than 0</font></div> : null}
      {this.state.invalidStartPrice ? <div><font color="red">Start Price must be a numeric value greater than or equal to 0</font></div> : null}
      {this.state.invalidBuyPrice ? <div><font color="red">Buy Price is optional, but if set, it must be a numeric value greater than 0</font></div> : null}
      {this.state.invalidShippingPrice ? <div><font color="red">Shipping Price must be a numeric value greater than or equal to 0</font></div> : null}
      {this.state.invalidStartTime ? <div><font color="red">Start Time must be now, or some time after now</font></div> : null}
      {this.state.invalidEndTime ? <div><font color="red">End Time must be set to some time after Start Time</font></div> : null}
      {console.log("Is active:", this.state.isActive)}
      </div>
    )
  }
}
export default withRouter(AddItem)