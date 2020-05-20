const express = require("express");
const router = express.Router();

// render a basic home page
router.get("/", function(req, res) {
	res.render("index", {
		title: "PI2P",
		longTitle: "Predicting Insect Pest Phenology",
	});
});

// simple chart rendering
router.get("/vizs1", function(req, res) {
	res.render("simplechart", { title: "PI2P" });
});

// multi-charts rendering
router.get("/vizm1", function(req, res) {
	res.render("multiplechart", { title: "PI2P" });
});

// comparison between sites rendering
router.get("/viza1", function(req, res) {
	res.render("comparechart", { title: "PI2P" });
});

// legal notice rendering
router.get("/ln", function(req, res) {
	res.render("legalNotice", { title: "PI2P" });
});

module.exports = router;
