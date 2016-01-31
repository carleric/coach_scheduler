import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router';
import CoachList from './components/coaches';
import Calendar from './components/calendar';
import axios from 'axios';
import auth from './auth';


//root component
class App extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			loggedIn: auth.loggedIn(),
			selectedCoachId: '', 
			coaches: [],
			user: {}
		};

		this.updateAuth = this.updateAuth.bind(this);
		this.makeAppointment = this.makeAppointment.bind(this);
		this.getAvailabilityForSelectedCoach = this.getAvailabilityForSelectedCoach.bind(this);
		this.didLoginWithUser = this.didLoginWithUser.bind(this);
	}
	updateAuth(loggedIn) {
	    this.setState({
	      loggedIn: loggedIn
	    })
	}
	componentWillReceiveProps(props) {
		console.log('App willReceiveProps', props, this.state);
		this.setState({selectedCoachId: props.params.coachId});
	}

	componentWillMount() {
		console.log('App.componentWillMount', this.props.params)
		this.setState({selectedCoachId: this.props.params.coachId});
		auth.onChange = this.updateAuth;
    	auth.login();
	}
	componentDidMount() {
		console.log('App.componentDidMount');

		this.state.user = auth.getUser();

		var coachPromise = axios.get('http://localhost:3000/api/coaches');
		coachPromise.then(function(data){
			this.setState({coaches: data.data});
			
		}.bind(this));
	}
	render() {
		console.log('App-render', this.props, this.state);
		const token = auth.getToken();
		return (
			<div className='ui container'>
				<Menu loggedIn={this.state.loggedIn} user={this.state.user}/>

				<div className='ui segments'>
					<div className='ui segment message'>
						
					</div>
				
				 
					<div className='ui segment'>
						{this.props.children && React.cloneElement(this.props.children, {user: this.state.user, coachId: this.state.selectedCoachId, coaches: this.state.coaches, makeAppointment: this.makeAppointment, onLogin: this.didLoginWithUser})} 
					</div>

				</div>
			</div>
		);
	}
	makeAppointment(desiredStart) {
		console.log('makeAppointment', desiredStart);

		//appointments are always one hour
		const desiredEnd = desiredStart.clone().add(1, 'h');

		//clone desired slot into another time bracket that is 1 minute shorter on both ends for comparing to availability slots
		const desiredStartForComparing = desiredStart.clone().add(1, 'm');
		const desiredEndForComparing = desiredEnd.clone().subtract(1, 'm');

		//check if selected time falls within any availability slot for the currently selected coach
		const availability = this.getAvailabilityForSelectedCoach();
		const slotIndex = _.findIndex(availability.events, function(slot){
			return desiredStartForComparing.isAfter(slot.start) && desiredEndForComparing.isBefore(slot.end);;
		});

		if(slotIndex == -1)
		{
			$(calendar).popup('hide');
			$(calendar).popup({
				on: 'manual', 
				title:'Invalid time', 
				content:'Please click within an open time slot.',
				delay: {show: 50, hide:5},
				position: 'bottom right',
				offset: -50
			});
			$(calendar).popup('show');
			_.delay(function(){
				$(calendar).popup('hide');
			}, 2000);
			return;
		} 

		//check if this user already has an appointment for this month, if so, delete it
		const appointments = this.state.user.appointments.events;
		const existingAppointmentThisMonth = _.find(appointments, appointment=>{
			return desiredStart.isSame(appointment.start, 'month');
		});
		if(existingAppointmentThisMonth) {
			$(calendar).popup('destroy');
			$('.ui.modal')
  				.modal({
  					selector    : {
					  close    : '.close, .actions .button',
					  approve  : '.actions .positive, .actions .approve, .actions .ok',
					  deny     : '.actions .negative, .actions .deny, .actions .cancel'
					},
  					onApprove:()=>{
  						console.log('approved');
  						const newAppointment = {title: 'My appointment', start: desiredStart, end: desiredEnd};
  						var appointmentPromise = axios.put(`http://localhost:3000/api/user/${this.state.user._id}/appointments/${existingAppointmentThisMonth._id}`, newAppointment);
						appointmentPromise.then(function(res){
							auth.setUser(res.data.user);
							this.setState({user: res.data.user});
						}.bind(this));
  						return true;
  					},
  					onDeny:()=>{
  						console.log('denied');
  						return true;
  					}
  				})
  				.modal('show')
			;
		}

		else {
			const newAppointment = {title: 'My appointment', start: desiredStart, end: desiredEnd};

			var appointmentPromise = axios.post(`http://localhost:3000/api/user/${this.state.user._id}/appointments`, newAppointment);
			appointmentPromise.then(function(res){
				auth.setUser(res.data.user);
				this.setState({user: res.data.user});
			}.bind(this));
		}
	}


	getAvailabilityForSelectedCoach(){
		const index = _.findIndex(this.state.coaches, function(coach) { return coach._id == this.state.selectedCoachId}.bind(this));
    	return this.state.coaches[index].availability;
	}

	didLoginWithUser(user) {
		console.log('App.didLoginWithUser', user);
		this.setState({user:user});
	}
}


