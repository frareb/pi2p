"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("Sensors", [
			{
				gatewayId: 1,
				name: "Température sol",
				unit: " °C",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				gatewayId: 1,
				name: "Humidité sol",
				unit: " %",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("Sensors", null, {});
	},
};
