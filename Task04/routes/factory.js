const controllers = require("../controllers");
const models = require("../models");

module.exports = config => {
	const {
		model,
		router,
		optionalFields = [],
	} = config;
	// gather and filter out model attributes
	const attributes = Object.keys(model.rawAttributes);

	// get models depending on the current model
	const include = Object.keys(config.model.prototype)
		.filter(e => e.startsWith("get"))
		// construct a comprehensive list for getters
		.reduce((acc, val) => {
			const modelName = val.substring(3);
			const pluralModelName =
				modelName.endsWith("s") ? modelName : modelName + "s";
			const sentenceCaseName =
				modelName[0].toLowerCase() + modelName.substring(1);

			acc[sentenceCaseName] = {
				model: models[pluralModelName],
				isUnique: modelName !== pluralModelName,
			};

			return acc;
		}, {});

	// indicate which fields are optional for POST and PATCH
	optionalFields.push(...["id", "createdAt", "updatedAt"]);

	// list every element of the model
	router.get("/", controllers.get({
		model,
		find: {
			attributes,
		},
	}));

	// get informations about a model's element
	router.get("/:modelId", controllers.details({
		model,
		include,
	}));

	// add a new element
	router.post("/", controllers.post({
		model,
		optionalFields,
		inject: config.post,
	}));

	// update an element
	router.patch("/:modelId", controllers.patch({
		model,
		optionalFields,
		inject: config.patch,
	}));

	// destroy EVERYTHING in the collection
	router.delete("/", controllers.delete({
		model,
		deleteAll: true,
	}));

	// delete a given member of collection
	router.delete("/:modelId", controllers.delete({
		model,
	}));
};