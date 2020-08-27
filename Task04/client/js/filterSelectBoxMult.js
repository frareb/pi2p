"use strict";

const urlBase = "";
const waitMsg = document.getElementById('networkWait');

import { getRandomColor } from "./colors.js";
import $ from "jquery";
import Plotly from "plotly.js/lib/index-basic";

// functions tools
const unique = (value, index, self) => {
	return self.indexOf(value) === index
}


const urlListInst = `${urlBase}/institutes?page_size=100`;
$.getJSON(urlListInst, function(x) {
	const select = document.getElementById("selectInst");
	select.options.length = 0; // vider les options
	select.options[select.options.length] = new Option("", 0)
	for (let i = 0; i < x.data.length; i++) {
		select.options[select.options.length] = new Option(x.data[i].name, x.data[i].id);
	};
});
$("#selectInst").on("change",function(){
	const selectGate = document.getElementById("selectGate");
	selectGate.options.length = 0;
	selectGate.options[selectGate.options.length] = new Option("...", 0)
	const value = $(this).val();
	const urlListGate = `${urlBase}/gateways?instituteId=${value}&page_size=100`;
	$.getJSON(urlListGate, function(x) {
		for (let i = 0; i < x.data.length; i++) {
			selectGate.options[selectGate.options.length] = new Option(x.data[i].name, x.data[i].id);
		};
	});
});
let listSensNameFilter = [];
let urlListSens = "";
$("#selectGate").on("change",function(){
	const selectUnit = document.getElementById("selectUnit");
	selectUnit.options.length = 0;
	selectUnit.options[selectUnit.options.length] = new Option("...", null)
	const value = $(this).val();
	// console.log("gatewayId: ", value);
	urlListSens = `${urlBase}/sensors?gatewayId=${value}&page_size=100`;
	$.getJSON(urlListSens, function(x) {
		const listSensName = [];
		for (let i = 0; i < x.data.length; i++) {
			listSensName.push(x.data[i].name);
		};
		// console.log("listSensName", listSensName.filter(unique));
		listSensNameFilter = listSensName.filter(unique);
		for(let index in listSensName.filter(unique)) {
			selectUnit.options[selectUnit.options.length] = new Option(listSensNameFilter[index], index)
		};
	});
});
$("#selectUnit").on("change",function(){
	waitMsg.textContent = ' Please wait, data is being loaded...';
	const varId = $(this).val();
	const varName = listSensNameFilter[varId];
	// console.log(urlListSens);
	const sensorIds = [];
	const sensorLab = [];
	$.getJSON(urlListSens, function(x) {
		for (let i = 0; i < x.data.length; i++) {
			if (x.data[i].name == varName){
				sensorIds.push(x.data[i].id);
				// sensorLab.push(`${x.data[i].name} ${x.data[i].description}`);
				sensorLab.push(`${x.data[i].description}`);
			};
		};
		// console.log("sensorIds", sensorIds);

		const timestampNow = Date.now();//i
		const timestamp30d = timestampNow - (30*24*60*60*1000);//i
		const allUrls = [];//i
		for (let i = 0; i < sensorIds.length; i++) {
			allUrls.push($.ajax(`${urlBase}/Sensors/${sensorIds[i]}/datas?start=${timestamp30d}&end=${timestampNow}`)); //i
		// 	if (i == 0){
		// 		makeSimpleLineSensor(sensorIds[i], varName, false, sensorLab[i])
		// 	} else {
		// 		setTimeout(function () {
		// 			makeSimpleLineSensor(sensorIds[i], varName, true, sensorLab[i])
		// 		}, 800);
		// 	}
		};
		// console.log("allUrls", allUrls);
		const allTraces = [];//i
		$.when.apply(0, allUrls).then(function() {//i
			for (let argNum = 0; argNum < arguments.length; argNum++) {//i
				// console.log("arguments[argNum]", arguments[argNum]);
				// console.log("arguments[argNum].length", arguments[argNum].length);
				let myCurrentX = [];
				let myCurrentY = [];
				if(arguments[argNum][1] == "success"){
					for (let i = 0; i < arguments[argNum][0].data.length; i++) {//i
						myCurrentX.push(new Date(arguments[argNum][0].data[i].createdAt)); //i
						myCurrentY.push(arguments[argNum][0].data[i].value);//i
					};
				} else {
					if (arguments[argNum] !== "success" & arguments[argNum].hasOwnProperty('data')) {
						for (let i = 0; i < arguments[argNum].data.length; i++) {//i
							myCurrentX.push(new Date(arguments[argNum].data[i].createdAt)); //i
							myCurrentY.push(arguments[argNum].data[i].value);//i
						};
					}
				}
				allTraces.push({ // trace with raw data
					line: {color: getRandomColor()},
					x: myCurrentX,
					y: myCurrentY,
					name: sensorLab[argNum] })
			};
		}).done(function(){
			// console.log("allTraces[0].x.length", allTraces[0].x.length);
			if(allTraces.length > 0){
				if(allTraces[0].x.length > 4){
					makeSimpleLineSensorFromTrace(allTraces, varName);
				} else {
					waitMsg.textContent = 'No or not enough data';
				}
			}else {
				waitMsg.textContent = 'No data';
			}
		});
		// console.log(allUrls);//i
		// makeSimpleLineSensorFromTrace(allTraces, varName);
	});
});

