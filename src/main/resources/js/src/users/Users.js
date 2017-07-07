import React, {Component} from 'react';

class Users extends Component {

  constructor(props) {
	  super(props);
	  this.state = {newName: ''};
	  
	  this.changeName = this.changeName.bind(this);
	  this.changeSelected = this.changeSelected.bind(this);
  }
  
  changeName(event) {
	const newName = event.target.value;
	if(newName.match(/^[a-zA-Z ]+$/)) {
	  this.setState({newName: event.target.value});
	}
  }
  
  changeSelected(event) {
	var value = event.target.value;
	if (value < 0) {
      this.props.onSelectUser(this.props.allMessages);
	} else {
		this.props.onSelectUser(this.props.messagesFor + value);
	}
  }

  render() {
	const {users} = this.props;
	const {onCreateUser} = this.props;
	return (
	  <div className="card">
	    <div className="card-block">
	      <div className="form-group">
	        <label htmlFor="users-select">Select Receiver</label>
	        <select className="form-control" id="users-select" onChange={this.changeSelected}>
	          <option value={-1}>Show all messages</option>
	          {users.map( (user) =>
	            <option value={user.id} key={user.id}>{user.name}</option>
	          )}
	        </select>
	      </div>
	      <div className="input-group">
	        <input type="text" className="form-control" id="new-user-name" placeholder="User's Name" value={this.state.newName} onChange={this.changeName}/>
	          <span className="input-group-btn">
	            <button className="btn btn-secondary" onClick={() => onCreateUser(this.state.newName)}>Create New User</button>
	          </span>
	      </div>
	    </div>
	  </div>
    );
  }
}


export default Users;