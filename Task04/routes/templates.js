const express = require("express");
const router = express.Router();

// render a basic home page
router.get("/", function(req, res) {
	res.render("index", {
		title: "PI2P",
		longTitle: "Predicting Insect Pest Phenology",
	});
});

// ----------------------------------------------------------------------------
// charts
// ----------------------------------------------------------------------------

// About climate and charts
router.get("/viz/network", function(req, res) {
	res.render("vizabout", { title: "PI2P" });
});

// simple chart rendering
router.get("/viz/sensor", function(req, res) {
	res.render("vizs1", { title: "PI2P" });
});

// multi-charts rendering
router.get("/viz/sensormult", function(req, res) {
	res.render("vizm1", { title: "PI2P" });
});

// comparison between sites rendering
router.get("/viz/sensorcomp", function(req, res) {
	res.render("viza1", { title: "PI2P" });
});

// ----------------------------------------------------------------------------
// Legal notice
// ----------------------------------------------------------------------------

// legal notice rendering
router.get("/ln", function(req, res) {
	res.render("legalNotice", { title: "PI2P" });
});

module.exports = router;
