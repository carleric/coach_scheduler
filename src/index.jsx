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
		return event;
	});
	return coach.availability;
});

class App extends React.Component{
	constructor(props){
		super(props);
	}
	componenetDidMount() {
		console.log('App-mounted', this.props.params);
	}
	componentWillReceiveProps() {
		console.log('App-receivedProps', this.props.params);
	}
	componentDidUpdate (prevProps) {
		console.log('App-updated', this.props.params);
	}
	render() {
		console.log('App-render', this.props.params);
		return (
			<div className='container'>
				<div className='row'>
					<div className='col-md-12'>
						<Menu/>
					</div>
				</div>
				<div className='row'>
					{this.props.children && React.cloneElement(this.props.children, this.props)}  
				</div>
			</div>
		);
	}
}

class Menu extends React.Component{
	render() {
		return (
			<Link to="/coaches">Coaches</Link>
		);
	}
}

class CoachAvailability extends React.Component{
	componentDidMount () {
		console.log('CoachAvailability-mounted', this.props.params);
	}
	componentDidUpdate (prevProps) {
		console.log('CoachAvailability-updated', this.props.params);
	}
	render() {
		console.log('CoachAvailability-render');
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
}

class CoachListWrapper extends React.Component {
	render(){
		return (
			<CoachList coaches={coaches}/>
			);
	}
}

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="coaches" component={CoachListWrapper}/>
      <Route path="coach/:userId" component={CoachAvailability}/>
    </Route>
  </Router>
), document.getElementById('app'));