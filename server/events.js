/**
 * ==================================================================================
 * Events.js: Handles all websocket events
 * ==================================================================================
 **/

const User = require('./events/User.js');
const Message = require('./events/Message.js');

module.exports = function(io) {

	io.on('connection', function(socket) {
		/* List down all event managers */
		let managers = {
			user: new User(io, socket),
			message: new Message(io, socket)
		};

		/* Bind all specified events to websocket connection */
		for (let manager in managers) {
	        let events = managers[manager].events;
	        for (let event in events) {
	            socket.on(event, events[event]);
	        }
	    }
	});
}