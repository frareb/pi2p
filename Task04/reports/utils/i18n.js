/* eslint-disable max-len */
let lang = "";

const STRINGS = {
	"french": {
		"SENSORS_AVAILABILITY_MAIN_TITLE": "Collecte des données du mois par le serveur",
		"DAY": "jour",
		"PERCENT": "pourcentage",
	},
	"spanish": {
		"SENSORS_AVAILABILITY_MAIN_TITLE": "Recolección de datos del mes en el servidor",
		"DAY": "día",
		"PERCENT": "porcentaje",
	},
};

module.exports = stringName => STRINGS[lang][stringName];
module.exports.lang = l => lang = l;
