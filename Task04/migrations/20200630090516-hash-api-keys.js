"use strict";

// BE CAREFUL: THIS MIGRATION DELETES ALL YOUR KEYS

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.sequelize.transaction(transaction => {
			return Promise.all([
				queryInterface.removeColumn(
					"ApiKeys",
					"key",
					{ transaction },
				),
				queryInterface.addColumn("ApiKeys", "key", {
					allowNull: false,
					type: Sequelize.DataTypes.STRING(64),
				}, { transaction }),
			]);
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.sequelize.transaction(transaction => {
			return Promise.all([
				queryInterface.removeColumn(
					"ApiKeys",
					"key",
					{ transaction },
				),
				queryInterface.addColumn("ApiKeys", "key", {
					//allowNull: false,
					type: Sequelize.DataTypes.STRING,
				}, { transaction }),
			]);
		});
	},
};
