"use strict";

const FOREIGN_CONSTRAINT_LIST = [
	{
		table: "Gateways",
		references: "Institutes",
		foreign: "instituteId",
	},
	{
		table: "Datas",
		references: "Sensors",
		foreign: "sensorId",
	},
	{
		table: "Sensors",
		references: "Gateways",
		foreign: "gatewayId",
	},
	{
		table: "ApiKeys",
		references: "Groups",
		foreign: "groupId",
	},
	{
		table: "ApiKeys",
		references: "Gateways",
		foreign: "gatewayId",
	},
];

// e.g. Sensors_gatewayId_fkey
const constraintNameFmt = c => `${c.table}_${c.foreign}_fkey`;

module.exports = {
	up: (queryInterface) => {
		return queryInterface.sequelize.transaction(transaction => {
			// delete the old keys
			const promises = FOREIGN_CONSTRAINT_LIST.map(c => {
				return queryInterface.removeConstraint(
					c.table,
					constraintNameFmt(c),
					{ transaction },
				);
			});

			// add new references with ON DELETE CASCADE
			promises.push(...FOREIGN_CONSTRAINT_LIST.map(c => {
				return queryInterface.addConstraint(c.table, [c.foreign], {
					type: "FOREIGN KEY",
					name: constraintNameFmt(c),
					references: {
						table: c.references,
						field: "id",
					},
					onDelete: "CASCADE",
					transaction,
				});
			}));

			console.log(
				`Converting ${FOREIGN_CONSTRAINT_LIST.length} foreign keys...`);

			return Promise.all(promises);
		});
	},
	down: (queryInterface) => {
		// basically the same as `up`, but without ON DELETE CASCADE
		return queryInterface.sequelize.transaction(transaction => {
			const promises = FOREIGN_CONSTRAINT_LIST.map(c => {
				return queryInterface.removeConstraint(
					c.table,
					constraintNameFmt(c),
					{ transaction },
				);
			});

			promises.push(...FOREIGN_CONSTRAINT_LIST.map(c => {
				return queryInterface.addConstraint(c.table, [c.foreign], {
					type: "FOREIGN KEY",
					name: constraintNameFmt(c),
					references: {
						table: c.references,
						field: "id",
					},
					transaction,
				});
			}));

			console.log(
				`Converting ${FOREIGN_CONSTRAINT_LIST.length} foreign keys...`);

			return Promise.all(promises);
		});
	},
};
