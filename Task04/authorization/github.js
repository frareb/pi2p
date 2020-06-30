const crypto = require("crypto");
const models = require("../models");

module.exports = async (body, groupName) => {
	// Select the latest updated key (assumed valid)
	const result = await models.Groups.findOne({
		where: {
			name: groupName,
		},
		include: [{
			model: models.ApiKeys,
			as: "apiKeys",
			attributes: ["key"],
			order: [
				["updatedAt", "DESC"],
			],
			limit: 1,
		}],
	});

	const authKey = result.dataValues.apiKeys[0].dataValues.key;
	const hmac = crypto.createHmac("sha1", authKey);

	return Buffer.from("sha1=" + hmac.update(body).digest("hex"), "utf8");
};
