"use strict";

const axios = require("axios");
const API_TEMP_URL = "http://pi2p.site/api/temp";

module.exports = {
	up: async (queryInterface) => {
		// fetch datas from the old API
		const oldApiRes = await axios.get(API_TEMP_URL);

		const datas = oldApiRes.data.map(e => ({
			sensorId: 1,
			value: e.sensor,
			createdAt: new Date(e.timestamp),
			updatedAt: new Date(e.timestamp),
		}));

		return queryInterface.bulkInsert("Datas", datas);
	},
	down: (queryInterface) => {
		return queryInterface.bulkDelete("Datas", null, {});
	},
};
