import React from 'react'
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { withRouter, Redirect } from 'react-router';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';

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

// TODO: Separate out categories so pull existing categories
// TODO: Sanitize inputs
// TODO: Add userID
// TODO: Redirect to item page
class AddItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
      name: "",
      quantity: 1,
      startPrice: "0.00",
      buyPrice: "0.00",
      shippingPrice: "0.00",
      startTime: "",
      endTime: "",
      categories: "",
      redirect: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleSubmit() {
    // Split categories into array after cleaning
    const categories = this.state.categories.toLowerCase().split(",")
    for (var i = 0; i < categories.length; i++) {
      categories[i] = categories[i].trim()
    }
    fetch('/items', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: this.state.description,
        name: this.state.name,
        quantity: this.state.quantity,
        startPrice: this.state.startPrice,
        buyPrice: this.state.buyPrice,
        shippingPrice: this.state.shippingPrice,
        startTime: this.state.startTime,
        endTime: this.state.endTime,
        reportFlag: false,
        categories: categories
      })
    }).then(results => {
        return results.json()
      }).then(data => {
          if (data._id) {
            this.setState({redirect: true})
          }
      });
  }


  render() {
    if (this.state.redirect) {
      return <Redirect push to="/" />;
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
        <TextField
            required
            label="Categories"
            id="item_categories"
            defaultValue=""
            helperText="Separate multiple categories by commas"
            margin="dense"
            value={this.state.categories}
            onChange={this.handleChange('categories')}
          />
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