const express = require("express");
const router = express.Router();
const models = require("../models");

// list all the institutes
router.get("/", (req, res) => {
	// get query strings with defaults
	const {
		limit = 10,
		offset = 0,
	} = req.query;

	models.Institutes
		.findAll({
			attributes: ["id", "name"],
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

// get informations about a specific institute
router.get("/:instituteId", (req, res) => {
	const id = req.params.instituteId;

	// filter using primary key (id)
	models.Institutes
		// TODO: check if this is better over `/gateways?institute=1`
		.findByPk(id, { include: [{
			model: models.Gateways,
			as: "gateways",
			attributes: ["id", "name"],
		}]})
		.then(inst => {
			if(inst !== null) res.json(inst);
			// when "null" is returned, the ressource hasn't been found
			else res.status(404).json({
				error: {
					message:
						`No ressource found in "institutes" matching id ${id}`,
				},
			});
		})
		.catch(error => res.status(500).json({error}));
});

// add a new institute
router.post("/", (req, res) => {
	const {
		name,
		countryCode,
	} = req.body;

	// never trust user input
	if(	typeof name !== "string" ||
		typeof countryCode !== "string") {
		return res.status(500).json({ error: {
			message: "Argument types are incorrect",
		}});
	}

	models.Institutes
		.create({
			name,
			countryCode,
		})
		.then(() => res.status(201).send())
		.catch(error => res.status(500).json({error}));
});

module.exports = router;
