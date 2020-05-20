"use strict";

const urlBase = '.';

// functions related to colors
import { generateColor } from './colors.js';
import { getRandomColor } from './colors.js';

// functions tools
const unique = (value, index, self) => {
  return self.indexOf(value) === index
}

const urlListSensors = `${urlBase}/sensors?page_size=1000`;
let listSensNameFilter = [];
let urlListSens = '';

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

$("#selectVar").on('change',function(){
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
  const mySensorIds = [];
  for (let i = 0; i < mySensorIndex.length; i++) {
    mySensorIds.push(sensorIds[mySensorIndex[i]]);
  }
  // console.log(mySensorIds);
  for (let i = 0; i < mySensorIds.length; i++) {
    let myLab = "";

    $.getJSON(`${urlBase}/Sensors/${mySensorIds[i]}`, function(x) {
      const urlTargetGate = x.metadata.link.gateway.replace("gateway", "gateways") // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      $.getJSON(urlTargetGate, function(y) {
        myLab = `${myLab}${y.data.name}`;
        const urlTargetInst = y.metadata.link.institute.replace("institute", "institutes") // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        $.getJSON(urlTargetInst, function(z) {
          myLab = `${myLab} (${z.data.name})`;

          if (i == 0){
            makeSimpleLineSensor(mySensorIds[i], varName, false, myLab)
          } else {
            makeSimpleLineSensor(mySensorIds[i], varName, true, myLab)
          }

        });
      });
    });

  };
});

function makeSimpleLineSensor(sensorId=1, nameVar, add=false, lab="") {

  const timestampNow = Date.now();
  const timestamp30d = timestampNow - (30*24*60*60*1000) // -30 days
  const myURL = `${urlBase}/Sensors/${sensorId}/datas?start=${timestamp30d}&end=${timestampNow}`;
  //console.log(myURL);
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
          xanchor: 'left',
          y: 1
        },
        title: `${nameVar}`,
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
      if (add == false){
        const myTrace = { // trace with raw data
          line: {color: '#17BECF'},
          x: myX,
          y: myY,
          name: lab }
        Plotly.newPlot(document.getElementById('myChart'), [myTrace], myLayout, config);
      } else {
        const myTrace = { // trace with raw data
          line: {color: getRandomColor()},
          x: myX,
          y: myY,
          name: lab }
        Plotly.addTraces(document.getElementById('myChart'), [myTrace]);
      }
    } else {
      console.log("no data");
    };
  });


};
