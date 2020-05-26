const models = require("../../models");
const sequelize = models.sequelize;

const i18n = require("../utils/i18n");

const generator = (month, sensor) => {
	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

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
				EXTRACT(MONTH FROM "Datas"."createdAt") = $1
				AND "Datas"."sensorId" = $2
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
		bind: [month, sensor],
		type: sequelize.QueryTypes.SELECT,
	}).then(res => {
		const cellConstructor = value => ({
			type: "tableCell",
			children: [{type: "text", value: String(value)}],
		});

		const mdast = {
			type: "table",
			children: [{
				type: "tableRow",
				children: [
					capitalizeFirstLetter(i18n("DAY")),
					"Min.",
					i18n("QU_1"),
					"Med.",
					"Mean",
					i18n("QU_3"),
					"Max.",
				].map(cellConstructor),
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

		return mdast;
	});
};

module.exports = {
	name: i18n("SENSORS_MEASUREMENTS_MAIN_TITLE"),
	order: 20,
	generator,
};