function makeSimpleLineSensorFromTrace(allTraces, nameVar, lab="") {
	waitMsg.textContent = ' Please wait, the chart is being created...';
	// console.log("allTraces", allTraces);//i
	// console.log(allTraces.length);
	// if (allTraces[0].y.length > 0){
		const tNow = new Date();//i
		let t30d = new Date();
		t30d = new Date(t30d.setMonth(t30d.getMonth() - 1));//i
		const myLayout = {
			autosize: true,
			margin: {
				l: 30,
				r: 20,
				b: 0,
				t: 80,
				pad: 4
			},
			showlegend: true,
			legend: {
				x: 0,
				xanchor: "left",
				y: 1
			},
			title: `${nameVar}`,
			xaxis: {
				automargin: true,
				autorange: true,
				rangeselector: { buttons: [
					{
						count: 1,
						label: "24h",
						step: "day",
						stepmode: "backward"
					},
					{
						count: 2,
						label: "2d",
						step: "day",
						stepmode: "backward"
					},
					{
						count: 7,
						label: "1w",
						step: "day",
						stepmode: "backward"
					},
					{
						step: "all",
						label: "30d"
					}
				]},
				rangeslider: {range: [
					`${t30d.getFullYear()}-${t30d.getMonth() + 1}-${t30d.getDate()}`,
					`${tNow.getFullYear()}-${tNow.getMonth() + 1}-${tNow.getDate()}`
				]}, //[allTraces[0].x[0], allTraces[0].x[x.length - 1]]},
				type: "date"
			},
			yaxis: {
				automargin: true,
				hoverformat: ".1f"
			}
		}
		const config = {
			responsive: true,
			editable: true,
			// modeBarButtonsToAdd: [{
			// 	name: "Download data",
			// 	icon: Plotly.Icons.disk,
			// 	click: function(gd) {
			// 		const json = x.data;
			// 		const fields = Object.keys(json[0])
			// 		const replacer = function(key, value) { return value === null ? "" : value }
			// 		let csv = json.map(function(row){
			// 			return fields.map(function(fieldName){
			// 				return JSON.stringify(row[fieldName], replacer)
			// 			}).join(",")
			// 		})
			// 		csv.unshift(fields.join(",")) // add header column
			// 		csv = csv.join("\r\n");
			// 		const text = csv;
			//
			// 		const blob = new Blob([text], {type: "text/plain"});
			// 		let a = document.createElement("a");
			// 		const object_URL = URL.createObjectURL(blob);
			// 		a.href = object_URL;
			// 		a.download = "data.csv";
			// 		document.body.appendChild(a);
			// 		a.click();
			// 		URL.revokeObjectURL(object_URL);
			// 	}
			// }]
		}
		let myPlot = document.getElementById("myChart");
		Plotly.newPlot(myPlot, allTraces, myLayout, config);
		myPlot.on('plotly_afterplot', function(){
			waitMsg.textContent = '';
		});
};


