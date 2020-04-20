"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("Sensors", [
			{
				gatewayId: 1,
				name: "Température",
				unit: " °C",
				model: "DS1820",
				description: "Proche du sol",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				gatewayId: 1,
				name: "Humidité",
				unit: " %",
				model: "DHT22",
				description: "Proche du sol",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("Sensors", null, {});
	},
};
