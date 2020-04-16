"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable("Datas", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			sensorId: {
				type: Sequelize.INTEGER,
				references: {
					model: "Sensors",
					key: "id",
				},
			},
			value: {
				type: Sequelize.REAL,
			},
			timestamp: {
				type: Sequelize.DATE,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable("Datas");
	},
};
