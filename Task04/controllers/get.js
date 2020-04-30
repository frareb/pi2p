const sequelize = require("sequelize");

const DataType = sequelize.DataTypes;
const Op = sequelize.Op;

module.exports = config => (req, res) => {
	// get query strings
	const {
		start,
		end,
	} = req.query;

	const page = parseInt(req.query.page) || 0;
	const page_size = parseInt(req.query.page_size) || config.pageSize || 10; 

	let specificFilter = {};

	// filter by creation date
	try {
		DataType.DATE().validate(start);
		DataType.DATE().validate(end);

		Object.assign(specificFilter, {
			where: {
				createdAt: {
					[Op.between]: [start, end],
				},
			},
		});
	// eslint-disable-next-line no-empty
	} catch(e) {}

	// pagination-based filter
	if(	typeof page === "number" && !isNaN(page) &&
		typeof page_size === "number" && !isNaN(page_size))
		Object.assign(specificFilter, {
			limit: page_size,
			offset: page * page_size,
		});

	else return res.status(500).json({meta: { error: { message: 
		"Missing page_size or page number",
	}}});

	const findArgs = Object.assign({}, config.find, specificFilter, {
		// order by last creation date, and ids if dates are equal
		order: [
			["createdAt", "DESC"],
			["id", "DESC"],
		],
	});

	if(config.find.attributes && !config.find.attributes.includes("id")) {
		config.find.attributes.push("id");
	}

	// do not count inside main query bc we even count data outside our scope
	const pageCheckPromise = config.model.count();
	const modelGetPromise = config.model.findAll(findArgs);

	// resolve page count and model query
	Promise.all([pageCheckPromise, modelGetPromise])
		.then(promiseResults => {
			// extract promises results
			const [count, data] = promiseResults;

			// handle pagination
			let maxPage = Math.ceil(count / page_size) - 1;
			// weird case: max page is page -1 when there are no datas
			if(maxPage < 0) maxPage = 0;

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
