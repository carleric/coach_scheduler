import React from 'react';



class Calendar extends React.Component {
	constructor(props) {
		super(props);
		this.eventClick = this.eventClick.bind(this);
	}

	componentDidMount() {
		const {calendar} = this.refs;
		$(calendar).fullCalendar({
			selectable: true,
			eventSources: this.props.eventSources,
			eventClick: this.eventClick,
			header: {left: 'today prev,next', center: 'title', right: 'month agendaDay'}
		});
	}

	componentWillUnmount() {
		const {calendar} = this.refs;

		$(calendar).fullCalendar('destroy');
	}

	eventClick(calEvent, jsEvent, view) {
		const {calendar} = this.refs;
		$(calendar).fullCalendar('changeView', 'agendaDay');
		$(calendar).fullCalendar( 'gotoDate', calEvent.start )
	}

	render() {
		return (
			<div id="calendar" ref="calendar"></div>
			);
	}
}

export default Calendar;

