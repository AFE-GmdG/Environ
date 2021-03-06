/**
 * Webpack 4 configuration file (Terser Version)
 * see https://webpack.js.org/configuration/
 * see https://webpack.js.org/configuration/dev-server/
 * ©2019 - Andreas Friedel
 */

"use strict";

const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const process = require("process");

const cwd = process.cwd();

const config = {
	name: "WebGL2",

	target: "web",

	context: path.resolve(cwd, "src"),

	entry: {
		app: ["./app.ts"]
	},

	resolve: {
		extensions: [".tsx", ".ts", ".js"]
	},

	output: {
		filename: "[name].js",
		path: path.resolve(cwd, "dist"),
		publicPath: "",
		globalObject: "self"
	},

	module: {
		rules: [{
			test: /\.tsx?$/,
			exclude: /node_modules/,
			use: [{
				loader: "ts-loader"
			}]
    }, {
			test: /\.[fv]s$/,
			exclude: /node_modules/,
			use: [{
				loader: "../lib/string-loader"
			}]
    }, {
      test: /\.(png|jpe?g|gif)$/,
      exclude: /node_modules/,
      use: [{
				loader: "file-loader",
				options: {
					name: "[path][name].[ext]"
				}
			}]
    }, {
      test: /favicon\.ico$/,
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
		new CopyWebpackPlugin({
			patterns: [{
				from: path.resolve(cwd, "src/assets"),
				to: path.resolve(cwd, "dist/assets"),
				globOptions: {
					ignore: ["**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.gif"]
				}
			}]
		}),
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
	]
};

module.exports = (env, argv) => {
	if (env === "development" || (argv && argv.name === "development")) {
		return {
			...config,

			devtool: "source-map",

			optimization: {
				noEmitOnErrors: true,
				namedModules: true,
				namedChunks: true,
				minimize: false,
				runtimeChunk: "single",
				splitChunks: {
					chunks: "all",
					maxInitialRequests: Infinity,
					minSize: 0,
					cacheGroups: {
						named: {
							test: /[\\/]node_modules[\\/]/,
							name(module) {
								return "vendor";
							}
						}
					}
				}
			},

			plugins: [
				...config.plugins,

				new webpack.DefinePlugin({
					"process.env": {
						NODE_ENV: "'development'",
						VERSION: JSON.stringify(require("./package.json").version)
					}
				})
			],

			devServer: {
				writeToDisk: true,
				historyApiFallback: true,
				public: "http://localhost:8081",
				disableHostCheck: true,
				port: 8081,
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

	}

	return {
		...config,

		devtool: false,

		optimization: {
			noEmitOnErrors: true,
			namedModules: false,
			namedChunks: false,
			minimize: true,
			runtimeChunk: "single",
			splitChunks: {
				chunks: "all",
				maxInitialRequests: Infinity,
				minSize: 0,
				cacheGroups: {
					named: {
						test: /[\\/]node_modules[\\/]/,
						name(module) {
							return "vendor";
						}
					}
				}
			}
		},

		plugins: [
			...config.plugins,

			new webpack.DefinePlugin({
				"process.env": {
					NODE_ENV: "'production'",
					VERSION: JSON.stringify(require("./package.json").version)
				}
			})		]

	};

};
