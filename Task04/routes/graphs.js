const express = require("express");
const router = express.Router();

// Network of institutes and gateways
router.get("/network", function(req, res) {
	res.render("graphs/network", { title: "PI2P" });
});

// Single-chart rendering
router.get("/single", function(req, res) {
	res.render("graphs/single", { title: "PI2P" });
});

// Multi-charts (for a same institute) rendering
router.get("/multiple", function(req, res) {
	res.render("graphs/multiple", { title: "PI2P" });
});

// Comparison between sites
router.get("/sites", function(req, res) {
	res.render("graphs/sites", { title: "PI2P" });
});

module.exports = router;
