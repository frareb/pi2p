const express = require("express");
const router = express.Router();
const controllers = require("../controllers");
const models = require("../models");
const sequelize = require("sequelize");

const formatDate = controllers.body.formatDate;
const DataType = sequelize.DataTypes;
const Op = sequelize.Op;

require("./factory")({
	model: models.Sensors,
	router,
	details: {
		unifyMultipleLinks: true,
	},
});

// fetch datas from date to date (specific handler)
router.get("/:sensorId/datas", (req, res) => {
	const sensorId = req.params.sensorId;

	return controllers.get({
		model: models.Datas,
		find: { where: { sensorId } },
		pageSize: Number.MAX_SAFE_INTEGER,
		removeModelUrl: true,
	})(req, res);
});

// add a new data to sensor (specific handler)
router.post("/:sensorId/datas", (req, res) => {
	const sensorId = req.params.sensorId;

	return controllers.post({
		model: models.Datas,
		optionalFields: ["createdAt", "updatedAt"],
		inject: { sensorId },
	})(req, res);
});

// delete datas from date to date
router.delete("/:sensorId/datas", (req, res) => {
	const sensorId = req.params.sensorId;
	let { start, end } = req.query;
	const filter = {};

	// filter by creation date
	try {
		start = formatDate(start);
		end = formatDate(end);

		DataType.DATE().validate(start);
		DataType.DATE().validate(end);

		Object.assign(filter, {
			sensorId,
			createdAt: {
				[Op.between]: [start, end],
			},
		});
	// eslint-disable-next-line no-empty
	} catch(e) {
		console.log(e);
	}

	controllers.delete({
		model: models.Datas,
		filter,
		deleteAll: true,
	})(req, res);
});

module.exports = router;
