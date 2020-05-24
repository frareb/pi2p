"use strict";

// colors:
// #653356
// #6B5CA5
// #71A9F7
// #C6D8FF
// #FAA275
// #FF8C61

// makeNetwork
const nodesArray = [{id: 0, value: 15, label: 'Main server', color: "#653356ff"}];
const edgesArray = [];
const nodes = new vis.DataSet(nodesArray);
const edges = new vis.DataSet(edgesArray);
const container = document.getElementById('mynetwork');
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
const network = new vis.Network(container, data, options);

const urlBase = '.';
const urlListInst = `${urlBase}/institutes?page_size=1000`;
$.getJSON(urlListInst, function(x) {
	for (let i = 0; i < x.data.length; i++) {
		nodesArray.push({
			id: "i" + x.data[i].id,
			value: 10,
			label: x.data[i].name,
			title: x.data[i].countryCode,
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
				const timestampNow = new Date(); //Date.now();
				const timestamp1h = new Date(new Date().setHours(new Date().getHours() - 12));
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
						title: `Last read: ${lastValue}${z.data[i].unit}</br>${timestamp}</br>`
					});
					edgesArrayUpdate.push({
						from: "g" + z.data[i].gatewayId,
						to: "s" + z.data[i].id
					});
					data.nodes.update(nodesArrayUpdate);
					data.edges.update(edgesArrayUpdate);
				});
			};
		});
	});
});

network.on("click", function(params){
	// functionality for popup to show on mouseover
	params.event = "[original event]";
	document.getElementById("eventSpan").innerHTML =
		"<h2>Click event:</h2>" + JSON.stringify(params, null, 4);
	console.log(
		"click event, getNodeAt returns: " + this.getNodeAt(params.pointer.DOM)
	);
});

network.on("hoverNode", function(){
	// functionality for popup to show on mouseover
});
network.on("blurNode", function(){
	// functionality for popup to hide on mouseout
});
