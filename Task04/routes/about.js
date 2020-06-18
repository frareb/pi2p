const express = require("express");
const router = express.Router();

// devRate R package
router.get("/devrate", function(req, res) {
	res.render("about/da_devrate", { title: "PI2P" });
});

// publications
router.get("/publi", function(req, res) {
	res.render("about/com_publi", { title: "PI2P" });
});

// bibliography
router.get("/biblio", function(req, res) {
	res.render("about/com_biblio", { title: "PI2P" });
});

module.exports = router;
