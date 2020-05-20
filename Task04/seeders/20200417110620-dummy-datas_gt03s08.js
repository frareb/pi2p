"use strict";

const axios = require("axios");
const API_TEMP_URL = "http://pi2p.site/api/b827eb2e8b98/temperature";

module.exports = {
	up: async (queryInterface) => {
		// fetch datas from the old API
		const oldApiRes = await axios.get(API_TEMP_URL);

		const datas = oldApiRes.data.map(e => ({
			sensorId: 8,
			value: e.value,
			createdAt: new Date(e.createdAt - 2*60*60*1000),
			updatedAt: new Date(e.createdAt - 2*60*60*1000),
		}));

		return queryInterface.bulkInsert("Datas", datas);
	},
	down: (queryInterface) => {
		return queryInterface.bulkDelete("Datas", null, {});
	},
};
