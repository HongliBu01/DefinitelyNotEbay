import React from 'react'
import ReactDOM from 'react-dom'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class CategoryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      profile: {},
      newCategory: "",
      toggleNew: false,
      canEdit: false,
      editCatInd: "",
      editCat: ""
    };
    this.getCategories = this.getCategories.bind(this)
    this.toggleNew = this.toggleNew.bind(this)
    this.addNewCategory = this.addNewCategory.bind(this)
    this.deleteCategory = this.deleteCategory.bind(this)
    this.editCategory = this.editCategory.bind(this)
  }

  componentWillMount() {
    this.getCategories();
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

  getCategories() {
    fetch(`/api/categories`)
      .then(results => {
          return results.json()
      }).then(data => {
        this.setState({categories: data.data})
    })
  }

  toggleNew() {
    this.setState({addNew: !this.state.addNew})
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  }

  addNewCategory() {
    // Add new category
    var categories = this.state.categories
    categories.push(this.state.newCategory)
    fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state.newCategory)
    }).then(results => {
        return results.json()
      }).then(data => {
        //POST
        this.setState({categories})
        this.setState({newCategory: ""})
        this.setState({addNew: false})
      });
  }

  toggleEdit(ind) {
    this.setState({canEdit: !this.state.canEdit})
    this.setState({editCatInd: ind})
  }

  editCategory(index) {
    //PUT
    const editCategory = [this.state.categories[index], index, this.state.editCat]
    fetch('/api/categories', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editCategory)
    }).then(results => {
        return results.json()
      }).then(data => {
        //POST
        var categories = this.state.categories
        categories.splice(index, 0, this.state.editCat)
        this.setState({categories})
        this.setState({canEdit: false})
        this.setState({editCatInd: ""})
        this.setState({editCat: ""})
      });


  }

  deleteCategory(index) {
    //DELETE
    fetch('/api/categories', {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(index)
    }).then(results => {
        return results.json()
      }).then(data => {
        //POST
        var categories = this.state.categories
        categories.splice(index, 1)
        this.setState({categories})
      });

  }

  render() {
    // const {profile} = this.state
    return (
      <div> {this.state.isAdmin ? <div>
        {this.state.categories.map((category, ind) => <div key={ind}> <p>{category}</p>
          <Button onClick={()=> this.toggleEdit(ind)}> Edit </Button>
          {this.state.canEdit && this.state.editCatInd === ind && <div>
            <TextField
            label="Edit Category"
            id="item_categories"
            defaultValue=""
            margin="dense"
            value={this.state.editCat}
            onChange={this.handleChange('editCat')}
          />
            <Button onClick={()=>this.editCategory(ind)}>Submit Edit</Button>
            </div>}
          <Button onClick={()=> this.deleteCategory(ind)}> Delete </Button>
          </div>)}
        <Button onClick={()=> this.toggleNew()}> Add New Category </Button>
        {this.state.addNew && <div><TextField
            label="New Category"
            id="item_categories"
            defaultValue=""
            margin="dense"
            value={this.state.newCategory}
            onChange={this.handleChange('newCategory')}
          />
        <Button onClick={()=> this.addNewCategory()}> Add New Category</Button></div>}
        </div> : <p> You are not authorized to view this page </p>}
      </div>
    )
  }
}

export default withRouter(CategoryPage)
