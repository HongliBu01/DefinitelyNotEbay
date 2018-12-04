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
import moment from 'moment'


class ContactPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      _id: "",
      name: "",
      subject: "",
      message: "",
      submittime: moment().format('YYYY-MM-DDTHH:mm'),
      profile: {}
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getUser = this.getUser.bind(this);
  }

  componentWillMount() {
    // Handle user details
    const { userProfile, getProfile } = this.props.auth
    if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({profile})
        this.getUser(profile.sub)
      })
    } else {
      this.setState({ profile: userProfile })
      this.getUser(userProfile.sub)
    }
  }

  getUser(userID) {
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
    const userID = this.state._id
    fetch(`/api/feedback`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.email,
        name: this.state.name,
        id: this.state._id,
        subject: this.state.subject,
        message: this.state.message,
        submittime: this.state.submittime
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
        <h1>Contact Page</h1>
        <form noValidate autoComplete="off">
          <TextField
            required
            label="Name"
            id="name"
            value={this.state.name}
            onChange={this.handleChange('name')}
          />
          <br />
          <TextField
            required
            id="subject"
            label="Subject"
            value={this.state.subject}
            onChange={this.handleChange('subject')}
          />
          <br />
          <TextField
            required
            id="message"
            label="Message"
            fullWidth={true}
            multiline={true}
            rows={5}
            value={this.state.message}
            onChange={this.handleChange('message')}
          />
          <br />

      </form>
      <Button onClick={()=>this.handleSubmit()}> Submit </Button>
      </div>
    )
  }
}
export default withRouter(ContactPage)
