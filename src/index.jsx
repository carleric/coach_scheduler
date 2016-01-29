import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link } from 'react-router';
import CoachList from './components/coaches';
import Calendar from './components/calendar';
import createHistory from 'history/lib/createBrowserHistory';
import axios from 'axios';

let history = createHistory();

//root component
class App extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			selectedCoachId: '', 
			coaches: [], 
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

	componentDidMount() {
		var coachPromise = axios.get('http://localhost:3000/api/coaches');
		coachPromise.then(function(data){
			this.setState({coaches: data.data});
		}.bind(this));
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
					{this.props.children && React.cloneElement(this.props.children, {coachId: this.state.selectedCoachId, coaches: this.state.coaches})}  
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
					<CoachList coachId={this.props.coachId} coaches={this.props.coaches} />
				</div>
				<div className='ten wide column'>
					<Calendar coachId={this.props.coachId} coaches={this.props.coaches}/>
				</div>
			</div>
		);
	}
}

class CoachBios extends React.Component {
	constructor(props){
		super(props);
		this.getBioForCoach = this.getBioForCoach.bind(this);
	}
	getBioForCoach(coachId){
		console.log('getBioForCoach', coachId);
		const id = coachId == undefined ? this.props.coachId : coachId;
		if(id == undefined || id == -1 || id == '') return;
		const {calendar} = this.refs;
    	const index = _.findIndex(this.props.coaches, function(coach) { return coach._id == id});
    	return this.props.coaches[index].bio;
	}
	render(){
		console.log('CoachBios', this.props);
		return (
			<div className='ui grid'>
				<div className='six wide column'>
					<CoachList coachId={this.props.coachId} coaches={this.props.coaches} />
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