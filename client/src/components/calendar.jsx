import React from 'react';
import _ from 'lodash';


class Calendar extends React.Component {
	constructor(props) {
		super(props);
		this.selectedAvailabilityEvent = {};
		this.eventClick = this.eventClick.bind(this);
		this.dayClick = this.dayClick.bind(this);
	}

	componentDidMount() {
		console.log('calendar-didMount', this.props);
		const {calendar} = this.refs;
		$(calendar).fullCalendar({
			//eventSources: this.getAvailabilityForCoach(),
			eventClick: this.eventClick,
			dayClick: this.dayClick,
			header: {left: 'today prev,next', center: 'title', right: 'month agendaDay'},
			businessHours: {
			    start: '08:00', // a start time (10am in this example)
			    end: '18:00', // an end time (6pm in this example)
			    dow: [ 1, 2, 3, 4, 5]
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
			},
			viewRender: function(view, element){
				//console.log('calendar', view, element);
				$(calendar).popup('destroy');
				var calSettings = {
					on: 'manual', 
					delay: {show: 50, hide:2000},
					duration: 1000
				};
				if(view.type == 'agendaDay'){
					$(calendar).popup(_.assign(calSettings, { title:'Click to make an appointment', content:'click in the white space corresponding to the time you would like.', offset: 300}));
				} else if (view.type == 'month'){
					$(calendar).popup(_.assign(calSettings, {on: 'manual', title:'Click to make an appointment', content:'click inside of a colored event indicating open slots with your coach.'}));
				}
				$(calendar).popup('show');
			}
		});
		$(calendar).fullCalendar('addEventSource', this.getAvailabilityForSelectedCoach());
		$(calendar).fullCalendar('addEventSource', this.props.user.appointments);

		//change to month or date if set in props
	    if(this.props.dateMode) {
	    	console.log('navigating calendar to date ' + this.props.dateMode);
	    	$(calendar).fullCalendar('gotoDate', this.props.dateMode);
	    	$(calendar).fullCalendar('changeView', 'agendaDay');
	    } 
	}

	componentWillUnmount() {
		const {calendar} = this.refs;
		$(calendar).popup('destroy');
		$(calendar).fullCalendar('destroy');
	}

	eventClick(calEvent, jsEvent, view) {
		const {calendar} = this.refs;
		const currentView = $(calendar).fullCalendar('getView');
		if(currentView.type == 'month' || currentView.type == 'agendaWeek') {
			$(calendar).fullCalendar('changeView', 'agendaDay');
			$(calendar).fullCalendar( 'gotoDate', calEvent.start );
			this.selectedAvailabilityEvent = calEvent;
			return true;
		}
		return false;
	}

	dayClick(date, jsEvent, view) {
		const {calendar} = this.refs;
		const currentView = $(calendar).fullCalendar('getView');
		if(currentView.type == 'agendaDay' || currentView.type == 'agendaWeek') {
			console.log("clicked hour=" + date.get('hour') + " minute=" + date.get('minute'));
			const desiredStart = date.clone();
			const desiredEnd = date.add(1, 'h');

			this.props.makeAppointment(desiredStart);
			
			
		}
	}

	componentDidUpdate (prevProps) {
	    // const oldCoachId = prevProps ? prevProps.coachId : null;
	    const newCoachId = this.props.coachId;
	    console.log('calendar-didUpdate', this.props);

	    $(calendar).fullCalendar('removeEvents');
	    $(calendar).fullCalendar('addEventSource', this.getAvailabilityForSelectedCoach());
	    $(calendar).fullCalendar('addEventSource', this.props.user.appointments);
	    $(calendar).fullCalendar('rerenderEvents');

	    //change to month or date if set in props
	    if(this.props.dateMode) {
	    	console.log('navigating calendar to date ' + this.props.dateMode);
	    	$(calendar).fullCalendar('gotoDate', this.props.dateMode);
	    	$(calendar).fullCalendar('changeView', 'agendaDay');
	    } 
	}

	getAvailabilityForSelectedCoach(){
		return this.props.coach.availability;
	}

	render() {
		return (
			<div id="calendar" ref="calendar"></div>
			);
	}
}

export default Calendar;

