const express = require("express");
const router = express.Router();
const models = require("../models");

// list all the gateways
router.get("/", (req, res) => {
	// get query strings with defaults
	const {
		limit = 10,
		offset = 0,
	} = req.query;

	models.Gateways
		.findAll({
			attributes: ["id", "name", "instituteId"],
			limit,
			offset,
			// order by last creation date, and ids if date are equal
			order: [
				["createdAt", "DESC"],
				["id", "DESC"],
			],
		})
		.then(inst => res.json(inst))
		.catch(error => res.status(500).json({error}));
});

// get informations about a specific gateway
router.get("/:gatewayId", (req, res) => {
	const id = req.params.gatewayId;

	// filter using primary key (id)
	models.Gateways
		.findByPk(id, { include: "sensors" })
		.then(inst => {
			if(inst !== null) res.json(inst);
			// when "null" is returned, the ressource hasn't been found
			else res.status(404).json({
				error: {
					message:
						`No ressource found in "gateways" matching id ${id}`,
				},
			});
		})
		.catch(error => res.status(500).json({error}));
});

module.exports = router;
