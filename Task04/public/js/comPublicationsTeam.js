!function(t){function e(e){for(var a,i,l=e[0],d=e[1],p=e[2],s=0,c=[];s<l.length;s++)i=l[s],Object.prototype.hasOwnProperty.call(r,i)&&r[i]&&c.push(r[i][0]),r[i]=0;for(a in d)Object.prototype.hasOwnProperty.call(d,a)&&(t[a]=d[a]);for(u&&u(e);c.length;)c.shift()();return o.push.apply(o,p||[]),n()}function n(){for(var t,e=0;e<o.length;e++){for(var n=o[e],a=!0,l=1;l<n.length;l++){var d=n[l];0!==r[d]&&(a=!1)}a&&(o.splice(e--,1),t=i(i.s=n[0]))}return t}var a={},r={2:0},o=[];function i(e){if(a[e])return a[e].exports;var n=a[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=t,i.c=a,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)i.d(n,a,function(e){return t[e]}.bind(null,a));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="";var l=window.webpackJsonp=window.webpackJsonp||[],d=l.push.bind(l);l.push=e,l=l.slice();for(var p=0;p<l.length;p++)e(l[p]);var u=d;o.push([377,0]),n()}({377:function(t,e,n){"use strict";n.r(e);var a=n(2),r=n.n(a);function o(t,e){return r.a.getJSON(e,(function(e){const n=document.getElementById(t);e.sort((function(t,e){return e.meta.parsedDate-t.meta.parsedDate}));for(let t=0;t<e.length;t++){let r=document.createElement("p"),o=document.createElement("span");o.setAttribute("id","bib_title"),o.textContent=e[t].data.title+". ";let i=document.createElement("a");i.setAttribute("id","bib_doi"),i.setAttribute("href","https://dx.doi.org/"+e[t].data.DOI),i.textContent=`[${e[t].data.DOI}]`;let l=document.createElement("span");l.setAttribute("id","bib_author");for(var a=0;a<e[t].data.creators.length;a++)"author"==e[t].data.creators[a].creatorType&&(l.textContent=0==a?`${e[t].data.creators[a].firstName.replace(/[^A-Z]/g,"")} ${e[t].data.creators[a].lastName}`:`${l.textContent}, ${e[t].data.creators[a].firstName.replace(/[^A-Z]/g,"")} ${e[t].data.creators[a].lastName}`);let d=document.createElement("span");d.setAttribute("id","bib_date"),d.textContent=` (${e[t].meta.parsedDate}) `;let p=document.createElement("span");p.setAttribute("id","bib_publititle"),p.textContent=e[t].data.publicationTitle+" ";let u=document.createElement("span");u.setAttribute("id","bib_volume"),""!=e[t].data.volume&&(u.textContent=""+e[t].data.volume);let s=document.createElement("span");s.setAttribute("id","bib_issue"),""!=e[t].data.issue&&(s.textContent=`(${e[t].data.issue})`);let c=document.createElement("span");c.setAttribute("id","bib_pages"),""!=e[t].data.pages?c.textContent=`: ${e[t].data.pages}. `:c.textContent=". ";let b=document.createElement("span");b.setAttribute("id","bib_sep"),b.textContent=" ";let f=document.createElement("BUTTON");f.setAttribute("id","bib_btn"),f.innerHTML="ABSTRACT",f.addEventListener("click",(function(){"none"==m.style.display?m.style.display="block":m.style.display="none"}));let m=document.createElement("div");m.setAttribute("id","bib_abstract"),m.textContent=""+e[t].data.abstractNote,m.style.display="none",r.appendChild(l),r.appendChild(d),r.appendChild(o),r.appendChild(p),r.appendChild(u),r.appendChild(s),r.appendChild(c),r.appendChild(i),r.appendChild(b),r.appendChild(f),r.appendChild(m),n.appendChild(r)}})),0}o("publiGroup","https://api.zotero.org/groups/2520377/items?key=axXEhVlBUnltrZujRGzSf9Gf");o("publiProject","https://api.zotero.org/groups/4344761/items?key=axXEhVlBUnltrZujRGzSf9Gf")}});