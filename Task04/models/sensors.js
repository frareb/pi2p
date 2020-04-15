"use strict";

module.exports = (sequelize, DataTypes) => {
	const Sensors = sequelize.define("Sensors", {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		name: DataTypes.STRING,
		location: DataTypes.INTEGER,
		unit: DataTypes.STRING
	}, {});
	Sensors.associate = function(models) {
		// associations can be defined here
	};
	return Sensors;
};