"use strict";

module.exports = (sequelize, DataTypes) => {
	const ApiKeys = sequelize.define("ApiKeys", {
		key: DataTypes.STRING,
		groupId: DataTypes.INTEGER,
		gatewayId: DataTypes.INTEGER,
		description: DataTypes.TEXT,
	}, {});

	ApiKeys.associate = function(models) {
		ApiKeys.belongsTo(models.Groups, {
			foreignKey: "groupId",
			as: "group",
		});

		ApiKeys.belongsTo(models.Gateways, {
			foreignKey: "gatewayId",
			as: "gateway",
		});
	};

	return ApiKeys;
};
