"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.sequelize.transaction(transaction => {
			return Promise.all([
				queryInterface.addColumn(
					"Sensors",
					"model",
					{ type: Sequelize.DataTypes.STRING },
					{ transaction }),
				queryInterface.addColumn(
					"Sensors",
					"description",
					{ type: Sequelize.DataTypes.TEXT },
					{ transaction },
				),
			]);
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.sequelize.transaction(transaction => {
			return Promise.all([
				queryInterface.removeColumn(
					"Sensors",
					"model",
					{ transaction }),
				queryInterface.removeColumn(
					"Sensors",
					"description",
					{ transaction },
				),
			]);
		});
	},
};
