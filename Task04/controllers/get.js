const BodyParser = require("./body");
const sequelize = require("sequelize");
const merge = require("deepmerge");

const formatDate = BodyParser.formatDate;
const DataType = sequelize.DataTypes;
const Op = sequelize.Op;

module.exports = config => (req, res) => {
	// get query strings
	let {
		start,
		end,
	} = req.query;

	const page = parseInt(req.query.page) || 0;
	const page_size = parseInt(req.query.page_size) || config.pageSize || 10;

	const localParser = new BodyParser(config.model, false);
	localParser.addOptionalFields(["createdAt", "updatedAt"]);

	const specificFilter = {};

	// filter by creation date
	try {
		start = formatDate(start);
		end = formatDate(end);

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

	let headerParams;

	try {
		headerParams = localParser.validate(req.query);
	} catch(error) {
		return res.status(500).json({meta: {error}});
	}

	const findArgs = merge.all([config.find, specificFilter, {
		where: headerParams,
		// order by last creation date, and ids if dates are equal
		order: [
			["createdAt", "DESC"],
			["id", "DESC"],
		],
	}]);

	if(config.find.attributes && !config.find.attributes.includes("id")) {
		config.find.attributes.push("id");
	}

	// do not count inside main query bc we even count data outside our scope
	const pageCheckPromise = config.model.count();
	const modelGetPromise = config.model.findAll(findArgs);

	// resolve page count and model query
	return Promise.all([pageCheckPromise, modelGetPromise])
		.then(promiseResults => {
			// extract promises results
			const [count, data] = promiseResults;

			// handle pagination
			let maxPage = Math.ceil(count / page_size) - 1;
			// weird case: max page is page -1 when there are no datas
			if(maxPage < 0) maxPage = 0;

			const isForwarded =
				Object.keys(req.headers).includes("x-forwarded-host");
			const host = isForwarded ?
				req.headers["x-forwarded-host"] :
				req.headers["host"];
			const protocol = isForwarded ? "https://" : "http://";

			const baseUrl = protocol + host + req._parsedOriginalUrl.pathname;
			const link = {};

			const paginationLinkForge = (p) =>
				`${baseUrl}?page=${p}&page_size=${page_size}`;

			link["first"] = paginationLinkForge(0);

			if(page < maxPage) {
				link["next"] = paginationLinkForge(page + 1);

				if(page > 0) {
					link["prev"] = paginationLinkForge(page - 1);
				}
			// if we got beyond the last page, throw error
			} else if(page > maxPage) {
				return res.status(416).json({ meta: { error: {
					message:
					`Requested page ${page} but the last page is ${maxPage}.`,
				}}});
			}

			link["last"] = paginationLinkForge(maxPage);

			// send response datas
			res.status(200).json({
				metadata: {link},
				data: config.removeModelUrl ? data : 
					data.map(i => Object.assign({}, i.dataValues, {
						url: `${baseUrl}/${i.id}`,
					})),
			});
		})
		.catch(error => res.status(500).json({meta: {error}}));
};
