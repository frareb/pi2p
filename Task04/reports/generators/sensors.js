const models = require("../../models");
const sequelize = models.sequelize;

const i18n = require("../utils/i18n");

const generateReportForSensor = (year, month, sensor) => {
	return sequelize.query(`
		WITH quartiles AS (
			SELECT
				NTILE(4) OVER(
					PARTITION BY EXTRACT(DAY FROM "createdAt")
					ORDER BY value
				) AS quart,
				EXTRACT(DAY FROM "createdAt") as day_of_month,
				value
			FROM "Datas"
			WHERE
				EXTRACT(YEAR FROM "Datas"."createdAt") = $1
				AND EXTRACT(MONTH FROM "Datas"."createdAt") = $2
				AND "Datas"."sensorId" = $3
		) SELECT
			MAX(value),
			AVG(value),
			MIN(value),
			quart,
			day_of_month
		FROM quartiles
		GROUP BY quart, day_of_month
		ORDER BY day_of_month, quart;
	`, {
		bind: [year, month, sensor.id],
		type: sequelize.QueryTypes.SELECT,
	}).then(res => {
		// no result = no table
		if(res.length === 0) return [];

		const strongCellConstructor = value => ({
			type: "tableCell",
			children: [{
				type: "strong",
				children: [{
					type: "text",
					value: String(value),
				}],
			}],
		});

		const cellConstructor = value => ({
			type: "tableCell",
			children: (value > 0) ?
				[{type: "text", value: String(value)}] :
				[{
					type: "strong",
					children: [{type: "text", value: String(value)}]
				}],
		});

		const mdast = {
			type: "table",
			children: [{
				type: "tableRow",
				children: [
					i18n("DAY"),
					"Min.",
					i18n("QU_1"),
					"Med.",
					"Mean",
					i18n("QU_3"),
					"Max.",
				].map(strongCellConstructor),
			}],
		};

		for(let i = 0; i < res.length; i += 4) {
			mdast.children.push({
				type: "tableRow",
				children: [
					res[i].day_of_month,
					res[i].min,
					res[i].max,
					res[i + 1].max,
					res[i].avg,
					res[i + 2].max,
					res[i + 3].max,
				].map(v => cellConstructor(Math.round(v * 100) / 100)),
			});
		}

		return [
			{
				type: "heading",
				depth: 5,
				children: [{
					type: "text",
					// eslint-disable-next-line max-len
					value: `${sensor.name} - ${sensor.description} (${sensor.model})`,
				}],
			},
			mdast,
		];
	});
};

const generator = (year, month, gateway) => {
	return models.Sensors.findAll({
		where: {
			"gatewayId": gateway,
		},
		include: [{
			model: models.Gateways,
			as: "gateway",
		}],
	}).then(sensors => {
		return Promise.all(
			sensors.map(s =>
				generateReportForSensor(year, month, s.dataValues)),
		);
	});
};

module.exports = {
	name: i18n("SENSORS_MEASUREMENTS_MAIN_TITLE"),
	order: 20,
	generator,
};
