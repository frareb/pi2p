!function(e){function t(t){for(var a,i,l=t[0],s=t[1],c=t[2],d=0,u=[];d<l.length;d++)i=l[d],Object.prototype.hasOwnProperty.call(r,i)&&r[i]&&u.push(r[i][0]),r[i]=0;for(a in s)Object.prototype.hasOwnProperty.call(s,a)&&(e[a]=s[a]);for(p&&p(t);u.length;)u.shift()();return o.push.apply(o,c||[]),n()}function n(){for(var e,t=0;t<o.length;t++){for(var n=o[t],a=!0,l=1;l<n.length;l++){var s=n[l];0!==r[s]&&(a=!1)}a&&(o.splice(t--,1),e=i(i.s=n[0]))}return e}var a={},r={5:0},o=[];function i(t){if(a[t])return a[t].exports;var n=a[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=e,i.c=a,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)i.d(n,a,function(t){return e[t]}.bind(null,a));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="";var l=window.webpackJsonp=window.webpackJsonp||[],s=l.push.bind(l);l.push=t,l=l.slice();for(var c=0;c<l.length;c++)t(l[c]);var p=s;o.push([171,0,1]),n()}({103:function(e,t,n){"use strict";var a=n(32),r=n(45),o=n(21),i=n(29).hovertemplateAttrs,l=n(11).extendFlat,s=a.marker,c=s.line;e.exports={y:{valType:"data_array",editType:"calc+clearAxisTypes"},x:{valType:"data_array",editType:"calc+clearAxisTypes"},x0:{valType:"any",editType:"calc+clearAxisTypes"},y0:{valType:"any",editType:"calc+clearAxisTypes"},dx:{valType:"number",editType:"calc"},dy:{valType:"number",editType:"calc"},name:{valType:"string",editType:"calc+clearAxisTypes"},q1:{valType:"data_array",editType:"calc+clearAxisTypes"},median:{valType:"data_array",editType:"calc+clearAxisTypes"},q3:{valType:"data_array",editType:"calc+clearAxisTypes"},lowerfence:{valType:"data_array",editType:"calc"},upperfence:{valType:"data_array",editType:"calc"},notched:{valType:"boolean",editType:"calc"},notchwidth:{valType:"number",min:0,max:.5,dflt:.25,editType:"calc"},notchspan:{valType:"data_array",editType:"calc"},boxpoints:{valType:"enumerated",values:["all","outliers","suspectedoutliers",!1],editType:"calc"},jitter:{valType:"number",min:0,max:1,editType:"calc"},pointpos:{valType:"number",min:-2,max:2,editType:"calc"},boxmean:{valType:"enumerated",values:[!0,"sd",!1],editType:"calc"},mean:{valType:"data_array",editType:"calc"},sd:{valType:"data_array",editType:"calc"},orientation:{valType:"enumerated",values:["v","h"],editType:"calc+clearAxisTypes"},quartilemethod:{valType:"enumerated",values:["linear","exclusive","inclusive"],dflt:"linear",editType:"calc"},width:{valType:"number",min:0,dflt:0,editType:"calc"},marker:{outliercolor:{valType:"color",dflt:"rgba(0, 0, 0, 0)",editType:"style"},symbol:l({},s.symbol,{arrayOk:!1,editType:"plot"}),opacity:l({},s.opacity,{arrayOk:!1,dflt:1,editType:"style"}),size:l({},s.size,{arrayOk:!1,editType:"calc"}),color:l({},s.color,{arrayOk:!1,editType:"style"}),line:{color:l({},c.color,{arrayOk:!1,dflt:o.defaultLine,editType:"style"}),width:l({},c.width,{arrayOk:!1,dflt:0,editType:"style"}),outliercolor:{valType:"color",editType:"style"},outlierwidth:{valType:"number",min:0,dflt:1,editType:"style"},editType:"style"},editType:"plot"},line:{color:{valType:"color",editType:"style"},width:{valType:"number",min:0,dflt:2,editType:"style"},editType:"plot"},fillcolor:a.fillcolor,whiskerwidth:{valType:"number",min:0,max:1,dflt:.5,editType:"calc"},offsetgroup:r.offsetgroup,alignmentgroup:r.alignmentgroup,selected:{marker:a.selected.marker,editType:"style"},unselected:{marker:a.unselected.marker,editType:"style"},text:l({},a.text,{}),hovertext:l({},a.hovertext,{}),hovertemplate:i({}),hoveron:{valType:"flaglist",flags:["boxes","points"],dflt:"boxes+points",editType:"style"}}},117:function(e,t,n){"use strict";e.exports={boxmode:{valType:"enumerated",values:["group","overlay"],dflt:"overlay",editType:"calc"},boxgap:{valType:"number",min:0,max:1,dflt:.3,editType:"calc"},boxgroupgap:{valType:"number",min:0,max:1,dflt:.3,editType:"calc"}}},118:function(e,t,n){"use strict";var a=n(0),r=n(1),o=n(3),i=n(54).handleGroupingDefaults,l=n(77),s=n(103);function c(e,t,n,o){function i(e){var t=0;return e&&e.length&&(t+=1,a.isArrayOrTypedArray(e[0])&&e[0].length&&(t+=1)),t}function c(t){return a.validate(e[t],s[t])}var p,d=n("y"),u=n("x");if("box"===t.type){var f=n("q1"),m=n("median"),h=n("q3");t._hasPreCompStats=f&&f.length&&m&&m.length&&h&&h.length,p=Math.min(a.minRowLength(f),a.minRowLength(m),a.minRowLength(h))}var y,v,x=i(d),g=i(u),b=x&&a.minRowLength(d),T=g&&a.minRowLength(u);if(t._hasPreCompStats)switch(String(g)+String(x)){case"00":var w=c("x0")||c("dx");y=(c("y0")||c("dy"))&&!w?"h":"v",v=p;break;case"10":y="v",v=Math.min(p,T);break;case"20":y="h",v=Math.min(p,u.length);break;case"01":y="h",v=Math.min(p,b);break;case"02":y="v",v=Math.min(p,d.length);break;case"12":y="v",v=Math.min(p,T,d.length);break;case"21":y="h",v=Math.min(p,u.length,b);break;case"11":v=0;break;case"22":var k,M=!1;for(k=0;k<u.length;k++)if("category"===l(u[k])){M=!0;break}if(M)y="v",v=Math.min(p,T,d.length);else{for(k=0;k<d.length;k++)if("category"===l(d[k])){M=!0;break}M?(y="h",v=Math.min(p,u.length,b)):(y="v",v=Math.min(p,T,d.length))}}else x>0?(y="v",v=g>0?Math.min(T,b):Math.min(b)):g>0?(y="h",v=Math.min(T)):v=0;if(v){t._length=v;var q=n("orientation",y);t._hasPreCompStats?"v"===q&&0===g?(n("x0",0),n("dx",1)):"h"===q&&0===x&&(n("y0",0),n("dy",1)):"v"===q&&0===g?n("x0"):"h"===q&&0===x&&n("y0"),r.getComponentMethod("calendars","handleTraceDefaults")(e,t,["x","y"],o)}else t.visible=!1}function p(e,t,n,r){var o=r.prefix,i=a.coerce2(e,t,s,"marker.outliercolor"),l=n("marker.line.outliercolor"),c="outliers";t._hasPreCompStats?c="all":(i||l)&&(c="suspectedoutliers");var p=n(o+"points",c);p?(n("jitter","all"===p?.3:0),n("pointpos","all"===p?-1.5:0),n("marker.symbol"),n("marker.opacity"),n("marker.size"),n("marker.color",t.line.color),n("marker.line.color"),n("marker.line.width"),"suspectedoutliers"===p&&(n("marker.line.outliercolor",t.marker.color),n("marker.line.outlierwidth")),n("selected.marker.color"),n("unselected.marker.color"),n("selected.marker.size"),n("unselected.marker.size"),n("text"),n("hovertext")):delete t.marker;var d=n("hoveron");"all"!==d&&-1===d.indexOf("points")||n("hovertemplate"),a.coerceSelectionMarkerOpacity(t,n)}e.exports={supplyDefaults:function(e,t,n,r){function i(n,r){return a.coerce(e,t,s,n,r)}if(c(e,t,i,r),!1!==t.visible){var l=t._hasPreCompStats;l&&(i("lowerfence"),i("upperfence")),i("line.color",(e.marker||{}).color||n),i("line.width"),i("fillcolor",o.addOpacity(t.line.color,.5));var d=!1;if(l){var u=i("mean"),f=i("sd");u&&u.length&&(d=!0,f&&f.length&&(d="sd"))}i("boxmean",d),i("whiskerwidth"),i("width"),i("quartilemethod");var m=!1;if(l){var h=i("notchspan");h&&h.length&&(m=!0)}else a.validate(e.notchwidth,s.notchwidth)&&(m=!0);i("notched",m)&&i("notchwidth"),p(e,t,i,{prefix:"box"})}},crossTraceDefaults:function(e,t){var n,r;function o(e){return a.coerce(r._input,r,s,e)}for(var l=0;l<e.length;l++){var c=(r=e[l]).type;"box"!==c&&"violin"!==c||(n=r._input,"group"===t[c+"mode"]&&i(n,r,t,o))}},handleSampleDefaults:c,handlePointsDefaults:p}},123:function(e,t,n){"use strict";var a=n(2),r=n(3),o=n(6);e.exports={style:function(e,t,n){var i=n||a.select(e).selectAll("g.trace.boxes");i.style("opacity",(function(e){return e[0].trace.opacity})),i.each((function(t){var n=a.select(this),i=t[0].trace,l=i.line.width;function s(e,t,n,a){e.style("stroke-width",t+"px").call(r.stroke,n).call(r.fill,a)}var c=n.selectAll("path.box");if("candlestick"===i.type)c.each((function(e){if(!e.empty){var t=a.select(this),n=i[e.dir];s(t,n.line.width,n.line.color,n.fillcolor),t.style("opacity",i.selectedpoints&&!e.selected?.3:1)}}));else{s(c,l,i.line.color,i.fillcolor),n.selectAll("path.mean").style({"stroke-width":l,"stroke-dasharray":2*l+"px,"+l+"px"}).call(r.stroke,i.line.color);var p=n.selectAll("path.point");o.pointStyle(p,i,e)}}))},styleOnSelect:function(e,t,n){var a=t[0].trace,r=n.selectAll("path.point");a.selectedpoints?o.selectedPointStyle(r,a):o.pointStyle(r,a,e)}}},169:function(e,t,n){"use strict";e.exports=n(172)},171:function(e,t,n){"use strict";n.r(t);var a=n(28),r=n(4),o=n.n(r),i=n(169),l=n.n(i),s=n(10),c=n.n(s);const p=document.getElementById("networkWait");c.a.register([l.a]);function d(e,t){null!=e&&o.a.getJSON("/Sensors/"+e,(function(n){const a=`${n.data.name}${n.data.unit} (${n.data.model})`,r=n.data.gatewayId;o.a.getJSON("/Gateways/"+r,(function(n){const r=n.data.instituteId,i=n.data.name;o.a.getJSON("/Institutes/"+r,(function(n){const r=n.data.name;p.textContent=" Please wait, the chart is being created...",t(e,a,r,i)}))}))}))}function u(){let e=null;switch(document.getElementById("selectChart").value){case"line":e=f;break;case"boxplot":e=m;break;default:e=f}return e}function f(e=1,t,n,a){const r=Date.now(),o=`/Sensors/${e}/datas?start=${r-2592e6}&end=${r}`,i=[],l=[];c.a.d3.json(o,(function(e,r){if(r.data.length>1){for(let e=0;e<r.data.length;e++)i.push(new Date(r.data[e].createdAt)),l.push(r.data[e].value);const e={line:{color:"#17BECF"},x:i,y:l,name:"raw"},o={autosize:!0,margin:{l:30,r:20,b:0,t:80,pad:4},showlegend:!0,legend:{x:0,xanchor:"left",y:1},title:`${t} -${n} ; ${a}-`,xaxis:{automargin:!0,autorange:!0,rangeselector:{buttons:[{count:1,label:"24h",step:"day",stepmode:"backward"},{count:2,label:"2d",step:"day",stepmode:"backward"},{count:7,label:"1w",step:"day",stepmode:"backward"},{step:"all",label:"30d"}]},rangeslider:{range:[i[0],i[i.length-1]]},type:"date"},yaxis:{automargin:!0,hoverformat:".1f"}},s={responsive:!0,editable:!0,modeBarButtonsToAdd:[{name:"Download data",icon:c.a.Icons.disk,click:function(e){const t=r.data,n=Object.keys(t[0]),a=function(e,t){return null===t?"":t};let o=t.map((function(e){return n.map((function(t){return JSON.stringify(e[t],a)})).join(",")}));o.unshift(n.join(",")),o=o.join("\r\n");const i=new Blob([o],{type:"text/plain"});let l=document.createElement("a");const s=URL.createObjectURL(i);l.href=s,l.download="data.csv",document.body.appendChild(l),l.click(),URL.revokeObjectURL(s)}}]};let d=document.getElementById("myChart");c.a.newPlot(d,[e],o,s),d.on("plotly_afterplot",(function(){p.textContent=""}))}else console.log("no data"),p.textContent="No data"}))}function m(e=1,t,n,r){const o=Date.now(),i="/Sensors/"+e+"/datas?start="+(o-2592e6)+"&end="+o;let l=[];c.a.d3.json(i,(function(e,o){if(o.data.length>1){let e={};o.data.map((function(t,n,a){let r=new Date(t.createdAt);r=Math.floor(r.getTime()/864e5),e[r]=e[r]||[],e[r].push({value:t.value,createdAt:864e5*r})}));const i=Object(a.a)("#ff1100","#060e7a",100),s=Object.keys(e),p=o.data.reduce((e,t)=>t.value<e?t.value:e,o.data[0].value),d=o.data.reduce((e,t)=>t.value>e?t.value:e,o.data[0].value);for(const t of s){const n=[],a=[];for(let r=0;r<e[t].length;r++){const o=new Date(e[t][r].createdAt);o.setHours(0),o.setMinutes(0),o.setSeconds(0),n.push(o),a.push(e[t][r].value)}const r=Math.round(a.reduce((e,t)=>t+e)/a.length),o={y:a,x:n,type:"box",marker:{color:i[Math.round((r-p)/(d-p)*100)]},boxpoints:"suspectedoutliers"};l.push(o)}const u={title:t+" -"+n+" ; "+r+"-",yaxis:{zeroline:!1,hoverformat:".1f"},showlegend:!1,margin:{l:50,r:5,b:50,t:27,pad:4}},f={responsive:!0,editable:!0,modeBarButtonsToAdd:[{name:"Download data",icon:c.a.Icons.disk,click:function(e){const t=o.data,n=Object.keys(t[0]),a=function(e,t){return null===t?"":t};let r=t.map((function(e){return n.map((function(t){return JSON.stringify(e[t],a)})).join(",")}));r.unshift(n.join(",")),r=r.join("\r\n");const i=new Blob([r],{type:"text/plain"});let l=document.createElement("a");const s=URL.createObjectURL(i);l.href=s,l.download="data.csv",document.body.appendChild(l),l.click(),URL.revokeObjectURL(s)}}]};c.a.newPlot(document.getElementById("myChart"),l,u,f)}else console.log("no data"),p.textContent="No data"}))}o.a.getJSON("/institutes?page_size=100",(function(e){const t=document.getElementById("selectInst");t.options.length=0,t.options[t.options.length]=new Option("",0);for(let n=0;n<e.data.length;n++)t.options[t.options.length]=new Option(e.data[n].name,e.data[n].id)})),o()("#selectInst").on("change",(function(){const e=document.getElementById("selectGate");e.options.length=0,e.options[e.options.length]=new Option("...",0);const t=`/gateways?instituteId=${o()(this).val()}&page_size=100`;o.a.getJSON(t,(function(t){for(let n=0;n<t.data.length;n++)e.options[e.options.length]=new Option(t.data[n].name,t.data[n].id)}))})),o()("#selectGate").on("change",(function(){const e=document.getElementById("selectSens");e.options.length=0,e.options[e.options.length]=new Option("...",null);const t=`/sensors?gatewayId=${o()(this).val()}&page_size=100`;o.a.getJSON(t,(function(t){for(let n=0;n<t.data.length;n++)e.options[e.options.length]=new Option(`${t.data[n].name} ${t.data[n].description}`,t.data[n].id)}))})),o()("#selectSens").on("change",(function(){const e=o()(this).val(),t=u();p.textContent=" Please wait, data is being loaded...",d(e,t)})),o()("#selectChart").on("change",(function(){const e=u(),t=document.getElementById("selectSens").value;""!=t&&d(t,e),p.textContent=""}))},172:function(e,t,n){"use strict";e.exports={attributes:n(103),layoutAttributes:n(117),supplyDefaults:n(118).supplyDefaults,crossTraceDefaults:n(118).crossTraceDefaults,supplyLayoutDefaults:n(195).supplyLayoutDefaults,calc:n(196),crossTraceCalc:n(200).crossTraceCalc,plot:n(201).plot,style:n(123).style,styleOnSelect:n(123).styleOnSelect,hoverPoints:n(202).hoverPoints,eventData:n(216),selectPoints:n(217),moduleType:"trace",name:"box",basePlotModule:n(57),categories:["cartesian","svg","symbols","oriented","box-violin","showLegend","boxLayout","zoomScale"],meta:{}}},195:function(e,t,n){"use strict";var a=n(1),r=n(0),o=n(117);function i(e,t,n,r,o){for(var i=o+"Layout",l=!1,s=0;s<n.length;s++){var c=n[s];if(a.traceIs(c,i)){l=!0;break}}l&&(r(o+"mode"),r(o+"gap"),r(o+"groupgap"))}e.exports={supplyLayoutDefaults:function(e,t,n){i(0,0,n,(function(n,a){return r.coerce(e,t,o,n,a)}),"box")},_supply:i}},196:function(e,t,n){"use strict";var a=n(5),r=n(7),o=n(0),i=n(12).BADNUM,l=o._;e.exports=function(e,t){var n,s,v,x,g,b,T=e._fullLayout,w=r.getFromId(e,t.xaxis||"x"),k=r.getFromId(e,t.yaxis||"y"),M=[],q="violin"===t.type?"_numViolins":"_numBoxes";"h"===t.orientation?(v=w,x="x",g=k,b="y"):(v=k,x="y",g=w,b="x");var O,P,A,_,L,S,j=function(e,t,n,r){var i,l=t+"0"in e,s="d"+t in e;if(t in e||l&&s)return n.makeCalcdata(e,t);i=l?e[t+"0"]:"name"in e&&("category"===n.type||a(e.name)&&-1!==["linear","log"].indexOf(n.type)||o.isDateTime(e.name)&&"date"===n.type)?e.name:r;for(var c="multicategory"===n.type?n.r2c_just_indices(i):n.d2c(i,0,e[t+"calendar"]),p=e._length,d=new Array(p),u=0;u<p;u++)d[u]=c;return d}(t,b,g,T[q]),D=o.distinctVals(j),B=D.vals,C=D.minDiff/2,I="all"===(t.boxpoints||t.points)?o.identity:function(e){return e.v<O.lf||e.v>O.uf};if(t._hasPreCompStats){var V=t[x],E=function(e){return v.d2c((t[e]||[])[n])},H=1/0,R=-1/0;for(n=0;n<t._length;n++){var N=j[n];if(a(N)){if((O={}).pos=O[b]=N,O.q1=E("q1"),O.med=E("median"),O.q3=E("q3"),P=[],V&&o.isArrayOrTypedArray(V[n]))for(s=0;s<V[n].length;s++)(S=v.d2c(V[n][s]))!==i&&(c(L={v:S,i:[n,s]},t,[n,s]),P.push(L));if(O.pts=P.sort(p),_=(A=O[x]=P.map(d)).length,O.med!==i&&O.q1!==i&&O.q3!==i&&O.med>=O.q1&&O.q3>=O.med){var z=E("lowerfence");O.lf=z!==i&&z<=O.q1?z:u(O,A,_);var $=E("upperfence");O.uf=$!==i&&$>=O.q3?$:f(O,A,_);var J=E("mean");O.mean=J!==i?J:_?o.mean(A,_):(O.q1+O.q3)/2;var U=E("sd");O.sd=J!==i&&U>=0?U:_?o.stdev(A,_,O.mean):O.q3-O.q1,O.lo=m(O),O.uo=h(O);var F=E("notchspan");F=F!==i&&F>0?F:y(O,_),O.ln=O.med-F,O.un=O.med+F;var G=O.lf,Z=O.uf;t.boxpoints&&A.length&&(G=Math.min(G,A[0]),Z=Math.max(Z,A[_-1])),t.notched&&(G=Math.min(G,O.ln),Z=Math.max(Z,O.un)),O.min=G,O.max=Z}else{var W;o.warn(["Invalid input - make sure that q1 <= median <= q3","q1 = "+O.q1,"median = "+O.med,"q3 = "+O.q3].join("\n")),W=O.med!==i?O.med:O.q1!==i?O.q3!==i?(O.q1+O.q3)/2:O.q1:O.q3!==i?O.q3:0,O.med=W,O.q1=O.q3=W,O.lf=O.uf=W,O.mean=O.sd=W,O.ln=O.un=W,O.min=O.max=W}H=Math.min(H,O.min),R=Math.max(R,O.max),O.pts2=P.filter(I),M.push(O)}}t._extremes[v._id]=r.findExtremes(v,[H,R],{padded:!0})}else{var K=v.makeCalcdata(t,x),Q=function(e,t){for(var n=e.length,a=new Array(n+1),r=0;r<n;r++)a[r]=e[r]-t;return a[n]=e[n-1]+t,a}(B,C),X=B.length,Y=function(e){for(var t=new Array(e),n=0;n<e;n++)t[n]=[];return t}(X);for(n=0;n<t._length;n++)if(S=K[n],a(S)){var ee=o.findBin(j[n],Q);ee>=0&&ee<X&&(c(L={v:S,i:n},t,n),Y[ee].push(L))}var te=1/0,ne=-1/0,ae=t.quartilemethod,re="exclusive"===ae,oe="inclusive"===ae;for(n=0;n<X;n++)if(Y[n].length>0){var ie,le;if((O={}).pos=O[b]=B[n],P=O.pts=Y[n].sort(p),_=(A=O[x]=P.map(d)).length,O.min=A[0],O.max=A[_-1],O.mean=o.mean(A,_),O.sd=o.stdev(A,_,O.mean),O.med=o.interp(A,.5),_%2&&(re||oe))re?(ie=A.slice(0,_/2),le=A.slice(_/2+1)):oe&&(ie=A.slice(0,_/2+1),le=A.slice(_/2)),O.q1=o.interp(ie,.5),O.q3=o.interp(le,.5);else O.q1=o.interp(A,.25),O.q3=o.interp(A,.75);O.lf=u(O,A,_),O.uf=f(O,A,_),O.lo=m(O),O.uo=h(O);var se=y(O,_);O.ln=O.med-se,O.un=O.med+se,te=Math.min(te,O.ln),ne=Math.max(ne,O.un),O.pts2=P.filter(I),M.push(O)}t._extremes[v._id]=r.findExtremes(v,t.notched?K.concat([te,ne]):K,{padded:!0})}return function(e,t){if(o.isArrayOrTypedArray(t.selectedpoints))for(var n=0;n<e.length;n++){for(var a=e[n].pts||[],r={},i=0;i<a.length;i++)r[a[i].i]=i;o.tagSelected(a,t,r)}}(M,t),M.length>0?(M[0].t={num:T[q],dPos:C,posLetter:b,valLetter:x,labels:{med:l(e,"median:"),min:l(e,"min:"),q1:l(e,"q1:"),q3:l(e,"q3:"),max:l(e,"max:"),mean:"sd"===t.boxmean?l(e,"mean ± σ:"):l(e,"mean:"),lf:l(e,"lower fence:"),uf:l(e,"upper fence:")}},T[q]++,M):[{t:{empty:!0}}]};var s={text:"tx",hovertext:"htx"};function c(e,t,n){for(var a in s)o.isArrayOrTypedArray(t[a])&&(Array.isArray(n)?o.isArrayOrTypedArray(t[a][n[0]])&&(e[s[a]]=t[a][n[0]][n[1]]):e[s[a]]=t[a][n])}function p(e,t){return e.v-t.v}function d(e){return e.v}function u(e,t,n){return 0===n?e.q1:Math.min(e.q1,t[Math.min(o.findBin(2.5*e.q1-1.5*e.q3,t,!0)+1,n-1)])}function f(e,t,n){return 0===n?e.q3:Math.max(e.q3,t[Math.max(o.findBin(2.5*e.q3-1.5*e.q1,t),0)])}function m(e){return 4*e.q1-3*e.q3}function h(e){return 4*e.q3-3*e.q1}function y(e,t){return 0===t?0:1.57*(e.q3-e.q1)/Math.sqrt(t)}},200:function(e,t,n){"use strict";var a=n(7),r=n(0),o=n(13).getAxisGroup,i=["v","h"];function l(e,t,n,i){var l,s,c,p=t.calcdata,d=t._fullLayout,u=i._id,f=u.charAt(0),m=[],h=0;for(l=0;l<n.length;l++)for(c=p[n[l]],s=0;s<c.length;s++)m.push(i.c2l(c[s].pos,!0)),h+=(c[s].pts2||[]).length;if(m.length){var y=r.distinctVals(m),v=y.minDiff/2;a.minDtick(i,y.minDiff,y.vals[0],!0);var x=d["violin"===e?"_numViolins":"_numBoxes"],g="group"===d[e+"mode"]&&x>1,b=1-d[e+"gap"],T=1-d[e+"groupgap"];for(l=0;l<n.length;l++){var w,k,M,q,O,P,A=(c=p[n[l]])[0].trace,_=c[0].t,L=A.width,S=A.side;if(L)w=k=q=L/2,M=0;else if(w=v,g){var j=o(d,i._id)+A.orientation,D=(d._alignmentOpts[j]||{})[A.alignmentgroup]||{},B=Object.keys(D.offsetGroups||{}).length,C=B||x;k=w*b*T/C,M=2*w*(((B?A._offsetIndex:_.num)+.5)/C-.5)*b,q=w*b/C}else k=w*b*T,M=0,q=w;_.dPos=w,_.bPos=M,_.bdPos=k,_.wHover=q;var I,V,E,H,R,N,z=M+k,$=Boolean(L);if("positive"===S?(O=w*(L?1:.5),I=z,P=I=M):"negative"===S?(O=I=M,P=w*(L?1:.5),V=z):(O=P=w,I=V=z),(A.boxpoints||A.points)&&h>0){var J=A.pointpos,U=A.jitter,F=A.marker.size/2,G=0;J+U>=0&&((G=z*(J+U))>O?($=!0,R=F,E=G):G>I&&(R=F,E=O)),G<=O&&(E=O);var Z=0;J-U<=0&&((Z=-z*(J-U))>P?($=!0,N=F,H=Z):Z>V&&(N=F,H=P)),Z<=P&&(H=P)}else E=O,H=P;var W=new Array(c.length);for(s=0;s<c.length;s++)W[s]=c[s].pos;A._extremes[u]=a.findExtremes(i,W,{padded:$,vpadminus:H,vpadplus:E,vpadLinearized:!0,ppadminus:{x:N,y:R}[f],ppadplus:{x:R,y:N}[f]})}}}e.exports={crossTraceCalc:function(e,t){for(var n=e.calcdata,a=t.xaxis,r=t.yaxis,o=0;o<i.length;o++){for(var s=i[o],c="h"===s?r:a,p=[],d=0;d<n.length;d++){var u=n[d],f=u[0].t,m=u[0].trace;!0!==m.visible||"box"!==m.type&&"candlestick"!==m.type||f.empty||(m.orientation||"v")!==s||m.xaxis!==a._id||m.yaxis!==r._id||p.push(d)}l("box",e,p,c)}},setPositionOffset:l}},201:function(e,t,n){"use strict";var a=n(2),r=n(0),o=n(6);function i(e,t,n,o){var i,l,s="h"===n.orientation,c=t.val,p=t.pos,d=!!p.rangebreaks,u=o.bPos,f=o.wdPos||0,m=o.bPosPxOffset||0,h=n.whiskerwidth||0,y=n.notched||!1,v=y?1-2*n.notchwidth:1;Array.isArray(o.bdPos)?(i=o.bdPos[0],l=o.bdPos[1]):(i=o.bdPos,l=o.bdPos);var x=e.selectAll("path.box").data("violin"!==n.type||n.box.visible?r.identity:[]);x.enter().append("path").style("vector-effect","non-scaling-stroke").attr("class","box"),x.exit().remove(),x.each((function(e){if(e.empty)return"M0,0Z";var t=p.c2l(e.pos+u,!0),o=p.l2p(t-i)+m,x=p.l2p(t+l)+m,g=d?(o+x)/2:p.l2p(t)+m,b=n.whiskerwidth,T=d?o*b+(1-b)*g:p.l2p(t-f)+m,w=d?x*b+(1-b)*g:p.l2p(t+f)+m,k=p.l2p(t-i*v)+m,M=p.l2p(t+l*v)+m,q=c.c2p(e.q1,!0),O=c.c2p(e.q3,!0),P=r.constrain(c.c2p(e.med,!0),Math.min(q,O)+1,Math.max(q,O)-1),A=void 0===e.lf||!1===n.boxpoints,_=c.c2p(A?e.min:e.lf,!0),L=c.c2p(A?e.max:e.uf,!0),S=c.c2p(e.ln,!0),j=c.c2p(e.un,!0);s?a.select(this).attr("d","M"+P+","+k+"V"+M+"M"+q+","+o+"V"+x+(y?"H"+S+"L"+P+","+M+"L"+j+","+x:"")+"H"+O+"V"+o+(y?"H"+j+"L"+P+","+k+"L"+S+","+o:"")+"ZM"+q+","+g+"H"+_+"M"+O+","+g+"H"+L+(0===h?"":"M"+_+","+T+"V"+w+"M"+L+","+T+"V"+w)):a.select(this).attr("d","M"+k+","+P+"H"+M+"M"+o+","+q+"H"+x+(y?"V"+S+"L"+M+","+P+"L"+x+","+j:"")+"V"+O+"H"+o+(y?"V"+j+"L"+k+","+P+"L"+o+","+S:"")+"ZM"+g+","+q+"V"+_+"M"+g+","+O+"V"+L+(0===h?"":"M"+T+","+_+"H"+w+"M"+T+","+L+"H"+w))}))}function l(e,t,n,a){var i=t.x,l=t.y,s=a.bdPos,c=a.bPos,p=n.boxpoints||n.points;r.seedPseudoRandom();var d=e.selectAll("g.points").data(p?function(e){return e.forEach((function(e){e.t=a,e.trace=n})),e}:[]);d.enter().append("g").attr("class","points"),d.exit().remove();var u=d.selectAll("path").data((function(e){var t,a,o=e.pts2,i=Math.max((e.max-e.min)/10,e.q3-e.q1),l=1e-9*i,d=.01*i,u=[],f=0;if(n.jitter){if(0===i)for(f=1,u=new Array(o.length),t=0;t<o.length;t++)u[t]=1;else for(t=0;t<o.length;t++){var m=Math.max(0,t-5),h=o[m].v,y=Math.min(o.length-1,t+5),v=o[y].v;"all"!==p&&(o[t].v<e.lf?v=Math.min(v,e.lf):h=Math.max(h,e.uf));var x=Math.sqrt(d*(y-m)/(v-h+l))||0;x=r.constrain(Math.abs(x),0,1),u.push(x),f=Math.max(x,f)}a=2*n.jitter/(f||1)}for(t=0;t<o.length;t++){var g=o[t],b=g.v,T=n.jitter?a*u[t]*(r.pseudoRandom()-.5):0,w=e.pos+c+s*(n.pointpos+T);"h"===n.orientation?(g.y=w,g.x=b):(g.x=w,g.y=b),"suspectedoutliers"===p&&b<e.uo&&b>e.lo&&(g.so=!0)}return o}));u.enter().append("path").classed("point",!0),u.exit().remove(),u.call(o.translatePoints,i,l)}function s(e,t,n,o){var i,l,s=t.val,c=t.pos,p=!!c.rangebreaks,d=o.bPos,u=o.bPosPxOffset||0,f=n.boxmean||(n.meanline||{}).visible;Array.isArray(o.bdPos)?(i=o.bdPos[0],l=o.bdPos[1]):(i=o.bdPos,l=o.bdPos);var m=e.selectAll("path.mean").data("box"===n.type&&n.boxmean||"violin"===n.type&&n.box.visible&&n.meanline.visible?r.identity:[]);m.enter().append("path").attr("class","mean").style({fill:"none","vector-effect":"non-scaling-stroke"}),m.exit().remove(),m.each((function(e){var t=c.c2l(e.pos+d,!0),r=c.l2p(t-i)+u,o=c.l2p(t+l)+u,m=p?(r+o)/2:c.l2p(t)+u,h=s.c2p(e.mean,!0),y=s.c2p(e.mean-e.sd,!0),v=s.c2p(e.mean+e.sd,!0);"h"===n.orientation?a.select(this).attr("d","M"+h+","+r+"V"+o+("sd"===f?"m0,0L"+y+","+m+"L"+h+","+r+"L"+v+","+m+"Z":"")):a.select(this).attr("d","M"+r+","+h+"H"+o+("sd"===f?"m0,0L"+m+","+y+"L"+r+","+h+"L"+m+","+v+"Z":""))}))}e.exports={plot:function(e,t,n,o){var c=t.xaxis,p=t.yaxis;r.makeTraceGroups(o,n,"trace boxes").each((function(e){var t,n,r=a.select(this),o=e[0],d=o.t,u=o.trace;(d.wdPos=d.bdPos*u.whiskerwidth,!0!==u.visible||d.empty)?r.remove():("h"===u.orientation?(t=p,n=c):(t=c,n=p),i(r,{pos:t,val:n},u,d),l(r,{x:c,y:p},u,d),s(r,{pos:t,val:n},u,d))}))},plotBoxAndWhiskers:i,plotPoints:l,plotBoxMean:s}},202:function(e,t,n){"use strict";var a=n(7),r=n(0),o=n(23),i=n(3),l=r.fillText;function s(e,t,n,l){var s,c,p,d,u,f,m,h,y,v,x,g,b,T,w=e.cd,k=e.xa,M=e.ya,q=w[0].trace,O=w[0].t,P="violin"===q.type,A=[],_=O.bdPos,L=O.wHover,S=function(e){return p.c2l(e.pos)+O.bPos-p.c2l(f)};P&&"both"!==q.side?("positive"===q.side&&(y=function(e){var t=S(e);return o.inbox(t,t+L,v)},g=_,b=0),"negative"===q.side&&(y=function(e){var t=S(e);return o.inbox(t-L,t,v)},g=0,b=_)):(y=function(e){var t=S(e);return o.inbox(t-L,t+L,v)},g=b=_),T=P?function(e){return o.inbox(e.span[0]-u,e.span[1]-u,v)}:function(e){return o.inbox(e.min-u,e.max-u,v)},"h"===q.orientation?(u=t,f=n,m=T,h=y,s="y",p=M,c="x",d=k):(u=n,f=t,m=y,h=T,s="x",p=k,c="y",d=M);var j=Math.min(1,_/Math.abs(p.r2c(p.range[1])-p.r2c(p.range[0])));function D(e){return(m(e)+h(e))/2}v=e.maxHoverDistance-j,x=e.maxSpikeDistance-j;var B=o.getDistanceFunction(l,m,h,D);if(o.getClosest(w,B,e),!1===e.index)return[];var C=w[e.index],I=q.line.color,V=(q.marker||{}).color;i.opacity(I)&&q.line.width?e.color=I:i.opacity(V)&&q.boxpoints?e.color=V:e.color=q.fillcolor,e[s+"0"]=p.c2p(C.pos+O.bPos-b,!0),e[s+"1"]=p.c2p(C.pos+O.bPos+g,!0),e[s+"LabelVal"]=C.pos;var E=s+"Spike";e.spikeDistance=D(C)*x/v,e[E]=p.c2p(C.pos,!0);var H={},R=["med","q1","q3","min","max"];(q.boxmean||(q.meanline||{}).visible)&&R.push("mean"),(q.boxpoints||q.points)&&R.push("lf","uf");for(var N=0;N<R.length;N++){var z=R[N];if(z in C&&!(C[z]in H)){H[C[z]]=!0;var $=C[z],J=d.c2p($,!0),U=r.extendFlat({},e);U.attr=z,U[c+"0"]=U[c+"1"]=J,U[c+"LabelVal"]=$,U[c+"Label"]=(O.labels?O.labels[z]+" ":"")+a.hoverLabelText(d,$),U.hoverOnBox=!0,"mean"===z&&"sd"in C&&"sd"===q.boxmean&&(U[c+"err"]=C.sd),e.name="",e.spikeDistance=void 0,e[E]=void 0,U.hovertemplate=!1,A.push(U)}}return A}function c(e,t,n){for(var a,i,s,c=e.cd,p=e.xa,d=e.ya,u=c[0].trace,f=p.c2p(t),m=d.c2p(n),h=o.quadrature((function(e){var t=Math.max(3,e.mrc||0);return Math.max(Math.abs(p.c2p(e.x)-f)-t,1-3/t)}),(function(e){var t=Math.max(3,e.mrc||0);return Math.max(Math.abs(d.c2p(e.y)-m)-t,1-3/t)})),y=!1,v=0;v<c.length;v++){i=c[v];for(var x=0;x<(i.pts||[]).length;x++){var g=h(s=i.pts[x]);g<=e.distance&&(e.distance=g,y=[v,x])}}if(!y)return!1;s=(i=c[y[0]]).pts[y[1]];var b,T=p.c2p(s.x,!0),w=d.c2p(s.y,!0),k=s.mrc||1;return a=r.extendFlat({},e,{index:s.i,color:(u.marker||{}).color,name:u.name,x0:T-k,x1:T+k,y0:w-k,y1:w+k,spikeDistance:e.distance,hovertemplate:u.hovertemplate}),"h"===u.orientation?(b=d,a.xLabelVal=s.x,a.yLabelVal=i.pos):(b=p,a.xLabelVal=i.pos,a.yLabelVal=s.y),a[b._id.charAt(0)+"Spike"]=b.c2p(i.pos,!0),l(s,u,a),a}e.exports={hoverPoints:function(e,t,n,a){var r,o=e.cd[0].trace.hoveron,i=[];return-1!==o.indexOf("boxes")&&(i=i.concat(s(e,t,n,a))),-1!==o.indexOf("points")&&(r=c(e,t,n)),"closest"===a?r?[r]:i:r?(i.push(r),i):i},hoverOnBoxes:s,hoverOnPoints:c}},216:function(e,t,n){"use strict";e.exports=function(e,t){return t.hoverOnBox&&(e.hoverOnBox=t.hoverOnBox),"xVal"in t&&(e.x=t.xVal),"yVal"in t&&(e.y=t.yVal),t.xa&&(e.xaxis=t.xa),t.ya&&(e.yaxis=t.ya),e}},217:function(e,t,n){"use strict";e.exports=function(e,t){var n,a,r=e.cd,o=e.xaxis,i=e.yaxis,l=[];if(!1===t)for(n=0;n<r.length;n++)for(a=0;a<(r[n].pts||[]).length;a++)r[n].pts[a].selected=0;else for(n=0;n<r.length;n++)for(a=0;a<(r[n].pts||[]).length;a++){var s=r[n].pts[a],c=o.c2p(s.x),p=i.c2p(s.y);t.contains([c,p],null,s.i,e)?(l.push({pointNumber:s.i,x:o.c2d(s.x),y:i.c2d(s.y)}),s.selected=1):s.selected=0}return l}},28:function(e,t,n){"use strict";function a(){let e="#";for(let t=0;t<6;t++)e+="0123456789ABCDEF"[Math.floor(16*Math.random())];return e}function r(e){const t="0123456789abcdef";let n=parseInt(e);return 0==n||isNaN(e)?"00":(n=Math.round(Math.min(Math.max(0,n),255)),t.charAt((n-n%16)/16)+t.charAt(n%16))}function o(e){return"#"==e.charAt(0)?e.substring(1,7):e}function i(e){const t=[];return t[0]=parseInt(o(e).substring(0,2),16),t[1]=parseInt(o(e).substring(2,4),16),t[2]=parseInt(o(e).substring(4,6),16),t}function l(e,t,n){const a=i(e),o=i(t),l=n;let s=0;const c=[];for(let e=0;e<l;e++){const e=[];s+=1/l,e[0]=a[0]*s+(1-s)*o[0],e[1]=a[1]*s+(1-s)*o[1],e[2]=a[2]*s+(1-s)*o[2],c.push(r((p=e)[0])+r(p[1])+r(p[2]))}var p;return c}n.d(t,"b",(function(){return a})),n.d(t,"a",(function(){return l}))}});