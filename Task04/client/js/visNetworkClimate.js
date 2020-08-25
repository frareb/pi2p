"use strict";

// colors:
// #653356
// #6B5CA5
// #71A9F7
// #C6D8FF
// #FAA275
// #FF8C61

import $ from "jquery";
import Plotly from "plotly.js/lib/index-basic";
import { Network, DataSet } from "vis-network/dist/vis-network.esm";

// workaround for filling the page as height X% does not work
var height = Math.round(window.innerHeight * 0.70) + "px";
document.getElementById("mynetwork").style.height = height;

// makeNetwork
const nodesArray = [{id: 0, value: 15, label: "Main server", color: "#653356ff"}];
const edgesArray = [];
const nodes = new DataSet(nodesArray);
const edges = new DataSet(edgesArray);
const container = document.getElementById("mynetwork");
const data = {
	nodes: nodes,
	edges: edges
};
const options = {
	nodes: {
		shape: "dot"
	},
	interaction: {
		hover:true
	}
};
const network = new Network(container, data, options);

const waitMsg = document.getElementById('networkWait');
waitMsg.textContent = ' Please wait, data is being loaded...';

const urlBase = "";
const urlListInst = `${urlBase}/institutes?page_size=1000`;
$.getJSON(urlListInst, function(x) {
	for (let i = 0; i < x.data.length; i++) {
		nodesArray.push({
			id: "i" + x.data[i].id,
			value: 10,
			label: x.data[i].name,
			title: `id: ${x.data[i].id}</br>name: ${x.data[i].name}</br>countryCode: ${x.data[i].countryCode}</br>url: <a href="${x.data[i].url}">${x.data[i].url}</a>`,
			color: "#6B5CA5"
		});
		edgesArray.push({from: 0, to: "i" + x.data[i].id});
	};
	const urlListGate = `${urlBase}/gateways?page_size=1000`;
	$.getJSON(urlListGate, function(y) {
		for (let i = 0; i < y.data.length; i++) {
			nodesArray.push({
				id: "g" + y.data[i].id,
				value: 7,
				label: y.data[i].name,
				title: `id: ${y.data[i].id}</br>instituteId: ${y.data[i].instituteId}</br>name: ${y.data[i].name}</br>url: <a href="${y.data[i].url}">${y.data[i].url}</a>`,
				color: "#71A9F7"
			});
			edgesArray.push({from: "i" + y.data[i].instituteId, to: "g" + y.data[i].id});
		};
		data.nodes.update(nodesArray);
		data.edges.update(edgesArray);
		const urlListSens = `${urlBase}/sensors?page_size=1000`;
		$.getJSON(urlListSens, function(z) {
			for (let i = 0; i < z.data.length; i++) {
				const nodesArrayUpdate = [];
				const edgesArrayUpdate = [];
				const timestampNow = Date.now();
				const timestamp1h = timestampNow - (12*60*60*1000);
				const urlListData = `${urlBase}/Sensors/${z.data[i].id}/datas?start=${timestamp1h}&end=${timestampNow}`;
				$.getJSON(urlListData, function(w) {
					let lastValue = "no data";
					let colorChange = "#FF8C61";
					let timestamp = "";
					if (w.data.length > 2){
						lastValue = Math.round(w.data[0].value * 10)/10;//w.data.length - 1
						colorChange = "#6ae35d";
						timestamp = w.data[0].createdAt; // w.data.length - 1
					}
					nodesArrayUpdate.push({
						id: "s" + z.data[i].id,
						value: 5,
						label: z.data[i].name,
						color: colorChange,
						title: `Last read in UTC: <b>${lastValue}${z.data[i].unit}</b></br>${timestamp}</br>id: ${z.data[i].id}</br>gatewayId: ${z.data[i].gatewayId}</br>name: ${z.data[i].name}</br>unit: ${z.data[i].unit}</br>model: ${z.data[i].model}</br>description: ${z.data[i].description}</br>url: <a href="${z.data[i].url}">${z.data[i].url}</a>`,
						shape: (z.data[i].name == "TRAP") ? "triangle" : "dot"
					});
					edgesArrayUpdate.push({
						from: "g" + z.data[i].gatewayId,
						to: "s" + z.data[i].id
					});
					data.nodes.update(nodesArrayUpdate);
					data.edges.update(edgesArrayUpdate);
				// });
				}).done(function(){
					waitMsg.textContent = '';
				})
				// if ((i + 1) == z.data.length) {
				// 	waitMsg.textContent = '';
				// }
			};
		});
	});
});

network.on("click", function(params){
	// functionality for popup to show on mouseover
	// params.event = "[original event]";
	// document.getElementById("PopUp").innerHTML =
	// 	"<h2>Click event:</h2>" + JSON.stringify(params, null, 4);
	const myNode = this.getNodeAt(params.pointer.DOM);
	const myNodeObject = nodes.get(myNode);
	// console.log(myNodeObject);
	if(myNode !== undefined && myNode.startsWith("s") && myNodeObject.color == "#6ae35d"){
		// console.log(myNode);
		const sensorId = myNode.replace("s", "");
		// console.log(sensorId);
		makeSimpleLineChart(sensorId);

		// TO DO: replace with lib to place the popup, eg POPPER
		// https://popper.js.org
		showPos(event)
	};
});

function showPos(event) {
	let el, x, y;
	el = document.getElementById("PopUp");
	if (window.event) {
		x = window.event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
		y = window.event.clientY + document.documentElement.scrollTop + document.body.scrollTop;
	}
	else {
		x = event.clientX + window.scrollX;
		y = event.clientY + window.scrollY;
	}
	x -= 2;
	y -= 2;
	y = y + 15
	el.style.left = x + "px";
	el.style.top = y + "px";
	el.style.display = "block";
	// document.getElementById("PopUpText").innerHTML = text;
}


network.on("hoverNode", function(){
	// functionality for popup to show on mouseover
});
network.on("blurNode", function(){
	// functionality for popup to hide on mouseout
});

function makeSimpleLineChart(sensorId) {
	const timestampNow = Date.now();
	const timestamp1h = timestampNow - (12*60*60*1000);

	const myURL = `${urlBase}/Sensors/${sensorId}/datas?start=${timestamp1h}&end=${timestampNow}`;
	const myX = [];
	const myY = [];
	Plotly.d3.json(myURL, function(error, x) {
		if (x.data.length > 1){
			for (let i = 0; i < x.data.length; i++){
				myX.push(new Date(x.data[i].createdAt ))
				myY.push(x.data[i].value) }
			const myLayout = {
				autosize: true,
				margin: {
					l: 0,
					r: 0,
					b: 0,
					t: 0,
					pad: 4
				},
				showlegend: false,
				xaxis: {
					automargin: true,
					autorange: true,
					type: "date"
				},
				yaxis: {
					automargin: true,
					hoverformat: ".1f"
				}
			}
			const config = {
				responsive: true
			}
			const myTrace = { // trace with raw data
				line: {color: "#17BECF"},
				x: myX,
				y: myY}
			Plotly.newPlot(document.getElementById("PopUp"), [myTrace], myLayout, config);
		} else {
			document.getElementById("PopUp").innerHTML = "";
			console.log("no data");
		};
	});
};
