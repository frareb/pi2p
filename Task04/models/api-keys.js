"use strict";

module.exports = (sequelize, DataTypes) => {
	const ApiKeys = sequelize.define("ApiKeys", {
		gid: DataTypes.INTEGER,
		key: DataTypes.STRING,
		description: DataTypes.TEXT,
	}, {});

	ApiKeys.associate = function(models) {
		ApiKeys.belongsTo(models.Groups, {
			foreignKey: "gid",
			as: "group",
		});
	};

	return ApiKeys;
};
