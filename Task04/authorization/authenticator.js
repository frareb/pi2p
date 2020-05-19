const models = require("../models");
const sequelize = models.sequelize;

module.exports = async token => {
	// Forge custom query to get group and sensors at the same time
	const result = await sequelize.query(`
		SELECT 
			"Groups"."name" AS "group",
			"Sensors"."id" AS "sensorId"
		FROM "ApiKeys"
		LEFT JOIN "Groups" ON "ApiKeys"."groupId" = "Groups"."id"
		LEFT JOIN "Sensors" ON "ApiKeys"."gatewayId" = "Sensors"."gatewayId"
		WHERE "ApiKeys"."key" = $1;
	`, {
		bind: [token],
		type: sequelize.QueryTypes.SELECT,
	});

	// Reduce the results as
	// - groups: a list of groups, discarded by authenticator;
	// - group: the group to use;
	// - props: list of authorized url parameters.
	return result.reduce((acc, cur) => {
		const { group, sensorId } = cur;
		if(!acc.groups.includes(group)) {
			acc.group = group;
			acc.groups.push(group);
		}
		if(!acc.props.sensorId.includes(sensorId))
			acc.props.sensorId.push(sensorId);

		return acc;
	}, {groups: [], group: null, props: {sensorId: []}});
};