function makeSimpleLineSensor(sensorId=1, nameVar, add=false, lab="") {
	waitMsg.textContent = ' Please wait, the chart is being created...';
	const timestampNow = Date.now();
	const timestamp30d = timestampNow - (30*24*60*60*1000); // -30 days

	const myURL = `${urlBase}/Sensors/${sensorId}/datas?start=${timestamp30d}&end=${timestampNow}`;
	// console.log(myURL);
	const myX = [];
	const myY = [];

	Plotly.d3.json(myURL, function(error, x) {
		if (x.data.length > 1){
			for (let i = 0; i < x.data.length; i++){
				myX.push(new Date(x.data[i].createdAt )) //- 120*60*1000
				myY.push(x.data[i].value) }
			const myLayout = {
				autosize: true,
				margin: {
					l: 30,
					r: 20,
					b: 0,
					t: 80,
					pad: 4
				},
				showlegend: true,
				legend: {
					x: 0,
					xanchor: "left",
					y: 1
				},
				title: `${nameVar}`,
				xaxis: {
					automargin: true,
					autorange: true,
					rangeselector: { buttons: [
						{
							count: 1,
							label: "24h",
							step: "day",
							stepmode: "backward"
						},
						{
							count: 2,
							label: "2d",
							step: "day",
							stepmode: "backward"
						},
						{
							count: 7,
							label: "1w",
							step: "day",
							stepmode: "backward"
						},
						{
							step: "all",
							label: "30d"
						}
					]},
					rangeslider: {range: [myX[0], myX[myX.length - 1]]},
					type: "date"
				},
				yaxis: {
					automargin: true,
					hoverformat: ".1f"
				}
			}
			const config = {
				responsive: true,
				editable: true,
				modeBarButtonsToAdd: [{
					name: "Download data",
					icon: Plotly.Icons.disk,
					click: function(gd) {
						const json = x.data;
						const fields = Object.keys(json[0])
						const replacer = function(key, value) { return value === null ? "" : value }
						let csv = json.map(function(row){
							return fields.map(function(fieldName){
								return JSON.stringify(row[fieldName], replacer)
							}).join(",")
						})
						csv.unshift(fields.join(",")) // add header column
						csv = csv.join("\r\n");
						const text = csv;

						const blob = new Blob([text], {type: "text/plain"});
						let a = document.createElement("a");
						const object_URL = URL.createObjectURL(blob);
						a.href = object_URL;
						a.download = "data.csv";
						document.body.appendChild(a);
						a.click();
						URL.revokeObjectURL(object_URL);
					}
				}]
			}
			let myPlot = document.getElementById("myChart");
			if (add == false){
				const myTrace = { // trace with raw data
					line: {color: "#17BECF"},
					x: myX,
					y: myY,
					name: lab }
				Plotly.newPlot(myPlot, [myTrace], myLayout, config);
				myPlot.on('plotly_afterplot', function(){
					waitMsg.textContent = '';
				});
			} else {
				const myTrace = { // trace with raw data
					line: {color: getRandomColor()},
					x: myX,
					y: myY,
					name: lab }
				Plotly.addTraces(myPlot, [myTrace]); // supprimer le setTimeout et
																						 // attendre le premier plot ?
				myPlot.on('plotly_afterplot', function(){
					waitMsg.textContent = '';
				});
			}
		} else {
			console.log("no data");
			waitMsg.textContent = 'No data';
		};
	});
};
