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
		.then(gateway => res.json(gateway))
		.catch(error => res.status(500).json({error}));
});

// get informations about a specific gateway
router.get("/:gatewayId", (req, res) => {
	const id = req.params.gatewayId;

	// filter using primary key (id)
	models.Gateways
		.findByPk(id, { include: [
			// add informations on local sensors
			{
				model: models.Sensors,
				as: "sensors",
				attributes: ["id", "name"],
			},
			// add informations on parent institute
			{
				model: models.Institutes,
				as: "institute",
				attributes: ["id", "name"],
			},
		]})
		.then(gateway => {
			if(gateway !== null) res.json(gateway);
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

// add a new gateway
router.post("/", (req, res) => {
	const {
		instituteId,
		name,
		lat,
		lon,
	} = req.body;

	// never trust user input
	if(	typeof instituteId !== "number" ||
		typeof name !== "string" ||
		typeof lat !== "number" ||
		typeof lon !== "number") {
		return res.status(500).json({ error: {
			message: "Argument types are incorrect",
		}});
	}

	models.Gateways
		.create({
			instituteId,
			name,
			lat,
			lon,
		})
		.then(() => res.status(201).send())
		.catch(error => res.status(500).json({error}));
});

module.exports = router;
