require('dotenv').config();

const port = process.env.PORT || 8080;
const env = process.env.NODE_ENV || 'dev';


module.exports = {
	port: port,
	env: env,

	isDev: () => {
		return ['dev', 'development', 'local', 'loc'].includes(env.toLowerCase());
	},
};