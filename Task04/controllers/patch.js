const bodyParser = require("./body");

module.exports = config => async (req, res) => {
	const exclude = config.optionalFields || [];
	exclude.push("id");

	const id = req.params[config.param];
	const injects = {};
	let bodyOpts = {};

	// TODO: merge this with `body.js`
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
		bodyOpts = bodyParser(config.model, body, exclude, false);
	} catch(message) {
		// send client-side error
		return res.status(400).json({ meta: { error: { message }}});
	}

	await config.model.update(bodyOpts, { where: { id } });

	config.model
		.findByPk(id)
		.then(d => res.status(200).send(d))
		.catch(error => res.status(500).json({error}));
};
