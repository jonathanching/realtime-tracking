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

require('./events.js')(io);



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