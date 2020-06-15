const express = require("express");
const router = express.Router();

const d = new Date();
d.setMonth(d.getMonth()-1);
const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
const myMonth = `${mo}-${ye}`;

// const testFolder = './files/';
// const fs = require('fs');
// fs.readdirSync(testFolder).forEach(file => {
//   console.log(file);
// });

// page to download reports
router.get("/reports/main", function(req, res) {
	res.render("reports/reports", {
		title: "PI2P",
		myMonth: myMonth,
	});
});

module.exports = router;
