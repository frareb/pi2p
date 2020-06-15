const fs = require("fs");
const path = require("path");
const { toLaTeX } = require("rebber");

const models = require("../models");
const template = require("./template");

module.exports = options => {
	const {
		lang,
		institute,
	} = options;

	const [year, month] = [options.year, options.month].map(n => parseInt(n));

	// set language for i18n
	require("./utils/i18n").lang(lang);

	const generators = {};
	const generatorsOrder = {};

	// get all generators, in filename order
	fs.readdirSync(path.join(__dirname, "generators"))
		.filter(file => {
			return	(file.indexOf(".") !== 0) &&
					(file.slice(-3) === ".js");
		})
		.forEach(file => {
			const filePath = path.join(__dirname, "generators/", file);
			const { name, order, generator } = require(filePath);

			generators[name] = generator;
			generatorsOrder[name] = order;
		});

	// sort generators by given order
	const sortedGenerators = Object.entries(generatorsOrder)
		.sort((a, b) => a[1] - b[1])
		.map(a => a[0]);

	// globally stored variables for passing through promises
	let instituteName = "";
	let generatorCount, gatewayCount;
	const gatewayNames = [];

	// find gateways associated to institute
	return models.Gateways
		.findAll({
			where: {
				instituteId: institute,
			},
			include: [{
				model: models.Institutes,
				as: "institute",
				attributes: ["name"],
			}],
			attributes: ["id", "name"],
		})
		.then(gateways => {
			generatorCount = sortedGenerators.length;
			gatewayCount = gateways.length;

			gateways.forEach(g => gatewayNames.push(g.dataValues.name));

			if(gateways.length >= 1)
				instituteName = gateways[0].dataValues.institute.name;

			return [...new Array(generatorCount * gatewayCount)]
				.map((_, i) => {
					const currentGenerator = Math.floor(i / gatewayCount);
					const currentGateway = i % gatewayCount;
		
					// insert promises in order
					return generators[sortedGenerators[currentGenerator]](
						year,
						month,
						gateways[currentGateway].dataValues.id,
					);
				});
		})
		.then(ps => Promise.all(ps))
		.then(executedGenerators => {
			// construct a simple MDAST tree
			const mdastTree = {
				type: "root",
				children: [],
			};

			// append heading and content to MDAST
			executedGenerators.forEach((mdastFragment, i) => {
				const currentGenerator = Math.floor(i / gatewayCount);
				const previousGenerator = Math.floor((i - 1) / gatewayCount);
				const nextGenerator = Math.floor((i + 1) / gatewayCount);
				const currentGateway = i % gatewayCount;

				// add global heading on first child
				if(currentGenerator !== previousGenerator) {
					const mdastHeadingName = sortedGenerators[currentGenerator];

					mdastTree.children.push({
						type: "heading",
						depth: 3,
						children: [{type: "text", value: mdastHeadingName}],
					});
				}

				// add local heading on all non-empty children
				if(mdastFragment.length > 0) {
					mdastTree.children.push({
						type: "heading",
						depth: 4,
						children: [{
							type: "text",
							value: `Gateway ${gatewayNames[currentGateway]}`,
						}],
					});
				}

				mdastTree.children.push(...mdastFragment.flat(Infinity));

				if(currentGenerator !== nextGenerator) {
					// add page break at the end of all children
					mdastTree.children.push({
						type: "thematicBreak",
					});
				}
			});

			return mdastTree;
		})
		// stringify MDAST to LaTeX
		.then(mdastTree => template({
			lang,
			institute: instituteName,
			localeDate: new Date(year, month - 1),
			content: toLaTeX(mdastTree, {
				thematicBreak: () => "\\pagebreak",
				firstLineRowFont: "\\rowfont[l]{}",
				headerParse: tableRows => {
					// eslint-disable-next-line max-len
					const columns = Math.max(...tableRows.map(l => l.split("&").length));
					return `${"X[-1] ".repeat(columns)}`;
				},
			}),
		}));
};
