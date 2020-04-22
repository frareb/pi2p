const express = require("express");
const router = express.Router();

const models = require("../models");
const paginationController = require("../controllers/pagination");
const detailsController = require("../controllers/details");
const postController = require("../controllers/post");

// list all the institutes
router.get("/", paginationController({
	model: models.Institutes,
	find: {
		attributes: ["id", "name", "countryCode"],
	},
}));

// get informations about a specific institute
router.get("/:instituteId", detailsController({
	param: "instituteId",
	model: models.Institutes,
	include: {
		"gateways": models.Gateways,
	},
}));

// add a new institute
router.post("/", postController({
	model: models.Institutes,
	body: {
		name: "string",
		countryCode: "string",
	},
}));

module.exports = router;
