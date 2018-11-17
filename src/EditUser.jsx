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


// TODO: Sanitize inputs
// TODO: passin userID from session
// TODO: Redirect to item page
// Not quite working...
class EditUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      _id: "",
      watchlist: [],
      cart: [],
      isAdmin: false,
      isActive: true
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.getUser();
  }

  getUser() {
    const userID = this.props.match.params.user_id
    fetch(`/api/users/${userID}`)
      .then(results => {
        return results.json()
      }).then(data => {
        console.log(data)
        this.setState({...data})
    })
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleSubmit() {
    const userID = "5beb3c55d5e788ace8a79665"

    fetch(`/api/users/${userID}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: this.state.email
      })
    }).then(results => {
        return results.json()
      }).then(data => {
          if (data._id) {
            this.setState({redirect: true})
          }
      });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to="/" />;
    }
    return(
      <div style={{ margin: '10px'}}>
        <h1>Edit Profile</h1>
        <form noValidate autoComplete="off">
          <TextField
            required
            label="Email"
            id="email"
            defaultValue={this.state.email}
            value={this.state.email}
            onChange={this.handleChange('email')}
          />
          <br />
      </form>
      <Button onClick={()=>this.handleSubmit()}> Submit </Button>
      </div>
    )
  }
}
export default withRouter(EditUser)