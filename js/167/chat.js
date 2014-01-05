/*
 This file is part of Mibew Messenger project.
 http://mibew.org

 Copyright (c) 2005-2013 Mibew Messenger Community
 License: http://mibew.org/license.php

var FrameUtils={getDocument:function(a){return a.contentDocument?a.contentDocument:a.contentWindow?a.contentWindow.document:a.document?a.document:null},initFrame:function(a){var b=this.getDocument(a);b.open();b.write("<html><head>");b.write('<link rel="stylesheet" type="text/css" media="all" href="'+Chat.cssfile+'">');b.write('</head><body bgcolor="#FFFFFF" text=#000000" link="#C28400" vlink="#C28400" alink="#C28400">');b.write('<table width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td valign="top" class="message" id="content"></td></tr></table><a id="bottom" name="bottom"></a>');
b.write("</body></html>");b.close();a.onload=function(){a.myHtml&&(FrameUtils.getDocument(a).getElementById("content").innerHTML+=a.myHtml,FrameUtils.scrollDown(a))}},insertIntoFrame:function(a,b){var c=this.getDocument(a).getElementById("content");null==c?(a.myHtml||(a.myHtml=""),a.myHtml+=b):c.innerHTML+=b},scrollDown:function(a){var b=this.getDocument(a).getElementById("bottom");if("opera"==myAgent)try{a.contentWindow.scrollTo(0,this.getDocument(a).getElementById("content").clientHeight)}catch(c){}b&&
b.scrollIntoView(!1)}};Ajax.ChatThreadUpdater=Class.create();
Class.inherit(Ajax.ChatThreadUpdater,Ajax.Base,{initialize:function(a){this.setOptions(a);this._options.onComplete=this.requestComplete.bind(this);this._options.onException=this.handleException.bind(this);this._options.onTimeout=this.handleTimeout.bind(this);this._options.timeout=5E3;this.updater={};this.frequency=this._options.frequency||2;this.lastupdate=0;this.focused=this.skipNextsound=this.cansend=!0;this.ownThread=null!=this._options.message;FrameUtils.initFrame(this._options.container);this._options.message&&
(this._options.message.onkeydown=this.handleKeyDown.bind(this),this._options.message.onfocus=function(){this.focused=!0}.bind(this),this._options.message.onblur=function(){this.focused=!1}.bind(this));this.update()},handleException:function(a,b){this.setStatus("offline, reconnecting");this.stopUpdate();this.timer=setTimeout(this.update.bind(this),1E3)},handleTimeout:function(a){this.setStatus("timeout, reconnecting");this.stopUpdate();this.timer=setTimeout(this.update.bind(this),1E3)},updateOptions:function(a){this._options.parameters=
"act="+a+"&thread="+(this._options.threadid||0)+"&token="+(this._options.token||0)+"&lastid="+(this._options.lastid||0);this._options.user&&(this._options.parameters+="&user=true");"refresh"==a&&(this._options.message&&""!=this._options.message.value)&&(this._options.parameters+="&typed=1")},enableInput:function(a){this._options.message&&(this._options.message.disabled=!a)},stopUpdate:function(){this.enableInput(!0);this.updater._options&&(this.updater._options.onComplete=void 0);clearTimeout(this.timer)},
update:function(){this.updateOptions("refresh");this.updater=new Ajax.Request(this._options.servl,this._options)},requestComplete:function(a){try{this.enableInput(!0);this.cansend=!0;var b=Ajax.getXml(a);b&&"thread"==b.tagName?this.updateContent(b):this.handleError(a,b,"refresh messages failed")}catch(c){}this.skipNextsound=!1;this.timer=setTimeout(this.update.bind(this),1E3*this.frequency)},postMessage:function(a){if(""!=a&&this.cansend){this.cansend=!1;this.stopUpdate();this.skipNextsound=!0;this.updateOptions("post");
var b={}.extend(this._options);b.parameters+="&message="+encodeURIComponent(a);b.onComplete=function(a){this.requestComplete(a);this._options.message&&(this._options.message.value="",this._options.message.focus())}.bind(this);"opera"!=myRealAgent&&this.enableInput(!1);this.updater=new Ajax.Request(this._options.servl,b)}},changeName:function(a){this.skipNextsound=!0;new Ajax.Request(this._options.servl,{parameters:"act=rename&thread="+(this._options.threadid||0)+"&token="+(this._options.token||0)+
"&name="+encodeURIComponent(a)})},onThreadClosed:function(a){var b=Ajax.getXml(a);b&&"closed"==b.tagName?setTimeout("window.close()",2E3):this.handleError(a,b,"cannot close")},closeThread:function(){var a="act=close&thread="+(this._options.threadid||0)+"&token="+(this._options.token||0);this._options.user&&(a+="&user=true");new Ajax.Request(this._options.servl,{parameters:a,onComplete:this.onThreadClosed.bind(this)})},processMessage:function(a,b){var c=NodeUtils.getNodeText(b);FrameUtils.insertIntoFrame(a,
c)},showTyping:function(a){$("typingdiv")&&($("typingdiv").style.display=a?"inline":"none")},setupAvatar:function(a){a=NodeUtils.getNodeText(a);this._options.avatar&&this._options.user&&(this._options.avatar.innerHTML=""!=a?'<img src="'+Chat.mibewRoot+'/images/free.gif" width="7" height="1" border="0" alt="" /><img src="'+a+'" border="0" alt=""/>':"")},updateContent:function(a){var b=!1,c=this._options.container,d=NodeUtils.getAttrValue(a,"lastid");d&&(this._options.lastid=d);(d=NodeUtils.getAttrValue(a,
"typing"))&&this.showTyping("1"==d);(d=NodeUtils.getAttrValue(a,"canpost"))&&("1"==d&&!this.ownThread||this.ownThread&&"1"!=d)&&(window.location.href=window.location.href);for(d=0;d<a.childNodes.length;d++){var e=a.childNodes[d];"message"==e.tagName?(b=!0,this.processMessage(c,e)):"avatar"==e.tagName&&this.setupAvatar(e)}0<=window.location.search.indexOf("trace=on")?(a="updated",0<this.lastupdate&&(c=((new Date).getTime()-this.lastupdate)/1E3,a=a+", "+c+" secs",10<c&&alert(a)),this.lastupdate=(new Date).getTime(),
this.setStatus(a)):this.clearStatus();b&&(FrameUtils.scrollDown(this._options.container),this.skipNextsound||(b=$("soundimg"),(null==b||b.className.match(/\bisound\b/))&&playSound(Chat.mibewRoot+"/sounds/new_message.wav")),this.focused||window.focus())},isSendkey:function(a,b){return 13==b&&(a||this._options.ignorectrl)||10==b},handleKeyDown:function(a){a?(ctrl=a.ctrlKey,a=a.which):(a=event.keyCode,ctrl=event.ctrlKey);return this._options.message&&this.isSendkey(ctrl,a)?(a=this._options.message.value,
this._options.ignorectrl&&(a=a.replace(/[\r\n]+$/,"")),this.postMessage(a),!1):!0},handleError:function(a,b,c){b&&"error"==b.tagName?this.setStatus(NodeUtils.getNodeValue(b,"descr")):this.setStatus("reconnecting")},showStatusDiv:function(a){$("engineinfo")&&($("engineinfo").style.display="inline",$("engineinfo").innerHTML=a)},setStatus:function(a){this.statusTimeout&&clearTimeout(this.statusTimeout);this.showStatusDiv(a);this.statusTimeout=setTimeout(this.clearStatus.bind(this),4E3)},clearStatus:function(){$("engineinfo").style.display=
"none"}});var Chat={threadUpdater:{},applyName:function(){$("uname").value.match(/^\s*$/)||(Chat.threadUpdater.changeName($("uname").value),$("changename1").style.display="none",$("changename2").style.display="inline",$("unamelink").innerHTML=htmlescape($("uname").value))},showNameField:function(){$("changename1").style.display="inline";$("changename2").style.display="none"}};
Behaviour.register({"#postmessage a":function(a){a.onclick=function(){var a=$("msgwnd");a&&Chat.threadUpdater.postMessage(a.value)}},"select#predefined":function(a){a.onchange=function(){var a=$("msgwnd");0!=this.selectedIndex&&(a.value=this.options[this.selectedIndex].innerText||this.options[this.selectedIndex].innerHTML);this.selectedIndex=0;a.focus()}},"div#changename2 a":function(a){a.onclick=function(){Chat.showNameField();return!1}},"div#changename1 a":function(a){a.onclick=function(){Chat.applyName();
return!1}},"div#changename1 input#uname":function(a){a.onkeydown=function(a){13==(a||event).keyCode&&Chat.applyName()}},"a#refresh":function(a){a.onclick=function(){Chat.threadUpdater.stopUpdate();Chat.threadUpdater.update()}},"a#togglesound":function(a){a.onclick=function(){var a=$("soundimg");a&&(a.className.match(/\bisound\b/)?a.className="tplimage inosound":a.className="tplimage isound",(a=$("msgwnd"))&&a.focus())}},"a.closethread":function(a){a.onclick=function(){Chat.threadUpdater.closeThread()}}});
EventHelper.register(window,"onload",function(){Chat.mibewRoot=threadParams.wroot;Chat.cssfile=threadParams.cssfile;Chat.threadUpdater=new Ajax.ChatThreadUpdater({ignorectrl:-1,container:"safari"==myRealAgent?self.frames[0]:$("chatwnd"),avatar:$("avatarwnd"),message:$("msgwnd")}.extend(threadParams||{}))});


*/

