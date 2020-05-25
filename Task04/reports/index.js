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

	// construct a simple MDAST tree
	const mdastTree = {
		type: "root",
		children: [],
	};

	// sort generators by given order
	const sortedGenerators = Object.entries(generatorsOrder)
		.sort((a, b) => a[1] - b[1]);

	function appendToMdast(i=0) {
		const generatorName = sortedGenerators[i][0];
		const generator = generators[generatorName];

		mdastTree.children.push({
			type: "heading",
			depth: 3,
			children: [{type: "text", value: generatorName}],
		});

		generator(month, institute).then(fragment => {
			mdastTree.children.push(fragment);
			if(i + 1 < sortedGenerators.length) appendToMdast(i + 1);
			else generateLatex();
		});
	}

	function generateLatex() {
		const finalContent = template({
			lang,
			content: toLaTeX(mdastTree),
		});

		console.log(finalContent);
	}

	appendToMdast();
};
