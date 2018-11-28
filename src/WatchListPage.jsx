import React from 'react'
import ReactDOM from 'react-dom';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import CardItem from './CardItem.jsx'


class WatchListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        profile: {},
        watchlist:[]
    };
    this.getWatchList = this.getWatchList.bind(this)
  }

  componentWillMount() {
      // TODO: getItems() here?
     const { userProfile, getProfile } = this.props.auth;
     if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({profile});
        this.getWatchList()
      })
     } else {
       this.setState({ profile: userProfile });
       this.getWatchList()
     }
     // this.getWatchList() why here is not OK? -- gets "undefined"
  }

  getWatchList() {
    const userID = this.state.profile.sub;
      console.log(userID);
    fetch(`/api/users/${userID}/watchlist`)
      .then(results => {
        return results.json()
      }).then(data => {
        console.log("WATCH", data)
        this.setState({watchlist: data})
    })
  }

  render() {
    return (
      <div>
          <Typography component="h2" variant="h1" gutterBottom>
              This is your Watchlist:
          </Typography>
          {this.state.watchlist.map((item, i) => <CardItem showBought={true} itemID={item._id}/>)}

      </div>
    )
  }
}

export default WatchListPage