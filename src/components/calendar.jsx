import React from 'react';



class Calendar extends React.Component {
	constructor(props) {
		super(props);
		this.eventClick = this.eventClick.bind(this);
		this.dayClick = this.dayClick.bind(this);
	}

	componentDidMount() {
		const {calendar} = this.refs;
		$(calendar).fullCalendar({
			eventSources: this.props.eventSources,
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

	render() {
		return (
			<div id="calendar" ref="calendar"></div>
			);
	}
}

export default Calendar;

