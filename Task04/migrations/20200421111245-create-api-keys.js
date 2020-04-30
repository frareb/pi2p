"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable("ApiKeys", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			gid: {
				type: Sequelize.INTEGER,
				references: {
					model: "Groups",
					key: "id",
				},
			},
			key: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			description: {
				allowNull: true,
				type: Sequelize.TEXT,
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
		return queryInterface.dropTable("ApiKeys");
	},
};
