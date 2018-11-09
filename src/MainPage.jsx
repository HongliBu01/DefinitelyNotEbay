import React from 'react'
import ReactDOM from 'react-dom';
import {withRouter} from 'react-router'

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allItems: [],
    };
    this.getItems = this.getItems.bind(this);
  }

  componentWillMount() {
    this.getItems();
  }

  getItems() {
    fetch('/items')
      .then(results => {
        return results.json()
      }).then(data => {
          console.log(data)
          this.setState({allItems: data})
      });
  }

  render() {
    return (
      <div>
      <h1>THIS IS MAIN PAGE</h1>
      <ul>
        {this.state.allItems.map((item, i) => <li key={i}> {item.name || "Unnamed"}</li>)}
      </ul>
      </div>
    )
  }
}
export default withRouter(MainPage)