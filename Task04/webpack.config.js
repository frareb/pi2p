const path = require("path");

const mode = process.env.NODE_ENV ? process.env.NODE_ENV : "development";

const entry = {
	filterSelectBoxInstGateCap: "./client/filterSelectBoxInstGateCap.js",
	filterSelectBoxMult: "./client/filterSelectBoxMult.js",
	comPublicationsTeam: "./client/comPublicationsTeam.js",
	filterSelectBoxAll: "./client/filterSelectBoxAll.js",
	visNetworkClimate: "./client/visNetworkClimate.js",
	homePageAnimation: "./client/homePageAnimation.js",
};

const optimization = {
	splitChunks: {
		chunks: "all",
		automaticNameDelimiter: "~",
		cacheGroups: {
			defaultVendors: {
				test: /[\\/]node_modules[\\/]/,
				priority: 1,
			},
		},
	},
};

const moduleConfig = {
	rules: [{
		test: /node_modules/,
		use: ["ify-loader"],
	}, {
		test: /\.js/,
		exclude: [/node_modules/],
		use: ["babel-loader"],
	}],
};

module.exports = {
	mode,
	entry,
	module: moduleConfig,
	output: {
		filename: "[name].js",
		path: path.resolve(__dirname, "public/js"),
	},
	optimization,
};
