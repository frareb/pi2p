"use strict";

module.exports = (sequelize, DataTypes) => {
	const Sensors = sequelize.define("Sensors", {
		gatewayId: {
			allowNull: true,
			type: DataTypes.INTEGER,
		},
		name: DataTypes.STRING,
		unit: {
			allowNull: true,
			type: DataTypes.STRING,
		},
		model: {
			allowNull: true,
			type: DataTypes.STRING,
		},
		description: {
			allowNull: true,
			type: DataTypes.TEXT,
		},
	}, {});

	Sensors.associate = function(models) {
		Sensors.belongsTo(models.Gateways, {
			foreignKey: "gatewayId",
			as: "gateway",
		});

		Sensors.hasMany(models.Datas, {
			foreignKey: "sensorId",
			as: "datas",
		});
	};

	return Sensors;
};
