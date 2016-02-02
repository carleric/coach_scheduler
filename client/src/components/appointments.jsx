import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import moment from 'moment';

const BTN_INACTIVE = 'ui basic grey button';


class Appointments extends React.Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		console.log('appointments-didMount', this.props);
	}
	render(){
		console.log('appointments-render', this.props);
		const noneMsg = "You don't have any appointments yet.";
		return (
			<div>
				<h2 className='nomargin'>My Appointments</h2> 
				<div className='ui segments'>
					{this.props.user.appointments.events.length > 0 && this.props.user.appointments.events.map(appointment => <AppointmentRow key={appointment._id} appointment={appointment}/> )}
					{this.props.user.appointments.events.length == 0 && <div>{noneMsg}</div> }
				</div>
			</div>
		);
	}
}

class AppointmentRow extends React.Component {
	render(){
		const coachBioLink = `/coach/${this.props.appointment.coach}/bio`;
		const scheduleLink = `/coach/${this.props.appointment.coach}/sched/${moment(this.props.appointment.start).format('YYYY-MM-DD')}`;
		return (
		<div className='ui segment'>
			<div>{this.props.appointment.title}</div>
			<Link to={coachBioLink} className={BTN_INACTIVE}>bio</Link>
			<Link to={scheduleLink} className={BTN_INACTIVE}>schedule</Link>
		</div>
		);
	}
}
module.exports = {
	Appointments : Appointments
};