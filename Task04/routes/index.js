const express = require("express");
const router = express.Router();

// render a basic home page
router.get("/", function(req, res) {
	res.render("index", { title: "PI2P" });
});

module.exports = router;
