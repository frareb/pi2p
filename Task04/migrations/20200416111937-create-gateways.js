"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable("Gateways", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			instituteId: {
				type: Sequelize.INTEGER,
				references: {
					model: "Institutes",
					key: "id",
				},
			},
			name: {
				type: Sequelize.STRING,
			},
			lat: {
				type: Sequelize.REAL,
			},
			lon: {
				type: Sequelize.REAL,
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
	down: (queryInterface) => {
		return queryInterface.dropTable("Gateways");
	},
};
