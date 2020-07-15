const BodyParser = require("./body");

module.exports = config => (req, res) => {
	const postprocessor = typeof config.postprocessor === "function" ?
		config.postprocessor :
		(d => d);

	config.strict = true;
	config.body = undefined;
	
	const localParser = BodyParser.fromConfig(config);

	let bodyOpts = {};

	try {
		bodyOpts = localParser.validate(req.body);
	} catch(message) {
		// send client-side error
		return res.status(400).json({ meta: { error: { message }}});
	}

	return config.model
		.create(bodyOpts)
		.then(d => res.status(201).send(postprocessor(d)))
		.catch(error => res.status(500).json({error}));
};
