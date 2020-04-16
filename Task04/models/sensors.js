"use strict";

module.exports = (sequelize, DataTypes) => {
	const Sensors = sequelize.define("Sensors", {
		gatewayId: DataTypes.INTEGER,
		name: DataTypes.STRING,
		unit: DataTypes.STRING,
	}, {});

	Sensors.associate = function(models) {
		Sensors.belongsTo(models.Gateways, {
			foreignKey: "gatewayId",
			as: "gateway",
		});

		Sensors.hasMany(models.Datas, {
			as: "datas",
		});
	};

	return Sensors;
};
