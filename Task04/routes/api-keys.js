const express = require("express");
const router = express.Router();
const cryptoRandomString = require("crypto-random-string");

const models = require("../models");
const controllers = require("../controllers");

// list all the keys
router.get("/", controllers.pagination({
	model: models.ApiKeys,
	find: {
		attributes: ["groupId", "gatewayId", "description"],
	},
}));

// get informations about a specific key
router.get("/:keyId", controllers.details({
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
	let bodyOpts;

	try {
		bodyOpts = controllers.body({
			groupId: "number",
			gatewayId: ["number", "null"],
			description: "string",
		}, req.body);
	} catch(message) {
		// send client-side error
		return res.status(400).json({ meta: { error: { message }}});
	}

	// BE CAREFUL: the RNG must have a STRONG source of randomness!
	Object.assign(bodyOpts, {
		key: cryptoRandomString({length: 64, type: "base64"}),
	});

	models.ApiKeys
		.create(bodyOpts)
		.then(data => res.status(201).json({data}))
		.catch(error => res.status(500).json({error}));
});

// patch is special for keys
// allow only to reset the key
router.patch("/:keyId", async (req, res) => {
	const id = req.params.keyId;
	const newKey = cryptoRandomString({length: 64, type: "base64"});

	await models.ApiKeys.update({ key: newKey }, { where: { id } });

	models.ApiKeys
		.findByPk(id)
		.then(d => res.status(200).send(d))
		.catch(error => res.status(500).json({error}));
});

// destroy all keys
router.delete("/", controllers.delete({
	model: models.ApiKeys,
	delete: "*",
}));

// delete a given key
router.delete("/:keyId", controllers.delete({
	model: models.ApiKeys,
	delete: "keyId",
}));

module.exports = router;
