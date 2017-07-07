import React, {Component} from 'react';
import arrayEquals from 'array-equal';

class Messages extends Component {
	
  constructor(props) {
	  super(props);
	  
	  this.state = {
	    sender: 0,
	    receiver: 0,
	    body: ''
	  };
	  
	  this.changeSender = this.changeSender.bind(this);
	  this.changeReceiver = this.changeReceiver.bind(this);
	  this.changeBody = this.changeBody.bind(this);
	  this.sendMessage = this.sendMessage.bind(this);
  }
  
  componentWillReceiveProps(nextProps) {
	if(!arrayEquals(this.props.users, nextProps.users)) {
      this.setState({
        sender: nextProps.users.length > 2 ? nextProps.users[1].id : 0,
        receiver: nextProps.users.length > 2 ? nextProps.users[0].id : 0
      });		
	}  
	return true;
  }
  
  changeSender(event) {
	  this.setState({sender: event.target.value});
  }
  
  changeReceiver(event) {
	  this.setState({receiver: event.target.value});
  }
  
  changeBody(event) {
	  this.setState({body: event.target.value});
  }
  
  sendMessage() {
	this.props.onCreateMessage(this.state.sender, this.state.receiver, this.state.body);
  }
	
  render() {
	const {messages, users} = this.props
	const {onShowMessages} = this.props;
	let userMap = new Map();
	users.forEach(user => userMap.set(user.id, user.name));
	const {first, prev, next, last} = messages._links || {};
	return (
	  <div className="card">
	    <div className="card-block">
	      <nav>
	        <ul className="pagination pagination-sm mb-0 justify-content-end">
	          <li className={'page-item ' + (!first && 'disabled')}>
	            <button className="page-link" onClick={first && (() => onShowMessages(first.href))}>First</button>
	          </li>
	          <li className={'page-item ' + (!prev && 'disabled')}>
	            <button className="page-link" onClick={prev && (() => onShowMessages(prev.href))}>Previous</button>
	          </li>
	          <li className={'page-item ' + (!next && 'disabled')}>
	            <button className="page-link" onClick={next && (() => onShowMessages(next.href))}>Next</button>
	          </li>
	          <li className={'page-item ' + (!last && 'disabled')}>
	            <button className="page-link" onClick={last && (() => onShowMessages(last.href))}>Last</button>
	          </li>
	        </ul>
	      </nav>
	      <table className="table">
	        <thead>
	          <tr>
	            <th>Sender</th>
	            <th>Receiver</th>
	            <th>Message</th>
	          </tr>
	        </thead>
	        <tbody>
	        {messages._embedded.messages.map( message =>
	            <tr key={message._links.self.href}>
	              <td>{userMap.get(message.sender)}</td>
	              <td>{userMap.get(message.receiver)}</td>
	              <td>{message.body}</td>
	            </tr>
	          )
	        }
	        </tbody>
	        <tfoot>
	          <tr>
	            <td>
	              <select className="form-control" value={this.state.sender} onChange={this.changeSender}>
		          {users.map( (user) =>
		            <option value={user.id} key={user.id}>{user.name}</option>
		          )}
	              </select>
	            </td>
	            <td>
	              <select className="form-control" value={this.state.receiver} onChange={this.changeReceiver}>
		          {users.map( (user) =>
		            <option value={user.id} key={user.id}>{user.name}</option>
		          )}
	              </select>
	            </td>
	            <td>
	              <textarea className="form-control" rows="3" value={this.state.body} onChange={this.changeBody} />
	            </td>
	          </tr>
	          <tr>
	            <td colSpan="3" >
	              <button className="btn btn-secondary btn-block" onClick={this.sendMessage}>Send Message</button>
	            </td>
	          </tr>
	        </tfoot>
	      </table>
	    </div>
	  </div>
	);	
  }
}

export default Messages;