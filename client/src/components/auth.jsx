import React from 'react';
import auth from '../auth.js';

class Login extends React.Component{
  constructor(props, context) {
  	console.log('Login', props, context);
    super(props, context);
    context.router;
    this.state = {
      error: false
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(event) {
    event.preventDefault()

    const email = this.refs.email.value
    const pass = this.refs.pass.value

    auth.login(email, pass, (info) => {
      if (!info.authenticated)
        return this.setState({ error: true })
      else {
      	this.props.onLogin(info.user);
      }

      const { location } = this.props

      if (location.state && location.state.nextPathname) {
        this.context.router.replace(location.state.nextPathname)
      } else {
        this.context.router.replace('/')
      }
    })
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label><input ref="email" placeholder="email" defaultValue="joe@example.com" /></label>
        <label><input ref="pass" placeholder="password" /></label> (hint: password1)<br />
        <button type="submit">login</button>
        {this.state.error && (
          <p>Bad login information</p>
        )}
      </form>
    )
  }
}

Login.contextTypes = {
    router: React.PropTypes.object.isRequired
  }

const Logout = React.createClass({
  componentDidMount() {
    auth.logout()
  },

  render() {
    return <p>You are now logged out</p>
  }
})

module.exports = {
  Login : Login,
  Logout : Logout
};