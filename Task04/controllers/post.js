const bodyParser = require("./body");

module.exports = config => (req, res) => {
	let bodyOpts;

	try {
		bodyOpts = bodyParser(config.body, req.body);
	} catch(e) {
		const message = e.toString();
		// send client-side error
		return res.status(400).json({ meta: { error: { message }}});
	}

	config.model
		.create(bodyOpts)
		.then(d => res.status(201).send(d))
		.catch(error => res.status(500).json({error}));
};
