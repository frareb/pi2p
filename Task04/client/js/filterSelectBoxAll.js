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


const urlListSensors = `${urlBase}/sensors?page_size=1000`;
let listSensNameFilter = [];
let urlListSens = "";

const sensorIds = [];
const sensorLab = [];

$.getJSON(urlListSensors, function(x) {
	for (let i = 1; i < x.data.length; i++) {
		sensorIds.push(x.data[i].id);
		sensorLab.push(`${x.data[i].name} ${x.data[i].description}`);
	};
	listSensNameFilter = sensorLab.filter(unique);
	for(let index in listSensNameFilter) {
		selectVar.options[selectVar.options.length] = new Option(listSensNameFilter[index], index)
	};
	// console.log(sensorLab);
});

$("#selectVar").on("change",function(){
	waitMsg.textContent = ' Please wait, data is being loaded...';
	const varId = $(this).val();
	const varName = listSensNameFilter[varId];
	// console.log(varName)
	function getAllIndexes(arr, val) {
		let indexes = [], i;
		for(i = 0; i < arr.length; i++)
			if (arr[i] === val)
				indexes.push(i);
		return indexes;
	}
	const mySensorIndex = getAllIndexes(sensorLab, varName);
	// console.log(sensorLab);
	// console.log(sensorIds);
	// console.log(mySensorIndex);
	const timestampNow = Date.now();//i
	const timestamp30d = timestampNow - (30*24*60*60*1000);//i
	const mySensorIds = [];
	for (let i = 0; i < mySensorIndex.length; i++) {
		mySensorIds.push(sensorIds[mySensorIndex[i]]);
	}
	const mySensorIdsCorrespName = [];
	for(let k = 0; k < mySensorIds.length; k++){
		let myLab = [];
		if(typeof mySensorIds[k] !== "undefined"){
			$.getJSON(`${urlBase}/Sensors/${mySensorIds[k]}`, function(x) {
				const urlTargetGate = x.metadata.link.gateway
				$.getJSON(urlTargetGate, function(y) {
					myLab.push(y.data.name);
					const urlTargetInst = y.metadata.link.institute
					$.getJSON(urlTargetInst, function(z) {
						myLab.push(z.data.name);
					}).done(function(){
						mySensorIdsCorrespName.push(myLab.join('-'));
					});
				});
			});
		}
	};
	// console.log(mySensorIds.length);
	// console.log("mySensorIds", mySensorIds);
	const allUrls = [];//i
	for (let ii = 0; ii < mySensorIds.length; ii++) {
		allUrls.push($.ajax(`${urlBase}/Sensors/${mySensorIds[ii]}/datas?start=${timestamp30d}&end=${timestampNow}`)); //i
	};
	// console.log("allUrls", allUrls);
	const allTraces = [];//i
	$.when.apply(0, allUrls).then(function() {//i
		for (let argNum = 0; argNum < arguments.length; argNum++) {//i
			let myCurrentX = [];
			let myCurrentY = [];
			if(arguments[argNum][1] == "success"){
				for (let ii = 0; ii < arguments[argNum][0].data.length; ii++) {//i
					myCurrentX.push(new Date(arguments[argNum][0].data[ii].createdAt)); //i
					myCurrentY.push(arguments[argNum][0].data[ii].value);//i
				};
				allTraces.push({ // trace with raw data
					line: {color: getRandomColor()},
					x: myCurrentX,
					y: myCurrentY,
					name: mySensorIdsCorrespName[argNum]//getName(() => console.log("test"))
				});
			} else {
				if (arguments[argNum] !== "success" & arguments[argNum].hasOwnProperty('data')) {
					for (let ii = 0; ii < arguments[argNum].data.length; ii++) {//i
						myCurrentX.push(new Date(arguments[argNum].data[ii].createdAt)); //i
						myCurrentY.push(arguments[argNum].data[ii].value);//i
					};
					allTraces.push({ // trace with raw data
						line: {color: getRandomColor()},
						x: myCurrentX,
						y: myCurrentY,
						name: mySensorIdsCorrespName[argNum]// mySensorIds[argNum]
					});
					// pushTraces();
				}
			}
		}; // end for loop
	}).done(function(){
		if(allTraces.length > 0){
			if(allTraces[0].x.length > 4){
				makeSimpleLineSensorFromTrace(allTraces, varName);
			} else {
				waitMsg.textContent = 'No or not enough data';
			}
		} else {
			waitMsg.textContent = 'No data';
		}
	});
});

