/*
 This file is part of Mibew Messenger project.
 http://mibew.org

 Copyright (c) 2005-2013 Mibew Messenger Community
 License: http://mibew.org/license.php

var Class={create:function(){return function(){this.initialize.apply(this,arguments)}},inherit:function(a,b,c){Object.extend(Object.extend(a.prototype,b.prototype),c)}};Object.extend=function(a,b){for(property in b)a[property]=b[property];return a};Object.prototype.extend=function(a){return Object.extend.apply(this,[this,a])};Function.prototype.bind=function(a){var b=this;return function(){return b.apply(a,arguments)}};
Function.prototype.bindAsEventListener=function(a){var b=this;return function(c){b.call(a,c||window.event)}};Number.prototype.toColorPart=function(){var a=this.toString(16);return 16>this?"0"+a:a};var Try={these:function(){for(var a,b=0;b<arguments.length;b++){var c=arguments[b];try{a=c();break}catch(d){}}return a}},PeriodicalExecuter=Class.create();
PeriodicalExecuter.prototype={initialize:function(a,b){this.callback=a;this.frequency=b;this.currentlyExecuting=!1;this.registerCallback()},registerCallback:function(){setInterval(this.onTimerEvent.bind(this),1E3*this.frequency)},onTimerEvent:function(){if(!this.currentlyExecuting)try{this.currentlyExecuting=!0,this.callback()}finally{this.currentlyExecuting=!1}}};
function findObj(a){var b;!(b=document[a])&&document.all&&(b=document.all[a]);!b&&document.getElementById&&(b=document.getElementById(a));if(!b&&!document.all&&document.getElementsByName){b=document.getElementsByName(a);if(0==b.length)return null;if(1==b.length)return b[0]}return b}Array.prototype.push||(Array.prototype.push=function(){for(var a=this.length,b=0;b<arguments.length;b++)this[a+b]=arguments[b];return this.length});
function $(){for(var a=[],b=0;b<arguments.length;b++){var c=arguments[b];"string"==typeof c&&(c=findObj(c));if(1==arguments.length)return c;a.push(c)}return a}
var Ajax={getTransport:function(){return Try.these(function(){return new ActiveXObject("Msxml2.XMLHTTP")},function(){return new ActiveXObject("Microsoft.XMLHTTP")},function(){return new XMLHttpRequest})||!1},getXml:function(a){return a&&200<=a.status&&300>a.status&&(a=a.responseXML)&&a.documentElement?a.documentElement:null},getError:function(a){return a.statusText||"connection error N"+a.status},emptyFunction:function(){},Base:function(){}};
Ajax.Base.prototype={setOptions:function(a){this._options={_method:"post",asynchronous:!0,parameters:""}.extend(a||{})},getStatus:function(){try{return this.transport.status||0}catch(a){return 0}},responseIsSuccess:function(){var a=this.getStatus();return!a||200<=a&&300>a},responseIsFailure:function(){return!this.responseIsSuccess()}};Ajax.Request=Class.create();Ajax.Request.Events=["Uninitialized","Loading","Loaded","Interactive","Complete"];
Class.inherit(Ajax.Request,Ajax.Base,{initialize:function(a,b){this.transport=Ajax.getTransport();this.setOptions(b);this.transportTimer={};this.finished=!1;this.request(a)},request:function(a){var b=this._options.parameters||"";0<b.length&&(b+="&_=");try{"get"==this._options._method&&0<b.length&&(a+="?"+b);this.transport.open(this._options._method.toUpperCase(),a,this._options.asynchronous);this._options.asynchronous&&(this.transport.onreadystatechange=this.onStateChange.bind(this),this._options.timeout&&
(this.transportTimer=setTimeout(this.handleTimeout.bind(this),this._options.timeout)));this.setRequestHeaders();var c=this._options.postBody?this._options.postBody:b;this.transport.send("post"==this._options._method?c:null)}catch(d){this.dispatchException(d)}},setRequestHeaders:function(){var a=["X-Requested-With","XMLHttpRequest"];"post"==this._options._method&&(a.push("Content-type","application/x-www-form-urlencoded"),this.transport.overrideMimeType&&2005>(navigator.userAgent.match("/Gecko/(d{4})/")||
[0,2005])[1]&&a.push("Connection","close"));this._options.requestHeaders&&a.push.apply(a,this._options.requestHeaders);for(var b=0;b<a.length;b+=2)this.transport.setRequestHeader(a[b],a[b+1])},onStateChange:function(){1!=this.transport.readyState&&this.respondToReadyState(this.transport.readyState)},handleTimeout:function(){this.finished||(this.finished=!0,(this._options.onTimeout||Ajax.emptyFunction)(this))},respondToReadyState:function(a){if("Complete"==Ajax.Request.Events[a]){try{this.finished||
(this.finished=!0,this._options.timeout&&clearTimeout(this.transportTimer),(this._options.onComplete||Ajax.emptyFunction)(this.transport))}catch(b){this.dispatchException(b)}this.transport.onreadystatechange=Ajax.emptyFunction}},dispatchException:function(a){(this._options.onException||Ajax.emptyFunction)(this,a)}});
var EventHelper={register:function(a,b,c){var d=a[b];a[b]="function"!=typeof d?c:function(){d();c()}}},Behaviour={list:[],register:function(a){Behaviour.list.push(a)},init:function(){EventHelper.register(window,"onload",function(){Behaviour.apply()})},apply:function(){for(h=0;sheet=Behaviour.list[h];h++)for(selector in sheet)if(list=document.getElementsBySelector(selector))for(i=0;element=list[i];i++)sheet[selector](element)}};Behaviour.init();
function getAllChildren(a){return a.all?a.all:a.getElementsByTagName("*")}
document.getElementsBySelector=function(a){if(!document.getElementsByTagName)return[];a=a.split(" ");for(var b=Array(document),c=0;c<a.length;c++)if(token=a[c].replace(/^\s+/,"").replace(/\s+$/,""),-1<token.indexOf("#")){var d=token.split("#"),e=d[0],b=document.getElementById(d[1]);if(null==b||e&&b.nodeName.toLowerCase()!=e)return[];b=Array(b)}else if(-1<token.indexOf(".")){d=token.split(".");e=d[0];d=d[1];e||(e="*");for(var m=[],l=0,p=0;p<b.length;p++){var f;f="*"==e?getAllChildren(b[p]):b[p].getElementsByTagName(e);
if(null!=f)for(var q=0;q<f.length;q++)m[l++]=f[q]}b=[];for(l=e=0;l<m.length;l++)m[l].className&&m[l].className.match(RegExp("\\b"+d+"\\b"))&&(b[e++]=m[l])}else{if(!b[0])return;e=token;m=[];for(p=l=0;p<b.length;p++)for(f=b[p].getElementsByTagName(e),q=0;q<f.length;q++)m[l++]=f[q];b=m}return b};
var NodeUtils={getNodeValue:function(a,b){var c=a.getElementsByTagName(b);if(0==c.length)return"";var c=c[0].childNodes,d="";for(i=0;i<c.length;i++)d+=c[i].nodeValue;return d},getNodeText:function(a){a=a.childNodes;var b="";for(i=0;i<a.length;i++)b+=a[i].nodeValue;return b},getAttrValue:function(a,b){for(k=0;k<a.attributes.length;k++)if(a.attributes[k].nodeName==b)return a.attributes[k].nodeValue;return null}},CommonUtils={getRow:function(a,b){var c=b.rows[a];if(null!=c)return c;if(null!=b.rows.head)return null;
for(k=0;k<b.rows.length;k++)if(b.rows[k].id==a)return b.rows[k];return null},getCell:function(a,b,c){var d=b.cells[a];if(null!=d)return d;if(null!=c.rows.head)return null;for(k=0;k<b.cells.length;k++)if(b.cells[k].id==a)return b.cells[k];return null},insertCell:function(a,b,c,d,e,m){a=a.insertCell(-1);a.id=b;d&&(a.align=d);a.className=c;e&&(a.height=e);a.innerHTML=m}};
function playSound(a){var b=document.createElement("div");-1!=navigator.userAgent.toLowerCase().indexOf("opera")&&(b.style="position: absolute; left: 0px; top: -200px;");document.body.appendChild(b);b.innerHTML='<audio autoplay src="'+a+'"><embed src="'+a+'" hidden="true" autostart="true" loop="false"></audio>'}function htmlescape(a){return a.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;").replace('"',"&quot;")};
*/




