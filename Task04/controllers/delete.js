module.exports = config => (req, res) => {
	let filter = config.filter || {};

	// allow to delete EVERYTHING
	if(config.deleteAll !== true) {
		filter.id = req.params.modelId;
	}

	return config.model
		// simply remove the given id
		.destroy({
			where: filter,
		})
		.then(() => res.status(204).send())
		.catch(error => res.status(500).json({error}));
};
