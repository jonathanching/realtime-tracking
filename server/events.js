/**
 * ==================================================================================
 * Events.js: Handles all websocket events
 * ==================================================================================
 **/

const GPS = require('./events/GPS.js');

module.exports = function(io, redis, subscriber, publisher) {

	io.on('connection', function(socket) {
		console.log('socket created');

		/* Get current location */
		redis.get('location', (err, res) => {
			socket.emit('locationUpdate', res);
		});

		socket.on('disconnect', function() {
			console.log('socket disconnected');
		});


		/* List down all event managers */
		let managers = {
			gps: new GPS(io, socket, redis, subscriber, publisher),
		};

		/* Bind all specified events to websocket connection */
		for (let manager in managers) {
	        let events = managers[manager].events;
	        for (let event in events) {
	            socket.on(event, events[event]);
	        }
	    }
	});


	/**
	 * @Redis Events
	 * ==================================================================================
	 **/

	subscriber.on('subscribe', function (channel, count) {
        console.log('client subscribed to ' + channel);
	});

	subscriber.on('message', (channel,  message) => {
		console.log('client channel ' + channel + ': ' + message);
		io.emit(channel, message);
	});


	subscriber.subscribe('locationUpdate');
}