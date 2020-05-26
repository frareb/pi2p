"use strict";

// functions related to colors
import { generateColor } from './colors.js';

// Formulaire pour afficher les données d'un capteur
// avec des select boxes : institut puis filtrage
// sur les gateways puis sur les capteurs.
// Problème : la fonction de moyenne mobile fait une moyenne
// sur un nombre de points plutôt que sur une période de temps
// ce qui posera problème si deux capteurs ont des données à des
// pas de temps différents.

const urlBase = ''; //'http://localhost:3000'

const urlListInst = `${urlBase}/institutes?page_size=100`;
$.getJSON(urlListInst, function(x) {
	const select = document.getElementById("selectInst");
	select.options.length = 0; // vider les options
	select.options[select.options.length] = new Option("", 0)
	for (let i = 0; i < x.data.length; i++) {
		select.options[select.options.length] = new Option(x.data[i].name, x.data[i].id);
	};
});
$("#selectInst").on('change',function(){
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
$("#selectGate").on('change',function(){
	const selectSens = document.getElementById("selectSens");
	selectSens.options.length = 0;
	selectSens.options[selectSens.options.length] = new Option("...", null)
	const value = $(this).val();
	// console.log("gatewayId: ", value);
	const urlListSens = `${urlBase}/sensors?gatewayId=${value}&page_size=100`;
	$.getJSON(urlListSens, function(x) {
		for (let i = 0; i < x.data.length; i++) {
			selectSens.options[selectSens.options.length] = new Option(`${x.data[i].name} ${x.data[i].description}`, x.data[i].id);
		};
	});
});
$("#selectSens").on('change',function(){
	const sensorId = $(this).val();
	const makeGraph = getChartChoice();
	askAPIandMakegraph(sensorId, makeGraph)
});
$("#selectChart").on('change',function(){
	const makeGraph = getChartChoice();
	// console.log(makeGraph);
	const sensorId = document.getElementById("selectSens").value;
	// console.log(sensorId);
	if (sensorId != ""){
		askAPIandMakegraph(sensorId, makeGraph)
	}
});

function askAPIandMakegraph(sensorId, makeGraph){
	if (sensorId != null){
		$.getJSON(`${urlBase}/Sensors/${sensorId}`, function(len1) {
			const nameVar = `${len1.data.name}${len1.data.unit} (${len1.data.model})`;
			const gatewayId = len1.data.gatewayId;
			$.getJSON(`${urlBase}/Gateways/${gatewayId}`, function(len2) {
				const instituteId = len2.data.instituteId;
				const nameGateway = len2.data.name;
				$.getJSON(`${urlBase}/Institutes/${instituteId}`, function(len3) {
					const nameInst = len3.data.name;
					makeGraph(sensorId, nameVar, nameInst, nameGateway)
				});
			});
		});
	}
};

function getChartChoice(){
	const selectChart = document.getElementById("selectChart").value;
	let makeGraph = null;
	switch (selectChart){
		case 'line':
			makeGraph = makeSimpleLineSensorWithMA;
			break;
		case 'boxplot':
			makeGraph = makeSimpleBoxplotSensor;
			break;
		default:
			makeGraph = makeSimpleLineSensorWithMA;
			break;
	}
	return makeGraph;
}

function makeSimpleLineSensorWithMA(sensorId=1, nameVar, nameInst, nameGateway) {
	const timestampNow = Date.now();
	const timestamp30d = timestampNow - (30*24*60*60*1000); // -30 days

	const myURL = `${urlBase}/Sensors/${sensorId}/datas?start=${timestamp30d}&end=${timestampNow}`;
	// console.log(myURL);
	const myX = [];
	const myY = [];

	Plotly.d3.json(myURL, function(error, x) {
		if (x.data.length > 1){
			// Mo. Av. modified from: https://stackoverflow.com/questions/60211628/moving-average-of-time-series-objects-in-array
			const sortDates = (xxx) => [].slice.call(xxx).sort((a, b) => new Date(a.createdAt) - new Date (b.createdAt));
			const getAverage = (data) => [].slice.call(data).reduce((acc, val) => acc + val.value, 0) / data.length;
			const computeMovingAverage = (data, period) => {
				const movingAverages = [];
				const sortedData = sortDates(data);
				// if the period is greater than the length of the dataset
				// then return the average of the whole dataset
				if (period > sortedData.length) {
					return getAverage(data);
				}
				for (let x = 0; x + period - 1 < sortedData.length; x += 1) {
					movingAverages.push(getAverage(sortedData.slice(x, x + period)))
				}
				return movingAverages;
			}
			const oneDayMovingAverage = computeMovingAverage(x.data, 60*24);
			// ici 60*24 est une approximation car il y a un peu moins de
			// une mesure par minute, et il peut y avoir des trous dans la
			// série temporelle...

			for (let i = 0; i < x.data.length; i++){
				myX.push(new Date(x.data[i].createdAt )) //- 120*60*1000
				myY.push(x.data[i].value) }
			const myTrace = { // trace with raw data
				line: {color: '#17BECF'},
				x: myX,
				y: myY,
				name: 'raw' }
			const myMATrace = { // trace with moving average
				line: {color: '#cc291b'},
				x: myX,
				y: oneDayMovingAverage.reverse(),
				name: '1d mov. av.' }
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
					xanchor: 'left',
					y: 1
				},
				title: `${nameVar} -${nameInst} ; ${nameGateway}-`,
				xaxis: {
					automargin: true,
					autorange: true,
					rangeselector: { buttons: [
						{
							count: 1,
							label: '24h',
							step: 'day',
							stepmode: 'backward'
						},
						{
							count: 2,
							label: '2d',
							step: 'day',
							stepmode: 'backward'
						},
						{
							count: 7,
							label: '1w',
							step: 'day',
							stepmode: 'backward'
						},
						{
							step: 'all',
							label: '30d'
						}
					]},
					rangeslider: {range: [myX[0], myX[myX.length - 1]]},
					type: 'date'
				},
				yaxis: {
					automargin: true,
					hoverformat: '.1f'
				}
			}
			const config = {
				responsive: true,
				editable: true,
				modeBarButtonsToAdd: [{
					name: 'Download data',
					icon: Plotly.Icons.disk,
					click: function(gd) {
						const json = x.data;
						const fields = Object.keys(json[0])
						const replacer = function(key, value) { return value === null ? '' : value }
						let csv = json.map(function(row){
							return fields.map(function(fieldName){
								return JSON.stringify(row[fieldName], replacer)
							}).join(',')
						})
						csv.unshift(fields.join(',')) // add header column
						csv = csv.join('\r\n');
						const text = csv;

						const blob = new Blob([text], {type: 'text/plain'});
						let a = document.createElement('a');
						const object_URL = URL.createObjectURL(blob);
						a.href = object_URL;
						a.download = 'data.csv';
						document.body.appendChild(a);
						a.click();
						URL.revokeObjectURL(object_URL);
					}
				}]
			}
			Plotly.newPlot(document.getElementById('myChart'), [myTrace, myMATrace], myLayout, config);
		} else {
			console.log("no data");
		};
	});
};

