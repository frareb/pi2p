module.exports = config => (req, res) => {
	const bodyOpts = {};

	for(let [param, expectedTypes] of Object.entries(config.body)) {
		const type = typeof req.body[param];

		// handle single type
		if(typeof expectedTypes === "string") {
			expectedTypes = [expectedTypes];
		}
		
		const check = expectedTypes.reduce((acc, val) => {
			// special case: null is "object" type
			if(val === "null" && req.body[param] === null) return true;
			if(type === val) return true;

			return acc;
		}, false);

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

			// send internal server error (TODO: check codes)
			return res.status(500).json({ meta: { error: {
				message: `Argument ${param} is of type ${type} (${fmtTypes} expected).`,
			}}});
		}

		// insert param into list
		bodyOpts[param] = req.body[param];
	}

	if(config.formatOnly) return bodyOpts;

	config.model
		.create(bodyOpts)
		.then(() => res.status(201).send())
		.catch(error => res.status(500).json({error}));
};
