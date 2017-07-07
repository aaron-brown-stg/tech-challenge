

export class Api {
	
	constructor(f) {
		this.f = f;
	}
	
	getApi(baseUrl) {
		return this.f(baseUrl)
		.then(response => response.json())
		.then(json => json._links);
	}

	getUsers(href) {
		return this.f(href)
		.then(response => response.json())
		.then(json => json._embedded.users);
	}

	postUser(href, name) {
		return this.f(href, {
			method: 'POST',
			body: JSON.stringify({name: name}),
			headers: {"Content-Type": "application/json"}
		})
	}

	getMessages(href) {
		return this.f(href)
		.then(response => response.json());
	}

	postMessage(href, sender, receiver, body) {
		return this.f(this.cleanHref(this.state.links.messages.href), {
			method: 'POST',
			body: JSON.stringify({sender: sender, receiver: receiver, body: body}),
			headers: {"Content-Type": "application/json"}
		})
	}
}

export default new Api(fetch.bind(window));