const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: './src/app.ts',
    output: {
        filename: 'app.js',
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.(json|xml|png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
           }
           ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: path.join(__dirname, 'assets'),
            to: 'assets'
        }]),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ]
};