const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

process.env.NODE_ENV = 'development';
module.exports = {
    entry: './src/index.js',
    mode: "development",
    output: {
        filename: 'dist/[name].js',
        path: path.resolve(__dirname, 'public')
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },

            {
                test: /\.scss$|\.css$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        //publicPath: '../'
                    }
                },
                    { loader: 'css-loader' },
                    "sass-loader",
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[ext]?[hash]',
                    publicPath: '/'
                }
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    'file-loader?name=images/[name].[ext]',
                    'image-webpack-loader?bypassOnDebug'
                ]
            },
        ]
    },
    resolve: {
        extensions: [ '.js', '.css', '.scss', 'jsx'],

    },

    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: false,
                uglifyOptions: {
                    mangle: true,
                },
            }),
            new OptimizeCSSAssetsPlugin({})
        ],
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    chunks: "initial",
                },
            }
        }
    },

    plugins:[
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new CopyWebpackPlugin([{ from: 'node_modules/@fortawesome/fontawesome-free/scss/**/*', to: 'fonts/', flatten: true }]),
        new CopyWebpackPlugin([{ from: 'node_modules/@fortawesome/fontawesome-free/webfonts/**/*', to: 'webfonts/', flatten: true }]),
        new MiniCssExtractPlugin({
            filename: 'dist/[name].css',
            chunkFilename: 'dist/[id].css',
        }),
        new HtmlWebpackPlugin({
            hash: true,
            template : __dirname + '/src/index.html',
            filename: './index.html',
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true,
        })
    ]
};