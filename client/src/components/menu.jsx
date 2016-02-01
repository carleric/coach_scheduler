import React from 'react';
import { Link } from 'react-router';

class Menu extends React.Component{
	constructor(props){
		super(props);
	}

	render() {
		return (
			<div className='ui top attached menu'>
				<Link className='item' activeClassName='item active' to='/'>Home</Link>
				{this.props.loggedIn && <Link className='item' to='/me' activeClassName='item active'>{this.props.user.username}</Link>}
				{this.props.loggedIn && <Link className='item' to="/logout" activeClassName='item active'>Log out</Link> || <Link className='item' activeClassName='item active' to="/login">Sign in</Link>}
			</div>
			);
	}
}

module.exports = {
	Menu : Menu
};