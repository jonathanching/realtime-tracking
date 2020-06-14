const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		main: [
			'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
			'./src/js/app.js'
		]
	},

	output: {
		path: path.join(__dirname, 'dist'),
		publicPath: '/',
		filename: '[name].js',
	},

	mode: 'development',
	target: 'web',
	devtool: 'source-map',
	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'eslint-loader',
				options: {
					emitWarning: true,
					failOnError: false,
					failOnWarning: false
				},
			},
			{
				/* Transpile ES6 into ES5 */
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				/* Load the JS files to the HTML template */
				test: /\.html$/,
				use: [{
					loader: 'html-loader',
				}],
			},
			{
		        test: /\.s[ac]ss$/i,
		        use: [
		          'style-loader',
		          'css-loader',
		          'sass-loader',
		        ],
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					'file-loader'
				],
			},
		],
	},

	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
			filename: './index.html',
			excludeChunks: ['server'],
		}),
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.HotModuleReplacementPlugin(),
	],
};