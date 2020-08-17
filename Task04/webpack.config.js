const path = require("path");

const mode = process.env.NODE_ENV ? process.env.NODE_ENV : "development";

const entry = {
	filterSelectBoxInstGateCap: "./client/js/filterSelectBoxInstGateCap.js",
	filterSelectBoxMult: "./client/js/filterSelectBoxMult.js",
	comPublicationsTeam: "./client/js/comPublicationsTeam.js",
	filterSelectBoxAll: "./client/js/filterSelectBoxAll.js",
	visNetworkClimate: "./client/js/visNetworkClimate.js",
	homePageAnimation: "./client/js/homePageAnimation.js",
	dashboardClimate: "./client/js/dashboardClimate.js",
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
