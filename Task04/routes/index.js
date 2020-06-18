const express = require("express");
const router = express.Router();

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
const downreports = require("../controllers/downreports");
router.get("/reports/main", function(req, res) {
	res.render("reports/reports", {
		title: "PI2P",
		myMonth: downreports.myDate, //myMonth,
		myFiles: downreports.myFiles, //myFiles,
	});
});

module.exports = router;
