/**
 * ==================================================================================
 * GPS.js: Handles all GPS/location websocket events
 * ==================================================================================
 **/

const global = require('../data/Global.js');

let GPS = function(io, socket, redis, subscriber, publisher) {
	this.io = io;
	this.socket = socket;
	this.redis = redis;
	this.subscriber = subscriber;
	this.publisher = publisher;


	//


	/* Match method to specified events */
	this.events = {
		lastKnownLocation: setLocation.bind(this),
	};
}


/**
 * ==================================================================================
 * @Events
 * ==================================================================================
 **/

function setLocation(data) {
	let location = JSON.stringify(data);

	this.redis.set('location', location);
	this.publisher.publish('locationUpdate', location);
}




module.exports = GPS;