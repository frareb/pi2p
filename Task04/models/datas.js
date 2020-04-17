"use strict";

module.exports = (sequelize, DataTypes) => {
	const Datas = sequelize.define("Datas", {
		sensorId: DataTypes.INTEGER,
		value: DataTypes.REAL,
	}, {});

	Datas.associate = function(models) {
		Datas.belongsTo(models.Sensors, {
			foreignKey: "sensorId",
			as: "sensor",
		});
	};

	return Datas;
};
