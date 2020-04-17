"use strict";

let myURL = 'http://pi2p.site/api/temp';
let myX = [];
let myY = [];
let myTrace = [];

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


Plotly.d3.json(myURL, function(error, data) {
  let byday={};
  function groupday(value, index, array)
  {
      let d = new Date(value['timestamp']);
      d = Math.floor(d.getTime()/(1000*60*60*24)); // *24
      byday[d]=byday[d]||[];
      byday[d].push(value);
  }
  data.map(groupday);
  // console.log(byday);

  let boxColors = generateColor('#ff1100', '#060e7a', 100);
  // console.log(boxColors);

  const objKeyByDay = Object.keys(byday);

  for (const i of objKeyByDay){
    let myX2 = [];
    let myY2 = [];
    for(let j=0; j<byday[i].length; j++){
      let x = new Date(byday[i][j].timestamp - 120*60*1000);
      let date = x.getDate();
      let month = x.getMonth() + 1;
      let year = x.getFullYear();
      // let hour = x.getHours() + 1;
      // if (hour < 10) {hour = '0' + hour};
      // let xx = new Date(year + '-' + month + '-' + date + ' ' + hour + ':00:00');
      let xx = new Date(year + '-' + month + '-' + date);
      myX2.push(xx);
      myY2.push(byday[i][j].sensor);
    };
    let meanTemp = Math.round(
      myY2.reduce((previous, current) => current += previous) / myY2.length
    );
    let minTemp = -10;
    let maxTemp = 35;
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

  var layout = {
    yaxis: {
      title: 'temperature by day',
      zeroline: false
    },
    showlegend:false
  };

  Plotly.newPlot('boxplot01', myTrace, layout);
});
