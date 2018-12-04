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
        bids:{}
    };
    this.getBids = this.getBids.bind(this)
  }

  componentWillMount() {
     const { userProfile, getProfile } = this.props.auth;
     if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({profile});
        this.getBids()
      })
     } else {
       this.setState({ profile: userProfile });
       this.getBids()
     }
     // this.getWatchList() why here is not OK? -- gets "undefined"
  }

  getBids() {
    const userID = this.state.profile.sub;
      console.log(userID);
    fetch(`/api/users/${userID}/bid_history`)
      .then(results => {
        return results.json()
      }).then(data => {
        console.log("BIDS", data);
        this.setState({bids: data})
    })
  }

  render() {
    return (
      <div>
          <Typography component="h2" variant="h1" gutterBottom>
              This is your Watchlist:
          </Typography>
          {this.state.bids.map((item, i) => <CardItem showBought={true} itemID={item._id}/>)}

      </div>
    )
  }
}

export default BidHistoryPage