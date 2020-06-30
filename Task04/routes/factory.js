const controllers = require("../controllers");
const models = require("../models");

module.exports = config => {
	const {
		model,
		router,
		paginationExclude = [],
		optionalFields = [],
		disallowMethods = [],
	} = config;
	// force excluded fields on pagination
	paginationExclude.push(...["createdAt", "updatedAt"]);

	// gather and filter out model attributes
	const attributes = Object.keys(model.rawAttributes)
		.filter(a => !paginationExclude.includes(a));

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

	if(!disallowMethods.includes("GET")) {
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
			unifyMultipleLinks:
				config.details && config.details.unifyMultipleLinks,
		}));
	}

	// add a new element
	router.post("/", controllers.post({
		model,
		optionalFields,
		inject: config.post && config.post.injectors,
		postprocessor: config.post && config.post.postprocessor,
	}));

	// update an element
	router.patch("/:modelId", controllers.patch({
		model,
		optionalFields,
		inject: config.patch && config.patch.injectors,
		postprocessor: config.patch && config.patch.postprocessor,
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
