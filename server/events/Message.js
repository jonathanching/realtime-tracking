/**
 * ==================================================================================
 * Message.js: Handles all messages websocket events
 * ==================================================================================
 **/

const global = require('../data/Global.js');

let Message = function(io, socket) {
	this.io = io;
	this.socket = socket;


	//


	/* Match method to specified events */
	this.events = {
		new_message: newMessage.bind(this),
	};
}


/**
 * ==================================================================================
 * @Events
 * ==================================================================================
 **/

function newMessage(msg) {
	/* User validation */
	if(msg.user.id !== this.socket.id)
		return;

	/* Add date */
	let currentDate = new Date();
	msg.date = currentDate.getHours() + ':' + currentDate.getMinutes();

	/* Notify clients of the new message */
	this.io.sockets.emit('new_message', msg);
}




module.exports = Message;