/*
 This file is part of Mibew Messenger project.
 http://mibew.org

 Copyright (c) 2005-2013 Mibew Messenger Community
 License: http://mibew.org/license.php
*/
var FrameUtils={getDocument:function(a){return a.contentDocument?a.contentDocument:a.contentWindow?a.contentWindow.document:a.document?a.document:null},initFrame:function(a){var b=this.getDocument(a);b.open();b.write("<html><head>");b.write('<link rel="stylesheet" type="text/css" media="all" href="'+Chat.cssfile+'">');b.write('</head><body bgcolor="#FFFFFF" text=#000000" link="#C28400" vlink="#C28400" alink="#C28400">');b.write('<table width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td valign="top" class="message" id="content"></td></tr></table><a id="bottom" name="bottom"></a>');
	b.write("</body></html>");
	b.close();
	a.onload=function(){a.myHtml&&(FrameUtils.getDocument(a).getElementById("content").innerHTML+=a.myHtml, FrameUtils.scrollDown(a))}},
	insertIntoFrame:function(a,b){var c=this.getDocument(a).getElementById("content"); null==c?(a.myHtml||(a.myHtml=""),a.myHtml+=b):c.innerHTML+=b},
	scrollDown:function(a){var b=this.getDocument(a).getElementById("bottom"); if("opera"==myAgent)try{a.contentWindow.scrollTo(0,this.getDocument(a).getElementById("content").clientHeight)}catch(c){}b&&
	b.scrollIntoView(!1)}};

