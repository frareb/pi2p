"use strict";

module.exports = {
	up: (queryInterface) => {
		return queryInterface.bulkInsert("Gateways", [
			{
				instituteId: 1,
				name: "Raspberry Pi EGCE 01",
				lat: 48.42341,
				lon: 2.09404,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				instituteId: 1,
				name: "Raspberry Pi EGCE 02",
				lat: null,
				lon: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				instituteId: 3,
				name: "Raspberry Pi Nairobi",
				lat: null,
				lon: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				instituteId: 5,
				name: "Raspberry Pi La Paz Chasquipampa",
				lat: null,
				lon: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				instituteId: 6,
				name: "Raspberry Pi El Alto",
				lat: null,
				lon: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				instituteId: 4,
				name: "Raspberry Pi Khipakhipani",
				lat: null,
				lon: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},
	down: (queryInterface) => {
		return queryInterface.bulkDelete("Gateways", null, {});
	},
};
