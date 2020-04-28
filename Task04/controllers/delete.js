module.exports = config => (req, res) => {
	let filter = {};

	// allow to delete EVERYTHING
	if(config.delete !== "*") {
		filter.id = req.params[config.delete];
	}

	config.model
		// simply remove the given id
		.destroy({
			where: filter,
		})
		.then(() => res.status(204).send())
		.catch(error => res.status(500).json({error}));
};
