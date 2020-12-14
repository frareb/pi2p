"use strict";

import $ from "jquery";

var optsTEMP = {
	angle: 0, // The span of the gauge arc
	lineWidth: 0.5, // The line thickness
	radiusScale: 1, // Relative radius
	pointer: {
		length: 0.6, // // Relative to gauge radius
		strokeWidth: 0.08, // The thickness
		color: '#000000' // Fill color
	},
	limitMax: false,     // If false, max value increases automatically if value > maxValue
	limitMin: false,     // If true, the min value of the gauge will be fixed
	colorStart: '#6FADCF',   // Colors
	colorStop: '#8FC0DA',    // just experiment with them
	strokeColor: '#E0E0E0',  // to see which ones work best for you
	generateGradient: true,
	highDpiSupport: true,     // High resolution support
	staticLabels: {
		font: "10px sans-serif",  // Specifies font
		labels: [0, 5, 10, 25, 30, 40],  // Print labels at these values
		color: "#000000",  // Optional: Label text color
		fractionDigits: 0  // Optional: Numerical precision. 0=round off.
	},
	renderTicks: {
		divisions: 4,
		divWidth: 1.1,
		divLength: 0.7,
		divColor: "#333333",
		subDivisions: 3,
		subLength: 0.5,
		subWidth: 0.6,
		subColor: "#666666"
	},
	staticZones: [
		{strokeStyle: "#F03E3E", min: 0, max: 5}, // Red from 100 to 130
		{strokeStyle: "#FFDD00", min: 5, max: 10}, // Yellow
		{strokeStyle: "#30B32D", min: 10, max: 25}, // Green
		{strokeStyle: "#FFDD00", min: 25, max: 30}, // Yellow
		{strokeStyle: "#F03E3E", min: 30, max: 40}  // Red
	],
};
var optsRH = {
	angle: 0, // The span of the gauge arc
	lineWidth: 0.5, // The line thickness
	radiusScale: 1, // Relative radius
	pointer: {
		length: 0.6, // // Relative to gauge radius
		strokeWidth: 0.08, // The thickness
		color: '#000000' // Fill color
	},
	limitMax: false,     // If false, max value increases automatically if value > maxValue
	limitMin: false,     // If true, the min value of the gauge will be fixed
	colorStart: '#6FADCF',   // Colors
	colorStop: '#8FC0DA',    // just experiment with them
	strokeColor: '#E0E0E0',  // to see which ones work best for you
	generateGradient: true,
	highDpiSupport: true,     // High resolution support
	staticLabels: {
		font: "10px sans-serif",  // Specifies font
		labels: [0, 25, 50, 75, 100],  // Print labels at these values
		color: "#000000",  // Optional: Label text color
		fractionDigits: 0  // Optional: Numerical precision. 0=round off.
	},
	renderTicks: {
		divisions: 4,
		divWidth: 1.1,
		divLength: 0.7,
		divColor: "#333333",
		subDivisions: 3,
		subLength: 0.5,
		subWidth: 0.6,
		subColor: "#666666"
	},
};
let z = 1;
// const target01 = document.getElementById(`gaugeTemp${z}`); // your canvas element
// const gauge01 = new Gauge(target01).setOptions(optsTEMP); // create sexy gauge!
// gauge01.maxValue = 40; // set max gauge value
// gauge01.setMinValue(0);  // Prefer setter over gauge.minValue = 0
// gauge01.animationSpeed = 32; // set animation speed (32 is default value)
// const target02 = document.getElementById(`gaugeRh${z}`); // your canvas element
// const gauge02 = new Gauge(target02).setOptions(optsRH); // create sexy gauge!
// gauge02.maxValue = 100; // set max gauge value
// gauge02.setMinValue(0);  // Prefer setter over gauge.minValue = 0
// gauge02.animationSpeed = 32; // set animation speed (32 is default value)


let targets01 = [];
let gauges01 = [];
let targets02 = [];
let gauges02 = [];
for (let i = 1; i < 11; ++i) {
	targets01[(i-1)] = document.getElementById(`gaugeTemp${i}`);
	gauges01[(i-1)] = new Gauge(targets01[(i-1)]).setOptions(optsTEMP);
	gauges01[(i-1)].maxValue = 40;
	gauges01[(i-1)].setMinValue(0);
	gauges01[(i-1)].animationSpeed = 32;
	gauges01[(i-1)].set(0);

	targets02[(i-1)] = document.getElementById(`gaugeRh${i}`);
	gauges02[(i-1)] = new Gauge(targets02[(i-1)]).setOptions(optsRH);
	gauges02[(i-1)].maxValue = 100;
	gauges02[(i-1)].setMinValue(0);
	gauges02[(i-1)].animationSpeed = 32;
	gauges02[(i-1)].set(0);
}


// gauge01.set(20); // set actual value
// gauge01.setTextField(document.getElementById('gaugeTempValue1'));
// gauge02.set(50); // set actual value
// gauge02.setTextField(document.getElementById('gaugeRhValue1'));



const div = document.getElementById('dashClimateFIDAIICA');

const headingTitle = document.getElementById('dashTitle');

let workOnProgress = document.createElement("span");
workOnProgress.setAttribute("id", "dash_headingTitle");
workOnProgress.textContent = 'Dashboard: please wait, data is being loaded...';
headingTitle.appendChild(workOnProgress);

const urlBase = ""; //http://localhost:3000
const urlListInst = `${urlBase}/institutes/28`;  //28 for FIDAIICA
$.getJSON(urlListInst, function(x) {
	// console.log(x.data.name);
	let p = document.createElement("p");

	let instName = document.createElement("span");
	instName.setAttribute("id", "dash_instituteName");
	instName.textContent = `${x.data.name} `;
	let instId = document.createElement("span");
	instId.setAttribute("id", "dash_institutesId");
	instId.textContent = `(id: ${x.data.id}; `;
	let instCountryCode = document.createElement("span");
	instCountryCode.setAttribute("id", "dash_instituteCountryCode");
	instCountryCode.textContent = `${x.data.countryCode}) `;

	p.appendChild(instName);
	p.appendChild(instId);
	p.appendChild(instCountryCode);

	for (let j = 0; j < x.metadata.link.gateways.length; j++) {
		let ul = document.createElement("ul");
		const urlGateway = `${x.metadata.link.gateways[j]}`;
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
			gateUrl.setAttribute("href", `${x.metadata.link.gateways[j]}`);
			gateUrl.textContent = `${x.metadata.link.gateways[j]})`;

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
					sensUnit.textContent = `${yy.data.unit}) `;
					// let sensModel = document.createElement("span");
					// sensModel.setAttribute("id", "dash_sensModel");
					// sensModel.textContent = `${yy.data.model}); `;

					li2.appendChild(sensName);
					li2.appendChild(sensDescrp);

					const timestampNow = Date.now();
					const timestamp1h = timestampNow - (1*60*60*1000);
					const urlData = `${yy.metadata.link.datas}?start=${timestamp1h}&end=${timestampNow}`;
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
						//li2.appendChild(sensModel);
						li2.appendChild(lastinfoTimestamp);

						if(yy.data.name == "Temperature"){
							gauges01[j].set(lastValue); // set actual value
							gauges01[j].setTextField(document.getElementById(`gaugeTempValue${j+1}`));
						}else{
							if(yy.data.name == "RH"){
								gauges02[j].set(lastValue); // set actual value
								gauges02[j].setTextField(document.getElementById(`gaugeRhValue${j+1}`));
							};
						};

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
	div.appendChild(p);
});
