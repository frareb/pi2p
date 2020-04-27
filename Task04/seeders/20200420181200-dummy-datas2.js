"use strict";

module.exports = {
	up: (queryInterface) => {
		// generate random temperature values around 19 °C
		// one value per 5 minutes
		const meanTemp = 19;
		const varTemp = 1;
		// 5 minutes
		const period = 5 * 60 * 1000;
		// 30 days
		const totalTime = 30 * 24 * 60 * 60 * 1000;
		const valCount = totalTime / period;
		const baseDate = Date.now();

		// generate A LOT of objects
		const datas = Array.from({ length: valCount }, (v, k) => ({
			sensorId: 17,
			value: meanTemp + (varTemp * 2 * Math.random() - varTemp),
			createdAt: new Date(baseDate - period * (valCount - k)),
			updatedAt: new Date(baseDate - period * (valCount - k)),
		}));

		return queryInterface.bulkInsert("Datas", datas);
	},
	down: (queryInterface) => {
		return queryInterface.bulkDelete("Datas", null, {});
	},
};
