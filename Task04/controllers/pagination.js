module.exports = config => (req, res) => {
	// get query strings with defaults
	const {
		page = 0,
		page_size = 10,
	} = req.query;

	const findArgs = Object.assign({}, config.find, {
		limit: page_size,
		offset: page * page_size,
		// order by last creation date, and ids if dates are equal
		order: [
			["createdAt", "DESC"],
			["id", "DESC"],
		],
	});

	const pageCheckPromise = config.model.count();
	const modelGetPromise = config.model.findAll(findArgs);

	// resolve page count and model query
	Promise.all([pageCheckPromise, modelGetPromise])
		.then(promiseResults => {
			// extract promises results
			const [count, data] = promiseResults;

			// handle pagination
			const maxPage = Math.ceil(count / page_size) - 1;
			const baseUrl = "http://" + req.headers.host + req.baseUrl;
			const links = [];

			const paginationLinkForge = (p, n) =>
				`<${baseUrl}?page=${p}&page_size=${page_size}>; rel="${n}"`;

			links.push(paginationLinkForge(0, "first"));

			if(page < maxPage) {
				links.push(paginationLinkForge(page+1, "next"));

				if(page > 0) {
					links.push(paginationLinkForge(page-1, "prev"));
				}
			// if we got beyond the last page, throw error
			} else if(page > maxPage) {
				return res.status(416).json({ meta: { error: {
					message:
					`Requested page ${page} but the last page is ${maxPage}.`,
				}}});
			}

			links.push(paginationLinkForge(maxPage, "last"));
			res.header("Link", links);

			// send response datas
			res.json({
				data: data.map(i => Object.assign({}, i.dataValues, {
					url: `${baseUrl}/${i.id}`,
				})),
			});
		})
		.catch(error => res.status(500).json({meta: {error}}));
};
