const express = require("express");
const router = express.Router();

const models = require("../models");
const paginationController = require("../controllers/pagination");
const detailsController = require("../controllers/details");
const postController = require("../controllers/post");

// list all the groups
router.get("/", paginationController({
	model: models.Groups,
	find: {
		attributes: ["id", "name", "description"],
	},
}));

// get informations about a specific group
router.get("/:gid", detailsController({
	param: "gid",
	model: models.Groups,
	include: {
		"keys": models.ApiKeys,
	},
}));

// add a new group
router.post("/", postController({
	model: models.Groups,
	body: {
		name: "string",
		description: "string",
	},
}));

module.exports = router;
