"use strict";

// functions related to colors
// import { * } from './colors';

const urlBase = '.';

// functions related to colors
import { generateColor } from './colors.js';

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
  const selectUnit = document.getElementById("selectUnit");
  selectUnit.options.length = 0;
  selectUnit.options[selectUnit.options.length] = new Option("...", null)
  const value = $(this).val();
  // console.log("gatewayId: ", value);
  const urlListSens = `${urlBase}/sensors?gatewayId=${value}&page_size=100`;
  $.getJSON(urlListSens, function(x) {
    const listSensName = []; // faire une liste unique des grandeurs ou alors des types de capteurs
    for (let i = 0; i < x.data.length; i++) {
      listSensName.push(x.data[i].name);
    };
    // console.log("listSensName", listSensName.filter(unique));
    for(let index in listSensName.filter(unique)) {
      selectUnit.options[selectUnit.options.length] = new Option(listSensName.filter(unique)[index], index)
    };
  });
});
$("#selectSens").on('change',function(){
  const varName = $(this).val();
  // OBJ : graphique avec trace pour tous les capteurs + legende
  // recuperer le gatewayId
  // iterer sur les capteurs
  // si capteur name == variable
  // si graphique ajouter trace
  // sinon faire graphique
});
