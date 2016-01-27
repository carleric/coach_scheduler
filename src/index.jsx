import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';
import CoachList from './components/coaches';
import Calendar from './components/calendar';

const colors = ['LightGreen', 'LightPink', 'LightSalmon', 'LightSeaGreen'];
const coaches = [
	{id: 1, name:'Bob Ernst', availability: {events: [
		{title: 'Open', start: '2016-01-22T08:00', end: '2016-01-22T18:00'}, 
		{title: 'Open', start: '2016-01-23T08:00', end: '2016-01-23T18:00'}, 
		{title: 'Open', start: '2016-01-24T08:00', end: '2016-01-24T18:00'}],
		color:colors[0]}
	}, 
	{id: 2, name:'John Parker', availability: {events: [
		{title: 'Open', start: '2016-01-23T08:00', end: '2016-01-23T18:00'}, 
		{title: 'Open', start: '2016-01-24T08:00', end: '2016-01-24T18:00'}, 
		{title: 'Open', start: '2016-01-25T08:00', end: '2016-01-25T18:00'}],
		color:colors[1]}
	}, 
	{id: 3, name:'Dave White', availability: {events: [
		{title: 'Open', start: '2016-01-12T08:00', end: '2016-01-12T18:00'}, 
		{title: 'Open', start: '2016-01-13T08:00', end: '2016-01-13T18:00'}, 
		{title: 'Open', start: '2016-01-14T08:00', end: '2016-01-14T18:00'}],
		color:colors[2]}
	}
	];

const eventSources = coaches.map(function(coach) {
	coach.availability.events = coach.availability.events.map(function(event) {
		event.title = coach.name;
		//event.rendering = 'background';
		return event;
	});
	return coach.availability;
});

const App = React.createClass({
	componenetDidMount: function() {
		console.log('App-mounted', this.props.params);
	},
	componentWillReceiveProps: function() {
		console.log('App-receivedProps', this.props.params);
	},
	componentDidUpdate: function (prevProps) {
		console.log('App-updated', this.props.params);
	},
	render: function() {
		console.log('App-render', this.props.params);
		return (
			<div className='container'>
				<div className='row'>
					<div className='col-md-12'>
						<p>Menu</p>
					</div>
				</div>
				<div className='row'>

					{this.props.children && React.cloneElement(this.props.children, this.props)}  
				</div>
			</div>
		);
	}
});

const CoachAvailability = React.createClass({
	componentDidUpdate: function (prevProps) {
		console.log('CoachAvailability-cdu', this.props.params);
	},
	render: function() {
		return (
			<div>
				<div className='col-md-2'>
					<CoachList coaches={coaches} />
				</div>
				<div className='col-md-10'>
					<Calendar parentParams={this.props.params} coaches={coaches}/>
				</div>
			</div>
		);
	}
});

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="coaches" component={CoachList}/>
      <Route path="coach/:userId" component={CoachAvailability}/>
    </Route>
  </Router>
), document.getElementById('app'));