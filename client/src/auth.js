import axios from 'axios';

module.exports = {
  login(email, pass, cb) {
    cb = arguments[arguments.length - 1]
    if (localStorage.token) {
      if (cb) cb(true)
      this.onChange(true)
      return
    }
    loginRequest(email, pass, (res) => {
      if (res.authenticated) {
        localStorage.token = res.token
        localStorage.user = JSON.stringify(res.user);
        if (cb) cb(res)
        this.onChange(true)
      } else {
        if (cb) cb(false)
        this.onChange(false)
      }
    })
  },

  getToken() {
    return localStorage.token
  },

  getUser() {
    if(localStorage.user)
      return JSON.parse(localStorage.user);
    else
      return {};
  },
  setUser(user) {
    localStorage.user = JSON.stringify(user);
  },
  logout(cb) {
    delete localStorage.token;
    delete localStorage.user;
    logoutRequest((res)=>{
      if (cb) cb()
      this.onChange(false)
    })
  },

  loggedIn() {
    return !!localStorage.token
  },

  onChange() {}
}

function pretendRequest(email, pass, cb) {
  setTimeout(() => {
    if (email === 'joe@example.com' && pass === 'password1') {
      cb({
        authenticated: true,
        token: Math.random().toString(36).substring(7)
      })
    } else {
      cb({ authenticated: false })
    }
  }, 0)
}

function loginRequest(user, pass, cb) {
  var authPromise = axios.post('/login', 
    {
      username: user,
      password: pass
    });
    authPromise.then(function(res){
      cb(res.data);
    });
}

function logoutRequest(cb) {
  var authPromise = axios.get('/logout');
    authPromise.then(function(res){
      cb(res.data);
    });
}