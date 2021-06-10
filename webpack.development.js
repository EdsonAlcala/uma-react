const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
    entry: './demo/App.tsx',
    output: {

    },
    devServer: {
        contentBase: './dist',
        port: 4000
    },
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Development',
            template: "./public/index.html",
            filename: "./index.html"
        }),
    ]
});
