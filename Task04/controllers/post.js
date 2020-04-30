const bodyParser = require("./body");

module.exports = config => (req, res) => {
	const exclude = config.optionalFields || [];
	exclude.push("id");

	const injects = {};
	let bodyOpts = {};

	// execute injectors if any
	for(const [field, injector] of Object.entries(config.inject)) {
		if(typeof injector === "function") {
			injects[field] = injector();
		} else {
			injects[field] = injector;
		}
	}

	const body = Object.assign({}, req.body, injects);

	try {
		bodyOpts = bodyParser(config.model, body, exclude);
	} catch(message) {
		// send client-side error
		return res.status(400).json({ meta: { error: { message }}});
	}

	config.model
		.create(bodyOpts)
		.then(d => res.status(201).send(d))
		.catch(error => res.status(500).json({error}));
};
