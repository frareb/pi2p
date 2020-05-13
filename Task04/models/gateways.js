"use strict";

module.exports = (sequelize, DataTypes) => {
	const Gateways = sequelize.define("Gateways", {
		instituteId: {
			allowNull: true,
			type: DataTypes.INTEGER,
		},
		name: DataTypes.STRING,
		lat: {
			allowNull: true,
			type: DataTypes.REAL,
		},
		lon: {
			allowNull: true,
			type: DataTypes.REAL,
		},
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
