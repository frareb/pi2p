"use strict";

module.exports = (sequelize, DataTypes) => {
	const Institutes = sequelize.define("Institutes", {
		name: DataTypes.STRING,
		countryCode: {
			allowNull: true,
			type: DataTypes.STRING(3),
		},
	}, {});

	Institutes.associate = function(models) {
		Institutes.hasMany(models.Gateways, {
			foreignKey: "instituteId",
			as: "gateways",
		});
	};

	return Institutes;
};
