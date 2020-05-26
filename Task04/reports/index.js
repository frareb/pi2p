const fs = require("fs");
const path = require("path");
const { toLaTeX } = require("rebber");

const template = require("./template");

module.exports = options => {
	const {
		lang,
		month,
		institute,
	} = options;

	// set langage for i18n
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

	// fetch all promises
	const promises = [...new Array(sortedGenerators.length)]
		.map((_, i) => generators[sortedGenerators[i]](month, institute));

	// execute the promises asynchronously
	return Promise.all(promises)
		.then(executedGenerators => {
			// construct a simple MDAST tree
			const mdastTree = {
				type: "root",
				children: [],
			};

			// append heading and content to MDAST
			executedGenerators.forEach((mdastFragment, i) => {
				const mdastHeadingName = sortedGenerators[i];

				mdastTree.children.push({
					type: "heading",
					depth: 3,
					children: [{type: "text", value: mdastHeadingName}],
				});

				mdastTree.children.push(...mdastFragment.flat(Infinity));
			});

			return mdastTree;
		})
		// stringify MDAST to LaTeX
		.then(mdastTree => template({
			lang,
			content: toLaTeX(mdastTree, {
				thematicBreak: () => "\\pagebreak",
				firstLineRowFont: "\\rowfont[l]{}",
			}),
		}));
};
