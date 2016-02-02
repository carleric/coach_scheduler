
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router';
import {CoachList, CoachBios} from './components/coaches';
import Calendar from './components/calendar';
import {Menu} from './components/menu';
import {Login, Logout} from './components/auth';
import {Appointments} from './components/appointments';
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
			selectedCoach: {},
			coaches: [],
			user: auth.getUser()
		};

		this.updateAuth = this.updateAuth.bind(this);
		this.makeAppointment = this.makeAppointment.bind(this);
		this.fetchCoach = this.fetchCoach.bind(this);
		this.fetchCoaches = this.fetchCoaches.bind(this);
		this.didLoginWithUser = this.didLoginWithUser.bind(this);
		this.updateUserWithAppointments = this.updateUserWithAppointments.bind(this);
		this.rescheduleAppointment = this.rescheduleAppointment.bind(this);
	}
	

	//1: happens once, immediately before render
	componentWillMount() {
		console.log('App.componentWillMount', this.props.params)
		this.setState({selectedCoachId: this.props.params.coachId});
		auth.onChange = this.updateAuth;
    	auth.login();
	}

	//2: on receiving new props, doesn't fire on iniital render
	// happens before render
	// old props still in this.props
	// calling this.setState will not cause another render
	componentWillReceiveProps(newProps) {
		console.log('App willReceiveProps', newProps, this.state);

		if(this.state.selectedCoachId != newProps.params.coachId
			&& newProps.params.coachId != undefined){
			this.setState({selectedCoachId: newProps.params.coachId});
			//refresh coach data
			this.fetchCoach(newProps.params.coachId, (coach)=>{
				console.log('got coach ' + coach.username);
				this.setState({selectedCoach: coach});
			});
		}
	}
	
	//3: componentWillUpdate: Invoked immediately before rendering when new props or state are being received. This method is not called for the initial render.
	// Use this as an opportunity to perform preparation before an update occurs.

	//4: 
	render() {
		console.log('App-render', this.props, this.state);
		return (
			<div className='ui container'>
				<Menu loggedIn={this.state.loggedIn} user={this.state.user}/>

				<div className='ui segments'>
					<div className='ui segment message'>
						
					</div>
				
				 
					<div className='ui segment'>
						{this.props.children && React.cloneElement(this.props.children, {
							user: this.state.user, 
							coachId: this.state.selectedCoachId, 
							coach: this.state.selectedCoach,
							coaches: this.state.coaches, 
							makeAppointment: this.makeAppointment, 
							onLogin: this.didLoginWithUser,
							dateMode: this.props.params.dateMode
							})} 
					</div>

				</div>
			</div>
		);
	}

	//5: componentDidUpdate: Invoked immediately after the component's updates are flushed to the DOM. This method is not called for the initial render.
	// Use this as an opportunity to operate on the DOM when the component has been updated.

	//6: after render, after child renders.  good place for AJAX
	componentDidMount() {
		console.log('App.componentDidMount');

		this.fetchCoaches((coaches)=>{
			console.log('got coaches ' +coaches.length);
			this.setState({coaches: coaches});
		});
	
		if(this.state.selectedCoachId != undefined) {
			this.fetchCoach(this.state.selectedCoachId, (coach)=>{
				console.log('got coach ' + coach.username);
				this.setState({selectedCoach: coach});
			});
		}
		//this.state.user = auth.getUser();
	}

	
	//7: componentWillUnmount: Invoked immediately before a component is unmounted from the DOM.
	// Perform any necessary cleanup in this method, such as invalidating timers or cleaning up any DOM elements that were created in componentDidMount.



	// data fetching
	fetchCoaches(cb){
		var coachPromise = axios.get('http://localhost:3000/api/coaches');
		coachPromise.then(function(res){
			console.log('getCoaches returned '+ res.data.status);
			cb(res.data.coaches);
		}.bind(this));
	}

	fetchCoach(coachId, cb){
		var coachPromise = axios.get(`http://localhost:3000/api/coach/${coachId}`);
		coachPromise.then(function(res){
			console.log('getCoaches returned '+ res.data.status);
			cb(res.data.coach);
		}.bind(this));
	}


	//Appointment scheduling:
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
		const coach = this.state.selectedCoach;
		//const availability = this.getAvailabilityForCoach(this.state.selectedCoachId);
		const availability = this.state.selectedCoach.availability;
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
		const existingAppointmentThisMonthIndex = _.findIndex(appointments, appointment=>{
			return desiredStart.isSame(appointment.start, 'month');
		});
		if(existingAppointmentThisMonthIndex != -1) {
			const existingAppointmentThisMonth = appointments[existingAppointmentThisMonthIndex];
			this.showReschedulePrompt(()=>{
  						console.log('approved appointment reschedule');
  						this.rescheduleAppointment(
  							//id is sent to server to update existing record
  							existingAppointmentThisMonth._id, 
  							//attributes from this will be copied
  							this.generateNewAppointment(this.state.user._id, coach._id, desiredStart, desiredEnd, this.generateTitle(coach, desiredStart)),  
  							//callback: do this when server replies with updated appointment
  							(_appointment)=>{
  								//replace old appointment with new one
								//const _appointments = _.filter(appointments, (appointment)=>{appointment._id != existingAppointmentThisMonth._id});
								//_appointments.push(_appointment);
								appointments[existingAppointmentThisMonthIndex] = _appointment;
								this.updateUserWithAppointments(appointments);
							});
  						return true;
  					});
		}

		//no other appointments have been made this month, make a new one
		else {
			this.makeNewAppointment(this.generateNewAppointment(this.state.user._id, coach._id, desiredStart, desiredEnd, this.generateTitle(coach, desiredStart)), (_appointment)=>{
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

	generateTitle(coach, desiredStart) {
		return `${moment(desiredStart).format('MMMM')} call with ${coach.username}`;
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

	rescheduleAppointment(existingAppointmentId, newAppointment, cb){
		var appointmentPromise = axios.put(`http://localhost:3000/api/appointments/${existingAppointmentId}`, newAppointment);
		appointmentPromise.then(function(res){
			cb(res.data.appointment);
		});
	}

	updateUserWithAppointments(appointments){
		const user = _.cloneDeep(this.state.user);
		user.appointments.events = appointments;
		

		//refresh coach data
		this.fetchCoach(this.state.selectedCoachId, (coach)=>{
			console.log('got coach ' + coach.username);
			this.setState({selectedCoach: coach});
		});

		auth.setUser(user);
		this.setState({user: user});
	}


	//auth callbacks
	updateAuth(loggedIn) {
	    this.setState({
	      loggedIn: loggedIn
	    })
	}
	
	didLoginWithUser(user) {
		console.log('App.didLoginWithUser', user);
		this.setState({user:user});
	}
}


class CoachAvailability extends React.Component{
	componentWillReceiveProps(props) {
		console.log('CoachAvailability willReceiveProps', props);
	}
	render() {
		console.log('CoachAvailability-render', this.props.params);
		return (
			<div className='ui grid'>
				<div className='six wide column'>
					<CoachList coachId={this.props.coachId} coaches={this.props.coaches} />
				</div>
				<div className='ten wide column'>
					<Calendar user={this.props.user} 
						coachId={this.props.coachId} 
						coach={this.props.coach} 
						coaches={this.props.coaches} 
						makeAppointment={this.props.makeAppointment}
						dateMode={this.props.dateMode}
						/>
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
 	  <Route path="coach/:coachId/bio" component={CoachBios}/>
	  <Route path="coach/:coachId/sched(/:dateMode)" component={CoachAvailability}/>
	  <Route path="me" component={Appointments}/>
    </Route>
  </Router>
), document.getElementById('app'));

module.exports.App = App;