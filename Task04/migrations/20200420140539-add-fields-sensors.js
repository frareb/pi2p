"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.sequelize.transaction(transaction => {
			return Promise.all([
				queryInterface.addColumn(
					"Sensors",
					"model",
					{
						allowNull: true,
						type: Sequelize.DataTypes.STRING,
					},
					{ transaction }),
				queryInterface.addColumn(
					"Sensors",
					"description",
					{
						allowNull: true,
						type: Sequelize.DataTypes.TEXT,
					},
					{ transaction },
				),
			]);
		});
	},
	down: (queryInterface) => {
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
