const express = require("express");
const router = express.Router();
const model = require("../models").ApiKeys;
const cryptoRandomString = require("crypto-random-string");

const injector = () => cryptoRandomString({length: 64, type: "base64"});

require("./factory")({
	model,
	router,
	post: {
		key: injector,
	},
	patch: {
		key: injector,
	},
});

module.exports = router;
