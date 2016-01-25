import React from 'react';
import ReactDOM from 'react-dom';
import Coaches from '../components/coaches';
import Calendar from '../components/calendar';


//require('bootstrap/dist/css/bootstrap.min.css');

//require('jquery/dist/jquery.js');
//require('fullcalendar/dist/fullcalendar.js');
//require('fullcalendar/dist/fullcalendar.min.css');

const coaches = [
	'Bob Ernst', 
	'John Parker', 
	'Dave White'
	];


const App = React.createClass({
	render: function() {
		return (
			<div className='container'>
				<div className='col-md-4'>
					<Coaches coaches={coaches} />
				</div>
				<div className='col-md-8'>
					<Calendar />
				</div>
			</div>
		);
	}
});


ReactDOM.render(
	<App/>,
	document.getElementById('app')
);