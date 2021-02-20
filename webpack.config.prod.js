const path = require('path')
const CleanPlugin = require('clean-webpack-plugin')

module.exports = {
	mode: 'production',
	entry: './src/app.ts',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
	plugins: [new CleanPlugin.CleanWebpackPlugin()],
}
