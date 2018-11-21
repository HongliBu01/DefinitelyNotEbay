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
      startTime: "",
      endTime: "",
      category: "",
      redirect: false,
      selectedCategories: [],
      availableCategories: [],
      invalidCategory: false,
      profile: {}
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

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
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
        categories: this.state.selectedCategories
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
      <Button onClick={()=>this.handleSubmit()}> Submit </Button>
      </div>
    )
  }
}
export default withRouter(AddItem)