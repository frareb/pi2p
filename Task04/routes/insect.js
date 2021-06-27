const express = require("express");
const router = express.Router();

// demo on insect development
router.get("/intro", function(req, res) {
	res.render("insect/intro", { title: "PI2P" });
});

module.exports = router;
