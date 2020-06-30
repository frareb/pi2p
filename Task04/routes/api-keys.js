const crypto = require("crypto");
const express = require("express");
const router = express.Router();
const model = require("../models").ApiKeys;
const cryptoRandomString = require("crypto-random-string");

const createKey = raw => crypto
	.createHash("sha256")
	.update(raw)
	.digest("base64");

const injector = () => {
	const key = cryptoRandomString({length: 64, type: "base64"});
	const hash = createKey(key);

	currentKeys[hash] = key;

	return hash;
};

// Dirty hack to reinject the unhashed key
const postprocessor = content => {
	const remaining = content.dataValues;
	const keyHash = remaining.key;
	remaining.key = currentKeys[keyHash];

	delete currentKeys[keyHash];
	return remaining;
};

const currentKeys = {};

require("./factory")({
	model,
	router,
	post: {
		injectors: {
			key: injector,
		},
		postprocessor,
	},
	patch: {
		injectors: {
			key: injector,
		},
		postprocessor,
	},
	disallowMethods: ["GET"],
});

module.exports = router;
