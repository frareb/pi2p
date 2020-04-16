"use strict";

module.exports = (sequelize, DataTypes) => {
	const Gateways = sequelize.define("Gateways", {
		instituteId: DataTypes.INTEGER,
		name: DataTypes.STRING,
		lat: DataTypes.REAL,
		lon: DataTypes.REAL,
	}, {});

	Gateways.associate = function(models) {
		Gateways.belongsTo(models.Institutes, {
			foreignKey: "instituteId",
			as: "institute",
		});

		Gateways.hasMany(models.Sensors, {
			as: "sensors",
		});
	};

	return Gateways;
};
