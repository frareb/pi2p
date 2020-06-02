const express = require("express");
const router = express.Router();
const model = require("../models").Institutes;
const report = require("../reports");

require("./factory")({
	model,
	router,
});

router.get("/:instituteId/report", (req, res) => {
	const year = req.query.year || new Date().getYear();
	const month = req.query.month || new Date().getMonth();
	const lang = req.query.lang || "french";

	report({
		lang,
		year,
		month,
		institute: req.params.instituteId,
	}).then(tex => {
		res.header("Content-Type", "application/x-tex");
		return res.status(200).send(tex);
	}).catch(error => res.status(500).json({meta: {error}}));
});

module.exports = router;
