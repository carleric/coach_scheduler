import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, IndexRoute } from 'react-router';
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
			coaches: []
		};
	}

	componentWillReceiveProps(props) {
		console.log('App willReceiveProps', props, this.state);
		this.setState({selectedCoachId: props.params.coachId});
	}

	componentWillMount() {
		console.log('App.componentWillMount', this.props.params)
		this.setState({selectedCoachId: this.props.params.coachId});
	}
	componentDidMount() {
		console.log('App.componentDidMount')
		var coachPromise = axios.get('http://localhost:3000/api/coaches');
		coachPromise.then(function(data){
			this.setState({coaches: data.data});
			
		}.bind(this));
	}
	render() {
		console.log('App-render', this.props, this.state);
		return (
			<div className='ui container'>
				<div className='ui segments'>
					<div className='ui segment'>
						<Menu/>
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
	}
	render() {
		return (
			<div className='ui top attached menu'>
				<Link className='item' to='/'>Home</Link>
			</div>
		);
	}
}

class CoachAvailability extends React.Component{
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

ReactDOM.render((
  <Router history={history}>
    <Route path="/" component={App}>
      <IndexRoute component={CoachList}/>
      <Route path="coach/:coachId/bio" component={CoachBios}/>
      <Route path="coach/:coachId/sched" component={CoachAvailability}/>
    </Route>
  </Router>
), document.getElementById('app'));