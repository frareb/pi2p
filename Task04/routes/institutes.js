const express = require("express");
const router = express.Router();

const models = require("../models");
const controllers = require("../controllers");

const bodyTypes = {
	name: "string",
	countryCode: "string",
};

// list all the institutes
router.get("/", controllers.pagination({
	model: models.Institutes,
	find: {
		attributes: ["id", "name", "countryCode"],
	},
}));

// get informations about a specific institute
router.get("/:instituteId", controllers.details({
	param: "instituteId",
	model: models.Institutes,
	include: {
		"gateways": models.Gateways,
	},
}));

// add a new institute
router.post("/", controllers.post({
	model: models.Institutes,
	body: bodyTypes,
}));

// update a institute
router.patch("/:instituteId", controllers.patch({
	param: "instituteId",
	model: models.Institutes,
	body: bodyTypes,
}));

// destroy all institutes
router.delete("/", controllers.delete({
	model: models.Institutes,
	delete: "*",
}));

// delete a given institute
router.delete("/:instituteId", controllers.delete({
	model: models.Institutes,
	delete: "instituteId",
}));

module.exports = router;
