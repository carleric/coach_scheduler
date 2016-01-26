import React from 'react';
import ReactDOM from 'react-dom';
import CoachList from './components/coaches';
import Calendar from './components/calendar';


//require('bootstrap/dist/css/bootstrap.min.css');

//require('jquery/dist/jquery.js');
//require('fullcalendar/dist/fullcalendar.js');
//require('fullcalendar/dist/fullcalendar.min.css');

const colors = ['LightGreen', 'LightPink', 'LightSalmon', 'LightSeaGreen'];

const coaches = [
	{name:'Bob Ernst', availability: {events: [
		{title: 'Open', start: '2016-01-22T08:00', end: '2016-01-22T18:00'}, 
		{title: 'Open', start: '2016-01-23T08:00', end: '2016-01-23T18:00'}, 
		{title: 'Open', start: '2016-01-24T08:00', end: '2016-01-24T18:00'}],
		color:colors[0]}
	}, 
	{name:'John Parker', availability: {events: [
		{title: 'Open', start: '2016-01-23T08:00', end: '2016-01-23T18:00'}, 
		{title: 'Open', start: '2016-01-24T08:00', end: '2016-01-24T18:00'}, 
		{title: 'Open', start: '2016-01-25T08:00', end: '2016-01-25T18:00'}],
		color:colors[1]}
	}, 
	{name:'Dave White', availability: {events: [
		{title: 'Open', start: '2016-01-12T08:00', end: '2016-01-12T18:00'}, 
		{title: 'Open', start: '2016-01-13T08:00', end: '2016-01-13T18:00'}, 
		{title: 'Open', start: '2016-01-14T08:00', end: '2016-01-14T18:00'}],
		color:colors[2]}
	}
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