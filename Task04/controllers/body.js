module.exports = config => {
	const {
		model,
		optionalFields,
		inject = {},
		strict = true,
	} = config;

	// force id as optional field
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
		// id should not be user-defined AT ALL
		if(field === "id") continue;

		if(optionalFields.includes(field)) {
			// simply skip undefined optional parameters
			if(!body[field]) continue;
			// optionalFields are forbidden in unstrict mode
			if(!strict) throw `${field} is not allowed in body`;
		}

		let fieldValue = body[field];

		// discard null or undefined fields:
		// - on unstrict mode or;
		// - when null is explicitely allowed.
		if(	(checker.allowNull === true || !strict) &&
			(fieldValue === null || typeof fieldValue === "undefined")) {
			continue;
		}

		// check body params and insert if valid
		try {
			// special preprocessing for Dates
			if(checker.type.constructor.name === "DATE") {
				// allow both timestamp and date literal
				if(typeof fieldValue === "number" || Number(fieldValue))
					fieldValue = Number(fieldValue);

				fieldValue = new Date(fieldValue);
			}

			if(checker.type.validate(fieldValue)) bodyOpts[field] = fieldValue;
		} catch(e) {
			throw e.toString();
		}
	}

	return bodyOpts;
};