function makeSimpleLineSensorFromTrace(allTraces, nameVar, lab="") {
	waitMsg.textContent = ' Please wait, the chart is being created...';
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
				]},
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
		}
		let myPlot = document.getElementById("myChart");
		Plotly.newPlot(myPlot, allTraces, myLayout, config);
		myPlot.on('plotly_afterplot', function(){
			waitMsg.textContent = '';
		});
};


// function makeSimpleLineSensor(sensorId=1, nameVar, add=false, lab="") {
// 	const timestampNow = Date.now();
// 	const timestamp30d = timestampNow - (30*24*60*60*1000); // -30 days
//
// 	const myURL = `${urlBase}/Sensors/${sensorId}/datas?start=${timestamp30d}&end=${timestampNow}`;
// 	//console.log(myURL);
// 	const myX = [];
// 	const myY = [];
//
// 	Plotly.d3.json(myURL, function(error, x) {
// 		if (x.data.length > 1){
// 			for (let i = 0; i < x.data.length; i++){
// 				myX.push(new Date(x.data[i].createdAt )) //- 120*60*1000
// 				myY.push(x.data[i].value) }
// 			const myLayout = {
// 				autosize: true,
// 				margin: {
// 					l: 30,
// 					r: 20,
// 					b: 0,
// 					t: 80,
// 					pad: 4
// 				},
// 				showlegend: true,
// 				legend: {
// 					x: 0,
// 					xanchor: "left",
// 					y: 1
// 				},
// 				title: `${nameVar}`,
// 				xaxis: {
// 					automargin: true,
// 					autorange: true,
// 					rangeselector: { buttons: [
// 						{
// 							count: 1,
// 							label: "24h",
// 							step: "day",
// 							stepmode: "backward"
// 						},
// 						{
// 							count: 2,
// 							label: "2d",
// 							step: "day",
// 							stepmode: "backward"
// 						},
// 						{
// 							count: 7,
// 							label: "1w",
// 							step: "day",
// 							stepmode: "backward"
// 						},
// 						{
// 							step: "all",
// 							label: "30d"
// 						}
// 					]},
// 					rangeslider: {range: [myX[0], myX[myX.length - 1]]},
// 					type: "date"
// 				},
// 				yaxis: {
// 					automargin: true,
// 					hoverformat: ".1f"
// 				}
// 			}
// 			const config = {
// 				responsive: true,
// 				editable: true,
// 				modeBarButtonsToAdd: [{
// 					name: "Download data",
// 					icon: Plotly.Icons.disk,
// 					click: function(gd) {
// 						const json = x.data;
// 						const fields = Object.keys(json[0])
// 						const replacer = function(key, value) { return value === null ? "" : value }
// 						let csv = json.map(function(row){
// 							return fields.map(function(fieldName){
// 								return JSON.stringify(row[fieldName], replacer)
// 							}).join(",")
// 						})
// 						csv.unshift(fields.join(",")) // add header column
// 						csv = csv.join("\r\n");
// 						const text = csv;
//
// 						const blob = new Blob([text], {type: "text/plain"});
// 						let a = document.createElement("a");
// 						const object_URL = URL.createObjectURL(blob);
// 						a.href = object_URL;
// 						a.download = "data.csv";
// 						document.body.appendChild(a);
// 						a.click();
// 						URL.revokeObjectURL(object_URL);
// 					}
// 				}]
// 			}
// 			if (add == false){
// 				const myTrace = { // trace with raw data
// 					line: {color: "#17BECF"},
// 					x: myX,
// 					y: myY,
// 					name: lab }
// 				Plotly.newPlot(document.getElementById("myChart"), [myTrace], myLayout, config);
// 			} else {
// 				const myTrace = { // trace with raw data
// 					line: {color: getRandomColor()},
// 					x: myX,
// 					y: myY,
// 					name: lab }
// 				Plotly.addTraces(document.getElementById("myChart"), [myTrace]);
// 			}
// 		} else {
// 			console.log("no data");
// 		};
// 	});
//
//
// };
