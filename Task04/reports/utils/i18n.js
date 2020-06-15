/* eslint-disable max-len */
let lang = "";

const STRINGS = {
	"french": {
		"REPORT_MAIN_TITLE": "Rapport pour l'institut",
		"SENSORS_AVAILABILITY_MAIN_TITLE": "Collecte des données du mois par le serveur",
		"SENSORS_MEASUREMENTS_MAIN_TITLE": "Récapitulatif des mesures des capteurs",
		"MONTH_OF": "Mois de",
		"DAY": "Jour",
		"PERCENT": "Pourcentage",
		"GENERATED_ON": "Généré le",
		"QU_1": "1er Qua.",
		"QU_3": "3ème Qua.",
	},
	"spanish": {
		"REPORT_MAIN_TITLE": "Informe para el instituto",
		"SENSORS_AVAILABILITY_MAIN_TITLE": "Recolección de datos del mes en el servidor",
		"SENSORS_MEASUREMENTS_MAIN_TITLE": "Recapitulación de las medidas de los sensores",
		"MONTH_OF": "Mes de",
		"DAY": "Día",
		"PERCENT": "Porcentaje",
		"GENERATED_ON": "Creado el",
		"QU_1": "1e Cua.",
		"QU_3": "3e Cua.",
	},
	"english": {
		"REPORT_MAIN_TITLE": "Report for",
		"SENSORS_AVAILABILITY_MAIN_TITLE": "Data collection for the current month",
		"SENSORS_MEASUREMENTS_MAIN_TITLE": "Summary of sensor measurements",
		"MONTH_OF": "",
		"DAY": "Day",
		"PERCENT": "Percent",
		"GENERATED_ON": "Created",
		"QU_1": "1e Qu.",
		"QU_3": "3e Qu.",
	},
};

module.exports = stringName => STRINGS[lang][stringName];
module.exports.lang = l => lang = l;
