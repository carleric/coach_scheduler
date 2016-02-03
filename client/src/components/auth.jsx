import React from 'react';
import auth from '../auth.js';
import { Link } from 'react-router';

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
      <div className="ui segments">
    

        <div className="ui segment">

          <div className="ui middle aligned center aligned grid">
            <div className="column">
              <h2 className="ui teal image header">
                
                <div className="content">
                  Log-in to your account
                </div>
              </h2>
              <form className="ui large form" onSubmit={this.handleSubmit}>
                <div className="ui stacked segment">
                  <div className="field">
                    <div className="ui left icon input">
                      <i className="user icon"></i>
                      <input ref="email" type="text" name="email" placeholder="E-mail address"/>
                    </div>
                  </div>
                  <div className="field">
                    <div className="ui left icon input">
                      <i className="lock icon"></i>
                      <input ref="pass" type="password" name="password" placeholder="Password"/>
                    </div>
                  </div>
            
                  <button className="ui fluid large teal submit button" type="submit">login</button>
                </div>

                <div className="ui error message"></div>

              </form>

              {/*<div className="ui message">
                New to us? <Link to="/signup">Sign Up</Link>
              </div>*/}
            </div>
          </div>


        </div>



      </div>
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