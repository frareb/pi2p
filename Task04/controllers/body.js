class BodyParser {
	constructor(model, strict = true) {
		this.model = model;
		this.strictMode = strict;
		this.optionalFields = ["id"];
		this.injectors = {};
	}

	validate(body) {
		const bodyOpts = {};

		// execute injectors if any
		const injects = this.executeInjectors();
		body = Object.assign({}, body, injects);

		const modelAttributes = Object.entries(this.model.rawAttributes);

		for(const [field, checker] of modelAttributes) {
			// id should not be user-defined AT ALL
			if(field === "id") continue;

			if(this.optionalFields.includes(field)) {
				// simply skip undefined optional parameters
				if(!body[field]) continue;
				// optionalFields are forbidden in unstrict mode
				if(!this.strictMode) throw `${field} is not allowed in body`;
			}
	
			let fieldValue = body[field];

			// discard null or undefined fields:
			// - on unstrict mode or;
			// - when null is explicitely allowed.
			if(	(checker.allowNull === true || !this.strictMode) &&
				(fieldValue === null || typeof fieldValue === "undefined")) {
				continue;
			}

			// check body params and insert if valid
			try {
				// special preprocessing for Dates
				if(checker.type.constructor.name === "DATE") {
					fieldValue = BodyParser.formatDate(fieldValue);
				}
	
				if(checker.type.validate(fieldValue))
					bodyOpts[field] = fieldValue;
			} catch(e) {
				throw e.toString();
			}
		}
	
		return bodyOpts;
	}

	// Legacy
	static fromConfig(config) {
		const {
			model,
			optionalFields,
			inject = {},
			strict = true,
		} = config;

		const parser = new BodyParser(model, strict);

		parser.addOptionalFields(optionalFields);
		parser.addInjectors(inject);

		return typeof config.body === "object" ?
			parser.validate(config.body) : parser;
	}

	addOptionalFields(fields) {
		this.optionalFields.push(...fields);
	}

	addInjectors(injectors) {
		Object.assign(this.injectors, injectors);
	}

	setStrictMode(value) {
		this.strictMode = value;
	}

	executeInjectors() {
		const injects = {};

		for(const [field, injector] of Object.entries(this.injectors)) {
			if(typeof injector === "function") {
				injects[field] = injector();
			} else {
				injects[field] = injector;
			}
		}

		return injects;
	}

	static formatDate(dateField) {
		// allow both timestamp and date literal
		if(typeof dateField === "number" || Number(dateField))
			dateField = Number(dateField);

		return new Date(dateField);
	}
}

module.exports = BodyParser;
