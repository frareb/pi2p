module.exports = config => (req, res) => {
	const bodyOpts = {};

	for(const [param, expectedType] of Object.entries(config.body)) {
		const type = typeof req.body[param];

		// check parameter type
		if(type !== expectedType) {
			return res.status(500).json({ meta: { error: {
				message: `Argument ${param} is of type ${type} (${expectedType} expected).`,
			}}});
		}

		// insert param into list
		bodyOpts[param] = req.body[param];
	}

	config.model
		.create(bodyOpts)
		.then(() => res.status(201).send())
		.catch(error => res.status(500).json({error}));
};
