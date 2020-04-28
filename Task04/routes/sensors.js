const express = require("express");
const router = express.Router();
const Op = require("sequelize").Op;

const models = require("../models");
const controllers = require("../controllers");

// list all the sensors
router.get("/", controllers.pagination({
	model: models.Sensors,
	find: {
		attributes: ["id", "name", "gatewayId"],
	},
}));

// get a specific sensor
router.get("/:sensorId", controllers.details({
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
router.post("/", controllers.post({
	model: models.Sensors,
	body: {
		gatewayId: "number",
		name: "string",
		unit: "string",
		model: "string",
		description: "string",
	},
}));

// destroy all sensors
router.delete("/", controllers.delete({
	model: models.Sensors,
	delete: "*",
}));

// delete a given sensor
router.delete("/:sensorId", controllers.delete({
	model: models.Sensors,
	delete: "sensorId",
}));

// fetch datas from date to date (specific handler)
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

// add a new data to sensor (specific handler)
router.post("/:sensorId/datas", (req, res) => {
	const sensorId = req.params.sensorId;
	const value = req.body.value;
	let createdAt = req.body.createdAt;

	// never trust user input
	if(typeof value !== "number") {
		return res.status(500).json({ error: {
			message: "Argument types are incorrect",
		}});
	}

	// if timestamp is given, parse it
	if(typeof createdAt === "number") {
		createdAt = new Date(parseInt(createdAt));
	} else {
		createdAt = new Date();
	}

	models.Datas
		.create({
			sensorId,
			value,
			createdAt,
		})
		.then(() => res.status(201).send())
		.catch(error => res.status(500).json({error}));
});

module.exports = router;
