const express = require("express");
const router = express.Router();
const controllers = require("../controllers");
const models = require("../models");

require("./factory")({
	model: models.Sensors,
	router,
});

// fetch datas from date to date (specific handler)
router.get("/:sensorId/datas", (req, res) => {
	const sensorId = req.params.sensorId;

	return controllers.get({
		model: models.Datas,
		find: { where: { sensorId } },
		pageSize: Number.MAX_SAFE_INTEGER,
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

module.exports = router;
