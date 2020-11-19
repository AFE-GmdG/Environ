/**
 * Webpack 5 configuration file
 * ©2020 - Andreas Friedel
 */

"use strict";

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const process = require("process");

const cwd = process.cwd();

const config = {
	name: "Environ",

	target: "es2020",

	context: path.resolve(cwd, "src"),

	entry: {
		app: ["./app.ts"]
	},

	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},

	output: {
		filename: "[name].js",
		path: path.resolve(cwd, "dist"),
		publicPath: "",
		globalObject: "self"
	},

	module: {
		rules: [{
			test: /\tsx?$/,
			exclude: /node_modules/,
			use: [{
				loader: "ts-loader"
			}]
    }, {
      test: /favicon.ico$/,
      exclude: /node_modules/,
      use: [{
        loader: "file-loader",
        options: {
          name: "favicon.ico"
        }
      }]
		}]
	},

	plugins: [
		new HtmlWebpackPlugin({
			baseUrl: "/",
			filename: "index.html",
			template: "index.html",
			inject: "body",
			minify: {
				removeComments: true,
				collapseWhitespace: true
			}
		})
	],

	devServer: {
		historyApiFallback: true,
		public: "http://localhost:8080",
		disableHostCheck: true,
		port: 8080,
		contentBase: path.resolve(cwd, "dist"),
		compress: true,
		headers: {},
		host: "0.0.0.0",
		inline: true,
		hot: false,
		quiet: false,
		stats: {
			colors: true
		}
	}
};

module.exports = (env, argv) => {
	if (argv.name === "development") {
		config.devtool = "source-map";
	} else {
		config.devtool = false;
	}

	return config;
};
