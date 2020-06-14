const path = require('path');
const webpack = require('webpack');
const express = require('express');
const config = require('./config/index.js');

const app = express();
const DIST_DIR = path.join(__dirname, '../dist');
	  HTML_FILE = path.join(DIST_DIR, 'index.html');


/**
 * ==================================================================================
 * @HMR
 * ==================================================================================
 **/
if (config.isDev()) {
	const webpackDevMiddleware = require('webpack-dev-middleware');
	const webpackHotMiddleware = require('webpack-hot-middleware');
    const clientConfig = require('../webpack.dev.js');
    const compiler = webpack(clientConfig);

	app.use(webpackDevMiddleware(compiler, {
			publicPath: clientConfig.output.publicPath,
		})
	);

	app.use(webpackHotMiddleware(compiler));
}


/**
 * ==================================================================================
 * @Socket.io
 * ==================================================================================
 **/
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const users = [];

io.on('connection', function(socket) {
	console.log('New connection...');

	/**
	 * @Methods
	 * ==================================================================================
	 **/
	const getUser = function(id) {
		for(var i = 0; i < users.length; i++) {
			if(users[i].id === id)
				return i;
		}
		return -1;
	};
	const createUser = function(name) {
		return {
			/* Use own socket ID */
			id: socket.id,
			name: name,
		};
	};
	const addUser = function(socket, user) {
		/* Store to socket and add user to collection */
		users.push(user);

		/* Notify clients for the new user */
		socket.broadcast.emit('new_user', user);
	};
	const removeUser = function(id) {
		let user = getUser(id);
		if(!id || user === -1) return;

		/* Remove user from collection */
		users.splice(user, 1);

		/* Notify clients of the disconnected user */
		io.sockets.emit('remove_user', id);
	};

	/**
	 * @Listeners
	 * ==================================================================================
	 **/
	socket.on('disconnect', function() {
		removeUser(this.id);
	});

	socket.on('new_user', function(name) {
		/* Create user and send its generated ID */
		let user = createUser(name);
		addUser(this, user);

		this.emit('own_user', {
			self: user,
			users: users,
		});
	});

	socket.on('new_message', function(msg) {
		/* Add date */
		let currentDate = new Date();
		msg.date = currentDate.getHours() + ':' + currentDate.getMinutes();

		/* Notify clients of the new message */
		io.sockets.emit('new_message', msg);
	});

	socket.on('is_typing', function(user) {
		this.broadcast.emit('is_typing', user);
	});
});



/**
 * ==================================================================================
 * @Routes
 * ==================================================================================
 **/
/* Serve static files */
app.use(express.static(DIST_DIR));

app.get('/', (req, res) => {
	res.sendFile(HTML_FILE);
});





http.listen(config.port, () => {
	console.log(`App listening to ${config.port}...`);
	console.log('Press CTRL+C to quit');
});