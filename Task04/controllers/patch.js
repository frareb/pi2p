const bodyParser = require("./body");

module.exports = config => async (req, res) => {
	const id = req.params.modelId;
	let bodyOpts = {};

	try {
		bodyOpts = bodyParser(Object.assign(config, {
			body: req.body,
			strict: false,
		}));
	} catch(message) {
		// send client-side error
		return res.status(400).json({ meta: { error: { message }}});
	}

	await config.model.update(bodyOpts, { where: { id } });

	return config.model
		.findByPk(id)
		.then(d => res.status(200).send(d))
		.catch(error => res.status(500).json({error}));
};