Ajax.ChatThreadUpdater=Class.create();

Class.inherit(Ajax.ChatThreadUpdater,Ajax.Base,{initialize:function(a){this.setOptions(a);this._options.onComplete=this.requestComplete.bind(this);this._options.onException=this.handleException.bind(this);this._options.onTimeout=this.handleTimeout.bind(this);this._options.timeout=5E3;this.updater={};this.frequency=this._options.frequency||2;this.lastupdate=0;this.focused=this.skipNextsound=this.cansend=!0;this.ownThread=null!=this._options.message;FrameUtils.initFrame(this._options.container);this._options.message&&
(this._options.message.onkeydown=this.handleKeyDown.bind(this),this._options.message.onfocus=function(){this.focused=!0}.bind(this),this._options.message.onblur=function(){this.focused=!1}.bind(this));this.update()},handleException:function(a,b){this.setStatus("offline, reconnecting");this.stopUpdate();this.timer=setTimeout(this.update.bind(this),1E3)},handleTimeout:function(a){this.setStatus("timeout, reconnecting");this.stopUpdate();this.timer=setTimeout(this.update.bind(this),1E3)},updateOptions:function(a){this._options.parameters=
"act="+a+"&thread="+(this._options.threadid||0)+"&token="+(this._options.token||0)+"&lastid="+(this._options.lastid||0);this._options.user&&(this._options.parameters+="&user=true");"refresh"==a&&(this._options.message&&""!=this._options.message.value)&&(this._options.parameters+="&typed=1")},enableInput:function(a){this._options.message&&(this._options.message.disabled=!a)},stopUpdate:function(){this.enableInput(!0);this.updater._options&&(this.updater._options.onComplete=void 0);clearTimeout(this.timer)},
update:function(){this.updateOptions("refresh");this.updater=new Ajax.Request(this._options.servl,this._options)},requestComplete:function(a){try{this.enableInput(!0);this.cansend=!0;var b=Ajax.getXml(a);b&&"thread"==b.tagName?this.updateContent(b):this.handleError(a,b,"refresh messages failed")}catch(c){}this.skipNextsound=!1;this.timer=setTimeout(this.update.bind(this),1E3*this.frequency)},postMessage:function(a){if(""!=a&&this.cansend){this.cansend=!1;this.stopUpdate();this.skipNextsound=!0;this.updateOptions("post");
var b={}.extend(this._options);b.parameters+="&message="+encodeURIComponent(a);b.onComplete=function(a){this.requestComplete(a);this._options.message&&(this._options.message.value="",this._options.message.focus())}.bind(this);"opera"!=myRealAgent&&this.enableInput(!1);this.updater=new Ajax.Request(this._options.servl,b)}},changeName:function(a){this.skipNextsound=!0;new Ajax.Request(this._options.servl,{parameters:"act=rename&thread="+(this._options.threadid||0)+"&token="+(this._options.token||0)+
"&name="+encodeURIComponent(a)})},onThreadClosed:function(a){var b=Ajax.getXml(a);b&&"closed"==b.tagName?setTimeout("window.close()",2E3):this.handleError(a,b,"cannot close")},closeThread:function(){var a="act=close&thread="+(this._options.threadid||0)+"&token="+(this._options.token||0);this._options.user&&(a+="&user=true");new Ajax.Request(this._options.servl,{parameters:a,onComplete:this.onThreadClosed.bind(this)})},processMessage:function(a,b){var c=NodeUtils.getNodeText(b);FrameUtils.insertIntoFrame(a,
c)},showTyping:function(a){$("typingdiv")&&($("typingdiv").style.display=a?"inline":"none")},setupAvatar:function(a){a=NodeUtils.getNodeText(a);this._options.avatar&&this._options.user&&(this._options.avatar.innerHTML=""!=a?'<img src="'+Chat.mibewRoot+'/images/free.gif" width="7" height="1" border="0" alt="" /><img src="'+a+'" border="0" alt=""/>':"")},updateContent:function(a){var b=!1,c=this._options.container,d=NodeUtils.getAttrValue(a,"lastid");d&&(this._options.lastid=d);(d=NodeUtils.getAttrValue(a,
"typing"))&&this.showTyping("1"==d);(d=NodeUtils.getAttrValue(a,"canpost"))&&("1"==d&&!this.ownThread||this.ownThread&&"1"!=d)&&(window.location.href=window.location.href);for(d=0;d<a.childNodes.length;d++){var e=a.childNodes[d];"message"==e.tagName?(b=!0,this.processMessage(c,e)):"avatar"==e.tagName&&this.setupAvatar(e)}0<=window.location.search.indexOf("trace=on")?(a="updated",0<this.lastupdate&&(c=((new Date).getTime()-this.lastupdate)/1E3,a=a+", "+c+" secs",10<c&&alert(a)),this.lastupdate=(new Date).getTime(),
this.setStatus(a)):this.clearStatus();b&&(FrameUtils.scrollDown(this._options.container),this.skipNextsound||(b=$("soundimg"),(null==b||b.className.match(/\bisound\b/))&&playSound(Chat.mibewRoot+"/sounds/new_message.wav")),this.focused||window.focus())},isSendkey:function(a,b){return 13==b&&(a||this._options.ignorectrl)||10==b},handleKeyDown:function(a){a?(ctrl=a.ctrlKey,a=a.which):(a=event.keyCode,ctrl=event.ctrlKey);return this._options.message&&this.isSendkey(ctrl,a)?(a=this._options.message.value,
this._options.ignorectrl&&(a=a.replace(/[\r\n]+$/,"")),this.postMessage(a),!1):!0},handleError:function(a,b,c){b&&"error"==b.tagName?this.setStatus(NodeUtils.getNodeValue(b,"descr")):this.setStatus("reconnecting")},showStatusDiv:function(a){$("engineinfo")&&($("engineinfo").style.display="inline",$("engineinfo").innerHTML=a)},setStatus:function(a){this.statusTimeout&&clearTimeout(this.statusTimeout);this.showStatusDiv(a);this.statusTimeout=setTimeout(this.clearStatus.bind(this),4E3)},clearStatus:function(){$("engineinfo").style.display=
"none"}});

