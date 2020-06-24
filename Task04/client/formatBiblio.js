"use strict";

import $ from "jquery";

export function formatBiblio(divId, biblioURL) {
	$.getJSON(biblioURL, function(listBib) {
			const div = document.getElementById(divId);

			listBib.sort(function(a, b){
				return b.meta.parsedDate - a.meta.parsedDate;
			});

			// console.log("listBib:", listBib);

			for (let i = 0; i < listBib.length; i++){
				let myRef = document.createElement('p');

				let myTitle = document.createElement('span');
				myTitle.setAttribute("id", "bib_title");
				myTitle.setAttribute("title", listBib[i].data.abstractNote);
				myTitle.textContent = `${listBib[i].data.title}. `;

				let myDOI = document.createElement('a');
				myDOI.setAttribute("id", "bib_doi");
				myDOI.setAttribute("href", `https://dx.doi.org/${listBib[i].data.DOI}`);
				myDOI.textContent = `[${listBib[i].data.DOI}]`;

				let myCreators = document.createElement('span');
				myCreators.setAttribute("id", "bib_author");
				for (var j = 0; j < listBib[i].data.creators.length; j++) {
					if (listBib[i].data.creators[j].creatorType == "author") {
						if (j == 0) {
							myCreators.textContent = `${listBib[i].data.creators[j].firstName.replace(/[^A-Z]/g, '')} ${listBib[i].data.creators[j].lastName}`;
						} else {
							myCreators.textContent = `${myCreators.textContent}, ${listBib[i].data.creators[j].firstName.replace(/[^A-Z]/g, '')} ${listBib[i].data.creators[j].lastName}`;
						}
					}
				};

				let myDate = document.createElement('span');
				myDate.setAttribute("id", "bib_date");
				myDate.textContent = ` (${listBib[i].meta.parsedDate}) `;

				let myPubliTitle = document.createElement('span');
				myPubliTitle.setAttribute("id", "bib_publititle");
				myPubliTitle.textContent = `${listBib[i].data.publicationTitle} `;

				let myVolume = document.createElement('span');
				myVolume.setAttribute("id", "bib_volume");
				if (listBib[i].data.volume != "") {
					myVolume.textContent = `${listBib[i].data.volume}`;
				}

				let myIssue = document.createElement('span');
				myIssue.setAttribute("id", "bib_issue");
				if (listBib[i].data.issue != "") {
					myIssue.textContent = `(${listBib[i].data.issue})`;
				}

				let myPages = document.createElement('span');
				myPages.setAttribute("id", "bib_pages");
				if (listBib[i].data.pages != "") {
					myPages.textContent = `: ${listBib[i].data.pages}. `;
				} else {
					myPages.textContent = ". "
				}

				myRef.appendChild(myCreators);
				myRef.appendChild(myDate);
				myRef.appendChild(myTitle);
				myRef.appendChild(myPubliTitle);
				myRef.appendChild(myVolume);
				myRef.appendChild(myIssue);
				myRef.appendChild(myPages);
				myRef.appendChild(myDOI);
				div.appendChild(myRef);

				// console.log("myRef:", myRef);
			};
	});
};
