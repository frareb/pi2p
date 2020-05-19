"use strict";

module.exports = {
	up: (queryInterface) => {
		return queryInterface.bulkInsert("Gateways", [
			{
				instituteId: 1,
				name: "Home",
				lat: 48.42341,
				lon: 2.09404,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				instituteId: 1,
				name: "Lab",
				lat: null,
				lon: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				instituteId: 3,
				name: "Nairobi",
				lat: null,
				lon: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				instituteId: 5,
				name: "La Paz Chasquipampa",
				lat: null,
				lon: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				instituteId: 6,
				name: "El Alto",
				lat: null,
				lon: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				instituteId: 4,
				name: "Khipakhipani",
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
