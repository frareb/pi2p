const express = require("express");
const router = express.Router();

// devRate R package
router.get("/devrate", function(req, res) {
	res.render("about/dataAnalysisDevrate", { title: "PI2P" });
});

// publications
router.get("/publications", function(req, res) {
	res.render("about/comPublicationsTeam", { title: "PI2P" });
});

// bibliography
router.get("/bibliography", function(req, res) {
	res.render("about/comPublicationsBibliography", { title: "PI2P" });
});

module.exports = router;
