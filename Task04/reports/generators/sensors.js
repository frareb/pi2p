const models = require("../../models");
const sequelize = models.sequelize;

const i18n = require("../utils/i18n");

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
		MIN(value),
		quart,
		day_of_month
	FROM quartiles
	GROUP BY quart, day_of_month
	ORDER BY day_of_month;
`, {
	bind: [5, 1],
	type: sequelize.QueryTypes.SELECT,
}).then(res => {
	const data = [];

	res.forEach(e => {
		
	});
});
