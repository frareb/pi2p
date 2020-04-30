module.exports = (model, body, optionalFields, strict = true) => {
	const bodyOpts = {};

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
			const message = e.toString();
			throw message;
		}
	}

	return bodyOpts;
};