function makeSimpleBoxplotSensor(sensorId=1, nameVar, nameInst, nameGateway) {
	const timestampNow = Date.now();
	const timestamp30d = timestampNow - (30*24*60*60*1000); // -30 days

	const myURL = urlBase + '/Sensors/'+ sensorId +'/datas?start=' + timestamp30d + '&end=' + timestampNow;
	let myX = [];
	let myY = [];
	let myTrace = [];
	Plotly.d3.json(myURL, function(error, data) {
		if (data.data.length > 1){
			let byday={};
			function groupday(x, index, array)
			{
					let d = new Date(x['createdAt']);
					d = Math.floor(d.getTime()/(1000*60*60*24)); // *24
					byday[d]=byday[d]||[];
					byday[d].push({value:x['value'], createdAt:d*(1000*60*60*24)}); // x['createdAt']
			}
			data.data.map(groupday); // old PR : data.map(groupday)
			// console.log(byday);
			// let txx = new Date(byday['18348'][1]['createdAt']);
			// console.log( new Date(Math.floor(txx.getTime()/(1000*60*60*24)) * (1000*60*60*24)) );

			const boxColors = generateColor('#ff1100', '#060e7a', 100);
			// console.log(boxColors);

			const objKeyByDay = Object.keys(byday);

			const minTemp = data.data.reduce((min, p) => p.value < min ? p.value : min, data.data[0].value);
			const maxTemp = data.data.reduce((max, p) => p.value > max ? p.value : max, data.data[0].value);

			for (const keyDay of objKeyByDay){
				const myX2 = [];
				const myY2 = [];
				for(let j = 0; j < byday[keyDay].length; j++){
					const x = new Date(byday[keyDay][j].createdAt);
					x.setHours(0);
					x.setMinutes(0);
					x.setSeconds(0);
					// let date = x.getDate();
					// let month = x.getMonth() + 1;
					// let year = x.getFullYear();
							// let hour = x.getHours() + 1;
							// if (hour < 10) {hour = '0' + hour};
							// let xx = new Date(year + '-' + month + '-' + date + ' ' + hour + ':00:00');
					// let xx = new Date(year + '-' + month + '-' + date + ' 00:00:00');
					// myX2.push(xx);
					myX2.push(x);
					myY2.push(byday[keyDay][j].value);
				};
				const meanTemp = Math.round(
					myY2.reduce((previous, current) => current += previous) / myY2.length
				);
				const colNum = Math.round((meanTemp - minTemp)/(maxTemp - minTemp) * 100);
				const traceXY = {
					y: myY2,
					x: myX2,
					type: 'box',
					marker: {color: boxColors[colNum]},
					boxpoints: 'suspectedoutliers'
				};
				myTrace.push(traceXY);
			}
			// console.log("myTrace", myTrace);

			const layout = {
				title: nameVar + ' -' + nameInst + ' ; ' + nameGateway + '-',
				yaxis: {
					// title: 'temperature by day',
					zeroline: false,
					hoverformat: '.1f'
				},
				showlegend:false,
				margin: {
					l: 50,
					r: 5,
					b: 50,
					t: 27,
					pad: 4
				}
			};

		const config = {
			responsive: true,
			editable: true,
			modeBarButtonsToAdd: [{
				name: 'Download data',
				icon: Plotly.Icons.disk,
				click: function(gd) {
					const json = data.data;
					const fields = Object.keys(json[0])
					const replacer = function(key, value) { return value === null ? '' : value }
					let csv = json.map(function(row){
						return fields.map(function(fieldName){
							return JSON.stringify(row[fieldName], replacer)
						}).join(',')
					})
					csv.unshift(fields.join(',')) // add header
					csv = csv.join('\r\n');
					const text = csv;
					const blob = new Blob([text], {type: 'text/plain'});
					let a = document.createElement('a');
					const object_URL = URL.createObjectURL(blob);
					a.href = object_URL;
					a.download = 'data.csv';
					document.body.appendChild(a);
					a.click();
					URL.revokeObjectURL(object_URL);
				}
			}]
		}

			Plotly.newPlot(document.getElementById('myChart'), myTrace, layout, config);
		} else {
			console.log("no data");
		};
	});
};



