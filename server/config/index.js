require('dotenv').config();

const port = process.env.PORT || 8080;
const env = process.env.NODE_ENV || 'dev';
const redisPort = process.env.REDIS_PORT || 6379;
const redisCluster = process.env.REDIS_CLUSTER || '7000-7005';


module.exports = {
	port: port,
	env: env,
	redisPort: redisPort,
	redisCluster: () => {
		let range = redisCluster.split('-'),
			min = parseInt(range[0]), max = parseInt(range[1]),
			cluster = [];

		for(var i = min; i <= max; i++) {
			cluster.push({ port: i });
		}

		return cluster;
	},

	isDev: () => {
		return ['dev', 'development', 'local', 'loc'].includes(env.toLowerCase());
	},
};