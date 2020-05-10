"use strict";

// Formulaire pour afficher les données d'un capteur
// avec des select boxes : institut puis filtrage
// sur les gateways puis sur les capteurs.

// Problème #1 : la liste des capteurs disponibles est limitée à
// l'affichage dans /gateways/:gatewayId (10), donc la liste est
// incomplète. Même chose pour la liste des gateways et la liste
// des instituts. Dans /controllers/details.js on peut mettre
// props.limit = 30 lignes 12 et 15 pour avoir jusqu'à 30
// capteurs ?

// Problème #2 : il y a un décalage dans les timestamps de deux
// heures (UTC versus paramètres locaux ?).

// Problème #3 : la fonction de moyenne mobile fait une moyenne
// sur un nombre de points plutôt que sur une période de temps
// ce qui posera problème si deux capteurs ont des données à des
// pas de temps différents.

const urlBase = 'http://localhost:3000'

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
          makeSimpleLineSensor(sensorId, nameVar, nameInst)
        });
      });
    });
  }
});

function makeSimpleLineSensor(sensorId=1, nameVar="xxx", nameInst="yyy") {

  let timestampNow = Date.now();
  let timestamp30d = timestampNow - (30*24*60*60*1000) // -30 days
  let myURL = urlBase + '/Sensors/'+ sensorId +'/datas?start=' + timestamp30d + '&end=' + timestampNow;
  // console.log(myURL);
  let myX = [];
  let myY = [];

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

      for (var i=0; i< x.data.length; i++){
        myX.push(new Date(x.data[i].createdAt )) //- 120*60*1000
        myY.push(x.data[i].value) }
      let myTrace = {
        line: {color: '#1a13a8'},
        x: myX,
        y: myY,
        name: 'raw' } //'EGCE'
      let myMATrace = { // trace with moving average
          line: {color: '#cc291b'},
          x: myX,
          y: oneDayMovingAverage.reverse(),
          name: '1d mov. av.' }
      let myLayout = {
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
        title: nameVar + ' -' + nameInst + '-', //'Temperature in °C',
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
      let config = {responsive: true};
      // Plotly.plot(document.getElementById('simpleLineChart'), [myTrace, myMATrace], myLayout);
      Plotly.newPlot(document.getElementById('simpleLineChart'), [myTrace, myMATrace], myLayout, config);
    } else {
      console.log("no data");
    };
  });
};
