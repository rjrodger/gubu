(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).Gubu=e()}}((function(){var e=function(){if("function"!=typeof Symbol||"function"!=typeof Object.getOwnPropertySymbols)return!1;if("symbol"==typeof Symbol.iterator)return!0;var e={},t=Symbol("test"),r=Object(t);if("string"==typeof t)return!1;if("[object Symbol]"!==Object.prototype.toString.call(t))return!1;if("[object Symbol]"!==Object.prototype.toString.call(r))return!1;for(t in e[t]=42,e)return!1;if("function"==typeof Object.keys&&0!==Object.keys(e).length)return!1;if("function"==typeof Object.getOwnPropertyNames&&0!==Object.getOwnPropertyNames(e).length)return!1;var n=Object.getOwnPropertySymbols(e);if(1!==n.length||n[0]!==t)return!1;if(!Object.prototype.propertyIsEnumerable.call(e,t))return!1;if("function"==typeof Object.getOwnPropertyDescriptor){var o=Object.getOwnPropertyDescriptor(e,t);if(42!==o.value||!0!==o.enumerable)return!1}return!0},t=function(){return e()&&!!Symbol.toStringTag},r="undefined"!=typeof Symbol&&Symbol,n=Array.prototype.slice,o=Object.prototype.toString,i=Function.prototype.bind||function(e){var t=this;if("function"!=typeof t||"[object Function]"!==o.call(t))throw new TypeError("Function.prototype.bind called on incompatible "+t);for(var r,i=n.call(arguments,1),a=Math.max(0,t.length-i.length),u=[],l=0;l<a;l++)u.push("$"+l);if(r=Function("binder","return function ("+u.join(",")+"){ return binder.apply(this,arguments); }")((function(){if(this instanceof r){var o=t.apply(this,i.concat(n.call(arguments)));return Object(o)===o?o:this}return t.apply(e,i.concat(n.call(arguments)))})),t.prototype){var p=function(){};p.prototype=t.prototype,r.prototype=new p,p.prototype=null}return r},a=i.call(Function.call,Object.prototype.hasOwnProperty),u=SyntaxError,l=Function,p=TypeError,s=function(e){try{return l('"use strict"; return ('+e+").constructor;")()}catch(t){}},f=Object.getOwnPropertyDescriptor;if(f)try{f({},"")}catch(Nt){f=null}var c,y=function(){throw new p},d=f?function(){try{return y}catch(e){try{return f(arguments,"callee").get}catch(t){return y}}}():y,b="function"==typeof r&&"function"==typeof Symbol&&"symbol"==typeof r("foo")&&"symbol"==typeof Symbol("bar")&&e(),g=Object.getPrototypeOf||function(e){return e.__proto__},h={},v="undefined"==typeof Uint8Array?void 0:g(Uint8Array),m={"%AggregateError%":"undefined"==typeof AggregateError?void 0:AggregateError,"%Array%":Array,"%ArrayBuffer%":"undefined"==typeof ArrayBuffer?void 0:ArrayBuffer,"%ArrayIteratorPrototype%":b?g([][Symbol.iterator]()):void 0,"%AsyncFromSyncIteratorPrototype%":void 0,"%AsyncFunction%":h,"%AsyncGenerator%":h,"%AsyncGeneratorFunction%":h,"%AsyncIteratorPrototype%":h,"%Atomics%":"undefined"==typeof Atomics?void 0:Atomics,"%BigInt%":"undefined"==typeof BigInt?void 0:BigInt,"%Boolean%":Boolean,"%DataView%":"undefined"==typeof DataView?void 0:DataView,"%Date%":Date,"%decodeURI%":decodeURI,"%decodeURIComponent%":decodeURIComponent,"%encodeURI%":encodeURI,"%encodeURIComponent%":encodeURIComponent,"%Error%":Error,"%eval%":eval,"%EvalError%":EvalError,"%Float32Array%":"undefined"==typeof Float32Array?void 0:Float32Array,"%Float64Array%":"undefined"==typeof Float64Array?void 0:Float64Array,"%FinalizationRegistry%":"undefined"==typeof FinalizationRegistry?void 0:FinalizationRegistry,"%Function%":l,"%GeneratorFunction%":h,"%Int8Array%":"undefined"==typeof Int8Array?void 0:Int8Array,"%Int16Array%":"undefined"==typeof Int16Array?void 0:Int16Array,"%Int32Array%":"undefined"==typeof Int32Array?void 0:Int32Array,"%isFinite%":isFinite,"%isNaN%":isNaN,"%IteratorPrototype%":b?g(g([][Symbol.iterator]())):void 0,"%JSON%":"object"==typeof JSON?JSON:void 0,"%Map%":"undefined"==typeof Map?void 0:Map,"%MapIteratorPrototype%":"undefined"!=typeof Map&&b?g((new Map)[Symbol.iterator]()):void 0,"%Math%":Math,"%Number%":Number,"%Object%":Object,"%parseFloat%":parseFloat,"%parseInt%":parseInt,"%Promise%":"undefined"==typeof Promise?void 0:Promise,"%Proxy%":"undefined"==typeof Proxy?void 0:Proxy,"%RangeError%":RangeError,"%ReferenceError%":ReferenceError,"%Reflect%":"undefined"==typeof Reflect?void 0:Reflect,"%RegExp%":RegExp,"%Set%":"undefined"==typeof Set?void 0:Set,"%SetIteratorPrototype%":"undefined"!=typeof Set&&b?g((new Set)[Symbol.iterator]()):void 0,"%SharedArrayBuffer%":"undefined"==typeof SharedArrayBuffer?void 0:SharedArrayBuffer,"%String%":String,"%StringIteratorPrototype%":b?g(""[Symbol.iterator]()):void 0,"%Symbol%":b?Symbol:void 0,"%SyntaxError%":u,"%ThrowTypeError%":d,"%TypedArray%":v,"%TypeError%":p,"%Uint8Array%":"undefined"==typeof Uint8Array?void 0:Uint8Array,"%Uint8ClampedArray%":"undefined"==typeof Uint8ClampedArray?void 0:Uint8ClampedArray,"%Uint16Array%":"undefined"==typeof Uint16Array?void 0:Uint16Array,"%Uint32Array%":"undefined"==typeof Uint32Array?void 0:Uint32Array,"%URIError%":URIError,"%WeakMap%":"undefined"==typeof WeakMap?void 0:WeakMap,"%WeakRef%":"undefined"==typeof WeakRef?void 0:WeakRef,"%WeakSet%":"undefined"==typeof WeakSet?void 0:WeakSet},A={"%ArrayBufferPrototype%":["ArrayBuffer","prototype"],"%ArrayPrototype%":["Array","prototype"],"%ArrayProto_entries%":["Array","prototype","entries"],"%ArrayProto_forEach%":["Array","prototype","forEach"],"%ArrayProto_keys%":["Array","prototype","keys"],"%ArrayProto_values%":["Array","prototype","values"],"%AsyncFunctionPrototype%":["AsyncFunction","prototype"],"%AsyncGenerator%":["AsyncGeneratorFunction","prototype"],"%AsyncGeneratorPrototype%":["AsyncGeneratorFunction","prototype","prototype"],"%BooleanPrototype%":["Boolean","prototype"],"%DataViewPrototype%":["DataView","prototype"],"%DatePrototype%":["Date","prototype"],"%ErrorPrototype%":["Error","prototype"],"%EvalErrorPrototype%":["EvalError","prototype"],"%Float32ArrayPrototype%":["Float32Array","prototype"],"%Float64ArrayPrototype%":["Float64Array","prototype"],"%FunctionPrototype%":["Function","prototype"],"%Generator%":["GeneratorFunction","prototype"],"%GeneratorPrototype%":["GeneratorFunction","prototype","prototype"],"%Int8ArrayPrototype%":["Int8Array","prototype"],"%Int16ArrayPrototype%":["Int16Array","prototype"],"%Int32ArrayPrototype%":["Int32Array","prototype"],"%JSONParse%":["JSON","parse"],"%JSONStringify%":["JSON","stringify"],"%MapPrototype%":["Map","prototype"],"%NumberPrototype%":["Number","prototype"],"%ObjectPrototype%":["Object","prototype"],"%ObjProto_toString%":["Object","prototype","toString"],"%ObjProto_valueOf%":["Object","prototype","valueOf"],"%PromisePrototype%":["Promise","prototype"],"%PromiseProto_then%":["Promise","prototype","then"],"%Promise_all%":["Promise","all"],"%Promise_reject%":["Promise","reject"],"%Promise_resolve%":["Promise","resolve"],"%RangeErrorPrototype%":["RangeError","prototype"],"%ReferenceErrorPrototype%":["ReferenceError","prototype"],"%RegExpPrototype%":["RegExp","prototype"],"%SetPrototype%":["Set","prototype"],"%SharedArrayBufferPrototype%":["SharedArrayBuffer","prototype"],"%StringPrototype%":["String","prototype"],"%SymbolPrototype%":["Symbol","prototype"],"%SyntaxErrorPrototype%":["SyntaxError","prototype"],"%TypedArrayPrototype%":["TypedArray","prototype"],"%TypeErrorPrototype%":["TypeError","prototype"],"%Uint8ArrayPrototype%":["Uint8Array","prototype"],"%Uint8ClampedArrayPrototype%":["Uint8ClampedArray","prototype"],"%Uint16ArrayPrototype%":["Uint16Array","prototype"],"%Uint32ArrayPrototype%":["Uint32Array","prototype"],"%URIErrorPrototype%":["URIError","prototype"],"%WeakMapPrototype%":["WeakMap","prototype"],"%WeakSetPrototype%":["WeakSet","prototype"]},j=i.call(Function.call,Array.prototype.concat),w=i.call(Function.apply,Array.prototype.splice),O=i.call(Function.call,String.prototype.replace),S=i.call(Function.call,String.prototype.slice),I=/[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g,P=/\\(\\)?/g,E=function(e,t){var r,n=e;if(a(A,n)&&(n="%"+(r=A[n])[0]+"%"),a(m,n)){var o=m[n];if(o===h&&(o=function e(t){var r;if("%AsyncFunction%"===t)r=s("async function () {}");else if("%GeneratorFunction%"===t)r=s("function* () {}");else if("%AsyncGeneratorFunction%"===t)r=s("async function* () {}");else if("%AsyncGenerator%"===t){var n=e("%AsyncGeneratorFunction%");n&&(r=n.prototype)}else if("%AsyncIteratorPrototype%"===t){var o=e("%AsyncGenerator%");o&&(r=g(o.prototype))}return m[t]=r,r}(n)),void 0===o&&!t)throw new p("intrinsic "+e+" exists, but is not available. Please file an issue!");return{alias:r,name:n,value:o}}throw new u("intrinsic "+e+" does not exist!")},k=function(e,t){if("string"!=typeof e||0===e.length)throw new p("intrinsic name must be a non-empty string");if(arguments.length>1&&"boolean"!=typeof t)throw new p('"allowMissing" argument must be a boolean');var r=function(e){var t=S(e,0,1),r=S(e,-1);if("%"===t&&"%"!==r)throw new u("invalid intrinsic syntax, expected closing `%`");if("%"===r&&"%"!==t)throw new u("invalid intrinsic syntax, expected opening `%`");var n=[];return O(e,I,(function(e,t,r,o){n[n.length]=r?O(o,P,"$1"):t||e})),n}(e),n=r.length>0?r[0]:"",o=E("%"+n+"%",t),i=o.name,l=o.value,s=!1,c=o.alias;c&&(n=c[0],w(r,j([0,1],c)));for(var y=1,d=!0;y<r.length;y+=1){var b=r[y],g=S(b,0,1),h=S(b,-1);if(('"'===g||"'"===g||"`"===g||'"'===h||"'"===h||"`"===h)&&g!==h)throw new u("property names with quotes must have matching quotes");if("constructor"!==b&&d||(s=!0),a(m,i="%"+(n+="."+b)+"%"))l=m[i];else if(null!=l){if(!(b in l)){if(!t)throw new p("base intrinsic for "+e+" exists, but the property is not available.");return}if(f&&y+1>=r.length){var v=f(l,b);l=(d=!!v)&&"get"in v&&!("originalValue"in v.get)?v.get:l[b]}else d=a(l,b),l=l[b];d&&!s&&(m[i]=l)}}return l},x=k("%Function.prototype.apply%"),$=k("%Function.prototype.call%"),F=k("%Reflect.apply%",!0)||i.call($,x),T=k("%Object.getOwnPropertyDescriptor%",!0),R=k("%Object.defineProperty%",!0),U=k("%Math.max%");if(R)try{R({},"a",{value:1})}catch(Nt){R=null}c=function(e){var t=F(i,$,arguments);return T&&R&&T(t,"length").configurable&&R(t,"length",{value:1+U(0,e.length-(arguments.length-1))}),t};var B=function(){return F(i,x,arguments)};R?R(c,"apply",{value:B}):c.apply=B;var N,D=c(k("String.prototype.indexOf")),V=function(e,t){var r=k(e,!!t);return"function"==typeof r&&D(e,".prototype.")>-1?c(r):r},M=t(),G=V("Object.prototype.toString"),_=function(e){return!(M&&e&&"object"==typeof e&&Symbol.toStringTag in e)&&"[object Arguments]"===G(e)},W=function(e){return!!_(e)||null!==e&&"object"==typeof e&&"number"==typeof e.length&&e.length>=0&&"[object Array]"!==G(e)&&"[object Function]"===G(e.callee)},z=function(){return _(arguments)}();_.isLegacyArguments=W,N=z?_:W;var C,L=Object.prototype.toString,J=Function.prototype.toString,q=/^\s*(?:function)?\*/,H=t(),Z=Object.getPrototypeOf,K=Object.prototype.hasOwnProperty,Q=Object.prototype.toString,X=function(e,t,r){if("[object Function]"!==Q.call(t))throw new TypeError("iterator must be a function");var n=e.length;if(n===+n)for(var o=0;o<n;o++)t.call(r,e[o],o,e);else for(var i in e)K.call(e,i)&&t.call(r,e[i],i,e)},Y={};(function(e){(function(){"use strict";var t=["BigInt64Array","BigUint64Array","Float32Array","Float64Array","Int16Array","Int32Array","Int8Array","Uint16Array","Uint32Array","Uint8Array","Uint8ClampedArray"],r="undefined"==typeof globalThis?e:globalThis;Y=function(){for(var e=[],n=0;n<t.length;n++)"function"==typeof r[t[n]]&&(e[e.length]=t[n]);return e}}).call(this)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});var ee=k("%Object.getOwnPropertyDescriptor%",!0);if(ee)try{ee([],"length")}catch(Nt){ee=null}var te=ee,re={};(function(e){(function(){"use strict";var r=V("Object.prototype.toString"),n=t(),o="undefined"==typeof globalThis?e:globalThis,i=Y(),a=V("Array.prototype.indexOf",!0)||function(e,t){for(var r=0;r<e.length;r+=1)if(e[r]===t)return r;return-1},u=V("String.prototype.slice"),l={},p=Object.getPrototypeOf;n&&te&&p&&X(i,(function(e){var t=new o[e];if(Symbol.toStringTag in t){var r=p(t),n=te(r,Symbol.toStringTag);if(!n){var i=p(r);n=te(i,Symbol.toStringTag)}l[e]=n.get}})),re=function(e){if(!e||"object"!=typeof e)return!1;if(!n||!(Symbol.toStringTag in e)){var t=u(r(e),8,-1);return a(i,t)>-1}return!!te&&function(e){var t=!1;return X(l,(function(r,n){if(!t)try{t=r.call(e)===n}catch(Nt){}})),t}(e)}}).call(this)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});var ne={};(function(e){(function(){"use strict";var r=V("Object.prototype.toString"),n=t(),o="undefined"==typeof globalThis?e:globalThis,i=Y(),a=V("String.prototype.slice"),u={},l=Object.getPrototypeOf;n&&te&&l&&X(i,(function(e){if("function"==typeof o[e]){var t=new o[e];if(Symbol.toStringTag in t){var r=l(t),n=te(r,Symbol.toStringTag);if(!n){var i=l(r);n=te(i,Symbol.toStringTag)}u[e]=n.get}}})),ne=function(e){return!!re(e)&&(n&&Symbol.toStringTag in e?function(e){var t=!1;return X(u,(function(r,n){if(!t)try{var o=r.call(e);o===n&&(t=o)}catch(Nt){}})),t}(e):a(r(e),8,-1))}}).call(this)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});var oe={};function ie(e){return e.call.bind(e)}var ae="undefined"!=typeof BigInt,ue="undefined"!=typeof Symbol,le=ie(Object.prototype.toString),pe=ie(Number.prototype.valueOf),se=ie(String.prototype.valueOf),fe=ie(Boolean.prototype.valueOf);if(ae)var ce=ie(BigInt.prototype.valueOf);if(ue)var ye=ie(Symbol.prototype.valueOf);function de(e,t){if("object"!=typeof e)return!1;try{return t(e),!0}catch(Nt){return!1}}function be(e){return"[object Map]"===le(e)}function ge(e){return"[object Set]"===le(e)}function he(e){return"[object WeakMap]"===le(e)}function ve(e){return"[object WeakSet]"===le(e)}function me(e){return"[object ArrayBuffer]"===le(e)}function Ae(e){return"undefined"!=typeof ArrayBuffer&&(me.working?me(e):e instanceof ArrayBuffer)}function je(e){return"[object DataView]"===le(e)}function we(e){return"undefined"!=typeof DataView&&(je.working?je(e):e instanceof DataView)}oe.isArgumentsObject=N,oe.isGeneratorFunction=function(e){if("function"!=typeof e)return!1;if(q.test(J.call(e)))return!0;if(!H)return"[object GeneratorFunction]"===L.call(e);if(!Z)return!1;if(void 0===C){var t=function(){if(!H)return!1;try{return Function("return function*() {}")()}catch(Nt){}}();C=!!t&&Z(t)}return Z(e)===C},oe.isTypedArray=re,oe.isPromise=function(e){return"undefined"!=typeof Promise&&e instanceof Promise||null!==e&&"object"==typeof e&&"function"==typeof e.then&&"function"==typeof e.catch},oe.isArrayBufferView=function(e){return"undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):re(e)||we(e)},oe.isUint8Array=function(e){return"Uint8Array"===ne(e)},oe.isUint8ClampedArray=function(e){return"Uint8ClampedArray"===ne(e)},oe.isUint16Array=function(e){return"Uint16Array"===ne(e)},oe.isUint32Array=function(e){return"Uint32Array"===ne(e)},oe.isInt8Array=function(e){return"Int8Array"===ne(e)},oe.isInt16Array=function(e){return"Int16Array"===ne(e)},oe.isInt32Array=function(e){return"Int32Array"===ne(e)},oe.isFloat32Array=function(e){return"Float32Array"===ne(e)},oe.isFloat64Array=function(e){return"Float64Array"===ne(e)},oe.isBigInt64Array=function(e){return"BigInt64Array"===ne(e)},oe.isBigUint64Array=function(e){return"BigUint64Array"===ne(e)},be.working="undefined"!=typeof Map&&be(new Map),oe.isMap=function(e){return"undefined"!=typeof Map&&(be.working?be(e):e instanceof Map)},ge.working="undefined"!=typeof Set&&ge(new Set),oe.isSet=function(e){return"undefined"!=typeof Set&&(ge.working?ge(e):e instanceof Set)},he.working="undefined"!=typeof WeakMap&&he(new WeakMap),oe.isWeakMap=function(e){return"undefined"!=typeof WeakMap&&(he.working?he(e):e instanceof WeakMap)},ve.working="undefined"!=typeof WeakSet&&ve(new WeakSet),oe.isWeakSet=function(e){return ve(e)},me.working="undefined"!=typeof ArrayBuffer&&me(new ArrayBuffer),oe.isArrayBuffer=Ae,je.working="undefined"!=typeof ArrayBuffer&&"undefined"!=typeof DataView&&je(new DataView(new ArrayBuffer(1),0,1)),oe.isDataView=we;var Oe="undefined"!=typeof SharedArrayBuffer?SharedArrayBuffer:void 0;function Se(e){return"[object SharedArrayBuffer]"===le(e)}function Ie(e){return void 0!==Oe&&(void 0===Se.working&&(Se.working=Se(new Oe)),Se.working?Se(e):e instanceof Oe)}function Pe(e){return de(e,pe)}function Ee(e){return de(e,se)}function ke(e){return de(e,fe)}function xe(e){return ae&&de(e,ce)}function $e(e){return ue&&de(e,ye)}oe.isSharedArrayBuffer=Ie,oe.isAsyncFunction=function(e){return"[object AsyncFunction]"===le(e)},oe.isMapIterator=function(e){return"[object Map Iterator]"===le(e)},oe.isSetIterator=function(e){return"[object Set Iterator]"===le(e)},oe.isGeneratorObject=function(e){return"[object Generator]"===le(e)},oe.isWebAssemblyCompiledModule=function(e){return"[object WebAssembly.Module]"===le(e)},oe.isNumberObject=Pe,oe.isStringObject=Ee,oe.isBooleanObject=ke,oe.isBigIntObject=xe,oe.isSymbolObject=$e,oe.isBoxedPrimitive=function(e){return Pe(e)||Ee(e)||ke(e)||xe(e)||$e(e)},oe.isAnyArrayBuffer=function(e){return"undefined"!=typeof Uint8Array&&(Ae(e)||Ie(e))},["isProxy","isExternal","isModuleNamespaceObject"].forEach((function(e){Object.defineProperty(oe,e,{enumerable:!1,value:function(){throw new Error(e+" is not supported in userland")}})}));Object.create;var Fe,Te,Re,Ue=Fe={};function Be(){throw new Error("setTimeout has not been defined")}function Ne(){throw new Error("clearTimeout has not been defined")}function De(e){if(Te===setTimeout)return setTimeout(e,0);if((Te===Be||!Te)&&setTimeout)return Te=setTimeout,setTimeout(e,0);try{return Te(e,0)}catch(Nt){try{return Te.call(null,e,0)}catch(Nt){return Te.call(this,e,0)}}}!function(){try{Te="function"==typeof setTimeout?setTimeout:Be}catch(Nt){Te=Be}try{Re="function"==typeof clearTimeout?clearTimeout:Ne}catch(Nt){Re=Ne}}();var Ve,Me=[],Ge=!1,_e=-1;function We(){Ge&&Ve&&(Ge=!1,Ve.length?Me=Ve.concat(Me):_e=-1,Me.length&&ze())}function ze(){if(!Ge){var e=De(We);Ge=!0;for(var t=Me.length;t;){for(Ve=Me,Me=[];++_e<t;)Ve&&Ve[_e].run();_e=-1,t=Me.length}Ve=null,Ge=!1,function(e){if(Re===clearTimeout)return clearTimeout(e);if((Re===Ne||!Re)&&clearTimeout)return Re=clearTimeout,clearTimeout(e);try{Re(e)}catch(Nt){try{return Re.call(null,e)}catch(Nt){return Re.call(this,e)}}}(e)}}function Ce(e,t){this.fun=e,this.array=t}function Le(){}Ue.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r];Me.push(new Ce(e,t)),1!==Me.length||Ge||De(ze)},Ce.prototype.run=function(){this.fun.apply(null,this.array)},Ue.title="browser",Ue.browser=!0,Ue.env={},Ue.argv=[],Ue.version="",Ue.versions={},Ue.on=Le,Ue.addListener=Le,Ue.once=Le,Ue.off=Le,Ue.removeListener=Le,Ue.removeAllListeners=Le,Ue.emit=Le,Ue.prependListener=Le,Ue.prependOnceListener=Le,Ue.listeners=function(e){return[]},Ue.binding=function(e){throw new Error("process.binding is not supported")},Ue.cwd=function(){return"/"},Ue.chdir=function(e){throw new Error("process.chdir is not supported")},Ue.umask=function(){return 0};var Je={};(function(e){(function(){var t=Object.getOwnPropertyDescriptors||function(e){for(var t=Object.keys(e),r={},n=0;n<t.length;n++)r[t[n]]=Object.getOwnPropertyDescriptor(e,t[n]);return r};if(e.env.NODE_DEBUG){var r=e.env.NODE_DEBUG;r=r.replace(/[|\\{}()[\]^$+?.]/g,"\\$&").replace(/\*/g,".*").replace(/,/g,"$|^").toUpperCase(),new RegExp("^"+r+"$","i")}function n(e,t){var r={seen:[],stylize:i};return arguments.length>=3&&(r.depth=arguments[2]),arguments.length>=4&&(r.colors=arguments[3]),s(t)?r.showHidden=t:t&&Je._extend(r,t),d(r.showHidden)&&(r.showHidden=!1),d(r.depth)&&(r.depth=2),d(r.colors)&&(r.colors=!1),d(r.customInspect)&&(r.customInspect=!0),r.colors&&(r.stylize=o),a(r,e,r.depth)}function o(e,t){var r=n.styles[t];return r?"\x1b["+n.colors[r][0]+"m"+e+"\x1b["+n.colors[r][1]+"m":e}function i(e,t){return e}function a(e,t,r){if(e.customInspect&&t&&m(t.inspect)&&t.inspect!==Je.inspect&&(!t.constructor||t.constructor.prototype!==t)){var n=t.inspect(r,e);return y(n)||(n=a(e,n,r)),n}var o=function(e,t){if(d(t))return e.stylize("undefined","undefined");if(y(t)){var r="'"+JSON.stringify(t).replace(/^"|"$/g,"").replace(/'/g,"\\'").replace(/\\"/g,'"')+"'";return e.stylize(r,"string")}return c(t)?e.stylize(""+t,"number"):s(t)?e.stylize(""+t,"boolean"):f(t)?e.stylize("null","null"):void 0}(e,t);if(o)return o;var i=Object.keys(t),g=function(e){var t={};return e.forEach((function(e,r){t[e]=!0})),t}(i);if(e.showHidden&&(i=Object.getOwnPropertyNames(t)),v(t)&&(i.indexOf("message")>=0||i.indexOf("description")>=0))return u(t);if(0===i.length){if(m(t)){var A=t.name?": "+t.name:"";return e.stylize("[Function"+A+"]","special")}if(b(t))return e.stylize(RegExp.prototype.toString.call(t),"regexp");if(h(t))return e.stylize(Date.prototype.toString.call(t),"date");if(v(t))return u(t)}var w,O="",S=!1,I=["{","}"];return p(t)&&(S=!0,I=["[","]"]),m(t)&&(O=" [Function"+(t.name?": "+t.name:"")+"]"),b(t)&&(O=" "+RegExp.prototype.toString.call(t)),h(t)&&(O=" "+Date.prototype.toUTCString.call(t)),v(t)&&(O=" "+u(t)),0!==i.length||S&&0!=t.length?r<0?b(t)?e.stylize(RegExp.prototype.toString.call(t),"regexp"):e.stylize("[Object]","special"):(e.seen.push(t),w=S?function(e,t,r,n,o){for(var i=[],a=0,u=t.length;a<u;++a)j(t,String(a))?i.push(l(e,t,r,n,String(a),!0)):i.push("");return o.forEach((function(o){o.match(/^\d+$/)||i.push(l(e,t,r,n,o,!0))})),i}(e,t,r,g,i):i.map((function(n){return l(e,t,r,g,n,S)})),e.seen.pop(),function(e,t,r){return e.reduce((function(e,t){return t.indexOf("\n"),e+t.replace(/\u001b\[\d\d?m/g,"").length+1}),0)>60?r[0]+(""===t?"":t+"\n ")+" "+e.join(",\n  ")+" "+r[1]:r[0]+t+" "+e.join(", ")+" "+r[1]}(w,O,I)):I[0]+O+I[1]}function u(e){return"["+Error.prototype.toString.call(e)+"]"}function l(e,t,r,n,o,i){var u,l,p;if((p=Object.getOwnPropertyDescriptor(t,o)||{value:t[o]}).get?l=p.set?e.stylize("[Getter/Setter]","special"):e.stylize("[Getter]","special"):p.set&&(l=e.stylize("[Setter]","special")),j(n,o)||(u="["+o+"]"),l||(e.seen.indexOf(p.value)<0?(l=f(r)?a(e,p.value,null):a(e,p.value,r-1)).indexOf("\n")>-1&&(l=i?l.split("\n").map((function(e){return"  "+e})).join("\n").substr(2):"\n"+l.split("\n").map((function(e){return"   "+e})).join("\n")):l=e.stylize("[Circular]","special")),d(u)){if(i&&o.match(/^\d+$/))return l;(u=JSON.stringify(""+o)).match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?(u=u.substr(1,u.length-2),u=e.stylize(u,"name")):(u=u.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'"),u=e.stylize(u,"string"))}return u+": "+l}function p(e){return Array.isArray(e)}function s(e){return"boolean"==typeof e}function f(e){return null===e}function c(e){return"number"==typeof e}function y(e){return"string"==typeof e}function d(e){return void 0===e}function b(e){return g(e)&&"[object RegExp]"===A(e)}function g(e){return"object"==typeof e&&null!==e}function h(e){return g(e)&&"[object Date]"===A(e)}function v(e){return g(e)&&("[object Error]"===A(e)||e instanceof Error)}function m(e){return"function"==typeof e}function A(e){return Object.prototype.toString.call(e)}Je.inspect=n,n.colors={bold:[1,22],italic:[3,23],underline:[4,24],inverse:[7,27],white:[37,39],grey:[90,39],black:[30,39],blue:[34,39],cyan:[36,39],green:[32,39],magenta:[35,39],red:[31,39],yellow:[33,39]},n.styles={special:"cyan",number:"yellow",boolean:"yellow",undefined:"grey",null:"bold",string:"green",date:"magenta",regexp:"red"},Je.types=oe,Je.types.isRegExp=b,Je.types.isDate=h,Je.types.isNativeError=v;function j(e,t){return Object.prototype.hasOwnProperty.call(e,t)}Je._extend=function(e,t){if(!t||!g(t))return e;for(var r=Object.keys(t),n=r.length;n--;)e[r[n]]=t[r[n]];return e};var w="undefined"!=typeof Symbol?Symbol("util.promisify.custom"):void 0;Je.promisify=function(e){if("function"!=typeof e)throw new TypeError('The "original" argument must be of type Function');if(w&&e[w]){var r;if("function"!=typeof(r=e[w]))throw new TypeError('The "util.promisify.custom" argument must be of type Function');return Object.defineProperty(r,w,{value:r,enumerable:!1,writable:!1,configurable:!0}),r}function r(){for(var t,r,n=new Promise((function(e,n){t=e,r=n})),o=[],i=0;i<arguments.length;i++)o.push(arguments[i]);o.push((function(e,n){e?r(e):t(n)}));try{e.apply(this,o)}catch(a){r(a)}return n}return Object.setPrototypeOf(r,Object.getPrototypeOf(e)),w&&Object.defineProperty(r,w,{value:r,enumerable:!1,writable:!1,configurable:!0}),Object.defineProperties(r,t(e))},Je.promisify.custom=w}).call(this)}).call(this,Fe);var qe={},He=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(qe,"__esModule",{value:!0}),qe.Gubu=void 0;const Ze=He({name:"gubu",version:"0.1.0",description:"An object shape validation utility.",main:"gubu.js",browser:"gubu.min.js",type:"commonjs",types:"gubu.d.ts",homepage:"https://github.com/rjrodger/gubu",keywords:["gubu"],author:"Richard Rodger (http://richardrodger.com)",repository:{type:"git",url:"git://github.com/rjrodger/gubu.git"},scripts:{test:"jest --coverage","test-some":"jest -t","test-watch":"jest --coverage --watchAll","test-web":"npm run build && npm run build-web && browserify -o test/web.js -e test/entry.js -im && open test/web.html",watch:"tsc -w -d",build:"tsc -d","build-web":"cp gubu.js gubu.min.js && browserify -o gubu.min.js -e gubu.web.js -s Gubu -im -p tinyify",clean:"rm -rf node_modules yarn.lock package-lock.json",reset:"npm run clean && npm i && npm test","repo-tag":"REPO_VERSION=`node -e \"console.log(require('./package').version)\"` && echo TAG: v$REPO_VERSION && git commit -a -m v$REPO_VERSION && git push && git tag v$REPO_VERSION && git push --tags;","repo-publish":"npm run clean && npm i && npm run repo-publish-quick","repo-publish-quick":"npm run build && npm run test && npm run build-web && npm run test-web && npm run repo-tag && npm publish --access public --registry https://registry.npmjs.org "},license:"MIT",engines:{node:">=12"},files:["*.ts","*.js","*.map","LICENSE"],devDependencies:{"@types/jest":"^27.4.0",jest:"^27.4.7","ts-jest":"^27.1.2",typescript:"^4.5.4",browserify:"^17.0.0",tinyify:"^3.0.0"},dependencies:{}}),Ke=Symbol.for("gubu$"),Qe={gubu$:Ke,v$:Ze.default.version};class Xe{constructor(e,t,r){this.dI=0,this.nI=2,this.cI=-1,this.pI=0,this.sI=-1,this.valType="never",this.isRoot=!1,this.key="",this.type="never",this.stop=!0,this.nextSibling=!0,this.fromDefault=!1,this.err=[],this.parents=[],this.keys=[],this.path=[],this.root=e,this.vals=[e,-1],this.node=t,this.nodes=[t,-1],this.ctx=r||{}}next(){this.stop=!1,this.fromDefault=!1,this.isRoot=0===this.pI;let e=this.nodes[this.pI];for(;+e;)this.pI=+e,e=this.nodes[this.pI],this.dI--;e?(this.node=e,this.updateVal(this.vals[this.pI]),this.key=this.keys[this.pI],this.cI=this.pI,this.sI=this.pI+1,this.parent=this.parents[this.pI],this.nextSibling=!0,this.type=this.node.t,this.path[this.dI]=this.key,this.oval=this.val):this.stop=!0}updateVal(e){this.val=e,this.valType=typeof this.val,"number"===this.valType&&isNaN(this.val)&&(this.valType="nan"),this.isRoot&&(this.root=this.val)}}class Ye extends TypeError{constructor(e,t,r){super(t.map(e=>e.t).join("\n")),this.gubu=!0,this.name="GubuError",this.code=e,this.desc=()=>({name:"GubuError",code:e,err:t,ctx:r})}toJSON(){return{...this,err:this.desc().err,name:this.name,message:this.message}}}const et={String:!0,Number:!0,Boolean:!0,Object:!0,Array:!0,Function:!0,Symbol:!0,BigInt:!0},tt={string:"",number:0,boolean:!1,object:{},array:[],symbol:Symbol(""),bigint:BigInt(0),null:null};function rt(e,t){var r,n,o,i,a;if(null!=e&&(null===(r=e.$)||void 0===r?void 0:r.gubu$)){if(Ke===e.$.gubu$)return e.d=null==t?e.d:t,e;if(!0===e.$.gubu$){let r={...e};return r.$={v$:Ze.default.version,...r.$,gubu$:Ke},r.v=null!=r.v&&"object"==typeof r.v?{...r.v}:r.v,r.t=r.t||typeof r.v,"function"===r.t&&et[r.v.name]&&(r.t=r.v.name.toLowerCase(),r.v=Ft(tt[r.t])),r.r=!!r.r,r.o=!!r.o,r.d=null==t?null==r.d?-1:r.d:t,r.b=r.b||[],r.a=r.a||[],r.u=r.u||{},r}}let u=null===e?"null":typeof e,l=e,p=!1,s=void 0,f={};if("object"===(u="undefined"===u?"any":u))Array.isArray(e)?u="array":null!=l&&Function!==l.constructor&&Object!==l.constructor&&null!=l.constructor&&(u="instance",f.n=l.constructor.name,f.i=l.constructor);else if("function"===u)if(et[e.name])u=e.name.toLowerCase(),p=!0,l=Ft(tt[u]);else if(e.gubu===Qe||!0===(null===(n=e.$)||void 0===n?void 0:n.gubu)){let t=e.spec?e.spec():e;u=t.t,l=t.v,p=t.r,f=t.u}else void 0===e.prototype&&Function===e.constructor||Function===(null===(o=e.prototype)||void 0===o?void 0:o.constructor)?(u="custom",s=l):(u="instance",p=!0,f.n=null===(a=null===(i=l.prototype)||void 0===i?void 0:i.constructor)||void 0===a?void 0:a.name,f.i=l);else"number"===u&&isNaN(l)&&(u="nan");let c={$:Qe,t:u,v:null==l||"object"!==u&&"array"!==u?l:{...l},r:p,o:!1,d:null==t?-1:t,u:f,a:[],b:[]};return s&&c.b.push(s),c}function nt(e,t){const r=null==t?{}:t;r.name=null==r.name?"G"+(""+Math.random()).substring(2,8):""+r.name;let n=rt(e,0),o=function(e,t){let r=new Xe(e,n,t);for(;r.next(),!r.stop;){let e=!1;if(0<r.node.b.length)for(let t=0;t<r.node.b.length;t++){let n=ot(r.node.b[t],r);void 0!==n.done&&(e=n.done)}if(!e)if("never"===r.type)r.err.push(xt("never",r,1070));else if("object"===r.type)if(r.node.r&&void 0===r.val)r.err.push(xt("required",r,1010));else if(void 0===r.val||null!==r.val&&"object"===r.valType&&!Array.isArray(r.val)){if(!r.node.o||null!=r.val){r.updateVal(r.val||(r.fromDefault=!0,{}));let e=Object.keys(r.node.v);if(0<e.length){r.pI=r.nI;for(let t of e){let e=r.node.v[t]=rt(r.node.v[t],1+r.dI);r.nodes[r.nI]=e,r.vals[r.nI]=r.val[t],r.parents[r.nI]=r.val,r.keys[r.nI]=t,r.nI++}r.dI++,r.nodes[r.nI++]=r.sI,r.nextSibling=!1}}}else r.err.push(xt("type",r,1020));else if("array"===r.type)if(r.node.r&&void 0===r.val)r.err.push(xt("required",r,1030));else if(void 0===r.val||Array.isArray(r.val)){if(!r.node.o||null!=r.val){r.updateVal(r.val||(r.fromDefault=!0,[]));let e=Object.keys(r.node.v).filter(e=>!isNaN(+e));if(0<r.val.length||1<e.length){r.pI=r.nI;let t=void 0===r.node.v[0]?pt():r.node.v[0]=rt(r.node.v[0],1+r.dI),n=1;if(1<e.length)for(;n<e.length;n++){let e=r.node.v[n]=rt(r.node.v[n],1+r.dI);r.nodes[r.nI]=e,r.vals[r.nI]=r.val[n-1],r.parents[r.nI]=r.val,r.keys[r.nI]=""+(n-1),r.nI++}for(let e=n-1;e<r.val.length;e++)r.nodes[r.nI]=t,r.vals[r.nI]=r.val[e],r.parents[r.nI]=r.val,r.keys[r.nI]=""+e,r.nI++;r.dI++,r.nodes[r.nI++]=r.sI,r.nextSibling=!1}}}else r.err.push(xt("type",r,1040));else if("any"===r.type||"custom"===r.type||"list"===r.type||void 0===r.val||r.type===r.valType||"instance"===r.type&&r.node.u.i&&r.val instanceof r.node.u.i||"null"===r.type&&null===r.val)if(void 0===r.val){let e=r.path[r.dI];!r.node.r||"undefined"===r.type&&r.parent.hasOwnProperty(e)?(void 0!==r.node.v&&!r.node.o||"undefined"===r.type)&&(r.updateVal(r.node.v),r.fromDefault=!0):r.err.push(xt("required",r,1060))}else"string"!==r.type||""!==r.val||r.node.u.empty||r.err.push(xt("required",r,1080));else r.err.push(xt("type",r,1050));if(0<r.node.a.length)for(let t=0;t<r.node.a.length;t++){let n=ot(r.node.a[t],r);void 0!==n.done&&(e=n.done)}!r.parent||e||r.node.o||(r.parent[r.key]=r.val),r.nextSibling&&(r.pI=r.sI)}if(0<r.err.length){if(!r.ctx.err)throw new Ye("shape",r.err,r.ctx);r.ctx.err.push(...r.err)}return r.root};o.spec=()=>(o(void 0,{err:[]}),JSON.parse($t(n,(e,t)=>Ke===t||t)));let i="";return o.toString=o[Je.inspect.custom]=()=>(i=(i=""===i?$t(n&&n.$&&(Ke===n.$.gubu$||!0===n.$.gubu$)?n.v:n):i).substring(0,33)+(33<i.length?"...":""),`[Gubu ${r.name} ${i}]`),o.gubu=Qe,o}function ot(e,t){let r={done:!1};if(!e(t.val,r,t)||r.err){if(void 0===t.val&&(t.node.o||!t.node.r))return delete r.err,r;let n=r.why||"custom",o=it(t);if("object"==typeof r.err)t.err.push(...[r.err].flat().map(e=>(e.p=null==e.p?o:e.p,e.m=null==e.m?2010:e.m,e)));else{let r=e.name;null!=r&&""!=r||(r=33<(r=e.toString().replace(/[ \t\r\n]+/g," ")).length?r.substring(0,30)+"...":r),t.err.push(xt(n,t,1045,void 0,{},r))}}return void 0!==r.val&&t.updateVal(r.val),void 0!==r.node&&(t.node=r.node),void 0!==r.type&&(t.type=r.type),t.nI=void 0===r.nI?t.nI:r.nI,t.sI=void 0===r.sI?t.sI:r.sI,t.pI=void 0===r.pI?t.pI:r.pI,r}function it(e){return e.path.slice(1,e.dI+1).filter(e=>null!=e).join(".")}const at=function(e){let t=Et(this,e);return t.r=!0,void 0===e&&1===arguments.length&&(t.t="undefined",t.v=void 0),t},ut=function(e){let t=Et(this,e);return t.r=!1,t.o=!0,t},lt=function(e){let t=Et(this,e);return t.u.empty=!0,t},pt=function(e){let t=Et(this,e);return t.t="any",void 0!==e&&(t.v=e),t},st=function(e){let t=Et(this,e);return t.t="never",t},ft=function(...e){let t=Et();t.t="list";let r=e.map(e=>Rt(e));return t.u.list=e,t.b.push((function(e,t,n){let o=!0,i=[];for(let a of r){let t={...n.ctx,err:[]};a(e,t),0<t.err.length&&(o=!1,i.push(...t.err))}return o||(t.why="all",t.err=[kt(n,'Value "$VALUE" for path "$PATH" does not satisfy All shape:'),...i]),o})),t},ct=function(...e){let t=Et();t.t="list";let r=e.map(e=>Rt(e));return t.u.list=e,t.b.push((function(e,t,n){let o=!1,i=[];for(let a of r){let t={...n.ctx,err:[]};a(e,t),0<t.err.length?(o||(o=!1),i.push(...t.err)):o=!0}return o||(t.why="some",t.err=[kt(n,'Value "$VALUE" for path "$PATH" does not satisfy Some shape:'),...i]),o})),t},yt=function(...e){let t=Et();t.t="list";let r=e.map(e=>Rt(e));return t.u.list=e,t.b.push((function(e,t,n){let o=0,i=[];for(let a of r){let t={...n.ctx,err:[]};a(e,t),0<t.err.length&&(o++,i.push(...t.err))}return 1!==o&&(t.why="one",t.err=[kt(n,'Value "$VALUE" for path "$PATH" does not satisfy One shape:'),...i]),!0})),t},dt=function(...e){let t=Et();return t.b.push((function(t,r,n){for(let o=0;o<e.length;o++)if(t===e[o])return!0;return r.err=kt(n,'Value "$VALUE" for path "$PATH" must be exactly one of: '+e.map(e=>$t(e)).join(", ")+"."),!1})),t},bt=function(e,t){let r=Et(this,t);return r.b.push(e),r},gt=function(e,t){let r=Et(this,t);return r.a.push(e),r},ht=function(e){let t=Et(this,e);return t.b.push((function(e,r,n){if(null!=e&&"object"==typeof e){let o=Object.keys(e),i=t.v;"array"===n.node.t&&(i=Object.keys(t.v).slice(1).map(e=>{let t=parseInt(e);return isNaN(t)?e:t-1}).reduce((e,t)=>(e[t]=!0,e),{})),r.err=[];for(let e of o)void 0===i[e]&&r.err.push(xt("closed",n,3010,"",{k:e}));return 0===r.err.length}return!0})),t},vt=function(e,t){let r=Et(this,t),n="string"==typeof e?e:("object"==typeof e&&e||{}).name;return null!=n&&""!=n&&r.b.push((function(e,t,r){return(r.ctx.ref=r.ctx.ref||{})[n]=r.node,!0})),r},mt=function(e,t){let r=Et(this,t),n="object"==typeof e&&e||{},o="string"==typeof e?e:n.name,i=!!n.fill;return null!=o&&""!=o&&r.b.push((function(e,t,r){if(void 0!==e||i){let e=r.ctx.ref=r.ctx.ref||{};if(void 0!==e[o]){let r={...e[o]};r.t=r.t||"never",t.node=r,t.type=r.t}}return!0})),r},At=function(e,t){let r=Et(this,t),n="object"==typeof e&&e||{},o="string"==typeof e?e:n.name,i="boolean"==typeof n.keep?n.keep:void 0,a=Array.isArray(n.claim)?n.claim:[];if(null!=o&&""!=o){let e=(e,t,r)=>{if(void 0===e&&0<a.length){r.ctx.Args=r.ctx.Args||{},r.ctx.Args.fromDefault=r.ctx.Args.fromDefault||{};for(let e of a){let n=r.ctx.Args.fromDefault[e]||{};if(void 0!==r.parent[e]&&!n.yes){t.val=r.parent[o]=r.parent[e],t.node=n.node;for(let e=0;e<r.err.length;e++)r.err[e].k===n.key&&(r.err.splice(e,1),e--);if(i){let t=r.cI+1;r.nodes.splice(t,0,rt(n.dval)),r.vals.splice(t,0,void 0),r.parents.splice(t,0,r.parent),r.keys.splice(t,0,e),r.nI++,r.pI++}else delete r.parent[e];break}}void 0===t.val&&(t.val=r.node.v)}return!0};Object.defineProperty(e,"name",{value:"Rename:"+o}),r.b.push(e);let t=(e,t,r)=>(r.parent[o]=e,i||r.key===o||Array.isArray(r.parent)&&!1!==i||(delete r.parent[r.key],t.done=!0),r.ctx.Args=r.ctx.Args||{},r.ctx.Args.fromDefault=r.ctx.Args.fromDefault||{},r.ctx.Args.fromDefault[o]={yes:r.fromDefault,key:r.key,dval:r.node.v,node:r.node},!0);Object.defineProperty(t,"name",{value:"Rename:"+o}),r.a.push(t)}return r};function jt(e){return"number"==typeof e?e:"number"==typeof(null==e?void 0:e.length)?e.length:null!=e&&"object"==typeof e?Object.keys(e).length:NaN}const wt=function(e,t){let r=Et(this,t);return r.b.push((function(t,r,n){let o=jt(t);if(e<=o)return!0;let i="number"==typeof t?"":"length ";return r.err=kt(n,`Value "$VALUE" for path "$PATH" must be a minimum ${i}of ${e} (was ${o}).`),!1})),r},Ot=function(e,t){let r=Et(this,t);return r.b.push((function(t,r,n){let o=jt(t);if(o<=e)return!0;let i="number"==typeof t?"":"length ";return r.err=kt(n,`Value "$VALUE" for path "$PATH" must be a maximum ${i}of ${e} (was ${o}).`),!1})),r},St=function(e,t){let r=Et(this,t);return r.b.push((function(t,r,n){let o=jt(t);if(e<o)return!0;let i="number"==typeof t?"be":"have length";return r.err=kt(n,`Value "$VALUE" for path "$PATH" must ${i} above ${e} (was ${o}).`),!1})),r},It=function(e,t){let r=Et(this,t);return r.b.push((function(t,r,n){let o=jt(t);if(o<e)return!0;let i="number"==typeof t?"be":"have length";return r.err=kt(n,`Value "$VALUE" for path "$PATH" must ${i} below ${e} (was ${o}).`),!1})),r},Pt=function(e,t){let r=Et(null==t?this:e),n=rt(null==t?e:t);return r.a.push((function(e,t,r){if(null!=e){let t=Object.keys(r.node.v),o=Object.keys(e).reduce((e,r)=>(t.includes(r)||e.push(r),e),[]);if(0<o.length){let i=r.nI+o.length-1,a=r.nI;0<t.length?(a--,r.nodes[i]=r.nodes[a],r.vals[i]=r.vals[a],r.parents[i]=r.parents[a],r.keys[i]=r.keys[a]):(i++,r.nodes[i]=r.sI,r.pI=a);for(let t of o)r.nodes[a]=rt(n,1+r.dI),r.vals[a]=e[t],r.parents[a]=e,r.keys[a]=t,a++;r.nI=i+1,r.nextSibling=!1,r.dI++}}return!0})),r};function Et(e,t){let r=rt(void 0===e||e.window===e?t:e);return Object.assign(r,{Above:St,After:gt,All:ft,Any:pt,Before:bt,Below:It,Closed:ht,Define:vt,Empty:lt,Exact:dt,Max:Ot,Min:wt,Never:st,One:yt,Optional:ut,Refer:mt,Rename:At,Required:at,Some:ct,Value:Pt})}function kt(e,t,r){return xt(r||"custom",e,4e3,t)}function xt(e,t,r,n,o,i){let a={k:t.key,n:t.node,s:t.val,p:it(t),w:e,m:r,t:""},u=(void 0===t.val?"":$t(t.val)).replace(/"/g,"");return u=u.substring(0,77)+(77<u.length?"...":""),a.t=null==n||""===n?`Validation failed for path "${a.p}" with value "${u}" because `+("type"===e?"instance"===t.node.t?"the value is not an instance of "+t.node.u.n:"the value is not of type "+t.node.t:"required"===e?"the value is required":"closed"===e?`the property "${null==o?void 0:o.k}" is not allowed`:"never"===e?"no value is allowed":`check "${e+(i?": "+i:"")}" failed`)+".":n.replace(/\$VALUE/g,u).replace(/\$PATH/g,a.p),a}function $t(e,t){try{let r=JSON.stringify(e,(e,r)=>(t&&(r=t(e,r)),null!=r&&"object"==typeof r&&r.constructor&&"Object"!==r.constructor.name&&"Array"!==r.constructor.name?r="function"==typeof r.toString?r.toString():r.constructor.name:"function"==typeof r?r="function"==typeof nt[r.name]?void 0:r.name:"bigint"==typeof r&&(r=String(r.toString())),r));return String(r)}catch(Nt){return JSON.stringify(String(e))}}function Ft(e){return null==e||"object"!=typeof e?e:JSON.parse(JSON.stringify(e))}const Tt=e=>rt({...e,$:{gubu$:!0}});"undefined"!=typeof window&&(Object.defineProperty(St,"name",{value:"Above"}),Object.defineProperty(gt,"name",{value:"After"}),Object.defineProperty(ft,"name",{value:"All"}),Object.defineProperty(pt,"name",{value:"Any"}),Object.defineProperty(bt,"name",{value:"Before"}),Object.defineProperty(It,"name",{value:"Below"}),Object.defineProperty(ht,"name",{value:"Closed"}),Object.defineProperty(vt,"name",{value:"Define"}),Object.defineProperty(lt,"name",{value:"Empty"}),Object.defineProperty(dt,"name",{value:"Exact"}),Object.defineProperty(Ot,"name",{value:"Max"}),Object.defineProperty(wt,"name",{value:"Min"}),Object.defineProperty(st,"name",{value:"Never"}),Object.defineProperty(yt,"name",{value:"One"}),Object.defineProperty(ut,"name",{value:"Optional"}),Object.defineProperty(mt,"name",{value:"Refer"}),Object.defineProperty(At,"name",{value:"Rename"}),Object.defineProperty(at,"name",{value:"Required"}),Object.defineProperty(ct,"name",{value:"Some"}),Object.defineProperty(Pt,"name",{value:"Value"})),Object.assign(nt,{Above:St,After:gt,All:ft,Any:pt,Before:bt,Below:It,Closed:ht,Define:vt,Empty:lt,Exact:dt,Max:Ot,Min:wt,Never:st,One:yt,Optional:ut,Refer:mt,Rename:At,Required:at,Some:ct,Value:Pt,G$:Tt,buildize:Et,makeErr:kt,stringify:$t,Args:Ut}),Object.defineProperty(nt,"name",{value:"gubu"});const Rt=nt;function Ut(e,t){let r=void 0,n=Object.keys(e).reduce((t,n,o,i)=>{if(n.startsWith("...")&&o+1===i.length)r={name:n.substring(3),shape:e[n]};else{let r=n,i=(n.split(":")[1]||"").split(",").filter(e=>""!==e);0<i.length?n=r.split(":")[0]:i=void 0,t[o+1]=At({name:n,claim:i,keep:!0},e[r])}return t},[st()]);r&&(n[0]=gt((e,t,n)=>(n.parent[r.name]=n.parent[r.name]||[],n.parent[r.name].push(e),!0),r.shape),n=gt((e,t,n)=>(e&&(e[r.name]=e[r.name]||[]),!0),n));let o=Rt(n);if(t){let e=function(){let e=Array.prototype.slice.call(arguments),r=o(e);return t.call(this,r)};return null!=t.name&&""!=t.name&&Object.defineProperty(e,"name",{value:t.name+"_args"}),e}return o}qe.Gubu=Rt;const{Gubu:Bt}=qe;return Bt}));
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
module.exports={
  "name": "gubu",
  "version": "0.1.0",
  "description": "An object shape validation utility.",
  "main": "gubu.js",
  "browser": "gubu.min.js",
  "type": "commonjs",
  "types": "gubu.d.ts",
  "homepage": "https://github.com/rjrodger/gubu",
  "keywords": [
    "gubu"
  ],
  "author": "Richard Rodger (http://richardrodger.com)",
  "repository": {
    "type": "git",
    "url": "git://github.com/rjrodger/gubu.git"
  },
  "scripts": {
    "test": "jest --coverage",
    "test-some": "jest -t",
    "test-watch": "jest --coverage --watchAll",
    "test-web": "npm run build && npm run build-web && browserify -o test/web.js -e test/entry.js -im && open test/web.html",
    "watch": "tsc -w -d",
    "build": "tsc -d",
    "build-web": "cp gubu.js gubu.min.js && browserify -o gubu.min.js -e gubu.web.js -s Gubu -im -p tinyify",
    "clean": "rm -rf node_modules yarn.lock package-lock.json",
    "reset": "npm run clean && npm i && npm test",
    "repo-tag": "REPO_VERSION=`node -e \"console.log(require('./package').version)\"` && echo TAG: v$REPO_VERSION && git commit -a -m v$REPO_VERSION && git push && git tag v$REPO_VERSION && git push --tags;",
    "repo-publish": "npm run clean && npm i && npm run repo-publish-quick",
    "repo-publish-quick": "npm run build && npm run test && npm run build-web && npm run test-web && npm run repo-tag && npm publish --access public --registry https://registry.npmjs.org "
  },
  "license": "MIT",
  "engines": {
    "node": ">=12"
  },
  "files": [
    "*.ts",
    "*.js",
    "*.map",
    "LICENSE"
  ],
  "devDependencies": {
    "@types/jest": "^27.4.0",
    "jest": "^27.4.7",
    "ts-jest": "^27.1.2",
    "typescript": "^4.5.4",
    "browserify": "^17.0.0",
    "tinyify": "^3.0.0"
  },
  "dependencies": {}
}

},{}],3:[function(require,module,exports){
// Run: npm run test-web

// A quick and dirty abomination to partially run the unit tests inside an
// actual browser by simulating some of the Jest API.

const Jester = window.Jester = {
  exclude: [],
  state: {
    describe: {},
    unit: {},
    fail: {},
  }
}

// Ensure keys are sorted when JSONified.
function stringify(o) {
  if(null === o) return 'null'
  if('symbol' === typeof o) return String(o)
  if('object' !== typeof o) return ''+o
  return JSON.stringify(
    Object.keys(o)
      .sort()
      .reduce((a,k)=>(a[k]=o[k],a),{}),
    stringify) // Recusively!
}

function print(s) {
  let test = document.getElementById('test')
  test.innerHTML = test.innerHTML + s + '<br>'
}


window.describe = function(name, tests) {
  Jester.state.describe = { name }
  tests()
}
window.test = function(name, unit) {
  if(Jester.exclude.includes(name)) return;

  try {
    Jester.state.unit = { name }
    unit()
    // console.log('PASS:', name)
    print('PASS: '+name)
  }
  catch(e) {
    console.log(e)
    print('FAIL: '+name)
    print(e.message+'<br><pre>'+e.stack+'</pre>')
  }
}
window.expect = function(sval) {

  function pass(cval,ok) {
    // console.log('pass',cval,ok)
    if(!ok) {
      let state = Jester.state
      state.fail.found = sval
      state.fail.expected = cval
      let err =  new Error('FAIL: '+state.describe.name+' '+state.unit.name)
      throw err
    }
  }

  function passEqualJSON(cval) {
    let sjson = stringify(sval)
    let cjson = stringify(cval)

    let ok = sjson === cjson
    pass(cval, ok)
  }

  return {
    toEqual: (cval)=>{
      passEqualJSON(cval)
    },
    toBeDefined: (cval)=>pass(cval,undefined!==sval),
    toBeUndefined: (cval)=>pass(cval,undefined===sval),
    toMatch: (cval)=>pass(cval,sval.match(cval)),
    toThrow: (cval)=>{
      try {
        sval()
        pass(cval,false)
      }
      catch(e) {
        pass(cval,true)
      }
    },
    toMatchObject: (cval)=>{
      passEqualJSON(cval)
    },
  }
}


require('./gubu.test.js')

},{"./gubu.test.js":4}],4:[function(require,module,exports){
"use strict";
/* Copyright (c) 2021 Richard Rodger and other contributors, MIT License */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const package_json_1 = __importDefault(require("../package.json"));
const Large = require('./large');
const Long = require('./long');
// Handle web (Gubu) versus node ({Gubu}) export.
let GubuModule = require('../gubu');
if (GubuModule.Gubu) {
    GubuModule = GubuModule.Gubu;
}
const Gubu = GubuModule;
const G$ = Gubu.G$;
const buildize = Gubu.buildize;
const makeErr = Gubu.makeErr;
const stringify = Gubu.stringify;
const Args = Gubu.Args;
const Above = Gubu.Above;
const After = Gubu.After;
const All = Gubu.All;
const Any = Gubu.Any;
const Before = Gubu.Before;
const Below = Gubu.Below;
const Closed = Gubu.Closed;
const Define = Gubu.Define;
const Empty = Gubu.Empty;
const Exact = Gubu.Exact;
const Max = Gubu.Max;
const Min = Gubu.Min;
const Never = Gubu.Never;
const Optional = Gubu.Optional;
const One = Gubu.One;
const Refer = Gubu.Refer;
const Rename = Gubu.Rename;
const Required = Gubu.Required;
const Some = Gubu.Some;
const Value = Gubu.Value;
class Foo {
    constructor(a) {
        this.a = -1;
        this.a = a;
    }
}
class Bar {
    constructor(b) {
        this.b = -2;
        this.b = b;
    }
}
describe('gubu', () => {
    test('happy', () => {
        expect(Gubu()).toBeDefined();
        expect(Gubu().toString()).toMatch(/\[Gubu G\d+ undefined\]/);
        expect(Gubu(undefined, { name: 'foo' }).toString()).toMatch(/\[Gubu foo undefined\]/);
        expect(Gubu('x', { name: 'bar' }).toString()).toMatch(/\[Gubu bar "x"\]/);
        let g0 = Gubu({
            a: 'foo',
            b: 100
        });
        expect(g0({})).toEqual({ a: 'foo', b: 100 });
        expect(g0({ a: 'bar' })).toEqual({ a: 'bar', b: 100 });
        expect(g0({ b: 999 })).toEqual({ a: 'foo', b: 999 });
        expect(g0({ a: 'bar', b: 999 })).toEqual({ a: 'bar', b: 999 });
        expect(g0({ a: 'bar', b: 999, c: true })).toEqual({ a: 'bar', b: 999, c: true });
    });
    test('readme-quick', () => {
        // Property a is optional, must be a Number, and defaults to 1.
        // Property b is required, and must be a String.
        const shape = Gubu({ a: 1, b: String });
        // Object shape is good! Prints `{ a: 99, b: 'foo' }`
        expect(shape({ a: 99, b: 'foo' })).toEqual({ a: 99, b: 'foo' });
        // Object shape is also good. Prints `{ a: 1, b: 'foo' }`
        expect(shape({ b: 'foo' })).toEqual({ a: 1, b: 'foo' });
        // Object shape is bad. Throws an exception:
        // "TODO: msg"
        expect(() => shape({ a: 'BAD' })).toThrow('Validation failed for path "a" with value "BAD" because the value is not of type number.\nValidation failed for path "b" with value "" because the value is required.');
    });
    test('readme-common', () => {
        const optionShape = Gubu({
            host: 'localhost',
            port: 8080
        });
        // console.log(optionShape({}))
        expect(optionShape()).toEqual({
            host: 'localhost',
            port: 8080
        });
        expect(optionShape({})).toEqual({
            host: 'localhost',
            port: 8080
        });
        expect(optionShape({ host: 'foo' })).toEqual({
            host: 'foo',
            port: 8080
        });
        expect(optionShape({ host: 'foo', port: undefined })).toEqual({
            host: 'foo',
            port: 8080
        });
        expect(optionShape({ host: 'foo', port: 9090 })).toEqual({
            host: 'foo',
            port: 9090
        });
        expect(() => optionShape({ host: 9090 })).toThrow('type');
        expect(() => optionShape({ port: '9090' })).toThrow('type');
        expect(() => optionShape({ host: '' })).toThrow('required');
        // TODO: better example to show deep structure defaults
        // const productListShape = Gubu({
        //   v: { p: [{ name: String, price: Number }] }
        //   // view: {
        //   // discounts: [{ name: String, percent: (v: any) => 0 < v && v < 100 }],
        //   // products: [
        //   //   { name: String, price: Number }
        //   // ]
        //   // }
        // })
        // // expect(productListShape({})).toEqual({ view: { discounts: [], products: [] } })
        // let update = { err: [] }
        // let result = productListShape({
        //   // FIX - ARRAYS BROKEN!
        //   v: { p: [{ name: 'x', price: 1 }, { name: 'foo', price: undefined }] }
        //   // view: {
        //   // products: [
        //   //   { name: 'Apple', price: 100 },
        //   //   { name: 'Pear', price: 200 },
        //   //   // { name: 'Banana', price: undefined }
        //   //   { name: 'Banana', price: 'x' }
        //   // ]
        //   // }
        // })// , update)
        // console.dir(result, { depth: null })
        // console.log(update)
    });
    test('scalar-optional-basic', () => {
        let g0 = Gubu(1);
        expect(g0(2)).toEqual(2);
        expect(g0()).toEqual(1);
        expect(() => g0('x')).toThrow('Validation failed for path "" with value "x" because the value is not of type number.');
    });
    test('object-optional-basic', () => {
        let g0 = Gubu({ x: 1 });
        expect(g0({ x: 2 })).toEqual({ x: 2 });
        expect(g0({})).toEqual({ x: 1 });
        expect(g0()).toEqual({ x: 1 });
        expect(() => g0('x')).toThrow('Validation failed for path "" with value "x" because the value is not of type object.');
    });
    test('array-optional-basic', () => {
        let g0 = Gubu([1]);
        expect(g0([11, 22])).toEqual([11, 22]);
        expect(g0([11])).toEqual([11]);
        expect(g0([])).toEqual([]);
        expect(g0()).toEqual([]);
        expect(() => g0('x')).toThrow('Validation failed for path "" with value "x" because the value is not of type array.');
    });
    test('error-basic', () => {
        let g0 = Gubu(Number);
        expect(g0(1)).toEqual(1);
        expect(() => g0('x')).toThrow('Validation failed for path "" with value "x" because the value is not of type number.');
    });
    test('shapes-basic', () => {
        let tmp = {};
        expect(Gubu(String)('x')).toEqual('x');
        expect(Gubu(Number)(1)).toEqual(1);
        expect(Gubu(Boolean)(true)).toEqual(true);
        expect(Gubu(BigInt)(BigInt(1))).toEqual(BigInt(1));
        expect(Gubu(Object)({ x: 1 })).toEqual({ x: 1 });
        expect(Gubu(Array)([1])).toEqual([1]);
        expect(Gubu(Function)(tmp.f0 = () => true)).toEqual(tmp.f0);
        expect(Gubu(Symbol)(tmp.s0 = Symbol('foo'))).toEqual(tmp.s0);
        expect(Gubu(Date)(tmp.d0 = new Date())).toEqual(tmp.d0);
        expect(Gubu(RegExp)(tmp.r0 = /a/)).toEqual(tmp.r0);
        expect(Gubu(Foo)(tmp.c0 = new Foo(2))).toEqual(tmp.c0);
        // console.log(gubu(new Date()).spec())
        expect(Gubu('a')('x')).toEqual('x');
        expect(Gubu(0)(1)).toEqual(1);
        expect(Gubu(false)(true)).toEqual(true);
        expect(Gubu(BigInt(-1))(BigInt(1))).toEqual(BigInt(1));
        expect(Gubu({})({ x: 1 })).toEqual({ x: 1 });
        expect(Gubu([])([1])).toEqual([1]);
        // NOTE: raw function would be a custom validator
        expect(Gubu(G$({ v: () => null }))(tmp.f1 = () => false)).toEqual(tmp.f1);
        expect(Gubu(Symbol('bar'))(tmp.s0)).toEqual(tmp.s0);
        expect(Gubu(new Date())(tmp.d1 = new Date(Date.now() - 1111))).toEqual(tmp.d1);
        expect(Gubu(new RegExp('a'))(tmp.r1 = /b/)).toEqual(tmp.r1);
        expect(Gubu(new Foo(4))(tmp.c1 = new Foo(5))).toEqual(tmp.c1);
        expect(Gubu(new Bar(6))(tmp.c2 = new Bar(7))).toEqual(tmp.c2);
        expect(Gubu(null)(null)).toEqual(null);
        expect(() => Gubu(null)(1)).toThrow(/path "".*value "1".*not of type null/);
        expect(Gubu((_v, u) => (u.val = 1, true))(null)).toEqual(1);
        // console.log(gubu(Date).spec())
        expect(() => Gubu(String)(1)).toThrow(/path "".*not of type string/);
        expect(() => Gubu(Number)('x')).toThrow(/path "".*not of type number/);
        expect(() => Gubu(Boolean)('x')).toThrow(/path "".*not of type boolean/);
        expect(() => Gubu(BigInt)('x')).toThrow(/path "".*not of type bigint/);
        expect(() => Gubu(Object)('x')).toThrow(/path "".*not of type object/);
        expect(() => Gubu(Array)('x')).toThrow(/path "".*not of type array/);
        expect(() => Gubu(Function)('x')).toThrow(/path "".*not of type function/);
        expect(() => Gubu(Symbol)('x')).toThrow(/path "".*not of type symbol/);
        expect(() => Gubu(Date)(/a/)).toThrow(/path "".*not an instance of Date/);
        expect(() => Gubu(RegExp)(new Date()))
            .toThrow(/path "".*not an instance of RegExp/);
        expect(() => Gubu(Foo)(tmp.c3 = new Bar(8)))
            .toThrow(/path "".*not an instance of Foo/);
        expect(() => Gubu(Bar)(tmp.c4 = new Foo(9)))
            .toThrow(/path "".*not an instance of Bar/);
        // console.log(gubu(new Date()).spec())
        expect(() => Gubu('a')(1)).toThrow(/path "".*not of type string/);
        expect(() => Gubu(0)('x')).toThrow(/path "".*not of type number/);
        expect(() => Gubu(false)('x')).toThrow(/path "".*not of type boolean/);
        expect(() => Gubu(BigInt(-1))('x')).toThrow(/path "".*not of type bigint/);
        expect(() => Gubu({})('x')).toThrow(/path "".* not of type object/);
        expect(() => Gubu([])('x')).toThrow(/path "".*not of type array/);
        expect(() => Gubu(G$({ v: () => null }))('x'))
            .toThrow(/path "".*not of type function/);
        expect(() => Gubu(Symbol('bar'))('x')).toThrow(/path "".*not of type symbol/);
        expect(() => Gubu(new Date())('x')).toThrow(/path "".*not an instance of Date/);
        expect(() => Gubu(new RegExp('a'))('x'))
            .toThrow(/path "".*not an instance of RegExp/);
        expect(() => Gubu(new Foo(4))('a')).toThrow(/path "".*not an instance of Foo/);
        expect(() => Gubu(new Bar(6))('a')).toThrow(/path "".*not an instance of Bar/);
        expect(() => Gubu(new Foo(10))(new Bar(11)))
            .toThrow(/path "".*not an instance of Foo/);
        expect(() => Gubu(new Bar(12))(new Foo(12)))
            .toThrow(/path "".*not an instance of Bar/);
        expect(Gubu({ a: String })({ a: 'x' })).toEqual({ a: 'x' });
        expect(Gubu({ a: Number })({ a: 1 })).toEqual({ a: 1 });
        expect(Gubu({ a: Boolean })({ a: true })).toEqual({ a: true });
        expect(Gubu({ a: Object })({ a: { x: 1 } })).toEqual({ a: { x: 1 } });
        expect(() => Gubu({ a: String })({ a: 1 }))
            .toThrow(/path "a".*not of type string/);
        expect(() => Gubu({ a: Number })({ a: 'x' }))
            .toThrow(/path "a".*not of type number/);
        expect(() => Gubu({ a: Boolean })({ a: 'x' }))
            .toThrow(/path "a".*not of type boolean/);
        expect(() => Gubu({ a: Object })({ a: 'x' }))
            .toThrow(/path "a".*not of type object/);
        expect(Gubu([String])(['x'])).toEqual(['x']);
        expect(Gubu([Number])([1])).toEqual([1]);
        expect(Gubu([Boolean])([true])).toEqual([true]);
        expect(Gubu([Object])([{ x: 1 }])).toEqual([{ x: 1 }]);
        expect(() => Gubu([String])([1]))
            .toThrow(/path "0".*not of type string/);
        expect(() => Gubu([Number])(['x']))
            .toThrow(/path "0".*not of type number/);
        expect(() => Gubu([Boolean])(['x']))
            .toThrow(/path "0".*not of type boolean/);
        expect(() => Gubu([Object])([1]))
            .toThrow(/path "0".*not of type object/);
    });
    test('shapes-fails', () => {
        let tmp = {};
        let string0 = Gubu(String);
        expect(string0('x')).toEqual('x');
        expect(() => string0(1)).toThrow(/not of type string/);
        expect(() => string0(true)).toThrow(/not of type string/);
        expect(() => string0(BigInt(11))).toThrow(/not of type string/);
        expect(() => string0(null)).toThrow(/not of type string/);
        expect(() => string0({})).toThrow(/not of type string/);
        expect(() => string0([])).toThrow(/not of type string/);
        expect(() => string0(/a/)).toThrow(/not of type string/);
        expect(() => string0(NaN)).toThrow(/not of type string/);
        expect(() => string0(Infinity)).toThrow(/not of type string/);
        expect(() => string0(undefined)).toThrow(/value is required/);
        expect(() => string0(new Date())).toThrow(/not of type string/);
        expect(() => string0(new Foo(1))).toThrow(/not of type string/);
        let number0 = Gubu(Number);
        expect(number0(1)).toEqual(1);
        expect(number0(Infinity)).toEqual(Infinity);
        expect(() => number0('x')).toThrow(/not of type number/);
        expect(() => number0(true)).toThrow(/not of type number/);
        expect(() => number0(BigInt(11))).toThrow(/not of type number/);
        expect(() => number0(null)).toThrow(/not of type number/);
        expect(() => number0({})).toThrow(/not of type number/);
        expect(() => number0([])).toThrow(/not of type number/);
        expect(() => number0(/a/)).toThrow(/not of type number/);
        expect(() => number0(NaN)).toThrow(/not of type number/);
        expect(() => number0(undefined)).toThrow(/value is required/);
        expect(() => number0(new Date())).toThrow(/not of type number/);
        expect(() => number0(new Foo(1))).toThrow(/not of type number/);
        let object0 = Gubu(Object);
        expect(object0({})).toEqual({});
        expect(object0(tmp.r0 = /a/)).toEqual(tmp.r0);
        expect(object0(tmp.d0 = new Date())).toEqual(tmp.d0);
        expect(object0(tmp.f0 = new Foo(1))).toEqual(tmp.f0);
        expect(() => object0(1)).toThrow(/not of type object/);
        expect(() => object0('x')).toThrow(/not of type object/);
        expect(() => object0(true)).toThrow(/not of type object/);
        expect(() => object0(BigInt(11))).toThrow(/not of type object/);
        expect(() => object0(null)).toThrow(/not of type object/);
        expect(() => object0([])).toThrow(/not of type object/);
        expect(() => object0(NaN)).toThrow(/not of type object/);
        expect(() => object0(undefined)).toThrow(/value is required/);
        let array0 = Gubu(Array);
        expect(array0([])).toEqual([]);
        expect(() => array0('x')).toThrow(/not of type array/);
        expect(() => array0(true)).toThrow(/not of type array/);
        expect(() => array0(BigInt(11))).toThrow(/not of type array/);
        expect(() => array0(null)).toThrow(/not of type array/);
        expect(() => array0({})).toThrow(/not of type array/);
        expect(() => array0(/a/)).toThrow(/not of type array/);
        expect(() => array0(NaN)).toThrow(/not of type array/);
        expect(() => array0(undefined)).toThrow(/value is required/);
        expect(() => array0(new Date())).toThrow(/not of type array/);
        expect(() => array0(new Foo(1))).toThrow(/not of type array/);
    });
    test('shapes-builtins', () => {
        let d0 = new Date(2121, 1, 1);
        let g0 = Gubu({ a: Date });
        expect(g0({ a: d0 })).toEqual({ a: d0 });
        expect(() => g0({})).toThrow('required');
        expect(() => g0({ a: Date })).toThrow('instance');
        expect(() => g0({ a: /QXQ/ })).toThrow(/QXQ.*instance/);
        let g1 = Gubu({ a: Optional(Date) });
        expect(g1({ a: d0 })).toEqual({ a: d0 });
        expect(g1({})).toEqual({});
        let r0 = /a/;
        let g2 = Gubu({ a: RegExp });
        expect(g2({ a: r0 })).toEqual({ a: r0 });
        expect(() => g2({})).toThrow('required');
        expect(() => g2({ a: RegExp })).toThrow('instance');
        expect(() => g2({ a: d0 })).toThrow(/2121.*instance/);
        let g3 = Gubu({ a: Optional(RegExp) });
        expect(g3({ a: r0 })).toEqual({ a: r0 });
        expect(g3({})).toEqual({});
    });
    test('shapes-edges', () => {
        // NaN is actually Not-a-Number (whereas 'number' === typeof(NaN))
        const num0 = Gubu(1);
        expect(num0(1)).toEqual(1);
        expect(() => num0(NaN)).toThrow(/not of type number/);
        const nan0 = Gubu(NaN);
        expect(nan0(NaN)).toEqual(NaN);
        expect(() => nan0(1)).toThrow(/not of type nan/);
        // Empty strings only allowed by Empty() builder.
        const rs0 = Gubu(String);
        expect(rs0('x')).toEqual('x');
        expect(() => rs0('')).toThrow('Validation failed for path "" with value "" because the value is required.');
        const rs0e = Gubu(Empty(String));
        expect(rs0e('x')).toEqual('x');
        expect(rs0e('')).toEqual('');
        const os0 = Gubu('x');
        // expect(os0('')).toEqual('x')
        expect(() => os0('')).toThrow('required');
        expect(os0()).toEqual('x');
        expect(os0(undefined)).toEqual('x');
        expect(os0('x')).toEqual('x');
        expect(os0('y')).toEqual('y');
        const os0e = Gubu(Empty('x'));
        expect(os0e('')).toEqual('');
        expect(os0e()).toEqual('x');
        expect(os0e(undefined)).toEqual('x');
        expect(os0e('x')).toEqual('x');
        expect(os0e('y')).toEqual('y');
        const os1e = Gubu(Optional(Empty(String)));
        expect(os1e()).toEqual(undefined);
        expect(os1e('')).toEqual('');
        expect(os1e('x')).toEqual('x');
        const os1eO = Gubu({ a: Optional(Empty(String)) });
        expect(os1eO({})).toEqual({});
        expect(os1eO({ a: '' })).toEqual({ a: '' });
        expect(os1eO({ a: 'x' })).toEqual({ a: 'x' });
        // Long values are truncated in error descriptions.
        expect(() => Gubu(Number)('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')).toThrow('Validation failed for path "" with value "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa..." because the value is not of type number.');
        // Explicit `undefined` and `null`
        const u0 = Gubu({ a: undefined });
        expect(u0({ a: undefined })).toEqual({ a: undefined });
        expect(u0({})).toEqual({ a: undefined });
        const u0n = Gubu({ a: null });
        expect(u0n({ a: null })).toEqual({ a: null });
        expect(u0n({})).toEqual({ a: null });
        expect(() => u0n({ a: 1 })).toThrow('type');
        const u1 = Gubu({ a: Required(undefined) });
        expect(u1({ a: undefined })).toEqual({ a: undefined });
        expect(() => u1({})).toThrow('required');
        const u1n = Gubu({ a: Required(null) });
        expect(u1n({ a: null })).toEqual({ a: null });
        expect(() => u1n({})).toThrow('required');
        expect(() => u1n({ a: 1 })).toThrow('type');
        const u2 = Gubu({ a: Required(NaN) });
        expect(u2({ a: NaN })).toEqual({ a: NaN });
        expect(() => u2({})).toThrow('required');
    });
    test('api-object', () => {
        let obj01 = Gubu({
            a: { x: 1 },
            b: Optional({ y: 2 }),
            c: Optional({ z: Optional({ k: 3 }) }),
        });
        expect(obj01({})).toEqual({ a: { x: 1 } });
        expect(obj01({ b: {} })).toEqual({ a: { x: 1 }, b: { y: 2 } });
        expect(obj01({ c: {} })).toEqual({ a: { x: 1 }, c: {} });
        expect(obj01({ c: { z: {} } })).toEqual({ a: { x: 1 }, c: { z: { k: 3 } } });
        let obj11 = Gubu({
            people: Required({}).Value({ name: String, age: Number })
        });
        expect(obj11({
            people: {
                alice: { name: 'Alice', age: 99 },
                bob: { name: 'Bob', age: 98 },
            }
        })).toEqual({
            people: {
                alice: { name: 'Alice', age: 99 },
                bob: { name: 'Bob', age: 98 },
            }
        });
        expect(() => obj11({
            people: {
                alice: { name: 'Alice', age: 99 },
                bob: { name: 'Bob' }
            }
        })).toThrow('Validation failed for path "people.bob.age" with value "" because the value is required.');
        expect(() => obj11({})).toThrow('Validation failed for path "people" with value "" because the value is required.');
    });
    test('builder-construct', () => {
        const GUBU$ = Symbol.for('gubu$');
        expect(Required('x')).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: 'x',
            r: true,
        });
        expect(Optional(String)).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: '',
            r: false,
        });
        expect(Required(Required('x'))).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: 'x',
            r: true,
        });
        expect(Optional(Required('x'))).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: 'x',
            r: false,
        });
        expect(Required('x').Required()).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: 'x',
            r: true,
        });
        expect(Required('x').Optional()).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: 'x',
            r: false,
        });
        expect(Optional(Optional(String))).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: '',
            r: false,
        });
        expect(Optional(String).Optional()).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: '',
            r: false,
        });
        expect(Optional(String).Required()).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: '',
            r: true,
        });
        expect(Required(Optional(String))).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: '',
            r: true,
        });
    });
    test('type-default-optional', () => {
        let f0 = () => true;
        let g0 = Gubu({
            string: 's',
            number: 1,
            boolean: true,
            object: { x: 2 },
            array: [3],
            function: G$({ t: 'function', v: f0 })
        });
        expect(g0({})).toMatchObject({
            string: 's',
            number: 1,
            boolean: true,
            object: { x: 2 },
            array: [],
            function: f0
        });
        expect(g0({
            string: 'S',
            number: 11,
            boolean: false,
            object: { x: 22 },
            array: [33],
            // function: f0,
        })).toMatchObject({
            string: 'S',
            number: 11,
            boolean: false,
            object: { x: 22 },
            array: [33],
            // function: f0,
        });
        // TODO: fails
    });
    test('type-native-required', () => {
        let g0 = Gubu({
            string: String,
            number: Number,
            boolean: Boolean,
            object: Object,
            array: Array,
            function: Function,
            // TODO: any type? Date, RegExp, Custom ???
        });
        let o0 = {
            string: 's',
            number: 1,
            boolean: true,
            object: { x: 2 },
            array: [3],
            function: () => true
        };
        expect(g0(o0)).toMatchObject(o0);
        let e0 = Gubu({ s0: String, s1: 'x' });
        expect(e0({ s0: 'a' })).toMatchObject({ s0: 'a', s1: 'x' });
        expect(() => e0({ s0: 1 })).toThrow(/Validation failed for path "s0" with value "1" because the value is not of type string\./);
        expect(() => e0({ s1: 1 })).toThrow(/Validation failed for path "s0" with value "" because the value is required\.\nValidation failed for path "s1" with value "1" because the value is not of type string\./);
        // TODO: more fails
    });
    test('type-native-optional', () => {
        let { Optional } = Gubu;
        // Explicit Optional over native type sets no value.
        let g0 = Gubu({
            string: Optional(String),
            number: Optional(Number),
            boolean: Optional(Boolean),
            object: Optional(Object),
            array: Optional(Array),
            function: Optional(Function),
        });
        expect(g0({})).toEqual({});
    });
    test('array-elements', () => {
        let g0 = Gubu({
            a: [String]
        });
        expect(g0({ a: [] })).toEqual({ a: [] });
        expect(g0({ a: ['X'] })).toEqual({ a: ['X'] });
        expect(g0({ a: ['X', 'Y'] })).toEqual({ a: ['X', 'Y'] });
        expect(g0({ a: ['X', 'Y', 'Z'] })).toEqual({ a: ['X', 'Y', 'Z'] });
        expect(() => g0({ a: [null] })).toThrow(/"a.0".*"null".*type string/);
        expect(() => g0({ a: [''] })).toThrow(/"a.0".*"".*required/);
        expect(() => g0({ a: [11] })).toThrow(/"a.0".*"11".*type string/);
        expect(() => g0({ a: ['X', 11] })).toThrow(/"a.1".*"11".*type string/);
        expect(() => g0({ a: ['X', 'Y', 11] })).toThrow(/"a.2".*"11".*type string/);
        expect(() => g0({ a: ['X', 'Y', 'Z', 11] })).toThrow(/"a.3".*"11".*type string/);
        expect(() => g0({ a: ['X', null] })).toThrow(/"a.1".*"null".*type string/);
        expect(() => g0({ a: ['X', ''] })).toThrow(/"a.1".*"".*required/);
        expect(() => g0({ a: [11, 'K'] })).toThrow(/"a.0".*"11".*string/);
        expect(() => g0({ a: ['X', 11, 'K'] })).toThrow(/"a.1".*"11".*string/);
        expect(() => g0({ a: ['X', 'Y', 11, 'K'] })).toThrow(/"a.2".*"11".*string/);
        expect(() => g0({ a: ['X', 'Y', 'Z', 11, 'K'] })).toThrow(/"a.3".*"11".*string/);
        expect(() => g0({ a: [22, 'Y', 11, 'K'] })).toThrow(/"a.0".*"22".*"a.2".*"11"/s);
        expect(() => g0({ a: ['X', 'Y', 'Z', 11, 'K', 'L'] })).toThrow(/"a.3".*"11"/);
        let g1 = Gubu([String]);
        expect(g1(['X', 'Y'])).toEqual(['X', 'Y']);
        expect(() => g1(['X', 1])).toThrow(/Validation failed for path "1" with value "1" because the value is not of type string\./);
        let g2 = Gubu([Any(), { x: 1 }, { y: true }]);
        expect(g2([{ x: 2 }, { y: false }])).toEqual([{ x: 2 }, { y: false }]);
        expect(g2([{ x: 2 }, { y: false }, 'Q'])).toEqual([{ x: 2 }, { y: false }, 'Q']);
        expect(() => g2([{ x: 'X' }, { y: false }])).toThrow('Validation failed for path "0.x" with value "X" because the value is not of type number.');
        expect(() => g2(['Q', { y: false }])).toThrow('Validation failed for path "0" with value "Q" because the value is not of type object.');
        expect(g2([{ x: 2 }])).toEqual([{ x: 2 }, { y: true }]);
        expect(g2([undefined, { y: false }, 'Q'])).toEqual([{ x: 1 }, { y: false }, 'Q']);
        let g3 = Gubu([null]);
        expect(g3([null, null])).toEqual([null, null]);
        // NOTE: array without spec can hold anything.
        let g4 = Gubu([]);
        expect(g4([null, 1, 'x', true])).toEqual([null, 1, 'x', true]);
        expect(() => Gubu({ x: 1 })('q')).toThrow(/type object/);
        expect(() => Gubu({ y: { x: 1 } })({ y: 'q' })).toThrow(/type object/);
        let g5 = Gubu([{ x: 1 }]);
        expect(g5([])).toEqual([]);
        expect(g5([{ x: 11 }])).toEqual([{ x: 11 }]);
        expect(g5([{ x: 11 }, { x: 22 }])).toEqual([{ x: 11 }, { x: 22 }]);
        expect(g5([{ x: 11 }, { x: 22 }, { x: 33 }]))
            .toEqual([{ x: 11 }, { x: 22 }, { x: 33 }]);
        expect(() => g5(['q'])).toThrow(/"0".*"q".*type object/);
        expect(() => g5([{ x: 11 }, 'q'])).toThrow(/"1".*"q".*type object/);
        expect(() => g5([{ x: 11 }, { y: 22 }, 'q'])).toThrow(/"2".*"q".*type object/);
        expect(() => g5([{ x: 11 }, { y: 22 }, { z: 33 }, 'q'])).toThrow(/"3".*"q".*type object/);
        expect(() => g5(['q', { k: 99 }])).toThrow(/"0".*"q".*type object/);
        expect(() => g5([{ x: 11 }, 'q', { k: 99 }])).toThrow(/"1".*"q".*type object/);
        expect(() => g5([{ x: 11 }, { y: 22 }, 'q', { k: 99 }]))
            .toThrow(/"2".*"q".*type object/);
        expect(() => g5([{ x: 11 }, { y: 22 }, { z: 33 }, 'q', { k: 99 }]))
            .toThrow(/"3".*"q".*type object/);
    });
    test('object-properties', () => {
        // NOTE: unclosed object without props can hold anything
        let g0 = Gubu({});
        expect(g0({ a: null, b: 1, c: 'x', d: true }))
            .toEqual({ a: null, b: 1, c: 'x', d: true });
        let g1 = Gubu(Closed({}));
        expect(g1({})).toEqual({});
        expect(() => g1({ a: null, b: 1, c: 'x', d: true })).toThrow('Validation failed for path "" with value "{a:null,b:1,c:x,d:true}" because the property "a" is not allowed.\nValidation failed for path "" with value "{a:null,b:1,c:x,d:true}" because the property "b" is not allowed.\nValidation failed for path "" with value "{a:null,b:1,c:x,d:true}" because the property "c" is not allowed.\nValidation failed for path "" with value "{a:null,b:1,c:x,d:true}" because the property "d" is not allowed.');
    });
    test('custom-basic', () => {
        let g0 = Gubu({ a: (v) => v > 10 });
        expect(g0({ a: 11 })).toMatchObject({ a: 11 });
        expect(() => g0({ a: 9 })).toThrow(/Validation failed for path "a" with value "9" because check "custom: a" failed\./);
        let g1 = Gubu({ a: Optional((v) => v > 10) });
        expect(g1({ a: 11 })).toMatchObject({ a: 11 });
        expect(() => g1({ a: 9 })).toThrow('Validation failed for path "a" with value "9" because check "custom: (v) => v > 10" failed.');
        expect(g1({})).toMatchObject({});
        let g2 = Gubu({ a: Required((v) => v > 10) });
        expect(g1({ a: 11 })).toMatchObject({ a: 11 });
        expect(() => g2({ a: 9 })).toThrow('Validation failed for path "a" with value "9" because check "custom: (v) => v > 10" failed.');
        expect(() => g2({})).toThrow(`Validation failed for path "a" with value "" because check "custom: (v) => v > 10" failed.
Validation failed for path "a" with value "" because the value is required.`);
        let g3 = Gubu((v) => v > 10);
        expect(g3(11)).toEqual(11);
        expect(() => g3(9)).toThrow('Validation failed for path "" with value "9" because check "custom: (v) => v > 10" failed.');
    });
    test('after-multiple', () => {
        let g0 = Gubu(After(function v1(v, u) { u.val = v + 1; return true; }, After(function v2(v, u) { u.val = v * 2; return true; }, Number)));
        expect(g0(1)).toEqual(3);
        expect(g0(2)).toEqual(5);
    });
    test('builder-before-after-basic', () => {
        let g0 = Gubu(Before((val, _update) => {
            val.b = 1 + val.a;
            return true;
        }, { a: 1 })
            .After((val, _update) => {
            val.c = 10 * val.a;
            return true;
        }));
        expect('' + g0).toMatch(/\[Gubu G\d+ \{"a":1\}\]/);
        expect(g0({ a: 2 })).toMatchObject({ a: 2, b: 3, c: 20 });
        let g1 = Gubu({
            x: After((val, _update) => {
                val.c = 10 * val.a;
                return true;
            }, { a: 1 })
                .Before((val, _update) => {
                val.b = 1 + val.a;
                return true;
            })
        });
        expect(g1({ x: { a: 2 } })).toMatchObject({ x: { a: 2, b: 3, c: 20 } });
    });
    test('deep-object-basic', () => {
        let a1 = Gubu({ a: 1 });
        expect(a1({})).toMatchObject({ a: 1 });
        let ab1 = Gubu({ a: { b: 1 } });
        expect(ab1({})).toMatchObject({ a: { b: 1 } });
        let abc1 = Gubu({ a: { b: { c: 1 } } });
        expect(abc1({})).toMatchObject({ a: { b: { c: 1 } } });
        let ab1c2 = Gubu({ a: { b: 1 }, c: 2 });
        expect(ab1c2({})).toMatchObject({ a: { b: 1 }, c: 2 });
        let ab1cd2 = Gubu({ a: { b: 1 }, c: { d: 2 } });
        expect(ab1cd2({})).toMatchObject({ a: { b: 1 }, c: { d: 2 } });
        let abc1ade2f3 = Gubu({ a: { b: { c: 1 }, d: { e: 2 } }, f: 3 });
        expect(abc1ade2f3({})).toMatchObject({ a: { b: { c: 1 }, d: { e: 2 } }, f: 3 });
        let d0 = Gubu({
            a: { b: { c: 1 }, d: { e: { f: 3 } } },
            h: 3,
            i: { j: { k: 4 }, l: { m: 5 } },
            n: { o: 6 }
        });
        expect(d0({})).toMatchObject({
            a: { b: { c: 1 }, d: { e: { f: 3 } } },
            h: 3,
            i: { j: { k: 4 }, l: { m: 5 } },
            n: { o: 6 }
        });
    });
    test('array-special', () => {
        let a0 = Gubu([1]);
        expect(a0()).toMatchObject([]);
        expect(a0([])).toMatchObject([]);
        expect(a0([11])).toMatchObject([11]);
        expect(a0([11, 22])).toMatchObject([11, 22]);
        let a1 = Gubu([String, Number]);
        expect(() => a1()).toThrow('Validation failed for path "0" with value "" because the value is required.');
        expect(() => a1([])).toThrow('Validation failed for path "0" with value "" because the value is required.');
        expect(a1([1])).toMatchObject([1]);
        expect(a1([1, 'x'])).toMatchObject([1, 'x']);
        expect(a1([1, 'x', 'y'])).toMatchObject([1, 'x', 'y']);
        expect(() => a1(['x'])).toThrow('Validation failed for path "0" with value "x" because the value is not of type number.');
        expect(() => a1(['x', 1])).toThrow('Validation failed for path "0" with value "x" because the value is not of type number.');
        expect(() => a1(['x', 'y'])).toThrow('Validation failed for path "0" with value "x" because the value is not of type number.');
        let a2 = Gubu([String, 9]);
        expect(a2()).toMatchObject([9]);
        expect(a2([])).toMatchObject([9]);
        expect(a2([1])).toMatchObject([1]);
        expect(a2([1, 'x'])).toMatchObject([1, 'x']);
        expect(a2([1, 'x', 'y'])).toMatchObject([1, 'x', 'y']);
        expect(() => a2(['x'])).toThrow('Validation failed for path "0" with value "x" because the value is not of type number.');
        expect(() => a2(['x', 1])).toThrow('Validation failed for path "0" with value "x" because the value is not of type number.');
        expect(() => a2(['x', 'y'])).toThrow('Validation failed for path "0" with value "x" because the value is not of type number.');
        let a3 = Gubu([-1, 1, 2, 3]);
        expect(a3()).toMatchObject([1, 2, 3]);
        expect(a3([])).toMatchObject([1, 2, 3]);
        expect(a3([11])).toMatchObject([11, 2, 3]);
        expect(a3([11, 22])).toMatchObject([11, 22, 3]);
        expect(a3([11, 22, 33])).toMatchObject([11, 22, 33]);
        expect(a3([11, 22, 33, 44])).toMatchObject([11, 22, 33, 44]);
        expect(a3([undefined, 22])).toMatchObject([1, 22, 3]);
        // non-index properties on array shape are not supported
        // FEATURE: support non-index properties on array shape
        let r0 = null;
        let A0 = [String];
        A0.x = 1;
        let g3 = Gubu({ a: A0 });
        expect(g3({})).toEqual({ a: [] });
        expect(r0 = g3({ a: undefined })).toEqual({ a: [] });
        expect(r0.x).toBeUndefined();
        expect(r0 = g3({ a: [] })).toEqual({ a: [] });
        expect(r0.x).toBeUndefined();
    });
    test('builder-required', () => {
        let g0 = Gubu({ a: Required({ x: 1 }) });
        expect(g0({ a: { x: 1 } })).toEqual({ a: { x: 1 } });
        expect(() => g0({})).toThrow('Validation failed for path "a" with value "" because the value is required.');
        let g1 = Gubu({ a: Required([1]) });
        expect(g1({ a: [11] })).toEqual({ a: [11] });
        expect(() => g1({})).toThrow('Validation failed for path "a" with value "" because the value is required.');
        let g2 = Gubu(Required(1));
        expect(g2(1)).toEqual(1);
        expect(g2(2)).toEqual(2);
        // TODO: note this in docs - deep child requires must be satisfied unless Optional
        let g3 = Gubu({ a: { b: String } });
        expect(() => g3()).toThrow(/"a.b".*required/);
        let g4 = Gubu({ a: Optional({ b: String }) });
        expect(g4()).toEqual({});
        expect(g4({})).toEqual({});
        expect(g4({ a: undefined })).toEqual({});
        expect(() => g4({ a: {} })).toThrow(/"a.b".*required/);
    });
    test('builder-closed', () => {
        let tmp = {};
        let g0 = Gubu({ a: { b: { c: Closed({ x: 1 }) } } });
        expect(g0({ a: { b: { c: { x: 2 } } } })).toEqual({ a: { b: { c: { x: 2 } } } });
        expect(() => g0({ a: { b: { c: { x: 2, y: 3 } } } })).toThrow(/Validation failed for path "a.b.c" with value "{x:2,y:3}" because the property "y" is not allowed\./);
        let g1 = Gubu(Closed([Any(), Date, RegExp]));
        expect(g1(tmp.a0 = [new Date(), /a/])).toEqual(tmp.a0);
        expect(() => g1([new Date(), /a/, 'Q'])).toThrow(/Validation failed for path "" with value "\[[^Z]+Z,\/a\/,Q\]" /); // because the property "2" is not allowed\./)
        expect(() => g1((tmp.a1 = [new Date(), /a/], tmp.a1.x = 1, tmp.a1)))
            .toThrow('"x" is not allowed');
        let g2 = Gubu({ a: Closed([String]) });
        expect(g2({})).toEqual({ a: [] });
        expect(g2({ a: undefined })).toEqual({ a: [] });
        expect(g2({ a: [] })).toEqual({ a: [] });
        let r0 = null;
        let a0 = [String];
        a0.x = 1;
        let g3 = Gubu({ a: Closed(a0) });
        expect(g3({})).toEqual({ a: [] });
        expect(r0 = g3({ a: undefined })).toEqual({ a: [] });
        expect(r0.x).toBeUndefined();
        expect(r0 = g3({ a: [] })).toEqual({ a: [] });
        expect(r0.x).toBeUndefined();
    });
    test('builder-one', () => {
        let g0 = Gubu(One(Number, String));
        expect(g0(1)).toEqual(1);
        expect(g0('x')).toEqual('x');
        expect(() => g0(true)).toThrow(`Value "true" for path "" does not satisfy One shape:
Validation failed for path "" with value "true" because the value is not of type number.
Validation failed for path "" with value "true" because the value is not of type string.`);
        let g1 = Gubu([One({ x: Number }, { x: String })]);
        expect(g1([{ x: 1 }, { x: 'x' }, { x: 2 }, { x: 'y' }]))
            .toMatchObject([{ x: 1 }, { x: 'x' }, { x: 2 }, { x: 'y' }]);
        expect(() => g1([{ x: 1 }, { x: true }, { x: 2 }, { x: false }]))
            .toThrow(`Value "{x:true}" for path "1" does not satisfy One shape:
Validation failed for path "x" with value "true" because the value is not of type number.
Validation failed for path "x" with value "true" because the value is not of type string.
Value "{x:false}" for path "3" does not satisfy One shape:
Validation failed for path "x" with value "false" because the value is not of type number.
Validation failed for path "x" with value "false" because the value is not of type string.`);
        let g2 = Gubu([One({ x: Exact('red'), y: String }, { x: Exact('green'), z: Number })]);
        expect(g2([
            { x: 'red', y: 'Y' },
            { x: 'green', z: 1 },
            { x: 'green', z: 2, y: 22 },
            { x: 'red', y: 'Y', z: 'YY' }
        ])).toMatchObject([
            { x: 'red', y: 'Y' },
            { x: 'green', z: 1 },
            { x: 'green', z: 2, y: 22 },
            { x: 'red', y: 'Y', z: 'YY' }
        ]);
        // TODO: improve error messaging for this case (multiple specs fail)
        expect(() => g2([
            { x: 'red', y: 3 },
            { x: 'green', z: 'Z' },
        ])).toThrow(`Value "{x:red,y:3}" for path "0" does not satisfy One shape:
Validation failed for path "y" with value "3" because the value is not of type string.
Value "red" for path "x" must be exactly one of: "green".
Validation failed for path "z" with value "" because the value is required.
Value "{x:green,z:Z}" for path "1" does not satisfy One shape:
Value "green" for path "x" must be exactly one of: "red".
Validation failed for path "y" with value "" because the value is required.
Validation failed for path "z" with value "Z" because the value is not of type number.`);
    });
    test('builder-some', () => {
        let g0 = Gubu({ a: Some(Number, String) });
        expect(g0({ a: 1 })).toEqual({ a: 1 });
        expect(g0({ a: 'x' })).toEqual({ a: 'x' });
        expect(() => g0({ a: true })).toThrow(`Value "true" for path "a" does not satisfy Some shape:
Validation failed for path "" with value "true" because the value is not of type number.
Validation failed for path "" with value "true" because the value is not of type string.`);
        let g1 = Gubu(Some(Number, String));
        expect(g1(1)).toEqual(1);
        expect(g1('x')).toEqual('x');
        expect(() => g1(true)).toThrow(`Value "true" for path "" does not satisfy Some shape:
Validation failed for path "" with value "true" because the value is not of type number.
Validation failed for path "" with value "true" because the value is not of type string.`);
        let g2 = Gubu([Some(Number, String)]);
        expect(g2([1])).toEqual([1]);
        expect(g2(['x'])).toEqual(['x']);
        expect(g2([1, 2])).toEqual([1, 2]);
        expect(g2([1, 'x'])).toEqual([1, 'x']);
        expect(g2(['x', 1])).toEqual(['x', 1]);
        expect(g2(['x', 'y'])).toEqual(['x', 'y']);
        expect(g2(['x', 1, 'y', 2])).toEqual(['x', 1, 'y', 2]);
        expect(() => g2([true])).toThrow(`Value "true" for path "0" does not satisfy Some shape:
Validation failed for path "" with value "true" because the value is not of type number.
Validation failed for path "" with value "true" because the value is not of type string.`);
        let g3 = Gubu({ a: [Some(Number, String)] });
        expect(g3({ a: [1] })).toEqual({ a: [1] });
        expect(g3({ a: ['x'] })).toEqual({ a: ['x'] });
        expect(g3({ a: ['x', 1, 'y', 2] })).toEqual({ a: ['x', 1, 'y', 2] });
        expect(() => g3({ a: [1, 2, true] })).toThrow(`Value "true" for path "a.2" does not satisfy Some shape:
Validation failed for path "" with value "true" because the value is not of type number.
Validation failed for path "" with value "true" because the value is not of type string.`);
        let g4 = Gubu({ a: [Some({ x: 1 }, { x: 'X' })] });
        expect(g4({ a: [{ x: 2 }, { x: 'Q' }, { x: 3, y: true }, { x: 'W', y: false }] }))
            .toEqual({ a: [{ x: 2 }, { x: 'Q' }, { x: 3, y: true }, { x: 'W', y: false }] });
        let g5 = Gubu({ a: [Some({ x: 1 }, Closed({ x: 'X' }))] });
        expect(g5({ a: [{ x: 2 }, { x: 'Q' }] }))
            .toEqual({ a: [{ x: 2 }, { x: 'Q' }] });
    });
    test('builder-all', () => {
        let g0 = Gubu(All({ x: 1 }, { y: 'a' }));
        expect(g0({ x: 1, y: 'a' })).toEqual({ x: 1, y: 'a' });
        expect(() => g0({ x: 'b', y: 'a' })).toThrow(`Value "{x:b,y:a}" for path "" does not satisfy All shape:
Validation failed for path "x" with value "b" because the value is not of type number.`);
        let g1 = Gubu({ a: All((v) => v > 10, (v) => v < 20) });
        expect(g1({ a: 11 })).toEqual({ a: 11 });
        expect(() => g1({ a: 0 })).toThrow(`Value "0" for path "a" does not satisfy All shape:
Validation failed for path "" with value "0" because check "custom: (v) => v > 10" failed.`);
        let g2 = Gubu(All({ x: 1 }, { y: { z: 'a' } }));
        expect(g2({ x: 11, y: { z: 'AA' } })).toEqual({ x: 11, y: { z: 'AA' } });
        expect(() => g2({ x: 11, y: { z: true } })).toThrow(/path "y.z".*"true".*string/);
        let g3 = Gubu(All({ x: 1 }, { y: 2 }));
        expect(g3({ x: 11, y: 22 })).toEqual({ x: 11, y: 22 });
        expect(() => g3({ x: 'X', y: 'Y' })).toThrow(`Value "{x:X,y:Y}" for path "" does not satisfy All shape:
Validation failed for path "x" with value "X" because the value is not of type number.
Validation failed for path "y" with value "Y" because the value is not of type number.`);
    });
    test('builder-custom-between', () => {
        const rangeCheck = Gubu([Never(), Number, Number]);
        const Between = function (inopts, spec) {
            let vs = buildize(this || spec);
            let range = rangeCheck(inopts);
            vs.b.push((val, update, state) => {
                // Don't run any more checks after this.
                update.done = true;
                if ('number' === typeof (val) && range[0] < val && val < range[1]) {
                    return true;
                }
                else {
                    update.err = [
                        makeErr(state, `Value "$VALUE" for path "$PATH" is ` +
                            `not between ${range[0]} and ${range[1]}.`)
                    ];
                    return false;
                }
            });
            return vs;
        };
        const g0 = Gubu({ a: [Between([10, 20])] });
        expect(g0({ a: [11, 12, 13] })).toEqual({ a: [11, 12, 13] });
        expect(() => g0({ a: [11, 9, 13, 'y'] })).toThrow('Value "9" for path "a.1" is not between 10 and 20.\nValue "y" for path "a.3" is not between 10 and 20.');
    });
    test('builder-required', () => {
        let g0 = Gubu({ a: Required(1) });
        expect(g0({ a: 2 })).toMatchObject({ a: 2 });
        expect(() => g0({ a: 'x' })).toThrow(/number/);
    });
    test('builder-optional', () => {
        let g0 = Gubu({ a: Optional(String) });
        expect(g0({ a: 'x' })).toMatchObject({ a: 'x' });
        // NOTE: Optional(Type) does not insert a default value.
        expect(g0({})).toMatchObject({});
        expect(() => g0({ a: 1 })).toThrow(/string/);
    });
    test('builder-any', () => {
        let g0 = Gubu({ a: Any(), b: Any('B') });
        expect(g0({ a: 2, b: 1 })).toMatchObject({ a: 2, b: 1 });
        expect(g0({ a: 'x', b: 'y' })).toMatchObject({ a: 'x', b: 'y' });
        expect(g0({ b: 1 })).toEqual({ b: 1 });
        expect(g0({ a: 1, b: 'B' })).toEqual({ a: 1, b: 'B' });
    });
    test('builder-never', () => {
        // let g0 = Gubu(Never())
        // expect(() => g0(1)).toThrow('Validation failed for path "" with value "1" because no value is allowed.')
        // let g1 = Gubu({ a: Never() })
        // expect(() => g1({ a: 'x' })).toThrow('Validation failed for path "a" with value "x" because no value is allowed.')
        // Another way to do closed arrays.
        let g2 = Gubu([Never(), 1, 'x']);
        // expect(g2([2, 'y'])).toEqual([2, 'y'])
        expect(() => g2([2, 'y', true])).toThrow('Validation failed for path "2" with value "true" because no value is allowed.');
    });
    test('builder-rename', () => {
        let g0 = Gubu({ a: Rename('b', { x: 1 }) });
        expect(g0({ a: { x: 2 } })).toMatchObject({ b: { x: 2 } });
        let g1 = Gubu([
            Never(),
            Rename('a', String),
            Rename('b', 2),
            Rename({ name: 'c', keep: false }, true)
        ]);
        expect(g1(['x', 22])).toMatchObject({ 0: 'x', 1: 22, a: 'x', b: 22 });
        // console.log(g1(['x', 22]))
        expect('' + g1(['x', 22])).toEqual('x,22');
        expect(g1(['x'])).toMatchObject({ 0: 'x', a: 'x', b: 2 });
        expect('' + g1(['x'])).toEqual('x,2');
        expect(() => g1([])).toThrow('required');
        expect(g1(['x', 22, false]))
            .toMatchObject({ 0: 'x', 1: 22, a: 'x', b: 22, c: false });
        let g2 = Gubu({
            a: Number,
            b: Rename({ name: 'b', claim: ['a'], keep: false }, Number)
        });
        expect(g2({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
        expect(g2({ a: 1 })).toEqual({ b: 1 });
    });
    test('builder-exact', () => {
        let g0 = Gubu({ a: Exact(null) });
        expect(g0({ a: null })).toMatchObject({ a: null });
        expect(() => g0({ a: 1 })).toThrow('exactly one of: null');
        let g1 = Gubu(Exact('foo', 'bar'));
        expect(g1('foo')).toEqual('foo');
        expect(g1('bar')).toEqual('bar');
        expect(() => g1('zed')).toThrow('exactly one of: "foo", "bar"');
    });
    test('builder-define-refer-basic', () => {
        let g0 = Gubu({ a: Define('A', { x: 1 }), b: Refer('A'), c: Refer('A') });
        // console.log(g0.spec())
        expect(g0({ a: { x: 2 }, b: { x: 2 } }))
            .toEqual({ a: { x: 2 }, b: { x: 2 } });
        expect(g0({ a: { x: 33 }, b: { x: 44 }, c: { x: 55 } }))
            .toEqual({ a: { x: 33 }, b: { x: 44 }, c: { x: 55 } });
        expect(() => g0({ a: { x: 33 }, b: { x: 'X' } }))
            .toThrow('Validation failed for path "b.x" with value "X" because the value is not of type number.');
        let g1 = Gubu({
            a: Define('A', { x: 1 }),
            b: Refer('A'),
            c: Refer({ name: 'A', fill: true })
        });
        expect(g1({ a: { x: 2 } }))
            .toEqual({ a: { x: 2 }, c: { x: 1 } });
        expect(g1({ a: { x: 2 }, b: { x: 2 } }))
            .toEqual({ a: { x: 2 }, b: { x: 2 }, c: { x: 1 } });
        expect(g1({ a: { x: 2 }, b: { x: 2 }, c: {} }))
            .toEqual({ a: { x: 2 }, b: { x: 2 }, c: { x: 1 } });
        expect(g1({ a: { x: 33 }, b: { x: 44 }, c: { x: 2 } }))
            .toEqual({ a: { x: 33 }, b: { x: 44 }, c: { x: 2 } });
    });
    test('builder-define-refer-recursive', () => {
        let g0 = Gubu({
            a: Define('A', {
                b: {
                    c: 1,
                    a: Refer('A')
                }
            }),
        });
        expect(g0({
            a: {
                b: {
                    c: 2,
                }
            }
        })).toEqual({
            a: {
                b: {
                    c: 2,
                }
            }
        });
        expect(g0({
            a: {
                b: {
                    c: 2,
                    a: {
                        b: {
                            c: 3
                        }
                    }
                }
            }
        })).toEqual({
            a: {
                b: {
                    c: 2,
                    a: {
                        b: {
                            c: 3
                        }
                    }
                }
            }
        });
        expect(() => g0({
            a: {
                b: {
                    c: 2,
                    a: {
                        b: {
                            c: 'C'
                        }
                    }
                }
            }
        })).toThrow('Validation failed for path "a.b.a.b.c" with value "C" because the value is not of type number.');
        expect(g0({
            a: {
                b: {
                    c: 2,
                    a: {
                        b: {
                            c: 3,
                            a: {
                                b: {
                                    c: 4
                                }
                            }
                        }
                    }
                }
            }
        })).toEqual({
            a: {
                b: {
                    c: 2,
                    a: {
                        b: {
                            c: 3,
                            a: {
                                b: {
                                    c: 4
                                }
                            }
                        }
                    }
                }
            }
        });
    });
    test('builder-min', () => {
        let g0 = Gubu({
            a: Min(10),
            b: Min(2, [String]),
            c: Min(3, 'foo'),
            d: [Min(4, Number)]
        });
        expect(g0({ a: 10 })).toMatchObject({ a: 10 });
        expect(g0({ a: 11 })).toMatchObject({ a: 11 });
        expect(() => g0({ a: 9 }))
            .toThrow(`Value "9" for path "a" must be a minimum of 10 (was 9).`);
        expect(g0({ b: ['x', 'y'] })).toMatchObject({ b: ['x', 'y'] });
        expect(g0({ b: ['x', 'y', 'z'] })).toMatchObject({ b: ['x', 'y', 'z'] });
        expect(() => g0({ b: ['x'] }))
            .toThrow(`Value "[x]" for path "b" must be a minimum length of 2 (was 1).`);
        expect(() => g0({ b: [] }))
            .toThrow(`Value "[]" for path "b" must be a minimum length of 2 (was 0).`);
        expect(g0({ c: 'bar' })).toMatchObject({ c: 'bar' });
        expect(g0({ c: 'barx' })).toMatchObject({ c: 'barx' });
        expect(() => g0({ c: 'ba' }))
            .toThrow(`Value "ba" for path "c" must be a minimum length of 3 (was 2).`);
        expect(g0({ d: [4, 5, 6] })).toMatchObject({ d: [4, 5, 6] });
        expect(() => g0({ d: [4, 5, 6, 3] }))
            .toThrow(`Value "3" for path "d.3" must be a minimum of 4 (was 3).`);
    });
    test('builder-max', () => {
        let g0 = Gubu({
            a: Max(10),
            b: Max(2, [String]),
            c: Max(3, 'foo'),
            d: [Max(4, Number)]
        });
        expect(g0({ a: 10 })).toMatchObject({ a: 10 });
        expect(g0({ a: 9 })).toMatchObject({ a: 9 });
        expect(() => g0({ a: 11 }))
            .toThrow(`Value "11" for path "a" must be a maximum of 10 (was 11).`);
        expect(g0({ b: ['x', 'y'] })).toMatchObject({ b: ['x', 'y'] });
        expect(g0({ b: ['x'] })).toMatchObject({ b: ['x'] });
        expect(g0({ b: [] })).toMatchObject({ b: [] });
        expect(() => g0({ b: ['x', 'y', 'z'] }))
            .toThrow(`Value "[x,y,z]" for path "b" must be a maximum length of 2 (was 3).`);
        expect(g0({ c: 'bar' })).toMatchObject({ c: 'bar' });
        expect(g0({ c: 'ba' })).toMatchObject({ c: 'ba' });
        expect(g0({ c: 'b' })).toMatchObject({ c: 'b' });
        expect(() => g0({ c: 'barx' }))
            .toThrow(`Value "barx" for path "c" must be a maximum length of 3 (was 4).`);
        expect(() => g0({ c: '' }))
            .toThrow(`Validation failed for path "c" with value "" because the value is required.`);
        expect(g0({ d: [4, 3, 2, 1, 0, -1] })).toMatchObject({ d: [4, 3, 2, 1, 0, -1] });
        expect(g0({ d: [] })).toMatchObject({ d: [] });
        expect(() => g0({ d: [4, 5] }))
            .toThrow(`Value "5" for path "d.1" must be a maximum of 4 (was 5).`);
    });
    test('builder-above', () => {
        let g0 = Gubu({
            a: Above(10),
            b: Above(2, [String]),
            c: Above(3, 'foo'),
            d: [Above(4, Number)]
        });
        expect(g0({ a: 12 })).toMatchObject({ a: 12 });
        expect(g0({ a: 11 })).toMatchObject({ a: 11 });
        expect(() => g0({ a: 10 }))
            .toThrow(`Value "10" for path "a" must be above 10 (was 10).`);
        expect(() => g0({ a: 9 }))
            .toThrow(`Value "9" for path "a" must be above 10 (was 9).`);
        expect(g0({ b: ['x', 'y', 'z'] })).toMatchObject({ b: ['x', 'y', 'z'] });
        expect(() => g0({ b: ['x', 'y'] }))
            .toThrow(`Value "[x,y]" for path "b" must have length above 2 (was 2).`);
        expect(() => g0({ b: ['x'] }))
            .toThrow(`Value "[x]" for path "b" must have length above 2 (was 1).`);
        expect(() => g0({ b: [] }))
            .toThrow(`Value "[]" for path "b" must have length above 2 (was 0).`);
        expect(g0({ c: 'barx' })).toMatchObject({ c: 'barx' });
        expect(() => g0({ c: 'bar' }))
            .toThrow(`Value "bar" for path "c" must have length above 3 (was 3).`);
        expect(() => g0({ c: 'ba' }))
            .toThrow(`Value "ba" for path "c" must have length above 3 (was 2).`);
        expect(() => g0({ c: 'b' }))
            .toThrow(`Value "b" for path "c" must have length above 3 (was 1).`);
        expect(() => g0({ c: '' }))
            .toThrow(`Validation failed for path "c" with value "" because the value is required.`);
        expect(g0({ d: [5, 6] })).toMatchObject({ d: [5, 6] });
        expect(() => g0({ d: [4, 5, 6, 3] }))
            .toThrow(`Value "4" for path "d.0" must be above 4 (was 4).
Value "3" for path "d.3" must be above 4 (was 3).`);
    });
    test('builder-below', () => {
        let g0 = Gubu({
            a: Below(10),
            b: Below(2, [String]),
            c: Below(3, 'foo'),
            d: [Below(4, Number)]
        });
        expect(g0({ a: 8 })).toMatchObject({ a: 8 });
        expect(g0({ a: 9 })).toMatchObject({ a: 9 });
        expect(() => g0({ a: 10 }))
            .toThrow(`Value "10" for path "a" must be below 10 (was 10).`);
        expect(() => g0({ a: 11 }))
            .toThrow(`Value "11" for path "a" must be below 10 (was 11).`);
        expect(g0({ b: ['x'] })).toMatchObject({ b: ['x'] });
        expect(g0({ b: [] })).toMatchObject({ b: [] });
        expect(() => g0({ b: ['x', 'y', 'z'] }))
            .toThrow(`Value "[x,y,z]" for path "b" must have length below 2 (was 3).`);
        expect(() => g0({ b: ['x', 'y'] }))
            .toThrow(`Value "[x,y]" for path "b" must have length below 2 (was 2).`);
        expect(g0({ c: 'ba' })).toMatchObject({ c: 'ba' });
        expect(g0({ c: 'b' })).toMatchObject({ c: 'b' });
        expect(() => g0({ c: 'bar' }))
            .toThrow(`Value "bar" for path "c" must have length below 3 (was 3).`);
        expect(() => g0({ c: 'barx' }))
            .toThrow(`Value "barx" for path "c" must have length below 3 (was 4).`);
        expect(() => g0({ c: '' }))
            .toThrow(`Validation failed for path "c" with value "" because the value is required.`);
        expect(g0({ d: [3, 2, 1, 0, -1] })).toMatchObject({ d: [3, 2, 1, 0, -1] });
        expect(g0({ d: [] })).toMatchObject({ d: [] });
        expect(() => g0({ d: [4, 5] }))
            .toThrow(`Value "4" for path "d.0" must be below 4 (was 4).
Value "5" for path "d.1" must be below 4 (was 5).`);
    });
    test('builder-value', () => {
        let g0 = Gubu(Value({ a: 1 }, String));
        expect(g0({})).toMatchObject({});
        expect(g0({ a: 2 })).toMatchObject({ a: 2 });
        expect(() => g0({ a: 'x' })).toThrow('type');
        expect(g0({ a: 2, b: 'x' })).toMatchObject({ a: 2, b: 'x' });
        expect(g0({ a: 2, b: 'x', c: 'y' })).toMatchObject({ a: 2, b: 'x', c: 'y' });
        expect(() => g0({ a: 2, b: 3 })).toThrow('Validation failed for path "b" with value "3" because the value is not of type string.');
        expect(() => g0({ a: 2, b: 'x', c: 4 })).toThrow('Validation failed for path "c" with value "4" because the value is not of type string.');
        expect(() => g0({ a: true, b: 'x', c: 'y' })).toThrow('Validation failed for path "a" with value "true" because the value is not of type number.');
        expect(() => g0({ a: 'z', b: 'x', c: 'y' })).toThrow('Validation failed for path "a" with value "z" because the value is not of type number.');
        let g1 = Gubu({ a: Required({ b: 1 }).Value({ x: String }) });
        expect(g1({ a: { b: 2, c: { x: 'x' } } }))
            .toMatchObject({ a: { b: 2, c: { x: 'x' } } });
        expect(g1({ a: { b: 2, c: { x: 'x' }, d: { x: 'z' } } }))
            .toMatchObject({ a: { b: 2, c: { x: 'x' }, d: { x: 'z' } } });
        expect(() => g1({ a: { b: 2, c: 3 } })).toThrow('Validation failed for path "a.c" with value "3" because the value is not of type object.');
    });
    test('context-basic', () => {
        let c0 = { max: 10 };
        let g0 = Gubu({
            a: (v, _u, s) => v < s.ctx.max
        });
        expect(g0({ a: 2 }, c0)).toMatchObject({ a: 2 });
        expect(() => g0({ a: 11 }, c0)).toThrow('Validation failed for path "a" with value "11" because check "custom: a" failed.');
        let g1 = Gubu({
            a: { b: All(Number, (v, _u, s) => v < s.ctx.max) }
        });
        expect(g1({ a: { b: 3 } }, c0)).toMatchObject({ a: { b: 3 } });
        expect(() => g1({ a: { b: 11 } }, c0)).toThrow(`Value "11" for path "a.b" does not satisfy All shape:
Validation failed for path "" with value "11" because check "custom: (v, _u, s) => v < s.ctx.max" failed.`);
    });
    test('error-path', () => {
        let g0 = Gubu({ a: { b: String } });
        expect(g0({ a: { b: 'x' } })).toEqual({ a: { b: 'x' } });
        expect(() => g0(1)).toThrow('path ""');
        expect(() => g0({ a: 1 })).toThrow('path "a"');
        expect(() => g0({ a: { b: 1 } })).toThrow('path "a.b"');
        expect(() => g0({ a: { b: { c: 1 } } })).toThrow('path "a.b"');
        let g1 = Gubu(String);
        expect(g1('x')).toEqual('x');
        expect(() => g1(1)).toThrow('path ""');
        expect(() => g1(true)).toThrow('path ""');
        expect(() => g1(null)).toThrow('path ""');
        expect(() => g1(undefined)).toThrow('path ""');
        expect(() => g1([])).toThrow('path ""');
        expect(() => g1({})).toThrow('path ""');
        expect(() => g1(new Date())).toThrow('path ""');
    });
    test('error-desc', () => {
        const g0 = Gubu(NaN);
        let err = [];
        let o0 = g0(1, { err });
        expect(o0).toEqual(1);
        expect(err).toMatchObject([{
                n: { t: 'nan', v: NaN, r: false, d: 0, u: {} },
                s: 1,
                p: '',
                w: 'type',
                m: 1050,
                t: 'Validation failed for path "" with value "1" because the value is not of type nan.'
            }]);
        try {
            g0(1, { a: 'A' });
        }
        catch (e) {
            expect(e.message).toEqual('Validation failed for path "" with value "1" because the value is not of type nan.');
            expect(e.code).toEqual('shape');
            expect(e.gubu).toEqual(true);
            expect(e.name).toEqual('GubuError');
            expect(e.desc()).toMatchObject({
                code: 'shape',
                ctx: { a: 'A' },
                err: [
                    {
                        n: { t: 'nan', v: NaN, r: false, d: 0, u: {} },
                        s: 1,
                        p: '',
                        w: 'type',
                        m: 1050,
                        t: 'Validation failed for path "" with value "1" because the value is not of type nan.'
                    }
                ]
            });
            expect(JSON.stringify(e)).toEqual("{\"gubu\":true,\"name\":\"GubuError\",\"code\":\"shape\",\"err\":[{\"n\":{\"$\":{\"v$\":\"" + package_json_1.default.version + "\"},\"t\":\"nan\",\"v\":null,\"r\":false,\"o\":false,\"d\":0,\"u\":{},\"a\":[],\"b\":[]},\"s\":1,\"p\":\"\",\"w\":\"type\",\"m\":1050,\"t\":\"Validation failed for path \\\"\\\" with value \\\"1\\\" because the value is not of type nan.\"}],\"message\":\"Validation failed for path \\\"\\\" with value \\\"1\\\" because the value is not of type nan.\"}");
        }
    });
    test('spec-basic', () => {
        expect(Gubu(Number).spec()).toMatchObject({
            $: { gubu$: true, v$: package_json_1.default.version },
            d: 0, r: true, t: 'number', u: {}, v: 0,
        });
        expect(Gubu(String).spec()).toMatchObject({
            $: { gubu$: true, v$: package_json_1.default.version },
            d: 0, r: true, t: 'string', u: {}, v: '',
        });
        expect(Gubu(BigInt).spec()).toMatchObject({
            $: { gubu$: true, v$: package_json_1.default.version },
            d: 0, r: true, t: 'bigint', u: {}, v: "0",
        });
        expect(Gubu(null).spec()).toMatchObject({
            $: { gubu$: true, v$: package_json_1.default.version },
            d: 0, r: false, t: 'null', u: {}, v: null,
        });
    });
    test('spec-roundtrip', () => {
        let m0 = { a: 1 };
        let g0 = Gubu(m0);
        expect(m0).toEqual({ a: 1 });
        expect(g0({ a: 2 })).toEqual({ a: 2 });
        expect(m0).toEqual({ a: 1 });
        let s0 = g0.spec();
        expect(m0).toEqual({ a: 1 });
        let s0s = {
            $: {
                gubu$: true,
                v$: package_json_1.default.version,
            },
            d: 0,
            // k: '',
            r: false,
            o: false,
            t: 'object',
            u: {},
            a: [],
            b: [],
            v: {
                a: {
                    $: {
                        gubu$: true,
                        v$: package_json_1.default.version,
                    },
                    d: 1,
                    // k: 'a',
                    r: false,
                    o: false,
                    t: 'number',
                    u: {},
                    a: [],
                    b: [],
                    v: 1,
                },
            },
        };
        expect(s0).toEqual(s0s);
        expect(g0({ a: 2 })).toEqual({ a: 2 });
        let g0r = Gubu(s0);
        expect(m0).toEqual({ a: 1 });
        expect(s0).toEqual(s0s);
        expect(g0r({ a: 2 })).toEqual({ a: 2 });
        expect(m0).toEqual({ a: 1 });
        expect(s0).toEqual(s0s);
        let s0r = g0r.spec();
        expect(m0).toEqual({ a: 1 });
        expect(s0r).toEqual(s0s);
        expect(s0).toEqual(s0s);
        expect(g0r({ a: 2 })).toEqual({ a: 2 });
        expect(g0({ a: 2 })).toEqual({ a: 2 });
        let s0_2 = g0r.spec();
        let s0r_2 = g0r.spec();
        expect(m0).toEqual({ a: 1 });
        expect(s0r_2).toEqual(s0s);
        expect(s0_2).toEqual(s0s);
        let m1 = { a: [1] };
        let g1 = Gubu(m1);
        expect(g1({ a: [2] })).toEqual({ a: [2] });
        expect(m1).toEqual({ a: [1] });
        let s1 = g1.spec();
        let s1s = {
            $: {
                gubu$: true,
                v$: package_json_1.default.version,
            },
            d: 0,
            // k: '',
            r: false,
            o: false,
            t: 'object',
            u: {},
            a: [],
            b: [],
            v: {
                a: {
                    $: {
                        gubu$: true,
                        v$: package_json_1.default.version,
                    },
                    d: 1,
                    // k: 'a',
                    r: false,
                    o: false,
                    t: 'array',
                    u: {},
                    a: [],
                    b: [],
                    v: {
                        0: {
                            $: {
                                gubu$: true,
                                v$: package_json_1.default.version,
                            },
                            d: 2,
                            // k: '0',
                            r: false,
                            o: false,
                            t: 'number',
                            u: {},
                            a: [],
                            b: [],
                            v: 1,
                        },
                    },
                },
            },
        };
        expect(s1).toEqual(s1s);
        let g1r = Gubu(s1);
        expect(g1r({ a: [2] })).toEqual({ a: [2] });
        expect(g1({ a: [2] })).toEqual({ a: [2] });
        expect(m1).toEqual({ a: [1] });
        expect(s1).toEqual(s1s);
        let s1r = g1r.spec();
        expect(g1r({ a: [2] })).toEqual({ a: [2] });
        expect(g1({ a: [2] })).toEqual({ a: [2] });
        expect(m1).toEqual({ a: [1] });
        expect(s1).toEqual(s1s);
        expect(s1r).toEqual(s1s);
    });
    test('compose', () => {
        let g0 = Gubu(String);
        let g1 = Gubu(g0);
        let g1s = Gubu(g0.spec());
        expect(g1('x')).toEqual('x');
        expect(() => g1(1)).toThrow();
        expect(g1s('x')).toEqual('x');
        expect(() => g1s(1)).toThrow();
        let g2 = Gubu({ a: Number });
        let g3 = Gubu({ b: g2 });
        let g3s = Gubu({ b: g2.spec() });
        // console.dir(g3.spec(), { depth: null })
        expect(g3({ b: { a: 1 } })).toEqual({ b: { a: 1 } });
        expect(() => g3({ b: { a: 'x' } })).toThrow();
        expect(g3s({ b: { a: 1 } })).toEqual({ b: { a: 1 } });
        expect(() => g3s({ b: { a: 'x' } })).toThrow();
    });
    // Notes: Args is an experimental feature.
    test('args-basic', () => {
        let a0 = Args({ a: Number, b: String });
        expect(a0([1, 'x'])).toMatchObject({ a: 1, b: 'x' });
        expect(() => a0([1, 'x', true])).toThrow('Validation failed for path "2" with value "true" because no value is allowed.');
        let f0 = Args({ a: { x: 1 }, b: [String] }, (args) => ({
            y: args.a.x * 2,
            z: args.b.map((s) => s.toUpperCase())
        }));
        expect(f0({ x: 3 }, ['m', 'n'])).toMatchObject({ y: 6, z: ['M', 'N'] });
        let a1 = Args({ a: { x: 1 } });
        expect(a1([{ x: 2, y: 'Y' }])).toMatchObject({ a: { x: 2, y: 'Y' } });
        let a2 = Args({ a: Closed({ x: 1 }), '...b': String });
        // console.log(a2.spec())
        expect(a2([{ x: 2 }, 'A', 'B'])).toMatchObject({ a: { x: 2 }, b: ['A', 'B'] });
        expect(() => a2([{ x: 2, y: 3 }, 'A', 'B'])).toThrow('"y" is not allowed');
        expect(a2([{ x: 2 }])).toMatchObject({ a: { x: 2 }, b: [] });
        let a5 = Args({ a: 0 });
        expect(a5([11])).toMatchObject({ a: 11 });
        expect(a5([])).toMatchObject({ a: 0 });
        let a6 = Args({ a: 0, b: 'B' });
        expect(a6([11, 'BB'])).toMatchObject({ a: 11, b: 'BB' });
        expect(a6([11])).toMatchObject({ a: 11, b: 'B' });
        expect(a6([])).toMatchObject({ a: 0, b: 'B' });
        let a7 = Args({ a: One(Number, String), b: 'B' });
        expect(a7([11, 'BB'])).toMatchObject({ a: 11, b: 'BB' });
        expect(a7([11])).toMatchObject({ a: 11, b: 'B' });
        expect(a7(['AA'])).toMatchObject({ a: 'AA', b: 'B' });
        expect(a7(['AA', 'BB'])).toMatchObject({ a: 'AA', b: 'BB' });
        let a3 = Args({ a: 0, 'b:a': 1 });
        expect(a3([11, 22])).toMatchObject({ a: 11, b: 22 });
        expect(a3([11])).toMatchObject({ b: 11 });
        expect(a3([])).toMatchObject({ a: 0, b: 1 });
        let t0 = () => true;
        let t1 = () => true;
        let a8 = Args({ a: { x: 1 }, 'b:a': t0 });
        expect(a8([{ x: 2 }, t1])).toMatchObject({ a: { x: 2 }, b: t1 });
        expect(a8([t1])).toMatchObject({ a: { x: 1 }, b: t1 });
        expect(a8([])).toMatchObject({ a: { x: 1 }, b: t0 });
        // TODO: this should fail
        // expect(() => a8([{ x: 3 }])).toThrow('type') // b has precedence
        let n0 = function n0(args) { return args.a; };
        let f2 = Args({ a: 1 }, n0);
        expect(f2()).toEqual(1);
        expect(f2(2)).toEqual(2);
    });
    test('stringify', () => {
        expect(stringify({ a: 1 })).toEqual('{"a":1}');
        expect(stringify(Required()))
            .toEqual(`{"$":{"v$":"${package_json_1.default.version}"},"t":"any","r":true,"o":false,"d":-1,"u":{},"a":[],"b":[]}`);
        let c0 = {};
        c0.x = c0;
        expect(stringify(c0)).toEqual('"[object Object]"');
    });
    test('G-basic', () => {
        expect(G$({ v: 11 })).toMatchObject({
            '$': { v$: package_json_1.default.version },
            t: 'number',
            v: 11,
            r: false,
            o: false,
            // k: '',
            d: -1,
            a: [],
            b: [],
            u: {}
        });
        expect(G$({ v: Number })).toMatchObject({
            '$': { v$: package_json_1.default.version },
            t: 'number',
            v: 0,
            r: false,
            o: false,
            // k: '',
            d: -1,
            a: [],
            b: [],
            u: {}
        });
        expect(G$({ v: BigInt(11) })).toMatchObject({
            '$': { v$: package_json_1.default.version },
            t: 'bigint',
            v: BigInt(11),
            r: false,
            o: false,
            // k: '',
            d: -1,
            a: [],
            b: [],
            u: {}
        });
        let s0 = Symbol('foo');
        expect(G$({ v: s0 })).toMatchObject({
            '$': { v$: package_json_1.default.version },
            t: 'symbol',
            v: s0,
            r: false,
            o: false,
            // k: '',
            d: -1,
            a: [],
            b: [],
            u: {}
        });
        // NOTE: special case for plain functions.
        // Normally functions become custom validations.
        let f0 = () => true;
        expect(G$({ v: f0 })).toMatchObject({
            '$': { v$: package_json_1.default.version },
            t: 'function',
            v: f0,
            r: false,
            o: false,
            // k: '',
            d: -1,
            a: [],
            b: [],
            u: {}
        });
    });
    test('just-large', () => {
        let m0 = Large.m0;
        let g0 = Gubu(m0);
        let o0 = g0(Large.i0);
        expect(o0).toEqual(Large.c0);
        let m1 = Large.m1;
        let g1 = Gubu(m1);
        let o1 = g1(Large.i1);
        expect(o1).toEqual(Large.c1);
    });
    test('just-long', () => {
        expect(Gubu(Long.m0)(Long.i0)).toEqual(Long.i0);
        expect(Gubu(Long.m1)(Long.i1)).toEqual(Long.i1);
    });
    test('even-larger', () => {
        let m0 = {};
        let c0 = m0;
        for (let i = 0; i < 11111; i++) {
            c0 = c0.a = {};
        }
        let g0 = Gubu(m0);
        expect(g0(m0)).toEqual(m0);
        let m1 = [];
        let c1 = m1;
        for (let i = 0; i < 11111; i++) {
            c1 = c1[0] = [];
        }
        let g1 = Gubu(m1);
        expect(g1(m1)).toEqual(m1);
    });
    test('even-longer', () => {
        let m0 = {};
        for (let i = 0; i < 11111; i++) {
            m0['a' + i] = true;
        }
        let g0 = Gubu(m0);
        expect(g0(m0)).toEqual(m0);
        let m1 = {};
        for (let i = 0; i < 11111; i++) {
            m1[i] = true;
        }
        let g1 = Gubu(m1);
        expect(g1(m1)).toEqual(m1);
    });
});

},{"../gubu":1,"../package.json":2,"./large":5,"./long":6}],5:[function(require,module,exports){

module.exports = {
  m0: [[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[
    String
  ]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]],

  i0: [[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[
    'x', 'y', 'z'
  ]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]],

  c0: [[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[
    'x', 'y', 'z'
  ]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]],

  m1: {
    a: {
      a: {
        a: {
          a: {
            a: {
              a: {
                a: {
                  a: {
                    a: {
                      a: {
                        a: {
                          a: {
                            a: {
                              a: {
                                a: {
                                  a: {
                                    a: {
                                      a: {
                                        a: {
                                          a: {
                                            a: {
                                              a: {
                                                a: {
                                                  a: {
                                                    a: {
                                                      a: {
                                                        a: {
                                                          a: {
                                                            a: {
                                                              a: {
                                                                a: {
                                                                  a: {
                                                                    a: {
                                                                      a: {
                                                                        a: {
                                                                          a: {
                                                                            a: {
                                                                              a: {
                                                                                a: {
                                                                                  a: {
                                                                                    a: {
                                                                                      a: {
                                                                                        a: {
                                                                                          a: {
                                                                                            a: {
                                                                                              a: {
                                                                                                a: {
                                                                                                  a: {
                                                                                                    a: {
                                                                                                      a: {
                                                                                                        a: {
                                                                                                          a: {
                                                                                                            a: {
                                                                                                              a: {
                                                                                                                a: {
                                                                                                                  a: {
                                                                                                                    a: {
                                                                                                                      a: {
                                                                                                                        a: {
                                                                                                                          a: {
                                                                                                                            a: {
                                                                                                                              a: {
                                                                                                                                a: {
                                                                                                                                  a: {
                                                                                                                                    a: {
                                                                                                                                      a: {
                                                                                                                                        a:
                                                                                                                                        { x: Number }
                                                                                                                                      }
                                                                                                                                    }
                                                                                                                                  }
                                                                                                                                }
                                                                                                                              }
                                                                                                                            }
                                                                                                                          }
                                                                                                                        }
                                                                                                                      }
                                                                                                                    }
                                                                                                                  }
                                                                                                                }
                                                                                                              }
                                                                                                            }
                                                                                                          }
                                                                                                        }
                                                                                                      }
                                                                                                    }
                                                                                                  }
                                                                                                }
                                                                                              }
                                                                                            }
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },

  i1: {
    a: {
      a: {
        a: {
          a: {
            a: {
              a: {
                a: {
                  a: {
                    a: {
                      a: {
                        a: {
                          a: {
                            a: {
                              a: {
                                a: {
                                  a: {
                                    a: {
                                      a: {
                                        a: {
                                          a: {
                                            a: {
                                              a: {
                                                a: {
                                                  a: {
                                                    a: {
                                                      a: {
                                                        a: {
                                                          a: {
                                                            a: {
                                                              a: {
                                                                a: {
                                                                  a: {
                                                                    a: {
                                                                      a: {
                                                                        a: {
                                                                          a: {
                                                                            a: {
                                                                              a: {
                                                                                a: {
                                                                                  a: {
                                                                                    a: {
                                                                                      a: {
                                                                                        a: {
                                                                                          a: {
                                                                                            a: {
                                                                                              a: {
                                                                                                a: {
                                                                                                  a: {
                                                                                                    a: {
                                                                                                      a: {
                                                                                                        a: {
                                                                                                          a: {
                                                                                                            a: {
                                                                                                              a: {
                                                                                                                a: {
                                                                                                                  a: {
                                                                                                                    a: {
                                                                                                                      a: {
                                                                                                                        a: {
                                                                                                                          a: {
                                                                                                                            a: {
                                                                                                                              a: {
                                                                                                                                a: {
                                                                                                                                  a: {
                                                                                                                                    a: {
                                                                                                                                      a: {
                                                                                                                                        a:
                                                                                                                                        { x: 1 }
                                                                                                                                      }
                                                                                                                                    }
                                                                                                                                  }
                                                                                                                                }
                                                                                                                              }
                                                                                                                            }
                                                                                                                          }
                                                                                                                        }
                                                                                                                      }
                                                                                                                    }
                                                                                                                  }
                                                                                                                }
                                                                                                              }
                                                                                                            }
                                                                                                          }
                                                                                                        }
                                                                                                      }
                                                                                                    }
                                                                                                  }
                                                                                                }
                                                                                              }
                                                                                            }
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },

  c1: {
    a: {
      a: {
        a: {
          a: {
            a: {
              a: {
                a: {
                  a: {
                    a: {
                      a: {
                        a: {
                          a: {
                            a: {
                              a: {
                                a: {
                                  a: {
                                    a: {
                                      a: {
                                        a: {
                                          a: {
                                            a: {
                                              a: {
                                                a: {
                                                  a: {
                                                    a: {
                                                      a: {
                                                        a: {
                                                          a: {
                                                            a: {
                                                              a: {
                                                                a: {
                                                                  a: {
                                                                    a: {
                                                                      a: {
                                                                        a: {
                                                                          a: {
                                                                            a: {
                                                                              a: {
                                                                                a: {
                                                                                  a: {
                                                                                    a: {
                                                                                      a: {
                                                                                        a: {
                                                                                          a: {
                                                                                            a: {
                                                                                              a: {
                                                                                                a: {
                                                                                                  a: {
                                                                                                    a: {
                                                                                                      a: {
                                                                                                        a: {
                                                                                                          a: {
                                                                                                            a: {
                                                                                                              a: {
                                                                                                                a: {
                                                                                                                  a: {
                                                                                                                    a: {
                                                                                                                      a: {
                                                                                                                        a: {
                                                                                                                          a: {
                                                                                                                            a: {
                                                                                                                              a: {
                                                                                                                                a: {
                                                                                                                                  a: {
                                                                                                                                    a: {
                                                                                                                                      a: {
                                                                                                                                        a:
                                                                                                                                        { x: 1 }
                                                                                                                                      }
                                                                                                                                    }
                                                                                                                                  }
                                                                                                                                }
                                                                                                                              }
                                                                                                                            }
                                                                                                                          }
                                                                                                                        }
                                                                                                                      }
                                                                                                                    }
                                                                                                                  }
                                                                                                                }
                                                                                                              }
                                                                                                            }
                                                                                                          }
                                                                                                        }
                                                                                                      }
                                                                                                    }
                                                                                                  }
                                                                                                }
                                                                                              }
                                                                                            }
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },

}

},{}],6:[function(require,module,exports){

module.exports = {
  m0: {
    a00: [Number],
    a01: [Number],
    a02: [Number],
    a03: [Number],
    a04: [Number],
    a05: [Number],
    a06: [Number],
    a07: [Number],
    a08: [Number],
    a09: [Number],
    a10: [Number],
    a11: [Number],
    a12: [Number],
    a13: [Number],
    a14: [Number],
    a15: [Number],
    a16: [Number],
    a17: [Number],
    a18: [Number],
    a19: [Number],
    a20: [Number],
    a21: [Number],
    a22: [Number],
    a23: [Number],
    a24: [Number],
    a25: [Number],
    a26: [Number],
    a27: [Number],
    a28: [Number],
    a29: [Number],
    a30: [Number],
    a31: [Number],
    a32: [Number],
    a33: [Number],
    a34: [Number],
    a35: [Number],
    a36: [Number],
    a37: [Number],
    a38: [Number],
    a39: [Number],
    a40: [Number],
    a41: [Number],
    a42: [Number],
    a43: [Number],
    a44: [Number],
    a45: [Number],
    a46: [Number],
    a47: [Number],
    a48: [Number],
    a49: [Number],
    a50: [Number],
    a51: [Number],
    a52: [Number],
    a53: [Number],
    a54: [Number],
    a55: [Number],
    a56: [Number],
    a57: [Number],
    a58: [Number],
    a59: [Number],
    a60: [Number],
    a61: [Number],
    a62: [Number],
    a63: [Number],
    a64: [Number],
    a65: [Number],
    a66: [Number],
    a67: [Number],
    a68: [Number],
    a69: [Number],
    a70: [Number],
    a71: [Number],
    a72: [Number],
    a73: [Number],
    a74: [Number],
    a75: [Number],
    a76: [Number],
    a77: [Number],
    a78: [Number],
    a79: [Number],
    a80: [Number],
    a81: [Number],
    a82: [Number],
    a83: [Number],
    a84: [Number],
    a85: [Number],
    a86: [Number],
    a87: [Number],
    a88: [Number],
    a89: [Number],
    a90: [Number],
    a91: [Number],
    a92: [Number],
    a93: [Number],
    a94: [Number],
    a95: [Number],
    a96: [Number],
    a97: [Number],
    a98: [Number],
    a99: [Number],
  },

  i0: {
    a00: [0],
    a01: [1],
    a02: [2],
    a03: [3],
    a04: [4],
    a05: [5],
    a06: [6],
    a07: [7],
    a08: [8],
    a09: [9],
    a10: [10],
    a11: [11],
    a12: [12],
    a13: [13],
    a14: [14],
    a15: [15],
    a16: [16],
    a17: [17],
    a18: [18],
    a19: [19],
    a20: [20],
    a21: [21],
    a22: [22],
    a23: [23],
    a24: [24],
    a25: [25],
    a26: [26],
    a27: [27],
    a28: [28],
    a29: [29],
    a30: [30],
    a31: [31],
    a32: [32],
    a33: [33],
    a34: [34],
    a35: [35],
    a36: [36],
    a37: [37],
    a38: [38],
    a39: [39],
    a40: [40],
    a41: [41],
    a42: [42],
    a43: [43],
    a44: [44],
    a45: [45],
    a46: [46],
    a47: [47],
    a48: [48],
    a49: [49],
    a50: [50],
    a51: [51],
    a52: [52],
    a53: [53],
    a54: [54],
    a55: [55],
    a56: [56],
    a57: [57],
    a58: [58],
    a59: [59],
    a60: [60],
    a61: [61],
    a62: [62],
    a63: [63],
    a64: [64],
    a65: [65],
    a66: [66],
    a67: [67],
    a68: [68],
    a69: [69],
    a70: [70],
    a71: [71],
    a72: [72],
    a73: [73],
    a74: [74],
    a75: [75],
    a76: [76],
    a77: [77],
    a78: [78],
    a79: [79],
    a80: [80],
    a81: [81],
    a82: [82],
    a83: [83],
    a84: [84],
    a85: [85],
    a86: [86],
    a87: [87],
    a88: [88],
    a89: [89],
    a90: [90],
    a91: [91],
    a92: [92],
    a93: [93],
    a94: [94],
    a95: [95],
    a96: [96],
    a97: [97],
    a98: [98],
    a99: [99],
  },

  m1: [
    String,
    { a00: [Number], b00: [Number], },
    { a01: [Number], b01: [Number], },
    { a02: [Number], b02: [Number], },
    { a03: [Number], b03: [Number], },
    { a04: [Number], b04: [Number], },
    { a05: [Number], b05: [Number], },
    { a06: [Number], b06: [Number], },
    { a07: [Number], b07: [Number], },
    { a08: [Number], b08: [Number], },
    { a09: [Number], b09: [Number], },
    { a10: [Number], b10: [Number], },
    { a11: [Number], b11: [Number], },
    { a12: [Number], b12: [Number], },
    { a13: [Number], b13: [Number], },
    { a14: [Number], b14: [Number], },
    { a15: [Number], b15: [Number], },
    { a16: [Number], b16: [Number], },
    { a17: [Number], b17: [Number], },
    { a18: [Number], b18: [Number], },
    { a19: [Number], b19: [Number], },
    { a20: [Number], b20: [Number], },
    { a21: [Number], b21: [Number], },
    { a22: [Number], b22: [Number], },
    { a23: [Number], b23: [Number], },
    { a24: [Number], b24: [Number], },
    { a25: [Number], b25: [Number], },
    { a26: [Number], b26: [Number], },
    { a27: [Number], b27: [Number], },
    { a28: [Number], b28: [Number], },
    { a29: [Number], b29: [Number], },
    { a20: [Number], b20: [Number], },
    { a31: [Number], b31: [Number], },
    { a32: [Number], b32: [Number], },
    { a33: [Number], b33: [Number], },
    { a34: [Number], b34: [Number], },
    { a35: [Number], b35: [Number], },
    { a36: [Number], b36: [Number], },
    { a37: [Number], b37: [Number], },
    { a38: [Number], b38: [Number], },
    { a39: [Number], b39: [Number], },
    { a40: [Number], b40: [Number], },
    { a41: [Number], b41: [Number], },
    { a42: [Number], b42: [Number], },
    { a43: [Number], b43: [Number], },
    { a44: [Number], b44: [Number], },
    { a45: [Number], b45: [Number], },
    { a46: [Number], b46: [Number], },
    { a47: [Number], b47: [Number], },
    { a48: [Number], b48: [Number], },
    { a49: [Number], b49: [Number], },
    { a50: [Number], b50: [Number], },
    { a51: [Number], b51: [Number], },
    { a52: [Number], b52: [Number], },
    { a53: [Number], b53: [Number], },
    { a54: [Number], b54: [Number], },
    { a55: [Number], b55: [Number], },
    { a56: [Number], b56: [Number], },
    { a57: [Number], b57: [Number], },
    { a58: [Number], b58: [Number], },
    { a59: [Number], b59: [Number], },
    { a60: [Number], b60: [Number], },
    { a61: [Number], b61: [Number], },
    { a62: [Number], b62: [Number], },
    { a63: [Number], b63: [Number], },
    { a64: [Number], b64: [Number], },
    { a65: [Number], b65: [Number], },
    { a66: [Number], b66: [Number], },
    { a67: [Number], b67: [Number], },
    { a68: [Number], b68: [Number], },
    { a69: [Number], b69: [Number], },
    { a70: [Number], b70: [Number], },
    { a71: [Number], b71: [Number], },
    { a72: [Number], b72: [Number], },
    { a73: [Number], b73: [Number], },
    { a74: [Number], b74: [Number], },
    { a75: [Number], b75: [Number], },
    { a76: [Number], b76: [Number], },
    { a77: [Number], b77: [Number], },
    { a78: [Number], b78: [Number], },
    { a79: [Number], b79: [Number], },
    { a80: [Number], b80: [Number], },
    { a81: [Number], b81: [Number], },
    { a82: [Number], b82: [Number], },
    { a83: [Number], b83: [Number], },
    { a84: [Number], b84: [Number], },
    { a85: [Number], b85: [Number], },
    { a86: [Number], b86: [Number], },
    { a87: [Number], b87: [Number], },
    { a88: [Number], b88: [Number], },
    { a89: [Number], b89: [Number], },
    { a90: [Number], b90: [Number], },
    { a91: [Number], b91: [Number], },
    { a92: [Number], b92: [Number], },
    { a93: [Number], b93: [Number], },
    { a94: [Number], b94: [Number], },
    { a95: [Number], b95: [Number], },
    { a96: [Number], b96: [Number], },
    { a97: [Number], b97: [Number], },
    { a98: [Number], b98: [Number], },
    { a99: [Number], b99: [Number], },
  ],

  i1: [
    { a00: [0], b00: [0], },
    { a01: [1], b01: [1], },
    { a02: [2], b02: [2], },
    { a03: [3], b03: [3], },
    { a04: [4], b04: [4], },
    { a05: [5], b05: [5], },
    { a06: [6], b06: [6], },
    { a07: [7], b07: [7], },
    { a08: [8], b08: [8], },
    { a09: [9], b09: [9], },
    { a10: [10], b10: [10], },
    { a11: [11], b11: [11], },
    { a12: [12], b12: [12], },
    { a13: [13], b13: [13], },
    { a14: [14], b14: [14], },
    { a15: [15], b15: [15], },
    { a16: [16], b16: [16], },
    { a17: [17], b17: [17], },
    { a18: [18], b18: [18], },
    { a19: [19], b19: [19], },
    { a20: [20], b20: [20], },
    { a21: [21], b21: [21], },
    { a22: [22], b22: [22], },
    { a23: [23], b23: [23], },
    { a24: [24], b24: [24], },
    { a25: [25], b25: [25], },
    { a26: [26], b26: [26], },
    { a27: [27], b27: [27], },
    { a28: [28], b28: [28], },
    { a29: [29], b29: [29], },
    { a30: [30], b30: [30], },
    { a31: [31], b31: [31], },
    { a32: [32], b32: [32], },
    { a33: [33], b33: [33], },
    { a34: [34], b34: [34], },
    { a35: [35], b35: [35], },
    { a36: [36], b36: [36], },
    { a37: [37], b37: [37], },
    { a38: [38], b38: [38], },
    { a39: [39], b39: [39], },
    { a30: [30], b30: [30], },
    { a41: [41], b41: [41], },
    { a42: [42], b42: [42], },
    { a43: [43], b43: [43], },
    { a44: [44], b44: [44], },
    { a45: [45], b45: [45], },
    { a46: [46], b46: [46], },
    { a47: [47], b47: [47], },
    { a48: [48], b48: [48], },
    { a49: [49], b49: [49], },
    { a50: [50], b50: [50], },
    { a51: [51], b51: [51], },
    { a52: [52], b52: [52], },
    { a53: [53], b53: [53], },
    { a54: [54], b54: [54], },
    { a55: [55], b55: [55], },
    { a56: [56], b56: [56], },
    { a57: [57], b57: [57], },
    { a58: [58], b58: [58], },
    { a59: [59], b59: [59], },
    { a60: [60], b60: [60], },
    { a61: [61], b61: [61], },
    { a62: [62], b62: [62], },
    { a63: [63], b63: [63], },
    { a64: [64], b64: [64], },
    { a65: [65], b65: [65], },
    { a66: [66], b66: [66], },
    { a67: [67], b67: [67], },
    { a68: [68], b68: [68], },
    { a69: [69], b69: [69], },
    { a70: [70], b70: [70], },
    { a71: [71], b71: [71], },
    { a72: [72], b72: [72], },
    { a73: [73], b73: [73], },
    { a74: [74], b74: [74], },
    { a75: [75], b75: [75], },
    { a76: [76], b76: [76], },
    { a77: [77], b77: [77], },
    { a78: [78], b78: [78], },
    { a79: [79], b79: [79], },
    { a80: [80], b80: [80], },
    { a81: [81], b81: [81], },
    { a82: [82], b82: [82], },
    { a83: [83], b83: [83], },
    { a84: [84], b84: [84], },
    { a85: [85], b85: [85], },
    { a86: [86], b86: [86], },
    { a87: [87], b87: [87], },
    { a88: [88], b88: [88], },
    { a89: [89], b89: [89], },
    { a90: [90], b90: [90], },
    { a91: [91], b91: [91], },
    { a92: [92], b92: [92], },
    { a93: [93], b93: [93], },
    { a94: [94], b94: [94], },
    { a95: [95], b95: [95], },
    { a96: [96], b96: [96], },
    { a97: [97], b97: [97], },
    { a98: [98], b98: [98], },
    { a99: [99], b99: [99], },
    'x',
  ],
  
}

},{}]},{},[3]);
