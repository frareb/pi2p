const d = new Date();
d.setMonth(d.getMonth()-1);
const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
const localeDate = `${mo}-${ye}`;

const fileFolder = './public/files/';
const fs = require('fs');

const reportFilepaths = [];
fs.readdirSync(fileFolder).forEach(file => {
	let inst = file.split('_')[1];
	let lang = file.split('_')[2].split(".")[0];
	let ext = file.split('_')[2].split(".")[1];
	if (lang == "english" && ext == "pdf") {
		reportFilepaths.push({name:inst, tex:[], pdf:[]});
	}
	if(ext == "tex"){
		reportFilepaths[reportFilepaths.length - 1].tex.push(file);
	}else{
		if(ext == "pdf"){
			reportFilepaths[reportFilepaths.length - 1].pdf.push(file);
		}
	}
});

const downreports = {localeDate: localeDate, reportFilepaths: reportFilepaths}

module.exports = downreports;
