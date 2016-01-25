import React from 'react';

export default React.createClass({
	handleClick: function () {
		//$('#calendar').fullCalendar();
	},
	render: function() {
		return <ul>
			{this.props.coaches.map(coach => 
				<li key={coach} onClick={this.handleClick}>{coach}</li>
			)}
		</ul>;
	}
});