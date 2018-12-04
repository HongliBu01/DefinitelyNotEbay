import history from '../history';
import auth0 from 'auth0-js';
import { AUTH_CONFIG } from './auth0-variables';

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    audience: AUTH_CONFIG.apiUrl,
    responseType: 'token id_token',
    scope: 'openid email read:users update:users',
  });

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getProfile = this.getProfile.bind(this)
    this.getIdToken = this.getIdToken.bind(this)
    this.getAccessToken = this.getAccessToken.bind(this)
    this.editUser= this.editUser.bind(this);
  }

  getProfile(callback) {
    let accessToken = this.getAccessToken();
    if (accessToken) {
      this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        this.userProfile = profile;
      }
      callback(err, profile);
      });
    } else {
      return
    }

  }

  getIdToken() {
    return this.idToken
  }

  getAccessToken() {
    const accessToken = localStorage.getItem('access_token')
    if (!accessToken) {
      // throw new Error('No Access Token found')
        // This is to avoid error in testing.
        console.log('No Access Token found')
    }
    return accessToken
  }

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.idToken = authResult.idToken
        this.profile = authResult.idTokenPayload
        this.setSession(authResult);
        // Check if database has this user
        fetch(`/api/users/${this.profile.sub}`)
          .then(results => {
            return results.json()
          }).then(data => {
              this.userData = data
            if (!data) {
              this.userData = {
                _id: this.profile.sub,
                email: this.profile.email,
                watchlist: [],
                cart: [],
                isActive: true,
                isAdmin: false,
                bidHistory: [],
                buyHistory: [],
                listings: [],
                notifications: []
              }
              // Add user to database
              fetch('/api/users', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.userData)
              }).then(results => {
                  return results.json()
                }).then(data => {
                    console.log(data)
                });
            }
          })
        history.replace('/');
      } else if (err) {
        history.replace('/');
        console.log(err);
        //alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  setSession(authResult) {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    // navigate to the home route
    history.replace('/');
  }

  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    this.idToken = null
    this.profile = null
    // navigate to the home route
    history.replace('/');
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  editUser(state) {
    fetch('/api/token', {
      method: 'GET',
    }).then(results => {
      return results.json();
    }).then(data => {
      const token = data['access_token'];
      fetch(`https://${AUTH_CONFIG.domain}/api/v2/users/${state.profile.sub}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: state.email
        })
      }).then(results => {
        console.log(results);
        return results.json()
      }).then(data => {
        console.log(data);
      });
    });
  }

  deleteUser(userID) {
    fetch('/api/token', {
      method: 'GET',
    }).then(results => {
      return results.json();
    }).then(data => {
      const token = data['access_token'];
      fetch(`https://${AUTH_CONFIG.domain}/api/v2/users/${userID}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }).then(results => {
        console.log(results);
        return results;
      });
    });
  }
}
