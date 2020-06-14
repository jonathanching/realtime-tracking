/**
 * ==================================================================================
 * User.js: Handles storage and authentication of current user
 * ==================================================================================
 **/

import { EVENTBUS } from '../EventBus.js';

export default class User {

	constructor(socket) {
		this.socket = socket;
		/* Current user */
		this.self = null;
		/* Online users */
		this.users = [];

		this.domUserInput = document.getElementById('userInput');


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
		/* ...On successful registration of user */
		this.socket.on('own_user', (data) => { // this.log('User ID', data.self.id);
			this.setUser(data.self);
			this.addUsers(data.users);

			EVENTBUS.emit('registered', this.self);
		});

		/* ...On new registered users */
		this.socket.on('new_user', (user) => { // this.log('New user', user.id, user.name);
			this.addUser(user);
		});

		/* ...On disconnection of registered users */
		this.socket.on('remove_user', (id) => { // this.log('Remove user', id);
			if(id) {
				EVENTBUS.emit('disconnectedUser', id);
			}
		});
	}

	/**
	 * Bind DOM controls
	 */
	bindControls() {
		/* Add in user registration */
		this.domUserInput.addEventListener('keyup', (event) => {
			event.preventDefault();
			if(event.keyCode == 13 && event.target.value) {
				this.register(event.target.value);
			}
		});
	}


    /**
     * ==================================================================================
     * @Controller
     * ==================================================================================
     **/

    /**
     * Register user on current session
     * @param {String} name
     */
	register(name) {
		if(!name) return;

		/* Notify server for the new user */
		this.socket.emit('new_user', name);
	}


	/**
	 * Add array of users to collection
	 * @param {Array} users
	 */
	addUsers(users) {
		for(let user of users) {
			this.addUser(user);
		}
	}

    /**
     * Add user to collection
     * @param {Object} user
     */
	addUser(user) {
		if(!this.hasUser(user)) {
			this.users.push(user.id);

			EVENTBUS.emit('connectedUser', user);
		}
	}


    /**
     * ==================================================================================
     * @Getter/Setter
     * ==================================================================================
     **/

    /**
     * Set current/registered user
     * @param {Object} user
     */
	setUser(user) {
		this.self = user;
	}


    /**
     * ==================================================================================
     * @Checker
     * ==================================================================================
     **/

    /**
     * Check if user already exists
     * @param  {String}  id
     * @return {Integer}
     */
	hasUser(id) {
		if(!this.users.length) return false;
		return this.users.indexOf(id) > -1;
	}


    /**
     * ==================================================================================
     * @DEVELOPMENT
     * ==================================================================================
     **/

    log(event, msg) {
		console.log(`User.js | ${event}: ${msg}`);
    }
}