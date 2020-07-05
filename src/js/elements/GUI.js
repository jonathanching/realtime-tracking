/**
 * ==================================================================================
 * GUI.js: Handles all interfaces
 * ==================================================================================
 **/

import { EVENTBUS } from '../EventBus.js';

export default class GUI {

	constructor(user) {
		this.user = user;

		this.domUserInput = document.getElementById('userInput');
		this.domUserModal = document.getElementById('userModal');
		this.domMsgInput = document.getElementById('msgInput');
		this.domUsersList = document.getElementById('chatUsers');
		this.domChatList = document.getElementById('chatMessages');


		this.init();
	}


	/**
	 * ==================================================================================
	 * @Methods
	 * ==================================================================================
	 **/

	init() {
		this.bindEvents();

		this.enableChat(false);
		this.domUserInput.focus();
	}


	/**
	 * Bind websocket & local events
	 */
	bindEvents() {
		/* ...User has entered their chatname */
		EVENTBUS.register('registered', (data) => {
			this.onRegistered(data);
		});

		/* ...New user has connected */
		EVENTBUS.register('connectedUser', (data) => {
			this.onConnectedUser(data);
		});

		/* ...User has disconnected */
		EVENTBUS.register('disconnectedUser', (data) => {
			this.onDisconnectedUser(data);
		});


		/* ...New chat message */
		EVENTBUS.register('newMessage', (data) => {
			this.onNewMessage(data);
		});
	}


	/**
	 * Create message DOM element
	 * @return {Object} msg
	 * @param  {Boolean} isSystem
	 */
	createMsg(msg, isSystem = false) {
		/* Create DOM elements for... */
		let li = document.createElement('li'),
			div = document.createElement('div'),
			h6 = document.createElement('h6'),
			p = document.createElement('p'),
			label = document.createElement('label');

		/* ...border element */
		div.className = 'chat__bubble';
		/* ...user's name & date */
		if(!isSystem) {
			h6.className = 'chat__bubble__user';
			h6.appendChild(document.createTextNode(msg.user.name));
			label.appendChild(document.createTextNode(msg.date));
			h6.appendChild(label);
			div.appendChild(h6);
		}
		/* ...new message */
		p.className = 'chat__bubble__msg';
		p.appendChild(document.createTextNode(msg.message));
		div.appendChild(p);
		/* Add in self tag if own message */
		li.className = (isSystem ? 'system' : msg.user.id === this.user.self.id ? 'self' : '');
		li.appendChild(div);

		return li;
	}

	/**
	 * Create system message obj
	 * @param  {String} msg
	 * @return {Object}
	 */
	createSystemMessage(msg) {
		return {
			user: {
				id: '1234-5678-9',
				name: 'System',
			},
			message: msg,
			data: '',
		};
	}


	/**
	 * ==================================================================================
	 * @Events
	 * ==================================================================================
	 **/

	/**
	 * Successful user registration
	 * @param {Object} user
	 */
	onRegistered(user) {
		/* Hide registration modal */
		this.enableRegistration(false);
		/* Enable message textarea */
		this.enableChat(true);
		/* Add welcome message */
		this.addSystemMessage('Welcome to the Chat Room ' + user.name + '!');
	}

	/**
	 * New user has joined the chat
	 * @return {Object} user
	 */
	onConnectedUser(user) {
		this.addUser(user);
	}

	/**
	 * User has left the chat
	 * @param {String} id
	 */
	onDisconnectedUser(id) {
		this.removeUser(id);
	}

	/**
	 * New chat message
	 * @param {String} id
	 */
	onNewMessage(msg) {
		this.addMessage(msg);
	}


	/**
	 * ==================================================================================
	 * @Controller
	 * ==================================================================================
	 **/

	/**
	 * Show/hide the user registration modal
	 * @param {Boolean} show
	 */
	enableRegistration(show) {
		this.domUserModal.classList[show ? 'remove' : 'add']('chat__overlay--hide');
	}

	/**
	 * Enable/Disable all message textarea
	 */
	enableChat(on) {
		this.domMsgInput.disabled = !on;

		if(on) this.domMsgInput.focus();
	}


	/**
	 * Add message to the list
	 * @param {Object}  msg
	 * @param {Boolean} isSystem
	 */
	addMessage(msg, isSystem = false) {
		/* Create message and append to DOM */
		this.domChatList.appendChild(this.createMsg(msg, isSystem));
		/* Scroll to bottom */
		this.domChatList.scrollTop = this.domChatList.scrollHeight;
	}

	/**
	 * Add system/admin message
	 * @param {String} msg
	 */
	addSystemMessage(msg) {
		this.addMessage(
			this.createSystemMessage(msg)
		, true);
	}

	/**
	 * Add user to list
	 * @param {Object} user
	 */
	addUser(user) {
		if(!this.domUsersList) return;

		/* Create list and append to the DOM */
		let li = document.createElement('li');
		li.dataset.id = user.id;
		li.appendChild(document.createTextNode(user.name));

		this.domUsersList.appendChild(li);
	}

	/**
	 * Remove specified user to list
	 * @param  {Object} user
	 */
	removeUser(id) {
		if(!this.domUsersList) return;

		/* Find list and disable it */
		let li = this.domUsersList.querySelectorAll('li[data-id="' + id + '"]');
		li.forEach((item) => {
			item.classList.add('disabled');

			/* Add left the chat message */
			this.addSystemMessage(item.innerHTML + ' has left the chat...');
		});
	}


    /**
     * ==================================================================================
     * @DEVELOPMENT
     * ==================================================================================
     **/

    log(event, msg) {
		console.log(`GUI.js | ${event}: ${msg}`);
    }
}