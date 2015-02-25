!function(){"use strict";function a(b,c){for(var d in c)if(c.hasOwnProperty(d))try{b[d]=c[d].constructor===Object?a(b[d],c[d]):c[d]}catch(e){b[d]=c[d]}return b}var b="undefined"!=typeof exports?exports:window,c=b.btoa||require("btoa"),d=b.Promise||require("bluebird"),e=/; */,f=function(b,c,d){if(this._endpoint=b,this._http=d,this._queue=[],this._batchTimeout=null,this._options=a({query:{},params:{track:this._generateTrackId()}},c||{}),this._cookies={},c.cookies){var f=c.cookies.split(e);f.forEach(function(a){var b=a.split("=",2);this._cookies[b[0]]=b[1]}.bind(this))}this._events={}};f.prototype._generateTrackId=function(){return c(1e8*Math.random()).substr(0,10)},f.prototype.execute=function(b,c){if(!b||"string"!=typeof b)throw new Error("Method is required to execute API calls");var e=new d(function(d,e){var f=a({},this._options.params);this._queue.push({method:b,params:a(f,c||{}),deferred:{resolve:d,reject:e}}),null===this._batchTimeout&&(this._batchTimeout=setTimeout(this._postToApi.bind(this),1))}.bind(this));return e},f.prototype._postToApi=function(){var a=j(this._queue),b={};for(var c in this._options.query)b[c]=this._options.query[c];var d;this._http.getSessionToken?d=this._http.getSessionToken():this._cookies.S&&(d=this._cookies.S),d&&(b.session_token=d);var e=[];for(var f in b)b.hasOwnProperty(f)&&e.push(f+"="+b[f]);var k=e.join("&");this._http.post({body:a,url:this._endpoint+"?"+k,cookies:this._options.cookies,clientId:this._options.clientId,secret:this._options.secret,headers:this._options.headers||{}}).then(g).then(h.bind(this,this._queue))["catch"](i.bind(this,this._queue)),this.resetQueue()};var g=function(a){var b=[],c=JSON.parse(a.body);for(var d in c)b.push(JSON.parse(c[d]));return b},h=function(a,b){for(var c in a){var d=b[c];if(d.stat&&this._events.hasOwnProperty(d.stat))for(var e in this._events[d.stat])this._events[d.stat][e](a[c],d);d.stat&&"ok"!==d.stat?a[c].deferred.reject(d):a[c].deferred.resolve(d)}return b},i=function(a,b){for(var c in a)a[c].deferred.reject(b);return b};f.prototype.resetQueue=function(){null!==this._batchTimeout&&(clearTimeout(this._batchTimeout),this._batchTimeout=null),this._queue=[]},f.prototype.on=function(a,b){this._events.hasOwnProperty(a)||(this._events[a]=[]),this._events[a].push(b)},f.middleware=function(b,c){var d=require("./http_adapter/node"),e=new d;return function(d,g,h){var i={query:{application_id:"user",format:"JSON",session_token:d.cookies&&d.cookies.S},params:{api_signature:""},cookies:d.headers&&d.headers.cookie};c&&c.passHeaders&&(i.headers=d.headers),d.api=new f(b,a(i,c||{}),e),h()}};var j=function(a){var b=[];for(var c in a){var d=k(a[c]);b.push(d)}return"\n"+b.join("\n")+"\n"},k=function(a){var b=["method="+encodeURIComponent(a.method)];for(var c in a.params)null!==a.params[c]&&a.params.hasOwnProperty(c)&&b.push(l(c,a.params[c]));return b.join("&")},l=function(a,b){var c=typeof b;switch(c){case"string":case"number":case"boolean":return m(a,b);case"undefined":return m(a,"");case"object":return null===b?m(a,b):n(a,b);default:throw new Error("Unable to parameterize key "+a+" with type "+c)}},m=function(a,b){return encodeURIComponent(a)+"="+encodeURIComponent(b)},n=function(a,b){var c=[];if(Array.isArray(b))for(var d=0,e=b.length;e>d;d++)c.push(encodeURIComponent(a)+"[]="+encodeURIComponent(b[d]));else for(var f in b)b.hasOwnProperty(f)&&c.push(encodeURIComponent(a)+"["+encodeURIComponent(f)+"]="+encodeURIComponent(b[f]));return c.join("&")};"undefined"!=typeof exports?module.exports=f:b.TaggedApi=f}(),function(){"use strict";function a(a,b,c){this._$http=a,this._$document=b,this._$window=c}var b="undefined"!=typeof exports?exports:window,c=(b.Promise||require("bluebird"),/(?:^| )S=/);a.$inject=["$http","$document","$window"],a.prototype.post=function(a){var b={"x-tagged-client-id":a.clientId,"x-tagged-client-url":this._$window.location,"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"};return this._$http.post(a.url,a.body,{timeout:1e4,transformResponse:d,headers:b}).then(e)},a.prototype.getSessionToken=function(){var a=this._$document[0].cookie;if(!a.length)return null;var b=a.match(c);if(!b)return null;var d=b.index;if(-1==d)return null;d+=2," "===b[0].charAt(0)&&d++;var e=a.indexOf(";",d);return-1==e&&(e=a.length),unescape(a.substring(d,e))};var d=function(a){return a},e=function(a){return{body:a.data}};if("undefined"!=typeof exports)module.exports=a;else{var f=b.TaggedApi||{};f.AngularAdapter=a}}(),function(){"use strict";var a=function(a,b){function c(a,c,d,e){var f=new b.AngularAdapter(a,c,e),g=new b("/api/",{query:{application_id:"user",format:"json"},clientId:this.clientId},f);return g.execute=function(a,c){return d.when(b.prototype.execute.call(this,a,c))},g}var d=a.module("tagged.service.api",[]);d.factory("taggedApi",c),c.$inject=["$http","$document","$q","$window"]};"undefined"!=typeof exports?module.exports=a:TaggedApi.angularWrapper=a}(),TaggedApi.angularWrapper(angular,TaggedApi);