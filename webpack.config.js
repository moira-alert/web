var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: path.join(__dirname, 'static'),
    entry: {
        app: './app/app.ts',
        common: [
            "jquery",
            "angular",
            "angular-animate",
            "angular-route",
            "angular-cookies",
            "angular-aria",
            "hammerjs",
            "moment",
            "materialize.css",
            'materialize.js',
            'material-design-icons.css',
            'materialize-tabs.js'
        ]
    },
    output: {
        path: path.join(__dirname, '/dist'),
        publicPath: '',
        filename: '[name]-[hash].js',
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(css|less)$/,
                loader: 'style-loader!css-loader',
            },
            { test: /\.less$/, loader: 'less-loader' },
            { test: /\.(woff|eot|ttf|woff2)$/, loader: "file-loader" },
            { test: /\.(png|gif|ico|svg)$/, loader: "url-loader" },
            { test: /\.(html)$/, loader: "html-loader" },
            { test: /\.(json)$/, loader: "json-loader" }
        ],
    },
    resolve: {
        extensions: ['', '.ts', '.js'],
        fallback: path.join(__dirname, 'node_modules'),
        alias: {
            'material-design-icons.css': 'material-design-icons-iconfont/dist/material-design-icons.css',
            'materialize.css': 'materialize-css/dist/css/materialize.css',
            'materialize.js': 'materialize-css/dist/js/materialize.js',
            'materialize-tabs.js': 'materialize-css/js/tabs.js',
            'jQuery': 'jquery'
        }
    },
    resolveLoader: {
        fallback: path.join(__dirname, 'node_modules')
    },
    devtool: "#source-map",
    plugins: [
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            "root.jQuery": "jquery"
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "common",
            filename: "common-[hash].js",
            minChunks: Infinity
        }),
        new HtmlWebpackPlugin({
            template: 'index.html',
            inject: 'head'
        })
    ],
    devServer: {
        proxy: {
            "/api/*": "http://localhost:8081"
        },
    }
};

