const { src, dest, parallel } = require("gulp");
const webpack = require("webpack-stream");
const cleanCss = require("gulp-clean-css");

function css() {
	return src("client/css/*.css")
		.pipe(cleanCss())
		.pipe(dest("public/css"));
}

function js() {
	return src(".")
		.pipe(webpack(require("./webpack.config")))
		.pipe(dest("public/js"));
}

exports.css = css;
exports.webpack = js;

exports.default = parallel(css, js);
