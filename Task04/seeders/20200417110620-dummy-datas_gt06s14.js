"use strict";

const axios = require("axios");
const API_TEMP_URL = "http://pi2p.site/api/b827eb4c2f08/temperature";

module.exports = {
	up: async (queryInterface) => {
		// fetch datas from the old API
		const oldApiRes = await axios.get(API_TEMP_URL);

		const datas = oldApiRes.data.map(e => ({
			sensorId: 14,
			value: e.value,
			createdAt: new Date(e.createdAt + 4*60*60*1000),
			updatedAt: new Date(e.createdAt + 4*60*60*1000),
		}));

		return queryInterface.bulkInsert("Datas", datas);
	},
	down: (queryInterface) => {
		return queryInterface.bulkDelete("Datas", null, {});
	},
};
