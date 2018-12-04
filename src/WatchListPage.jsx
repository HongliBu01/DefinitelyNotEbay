import React from 'react'
import ReactDOM from 'react-dom';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import CardItem from './CardItem.jsx'


class WatchListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        profile: {},
        watchlist:[]
    };
    this.getWatchList = this.getWatchList.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
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

  deleteItem(id, index) {
    const userID = this.state.profile.sub;
    fetch(`/api/users/${userID}/watchlist`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(id)
    }).then(results => {
        return results.json()
      }).then(data => {
        //POST
        var watchlist = this.state.watchlist
        var deleted = watchlist.splice(index, 1)
        this.setState({watchlist})
      });
  }

  render() {
    return (
      <div>
          <h2> Watchlist </h2>
          <p> If item name is not shown, item has been bought </p>
          {this.state.watchlist.length === 0 ? <p> Nothing in watchlist </p> :
          <div>{this.state.watchlist.map((item, i) => <div><CardItem showBought={true} itemID={item._id}/><Button onClick={()=>this.deleteItem(item._id, i)}>Delete </Button></div>)}</div>
        }
      </div>
    )
  }
}

export default WatchListPage