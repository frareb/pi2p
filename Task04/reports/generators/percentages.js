const models = require("../../models");
const sequelize = models.sequelize;

const i18n = require("../utils/i18n");

const generator = (year, month, gateway) => {
	return sequelize.query(`
		SELECT
			EXTRACT(DAY FROM "Datas"."createdAt") AS "day_of_month",
			COUNT("Datas"."id") AS "data_count",
			COUNT(DISTINCT "Datas"."sensorId") as "sensor_count"
		FROM "Datas"
		LEFT JOIN "Sensors" ON "Datas"."sensorId" = "Sensors"."id"
		WHERE
			EXTRACT(YEAR FROM "Datas"."createdAt") = $1
			AND EXTRACT(MONTH FROM "Datas"."createdAt") = $2
			AND "Sensors"."gatewayId" = $3
		GROUP BY "day_of_month";
	`, {
		bind: [year, month, gateway],
		type: sequelize.QueryTypes.SELECT,
	}).then(data => {
		if(data.length === 0) return [];

		// one data per minute expected
		const dataCountPerSensor = 24 * 60;

		// make the rows using data
		const rows = data.map(v => {
			const { day_of_month } = v;

			const dataCount = parseInt(v.data_count);
			const sensorCount = parseInt(v.sensor_count);
			const ratio =
				dataCount / (dataCountPerSensor * sensorCount);

			return {
				type: "tableRow",
				children: [{
					type: "tableCell",
					children: [{
						type: "text",
						value: day_of_month,
					}],
				}, {
					type: "tableCell",
					children: [{
						type: "text",
						value: String(Math.round(ratio * 100)) + "%",
					}],
				}, {
					type: "tableCell",
					children: [{
						type: "text",
						// eslint-disable-next-line max-len
						value: `${"- ".repeat(String(Math.round(ratio * 10) * 2))}`,
					}],
				}],
			};
		});

		// construct simple MDAST table
		return [{
			type: "table",
			children: [{
				type: "tableRow",
				children: [{
					type: "tableCell",
					children: [{
						type: "strong",
						children: [{type: "text", value: i18n("DAY")}],
					}],
				}, {
					type: "tableCell",
					children: [{
						type: "strong",
						children: [{type: "text", value: i18n("PERCENT")}],
					}],
				}, {
					type: "tableCell",
					children: [{
						type: "strong",
						children: [{type: "text", value: ""}],
					}],
				}],
			}, ...rows],
		}];
	});
};

module.exports = {
	name: i18n("SENSORS_AVAILABILITY_MAIN_TITLE"),
	order: 10,
	generator,
};
