"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
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
