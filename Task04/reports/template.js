const QUOTE_TYPES = {
	"french": "guillemets",
	"spanish": "mexican",
};

module.exports = config => {
	const lang = config.lang || "french";
	const content = config.content || "";

	const langPkgs = [
		`\\usepackage[${lang}]{babel}`,
		`\\usepackage[${lang}=${QUOTE_TYPES[lang]}]{csquotes}`,
	];

	if(lang === "french") langPkgs.push("\\frenchspacing");

	return `\\documentclass[12pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{microtype}

\\setlength{\\parskip}{8pt}
\\setlength{\\parindent}{12pt}

${langPkgs.join("\n")}

\\usepackage{hyperref}
\\usepackage{longtable,tabu}
\\usepackage{graphicx}

\\begin{document}
	{ \\hypersetup{hidelinks} \\tableofcontents }
	\\pagebreak

	${content}
\\end{document}`;
};
