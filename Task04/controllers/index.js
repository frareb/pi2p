"use strict";

const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
const db = {};

// give access to all the controllers
fs.readdirSync(__dirname)
	.filter(file => {
		return	(file.indexOf(".") !== 0) &&
				(file !== basename) &&
				(file.slice(-3) === ".js");
	})
	.forEach(file => {
		const module_name = file.split(".")[0];
		const controller = require(path.join(__dirname, file));
		db[module_name] = controller;
	});

module.exports = db;
