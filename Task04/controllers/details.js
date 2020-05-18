module.exports = config => (req, res) => {
	const id = req.params.modelId;
	// include children models
	const include = Object.entries(config.include)
		.map(a => {
			const [k, v] = a;
			const props = {};

			// filter unique properties
			if(typeof v === "object") {
				props.model = v.model;
				if(!v.isUnique) props.limit = 10;
			} else {
				props.model = v;
				props.limit = 10;
			}

			return Object.assign(props, {
				as: k,
				attributes: ["id"],
				order: [
					["createdAt", "DESC"],
				],
			});
		});

	const findArgs = Object.assign({}, config.find, {include});

	// filter using primary key (id)
	return config.model
		.findByPk(id, findArgs)
		.then(fetched => {
			// when "null" is returned, the ressource hasn't been found
			if(fetched === null) return res.status(404).json({ meta: { error: {
				message:
					`No ressource found matching id ${id}`,
			}}});

			// prepare model links
			const baseUrl = "http://" + req.headers.host;
			const data = fetched.dataValues;
			const link = {};

			include.map(i => [i.as, !i.limit])
				.forEach(props => {
					const [model, isUnique] = props;

					if(isUnique && data[model]) {
						link[model] =
							`${baseUrl}/${model}/${data[model].dataValues.id}`;
					} else if(!config.unifyMultipleLinks && data[model]) {
						link[model] = data[model].map(a =>
							`${baseUrl}/${model}/${a.dataValues.id}`);
					} else if(data[model]) {
						link[model] = `${baseUrl}${req.originalUrl}/${model}`;
					} else {
						link[model] = null;
					}

					delete data[model];
				});

			res.status(200).json({
				metadata: {link},
				data,
			});
		})
		.catch(error => res.status(500).json({error}));
};
