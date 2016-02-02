import React from 'react';
import _ from 'lodash';


class Appointments extends React.Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		console.log('appointments-didMount', this.props);
	}
	render(){
		console.log('appointments-render', this.props);
		return (
			<div>
				<h2 className='nomargin'>My Appointments</h2> 
				<div className='ui segments'>
					{this.props.user.appointments.events.map(appointment => <AppointmentRow key={appointment._id} appointment={appointment}/> )}
				</div>
			</div>
		);
	}
}

class AppointmentRow extends React.Component {
	render(){
		return (
		<div className='ui segment'>
			{this.props.appointment.title}
		</div>
		);
	}
}
module.exports = {
	Appointments : Appointments
};