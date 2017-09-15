const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

module.exports = {
    context: path.resolve(__dirname, './src'),
    entry: {
        app: ['./main.js'],
        vendor: ['vue', 'vuetify', 'vue-router']
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'app.js'
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/, use: 'vue-loader'
            },
            {
              test: /\.styl$/,
              use: ExtractTextPlugin.extract({use:[ 'css-loader', 'stylus-loader'],
              fallback: 'style-loader'})
            },
            {// regular css files
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: 'css-loader'})
            },
            {
                test: /\.(png|jpg|gif|ttf|eot|svg|json)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: "file-loader?name=[path][name].[ext]"
            }
        ]
    },
    plugins: [

        new ExtractTextPlugin({// define where to save the file
            filename: '[name].bundle.css',
            allChunks: true
        }),
        new HtmlwebpackPlugin({
            title: 'Intro to webpack',
            template: 'index.html'
        }),
        new CommonsChunkPlugin({
            name: "vendor",
            filename: "js/vendor.bundle.js"
        })
    ],
    devServer: {
      contentBase: path.join(__dirname, "dist"),
      compress: true
  }

};

