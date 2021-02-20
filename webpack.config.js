const path = require('path')

module.exports = {
	entry: './src/app.ts',
	mode: 'development',
	devtool: 'inline-source-map',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/dist/',
	},
	devServer: {
		contentBase: '.',
		compress: true,
		port: 3000,
		open: 'chrome',
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
	plugins: [],
}
