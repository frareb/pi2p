const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const authorization = require("./authorization/plugin");

const env = process.env.NODE_ENV || "development";
const app = express();

// CORS: allow requests from all origins for development purposes
if(env === "development") app.use(require("cors")());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// decoding utilities
app.use(logger(env === "development" ? "dev" : "common"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// authorization middleware
app.use(authorization({
	groups: require("./config/auth.json"),
	default: "guest",
	deploy: "deploy",
	authenticator: require("./authorization/authenticator"),
	releaser: require("./authorization/github"),
}));

// serve static content
app.use(express.static(path.join(__dirname, "public")));

// serve local routes
app.use("/documentation", require("./routes/documentation"));
app.use("/institutes", require("./routes/institutes"));
app.use("/gateways", require("./routes/gateways"));
app.use("/sensors", require("./routes/sensors"));
app.use("/deploy", require("./routes/deploy"));
app.use("/groups", require("./routes/groups"));
app.use("/graphs", require("./routes/graphs"));
app.use("/about", require("./routes/about"));
app.use("/", require("./routes/reports"));
app.use("/keys", require("./routes/api-keys"));
app.use("/", require("./routes/index"));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = env === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
