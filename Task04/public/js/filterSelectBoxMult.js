!function(t){function n(n){for(var o,s,i=n[0],l=n[1],c=n[2],d=0,p=[];d<i.length;d++)s=i[d],Object.prototype.hasOwnProperty.call(a,s)&&a[s]&&p.push(a[s][0]),a[s]=0;for(o in l)Object.prototype.hasOwnProperty.call(l,o)&&(t[o]=l[o]);for(u&&u(n);p.length;)p.shift()();return r.push.apply(r,c||[]),e()}function e(){for(var t,n=0;n<r.length;n++){for(var e=r[n],o=!0,i=1;i<e.length;i++){var l=e[i];0!==a[l]&&(o=!1)}o&&(r.splice(n--,1),t=s(s.s=e[0]))}return t}var o={},a={6:0},r=[];function s(n){if(o[n])return o[n].exports;var e=o[n]={i:n,l:!1,exports:{}};return t[n].call(e.exports,e,e.exports,s),e.l=!0,e.exports}s.m=t,s.c=o,s.d=function(t,n,e){s.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:e})},s.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,n){if(1&n&&(t=s(t)),8&n)return t;if(4&n&&"object"==typeof t&&t&&t.__esModule)return t;var e=Object.create(null);if(s.r(e),Object.defineProperty(e,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var o in t)s.d(e,o,function(n){return t[n]}.bind(null,o));return e},s.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return s.d(n,"a",n),n},s.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},s.p="";var i=window.webpackJsonp=window.webpackJsonp||[],l=i.push.bind(i);i.push=n,i=i.slice();for(var c=0;c<i.length;c++)n(i[c]);var u=l;r.push([340,0,1]),e()}({28:function(t,n,e){"use strict";function o(){let t="#";for(let n=0;n<6;n++)t+="0123456789ABCDEF"[Math.floor(16*Math.random())];return t}function a(t){const n="0123456789abcdef";let e=parseInt(t);return 0==e||isNaN(t)?"00":(e=Math.round(Math.min(Math.max(0,e),255)),n.charAt((e-e%16)/16)+n.charAt(e%16))}function r(t){return"#"==t.charAt(0)?t.substring(1,7):t}function s(t){const n=[];return n[0]=parseInt(r(t).substring(0,2),16),n[1]=parseInt(r(t).substring(2,4),16),n[2]=parseInt(r(t).substring(4,6),16),n}function i(t,n,e){const o=s(t),r=s(n),i=e;let l=0;const c=[];for(let t=0;t<i;t++){const t=[];l+=1/i,t[0]=o[0]*l+(1-l)*r[0],t[1]=o[1]*l+(1-l)*r[1],t[2]=o[2]*l+(1-l)*r[2],c.push(a((u=t)[0])+a(u[1])+a(u[2]))}var u;return c}e.d(n,"b",(function(){return o})),e.d(n,"a",(function(){return i}))},340:function(t,n,e){"use strict";e.r(n);var o=e(28),a=e(4),r=e.n(a),s=e(10),i=e.n(s);const l=(t,n,e)=>e.indexOf(t)===n;r.a.getJSON("/institutes?page_size=100",(function(t){const n=document.getElementById("selectInst");n.options.length=0,n.options[n.options.length]=new Option("",0);for(let e=0;e<t.data.length;e++)n.options[n.options.length]=new Option(t.data[e].name,t.data[e].id)})),r()("#selectInst").on("change",(function(){const t=document.getElementById("selectGate");t.options.length=0,t.options[t.options.length]=new Option("...",0);const n=`/gateways?instituteId=${r()(this).val()}&page_size=100`;r.a.getJSON(n,(function(n){for(let e=0;e<n.data.length;e++)t.options[t.options.length]=new Option(n.data[e].name,n.data[e].id)}))}));let c=[],u="";function d(t=1,n,e=!1,a=""){const r=Date.now(),s=`/Sensors/${t}/datas?start=${r-2592e6}&end=${r}`,l=[],c=[];i.a.d3.json(s,(function(t,r){if(r.data.length>1){for(let t=0;t<r.data.length;t++)l.push(new Date(r.data[t].createdAt)),c.push(r.data[t].value);const t={autosize:!0,margin:{l:30,r:20,b:0,t:80,pad:4},showlegend:!0,legend:{x:0,xanchor:"left",y:1},title:""+n,xaxis:{automargin:!0,autorange:!0,rangeselector:{buttons:[{count:1,label:"24h",step:"day",stepmode:"backward"},{count:2,label:"2d",step:"day",stepmode:"backward"},{count:7,label:"1w",step:"day",stepmode:"backward"},{step:"all",label:"30d"}]},rangeslider:{range:[l[0],l[l.length-1]]},type:"date"},yaxis:{automargin:!0,hoverformat:".1f"}},s={responsive:!0,editable:!0,modeBarButtonsToAdd:[{name:"Download data",icon:i.a.Icons.disk,click:function(t){const n=r.data,e=Object.keys(n[0]),o=function(t,n){return null===n?"":n};let a=n.map((function(t){return e.map((function(n){return JSON.stringify(t[n],o)})).join(",")}));a.unshift(e.join(",")),a=a.join("\r\n");const s=new Blob([a],{type:"text/plain"});let i=document.createElement("a");const l=URL.createObjectURL(s);i.href=l,i.download="data.csv",document.body.appendChild(i),i.click(),URL.revokeObjectURL(l)}}]};if(0==e){const n={line:{color:"#17BECF"},x:l,y:c,name:a};i.a.newPlot(document.getElementById("myChart"),[n],t,s)}else{const t={line:{color:Object(o.b)()},x:l,y:c,name:a};i.a.addTraces(document.getElementById("myChart"),[t])}}else console.log("no data")}))}r()("#selectGate").on("change",(function(){const t=document.getElementById("selectUnit");t.options.length=0,t.options[t.options.length]=new Option("...",null);const n=r()(this).val();u=`/sensors?gatewayId=${n}&page_size=100`,r.a.getJSON(u,(function(n){const e=[];for(let t=0;t<n.data.length;t++)e.push(n.data[t].name);c=e.filter(l);for(let n in e.filter(l))t.options[t.options.length]=new Option(c[n],n)}))})),r()("#selectUnit").on("change",(function(){const t=r()(this).val(),n=c[t],e=[],o=[];r.a.getJSON(u,(function(t){for(let a=0;a<t.data.length;a++)t.data[a].name==n&&(e.push(t.data[a].id),o.push(`${t.data[a].name} ${t.data[a].description}`));for(let t=0;t<e.length;t++)d(e[t],n,0!=t,o[t])}))}))}});