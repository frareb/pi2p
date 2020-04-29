"use strict";

const axios = require("axios");
const API_TEMP_URL = "http://pi2p.site/api/b827eb64a017/temperature";

module.exports = {
	up: async (queryInterface) => {
		// fetch datas from the old API
		const oldApiRes = await axios.get(API_TEMP_URL);

		const datas = oldApiRes.data.map(e => ({
			sensorId: 1,
			value: e.value,
			createdAt: new Date(e.createdAt),
			updatedAt: new Date(e.createdAt),
		}));

		return queryInterface.bulkInsert("Datas", datas);
	},
	down: (queryInterface) => {
		return queryInterface.bulkDelete("Datas", null, {});
	},
};
