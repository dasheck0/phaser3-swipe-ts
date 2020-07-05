var path = require("path");
var pathToPhaser = path.join(__dirname, "/node_modules/phaser/");
var phaser = path.join(pathToPhaser, "dist/phaser.js");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: "./src/index.ts",
    node: {
        fs: 'empty'
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: "ts-loader", exclude: "/node_modules/" },
            //{ test: /phaser\.js$/, loader: "expose-loader?Phaser" }
        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                dependencies: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    chunks: 'all',
                    name: 'depedencies'
                }
            }
        }
    },
    devServer: {
        contentBase: path.resolve(__dirname, "./dist"),
        //publicPath: "/dist/",
        host: "127.0.0.1",
        port: 10010,
        open: true
    },
    resolve: {
        extensions: [".ts", ".js"],
        // alias: {
        //    phaser: phaser
        //}
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [{
                from: path.join(process.cwd(), 'src', 'assets'),
                to: './assets'
            },
            {
                from: path.join(process.cwd(), 'src', 'index.html'),
                to: './index.html'
            }]
        })
    ]
};