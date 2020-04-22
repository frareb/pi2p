const express = require("express");
const router = express.Router();

const models = require("../models");
const paginationController = require("../controllers/pagination");
const detailsController = require("../controllers/details");
const postController = require("../controllers/post");

// list all the gateways
router.get("/", paginationController({
	model: models.Gateways,
	find: {
		attributes: ["id", "name", "instituteId"],
	},
}));

// get informations about a specific gateway
router.get("/:gatewayId", detailsController({
	param: "gatewayId",
	model: models.Gateways,
	include: {
		"sensors": models.Sensors,
		"institute": {
			model: models.Institutes,
			isUnique: true,
		},
	},
}));

// add a new gateway
router.post("/", postController({
	model: models.Gateways,
	body: {
		instituteId: "number",
		name: "string",
		lat: "number",
		lon: "number",
	},
}));

module.exports = router;
