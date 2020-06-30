"use strict";

const crypto = require("crypto");
const cryptoRandomString = require("crypto-random-string");

const createKey = raw => crypto
	.createHash("sha256")
	.update(raw)
	.digest("base64");

module.exports = {
	up: (queryInterface) => {
		return queryInterface.bulkInsert("ApiKeys", [
			{
				// without this key, no one can access the others
				// please choose it secured in the first place
				key: createKey("firstUniqueId"),
				groupId: 1,
				gatewayId: null,
				description: "Main administrator",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				key: createKey("firstGatewayKey"),
				groupId: 2,
				gatewayId: 1,
				description: "Accès pour la gateway 1",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				key: "githubUniqueKey",
				groupId: 3,
				gatewayId: null,
				description: "Accès pour la gateway 1",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				key: createKey(
					cryptoRandomString({length: 64, type: "base64"})),
				groupId: 2,
				gatewayId: 3,
				description: "Accès pour la gateway 3",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},
	down: (queryInterface) => {
		return queryInterface.bulkDelete("ApiKeys", null, {});
	},
};
