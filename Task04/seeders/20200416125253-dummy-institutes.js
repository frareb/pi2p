"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("Institutes", [
			{
				name: "IRD",
				countryCode: "FRA",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: "GQE-Le Moulon",
				countryCode: "FRA",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: "ICIPE",
				countryCode: "KEN",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: "PROINPA",
				countryCode: "BOL",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: "IICA",
				countryCode: "BOL",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: "UPEA",
				countryCode: "BOL",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: "UMSA",
				countryCode: "BOL",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("Institutes", null, {});
	},
};
