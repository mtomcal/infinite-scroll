var path = require('path');
var webpack = require('webpack');
var precss       = require('precss');
var autoprefixer = require('autoprefixer');

module.exports = {
    // or devtool: 'eval' to debug issues with compiled output:
    devtool: 'eval',
    entry: {
        // necessary for hot reloading with IE:
        'eventsource-polyfill': 'eventsource-polyfill',
        // listen to code updates emitted by hot middleware:
        'webpack-hot-middleware/client': 'webpack-hot-middleware/client',
        // your code:
        app: './src/index',
        worker: './src/worker/index'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '/dist/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel'],
                include: path.join(__dirname, 'src')
            },
            {
                test: /\.scss$/,
                loaders: ['style', 'css?sourceMap', 'postcss', 'sass?sourceMap']
            },
            {
                test: /\.css$/,
                loaders: ['style', 'css?sourceMap', 'postcss']
            },
            {
                test: /\.(png|jpg|woff|otf|woff2|eot|ttf|svg)+$/,
                loader: 'url-loader?limit=100000'
            }
        ]
    },
    postcss: function () {
        return [precss, autoprefixer];
    }
};
