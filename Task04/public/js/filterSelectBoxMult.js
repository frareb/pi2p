!function(t){function e(e){for(var o,s,l=e[0],i=e[1],u=e[2],d=0,p=[];d<l.length;d++)s=l[d],Object.prototype.hasOwnProperty.call(a,s)&&a[s]&&p.push(a[s][0]),a[s]=0;for(o in i)Object.prototype.hasOwnProperty.call(i,o)&&(t[o]=i[o]);for(c&&c(e);p.length;)p.shift()();return r.push.apply(r,u||[]),n()}function n(){for(var t,e=0;e<r.length;e++){for(var n=r[e],o=!0,l=1;l<n.length;l++){var i=n[l];0!==a[i]&&(o=!1)}o&&(r.splice(e--,1),t=s(s.s=n[0]))}return t}var o={},a={6:0},r=[];function s(e){if(o[e])return o[e].exports;var n=o[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=t,s.c=o,s.d=function(t,e,n){s.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},s.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)s.d(n,o,function(e){return t[e]}.bind(null,o));return n},s.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="";var l=window.webpackJsonp=window.webpackJsonp||[],i=l.push.bind(l);l.push=e,l=l.slice();for(var u=0;u<l.length;u++)e(l[u]);var c=i;r.push([340,0,1]),n()}({27:function(t,e,n){"use strict";function o(){let t="#";for(let e=0;e<6;e++)t+="0123456789ABCDEF"[Math.floor(16*Math.random())];return t}function a(t){const e="0123456789abcdef";let n=parseInt(t);return 0==n||isNaN(t)?"00":(n=Math.round(Math.min(Math.max(0,n),255)),e.charAt((n-n%16)/16)+e.charAt(n%16))}function r(t){return"#"==t.charAt(0)?t.substring(1,7):t}function s(t){const e=[];return e[0]=parseInt(r(t).substring(0,2),16),e[1]=parseInt(r(t).substring(2,4),16),e[2]=parseInt(r(t).substring(4,6),16),e}function l(t,e,n){const o=s(t),r=s(e),l=n;let i=0;const u=[];for(let t=0;t<l;t++){const t=[];i+=1/l,t[0]=o[0]*i+(1-i)*r[0],t[1]=o[1]*i+(1-i)*r[1],t[2]=o[2]*i+(1-i)*r[2],u.push(a((c=t)[0])+a(c[1])+a(c[2]))}var c;return u}n.d(e,"b",(function(){return o})),n.d(e,"a",(function(){return l}))},340:function(t,e,n){"use strict";n.r(e);var o=n(27),a=n(3),r=n.n(a),s=n(9),l=n.n(s);const i=document.getElementById("networkWait"),u=(t,e,n)=>n.indexOf(t)===e;r.a.getJSON("/institutes?page_size=100",(function(t){const e=document.getElementById("selectInst");e.options.length=0,e.options[e.options.length]=new Option("",0);for(let n=0;n<t.data.length;n++)e.options[e.options.length]=new Option(t.data[n].name,t.data[n].id)})),r()("#selectInst").on("change",(function(){const t=document.getElementById("selectGate");t.options.length=0,t.options[t.options.length]=new Option("...",0);const e=`/gateways?instituteId=${r()(this).val()}&page_size=100`;r.a.getJSON(e,(function(e){for(let n=0;n<e.data.length;n++)t.options[t.options.length]=new Option(e.data[n].name,e.data[n].id)}))}));let c=[],d="";r()("#selectGate").on("change",(function(){const t=document.getElementById("selectUnit");t.options.length=0,t.options[t.options.length]=new Option("...",null);const e=r()(this).val();d=`/sensors?gatewayId=${e}&page_size=100`,r.a.getJSON(d,(function(e){const n=[];for(let t=0;t<e.data.length;t++)n.push(e.data[t].name);c=n.filter(u);for(let e in n.filter(u))t.options[t.options.length]=new Option(c[e],e)}))})),r()("#selectUnit").on("change",(function(){i.textContent=" Please wait, data is being loaded...";const t=r()(this).val(),e=c[t],n=[],a=[];r.a.getJSON(d,(function(t){for(let o=0;o<t.data.length;o++)t.data[o].name==e&&(n.push(t.data[o].id),a.push(""+t.data[o].description));const s=Date.now(),u=s-2592e6,c=[];for(let t=0;t<n.length;t++)c.push(r.a.ajax(`/Sensors/${n[t]}/datas?start=${u}&end=${s}`));const d=[];r.a.when.apply(0,c).then((function(){for(let t=0;t<arguments.length;t++){let e=[],n=[];if("success"==arguments[t][1])for(let o=0;o<arguments[t][0].data.length;o++)e.push(new Date(arguments[t][0].data[o].createdAt)),n.push(arguments[t][0].data[o].value);else if("success"!==arguments[t]&arguments[t].hasOwnProperty("data"))for(let o=0;o<arguments[t].data.length;o++)e.push(new Date(arguments[t].data[o].createdAt)),n.push(arguments[t].data[o].value);d.push({line:{color:Object(o.b)()},x:e,y:n,name:a[t]})}})).done((function(){d.length>0?d[0].x.length>4?function(t,e,n=""){i.textContent=" Please wait, the chart is being created...";const o=new Date;let a=new Date;a=new Date(a.setMonth(a.getMonth()-1));const r={autosize:!0,margin:{l:30,r:20,b:0,t:80,pad:4},showlegend:!0,legend:{x:0,xanchor:"left",y:1},title:""+e,xaxis:{automargin:!0,autorange:!0,rangeselector:{buttons:[{count:1,label:"24h",step:"day",stepmode:"backward"},{count:2,label:"2d",step:"day",stepmode:"backward"},{count:7,label:"1w",step:"day",stepmode:"backward"},{step:"all",label:"30d"}]},rangeslider:{range:[`${a.getFullYear()}-${a.getMonth()+1}-${a.getDate()}`,`${o.getFullYear()}-${o.getMonth()+1}-${o.getDate()}`]},type:"date"},yaxis:{automargin:!0,hoverformat:".1f"}};let s=document.getElementById("myChart");l.a.newPlot(s,t,r,{responsive:!0,editable:!0}),s.on("plotly_afterplot",(function(){i.textContent=""}))}(d,e):i.textContent="No or not enough data":i.textContent="No data"}))}))}))}});