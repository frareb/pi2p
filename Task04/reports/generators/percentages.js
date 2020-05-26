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
		const rowCount = 3;
		// one data per minute
		const dataCountPerSensor = 24 * 60;

		// one row out of two is for days, the other for percentages
		const rows = [...new Array(2 * rowCount)].map((_, i) => ({
			type: "tableRow",
			children: [{
				type: "tableCell",
				children: [{
					type: "text",
					value: i % 2 === 0 ? i18n("DAY") : i18n("PERCENT"),
				}],
			}],
		}));

		// construct MDAST table structure
		data
			.forEach((d, i, a) => {
				const roundedLength = Math.ceil(a.length / rowCount) * rowCount;
				const currentRow =
					2 * Math.floor((rowCount * i) / roundedLength);

				const dataCount = parseInt(d.data_count);
				const sensorCount = parseInt(d.sensor_count);
				const ratio = dataCount / (dataCountPerSensor * sensorCount);

				rows[currentRow].children.push({
					type: "tableCell",
					children: [{type: "text", value: String(d.day_of_month)}],
				});

				rows[currentRow + 1].children.push({
					type: "tableCell",
					children: [{
						type: "text",
						value: String(Math.round(ratio * 100)) + "%",
					}],
				});
			});

		return [{
			type: "table",
			children: rows,
		}, {
			type: "thematicBreak",
		}];
	});
};

module.exports = {
	name: i18n("SENSORS_AVAILABILITY_MAIN_TITLE"),
	order: 10,
	generator,
};
