const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const authorization = require("./authorization/plugin");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// decoding utilities
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// authorization middleware
app.use(authorization({
	groups: require("./config/auth.json"),
	default: "guest",
	authenticator: require("./authorization/authenticator"),
}));

// serve static content
app.use(express.static(path.join(__dirname, "public")));

// serve local routes
app.use("/", require("./routes/index"));
app.use("/institutes", require("./routes/institutes"));
app.use("/gateways", require("./routes/gateways"));
app.use("/sensors", require("./routes/sensors"));
app.use("/groups", require("./routes/groups"));
app.use("/keys", require("./routes/api-keys"));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
