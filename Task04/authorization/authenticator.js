const models = require("../models");

module.exports = async token => {
	// first query to find key group
	const data = await models.ApiKeys
		.findOne({
			where: {
				key: token,
			},
			include: [
				{
					model: models.Groups,
					as: "group",
					attributes: ["name"],
				},
			],
		});

	// if no key was found, stay in default group
	if(data === null) {
		return;
	}

	// if no gateway is associated, return group only
	if(data.dataValues.gatewayId === null) {
		return {
			group: data.group.dataValues.name,
		};
	}

	// one more query to find sensors that belong to the gateway
	const sensorId = await models.Sensors
		.findAll({
			where: {
				gatewayId: data.dataValues.gatewayId,
			},
			attributes: ["id"],
		})
		.map(s => s.dataValues.id);

	return {
		group: data.group.dataValues.name,
		props: {sensorId},
	};
};
