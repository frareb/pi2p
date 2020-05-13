const express = require("express");
const router = express.Router();
const model = require("../models").Institutes;

require("./factory")({
	model,
	router,
});

module.exports = router;
