import React from 'react';
import ReactDOM from 'react-dom';
import CoachList from './components/coaches';
import Calendar from './components/calendar';


//require('bootstrap/dist/css/bootstrap.min.css');

//require('jquery/dist/jquery.js');
//require('fullcalendar/dist/fullcalendar.js');
//require('fullcalendar/dist/fullcalendar.min.css');

const coaches = [
	{name:'Bob Ernst', availability: [{title: 'Open', start: '2016-01-22', allDay:true}, {title: 'Open', start: '2016-01-23', allDay:true}, {title: 'Open', start: '2016-01-24', allDay:true}]}, 
	{name:'John Parker', availability: [{title: 'Open', start: Date.now(), allDay:true}]},
	{name:'Dave White', availability: []},
	];

const eventSources = coaches.map(function(coach) {
	return coach.availability;
});


const App = React.createClass({
	showAvailability: function() {

	},
	render: function() {
		return (
			<div className='container'>
				<div className='row'>
					<div className='col-md-12'>
						<p>Menu</p>
					</div>
				</div>
				<div className='row'>
					<div className='col-md-4'>
						<CoachList coaches={coaches} />
					</div>
					<div className='col-md-8'>
						<Calendar eventSources={eventSources}/>
					</div>
				</div>
			</div>
		);
	}
});


ReactDOM.render(
	<App/>,
	document.getElementById('app')
);