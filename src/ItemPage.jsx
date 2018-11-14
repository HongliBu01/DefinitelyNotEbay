import React from 'react'
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';

// TODO: Set up button functionality
// TODO: Handle time. Use moment
class ItemPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
      name: "",
      quantity: 1,
      buyPrice: "",
      categories: [],
      endTime: "",
      reportFlag: false,
      shippingPrice: "",
      startTime: "",
      id: "",
      startPrice: ""
    }
    this.getItem = this.getItem.bind(this)
  }

  componentWillMount() {
    this.getItem();
  }

  getItem() {
    const itemID = this.props.match.params.id
    fetch(`/api/items/${itemID}`)
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
        <h1>{this.state.name}</h1>
        <p> Quantity: {this.state.quantity}</p>
        <p> Time: {this.state.startTime} - {this.state.endTime} </p>
        <p> Bid Price: {this.state.startPrice} </p>
        <Button variant="contained"> Bid </Button>
        {this.state.buyPrice !== "0.00" ? <div><p>Buy Price: ${this.state.buyPrice}</p><Button variant="contained"> Buy Now </Button></div> : ""}
        <p> Shipping price: ${this.state.shippingPrice} </p>
        <h4>Description</h4>
        {this.state.description}
        <h4>Categories</h4>
        {this.state.categories}
      </div>
    )
  }
}
export default ItemPage