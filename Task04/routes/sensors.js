const express = require("express");
const router = express.Router();
const Op = require("sequelize").Op;

const models = require("../models");
const paginationController = require("../controllers/pagination");
const detailsController = require("../controllers/details");
const postController = require("../controllers/post");

// list all the sensors
router.get("/", paginationController({
	model: models.Sensors,
	find: {
		attributes: ["id", "name", "gatewayId"],
	},
}));

router.get("/:sensorId", detailsController({
	param: "sensorId",
	model: models.Sensors,
	include: {
		"datas": models.Datas,
		"gateway": {
			model: models.Gateways,
			isUnique: true,
		},
	},
}));

// add a new sensor
router.post("/", postController({
	model: models.Sensors,
	body: {
		gatewayId: "number",
		name: "string",
		unit: "string",
		model: "string",
		description: "string",
	},
}));

// fetch datas from date to date
router.get("/:sensorId/datas", (req, res) => {
	// TODO: check user data
	const sensorId = req.params.sensorId;
	const start = new Date(parseInt(req.query.start));
	const end = new Date(parseInt(req.query.end));

	models.Datas
		.findAll({
			where: {
				sensorId,
				createdAt: {
					[Op.between]: [start, end],
				},
			},
		})
		.then(data => res.json(data));
});

// add a new data to sensor
router.post("/:sensorId/datas", (req, res) => {
	const sensorId = req.params.sensorId;
	const value = req.body.value;

	// never trust user input
	if(typeof value !== "number") {
		return res.status(500).json({ error: {
			message: "Argument types are incorrect",
		}});
	}

	models.Datas
		.create({
			sensorId,
			value,
		})
		.then(() => res.status(201).send())
		.catch(error => res.status(500).json({error}));
});

module.exports = router;
