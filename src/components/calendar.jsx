import React from 'react';



class Calendar extends React.Component {
	componentDidMount() {
		const {calendar} = this.refs;
		$(calendar).fullCalendar({
			selectable: true,
			eventSources: this.props.eventSources
		});
	}

	componentWillUnmount() {
		const {calendar} = this.refs;

		$(calendar).fullCalendar('destroy');
	}

	render() {
		return (
			<div id="calendar" ref="calendar"></div>
			);
	}
}

export default Calendar;

