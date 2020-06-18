const express = require("express");
const router = express.Router();

const d = new Date();
d.setMonth(d.getMonth()-1);
const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
const myMonth = `${mo}-${ye}`;

const fileFolder = './public/files/';
const fs = require('fs');
// const myFiles = [];
// fs.readdirSync(fileFolder).forEach(file => {
// 	let inst = file.split('_')[1];
// 	let lang = file.split('_')[2].split(".")[0];
// 	let ext = file.split('_')[2].split(".")[1];
// 	let push = (lang == "french" && ext == "tex") ? myFiles.push(inst) : false;
// });

const myFiles = [];
fs.readdirSync(fileFolder).forEach(file => {
	let inst = file.split('_')[1];
	let lang = file.split('_')[2].split(".")[0];
	let ext = file.split('_')[2].split(".")[1];
	if (lang == "english" && ext == "pdf") {
		myFiles.push({name:inst, tex:[], pdf:[]});
	}
	if(ext == "tex"){
		myFiles[myFiles.length - 1].tex.push(file);
	}else{
		if(ext == "pdf"){
			myFiles[myFiles.length - 1].pdf.push(file);
		}
	}
});
// console.log(myFiles);

// page to download reports
router.get("/reports/main", function(req, res) {
	res.render("reports/reports", {
		title: "PI2P",
		myMonth: myMonth,
		myFiles: myFiles,
	});
});

module.exports = router;
