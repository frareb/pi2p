const BodyParser = require("./body");

module.exports = config => async (req, res) => {
	const postprocessor = typeof config.postprocessor === "function" ?
		config.postprocessor :
		(d => d);

	const id = req.params.modelId;

	config.strict = false;
	config.body = undefined;

	const localParser = BodyParser.fromConfig(config);

	let bodyOpts = {};

	try {
		bodyOpts = localParser.validate(req.body);
	} catch(message) {
		// send client-side error
		return res.status(400).json({ meta: { error: { message }}});
	}

	await config.model.update(bodyOpts, { where: { id } });

	return config.model
		.findByPk(id)
		.then(d => res.status(200).send(postprocessor(d)))
		.catch(error => res.status(500).json({error}));
};
