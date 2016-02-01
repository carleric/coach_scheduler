import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
//import Calendar from './calendar';

const BTN_ACTIVE = 'ui basic orange active button';
const BTN_INACTIVE = 'ui basic grey button';

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
				{this.props.coaches.map(coach => <CoachRow key={coach._id} coach={coach}/> )}
				</div>
			</div>
			);
	}
	componentDidMount() {
		//console.log('coachlist-didMount', this.props);
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
		//console.log('coachrow-didMount', this.props);
	}
	componentWillReceiveProps(nextProps) {
		console.log('coachrow-willReceiveProps', nextProps);
	}
	render() {
		itemStyle.backgroundColor = this.props.coach.availability.color;
		const coachBioLink = `/coach/${this.props.coach._id}/bio`;
		const coachAvailabilityLink = `/coach/${this.props.coach._id}/sched`;
		return (
			<div className='ui segment'>
					<div style={itemStyle}></div>
					<div>{this.props.coach.username}</div>
					<div className="ui horizontal divider"/>
					<Link to={coachBioLink} activeClassName={BTN_ACTIVE} className={BTN_INACTIVE}>bio</Link>
					<Link to={coachAvailabilityLink} activeClassName={BTN_ACTIVE} className={BTN_INACTIVE}>schedule</Link>
			</div>
			);
	}
}




class CoachBios extends React.Component {
	constructor(props){
		super(props);
		this.getCoach = this.getCoach.bind(this);
	}
	getCoach(coachId){
		const id = coachId == undefined ? this.props.coachId : coachId;
		if(id == undefined || id == -1 || id == '') return;
		const {calendar} = this.refs;
    	const index = _.findIndex(this.props.coaches, function(coach) { return coach._id == id});
    	return this.props.coaches[index];
	}
	render(){
		const coach = this.getCoach(this.props.coachId);
		console.log('CoachBios render', `coachId=${coach}`);
		if(coach == undefined) return (<div/>);
		return (
			<div className='ui grid'>
				<div className='six wide column'>
					<CoachList coachId={this.props.coachId} coaches={this.props.coaches} />
				</div>
				<div className='ten wide column'>
					<CoachBio coach={coach}/>
				</div>
			</div>
			);
	}
}

class CoachBio extends React.Component {
	constructor(props){
		super(props);
	}
	render() {
		var imagePath = this.props.coach.images.medium;
		return (
			<div className="ui cards">
			  <div className="card">
			    <div className="image">
			      <img src={imagePath}/>
			    </div>
			    <div className="content">
			      <div className="header">{this.props.coach.username}</div>
			      <div className="meta">
			        <a>Coach</a>
			      </div>
			      <div className="description">
			        {this.props.coach.bio}
			      </div>
			    </div>
			    <div className="extra content">
			      <span className="right floated">
			        Joined in 2013
			      </span>
			      <span>
			        <i className="user icon"></i>
			        75 Clients
			      </span>
			    </div>
			  </div>
			</div>
		);
	}
}

module.exports = {
	CoachList: CoachList,
	CoachBios: CoachBios
}