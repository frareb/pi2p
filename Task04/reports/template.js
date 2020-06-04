const i18n = require("./utils/i18n");

const QUOTE_TYPES = {
	"french": "guillemets",
	"spanish": "mexican",
	"english": "american",
};

const LANG_TO_CC = {
	"french": "fr-FR",
	"spanish": "es-MX",
	"english": "en-US",
};

module.exports = config => {
	const lang = config.lang || "french";
	const content = config.content || "";
	const institute = config.institute || "";
	const localeDate = config.localeDate || new Date();

	// set lang in case not defined
	i18n.lang(lang);

	const dateString = localeDate.toLocaleDateString(LANG_TO_CC[lang], {
		month: "long",
		year: "numeric",
	});

	const nowDateString = new Date().toLocaleDateString(LANG_TO_CC[lang], {
		day: "numeric",
		month: "numeric",
		year: "numeric",
	});

	const langPkgs = [
		`\\usepackage[${lang}]{babel}`,
		`\\usepackage[${lang}=${QUOTE_TYPES[lang]}]{csquotes}`,
	];

	if(lang === "french") langPkgs.push("\\frenchspacing");

	return `\\documentclass[12pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{microtype}

\\usepackage{setspace}

\\setlength{\\parskip}{2pt}
\\setlength{\\parindent}{12pt}

${langPkgs.join("\n")}

\\usepackage{hyperref}
\\usepackage{longtable,tabu}
\\usepackage{graphicx}
\\usepackage[table]{xcolor}

\\rowcolors{2}{gray!10}{white}

\\begin{document}
	\\begin{center}
		\\huge ${i18n("REPORT_MAIN_TITLE")} ${institute} \\\\
		\\vspace*{5pt}
		\\LARGE ${i18n("MONTH_OF")} ${dateString} \\\\
		\\vspace*{0pt}
		\\Large ${i18n("GENERATED_ON")} ${nowDateString}
	\\end{center}

	\\vspace*{20pt}

	{
		\\hypersetup{
			pdftitle={Project PI2P},
			pdfauthor={Rebaudo et al.},
			hidelinks
		}
		\\begin{spacing}{0.5}
		\\tableofcontents
		\\end{spacing}
	}
	\\pagebreak

	${content}
\\end{document}`;
};
