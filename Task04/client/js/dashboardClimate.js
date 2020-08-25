"use strict";

import $ from "jquery";

const div = document.getElementById('dashClimate');

const headingTitle = document.getElementById('dashTitle');

let workOnProgress = document.createElement("span");
workOnProgress.setAttribute("id", "dash_headingTitle");
workOnProgress.textContent = 'Dashboard: please wait, data is being loaded...';
headingTitle.appendChild(workOnProgress);

const urlBase = ""; //http://localhost:3000
const urlListInst = `${urlBase}/institutes?page_size=1000`;
$.getJSON(urlListInst, function(x) {
	for (let i = 0; i < x.data.length; i++) {
		let p = document.createElement("p");

		let instName = document.createElement("span");
		instName.setAttribute("id", "dash_instituteName");
		instName.textContent = `${x.data[i].name} `;
		let instId = document.createElement("span");
		instId.setAttribute("id", "dash_institutesId");
		instId.textContent = `(id: ${x.data[i].id}; `;
		let instCountryCode = document.createElement("span");
		instCountryCode.setAttribute("id", "dash_instituteCountryCode");
		instCountryCode.textContent = `${x.data[i].countryCode}; `;
		let instUrl = document.createElement("a");
		instUrl.setAttribute("id", "dash_instituteUrl");
		instUrl.setAttribute("href", `${x.data[i].url}`);
		instUrl.textContent = `${x.data[i].url})`;

		p.appendChild(instName);
		p.appendChild(instId);
		p.appendChild(instCountryCode);
		p.appendChild(instUrl);

		const urlListGateways = `${urlBase}/institutes/${x.data[i].id}`;

		$.getJSON(urlListGateways, function(xx) {
			for (let j = 0; j < xx.metadata.link.gateways.length; j++) {
				let ul = document.createElement("ul");
				const urlGateway = `${xx.metadata.link.gateways[j]}`;
				$.getJSON(urlGateway, function(y) {
					let li = document.createElement("li");
					let gateName = document.createElement("span");
					gateName.setAttribute("id", "dash_gateName");
					gateName.textContent = `${y.data.name} `;
					let gateId = document.createElement("span");
					gateId.setAttribute("id", "dash_gateId");
					gateId.textContent = `(id: ${y.data.id}; `;
					let gateUrl = document.createElement("a");
					gateUrl.setAttribute("id", "dash_gateUrl");
					gateUrl.setAttribute("href", `${xx.metadata.link.gateways[j]}`);
					gateUrl.textContent = `${xx.metadata.link.gateways[j]})`;

					li.appendChild(gateName);
					li.appendChild(gateId);
					li.appendChild(gateUrl);

					for (let k = 0; k < y.metadata.link.sensors.length; k++) {
						let ul2 = document.createElement("ul");
						const urlSensor = `${y.metadata.link.sensors[k]}`;
						$.getJSON(urlSensor, function(yy) {
							let li2 = document.createElement("li");
							let sensName = document.createElement("span");
							sensName.setAttribute("id", "dash_sensName");
							sensName.textContent = `${yy.data.name} `;
							let sensDescrp = document.createElement("span");
							sensDescrp.setAttribute("id", "dash_sensDescrp");
							sensDescrp.textContent = `${yy.data.description} (`;
							let sensUnit = document.createElement("span");
							sensUnit.setAttribute("id", "dash_sensUnit");
							sensUnit.textContent = `${yy.data.unit}; `;
							let sensModel = document.createElement("span");
							sensModel.setAttribute("id", "dash_sensModel");
							sensModel.textContent = `${yy.data.model}); `;

							li2.appendChild(sensName);
							li2.appendChild(sensDescrp);

							const timestampNow = Date.now();
							const timestamp7h = timestampNow - (7*60*60*1000);
							const urlData = `${yy.metadata.link.datas}?start=${timestamp7h}&end=${timestampNow}`;
							$.getJSON(urlData, function(w) {
								let lastValue = "no data";
								let timestamp = "";
								if (w.data.length > 2){
									lastValue = Math.round(w.data[0].value * 10)/10;
									timestamp = w.data[0].createdAt;
								}
								let lastInfo = document.createElement("span");
								lastInfo.setAttribute("id", "dash_lastInfo");
								lastInfo.textContent = `${lastValue}`;
								let lastinfoTimestamp = document.createElement("span");
								lastinfoTimestamp.setAttribute("id", "dash_lastInfo");
								lastinfoTimestamp.textContent = `${timestamp}`;

								li2.appendChild(lastInfo);
								li2.appendChild(sensUnit);
								li2.appendChild(sensModel);
								li2.appendChild(lastinfoTimestamp);

								if ((k + 1) == y.metadata.link.sensors.length) {
									workOnProgress.textContent = 'Dashboard';
								}
							});

							ul2.appendChild(li2);
						});
						li.appendChild(ul2);
					};
					ul.appendChild(li);
				});
				p.appendChild(ul);
			};
		});
		div.appendChild(p);
	};
});
