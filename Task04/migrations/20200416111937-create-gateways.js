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
				allowNull: true,
				type: Sequelize.INTEGER,
				references: {
					model: "Institutes",
					key: "id",
				},
			},
			name: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			lat: {
				allowNull: true,
				type: Sequelize.REAL,
			},
			lon: {
				allowNull: true,
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
