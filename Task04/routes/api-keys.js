const express = require("express");
const router = express.Router();
const cryptoRandomString = require("crypto-random-string");

const models = require("../models");
const paginationController = require("../controllers/pagination");
const detailsController = require("../controllers/details");

// list all the keys
router.get("/", paginationController({
	model: models.ApiKeys,
	find: {
		attributes: ["gid", "description"],
	},
}));

// get informations about a specific key
router.get("/:keyId", detailsController({
	param: "keyId",
	model: models.ApiKeys,
	include: {
		"group": {
			model: models.Groups,
			isUnique: true,
		},
	},
}));

// add a new key (specific handler)
router.post("/", (req, res) => {
	const {
		gid,
		description,
	} = req.body;

	// never trust user input
	if(	typeof gid !== "number" ||
		typeof description !== "string") {
		return res.status(500).json({ meta: { error: {
			message: "Arguments types are unexpected",
		}}});
	}

	// BE CAREFUL: the RNG must have a STRONG source of randomness!
	const key = cryptoRandomString({length: 64, type: "base64"});

	models.ApiKeys
		.create({
			gid,
			key,
			description,
		})
		.then(data => res.status(201).json({data}))
		.catch(error => res.status(500).json({error}));
});

module.exports = router;
