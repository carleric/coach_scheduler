import React from 'react';

 class CoachList extends React.Component {
	// constructor(props){
	// 	super(props);
	// }
	render() {
		return (<ul>
			{this.props.coaches.map(coach => <CoachRow key={coach.name} coach={coach}/> )}
		</ul>);
	}
}

class CoachRow extends React.Component {
	constructor(props){
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick() {
		const {availability} = this.props.coach;

		$('#calendar').fullCalendar('removeEvents');
		$('#calendar').fullCalendar('addEventSource', availability);
		$('#calendar').fullCalendar('rerenderEvents');
	}
	render() {
		return <li onClick={this.handleClick} >{this.props.coach.name}</li>
	}
}

 export default CoachList;