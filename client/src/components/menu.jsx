import React from 'react';
import { Link } from 'react-router';

class Menu extends React.Component{
	constructor(props){
		super(props);
	}

	render() {
		return (
			<div className='ui top attached menu'>
				<Link className='item' activeClassName='item active' to='/'>Coaches</Link>
				{this.props.loggedIn && <Link className='item' to='/me' activeClassName='item active'>Appointments</Link>}
				{this.props.loggedIn && <div className='right menu'><Link className='item' to="/logout" activeClassName='item active'>Log out</Link></div> || <div className='right menu'><Link className='item' activeClassName='item active' to="/login">Sign in</Link></div>}
			</div>
			);
	}
}

module.exports = {
	Menu : Menu
};