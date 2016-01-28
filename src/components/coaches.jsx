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
	}
	render() {
		return (
			<div className='coachList'>
				<h2 className='nomargin'>Coaches</h2> 
				<div className='ui segments'>
				{this.props.coaches.map(coach => <CoachRow key={coach.name} coach={coach}/> )}
				</div>
			</div>
			);
	}
	componentDidMount() {
		console.log('coachlist-didMount', this.props);
	}
	componentWillReceiveProps(nextProps) {
		console.log('coaches-willReceiveProps', nextProps);
	}
}

class CoachRow extends React.Component {
	constructor(props){
		super(props);
	}
	componentDidMount() {
		console.log('coachrow-didMount', this.props);
	}
	componentWillReceiveProps(nextProps) {
		console.log('coachrow-willReceiveProps', nextProps);
	}
	render() {
		itemStyle.backgroundColor = this.props.coach.availability.color;
		const coachBioLink = `/coach/${this.props.coach.id}/bio`;
		const coachAvailabilityLink = `/coach/${this.props.coach.id}/sched`;
		return (
			<div className='ui segment'>
					<div style={itemStyle}></div>
					<div>{this.props.coach.name}</div>
					<div className="ui horizontal divider"/>
					<Link to={coachBioLink}><div className='ui grey basic button'>bio</div></Link>
					<Link to={coachAvailabilityLink}><div className='ui grey basic button'>schedule</div></Link>
			</div>
			);
	}
}

 export default CoachList;