import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link } from 'react-router';
import CoachList from './components/coaches';
import Calendar from './components/calendar';
import createHistory from 'history/lib/createBrowserHistory';

let history = createHistory();


//mock data 
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
	coach.bio = coach.name + " Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";
	coach.availability.events = coach.availability.events.map(function(event) {
		event.title = coach.name;
		return event;
	});
	return coach.availability;
});


//root component
class App extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			selectedCoachId: '', 
			coaches: coaches, 
			viewMode: 'Coaches'
		};
		this.handleCoachChange = this.handleCoachChange.bind(this);
		this.handleViewModeChange = this.handleViewModeChange.bind(this);
		this.navigate = this.navigate.bind(this);
	}

	handleViewModeChange(viewMode) {
		console.log('App.handleViewModeChange', viewMode);
		//this.setState({viewMode: viewMode});
		//this.navigate();
	}

	handleCoachChange(coachId) {
		console.log('App.handleCoachChange', coachId);
		//this.setState({selectedCoachId: coachId});
		//this.navigate();
	}

	navigate(){
		if(this.state.viewMode == 'Coaches') {
			history.push('/coaches');
		} else if(this.state.viewMode == 'Availability') {
			history.push('/coach/'+this.state.selectedCoachId);
		}
	}

	componentWillReceiveProps(props) {
		console.log('App willReceiveProps', props, this.state);
		this.setState({selectedCoachId: props.params.coachId});
	}
	componentDidReceiveProps(props) {
		console.log('App didReceiveProps', props, this.state);
	}

	render() {
		console.log('App-render', this.props);
		return (
			<div className='ui container'>
				<div className='ui segments'>
					<div className='ui segment'>
						<Menu onViewModeChange={this.handleViewModeChange}/>
					</div>
				</div>
				<div className='ui segment'>
					{this.props.children && React.cloneElement(this.props.children, {onCoachChange: this.handleCoachChange, coachId: this.state.selectedCoachId, coaches: this.state.coaches})}  
				</div>
			</div>
		);
	}
}

class Menu extends React.Component{
	constructor(props){
		super(props);
		this.handleViewModeChange = this.handleViewModeChange.bind(this);
	}
	handleViewModeChange(viewMode){
		this.props.onViewModeChange(viewMode);
	}
	render() {
		return (
			<div className='ui top attached menu'>
				<MenuItem viewMode='Home' onViewModeChange={this.props.onViewModeChange}/>
			</div>
		);
	}
}

class MenuItem extends React.Component{
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick(){
		this.props.onViewModeChange(this.props.viewMode);
	}
	render() {
		return (<a className='item' onClick={this.handleClick}>{this.props.viewMode}</a>);
	}
}

class CoachAvailability extends React.Component{
	// componentDidMount () {
	// 	console.log('CoachAvailability-mounted', this.props.params);
	// }
	// componentDidUpdate (prevProps) {
	// 	console.log('CoachAvailability-updated', this.props.params);
	// }
	render() {
		console.log('CoachAvailability-render', this.props.params);
		return (
			<div className='ui grid'>
				<div className='six wide column'>
					<CoachList onCoachChange={this.props.onCoachChange} coachId={this.props.coachId} coaches={coaches} />
				</div>
				<div className='ten wide column'>
					<Calendar coachId={this.props.coachId} coaches={coaches}/>
				</div>
			</div>
		);
	}
}

class CoachBios extends React.Component {
	constructor(props){
		super(props);
		//this.selectedCoachId = 1;
		this.handleCoachChange = this.handleCoachChange.bind(this);
		this.getBioForCoach = this.getBioForCoach.bind(this);
	}
	handleCoachChange(coachId){
		//this.setState({selectedCoachId : coachId});
		this.props.onCoachChange(coachId);
	}
	getBioForCoach(coachId){
		console.log('getBioForCoach', coachId);
		const id = coachId == undefined ? this.props.coachId : coachId;
		if(id == undefined || id == -1 || id == '') return;
		const {calendar} = this.refs;
    	const index = _.findIndex(this.props.coaches, function(coach) { return coach.id == id});
    	return this.props.coaches[index].bio;
	}
	render(){
		console.log('CoachBios', this.props);
		return (
			<div className='ui grid'>
				<div className='six wide column'>
					<CoachList onCoachChange={this.handleCoachChange} coachId={this.props.coachId} coaches={coaches} />
				</div>
				<div className='ten wide column'>
					{this.getBioForCoach()}
				</div>
			</div>
			);
	}
}

ReactDOM.render((
  <Router history={history}>
    <Route path="/" component={App}>
      <Route path="coaches" component={CoachBios}/>
      <Route path="coach/:coachId/bio" component={CoachBios}/>
      <Route path="coach/:coachId/sched" component={CoachAvailability}/>
    </Route>
  </Router>
), document.getElementById('app'));