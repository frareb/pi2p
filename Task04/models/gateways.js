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
			foreignKey: "gatewayId",
			as: "sensors",
		});

		Gateways.hasMany(models.ApiKeys, {
			foreignKey: "gatewayId",
			as: "apiKeys",
		});
	};

	return Gateways;
};
