"use strict";

module.exports = (sequelize, DataTypes) => {
	const Groups = sequelize.define("Groups", {
		name: DataTypes.STRING,
		description: DataTypes.TEXT,
	}, {});

	Groups.associate = function(models) {
		Groups.hasMany(models.ApiKeys, {
			foreignKey: "gid",
			as: "apiKeys",
		});
	};

	return Groups;
};
