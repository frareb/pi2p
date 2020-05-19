"use strict";

module.exports = {
	up: (queryInterface) => {
		return queryInterface.bulkInsert("Institutes", [
			{
				name: "IRD",
				countryCode: "FRA",
				createdAt: new Date("2020-05-18T12:21:47.027Z"),
				updatedAt: new Date("2020-05-18T12:21:47.027Z"),
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
	down: (queryInterface) => {
		return queryInterface.bulkDelete("Institutes", null, {});
	},
};
