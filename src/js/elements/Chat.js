/**
 * ==================================================================================
 * Chat.js: Handles all `chat` functions on the websocket connection
 * ==================================================================================
 **/

import { EVENTBUS } from '../EventBus.js';

export default class Chat {

	constructor(socket, user) {
		this.socket = socket;
		this.user = user;

		this.domMsgInput = document.getElementById('msgInput');

		this.init();
	}

	/**
	 * ==================================================================================
	 * @Methods
	 * ==================================================================================
	 **/

	init() {
		this.bindEvents();
		this.bindControls();
	}


	/**
	 * Bind websocket events
	 */
	bindEvents() {
		/* ...On new chat message */
		this.socket.on('new_message', (msg) => { // this.log('New message', msg.message);
			EVENTBUS.emit('newMessage', msg);
		});

		/* ...On registered user keypresses */
		this.socket.on('is_typing', (user) => {
			if(user.id !== this.user.id) { // this.log('Is typing', this.user.name);
				//
			}
		});
	}

	/**
	 * Bind controls
	 */
	bindControls() {
		/* Add in sending message */
		this.domMsgInput.addEventListener('keyup', (event) => {
			event.preventDefault();
			if(event.keyCode == 13 && event.target.value) {
				this.message(event.target.value);
			}
		});

		/* Add in listener for typing event */
		this.domMsgInput.addEventListener('keypress', (event) => {
			if(event.keyCode != 13) {
				// this.socket.emit('is_typing', this.user);
			}
		});
	}


    /**
     * ==================================================================================
     * @Controller
     * ==================================================================================
     **/

	/**
	 * Send in chat message
	 * @param  {String} msg
	 */
	message(msg) {
		if(!msg) return;

		/* Notify server for the new message */
		this.socket.emit('new_message', {
			user: this.user.self,
			message: msg
		});

		/* Clear message */
		this.domMsgInput.value = '';
	}


    /**
     * ==================================================================================
     * @DEVELOPMENT
     * ==================================================================================
     **/

    log(event, msg) {
		console.log(`Chat.js | ${event}: ${msg}`);
    }
}