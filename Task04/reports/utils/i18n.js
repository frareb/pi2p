/* eslint-disable max-len */
let lang = "";

const STRINGS = {
	"french": {
		"SENSORS_AVAILABILITY_MAIN_TITLE": "Collecte des données du mois par le serveur",
		"SENSORS_MEASUREMENTS_MAIN_TITLE": "Récapitulatif des mesures des capteurs",
		"DAY": "Jour",
		"PERCENT": "Pourcentage",
		"QU_1": "1er Qua.",
		"QU_3": "3ème Qua.",
	},
	"spanish": {
		"SENSORS_AVAILABILITY_MAIN_TITLE": "Recolección de datos del mes en el servidor",
		"SENSORS_MEASUREMENTS_MAIN_TITLE": "Recapitulación de las medidas de los sensores",
		"DAY": "Día",
		"PERCENT": "Porcentaje",
		"QU_1": "1e Cua.",
		"QU_3": "3e Cua.",
	},
};

module.exports = stringName => STRINGS[lang][stringName];
module.exports.lang = l => lang = l;
