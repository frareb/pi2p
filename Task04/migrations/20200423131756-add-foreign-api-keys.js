"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.sequelize.transaction(transaction => {
			return Promise.all([
				queryInterface.addColumn("ApiKeys", "gatewayId", {
					allowNull: true,
					type: Sequelize.DataTypes.INTEGER,
					references: {
						model: "Gateways",
						key: "id",
					},
				}, { transaction }),
				queryInterface.addColumn("ApiKeys", "groupId", {
					allowNull: false,
					type: Sequelize.DataTypes.INTEGER,
					references: {
						model: "Groups",
						key: "id",
					},
				}, { transaction }),
				queryInterface.removeColumn(
					"ApiKeys",
					"gid",
					{ transaction },
				),
			]);
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.sequelize.transaction(transaction => {
			return Promise.all([
				queryInterface.removeColumn(
					"ApiKeys",
					"gatewayId",
					{ transaction },
				),
				queryInterface.removeColumn(
					"ApiKeys",
					"groupId",
					{ transaction },
				),
				queryInterface.addColumn("ApiKeys", "gid", {
					type: Sequelize.DataTypes.INTEGER,
					references: {
						model: "Groups",
						key: "id",
					},
				}, { transaction }),
			]);
		});
	},
};
