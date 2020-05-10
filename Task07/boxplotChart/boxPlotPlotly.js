"use strict";

const urlBase = 'http://localhost:3000'

// FUNCTIONS TO GET X COLORS FROM X TO X : GRADIENT
function hex (c) {
  let s = "0123456789abcdef";
  let i = parseInt (c);
  if (i == 0 || isNaN (c))
    return "00";
  i = Math.round (Math.min (Math.max (0, i), 255));
  return s.charAt ((i - i % 16) / 16) + s.charAt (i % 16);
}
/* Convert an RGB triplet to a hex string */
function convertToHex (rgb) {
  return hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
}
/* Remove '#' in color hex string */
function trim (s) { return (s.charAt(0) == '#') ? s.substring(1, 7) : s }
/* Convert a hex string to an RGB triplet */
function convertToRGB (hex) {
  let color = [];
  color[0] = parseInt ((trim(hex)).substring (0, 2), 16);
  color[1] = parseInt ((trim(hex)).substring (2, 4), 16);
  color[2] = parseInt ((trim(hex)).substring (4, 6), 16);
  return color;
}
function generateColor(colorStart,colorEnd,colorCount){
	// The beginning of your gradient
	let start = convertToRGB (colorStart);
	// The end of your gradient
	let end   = convertToRGB (colorEnd);
	// The number of colors to compute
	let len = colorCount;
	//Alpha blending amount
	let alpha = 0.0;
	let saida = [];
	for (let i = 0; i < len; i++) {
		var c = [];
		alpha += (1.0/len);
		c[0] = start[0] * alpha + (1 - alpha) * end[0];
		c[1] = start[1] * alpha + (1 - alpha) * end[1];
		c[2] = start[2] * alpha + (1 - alpha) * end[2];
		saida.push(convertToHex (c));
	}
	return saida;
}

function makeSimpleBoxplotSensor(sensorId=1, nameVar="xxx", nameInst="yyy") {
  let timestampNow = Date.now();
  let timestamp30d = timestampNow - (30*24*60*60*1000) // -30 days
  let myURL = urlBase + '/Sensors/'+ sensorId +'/datas?start=' + timestamp30d + '&end=' + timestampNow;
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

      let boxColors = generateColor('#ff1100', '#060e7a', 100);
      // console.log(boxColors);

      const objKeyByDay = Object.keys(byday);

      const minTemp = data.data.reduce((min, p) => p.value < min ? p.value : min, data.data[0].value);
      const maxTemp = data.data.reduce((max, p) => p.value > max ? p.value : max, data.data[0].value);

      for (const i of objKeyByDay){
        let myX2 = [];
        let myY2 = [];
        for(let j=0; j<byday[i].length; j++){
          // let x = new Date(byday[i][j].createdAt - 120*60*1000);
          let x = new Date(byday[i][j].createdAt); //new Date
          // console.log(x);
          let date = x.getDate();
          let month = x.getMonth() + 1;
          let year = x.getFullYear();
          // let hour = x.getHours() + 1;
          // if (hour < 10) {hour = '0' + hour};
          // let xx = new Date(year + '-' + month + '-' + date + ' ' + hour + ':00:00');
          let xx = new Date(year + '-' + month + '-' + date + ' 00:00:00');
          myX2.push(xx);
          myY2.push(byday[i][j].value);
        };
        // console.log(myX2);
        let meanTemp = Math.round(
          myY2.reduce((previous, current) => current += previous) / myY2.length
        );
        // let minTemp = 0;
        // let maxTemp = 30;
        let colNum = Math.round((meanTemp - minTemp)/(maxTemp - minTemp) * 100);
        let traceXY = {
          y: myY2,
          x: myX2,
          type: 'box',
          marker: {color: boxColors[colNum]},//'#FF4136'},
          boxpoints: 'suspectedoutliers'
        };
        myTrace.push(traceXY);
      }
      // console.log("myTrace", myTrace);

      let layout = {
        title: nameVar + ' -' + nameInst + '-',
        yaxis: {
          title: 'temperature by day',
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
      var config = {responsive: true};
      Plotly.newPlot(document.getElementById('simpleBoxplotChart'), myTrace, layout, config);
    } else {
      console.log("no data");
    };
  });
};

let urlListInst = urlBase + "/institutes?page_size=100"
$.getJSON(urlListInst, function(x) {
  var select = document.getElementById("selectInst");
  select.options.length = 0; // vider les options
  select.options[select.options.length] = new Option(">--Please choose an option--<", 0)
  for (let i = 0; i < x.data.length; i++) {
    select.options[select.options.length] = new Option(x.data[i].name, x.data[i].id);
  };
});
$("#selectInst").on('change',function(){
  var selectGate = document.getElementById("selectGate");
  selectGate.options.length = 0;
  selectGate.options[selectGate.options.length] = new Option("---", 0)
  let value = $(this).val();
  let urlListGate = urlBase + "/institutes/" + value;
  $.getJSON(urlListGate, function(x) {
    for (let i = 0; i < x.metadata.link.gateways.length; i++) {
      $.getJSON(x.metadata.link.gateways[i], function(y) {
        selectGate.options[selectGate.options.length] = new Option(y.data.name, y.data.id);
        // console.log(x.data.id);
      });
    };
  });
});
$("#selectGate").on('change',function(){
  var selectSens = document.getElementById("selectSens");
  selectSens.options.length = 0;
  selectSens.options[selectSens.options.length] = new Option("---", null)
  let value = $(this).val();
  // console.log("gatewayId: ", value);
  let urlListSens = urlBase + "/gateways/" + value;
  $.getJSON(urlListSens, function(x) {
    for (let i = 0; i < x.metadata.link.sensors.length; i++) {
      $.getJSON(x.metadata.link.sensors[i], function(y) {
        selectSens.options[selectSens.options.length] = new Option(y.data.name, y.data.id);
        // console.log(y.data.name + ': ' + y.data.id);
      });
    };
  });
});
$("#selectSens").on('change',function(){
  // graphique actuel avec choix du capteur 1
  let sensorId = $(this).val();
  // console.log("sensorId: ", sensorId);
  if (sensorId != null){
    $.getJSON(urlBase + '/Sensors/'+ sensorId, function(len1) {
      let nameVar = len1.data.name + len1.data.unit + " (" + len1.data.model + ")";
      let gatewayId = len1.data.gatewayId;
      $.getJSON(urlBase + '/Gateways/'+ gatewayId, function(len2) {
        let instituteId = len2.data.instituteId;
        $.getJSON(urlBase + '/Institutes/'+ instituteId, function(len3) {
          let nameInst = len3.data.name;
          makeSimpleBoxplotSensor(sensorId, nameVar, nameInst)
        });
      });
    });
  }
});
