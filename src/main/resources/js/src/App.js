import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Users from './users/Users';
import Messages from './messages/Messages';

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
				users: [],
				messages: {_embedded:{messages:[]}},
				links: {
					users: {href: ''},
					messages: {href: ''}
				}
		};
		this.api = props.api;

		this.getUsers = this.getUsers.bind(this);
		this.getApi = this.getApi.bind(this);
		this.createUser = this.createUser.bind(this);
		this.showMessages = this.showMessages.bind(this);
		this.createMessage = this.createMessage.bind(this);
	}

	componentDidMount() {
		this.getApi(this.props.baseUrl).then( () => {
			this.getUsers();
			this.showMessages(this.cleanHref(this.state.links.messages.href));
		});
	}

	getApi(baseUrl) {
		return this.api.getApi(baseUrl)
		.then(links => this.setState({links: links}));
	}

	getUsers() {
		this.api.getUsers(this.state.links.users.href)
		.then(users => this.setState({users: users})); 
	}

	createUser(name) {
		this.api.postUser(this.state.links.users.href, name)
		.then(response => {
			this.getUsers();
		});
	}

	showMessages(href) {
		this.api.getMessages(href)
		.then(messages => this.setState(state => ({messages: messages}))); 
	}

	createMessage(sender, receiver, body) {
		this.api(this.cleanHref(this.state.links.messages.href), sender, receiver, body)
		.then(response => {
			console.log(response)
			this.showMessages(this.cleanHref(this.state.links.messages.href));
		});
	}

	cleanHref(href) {
		return href.replace(/{.*\}$/, '');
	}

	render() {
		return (
				<div className="App">
				<div className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
					<h2>Welcome to React</h2>
					</div>
					<Users users={this.state.users} messagesFor={this.cleanHref(this.state.links.messages.href) + '/search/findByReceiver?id='} allMessages={this.cleanHref(this.state.links.messages.href)} onCreateUser={this.createUser} onSelectUser={this.showMessages} />
					<Messages users={this.state.users} messages={this.state.messages} onShowMessages={this.showMessages} onCreateMessage={this.createMessage} />
					</div>
		);
	}
}

export default App;

