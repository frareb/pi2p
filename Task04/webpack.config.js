const path = require("path");

const mode = process.env.NODE_ENV ? process.env.NODE_ENV : "development";

const defaultConf = {
	mode,
	module: {
		rules: [{
			test: /node_modules/,
			use: ["ify-loader"],
		}, {
			test: /\.js/,
			exclude: [/node_modules/],
			use: ["babel-loader"],
		}],
	},
};

const makeExportObject = file => Object.assign({}, defaultConf, {
	entry: `./client/${file}.js`,
	output: {
		filename: `${file}.js`,
		path: path.resolve(__dirname, "public/js"),
	},
});

module.exports = [
	"filterSelectBoxAll",
	"filterSelectBoxInstGateCap",
	"filterSelectBoxMult",
	"visNetworkClimate",
].map(makeExportObject);