var Chat={
	threadUpdater:{},applyName:function(){$("uname").value.match(/^\s*$/)||(Chat.threadUpdater.changeName($("uname").value),
	$("changename1").style.display="none",
	$("changename2").style.display="inline",
	$("unamelink").innerHTML=htmlescape($("uname").value))},
	showNameField:function(){$("changename1").style.display="inline";$("changename2").style.display="none"}
};

Behaviour.register({
	"#postmessage a":function(a){a.onclick=function(){var a=$("msgwnd");a&&Chat.threadUpdater.postMessage(a.value)}},
	"select#predefined":function(a){a.onchange=function(){var a=$("msgwnd");0!=this.selectedIndex&&(a.value=this.options[this.selectedIndex].innerText||this.options[this.selectedIndex].innerHTML);this.selectedIndex=0;a.focus()}},
	"div#changename2 a":function(a){a.onclick=function(){Chat.showNameField();return!1}},
	"div#changename1 a":function(a){a.onclick=function(){Chat.applyName();return!1}},
	//Keypress to send messages
	"div#changename1 input#uname":function(a){a.onkeydown=function(a){13==(a||event).keyCode&&Chat.applyName()}},
	"a#refresh":function(a){a.onclick=function(){Chat.threadUpdater.stopUpdate();Chat.threadUpdater.update()}},
	"a#togglesound":function(a){a.onclick=function(){var a=$("soundimg");a&&(a.className.match(/\bisound\b/)?a.className="tplimage inosound":a.className="tplimage isound",(a=$("msgwnd"))&&a.focus())}},
	"a.closethread":function(a){a.onclick=function(){Chat.threadUpdater.closeThread()}}
});

EventHelper.register(window,"onload",function(){
	//parrams load from tpl file after render
	Chat.mibewRoot=threadParams.wroot;
	Chat.cssfile=threadParams.cssfile;
	Chat.threadUpdater=new Ajax.ChatThreadUpdater({
		ignorectrl:-1,
		container:"safari"==myRealAgent?self.frames[0]:$("chatwnd"),
		avatar:$("avatarwnd"),
		message:$("msgwnd")
	}.extend(threadParams||{}))
});
