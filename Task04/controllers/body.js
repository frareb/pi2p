module.exports = (config, body, strict = true) => {
	const bodyOpts = {};

	for(let [param, expectedTypes] of Object.entries(config)) {
		const type = typeof body[param];

		// handle single type
		if(typeof expectedTypes === "string") {
			expectedTypes = [expectedTypes];
		}

		const check = expectedTypes.reduce((acc, val) => {
			return	acc ||
					// special case: null is "object" type
					(val === "null" && body[param] === null) ||
					type === val;
		// precheck: undefined is allowed on unstrict mode
		}, !strict && type === "undefined");

		// check parameter type
		if(!check) {
			// construct a comprehensive list of types
			const fmtTypes = expectedTypes.reduce((acc, type, i) => {
				if(i === 0) {
					return `${type}`;
				} else {
					return `${acc} or ${type}`;
				}
			}, "");

			// send error to be catched
			throw new Error(
				`Argument ${param} is of type ${type} (${fmtTypes} expected).`,
			);
		}

		// insert param into list
		bodyOpts[param] = body[param];
	}

	return bodyOpts;
};
