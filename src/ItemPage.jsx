import React from 'react'
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import moment from 'moment'
import socketIOClient from "socket.io-client"
import { withRouter, Redirect } from 'react-router'
import { connect, emit } from './Socket/socketConnect.js'

// TODO: Set up Report Item functionality
// TODO: Prevent adding to cart and watchlist multiple times
// TODO: Get user and don't allow bidding/buying if not active
class ItemPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemID: "",
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
      startPrice: "",
      bid: false,
      bidPrice: "",
      validBid: false,
      bidHistory: [],
      expired: false,
      remainingTime: "",
      profile: {},
      redirectToCart: false,
      redirectToMain: false,
      canEdit: false,
      isActive: false
    }
    this.getItem = this.getItem.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleBidChange = this.handleBidChange.bind(this)
    this.toggleBid = this.toggleBid.bind(this)
    this.handleBid = this.handleBid.bind(this)
    this.addToCart = this.addToCart.bind(this)
    this.addToWatchlist = this.addToWatchlist.bind(this)
    this.reportItem = this.reportItem.bind(this)
    this.handleEditSubmit = this.handleEditSubmit.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    this.toggleEdit = this.toggleEdit.bind(this)
    this.socketBid = this.socketBid.bind(this)
    this.socketUpdateBid = this.socketUpdateBid.bind(this)
    this.removeFromWatchlist = this.removeFromWatchlist.bind(this)
  }

  componentWillMount() {
    this.getItem();
    const { userProfile, getProfile } = this.props.auth
    if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({profile})
      })
    } else {
      this.setState({ profile: userProfile })
    }

    connect('bid',(message) => this.socketUpdateBid(message))
  }

  socketUpdateBid(data) {
    this.state.bidHistory.push(JSON.parse(data))
    this.setState({startPrice: JSON.parse(data).bidPrice})
  }

  socketBid() {
    const data = JSON.stringify({
        userID: this.state.profile.sub,
        bidPrice: this.state.bidPrice,
        bidTime: Date.now(),
        itemID: this.state.itemID
      })
    emit('bid', data)
  }

  getItem() {
    const itemID = this.props.match.params.id
    this.setState({itemID: itemID})
    fetch(`/api/items/${itemID}`)
      .then(results => {
        return results.json()
      }).then(data => {
        this.setState({...data})
        this.setState({bidHistory: data.bid_history})
        if (this.state.bidHistory.length > 0) {
          this.setState({startPrice: this.state.bidHistory[this.state.bidHistory.length-1].bidPrice})
        }
        if (moment(Date.now()).isAfter(moment(this.state.endTime))) {
          this.setState({expired: true})
        } else {
          const duration = moment.duration(moment(this.state.endTime).diff(moment(Date.now())))
          this.setState({remainingTime: duration.humanize()})
        }
        if (moment(Date.now()).isAfter(moment(this.state.startTime)) && moment(Date.now()).isBefore(moment(this.state.endTime))) {
          this.setState({isActive: true})
        } else {
          this.setState({isActive: false})
        }
    })
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  }

  handleBidChange(event) {
    this.setState({bidPrice: event.target.value})
    if (parseFloat(this.state.bidPrice) > parseFloat(this.state.startPrice)) {
      this.setState({validBid: true})
    } else {
      this.setState({validBid: false})
    }
  }

  toggleBid() {
    this.setState({bid: !this.state.bid})
  }

  handleBid() {
    // TODO: Validate in backend as well
    this.socketBid()
    // fetch(`/api/items/${this.state.itemID}/bid`, {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     userID: this.state.profile.sub,
    //     bidPrice: this.state.bidPrice,
    //     bidTime: Date.now()
    //   })
    // }).then(results => {
    //   return results.json()
    // }).then(data => {
    //     this.setState({startPrice: data.bidPrice})
    // })
  }

  addToCart(price) {
    const userID = this.state.profile.sub
    fetch(`/api/users/${userID}/cart`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _id: this.state.itemID,
        price: price,
        type: "buyNow"
      })
    }).then(results => {
      return results.json()
    }).then(data => {
        console.log(data)
        this.setState({redirectToCart: true})
    })
  }

  addToWatchlist() {
    const userID = this.state.profile.sub
    fetch(`/api/users/${userID}/watchlist`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _id: this.state.itemID
      })
    }).then(results => {
      return results.json()
    }).then(data => {
        console.log(data)
    })
  }

  removeFromWatchlist() {
        const itemID = this.state.itemID;
        const userID = this.state.profile.sub;
        this.setState({itemID: itemID,
                             userID: userID});
        fetch(`/api/users/${userID}/watchlist/${itemID}`,
            {method: "DELETE",})
            .then(results => {
                return results.json() // route definition says its the user object (server.py: 157)
            }).then(data => {
                this.setState({...data})
                console.log(data)
                location.reload()
                // refresh page was intended to make watchlist have new state. but may not necessary here.
        })
    }

  reportItem() {
    const itemID = this.state.itemID;
    fetch(`/api/items/${itemID}`, {
      method: "PUT",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reportFlag: true
      })
    }).then(results => {
      return results.json()
    }).then(data => {
      console.log(data)
    })
  }

  handleEditSubmit() {
    const itemID = this.state.itemID
    fetch(`/api/items/${itemID}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.state.name,
        description: this.state.description
      })
    }).then(results => {
        return results.json()
      }).then(data => {
          if (data._id) {
            this.setState({redirect: false})
          }
      });
  }

  deleteItem() {
    const itemID = this.state.itemID
    console.log('REMOVE ITEM', itemID)
    fetch(`/api/items/${itemID}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      })
    });
    this.setState({redirectToMain: true})
  }

  toggleEdit() {
    console.log(this.state.toggleEdit)
    this.setState({canEdit: !this.state.canEdit})
  }

  render() {
    if (this.state.redirectToCart) {
      return <Redirect push to={`/cart`} />;
    }
    if (this.state.redirectToMain) {
      return <Redirect push to={`/`} />;
    }
    console.log(this.state.itemID)
    console.log("is active:", this.state.isActive)
    return (

      <div>
      {this.state.name == "" ? <div><h1> Oops! The item doesn't exist :(</h1><img src="https://pixel.nymag.com/imgs/daily/intelligencer/2014/12/08/08-grumpy-cat.w330.h330.jpg"/></div> :
        <div>
        <h1>{this.state.name}</h1>

        <p> Quantity: {this.state.quantity}</p>
        {!this.state.isActive && !this.state.expired ? <p> Auction Starts: {moment(this.state.startTime).format("LLLL")} </p> : null }
        <p> Time Left: {this.state.expired ? "Auction has ended" : `${this.state.remainingTime}, ending at ${moment(this.state.endTime).format("LLLL")}`} </p>
        <p> Bid Price: ${this.state.startPrice} </p>
        <Button variant="contained" onClick={()=>this.toggleBid()} disabled={this.state.expired}> Bid </Button>
        {this.state.bid && !this.state.expired && this.state.profile ? <div><form autoComplete="off">
        <TextField
            required
            label="Bid Amount"
            id="bid_price"
            margin="dense"
            InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                $
              </InputAdornment>
            ),
          }}
            value={this.state.bidPrice}
            variant="outlined"
            onChange={(event)=>this.handleBidChange(event)}
          />

        </form>
        <Button variant="contained" onClick={()=>this.handleBid()} disabled={!this.state.validBid}> Make Bid </Button>
        </div>: null}
        {this.state.buyPrice !== "0.00" ? <div><p>Buy Price: ${this.state.buyPrice}</p><Button variant="contained" onClick={()=>this.addToCart(parseFloat(this.state.buyPrice) + parseFloat(this.state.shippingPrice))} disabled={!this.state.profile}> Buy Now </Button></div> : ""}
        <p> Shipping price: ${this.state.shippingPrice} </p>
        <h4>Description</h4>
        {this.state.description}
        <h4>Categories</h4>
        {this.state.categories}
        <br />
        <Button variant="contained" onClick={()=>this.addToWatchlist()}>Add to Watchlist </Button>
        {/*remove from watchlist*/}
        <Button variant="contained" onClick={()=>this.removeFromWatchlist()}>Remove from Watchlist</Button>
        <Button variant="contained" onClick={()=>this.reportItem()}>Report Item </Button>

        <p>
        {this.state.profile && this.state.seller === this.state.profile.sub && <Button variant="contained" onClick={()=>this.toggleEdit()}> Edit Listing </Button>}
         {this.state.canEdit &&
            <p>
            <div style={{ margin: '10px'}}>
              <h1>Edit Item</h1>
              <h2> Change Item Name </h2>
              <form noValidate autoComplete="off">
                <TextField
                  required
                  label="Name"
                  id="name"
                  defaultValue={this.state.name}
                  value={this.state.name}
                  onChange={this.handleChange('name')}
                />
                <br />
              </form>

              <h2> Change Item Description </h2>
              <form noValidate autoComplete="off">
                <TextField
                  required
                  label="Description"
                  id="description"
                  defaultValue={this.state.description}
                  value={this.state.description}
                  onChange={this.handleChange('description')}
                />
                <br />
            </form>
            <Button variant="contained" onClick={()=>this.handleEditSubmit()}> Submit </Button>
            </div>

            {this.state.profile && this.state.bid_history ? null :
              <div>
              <h1> Delete Item </h1>
              <Button variant="contained" onClick={()=>this.deleteItem()}> Delete </Button>
              </div>
            }
            </p>
        }
      </p>
      </div>
    }
      </div>
    )
  }
}

export default ItemPage
