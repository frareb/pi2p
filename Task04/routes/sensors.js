const express = require("express");
const router = express.Router();
const models = require("../models");

// get all the sensors
router.get("/", (req, res) => {
	models.Sensors
		.findAll({})
		.then(sensors => res.json(sensors))
		.catch(error => res.json({error}));
});

// add a new sensor
router.post("/", (req, res) => {
	const {
		name,
		location,
		unit,
	} = req.body;

	models.Sensors
		.create({
			name,
			location,
			unit,
		})
		.then(() => res.status(201).send())
		.catch(error => res.status(500).json({error}));
});

module.exports = router;