// A basculer sur un fichier à part colors.js
//
// // FUNCTIONS TO GET X COLORS FROM X TO X : GRADIENT
// function hex (c) {
//	 const s = "0123456789abcdef";
//	 let i = parseInt (c);
//	 if (i == 0 || isNaN (c))
//		 return "00";
//	 i = Math.round (Math.min (Math.max (0, i), 255));
//	 return s.charAt ((i - i % 16) / 16) + s.charAt (i % 16);
// }
// // Convert an RGB triplet to a hex string
// function convertToHex (rgb) {
//	 return hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
// }
// // Remove '#' in color hex string
// function trim (s) { return (s.charAt(0) == '#') ? s.substring(1, 7) : s }
// // Convert a hex string to an RGB triplet
// function convertToRGB (hex) {
//	 const color = [];
//	 color[0] = parseInt ((trim(hex)).substring (0, 2), 16);
//	 color[1] = parseInt ((trim(hex)).substring (2, 4), 16);
//	 color[2] = parseInt ((trim(hex)).substring (4, 6), 16);
//	 return color;
// }
// function generateColor(colorStart,colorEnd,colorCount){
//	 // The beginning of your gradient
//	 const start = convertToRGB (colorStart);
//	 // The end of your gradient
//	 const end = convertToRGB (colorEnd);
//	 // The number of colors to compute
//	 const len = colorCount;
//	 // Alpha blending amount
//	 let alpha = 0.0;
//	 const saida = [];
//	 for (let i = 0; i < len; i++) {
//		 const c = [];
//		 alpha += (1.0/len);
//		 c[0] = start[0] * alpha + (1 - alpha) * end[0];
//		 c[1] = start[1] * alpha + (1 - alpha) * end[1];
//		 c[2] = start[2] * alpha + (1 - alpha) * end[2];
//		 saida.push(convertToHex (c));
//	 }
//	 return saida;
// }
