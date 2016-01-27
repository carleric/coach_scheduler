import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';

var itemStyle = {
			width: '1em', 
			height: '1em', 
			float: 'left', 
			marginLeft: '10px', 
			marginRight: '10px',
			borderRadius: '4px'
		};

 class CoachList extends React.Component {
	constructor(props){
		super(props);
		this.showAll = this.showAll.bind(this);
	}
	showAll() {
		$('#calendar').fullCalendar('removeEvents');
		_.each(this.props.coaches, function(coach) {
			$('#calendar').fullCalendar('addEventSource', coach.availability);
		});
		$('#calendar').fullCalendar('rerenderEvents');
	}

	render() {
		itemStyle.backgroundColor = 'green';
		return (
			<div className='coachList'>
				<h2 className='nomargin'>Coaches</h2> 
				<ul>
				{this.props.coaches.map(coach => <CoachRow key={coach.name} coach={coach}/> )}
				</ul>
			</div>
			);
	}
}

class CoachRow extends React.Component {
	constructor(props){
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick() {
		//now handled in router
	}
	render() {
		itemStyle.backgroundColor = this.props.coach.availability.color;
		const coachLink = "/coach/" + this.props.coach.id;
		return (
			<li onClick={this.handleClick} >
					<div style={itemStyle}></div>
					<Link to={coachLink}>{this.props.coach.name}</Link>

			</li>
			);
	}
}

 export default CoachList;