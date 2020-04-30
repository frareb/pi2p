"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.sequelize.transaction(transaction => {
			return Promise.all([
				queryInterface.addColumn("Sensors", "gatewayId", {
					allowNull: true,
					type: Sequelize.DataTypes.INTEGER,
					references: {
						model: "Gateways",
						key: "id",
					},
				}, { transaction }),
				queryInterface.removeColumn(
					"Sensors",
					"location",
					{ transaction },
				),
			]);
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.sequelize.transaction(transaction => {
			return Promise.all([
				queryInterface.addColumn("Sensors", "location", {
					type: Sequelize.INTEGER,
				}, { transaction }),
				queryInterface.removeColumn(
					"Sensors",
					"gatewayId",
					{ transaction },
				),
			]);
		});
	},
};
