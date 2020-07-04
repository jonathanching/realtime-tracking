/**
 * ==================================================================================
 * User.js: Handles all user websocket events
 * ==================================================================================
 **/

const global = require('../data/Global.js');

let User = function(io, socket) {
	this.io = io;
	this.socket = socket;


	/**
	 * ==================================================================================
	 * @Methods
	 * ==================================================================================
	 **/
	this.createUser = function(name) {
		let user = {
			/* Use own socket ID */
			id: this.socket.id,
			name: name,
		};

		this.socket.name = name;

		/* Store to socket and add user to collection */
		global.users.push(user);

		return user;
	};

	/**
	 * ==================================================================================
	 * @Getter/Setter
	 * ==================================================================================
	 **/
	this.getUser = function(id) {
		for(var i = 0; i < global.users.length; i++) {
			if(global.users[i].id === id)
				return i;
		}
		return -1;
	};


	/* Match method to specified events */
	this.events = {
		disconnect: disconnect.bind(this),
		new_user: newUser.bind(this),
	};
}


/**
 * ==================================================================================
 * @Events
 * ==================================================================================
 **/

function disconnect() {
	let user = this.getUser(this.socket.id);
	if(!this.socket.id || user === -1)
		return;

	/* Remove user from collection */
	global.users.splice(user, 1);

	/* Notify clients of the disconnected user */
	this.io.sockets.emit('remove_user', this.socket.id);
}

function newUser(name) {
	/* Create user & add to collection */
	let user = this.createUser(name);

	/* Notify clients for the new user */
	this.socket.broadcast.emit('new_user', user);
	/* Notify self for the user data & online user list */
	this.socket.emit('own_user', {
		self: user,
		users: global.users,
	});
}




module.exports = User;