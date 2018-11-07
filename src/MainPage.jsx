import React from 'react'
import ReactDOM from 'react-dom';

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allItems = [],
    };
    this.getItems = this.getItems.bind(this);
  }

  componentWillMount() {
    this.getItems();
  }

  getItems() {
    fetch('/items').then(
      results => {
        console.log(results)
        return results.json()
      }).then(
        data => {
          console.log(data)
          this.setState({allItems: data})
        });
  }


  render() {
    return (
      <div>
      <h1>THIS IS MAIN PAGE</h1>
      <ul>
        {console.log(this.state.data)}
      </ul>
      </div>
    )
  }
}
export default MainPage