!function(t){function e(e){for(var a,d,l=e[0],r=e[1],s=e[2],c=0,p=[];c<l.length;c++)d=l[c],Object.prototype.hasOwnProperty.call(i,d)&&i[d]&&p.push(i[d][0]),i[d]=0;for(a in r)Object.prototype.hasOwnProperty.call(r,a)&&(t[a]=r[a]);for(u&&u(e);p.length;)p.shift()();return o.push.apply(o,s||[]),n()}function n(){for(var t,e=0;e<o.length;e++){for(var n=o[e],a=!0,l=1;l<n.length;l++){var r=n[l];0!==i[r]&&(a=!1)}a&&(o.splice(e--,1),t=d(d.s=n[0]))}return t}var a={},i={4:0},o=[];function d(e){if(a[e])return a[e].exports;var n=a[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,d),n.l=!0,n.exports}d.m=t,d.c=a,d.d=function(t,e,n){d.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},d.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},d.t=function(t,e){if(1&e&&(t=d(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(d.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)d.d(n,a,function(e){return t[e]}.bind(null,a));return n},d.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return d.d(e,"a",e),e},d.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},d.p="";var l=window.webpackJsonp=window.webpackJsonp||[],r=l.push.bind(l);l.push=e,l=l.slice();for(var s=0;s<l.length;s++)e(l[s]);var u=r;o.push([382,0]),n()}({382:function(t,e,n){"use strict";n.r(e);var a=n(2),i=n.n(a),o={angle:0,lineWidth:.5,radiusScale:1,pointer:{length:.6,strokeWidth:.08,color:"#000000"},limitMax:!1,limitMin:!1,colorStart:"#6FADCF",colorStop:"#8FC0DA",strokeColor:"#E0E0E0",generateGradient:!0,highDpiSupport:!0,staticLabels:{font:"10px sans-serif",labels:[0,5,10,25,30,40],color:"#000000",fractionDigits:0},renderTicks:{divisions:4,divWidth:1.1,divLength:.7,divColor:"#333333",subDivisions:3,subLength:.5,subWidth:.6,subColor:"#666666"},staticZones:[{strokeStyle:"#F03E3E",min:0,max:5},{strokeStyle:"#FFDD00",min:5,max:10},{strokeStyle:"#30B32D",min:10,max:25},{strokeStyle:"#FFDD00",min:25,max:30},{strokeStyle:"#F03E3E",min:30,max:40}]},d={angle:0,lineWidth:.5,radiusScale:1,pointer:{length:.6,strokeWidth:.08,color:"#000000"},limitMax:!1,limitMin:!1,colorStart:"#6FADCF",colorStop:"#8FC0DA",strokeColor:"#E0E0E0",generateGradient:!0,highDpiSupport:!0,staticLabels:{font:"10px sans-serif",labels:[0,25,50,75,100],color:"#000000",fractionDigits:0},renderTicks:{divisions:4,divWidth:1.1,divLength:.7,divColor:"#333333",subDivisions:3,subLength:.5,subWidth:.6,subColor:"#666666"}};let l=[],r=[],s=[],u=[],c=[];for(let t=1;t<11;++t)document.getElementById("title"+t).textContent="no data";for(let t=1;t<11;++t)l[t-1]=document.getElementById("gaugeTemp"+t),r[t-1]=new Gauge(l[t-1]).setOptions(o),r[t-1].maxValue=40,r[t-1].setMinValue(0),r[t-1].animationSpeed=32,r[t-1].set(0),s[t-1]=document.getElementById("gaugeRh"+t),u[t-1]=new Gauge(s[t-1]).setOptions(d),u[t-1].maxValue=100,u[t-1].setMinValue(0),u[t-1].animationSpeed=32,u[t-1].set(0);const p=document.getElementById("dashClimateFIDAIICA"),m=document.getElementById("dashTitle");let h=document.createElement("span");h.setAttribute("id","dash_headingTitle"),h.textContent="Dashboard: please wait, data is being loaded...",m.appendChild(h);i.a.getJSON("/institutes/28",(function(t){let e=document.createElement("p"),n=document.createElement("span");n.setAttribute("id","dash_instituteName"),n.textContent=t.data.name+" ";let a=document.createElement("span");a.setAttribute("id","dash_institutesId"),a.textContent=`(id: ${t.data.id}; `;let o=document.createElement("span");o.setAttribute("id","dash_instituteCountryCode"),o.textContent=t.data.countryCode+") ",e.appendChild(n),e.appendChild(a),e.appendChild(o);for(let n=0;n<t.metadata.link.gateways.length;n++){let a=document.createElement("ul");const o=""+t.metadata.link.gateways[n];i.a.getJSON(o,(function(e){let o=document.createElement("li"),d=document.createElement("span");d.setAttribute("id","dash_gateName"),d.textContent=e.data.name+" ",c[n]=e.data.name;let l=document.createElement("span");l.setAttribute("id","dash_gateId"),l.textContent=`(id: ${e.data.id}; `;let s=document.createElement("a");s.setAttribute("id","dash_gateUrl"),s.setAttribute("href",""+t.metadata.link.gateways[n]),s.textContent=t.metadata.link.gateways[n]+")",o.appendChild(d),o.appendChild(l),o.appendChild(s);for(let t=0;t<e.metadata.link.sensors.length;t++){let a=document.createElement("ul");const d=""+e.metadata.link.sensors[t];i.a.getJSON(d,(function(o){let d=document.createElement("li"),l=document.createElement("span");l.setAttribute("id","dash_sensName"),l.textContent=o.data.name+" ";let s=document.createElement("span");s.setAttribute("id","dash_sensDescrp"),s.textContent=o.data.description+" (";let p=document.createElement("span");p.setAttribute("id","dash_sensUnit"),p.textContent=o.data.unit+") ",d.appendChild(l),d.appendChild(s);const m=Date.now(),g=m-36e5,f=`${o.metadata.link.datas}?start=${g}&end=${m}`;i.a.getJSON(f,(function(a){let i="no data",l="";a.data.length>2&&(i=Math.round(10*a.data[0].value)/10,l=a.data[0].createdAt);let s=document.createElement("span");s.setAttribute("id","dash_lastInfo"),s.textContent=""+i;let m=document.createElement("span");m.setAttribute("id","dash_lastInfo"),m.textContent=""+l,d.appendChild(s),d.appendChild(p),d.appendChild(m),"Temperature"==o.data.name?(r[n].set(i),r[n].setTextField(document.getElementById("gaugeTempValue"+(n+1)))):"RH"==o.data.name&&(u[n].set(i),u[n].setTextField(document.getElementById("gaugeRhValue"+(n+1)))),document.getElementById("title"+(n+1)).textContent=c[n],t+1==e.metadata.link.sensors.length&&(h.textContent="Dashboard")})),a.appendChild(d)})),o.appendChild(a)}a.appendChild(o)})),e.appendChild(a)}p.appendChild(e)}))}});