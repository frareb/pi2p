"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("Gateways", [
			{
				instituteId: 10,
				name: "Raspberry Pi EGCE 01",
				lat: 48.42341,
				lon: 2.09404,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				instituteId: 10,
				name: "Raspberry Pi EGCE 02",
				lat: null,
				lon: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				instituteId: 12,
				name: "Raspberry Pi Nairobi",
				lat: null,
				lon: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				instituteId: 14,
				name: "Raspberry Pi La Paz Chasquipampa",
				lat: null,
				lon: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				instituteId: 15,
				name: "Raspberry Pi El Alto",
				lat: null,
				lon: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				instituteId: 13,
				name: "Raspberry Pi Khipakhipani",
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
