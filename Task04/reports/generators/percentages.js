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

		const rowCount = 4;
		const columnCount = Math.ceil(data.length / rowCount);
		// one data per minute
		const dataCountPerSensor = 24 * 60;

		// one row out of two is for days, the other for percentages
		const rows = [...new Array(2 * rowCount)].map((_, i) => ({
			type: "tableRow",
			children: [{
				type: "tableCell",
				children: [{
					type: "strong",
					children: [{
						type: "text",
						value: i % 2 === 0 ? i18n("DAY") : i18n("PERCENT"),
					}],
				}],
			}],
		}));

		for(let c = 0; c < columnCount; c++) {
			for(let r = 0; r < rowCount; r++) {
				const d = data[c + r * columnCount];

				const dayChildren = [];
				const percentChildren = [];

				if(d) {
					dayChildren.push({
						type: "text",
						value: String(d.day_of_month),
					});

					const dataCount = parseInt(d.data_count);
					const sensorCount = parseInt(d.sensor_count);
					const ratio =
						dataCount / (dataCountPerSensor * sensorCount);

					percentChildren.push({
						type: "text",
						value: String(Math.round(ratio * 100)) + "%",
					});
				}

				rows[2 * r].children.push({
					type: "tableCell",
					children: dayChildren,
				});

				rows[2 * r + 1].children.push({
					type: "tableCell",
					children: percentChildren,
				});
			}
		}

		return [{
			type: "table",
			children: rows,
		}];
	});
};

module.exports = {
	name: i18n("SENSORS_AVAILABILITY_MAIN_TITLE"),
	order: 10,
	generator,
};
