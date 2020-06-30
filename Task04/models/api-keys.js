"use strict";

module.exports = (sequelize, DataTypes) => {
	const ApiKeys = sequelize.define("ApiKeys", {
		key: DataTypes.STRING(64),
		groupId: DataTypes.INTEGER,
		gatewayId: {
			allowNull: true,
			type: DataTypes.INTEGER,
		},
		description: {
			allowNull: true,
			type: DataTypes.TEXT,
		},
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