class Menu extends React.Component{
	constructor(props){
		super(props);
	}

	render() {
		return (
			<div className='ui top attached menu'>
				<Link className='item' activeClassName='item active' to='/'>Home</Link>
				{this.props.loggedIn && <Link className='item' to='/me' activeClassName='item active'>{this.props.user.username}</Link>}
				{this.props.loggedIn && <Link className='item' to="/logout" activeClassName='item active'>Log out</Link> || <Link className='item' activeClassName='item active' to="/login">Sign in</Link>}
			</div>
			);
	}
}

class CoachAvailability extends React.Component{
	render() {
		console.log('CoachAvailability-render', this.props.params);
		return (
			<div className='ui grid'>
				<div className='six wide column'>
					<CoachList coachId={this.props.coachId} coaches={this.props.coaches} />
				</div>
				<div className='ten wide column'>
					<Calendar user={this.props.user} coachId={this.props.coachId} coaches={this.props.coaches} makeAppointment={this.props.makeAppointment}/>
				</div>
			</div>
		);
	}
}

class CoachBios extends React.Component {
	constructor(props){
		super(props);
		this.getCoach = this.getCoach.bind(this);
	}
	getCoach(coachId){
		const id = coachId == undefined ? this.props.coachId : coachId;
		if(id == undefined || id == -1 || id == '') return;
		const {calendar} = this.refs;
    	const index = _.findIndex(this.props.coaches, function(coach) { return coach._id == id});
    	return this.props.coaches[index];
	}
	render(){
		const coach = this.getCoach(this.props.coachId);
		console.log('CoachBios render', `coachId=${coach}`);
		if(coach == undefined) return (<div/>);
		return (
			<div className='ui grid'>
				<div className='six wide column'>
					<CoachList coachId={this.props.coachId} coaches={this.props.coaches} />
				</div>
				<div className='ten wide column'>
					<CoachBio coach={coach}/>
				</div>
			</div>
			);
	}
}

class CoachBio extends React.Component {
	constructor(props){
		super(props);
	}
	render() {
		var imagePath = this.props.coach.images.medium;
		return (
			<div className="ui cards">
			  <div className="card">
			    <div className="image">
			      <img src={imagePath}/>
			    </div>
			    <div className="content">
			      <div className="header">{this.props.coach.username}</div>
			      <div className="meta">
			        <a>Coach</a>
			      </div>
			      <div className="description">
			        {this.props.coach.bio}
			      </div>
			    </div>
			    <div className="extra content">
			      <span className="right floated">
			        Joined in 2013
			      </span>
			      <span>
			        <i className="user icon"></i>
			        75 Clients
			      </span>
			    </div>
			  </div>
			</div>
		);
	}
}

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

function requireAuth(nextState, replace) {
  if (!auth.loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}


ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={CoachList} onEnter={requireAuth}/>
      <Route path="login" component={Login} />
      <Route path="logout" component={Logout} />
      <Route path="dashboard" onEnter={requireAuth} />
      <Route path="/coach/:coachId/bio" component={CoachBios}/>
	  <Route path="/coach/:coachId/sched" component={CoachAvailability}/>
    </Route>
  </Router>
), document.getElementById('app'));