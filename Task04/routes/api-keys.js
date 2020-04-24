const express = require("express");
const router = express.Router();
const cryptoRandomString = require("crypto-random-string");

const models = require("../models");
const paginationController = require("../controllers/pagination");
const detailsController = require("../controllers/details");
const postController = require("../controllers/post");

// list all the keys
router.get("/", paginationController({
	model: models.ApiKeys,
	find: {
		attributes: ["groupId", "gatewayId", "description"],
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
		"gateway": {
			model: models.Gateways,
			isUnique: true,
		},
	},
}));

// add a new key (specific handler)
router.post("/", (req, res) => {
	const bodyOpts = postController({
		model: models.ApiKeys,
		body: {
			groupId: "number",
			gatewayId: ["number", "null"],
			description: "string",
		},
		formatOnly: true,
	})(req, res);

	if(bodyOpts && !res._headerSent) {
		// BE CAREFUL: the RNG must have a STRONG source of randomness!
		Object.assign(bodyOpts, {
			key: cryptoRandomString({length: 64, type: "base64"}),
		});

		models.ApiKeys
			.create(bodyOpts)
			.then(data => res.status(201).json({data}))
			.catch(error => res.status(500).json({error}));
	}
});

module.exports = router;
