import React from 'react'
import ReactDOM from 'react-dom';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import CardItem from './CardItem.jsx'


class BidHistoryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        profile: {},
        bids:[]
    };
    this.getBids = this.getBids.bind(this)
  }

  componentWillMount() {
     const { userProfile, getProfile } = this.props.auth;
     if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({profile});
        this.getBids(profile.sub)
      })
     } else {
       this.setState({ profile: userProfile });
       this.getBids(userProfile.sub)
     }
     // this.getWatchList() why here is not OK? -- gets "undefined"
  }

  getBids(userID) {
    fetch(`/api/users/${userID}/bid_history`)
      .then(results => {
        return results.json()
      }).then(data => {
        var bids = []
        for (var key in data) {
          var bid = {}
          bid["id"] = key
          bid["bids"] = data[key]
          bids.push(bid)
        }
        this.setState({bids})
    })
  }

  render() {
    console.log("BIDS", this.state.bids);
    return (
      <div>
        <h2>Bid History</h2>
        {this.state.bids.length === 0 ? <p> No bids </p> : <div>
        {this.state.bids.map((bid) =>
          <div>
          <p> Bids: {bid["bids"].join(", ")} </p>
          <CardItem showBought={true} itemID={bid["id"]}/>
          </div>
        )}
        </div>}
      </div>
    )
  }
}

export default BidHistoryPage