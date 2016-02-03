import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import moment from 'moment';

const BTN_INACTIVE = 'ui basic grey button';
var CLIENT_ID = '1043245537513-66u8lqhtn37eomsdcnnkg21nbtml5mts.apps.googleusercontent.com';
var SCOPES = ["https://www.googleapis.com/auth/calendar"];

class Appointments extends React.Component {
	constructor(props) {
		super(props);

		this.checkAuth = this.checkAuth.bind(this);
		this.handleAuthResult = this.handleAuthResult.bind(this);
		this.handleAuthClick = this.handleAuthClick.bind(this);
		this.loadCalendarApi = this.loadCalendarApi.bind(this);
		this.listUpcomingEvents = this.listUpcomingEvents.bind(this);
		this.appendPre = this.appendPre.bind(this);
		this.exportAppointmentsToGoogle = this.exportAppointmentsToGoogle.bind(this);

	}
	componentDidMount() {
		console.log('appointments-didMount', this.props);

		$('.message').hide();

		$('.message .close')
		  .on('click', function() {
		    $(this)
		      .closest('.message')
		      .transition('fade')
		    ;
		  })
		;
	}
	

	/**
	* Check if current user has authorized this application.
	*/
	checkAuth() {
	  gapi.auth.authorize(
	  {
	    'client_id': CLIENT_ID,
	    'scope': SCOPES.join(' '),
	    'immediate': true
	  }, this.handleAuthResult);
	}

	/**
	* Handle response from authorization server.
	*
	* @param {Object} authResult Authorization result.
	*/
	handleAuthResult(authResult) {
		var authorizeDiv = document.getElementById('authorize-div');
		if (authResult && !authResult.error) {
		  // Hide auth UI, then load client library.
		  //authorizeDiv.style.display = 'none';
		  this.loadCalendarApi();
		  
		} else {
		  // Show auth UI, allowing the user to initiate authorization by
		  // clicking authorize button.
		  //authorizeDiv.style.display = 'inline';
		}
	}

	/**
	* Initiate auth flow in response to user clicking authorize button.
	*
	* @param {Event} event Button click event.
	*/
	handleAuthClick(event) {
		gapi.auth.authorize(
		  {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
		  this.handleAuthResult);
		return false;
	}

	/**
	* Load Google Calendar client library. List upcoming events
	* once client library is loaded.
	*/
	loadCalendarApi() {
		gapi.client.load('calendar', 'v3', this.exportAppointmentsToGoogle);
	}

	/**
	* Print the summary and start datetime/date of the next ten events in
	* the authorized user's calendar. If no events are found an
	* appropriate message is printed.
	*/
	listUpcomingEvents() {
		var request = gapi.client.calendar.events.list({
		  'calendarId': 'primary',
		  'timeMin': (new Date()).toISOString(),
		  'showDeleted': false,
		  'singleEvents': true,
		  'maxResults': 10,
		  'orderBy': 'startTime'
		});

		request.execute(function(resp) {
		  var events = resp.items;
		  this.appendPre('Upcoming events:');

		  if (events.length > 0) {
		    for (var i = 0; i < events.length; i++) {
		      var event = events[i];
		      var when = event.start.dateTime;
		      if (!when) {
		        when = event.start.date;
		      }
		      this.appendPre(event.summary + ' (' + when + ')')
		    }
		  } else {
		    this.appendPre('No upcoming events found.');
		  }

		}.bind(this));
	}

	/**
	* Append a pre element to the body containing the given message
	* as its text node.
	*
	* @param {string} message Text to be placed in pre element.
	*/
	appendPre(message) {
		var pre = $('.ui.success.message p');
		var textContent = document.createTextNode(message + '\n');
		pre.append(textContent);
	}


	exportAppointmentsToGoogle(){
		var formattedEvents = _.map(this.props.user.appointments.events, function(event){
			return {
			  'summary': event.title,
			  'description': event.description,
			  'start': {
			    'dateTime': event.start,
			    'timeZone': 'America/Los_Angeles'
			  },
			  'end': {
			    'dateTime': event.end,
			    'timeZone': 'America/Los_Angeles'
			  },
			  'reminders': {
			    'useDefault': false,
			    'overrides': [
			      {'method': 'email', 'minutes': 24 * 60},
			      {'method': 'popup', 'minutes': 10}
			    ]
		  	  }
			};
		});
		
		var hasShownSuccess = false;

		_.each(formattedEvents, function(formattedEvent){
			var request = gapi.client.calendar.events.insert({
			  'calendarId': 'primary',
			  'resource': formattedEvent
			});

			request.execute(function(event) {
			  showSuccess();
			  this.appendPre('Event created: ' + event.htmlLink);
			}.bind(this));
		}.bind(this));

		function showSuccess(){
			if(!hasShownSuccess && $('.message').transition('is hidden')){
				console.log('showing success');
				$('.message').transition({animation:'scale'});
				hasShownSuccess = true;
			}
		}
		
	}

	render(){
		console.log('appointments-render', this.props);
		const title = this.props.user.username + "'s Appointments";
		const noneMsg = "You don't have any appointments yet.";
		return (
			<div>

				<div className="ui success message hidden">
				  <i className="close icon"></i>
				  <div className="header">
				    Export to Google Calendar was successful.
				  </div>
				  <p></p>
				</div>

				<button className="ui google plus button right floated" onClick={this.handleAuthClick}>
				  <i className="google plus icon"></i>
				  Export to Google Calendar
				</button>
				
				<h2 className='nomargin'>{title}</h2> 
				
				
				<div className='ui segments'>
					{this.props.user.appointments.events.length > 0 && this.props.user.appointments.events.map(appointment => <AppointmentRow key={appointment._id} appointment={appointment}/> )}
					{this.props.user.appointments.events.length == 0 && <div>{noneMsg}</div> }
				</div>
			</div>
		);
	}
}

class AppointmentRow extends React.Component {
	render(){
		const coachBioLink = `/coach/${this.props.appointment.coach}/bio`;
		const scheduleLink = `/coach/${this.props.appointment.coach}/sched/${moment(this.props.appointment.start).format('YYYY-MM-DD')}`;
		return (
		<div className='ui segment'>
			<div>{this.props.appointment.description}</div>
			<Link to={coachBioLink} className={BTN_INACTIVE}>bio</Link>
			<Link to={scheduleLink} className={BTN_INACTIVE}>schedule</Link>
		</div>
		);
	}
}
module.exports = {
	Appointments : Appointments
};