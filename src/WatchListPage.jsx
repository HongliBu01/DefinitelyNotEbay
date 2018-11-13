import React from 'react'
import ReactDOM from 'react-dom';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import CardItem from './CardItem.jsx'


class WatchListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        watchlist:[]
    };
    this.getWatchList = this.getWatchList.bind(this)
  }

  componentWillMount() {
    this.getWatchList();
  }

  getWatchList() {
    const userID = this.props.match.params.user_id;
    fetch(`/api/users/${userID}/watchlist`)
      .then(results => {
        return results.json()
      }).then(data => {
        console.log(data);
        this.setState({watchlist: data})
        console.log(this.state.watchlist)
    })
  }

  render() {
    return (
      <div>
          <Typography component="h2" variant="h1" gutterBottom>
              This is your Watchlist:
          </Typography>
          {this.state.watchlist.map((item, i) => <p> {item._id} </p>)}
          {this.state.watchlist.map((item, i) => <CardItem itemID={item._id}/>)}

      </div>
    )
  }
}

export default WatchListPage