/*
 This file is part of Mibew Messenger project.
 http://mibew.org

 Copyright (c) 2005-2013 Mibew Messenger Community
 License: http://mibew.org/license.php
 
 rewrite style
*/
var Class={
	create:function(){
	return function(){this.initialize.apply(this,arguments)}},
	inherit:function(a,b,c){Object.extend(Object.extend(a.prototype,b.prototype),c)}};
	Object.extend=function(a,b){for(property in b)a[property]=b[property];return a};
	Object.prototype.extend=function(a){return Object.extend.apply(this,[this,a])};
	Function.prototype.bind=function(a){var b=this;return function(){return b.apply(a,arguments)}};
	
	Function.prototype.bindAsEventListener=function(a){var b=this;return function(c){b.call(a,c||window.event)}};
	Number.prototype.toColorPart=function(){var a=this.toString(16);return 16>this?"0"+a:a};
	var Try={these:function(){for(var a,b=0;b<arguments.length;b++){var c=arguments[b];
	try{a=c();break}catch(d){}}return a}},PeriodicalExecuter=Class.create();
	
	PeriodicalExecuter.prototype={initialize:function(a,b){this.callback=a;this.frequency=b;this.currentlyExecuting=!1;this.registerCallback()},registerCallback:function(){setInterval(this.onTimerEvent.bind(this),1E3*this.frequency)},onTimerEvent:function(){if(!this.currentlyExecuting)try{this.currentlyExecuting=!0,this.callback()}finally{this.currentlyExecuting=!1}}};
	function findObj(a){var b;!(b=document[a])&&document.all&&(b=document.all[a]);
	!b&&document.getElementById&&(b=document.getElementById(a));if(!b&&!document.all&&document.getElementsByName){b=document.getElementsByName(a);if(0==b.length)return null;if(1==b.length)return b[0]}return b}
	
	Array.prototype.push||(Array.prototype.push=function(){for(var a=this.length,b=0;b<arguments.length;b++)this[a+b]=arguments[b];return this.length});
	function $(){for(var a=[],b=0;b<arguments.length;b++){var c=arguments[b];"string"==typeof c&&(c=findObj(c));if(1==arguments.length)return c;a.push(c)}return a}
	
	var Ajax={getTransport:function(){return Try.these(function(){return new ActiveXObject("Msxml2.XMLHTTP")},function(){return new ActiveXObject("Microsoft.XMLHTTP")},function(){return new XMLHttpRequest})||!1},getXml:function(a){return a&&200<=a.status&&300>a.status&&(a=a.responseXML)&&a.documentElement?a.documentElement:null},getError:function(a){return a.statusText||"connection error N"+a.status},emptyFunction:function(){},Base:function(){}};
	
	Ajax.Base.prototype={setOptions:function(a){this._options={_method:"post",asynchronous:!0,parameters:""}.extend(a||{})},getStatus:function(){try{return this.transport.status||0}catch(a){return 0}},responseIsSuccess:function(){var a=this.getStatus();return!a||200<=a&&300>a},responseIsFailure:function(){return!this.responseIsSuccess()}};
	
	Ajax.Request=Class.create();
	Ajax.Request.Events=["Uninitialized","Loading","Loaded","Interactive","Complete"];
	
	Class.inherit(Ajax.Request,Ajax.Base,{initialize:function(a,b){this.transport=Ajax.getTransport();this.setOptions(b);this.transportTimer={};this.finished=!1;this.request(a)},request:function(a){var b=this._options.parameters||"";0<b.length&&(b+="&_=");try{"get"==this._options._method&&0<b.length&&(a+="?"+b);this.transport.open(this._options._method.toUpperCase(),a,this._options.asynchronous);this._options.asynchronous&&(this.transport.onreadystatechange=this.onStateChange.bind(this),this._options.timeout&&
	(this.transportTimer=setTimeout(this.handleTimeout.bind(this),this._options.timeout)));this.setRequestHeaders();var c=this._options.postBody?this._options.postBody:b;this.transport.send("post"==this._options._method?c:null)}catch(d){this.dispatchException(d)}},setRequestHeaders:function(){var a=["X-Requested-With","XMLHttpRequest"];"post"==this._options._method&&(a.push("Content-type","application/x-www-form-urlencoded"),this.transport.overrideMimeType&&2005>(navigator.userAgent.match("/Gecko/(d{4})/")||
	[0,2005])[1]&&a.push("Connection","close"));this._options.requestHeaders&&a.push.apply(a,this._options.requestHeaders);for(var b=0;b<a.length;b+=2)this.transport.setRequestHeader(a[b],a[b+1])},onStateChange:function(){1!=this.transport.readyState&&this.respondToReadyState(this.transport.readyState)},handleTimeout:function(){this.finished||(this.finished=!0,(this._options.onTimeout||Ajax.emptyFunction)(this))},respondToReadyState:function(a){if("Complete"==Ajax.Request.Events[a]){try{this.finished||
	(this.finished=!0,this._options.timeout&&clearTimeout(this.transportTimer),(this._options.onComplete||Ajax.emptyFunction)(this.transport))}catch(b){this.dispatchException(b)}this.transport.onreadystatechange=Ajax.emptyFunction}},dispatchException:function(a){(this._options.onException||Ajax.emptyFunction)(this,a)}});

	var EventHelper={register:function(a,b,c){var d=a[b];a[b]="function"!=typeof d?c:function(){d();c()}}},Behaviour={list:[],register:function(a){Behaviour.list.push(a)},init:function(){EventHelper.register(window,"onload",function(){Behaviour.apply()})},apply:function(){for(h=0;sheet=Behaviour.list[h];h++)for(selector in sheet)if(list=document.getElementsBySelector(selector))for(i=0;element=list[i];i++)sheet[selector](element)}};
	Behaviour.init();
	function getAllChildren(a){return a.all?a.all:a.getElementsByTagName("*")}
	
	document.getElementsBySelector=function(a){if(!document.getElementsByTagName)return[];a=a.split(" ");for(var b=Array(document),c=0;c<a.length;c++)if(token=a[c].replace(/^\s+/,"").replace(/\s+$/,""),-1<token.indexOf("#")){var d=token.split("#"),e=d[0],b=document.getElementById(d[1]);if(null==b||e&&b.nodeName.toLowerCase()!=e)return[];b=Array(b)}else if(-1<token.indexOf(".")){d=token.split(".");e=d[0];d=d[1];e||(e="*");for(var m=[],l=0,p=0;p<b.length;p++){var f;f="*"==e?getAllChildren(b[p]):b[p].getElementsByTagName(e);
		if(null!=f)for(var q=0;q<f.length;q++)m[l++]=f[q]}b=[];for(l=e=0;l<m.length;l++)m[l].className&&m[l].className.match(RegExp("\\b"+d+"\\b"))&&(b[e++]=m[l])}else{if(!b[0])return;e=token;m=[];for(p=l=0;p<b.length;p++)for(f=b[p].getElementsByTagName(e),q=0;q<f.length;q++)m[l++]=f[q];b=m}return b};

	var NodeUtils={getNodeValue:function(a,b){var c=a.getElementsByTagName(b);if(0==c.length)return"";var c=c[0].childNodes,d="";for(i=0;i<c.length;i++)d+=c[i].nodeValue;return d},getNodeText:function(a){a=a.childNodes;var b="";for(i=0;i<a.length;i++)b+=a[i].nodeValue;return b},getAttrValue:function(a,b){for(k=0;k<a.attributes.length;k++)if(a.attributes[k].nodeName==b)return a.attributes[k].nodeValue;return null}},CommonUtils={getRow:function(a,b){var c=b.rows[a];if(null!=c)return c;if(null!=b.rows.head)return null;
		for(k=0;k<b.rows.length;k++)if(b.rows[k].id==a)return b.rows[k];return null},getCell:function(a,b,c){var d=b.cells[a];if(null!=d)return d;if(null!=c.rows.head)return null;for(k=0;k<b.cells.length;k++)if(b.cells[k].id==a)return b.cells[k];return null},insertCell:function(a,b,c,d,e,m){a=a.insertCell(-1);a.id=b;d&&(a.align=d);a.className=c;e&&(a.height=e);a.innerHTML=m}};
		function playSound(a){var b=document.createElement("div");-1!=navigator.userAgent.toLowerCase().indexOf("opera")&&(b.style="position: absolute; left: 0px; top: -200px;");document.body.appendChild(b);b.innerHTML='<audio autoplay src="'+a+'"><embed src="'+a+'" hidden="true" autostart="true" loop="false"></audio>'}function htmlescape(a){return a.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;").replace('"',"&quot;")};
