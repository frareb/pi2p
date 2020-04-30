const controllers = require("../controllers");
const models = require("../models");

module.exports = config => {
	const {
		model,
		router,
		// TODO: list of attributes to be excluded from the pagination
		exclude = [],
	} = config;
	// gather and filter out model attributes
	const attributes = Object.keys(model.rawAttributes);
	const reducedAttributes =
		attributes.filter(e => !exclude.includes(e));

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

	// list every element of the model
	router.get("/", controllers.get({
		model,
		find: {
			attributes: reducedAttributes,
		},
	}));

	// get informations about a model's element
	router.get("/:modelId", controllers.details({
		// TODO: this is now fixed, no need to allow customization
		param: "modelId",
		model,
		include,
	}));

	// add a new element
	router.post("/", controllers.post({
		model,
		optionalFields: ["id", "createdAt", "updatedAt"],
		inject: config.post,
	}));

	// update an element
	router.patch("/:modelId", controllers.patch({
		param: "modelId",
		model,
		optionalFields: ["id", "createdAt", "updatedAt"],
		inject: config.patch,
	}));

	// destroy EVERYTHING in the collection
	router.delete("/", controllers.delete({
		model,
		delete: "*",
	}));

	// delete a given member of collection
	router.delete("/:modelId", controllers.delete({
		model,
		// TODO: should be param, like the others, not "delete"
		delete: "modelId",
	}));
};
