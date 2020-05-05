const fs = require("fs");
const promisify = require("util").promisify;

const visit = require("unist-util-visit");
const unified = require("unified");
const remarkParse = require("remark-parse");
const remarkRehype = require("remark-rehype");
const rehypeFormat = require("rehype-format");
const rehypeDocument = require("rehype-document");
const rehypeHighlight = require("rehype-highlight");
const rehypeStringify = require("rehype-stringify");

const processor = unified()
	.use(remarkParse)
	.use(remarkRehype)
	.use(rehypeHighlight)
	// extract page title from first h1
	.use(() => (tree, vfile) => {
		let matched = false;

		visit(tree, "element", node => {
			if(matched || node.tagName !== "h1") return;

			matched = true;
			vfile.stem = node.children[0].value;
		});
	})
	.use(rehypeDocument, {
		css: ["https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.0.2/styles/github.min.css"],
	})
	.use(rehypeFormat)
	.use(rehypeStringify);

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const sourceDir = "source";
const resultDir = "../public/documentation";

function processAllFiles(files) {
	return Promise.all(files.map(filename => {
		const fullPath = `${__dirname}/${sourceDir}/${filename}`;
		const renderedName =
			`${__dirname}/${resultDir}/${filename.slice(0, -3)}.html`;

		return readFile(fullPath, { encoding: "utf8" })
			.then(processor.process)
			.then(vf => vf.contents)
			.then(c => writeFile(renderedName, c));
	}));
}

function filterMarkdown(readdirResult) {
	return new Promise(resolve => {
		resolve(readdirResult
			.filter(file => {
				return	(file.indexOf(".") !== 0) &&
						(file.slice(-3) === ".md");
			}));
	});
}

function generateDoc(dirname) {
	readdir(`${__dirname}/${dirname}`)
		.then(filterMarkdown)
		.then(processAllFiles)
		.catch(e => console.log(e));
}

generateDoc(sourceDir);
