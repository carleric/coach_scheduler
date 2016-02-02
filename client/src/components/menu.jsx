import React from 'react';
import { Link } from 'react-router';

class Menu extends React.Component{
	constructor(props){
		super(props);
	}

	render() {
		return (
			<div className='ui grey inverted bottom attached small menu'>
				{this.props.loggedIn && <Link className='item' activeClassName='item active' to='/coaches'>Coaches</Link>}
				{this.props.loggedIn && <Link className='item' to='/me' activeClassName='item active'>Appointments</Link>}
				{this.props.loggedIn 
					&& <div className='right menu'>
							<div className='item'>
								<div className='ui labeled small button'>
									<div className='ui small button'>
										<Link to="/logout">Log out</Link>
									</div> 
									<div className='ui basic label'>
										{this.props.user.username}
									</div>
								</div>
							</div>
						</div>
					|| <div className='right menu'>
							<div className='item'>
								<div className='ui small button'>
									<Link to="/login">Sign in</Link>
								</div>
							</div>
						</div>}
			</div>
			);
	}
}

module.exports = {
	Menu : Menu
};