"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("Institutes", [
			{
				name: "IRD Paris",
				countryCode: "FRA",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: "Institut Kenyan",
				countryCode: "KEN",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("Institutes", null, {});
	},
};
