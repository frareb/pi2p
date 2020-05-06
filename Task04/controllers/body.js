module.exports = config => {
	const {
		model,
		optionalFields,
		inject = {},
		strict = true,
	} = config;

	// force id as optional fields
	if(!optionalFields.includes("id")) optionalFields.push("id");

	const injects = {};
	const bodyOpts = {};

	// execute injectors if any
	for(const [field, injector] of Object.entries(inject)) {
		if(typeof injector === "function") {
			injects[field] = injector();
		} else {
			injects[field] = injector;
		}
	}

	const body = Object.assign({}, config.body, injects);

	for(const [field, checker] of Object.entries(model.rawAttributes)) {
		// skip excluded params that are not in body
		if(	optionalFields.includes(field) &&
			!body[field]) continue;

		let fieldValue = body[field];

		// discard null or undefined fields:
		// - on unstrict mode or;
		// - when allow is explicitely allowed.
		if(	(checker.allowNull === true || !strict) &&
			(fieldValue === null || typeof fieldValue === "undefined")) {
			continue;
		}

		// check body params and insert if valid
		try {
			// special preprocessing for Dates
			if(checker.type.constructor.name === "DATE") {
				fieldValue = new Date(parseInt(fieldValue));
			}

			if(checker.type.validate(fieldValue)) bodyOpts[field] = fieldValue;
		} catch(e) {
			throw e.toString();
		}
	}

	return bodyOpts;
};
