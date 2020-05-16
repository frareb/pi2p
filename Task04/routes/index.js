const express = require("express");
const router = express.Router();

// render a basic home page
router.get("/", function(req, res) {
	res.render("index", { title: "PI2P", longTitle: "Predicting Insect Pest Phenology" });
});

// testing simplechart rendering
router.get("/vizs1", function(req, res) {
	res.render("simplechart", { title: "PI2P"});
});

router.get("/vizm1", function(req, res) {
	res.render("multiplechart", { title: "PI2P", layout: "layout" });
});

module.exports = router;
