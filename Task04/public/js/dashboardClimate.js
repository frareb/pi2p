!function(t){function e(e){for(var a,i,l=e[0],o=e[1],s=e[2],p=0,c=[];p<l.length;p++)i=l[p],Object.prototype.hasOwnProperty.call(d,i)&&d[i]&&c.push(d[i][0]),d[i]=0;for(a in o)Object.prototype.hasOwnProperty.call(o,a)&&(t[a]=o[a]);for(u&&u(e);c.length;)c.shift()();return r.push.apply(r,s||[]),n()}function n(){for(var t,e=0;e<r.length;e++){for(var n=r[e],a=!0,l=1;l<n.length;l++){var o=n[l];0!==d[o]&&(a=!1)}a&&(r.splice(e--,1),t=i(i.s=n[0]))}return t}var a={},d={3:0},r=[];function i(e){if(a[e])return a[e].exports;var n=a[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=t,i.c=a,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)i.d(n,a,function(e){return t[e]}.bind(null,a));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="";var l=window.webpackJsonp=window.webpackJsonp||[],o=l.push.bind(l);l.push=e,l=l.slice();for(var s=0;s<l.length;s++)e(l[s]);var u=o;r.push([345,0]),n()}({345:function(t,e,n){"use strict";n.r(e);var a=n(3),d=n.n(a);const r=document.getElementById("dashClimate"),i=document.getElementById("dashTitle");let l=document.createElement("span");l.setAttribute("id","dash_headingTitle"),l.textContent="Dashboard: please wait, data is being loaded...",i.appendChild(l);d.a.getJSON("/institutes?page_size=1000",(function(t){for(let e=0;e<t.data.length;e++){let n=document.createElement("p"),a=document.createElement("span");a.setAttribute("id","dash_instituteName"),a.textContent=t.data[e].name+" ";let i=document.createElement("span");i.setAttribute("id","dash_institutesId"),i.textContent=`(id: ${t.data[e].id}; `;let o=document.createElement("span");o.setAttribute("id","dash_instituteCountryCode"),o.textContent=t.data[e].countryCode+"; ";let s=document.createElement("a");s.setAttribute("id","dash_instituteUrl"),s.setAttribute("href",""+t.data[e].url),s.textContent=t.data[e].url+")",n.appendChild(a),n.appendChild(i),n.appendChild(o),n.appendChild(s);const u="/institutes/"+t.data[e].id;d.a.getJSON(u,(function(t){for(let e=0;e<t.metadata.link.gateways.length;e++){let a=document.createElement("ul");const r=""+t.metadata.link.gateways[e];d.a.getJSON(r,(function(n){let r=document.createElement("li"),i=document.createElement("span");i.setAttribute("id","dash_gateName"),i.textContent=n.data.name+" ";let o=document.createElement("span");o.setAttribute("id","dash_gateId"),o.textContent=`(id: ${n.data.id}; `;let s=document.createElement("a");s.setAttribute("id","dash_gateUrl"),s.setAttribute("href",""+t.metadata.link.gateways[e]),s.textContent=t.metadata.link.gateways[e]+")",r.appendChild(i),r.appendChild(o),r.appendChild(s);for(let t=0;t<n.metadata.link.sensors.length;t++){let e=document.createElement("ul");const a=""+n.metadata.link.sensors[t];d.a.getJSON(a,(function(a){let r=document.createElement("li"),i=document.createElement("span");i.setAttribute("id","dash_sensName"),i.textContent=a.data.name+" ";let o=document.createElement("span");o.setAttribute("id","dash_sensDescrp"),o.textContent=a.data.description+" (";let s=document.createElement("span");s.setAttribute("id","dash_sensUnit"),s.textContent=a.data.unit+"; ";let u=document.createElement("span");u.setAttribute("id","dash_sensModel"),u.textContent=a.data.model+"); ",r.appendChild(i),r.appendChild(o);const p=Date.now(),c=p-252e5,m=`${a.metadata.link.datas}?start=${c}&end=${p}`;d.a.getJSON(m,(function(e){let a="no data",d="";e.data.length>2&&(a=Math.round(10*e.data[0].value)/10,d=e.data[0].createdAt);let i=document.createElement("span");i.setAttribute("id","dash_lastInfo"),i.textContent=""+a;let o=document.createElement("span");o.setAttribute("id","dash_lastInfo"),o.textContent=""+d,r.appendChild(i),r.appendChild(s),r.appendChild(u),r.appendChild(o),t+1==n.metadata.link.sensors.length&&(l.textContent="Dashboard")})),e.appendChild(r)})),r.appendChild(e)}a.appendChild(r)})),n.appendChild(a)}})),r.appendChild(n)}}))}});