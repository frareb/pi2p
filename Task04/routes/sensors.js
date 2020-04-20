const express = require("express");
const router = express.Router();
const models = require("../models");
const Op = require("sequelize").Op;

// get all the sensors
router.get("/", (req, res) => {
	// get query strings with defaults
	const {
		limit = 10,
		offset = 0,
	} = req.query;

	models.Sensors
		.findAll({
			attributes: ["id", "name", "gatewayId"],
			limit,
			offset,
			// order by last creation date, and ids if date are equal
			order: [
				["createdAt", "DESC"],
				["id", "DESC"],
			],
		})
		.then(sensors => res.json(sensors))
		.catch(error => res.status(500).json({error}));
});

// get information on a specific sensor
router.get("/:sensorId", (req, res) => {
	const id = req.params.sensorId;

	// filter using primary key (id)
	models.Sensors
		.findByPk(id, { include: [
			// add informations on local datas
			{
				model: models.Datas,
				as: "datas",
				limit: 5,
				// return the latest datas
				order: [
					["createdAt", "DESC"],
				],
			},
			// add informations on parent gateway
			{
				model: models.Gateways,
				as: "gateway",
				attributes: ["id", "name"],
			},
		]})
		.then(sensor => {
			if(sensor !== null) res.json(sensor);
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

// add a new sensor
router.post("/", (req, res) => {
	const {
		gatewayId,
		name,
		unit,
		model,
		description,
	} = req.body;

	// never trust user input
	if(	typeof gatewayId !== "number" ||
		typeof name !== "string" ||
		typeof unit !== "string" ||
		typeof model !== "string" ||
		typeof description !== "string") {
		return res.status(500).json({ error: {
			message: "Argument types are incorrect",
		}});
	}

	models.Sensors
		.create({
			gatewayId,
			name,
			unit,
			model,
			description,
		})
		.then(() => res.status(201).send())
		.catch(error => res.status(500).json({error}));
});

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
