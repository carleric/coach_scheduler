
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router';
import {CoachList, CoachBios} from './components/coaches';
import Calendar from './components/calendar';
import {Menu} from './components/menu';
import {Login, Logout} from './components/auth';
import axios from 'axios';
import auth from './auth';
import _ from 'lodash';


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
		this.getCoach = this.getCoach.bind(this);
		this.getAvailabilityForCoach = this.getAvailabilityForCoach.bind(this);
		this.didLoginWithUser = this.didLoginWithUser.bind(this);
		this.updateUserWithAppointments = this.updateUserWithAppointments.bind(this);
		this.rescheduleAppointment = this.rescheduleAppointment.bind(this);
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

		this.getCoaches((coaches)=>{
			console.log('got coaches ' +coaches.length);
			this.setState({coaches: coaches});
		});
		this.state.user = auth.getUser();
	}
	render() {
		console.log('App-render', this.props, this.state);
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

	getCoaches(cb){
		var coachPromise = axios.get('http://localhost:3000/api/coaches');
		coachPromise.then(function(res){
			console.log('getCoaches returned '+ res.data.status);
			cb(res.data.coaches);
		}.bind(this));
	}



	//called from calendar component, user clicked a time slot
	makeAppointment(desiredStart) {
		console.log('makeAppointment', desiredStart);

		//appointments are always one hour
		const desiredEnd = desiredStart.clone().add(1, 'h');

		//clone desired slot into another time bracket that is 1 minute shorter on both ends for comparing to availability slots
		const desiredStartForComparing = desiredStart.clone().add(1, 'm');
		const desiredEndForComparing = desiredEnd.clone().subtract(1, 'm');


		//validation 1: check if selected time falls within any availability slot for the currently selected coach
		//selected time falls outside available slots for the selected coach, notify user
		const coach = this.getCoach(this.state.selectedCoachId);
		const availability = this.getAvailabilityForCoach(this.state.selectedCoachId);
		const slotIndex = _.findIndex(availability.events, function(slot){
			return desiredStartForComparing.isAfter(slot.start) && desiredEndForComparing.isBefore(slot.end);;
		});
		if(slotIndex == -1)
		{
			this.notifyUser('Invalid time', 'Please click within an open time slot.');
			return;
		} 

		//validation 2: check if this user already has an appointment for this month, if so, prompt for rescheduling
		const appointments = this.state.user.appointments.events;
		let existingAppointmentThisMonth = _.find(appointments, appointment=>{
			return desiredStart.isSame(appointment.start, 'month');
		});
		if(existingAppointmentThisMonth) {
			this.showReschedulePrompt(()=>{
  						console.log('approved appointment reschedule');
  						this.rescheduleAppointment(existingAppointmentThisMonth, this.generateNewAppointment(this.state.user._id, coach._id, desiredStart, desiredEnd, `call with ${coach.username}`), (_appointment)=>{
							const appointments = _.filter(this.state.user.appointments.events, (appointment)=>{appointment._id != existingAppointmentThisMonth._id});
							appointments.push(_appointment);
							this.updateUserWithAppointments(appointments);
							//existingAppointmentThisMonth = _appointment;
						})
  						return true;
  					});
		}

		//no other appointments have been made this month, make a new one
		else {
			this.makeNewAppointment(this.generateNewAppointment(this.state.user._id, coach._id, desiredStart, desiredEnd, `call with ${coach.username}`), (_appointment)=>{
				const appointments = this.state.user.appointments.events;
				appointments.push(_appointment);
				this.updateUserWithAppointments(appointments);
			})
		}
	}

	showReschedulePrompt(onApproval){
		$(calendar).popup('destroy');
			$('.ui.modal')
  				.modal({
  					selector    : {
					  close    : '.close, .actions .button',
					  approve  : '.actions .positive, .actions .approve, .actions .ok',
					  deny     : '.actions .negative, .actions .deny, .actions .cancel'
					},
  					onApprove:onApproval
  				})
  				.modal('show')
			;
	}

	notifyUser(title, message){
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
	}

	generateNewAppointment(clientId, coachId, desiredStart, desiredEnd, title){
		return {
				title: title, 
				start: desiredStart, 
				end: desiredEnd, 
				client: clientId, 
				coach: coachId
				};
	}

	makeNewAppointment(appointment, cb){
		var appointmentPromise = axios.post(`http://localhost:3000/api/appointments`, appointment);
		appointmentPromise.then(function(res){
			cb(res.data.appointment);
		});
	}

	rescheduleAppointment(existingAppointment, newAppointment, cb){
		var appointmentPromise = axios.put(`http://localhost:3000/api/appointments/${existingAppointment._id}`, newAppointment);
		appointmentPromise.then(function(res){
			cb(res.data.appointment);
		});
	}

	updateUserWithAppointments(appointments){
		const user = _.cloneDeep(this.state.user);
		user.appointments.events = appointments;
		auth.setUser(user);
		this.setState({user: user});
	}

	getCoach(coachId){
		return _.find(this.state.coaches, function(coach) { return coach._id == coachId});
	}
	getAvailabilityForCoach(coachId){
		return this.getCoach(coachId).availability;
	}

	didLoginWithUser(user) {
		console.log('App.didLoginWithUser', user);
		this.setState({user:user});
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

module.exports.App = App;