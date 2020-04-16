"use strict";

module.exports = (sequelize, DataTypes) => {
	const Institutes = sequelize.define("Institutes", {
		name: DataTypes.STRING,
		countryCode: DataTypes.STRING(3),
	}, {});

	Institutes.associate = function(models) {
		Institutes.hasMany(models.Gateways, {
			as: "gateways",
		});
	};

	return Institutes;
};
