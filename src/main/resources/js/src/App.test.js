import React from 'react';
import { shallow, mount } from 'enzyme';
import App from './App';
import Users from './users/Users';
import Messages from './messages/Messages';

const mockPromise = (data, promise) => {
	return {"then": (resolve) => {
		resolve(data);
		return promise;
	}};
};

const mockApi = {
		getApi: jest.fn().mockReturnValue(mockPromise({
				"users": {"href": "/test/users"},
				"messages": {"href": "/test/messages"}
			}, mockPromise())),
		getUsers: jest.fn().mockReturnValue(mockPromise([])),
		postUser: jest.fn().mockReturnValue(mockPromise({})),
		getMessages: jest.fn().mockReturnValue(mockPromise({"_embedded": {"messages":[]}})),
		postMessage: jest.fn().mockReturnValue(mockPromise({})),
};

beforeEach(() => {
	mockApi.getApi.mockClear();
	mockApi.getUsers.mockClear();
	mockApi.postUser.mockClear();
	mockApi.getMessages.mockClear();
	mockApi.postMessage.mockClear();
});

it('renders without crashing', () => {
	const wrapper = shallow(<App baseUrl='/test' />);
		expect(wrapper).not.toBeNull();
		expect(wrapper.find('div.App-header').length).toEqual(1);
		expect(wrapper.find('div.App-header').text()).toEqual('Welcome to React');
});

it('renders the Users section', () => {
	const wrapper = shallow(<App baseUrl='/test' />).find(Users);
		expect(wrapper.length).toEqual(1);
		expect(wrapper.prop('users')).toEqual([]);
		expect(wrapper.prop('allMessages')).toEqual('');
		expect(wrapper.prop('messagesFor')).toEqual('/search/findByReceiver?id=');
		expect(wrapper.prop('onCreateUser')).toBeDefined();
		expect(wrapper.prop('onSelectUser')).toBeDefined();
});

it('renders the Messages section', () => {
	const wrapper = shallow(<App baseUrl='/test' />).find(Messages);
		expect(wrapper.length).toEqual(1);
		expect(wrapper.prop('users')).toEqual([]);
		expect(wrapper.prop('messages')).toEqual({"_embedded": {"messages": []}});
		expect(wrapper.prop('onShowMessages')).toBeDefined();
		expect(wrapper.prop('onCreateMessage')).toBeDefined();
});

it('calls api on componentDidMount', () => {
	spyOn(App.prototype, 'getApi').and.callThrough();
	spyOn(App.prototype, 'getUsers').and.callThrough();
	spyOn(App.prototype, 'showMessages').and.callThrough();
	const wrapper = mount(<App baseUrl='/test' api={mockApi} />);
	expect(App.prototype.getApi).toHaveBeenCalledWith('/test');
	expect(App.prototype.getUsers).toHaveBeenCalled();
	expect(App.prototype.showMessages).toHaveBeenCalled();
	expect(wrapper.state('links')).toEqual({
		"users": {"href": "/test/users"},
		"messages": {"href": "/test/messages"}
	});
});
	
it('calls api on getApi', () => {
	const mockApp = new App({
		"baseUrl": "/test",
		"api": mockApi
	});
	const setState = mockApp.setState = jest.fn();
	mockApp.getApi('/test');
	expect(mockApi.getApi.mock.calls.length).toBe(1);
	expect(mockApi.getApi.mock.calls[0][0]).toEqual('/test');
	expect(setState.mock.calls[0][0]).toEqual({"links": {"messages": {"href": "/test/messages"}, "users": {"href": "/test/users"}}});
});

it('calls api on getUsers', () => {
	const mockApp = new App({
		"baseUrl": "/test",
		"api": mockApi
	});
	const setState = mockApp.setState = jest.fn();
	mockApp.getUsers();
	expect(setState.mock.calls[0][0]).toEqual({"users": []});
});

it('calls api on createUser', () => {
	expect(mockApi.postUser.mock.calls.length).toBe(0);
	const mockApp = new App({
		"baseUrl": "/test",
		"api": mockApi
	});
	const getUsers = mockApp.getUsers = jest.fn();
	mockApp.createUser('McTest');
	expect(mockApi.postUser.mock.calls.length).toBe(1);
	expect(mockApi.postUser.mock.calls[0][1]).toEqual('McTest');
	expect(getUsers.mock.calls.length).toBe(1);
});

