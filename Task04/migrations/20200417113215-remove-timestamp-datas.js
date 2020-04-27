"use strict";

module.exports = {
	up: (queryInterface) => {
		return queryInterface.removeColumn(
			"Datas",
			"timestamp",
		);
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.addColumn("Datas", "timestamp", {
			type: Sequelize.DATE,
		});
	},
};
