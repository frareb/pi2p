const express = require("express");
const router = express.Router();
const model = require("../models").Gateways;

require("./factory")({
	model,
	router,
});

module.exports = router;
