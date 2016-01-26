import React from 'react';
import _ from 'lodash';

var itemStyle = {
			width: '1em', 
			height: '1em', 
			float: 'left', 
			marginLeft: '10px', 
			marginRight: '10px'
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
				<li onClick={this.showAll} ><div style={itemStyle}></div><a>All</a></li>
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
		const {availability} = this.props.coach;

		$('#calendar').fullCalendar('removeEvents');
		$('#calendar').fullCalendar('addEventSource', availability);
		$('#calendar').fullCalendar('rerenderEvents');


	}
	render() {
		itemStyle.backgroundColor = this.props.coach.availability.color;
			
		return (
			<li onClick={this.handleClick} >
					<div style={itemStyle}></div>
					<a>{this.props.coach.name}</a>

			</li>
			);
	}
}

 export default CoachList;