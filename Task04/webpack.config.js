const path = require("path");

module.exports = {
	entry: "./client/filterSelectBoxMult.js",
	output: {
		filename: "filterSelectBoxMult.js",
		path: path.resolve(__dirname, "public/js"),
	},
};
