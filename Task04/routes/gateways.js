const express = require("express");
const router = express.Router();

const models = require("../models");
const controllers = require("../controllers");

const bodyTypes = {
	instituteId: "number",
	name: "string",
	lat: "number",
	lon: "number",
};

// list all the gateways
router.get("/", controllers.pagination({
	model: models.Gateways,
	find: {
		attributes: ["id", "name", "instituteId"],
	},
}));

// get informations about a specific gateway
router.get("/:gatewayId", controllers.details({
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
router.post("/", controllers.post({
	model: models.Gateways,
	body: bodyTypes,
}));

// update a gateway
router.patch("/:gatewayId", controllers.patch({
	param: "gatewayId",
	model: models.Gateways,
	body: bodyTypes,
}));

// destroy ALL GATEWAYS
router.delete("/", controllers.delete({
	model: models.Gateways,
	delete: "*",
}));

// delete a given gateway
router.delete("/:gatewayId", controllers.delete({
	model: models.Gateways,
	delete: "gatewayId",
}));

module.exports = router;
