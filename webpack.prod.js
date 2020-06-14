const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
	entry: {
		main: './src/js/app.js',
	},

	output: {
		path: path.join(__dirname, 'dist'),
		publicPath: '/',
		filename: '[name].js',
	},

	target: 'web',
	devtool: 'source-map',

	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
				sourceMap: false
			}),
			new OptimizeCSSAssetsPlugin({})
		],
	},

	module: {
		rules: [
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
					options: {
						minimize: true
					}
				}],
			},
			{
		        test: /\.s[ac]ss$/i,
		        use: [
		          MiniCssExtractPlugin.loader,
		          'css-loader',
		          'sass-loader',
		        ],
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					'file-loader', 'url-loader'
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
	    new MiniCssExtractPlugin({
			filename: "styles.css",
			chunkFilename: "[id].css"
		}),
	],
};