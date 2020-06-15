const express = require("express");
const router = express.Router();

// devRate R package
router.get("/devrate", function(req, res) {
	res.render("about/da_devrate", { title: "PI2P" });
});

module.exports = router;
