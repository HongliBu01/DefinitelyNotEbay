import React from 'react'
import ReactDOM from 'react-dom';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { withRouter, Redirect } from 'react-router';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

class AdminSupportPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allFeedback: [],
    };
    this.getFeedback = this.getFeedback.bind(this);
  }

  componentWillMount() {
    this.getFeedback()
  }

  getFeedback() {
    fetch('/api/feedback')
      .then(results => {
        return results.json()
      }).then(data => {
          console.log(data)
          this.setState({allFeedback:data})
      });
      console.log(this.state.allFeedback);
  }


  render() {
    return (
      <div>
      {this.state.allFeedback.map((feedback) => 
        <div style={{margin: '10px'}}> 
        <h2>"{feedback.subject}"</h2>
        <p><b>Name:</b> {feedback.name}</p>
        <p><b>Email:</b> {feedback.email}</p>
        <p><b>User ID:</b> {feedback.id}</p>
        <p><b>Time Submitted:</b> {feedback.submittime}</p>        
        <p><b>Message:</b> {feedback.message}</p>
        <br/>
        </div>
      )}
      </div>
    )
  }
}
export default withRouter(AdminSupportPage)


    /*{for (var i in this.state.allFeedback) {
      <div style={{margin: '10px'}}>
        ${this.state.allFeedback[i].name}
      </div>
      }}*/
    // return null