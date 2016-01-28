import React from 'react';
import _ from 'lodash';


class Calendar extends React.Component {
	constructor(props) {
		super(props);
		this.eventClick = this.eventClick.bind(this);
		this.dayClick = this.dayClick.bind(this);
	}

	componentDidMount() {
		console.log('calendar-didMount', this.props);
		const {calendar} = this.refs;
		$(calendar).fullCalendar({
			eventSources: this.getAvailabilityForCoach(),
			eventClick: this.eventClick,
			dayClick: this.dayClick,
			header: {left: 'today prev,next', center: 'title', right: 'month agendaWeek agendaDay'},
			businessHours: {
			    start: '08:00', // a start time (10am in this example)
			    end: '18:00', // an end time (6pm in this example)
			    dow: [ 1, 2, 3, 4 ]
			    // days of week. an array of zero-based day of week integers (0=Sunday)
			    // (Monday-Thursday in this example)
			}
			,
			eventAfterRender: function(event, element){
				const currentView = $(calendar).fullCalendar('getView');
				if(currentView.type == 'agendaDay') {
					//event.rendering = 'background';
					//$(calendar).fullCalendar('renderEvent');
					//currentView.rendering = 'background';
					// element.addClass('fc-bgevent');
					// element.removeClass('fc-bg');
					// element.removeClass('fc-event');
					//element.css('margin-right', '50%');
					element.css('width', '200px');
					//element.selectable = false;
				} else {
					event.rendering = null;
				}
				return true;
			}
		});
	}

	componentWillUnmount() {
		const {calendar} = this.refs;
		$(calendar).fullCalendar('destroy');
	}

	eventClick(calEvent, jsEvent, view) {
		const {calendar} = this.refs;
		const currentView = $(calendar).fullCalendar('getView');
		if(currentView.type == 'month' || currentView.type == 'agendaWeek') {
			$(calendar).fullCalendar('changeView', 'agendaDay');
			$(calendar).fullCalendar( 'gotoDate', calEvent.start );
			return true;
		}
		return false;
	}

	dayClick(date, jsEvent, view) {
		const {calendar} = this.refs;
		const currentView = $(calendar).fullCalendar('getView');
		if(currentView.type == 'agendaDay' || currentView.type == 'agendaWeek') {
			console.log("clicked hour=" + date.get('hour') + " minute=" + date.get('minute'));
			const start = date.clone();
			const end = date.add(1, 'h');
			let newAppointment = {events: [{title: 'My appointment', start: start, end: end}], color:'orange'}
			$('#calendar').fullCalendar('addEventSource', newAppointment);
		}
	}

	componentWillReceiveProps(nextProps) {
		console.log('calendar-willReceiveProps', this.props.coachId);
	}

	componentDidUpdate (prevProps) {
	    const oldCoachId = prevProps ? prevProps.coachId : null;
	    const newCoachId = this.props.coachId;
	    console.log('calendar-didUpdate', this.props.coachId);

	    if(oldCoachId != newCoachId) {
	    	this.showAvailabilityForSelectedCoach(newCoachId);
	    }

	}

	showAvailabilityForSelectedCoach(newCoachId){
		$(calendar).fullCalendar('removeEvents');
		$(calendar).fullCalendar('addEventSource', this.getAvailabilityForCoach(newCoachId));
		$(calendar).fullCalendar('rerenderEvents');
	}

	getAvailabilityForCoach(coachId){
		const id = coachId == undefined ? this.props.coachId : coachId;
		if(id == undefined || id == 0 || id == '') return;
		const {calendar} = this.refs;
    	const index = _.findIndex(this.props.coaches, function(coach) { return coach.id == id});
    	return this.props.coaches[index].availability;
	}

	render() {
		return (
			<div id="calendar" ref="calendar"></div>
			);
	}
}

export default Calendar;

