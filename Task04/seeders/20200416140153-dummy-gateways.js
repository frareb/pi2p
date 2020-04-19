"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("Gateways", [
			{
				instituteId: 1,
				name: "Raspberry Pi Moulon",
				lat: 48.42341,
				lon: 2.09404,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				instituteId: 2,
				name: "Raspberry Pi Kenya",
				lat: null,
				lon: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("Gateways", null, {});
	},
};
