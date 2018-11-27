import React from 'react';
import { Link } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import HomeIcon from '@material-ui/icons/Home';
import AddBoxIcon from '@material-ui/icons/AddBox';
import MoreIcon from '@material-ui/icons/MoreVert';
import Auth from "./Auth/Auth";
import { connect } from './Socket/socketConnect.js'
import Notifications from './Notifications.jsx'

const styles = theme => ({
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
});

const auth = new Auth();
// TODO: Add admin-only links
class PrimarySearchAppBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      mobileMoreAnchorEl: null,
      notifications: [],
      profile: "",
      showNotifications: false,
      notificationCounter: 0
    };
    this.toggleNotifications = this.toggleNotifications.bind(this)
    this.getUser = this.getUser.bind(this)
  }

  componentWillMount() {
    const { userProfile, getProfile } = this.props.auth
    if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({profile})
        this.getUser(profile.sub) // Get notifications
      })
    } else {
      this.setState({ profile: userProfile })
      this.getUser(userProfile.sub) // Get notifications
    }
    // Append notifications when received
    connect('alert',(message) => this.setState({"notifications": this.state.notifications.push(message)}))
  }

  getUser(userID) {
    fetch(`/api/users/${userID}`)
      .then(results => {
        return results.json()
      }).then(data => {
        console.log(data)
        this.setState({notifications: data.notifications})
        this.setState({notificationCounter: this.state.notifications.filter((notification) => !notification.read).length})
        console.log("set state", this.state.notificationCounter)
    })
  }

  login() {
    auth.login();
  }

  logout() {
    auth.logout();
  }

  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = event => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  toggleNotifications() {
    // If opening notifications, set all as read
    this.setState({showNotifications: !this.state.showNotifications})
  }

  render() {
    const { anchorEl, mobileMoreAnchorEl } = this.state;
    const { classes } = this.props;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const { isAuthenticated } = auth;

    const renderMenuIsAuth = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.handleMenuClose}><Link exact to="/profile" style={{ textDecoration: 'none' }}>Profile</Link></MenuItem>
        <MenuItem onClick={this.handleMenuClose}><Link exact to="/account" style={{ textDecoration: 'none' }}>My Account</Link></MenuItem>
        <MenuItem onClick={this.handleMenuClose}><Link exact to="/watchlist" style={{ textDecoration: 'none' }}>Watchlist</Link></MenuItem>
        <MenuItem onClick={this.logout.bind(this)}>Logout</MenuItem>
      </Menu>
    );
    const renderMenuNotAuth = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.login.bind(this)}>Login/Signup</MenuItem>
      </Menu>
    );

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        <Link exact to="/" style={{ textDecoration: 'none' }}><MenuItem>
          <IconButton>
            <HomeIcon />
          </IconButton>
          <p>Main Page</p>
        </MenuItem></Link>
        <Link exact to="/addItem" style={{ textDecoration: 'none' }}><MenuItem>
          <IconButton>
            <AddBoxIcon />
          </IconButton>
          <p>Sell Item</p>
        </MenuItem></Link>
        <Link exact to={`/cart`} style={{ textDecoration: 'none' }}><MenuItem>
          <IconButton>
            <ShoppingCartIcon />
          </IconButton>
          <p>Shopping Cart</p>
        </MenuItem></Link>
        <MenuItem>
          <IconButton>
            {this.state.notificationCounter > 0 ? <Badge badgeContent={this.state.notificationCounter} color="secondary">
              <NotificationsIcon onClick={()=> this.toggleNotifications()}/>
            </Badge>: <NotificationsIcon onClick={()=> this.toggleNotifications()}/>}
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
        <Link exact to="/profile" style={{ textDecoration: 'none' }}>
        <MenuItem onClick={this.handleProfileMenuOpen}>
          <IconButton>
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem></Link>
      </Menu>
    );
    return (
      <div className={classes.root}>
        <AppBar position="static" style={{ backgroundColor: '#66b3ff' }}>
          <Toolbar>
            <Link exact to="/" style={{ textDecoration: 'none' }}>
              <Typography className={classes.title} variant="h6" noWrap>
                Definitely Not eBay
              </Typography>
            </Link>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <Link exact to="/addItem" style={{ textDecoration: 'none' }}>
                <IconButton>
                  <AddBoxIcon />
                </IconButton>
              </Link>
              <Link exact to={`/cart`} style={{ textDecoration: 'none' }}>
                <IconButton>
                  <ShoppingCartIcon />
                </IconButton>
              </Link>
              <IconButton>
                {this.state.notificationCounter > 0 ? <Badge badgeContent={this.state.notificationCounter} color="secondary">
              <NotificationsIcon onClick={()=> this.toggleNotifications()}/>
            </Badge>: <NotificationsIcon onClick={()=> this.toggleNotifications()}/>}
              </IconButton>
              <IconButton
                aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                aria-haspopup="true"
                onClick={this.handleProfileMenuOpen}
              >
                <AccountCircle />
              </IconButton>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen}>
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {this.state.showNotifications && this.state.notifications.length > 0 ? <Notifications notifications={this.state.notifications} /> : null}
        {!isAuthenticated() && renderMenuNotAuth}
        {isAuthenticated() && renderMenuIsAuth}
        {renderMobileMenu}
      </div>
    );
  }
}


/*<IconButton className={classes.menuButton} aria-label="Open drawer">
  <MenuIcon />
</IconButton>*/

export default withStyles(styles)(PrimarySearchAppBar);
