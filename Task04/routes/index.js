const express = require("express");
const router = express.Router();

const reportsController = require("../controllers/reports");

// render a basic home page
router.get("/", function(req, res) {
	res.render("index", {
		title: "PI2P",
		longTitle: "Predicting Insect Pest Phenology",
	});
});

// legal notice rendering
router.get("/legal", function(req, res) {
	res.render("legal", { title: "PI2P" });
});

// to download reports
router.get("/reports/download", function(req, res) {
	const downreports = reportsController();

	res.render("reports/reports", {
		title: "PI2P",
		localeDate: downreports.localeDate,
		reportFilepaths: downreports.reportFilepaths,
	});
});

module.exports = router;
