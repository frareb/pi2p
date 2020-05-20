"use strict";

module.exports = {
	up: (queryInterface) => {
		return queryInterface.bulkInsert("Groups", [
			{
				name: "admin",
				description: "Full access to everything",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: "gateway",
				description: "Only access to it's own sensors",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: "deploy",
				description: "Deploy bot access",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: "guest",
				description: "Only GET access to the datas",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},
	down: (queryInterface) => {
		return queryInterface.bulkDelete("Groups", null, {});
	},
};
