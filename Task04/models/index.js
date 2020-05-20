/* eslint-disable max-len */
"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;

// gather environment variables and connect
if (config.useEnvVariable) {
	sequelize = new Sequelize(process.env[config.useEnvVariable], config);
} else if(config.useDsn) {
	sequelize = new Sequelize(config.useDsn, config);
} else {
	sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// give access to all the models
fs.readdirSync(__dirname)
	.filter(file => {
		return (file.indexOf(".") !== 0) && (file !== basename) && (file.slice(-3) === ".js");
	})
	.forEach(file => {
		const model = sequelize["import"](path.join(__dirname, file));
		db[model.name] = model;
	});

// associate models with corresponding databases
Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
