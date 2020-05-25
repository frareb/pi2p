const models = require("../../models");
const sequelize = models.sequelize;

const i18n = require("../utils/i18n");

const generator = (month, institute) => {
	return sequelize.query(`
		SELECT
			EXTRACT(DAY FROM "Datas"."createdAt") AS "day_of_month",
			COUNT("Datas"."id") AS "data_count",
			COUNT(DISTINCT "Datas"."sensorId") as "sensor_count"
		FROM "Datas"
		LEFT JOIN "Sensors" ON "Datas"."sensorId" = "Sensors"."id"
		LEFT JOIN "Gateways" ON "Sensors"."gatewayId" = "Gateways"."id"
		LEFT JOIN "Institutes" ON "Gateways"."instituteId" = "Institutes"."id"
		WHERE
			EXTRACT(MONTH FROM "Datas"."createdAt") = $1
			AND "Institutes"."id" = $2
		GROUP BY "day_of_month";
	`, {
		bind: [month, institute],
		type: sequelize.QueryTypes.SELECT,
	}).then(data => {
		const rowCount = 2;

		const dayRows = [...new Array(rowCount)].map(() => ({
			type: "tableRow",
			children: [],
		}));

		const percentRows = [...new Array(rowCount)].map(() => ({
			type: "tableRow",
			children: [],
		}));

		// construct MDAST table structure
		data
			.forEach((d, i, a) => {
				const roundedToCountLength = Math.ceil(a.length / 4) * 4;
				const row = Math.floor((rowCount * i) / roundedToCountLength);

				const percentage = Math.round(parseInt(d.data_count) / (1440 * parseInt(d.sensor_count)) * 100);

				dayRows[row].children.push({
					type: "tableCell",
					children: [{type: "text", value: String(d.day_of_month)}],
				});

				percentRows[row].children.push({
					type: "tableCell",
					children: [{type: "text", value: String(percentage) + "%"}],
				});
			});

		const mixedArray = [...new Array(2 * rowCount)].map((_, i) => {
			const row = Math.floor(i/2);
			if(i % 2) return percentRows[row];
			else return dayRows[row];
		});

		return {
			type: "table",
			children: mixedArray,
		};
	});
};

module.exports = {
	name: i18n("SENSORS_AVAILABILITY_MAIN_TITLE"),
	order: 10,
	generator,
};
