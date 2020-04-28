const express = require("express");
const router = express.Router();

const models = require("../models");
const controllers = require("../controllers");

const bodyTypes = {
	name: "string",
	description: "string",
};

// list all the groups
router.get("/", controllers.pagination({
	model: models.Groups,
	find: {
		attributes: ["id", "name", "description"],
	},
}));

// get informations about a specific group
router.get("/:gid", controllers.details({
	param: "gid",
	model: models.Groups,
	include: {
		"keys": models.ApiKeys,
	},
}));

// add a new group
router.post("/", controllers.post({
	model: models.Groups,
	body: bodyTypes,
}));

// update a key
router.patch("/:keyId", controllers.patch({
	param: "keyId",
	model: models.Keys,
	body: bodyTypes,
}));

// destroy all groups
router.delete("/", controllers.delete({
	model: models.Groups,
	delete: "*",
}));

// delete a given group
router.delete("/:groupId", controllers.delete({
	model: models.Groups,
	delete: "groupId",
}));

module.exports = router;
