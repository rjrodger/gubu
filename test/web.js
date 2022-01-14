(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).Gubu=e()}}((function(){var e={},t={},n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.Gubu=void 0;const r=n({name:"gubu",version:"0.2.0",description:"An object shape validation utility.",main:"gubu.js",browser:"gubu.min.js",type:"commonjs",types:"gubu.d.ts",homepage:"https://github.com/rjrodger/gubu",keywords:["gubu"],author:"Richard Rodger (http://richardrodger.com)",repository:{type:"git",url:"git://github.com/rjrodger/gubu.git"},scripts:{test:"jest --coverage","test-some":"jest -t","test-watch":"jest --coverage --watchAll","test-web":"npm run build && npm run build-web && browserify -i util -o test/web.js -e test/entry.js -im && open test/web.html",watch:"tsc -w -d",build:"tsc -d","build-web":"cp gubu.js gubu.min.js && browserify -i util -o gubu.min.js -e gubu.web.js -s Gubu -im -p tinyify",lint:"markdownlint README.md",clean:"rm -rf node_modules yarn.lock package-lock.json",reset:"npm run clean && npm i && npm test","repo-tag":"REPO_VERSION=`node -e \"console.log(require('./package').version)\"` && echo TAG: v$REPO_VERSION && git commit -a -m v$REPO_VERSION && git push && git tag v$REPO_VERSION && git push --tags;","repo-publish":"npm run clean && npm i && npm run repo-publish-quick","repo-publish-quick":"npm run build && npm run test && npm run build-web && npm run test-web && npm run repo-tag && npm publish --access public --registry https://registry.npmjs.org "},license:"MIT",engines:{node:">=12"},files:["*.ts","*.js","*.map","LICENSE"],devDependencies:{"@types/jest":"^27.4.0",browserify:"^17.0.0",jest:"^27.4.7",tinyify:"^3.0.0","ts-jest":"^27.1.2",typescript:"^4.5.4"}}),o=Symbol.for("gubu$"),i={gubu$:o,v$:r.default.version};class l{constructor(e,t,n,r){this.match=!1,this.dI=0,this.nI=2,this.cI=-1,this.pI=0,this.sI=-1,this.valType="never",this.isRoot=!1,this.key="",this.type="never",this.stop=!0,this.nextSibling=!0,this.fromDefault=!1,this.ignoreVal=!1,this.err=[],this.parents=[],this.keys=[],this.path=[],this.root=e,this.vals=[e,-1],this.node=t,this.nodes=[t,-1],this.ctx=n||{},this.match=!!r}next(){this.stop=!1,this.fromDefault=!1,this.ignoreVal=!1,this.isRoot=0===this.pI;let e=this.nodes[this.pI];for(;+e;)this.pI=+e,e=this.nodes[this.pI],this.dI--;e?(this.node=e,this.updateVal(this.vals[this.pI]),this.key=this.keys[this.pI],this.cI=this.pI,this.sI=this.pI+1,this.parent=this.parents[this.pI],this.nextSibling=!0,this.type=this.node.t,this.path[this.dI]=this.key,this.oval=this.val):this.stop=!0}updateVal(e){this.val=e,this.valType=typeof this.val,"number"===this.valType&&isNaN(this.val)&&(this.valType="nan"),this.isRoot&&!this.match&&(this.root=this.val)}}class u extends TypeError{constructor(e,t,n){super(t.map(e=>e.t).join("\n")),this.gubu=!0,this.name="GubuError",this.code=e,this.desc=()=>({name:"GubuError",code:e,err:t,ctx:n})}toJSON(){return{...this,err:this.desc().err,name:this.name,message:this.message}}}const s={String:!0,Number:!0,Boolean:!0,Object:!0,Array:!0,Function:!0,Symbol:!0,BigInt:!0},a={string:"",number:0,boolean:!1,object:{},array:[],symbol:Symbol(""),bigint:BigInt(0),null:null};function p(e,t){var n,l,u,p,f;if(null!=e&&(null===(n=e.$)||void 0===n?void 0:n.gubu$)){if(o===e.$.gubu$)return e.d=null==t?e.d:t,e;if(!0===e.$.gubu$){let n={...e};return n.$={v$:r.default.version,...n.$,gubu$:o},n.v=null!=n.v&&"object"==typeof n.v?{...n.v}:n.v,n.t=n.t||typeof n.v,"function"===n.t&&s[n.v.name]&&(n.t=n.v.name.toLowerCase(),n.v=_(a[n.t])),n.r=!!n.r,n.o=!!n.o,n.d=null==t?null==n.d?-1:n.d:t,n.b=n.b||[],n.a=n.a||[],n.u=n.u||{},n}}let c=null===e?"null":typeof e,d=e,h=!1,v=void 0,m={};if("object"===(c="undefined"===c?"any":c))Array.isArray(e)?c="array":null!=d&&Function!==d.constructor&&Object!==d.constructor&&null!=d.constructor&&(c="instance",m.n=d.constructor.name,m.i=d.constructor);else if("function"===c)if(s[e.name])c=e.name.toLowerCase(),h=!0,d=_(a[c]);else if(e.gubu===i||!0===(null===(l=e.$)||void 0===l?void 0:l.gubu)){let t=e.spec?e.spec():e;c=t.t,d=t.v,h=t.r,m=t.u}else void 0===e.prototype&&Function===e.constructor||Function===(null===(u=e.prototype)||void 0===u?void 0:u.constructor)?(c="custom",v=d,d=void 0):(c="instance",h=!0,m.n=null===(f=null===(p=d.prototype)||void 0===p?void 0:p.constructor)||void 0===f?void 0:f.name,m.i=d);else"number"===c&&isNaN(d)&&(c="nan");let b={$:i,t:c,v:null==d||"object"!==c&&"array"!==c?d:{...d},r:h,o:!1,d:null==t?-1:t,u:m,a:[],b:[]};return v&&b.b.push(v),b}function f(t,n){const r=null==n?{}:n;r.name=null==r.name?"G"+(""+Math.random()).substring(2,8):""+r.name;let s=p(t,0);function a(e,t,n){let r=new l(e,s,t,n);for(;r.next(),!r.stop;){let e=!1;if(0<r.node.b.length)for(let t=0;t<r.node.b.length;t++){let n=c(r.node.b[t],r);void 0!==n.done&&(e=n.done)}if(!e)if("never"===r.type)r.err.push(M("never",r,1070));else if("object"===r.type){let e;if(r.node.r&&void 0===r.val?r.err.push(M("required",r,1010)):void 0===r.val||null!==r.val&&"object"===r.valType&&!Array.isArray(r.val)?r.node.o&&null==r.val||(r.updateVal(r.val||(r.fromDefault=!0,{})),e=r.val):(r.err.push(M("type",r,1020)),e=Array.isArray(r.val)?r.val:{}),null!=(e=null==e&&!1===r.ctx.err?{}:e)){let t=Object.keys(r.node.v);if(0<t.length){r.pI=r.nI;for(let n of t){let t=r.node.v[n]=p(r.node.v[n],1+r.dI);r.nodes[r.nI]=t,r.vals[r.nI]=e[n],r.parents[r.nI]=e,r.keys[r.nI]=n,r.nI++}r.dI++,r.nodes[r.nI++]=r.sI,r.nextSibling=!1}}}else if("array"===r.type)if(r.node.r&&void 0===r.val)r.err.push(M("required",r,1030));else if(void 0===r.val||Array.isArray(r.val)){if(!r.node.o||null!=r.val){r.updateVal(r.val||(r.fromDefault=!0,[]));let e=Object.keys(r.node.v).filter(e=>!isNaN(+e));if(0<r.val.length||1<e.length){r.pI=r.nI;let t=void 0===r.node.v[0]?b():r.node.v[0]=p(r.node.v[0],1+r.dI),n=1;if(1<e.length)for(;n<e.length;n++){let e=r.node.v[n]=p(r.node.v[n],1+r.dI);r.nodes[r.nI]=e,r.vals[r.nI]=r.val[n-1],r.parents[r.nI]=r.val,r.keys[r.nI]=""+(n-1),r.nI++}for(let e=n-1;e<r.val.length;e++)r.nodes[r.nI]=t,r.vals[r.nI]=r.val[e],r.parents[r.nI]=r.val,r.keys[r.nI]=""+e,r.nI++;r.dI++,r.nodes[r.nI++]=r.sI,r.nextSibling=!1}}}else r.err.push(M("type",r,1040));else if("any"===r.type||"custom"===r.type||"list"===r.type||void 0===r.val||r.type===r.valType||"instance"===r.type&&r.node.u.i&&r.val instanceof r.node.u.i||"null"===r.type&&null===r.val)if(void 0===r.val){let e=r.path[r.dI];!r.node.r||"undefined"===r.type&&r.parent.hasOwnProperty(e)?("custom"!==r.type&&void 0!==r.node.v&&!r.node.o||"undefined"===r.type)&&(r.updateVal(r.node.v),r.fromDefault=!0):r.err.push(M("required",r,1060))}else"string"!==r.type||""!==r.val||r.node.u.empty||r.err.push(M("required",r,1080));else r.err.push(M("type",r,1050));if(0<r.node.a.length)for(let t=0;t<r.node.a.length;t++){let n=c(r.node.a[t],r);void 0!==n.done&&(e=n.done)}r.match||!r.parent||e||r.ignoreVal||r.node.o||(r.parent[r.key]=r.val),r.nextSibling&&(r.pI=r.sI)}if(0<r.err.length)if(Array.isArray(r.ctx.err))r.ctx.err.push(...r.err);else if(!r.match&&!1!==r.ctx.err)throw new u("shape",r.err,r.ctx);return r.match?0===r.err.length:r.root}function f(e,t){return a(e,t,!1)}f.valid=function(e,t){let n=t||{};return a(e,n,!1),null==n.err||0===n.err.length},f.match=(e,t)=>a(e,t=t||{},!0),f.spec=()=>(f(void 0,{err:!1}),JSON.parse(L(s,(e,t)=>o===t||t,!0)));let d="";return f.toString=()=>(d=N(""===d?L(s&&s.$&&(o===s.$.gubu$||!0===s.$.gubu$)?s.v:s):d),`[Gubu ${r.name} ${d}]`),e.inspect&&e.inspect.custom&&(f[e.inspect.custom]=f.toString),f.gubu=i,f}function c(e,t){let n,r={},o=!1;try{o=e(t.val,r,t)}catch(l){n=l}let i=Array.isArray(r.err)?0<r.err.length:null!=r.err;if(!o||i){if(void 0===t.val&&(t.node.o||!t.node.r)&&!0!==r.done)return delete r.err,r;let o=r.why||"custom",i=d(t);if("string"==typeof r.err)t.err.push(q(t,r.err));else if("object"==typeof r.err)t.err.push(...[r.err].flat().map(e=>(e.p=null==e.p?i:e.p,e.m=null==e.m?2010:e.m,e)));else{let r=e.name;null!=r&&""!=r||(r=N(e.toString().replace(/[ \t\r\n]+/g," "))),t.err.push(M(o,t,1045,void 0,{thrown:n},r))}r.done=null==r.done||r.done}return r.hasOwnProperty("uval")?t.updateVal(r.val):void 0===r.val||Number.isNaN(r.val)?"custom"===t.node.t&&(t.ignoreVal=!0):t.updateVal(r.val),void 0!==r.node&&(t.node=r.node),void 0!==r.type&&(t.type=r.type),r}function d(e){return e.path.slice(1,e.dI+1).filter(e=>null!=e).join(".")}const h=function(e){let t=T(this,e);return t.r=!0,void 0===e&&1===arguments.length&&(t.t="undefined",t.v=void 0),t},v=function(e){let t=T(this,e);return t.r=!1,t.o=!0,t},m=function(e){let t=T(this,e);return t.u.empty=!0,t},b=function(e){let t=T(this,e);return t.t="any",void 0!==e&&(t.v=e),t},y=function(e){let t=T(this,e);return t.t="never",t},g=function(...e){let t=T();t.t="list",t.r=!0;let n=e.map(e=>H(e));return t.u.list=e,t.b.push((function(t,r,o){let i=!0;for(let e of n){let n={...o.ctx,err:[]};e(t,n),0<n.err.length&&(i=!1)}return i||(r.why="all",r.err=[q(o,'Value "$VALUE" for path "$PATH" does not satisfy all of: '+e.map(e=>L(e)))]),i})),t},I=function(...e){let t=T();t.t="list",t.r=!0;let n=e.map(e=>H(e));return t.u.list=e,t.b.push((function(t,r,o){let i=!1;for(let e of n){let n={...o.ctx,err:[]};if(i||(i=e.match(t,n)),i)break}return i||(r.why="some",r.err=[q(o,'Value "$VALUE" for path "$PATH" does not satisfy some of: '+e.map(e=>L(e)))]),i})),t},$=function(...e){let t=T();t.t="list",t.r=!0;let n=e.map(e=>H(e));return t.u.list=e,t.b.push((function(t,r,o){let i=0;for(let e of n){let n={...o.ctx,err:[]};e.match(t,n)&&i++}return 1!==i&&(r.why="one",r.err=[q(o,'Value "$VALUE" for path "$PATH" does not satisfy one of: '+e.map(e=>L(e)))]),!0})),t},A=function(...e){let t=T();return t.b.push((function(t,n,r){for(let o=0;o<e.length;o++)if(t===e[o])return!0;return n.err=q(r,`Value "$VALUE" for path "$PATH" must be exactly one of: ${r.node.s}.`),n.done=!0,!1})),t.s=e.map(e=>L(e)).join(","),t},j=function(e,t){let n=T(this,t);return n.b.push(e),n},w=function(e,t){let n=T(this,t);return n.a.push(e),n},k=function(e){let t=T(this,e);return t.b.push((function(e,n,r){if(null!=e&&"object"==typeof e&&!Array.isArray(e)){let o=Object.keys(e),i=t.v;n.err=[];for(let e of o)void 0===i[e]&&n.err.push(M("closed",r,3010,"",{k:e}));return 0===n.err.length}return!0})),t},x=function(e,t){let n=T(this,t),r="string"==typeof e?e:("object"==typeof e&&e||{}).name;return null!=r&&""!=r&&n.b.push((function(e,t,n){return(n.ctx.ref=n.ctx.ref||{})[r]=n.node,!0})),n},O=function(e,t){let n=T(this,t),r="object"==typeof e&&e||{},o="string"==typeof e?e:r.name,i=!!r.fill;return null!=o&&""!=o&&n.b.push((function(e,t,n){if(void 0!==e||i){let e=n.ctx.ref=n.ctx.ref||{};if(void 0!==e[o]){let n={...e[o]};n.t=n.t||"never",t.node=n,t.type=n.t}}return!0})),n},R=function(e,t){let n=T(this,t),r="object"==typeof e&&e||{},o="string"==typeof e?e:r.name,i="boolean"==typeof r.keep?r.keep:void 0,l=Array.isArray(r.claim)?r.claim:[];if(null!=o&&""!=o){let e=(e,t,n)=>{if(void 0===e&&0<l.length){n.ctx.Rename=n.ctx.Rename||{},n.ctx.Rename.fromDefault=n.ctx.Rename.fromDefault||{};for(let e of l){let r=n.ctx.Rename.fromDefault[e]||{};if(void 0!==n.parent[e]&&!r.yes){t.val=n.parent[e],n.match||(n.parent[o]=t.val),t.node=r.node;for(let e=0;e<n.err.length;e++)n.err[e].k===r.key&&(n.err.splice(e,1),e--);if(i){let t=n.cI+1;n.nodes.splice(t,0,p(r.dval)),n.vals.splice(t,0,void 0),n.parents.splice(t,0,n.parent),n.keys.splice(t,0,e),n.nI++,n.pI++}else delete n.parent[e];break}}void 0===t.val&&(t.val=n.node.v)}return!0};Object.defineProperty(e,"name",{value:"Rename:"+o}),n.b.push(e);let t=(e,t,n)=>(n.parent[o]=e,n.match||i||n.key===o||Array.isArray(n.parent)&&!1!==i||(delete n.parent[n.key],t.done=!0),n.ctx.Rename=n.ctx.Rename||{},n.ctx.Rename.fromDefault=n.ctx.Rename.fromDefault||{},n.ctx.Rename.fromDefault[o]={yes:n.fromDefault,key:n.key,dval:n.node.v,node:n.node},!0);Object.defineProperty(t,"name",{value:"Rename:"+o}),n.a.push(t)}return n};function V(e){return"number"==typeof e?e:"number"==typeof(null==e?void 0:e.length)?e.length:null!=e&&"object"==typeof e?Object.keys(e).length:NaN}function N(e,t){let n=String(e),r=null==t||isNaN(t)?30:t<0?0:~~t,o=null==e?0:n.length,i=null==e?"":n.substring(0,o);return(i=r<o?i.substring(0,r-3)+"...":i).substring(0,r)}const S=function(e,t){let n=T(this,t);return n.b.push((function(t,n,r){let o=V(t);if(e<=o)return!0;let i="number"==typeof t?"":"length ";return n.err=q(r,`Value "$VALUE" for path "$PATH" must be a minimum ${i}of ${e} (was ${o}).`),!1})),n},E=function(e,t){let n=T(this,t);return n.b.push((function(t,n,r){let o=V(t);if(o<=e)return!0;let i="number"==typeof t?"":"length ";return n.err=q(r,`Value "$VALUE" for path "$PATH" must be a maximum ${i}of ${e} (was ${o}).`),!1})),n},G=function(e,t){let n=T(this,t);return n.b.push((function(t,n,r){let o=V(t);if(e<o)return!0;let i="number"==typeof t?"be":"have length";return n.err=q(r,`Value "$VALUE" for path "$PATH" must ${i} above ${e} (was ${o}).`),!1})),n},P=function(e,t){let n=T(this,t);return n.b.push((function(t,n,r){let o=V(t);if(o<e)return!0;let i="number"==typeof t?"be":"have length";return n.err=q(r,`Value "$VALUE" for path "$PATH" must ${i} below ${e} (was ${o}).`),!1})),n},D=function(e,t){let n=T(null==t?this:e),r=p(null==t?e:t);return n.a.push((function(e,t,n){if(null!=e){let t=Object.keys(n.node.v),o=Object.keys(e).reduce((e,n)=>(t.includes(n)||e.push(n),e),[]);if(0<o.length){let i=n.nI+o.length-1,l=n.nI;0<t.length?(l--,n.nodes[i]=n.nodes[l],n.vals[i]=n.vals[l],n.parents[i]=n.parents[l],n.keys[i]=n.keys[l]):(i++,n.nodes[i]=n.sI,n.pI=l);for(let t of o)n.nodes[l]=p(r,1+n.dI),n.vals[l]=e[t],n.parents[l]=e,n.keys[l]=t,l++;n.nI=i+1,n.nextSibling=!1,n.dI++}}return!0})),n};function T(e,t){let n=p(void 0===e||e.window===e?t:e);return Object.assign(n,{Above:G,After:w,Any:b,Before:j,Below:P,Closed:k,Define:x,Empty:m,Exact:A,Max:E,Min:S,Never:y,Optional:v,Refer:O,Rename:R,Required:h,Value:D})}function q(e,t,n,r){return M(n||"custom",e,4e3,t,r)}function M(e,t,n,r,o,i){let l={k:t.key,n:t.node,v:t.val,p:d(t),w:e,m:n,t:"",u:o||{}},u=N((void 0===t.val?"":L(t.val)).replace(/"/g,""));return l.t=null==r||""===r?`Validation failed for path "${l.p}" with value "${u}" because `+("type"===e?"instance"===t.node.t?`the value is not an instance of ${t.node.u.n} `:"the value is not of type "+t.node.t:"required"===e?"the value is required":"closed"===e?`the property "${null==o?void 0:o.k}" is not allowed`:"never"===e?"no value is allowed":`check "${e+(i?": "+i:"")}" failed`)+(l.u.thrown?" (threw: "+l.u.thrown.message+")":"."):r.replace(/\$VALUE/g,u).replace(/\$PATH/g,l.p),l}function L(e,t,n){try{let r=JSON.stringify(e,(e,r)=>{var i,l;if(t&&(r=t(e,r)),null!=r&&"object"==typeof r&&r.constructor&&"Object"!==r.constructor.name&&"Array"!==r.constructor.name)r="function"==typeof r.toString?r.toString():r.constructor.name;else if("function"==typeof r)r="function"==typeof f[r.name]&&isNaN(+e)?void 0:null!=r.name&&""!==r.name?r.name:N(r.toString().replace(/[ \t\r\n]+/g," "));else if("bigint"==typeof r)r=String(r.toString());else{if(Number.isNaN(r))return"NaN";!0===n||!0!==(null===(i=null==r?void 0:r.$)||void 0===i?void 0:i.gubu$)&&o!==(null===(l=null==r?void 0:r.$)||void 0===l?void 0:l.gubu$)||(r=null==r.s||""===r.s?r.t:r.s)}return r});return String(r)}catch(r){return JSON.stringify(String(e))}}function _(e){return null==e||"object"!=typeof e?e:JSON.parse(JSON.stringify(e))}const B=e=>p({...e,$:{gubu$:!0}});if("undefined"!=typeof window){let e=[{b:G,n:"Above"},{b:w,n:"After"},{b:g,n:"All"},{b:b,n:"Any"},{b:j,n:"Before"},{b:P,n:"Below"},{b:k,n:"Closed"},{b:x,n:"Define"},{b:m,n:"Empty"},{b:A,n:"Exact"},{b:E,n:"Max"},{b:S,n:"Min"},{b:y,n:"Never"},{b:$,n:"One"},{b:v,n:"Optional"},{b:O,n:"Refer"},{b:R,n:"Rename"},{b:h,n:"Required"},{b:I,n:"Some"},{b:D,n:"Value"}];for(let t of e)Object.defineProperty(t.b,"name",{value:t.n})}Object.assign(f,{Above:G,After:w,All:g,Any:b,Before:j,Below:P,Closed:k,Define:x,Empty:m,Exact:A,Max:E,Min:S,Never:y,One:$,Optional:v,Refer:O,Rename:R,Required:h,Some:I,Value:D,GAbove:G,GAfter:w,GAll:g,GAny:b,GBefore:j,GBelow:P,GClosed:k,GDefine:x,GEmpty:m,GExact:A,GMax:E,GMin:S,GNever:y,GOne:$,GOptional:v,GRefer:O,GRename:R,GRequired:h,GSome:I,GValue:D,G$:B,buildize:T,makeErr:q,stringify:L,truncate:N,Args:U}),Object.defineProperty(f,"name",{value:"gubu"});const H=f;function U(e,t){function n(e){return"function"==typeof e?B({v:e}):e}let r=void 0,o=Object.keys(e).reduce((t,o,i,l)=>{if(o.startsWith("...")&&i+1===l.length)r={name:o.substring(3),shape:n(e[o])};else{let r=o,l=(o.split(":")[1]||"").split(",").filter(e=>""!==e);0<l.length?o=r.split(":")[0]:l=void 0,t[i+1]=R({name:o,claim:l,keep:!0},n(e[r]))}return t},[y()]);r&&(o[0]=w((e,t,n)=>(n.parent[r.name]=n.parent[r.name]||[],n.parent[r.name].push(e),!0),r.shape),o=w((e,t,n)=>(e&&(e[r.name]=e[r.name]||[]),!0),o));let i=H(o);if(t){let e=function(){let e=Array.prototype.slice.call(arguments),n=i(e);return t.call(this,n)};return null!=t.name&&""!=t.name&&Object.defineProperty(e,"name",{value:t.name+"_args"}),e}return i}t.Gubu=H;const{Gubu:C}=t;return C}));
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
module.exports={
  "name": "gubu",
  "version": "0.2.0",
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
    "test-web": "npm run build && npm run build-web && browserify -i util -o test/web.js -e test/entry.js -im && open test/web.html",
    "watch": "tsc -w -d",
    "build": "tsc -d",
    "build-web": "cp gubu.js gubu.min.js && browserify -i util -o gubu.min.js -e gubu.web.js -s Gubu -im -p tinyify",
    "lint": "markdownlint README.md",
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
    "browserify": "^17.0.0",
    "jest": "^27.4.7",
    "tinyify": "^3.0.0",
    "ts-jest": "^27.1.2",
    "typescript": "^4.5.4"
  }
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
/* Copyright (c) 2021-2022 Richard Rodger and other contributors, MIT License */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bar = exports.Foo = void 0;
const package_json_1 = __importDefault(require("../package.json"));
const Large = require('./large');
const Long = require('./long');
// import { Gubu } from '../gubu'
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
const truncate = Gubu.truncate;
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
exports.Foo = Foo;
class Bar {
    constructor(b) {
        this.b = -2;
        this.b = b;
    }
}
exports.Bar = Bar;
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
    test('valid-basic', () => {
        let g0 = Gubu({ x: 1, y: 'Y' });
        let d0 = { x: 2, z: true };
        if (g0.valid(d0)) {
            expect(d0).toEqual({ x: 2, y: 'Y', z: true });
            expect(d0.x).toEqual(2);
            expect(d0.y).toEqual('Y');
            expect(d0.z).toEqual(true);
        }
        let g0d = Gubu({ x: 1, y: 'Y' });
        let d0d = { x: 2, z: true };
        let d0do = g0d(d0d);
        expect(d0do).toEqual({ x: 2, y: 'Y', z: true });
        expect(d0do.x).toEqual(2);
        expect(d0do.y).toEqual('Y');
        expect(d0do.z).toEqual(true);
        let g1 = Gubu({ x: Number, y: 'Y' });
        let d1 = { x: 2, z: true };
        if (g1.valid(d1)) {
            expect(d1).toEqual({ x: 2, y: 'Y', z: true });
            expect(d1.x).toEqual(2);
            expect(d1.y).toEqual('Y');
            expect(d1.z).toEqual(true);
        }
        let g2 = Gubu({ x: { k: 1 }, y: 'Y' });
        let d2 = { x: { k: 2 }, z: true };
        if (g2.valid(d2)) {
            expect(d2).toEqual({ x: { k: 2 }, y: 'Y', z: true });
            expect(d2.x).toEqual({ k: 2 });
            expect(d2.y).toEqual('Y');
            expect(d2.z).toEqual(true);
        }
        let g3 = Gubu({ ...new Foo(1) });
        let d3 = { a: 11, x: true };
        if (g3.valid(d3)) {
            expect(d3).toEqual({ a: 11, x: true });
            expect(d3.a).toEqual(11);
            expect(d3.x).toEqual(true);
        }
        let g4 = Gubu({ x: Closed({ k: 1 }), y: 'Y' });
        let d4 = { z: true };
        if (g4.valid(d4)) {
            expect(d4).toEqual({ x: { k: 1 }, y: 'Y', z: true });
            expect(d4.x).toEqual({ k: 1 });
            expect(d4.x.k).toEqual(1);
            expect(d4.y).toEqual('Y');
            expect(d4.z).toEqual(true);
        }
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
    test('readme-options', () => {
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
    });
    test('readme-deep', () => {
        const productListShape = Gubu({
            products: [
                {
                    name: String,
                    img: 'generic.png'
                }
            ]
        });
        expect(productListShape({})).toEqual({ products: [] });
        let result = productListShape({
            products: [
                { name: 'Apple', img: 'apple.png' },
                { name: 'Pear', img: 'pear.png' },
                { name: 'Banana' } // Missing image!
            ]
        });
        // console.dir(result, { depth: null })
        expect(result).toEqual({
            products: [
                { name: 'Apple', img: 'apple.png' },
                { name: 'Pear', img: 'pear.png' },
                { name: 'Banana', img: 'generic.png' }
            ]
        });
    });
    test('readme-shape-builder', () => {
        const userShape = Gubu({
            person: Required({
                name: String,
                age: Number,
            })
        });
        expect(() => userShape({})).toThrow('Validation failed for path "person" with value "" because the value is required.');
        expect(userShape({
            person: {
                name: 'Alice',
                age: 99
            }
        })).toEqual({
            person: {
                name: 'Alice',
                age: 99
            }
        });
    });
    test('readme-recursive', () => {
        let tree = Gubu({
            root: Define('BRANCH', {
                value: String,
                left: Refer('BRANCH'),
                right: Refer('BRANCH'),
            })
        });
        expect(tree({
            root: {
                value: 'A',
                left: {
                    value: 'AB',
                    left: {
                        value: 'ABC'
                    },
                    right: {
                        value: 'ABD'
                    },
                },
                right: {
                    value: 'AE',
                    left: {
                        value: 'AEF'
                    },
                },
            }
        })).toMatchObject({
            root: {
                value: 'A',
                left: {
                    value: 'AB',
                    left: {
                        value: 'ABC'
                    },
                    right: {
                        value: 'ABD'
                    },
                },
                right: {
                    value: 'AE',
                    left: {
                        value: 'AEF'
                    },
                },
            }
        });
        expect(() => tree({
            root: {
                value: 'A',
                left: {
                    value: 'AB',
                    left: {
                        value: 'ABC',
                        left: {
                            value: 123
                        },
                    },
                },
            }
        })).toThrow('Validation failed for path "root.left.left.left.value" with value "123" because the value is not of type string');
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
    test('match-basic', () => {
        let tmp = {};
        let g0 = Gubu(Number);
        expect(g0.match(1)).toEqual(true);
        expect(g0.match('x')).toEqual(false);
        expect(g0.match(true)).toEqual(false);
        expect(g0.match({})).toEqual(false);
        expect(g0.match([])).toEqual(false);
        // Match does not mutate root
        let g1 = Gubu({ a: { b: 1 } });
        expect(g1.match(tmp.a1 = {})).toEqual(true);
        expect(tmp.a1).toEqual({});
        expect(g1.match(tmp.a1 = { a: {} })).toEqual(true);
        expect(tmp.a1).toEqual({ a: {} });
        let c0 = { err: [] };
        expect(g1.match(tmp.a1 = { a: 1 }, c0)).toEqual(false);
        expect(tmp.a1).toEqual({ a: 1 });
        expect(c0.err[0].w).toEqual('type');
    });
    test('error-basic', () => {
        let g0 = Gubu(Number);
        expect(g0(1)).toEqual(1);
        expect(() => g0('x')).toThrow('Validation failed for path "" with value "x" because the value is not of type number.');
        let ctx0 = { err: [] };
        g0('x', ctx0);
        expect(ctx0).toMatchObject({
            err: [
                {
                    n: { t: 'number' },
                    v: 'x',
                    p: '',
                    w: 'type',
                    m: 1050,
                    t: 'Validation failed for path "" with value "x" because the value is not of type number.',
                    u: {},
                }
            ]
        });
        try {
            g0('x');
        }
        catch (e) {
            expect(e.message).toEqual('Validation failed for path "" with value "x" because the value is not of type number.');
            expect(e).toMatchObject({
                gubu: true,
                code: 'shape',
            });
            expect(e.desc()).toMatchObject({
                name: 'GubuError',
                code: 'shape',
                err: [
                    {
                        k: undefined,
                        n: { t: 'number' },
                        v: 'x',
                        p: '',
                        w: 'type',
                        m: 1050,
                        t: 'Validation failed for path "" with value "x" because the value is not of type number.',
                        u: {},
                    }
                ],
                ctx: {}
            });
        }
        let g1 = Gubu({ q: { a: String, b: Number } });
        let ctx1 = { err: [] };
        g1({ q: { a: 1, b: 'x' } }, ctx1);
        expect(ctx1).toMatchObject({
            err: [
                {
                    k: 'a',
                    n: { t: 'string' },
                    v: 1,
                    p: 'q.a',
                    w: 'type',
                    m: 1050,
                    t: 'Validation failed for path "q.a" with value "1" because the value is not of type string.',
                    u: {},
                },
                {
                    k: 'b',
                    n: { t: 'number' },
                    v: 'x',
                    p: 'q.b',
                    w: 'type',
                    m: 1050,
                    t: 'Validation failed for path "q.b" with value "x" because the value is not of type number.',
                    u: {},
                }
            ]
        });
        try {
            g1({ q: { a: 1, b: 'x' } });
        }
        catch (e) {
            expect(e.message).toEqual(`Validation failed for path "q.a" with value "1" because the value is not of type string.
Validation failed for path "q.b" with value "x" because the value is not of type number.`);
            expect(e).toMatchObject({
                gubu: true,
                code: 'shape',
            });
            expect(e.desc()).toMatchObject({
                name: 'GubuError',
                code: 'shape',
                err: [
                    {
                        k: 'a',
                        n: { t: 'string' },
                        v: 1,
                        p: 'q.a',
                        w: 'type',
                        m: 1050,
                        t: 'Validation failed for path "q.a" with value "1" because the value is not of type string.',
                        u: {},
                    },
                    {
                        k: 'b',
                        n: { t: 'number' },
                        v: 'x',
                        p: 'q.b',
                        w: 'type',
                        m: 1050,
                        t: 'Validation failed for path "q.b" with value "x" because the value is not of type number.',
                        u: {},
                    }
                ],
                ctx: {}
            });
        }
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
        expect(() => rs0e()).toThrow('required');
        const os0 = Gubu('x');
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
        const os0e2 = Gubu(Empty(''));
        expect(os0e2('')).toEqual('');
        expect(os0e2()).toEqual('');
        expect(os0e2(undefined)).toEqual('');
        expect(os0e2('x')).toEqual('x');
        expect(os0e2('y')).toEqual('y');
        const os1e = Gubu(Optional(Empty(String)));
        expect(os1e()).toEqual(undefined);
        expect(os1e('')).toEqual('');
        expect(os1e('x')).toEqual('x');
        const os1eO = Gubu({ a: Optional(Empty(String)) });
        expect(os1eO({})).toEqual({});
        expect(os1eO({ a: '' })).toEqual({ a: '' });
        expect(os1eO({ a: 'x' })).toEqual({ a: 'x' });
        // Long values are truncated in error descriptions.
        expect(() => Gubu(Number)('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')).toThrow('Validation failed for path "" with value "aaaaaaaaaaaaaaaaaaaaaaaaaaa..." because the value is not of type number.');
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
        expect(obj01()).toEqual({ a: { x: 1 } });
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
    test('api-functions', () => {
        let f0 = () => true;
        let f1 = () => false;
        let { G$ } = Gubu;
        let shape = Gubu({ fn: G$({ v: f0 }) });
        expect(shape({})).toEqual({ fn: f0 });
        expect(shape({ fn: f1 })).toEqual({ fn: f1 });
    });
    test('api-builders-chain-compose', () => {
        let cr0s = Gubu(Closed(Required({ x: 1 })), { name: 'cr0' });
        let cr1s = Gubu(Required(Closed({ x: 1 })), { name: 'cr1' });
        let cr2s = Gubu(Closed({ x: 1 }).Required(), { name: 'cr2' });
        let cr3s = Gubu(Required({ x: 1 }).Closed(), { name: 'cr3' });
        let s0 = {
            '$': { 'gubu$': true, 'v$': package_json_1.default.version },
            t: 'object',
            v: {
                x: {
                    '$': { 'gubu$': true, 'v$': package_json_1.default.version },
                    t: 'number',
                    v: 1,
                    r: false,
                    o: false,
                    d: 1,
                    u: {},
                    a: [],
                    b: []
                }
            },
            r: true,
            o: false,
            d: 0,
            u: {},
            a: [],
            b: ['Closed']
        };
        expect(cr0s.spec()).toEqual(s0);
        expect(cr1s.spec()).toEqual(s0);
        expect(cr2s.spec()).toEqual(s0);
        expect(cr3s.spec()).toEqual(s0);
        expect(cr0s({ x: 11 })).toEqual({ x: 11 });
        expect(cr1s({ x: 11 })).toEqual({ x: 11 });
        expect(cr2s({ x: 11 })).toEqual({ x: 11 });
        expect(cr3s({ x: 11 })).toEqual({ x: 11 });
        expect(() => cr0s({ x: 11, y: 2 })).toThrow('property "y" is not allowed.');
        expect(() => cr1s({ x: 11, y: 2 })).toThrow('property "y" is not allowed.');
        expect(() => cr2s({ x: 11, y: 2 })).toThrow('property "y" is not allowed.');
        expect(() => cr3s({ x: 11, y: 2 })).toThrow('property "y" is not allowed.');
        expect(cr0s({})).toEqual({ x: 1 });
        expect(cr1s({})).toEqual({ x: 1 });
        expect(cr2s({})).toEqual({ x: 1 });
        expect(cr3s({})).toEqual({ x: 1 });
    });
    test('api-builders-index', () => {
        let shape_AboveB0 = Gubu(Above(10));
        expect(shape_AboveB0(11)).toEqual(11);
        expect(() => shape_AboveB0(10)).toThrow('Value "10" for path "" must be above 10 (was 10).');
        expect(() => shape_AboveB0(true)).toThrow('Value "true" for path "" must have length above 10 (was NaN).');
        let shape_AboveB1 = Gubu(Above(2));
        expect(shape_AboveB1('abc')).toEqual('abc');
        expect(() => shape_AboveB1('ab')).toThrow('Value "ab" for path "" must have length above 2 (was 2).');
        expect(shape_AboveB1([1, 2, 3])).toEqual([1, 2, 3]);
        expect(() => shape_AboveB1([1, 2])).toThrow('Value "[1,2]" for path "" must have length above 2 (was 2).');
        let shape_AboveB2 = Gubu(Above(2, Number));
        expect(shape_AboveB2(3)).toEqual(3);
        expect(() => shape_AboveB2([1, 2, 3])).toThrow('Validation failed for path "" with value "[1,2,3]" because the value is not of type number.');
        let shape_AboveB3 = Gubu(Optional(Above(2, Number)));
        expect(shape_AboveB3(3)).toEqual(3);
        expect(shape_AboveB3()).toEqual(undefined);
        let shape_AfterB0 = Gubu(After((v) => v > 10, 15));
        expect(shape_AfterB0(11)).toEqual(11);
        expect(() => shape_AfterB0(10)).toThrow('Validation failed for path "" with value "10" because check "custom: (v) => v > 10" failed.');
        expect(() => shape_AfterB0('x')).toThrow(`Validation failed for path "" with value "x" because the value is not of type number.
Validation failed for path "" with value "x" because check "custom: (v) => v > 10" failed.`);
        expect(shape_AfterB0()).toEqual(15);
        let shape_AfterB1 = Gubu(Optional(Number).After((v) => 0 === v % 2));
        expect(shape_AfterB1(2)).toEqual(2);
        expect(() => shape_AfterB1(3)).toThrow('Validation failed for path "" with value "3" because check "custom: (v) => 0 === v % 2" failed.');
        expect(() => shape_AfterB1('x')).toThrow('Validation failed for path "" with value "x" because check "custom: (v) => 0 === v % 2" failed.');
        expect(shape_AfterB1()).toEqual(undefined);
        let shape_AfterB2 = Gubu(After((v) => 0 === v.x % 2, Required({ x: Number })));
        expect(shape_AfterB2({ x: 2 })).toEqual({ x: 2 });
        expect(() => shape_AfterB2({ x: 3 })).toThrow('Validation failed for path "" with value "{x:3}" because check "custom: (v) => 0 === v.x % 2" failed.');
        expect(() => shape_AfterB2({})).toThrow(`Validation failed for path "" with value "{}" because check "custom: (v) => 0 === v.x % 2" failed.
Validation failed for path "x" with value "" because the value is required.`);
        expect(() => shape_AfterB2()).toThrow(`Validation failed for path "" with value "" because the value is required.
Validation failed for path "" with value "" because check "custom: (v) => 0 === v.x % 2" failed (threw: Cannot read prop`);
        // TODO: modify value
        let shape_AllB0 = Gubu(All(Number, (v) => v > 10));
        expect(shape_AllB0(11)).toEqual(11);
        expect(() => shape_AllB0(10)).toThrow(`Value "10" for path "" does not satisfy all of: "Number","(v) => v > 10"`);
        let shape_AllB1 = Gubu(All());
        expect(shape_AllB1(123)).toEqual(123);
        expect(() => shape_AllB1()).toThrow('required');
        let shape_AllB2 = Gubu({ a: Optional(All({ b: String }, Min(2))) });
        expect(shape_AllB2({ a: { b: 'X', c: 1 } })).toEqual({ a: { b: 'X', c: 1 } });
        expect(shape_AllB2({})).toEqual({});
        let shape_AnyB0 = Gubu(Any());
        expect(shape_AnyB0(11)).toEqual(11);
        expect(shape_AnyB0(10)).toEqual(10);
        expect(shape_AnyB0()).toEqual(undefined);
        expect(shape_AnyB0(null)).toEqual(null);
        expect(shape_AnyB0(NaN)).toEqual(NaN);
        expect(shape_AnyB0({})).toEqual({});
        expect(shape_AnyB0([])).toEqual([]);
        let shape_BeforeB0 = Gubu(Before((v) => v > 10, 10));
        expect(shape_BeforeB0(11)).toEqual(11);
        expect(() => shape_BeforeB0(10)).toThrow('Validation failed for path "" with value "10" because check "custom: (v) => v > 10" failed.');
        // TODO: modify value
        let shape_BelowB0 = Gubu(Below(10));
        expect(shape_BelowB0(9)).toEqual(9);
        expect(() => shape_BelowB0(10)).toThrow('Value "10" for path "" must be below 10 (was 10).');
        let shape_ClosedB0 = Gubu(Closed({ a: 11 }));
        expect(shape_ClosedB0({ a: 10 })).toEqual({ a: 10 });
        expect(() => shape_ClosedB0({ a: 10, b: 11 })).toThrow('Validation failed for path "" with value "{a:10,b:11}" because the property "b" is not allowed.');
        let shape_DefineB0 = Gubu({ a: Define('foo', 11), b: Refer('foo') });
        expect(shape_DefineB0({ a: 10, b: 12 })).toEqual({ a: 10, b: 12 });
        expect(() => shape_DefineB0({ a: 'A', b: 'B' })).toThrow(`Validation failed for path "a" with value "A" because the value is not of type number.
Validation failed for path "b" with value "B" because the value is not of type number.`);
        let shape_EmptyB0 = Gubu({ a: Empty(String), b: String });
        expect(shape_EmptyB0({ a: '', b: 'ABC' })).toEqual({ a: '', b: 'ABC' });
        expect(() => shape_EmptyB0({ a: '', b: '' })).toThrow('Validation failed for path "b" with value "" because the value is required.');
        let shape_ExactB0 = Gubu(Exact(11, 12, true));
        expect(shape_ExactB0(11)).toEqual(11);
        expect(shape_ExactB0(12)).toEqual(12);
        expect(shape_ExactB0(true)).toEqual(true);
        expect(() => shape_ExactB0(10)).toThrow('Value "10" for path "" must be exactly one of: 11,12,true.');
        expect(() => shape_ExactB0(false)).toThrow('Value "false" for path "" must be exactly one of: 11,12,true.');
        let shape_MaxB0 = Gubu(Max(11));
        expect(shape_MaxB0(11)).toEqual(11);
        expect(shape_MaxB0(10)).toEqual(10);
        expect(() => shape_MaxB0(12)).toThrow('Value "12" for path "" must be a maximum of 11 (was 12).');
        let shape_MinB0 = Gubu(Min(11));
        expect(shape_MinB0(11)).toEqual(11);
        expect(shape_MinB0(12)).toEqual(12);
        expect(() => shape_MinB0(10)).toThrow('Value "10" for path "" must be a minimum of 11 (was 10).');
        let shape_NeverB0 = Gubu(Never());
        expect(() => shape_NeverB0(10)).toThrow('Validation failed for path "" with value "10" because no value is allowed.');
        expect(() => shape_NeverB0(true)).toThrow('Validation failed for path "" with value "true" because no value is allowed.');
        let shape_OneB0 = Gubu(One(Exact(10), Exact(11), Exact(true)));
        expect(shape_OneB0(10)).toEqual(10);
        expect(shape_OneB0(11)).toEqual(11);
        expect(shape_OneB0(true)).toEqual(true);
        expect(() => shape_OneB0(12)).toThrow('Value "12" for path "" does not satisfy one of: "10","11","true"');
        expect(() => shape_OneB0(false)).toThrow('Value "false" for path "" does not satisfy one of: "10","11","true"');
        expect(() => shape_OneB0(null)).toThrow('Value "null" for path "" does not satisfy one of: "10","11","true"');
        expect(() => shape_OneB0(NaN)).toThrow('Value "NaN" for path "" does not satisfy one of: "10","11","true"');
        expect(() => shape_OneB0(undefined)).toThrow('Value "" for path "" does not satisfy one of: "10","11","true"');
        expect(() => shape_OneB0()).toThrow('Value "" for path "" does not satisfy one of: "10","11","true"');
        let shape_OneB1 = Gubu(One(Number, String));
        expect(shape_OneB1(123)).toEqual(123);
        expect(shape_OneB1('abc')).toEqual('abc');
        expect(() => shape_OneB1(true)).toThrow('Value "true" for path "" does not satisfy one of: "Number","String"');
        // TODO: more complex objects
        let shape_OptionalB0 = Gubu({ a: Optional(11) });
        expect(shape_OptionalB0({ a: 10 })).toEqual({ a: 10 });
        expect(shape_OptionalB0({})).toEqual({});
        let shape_ReferB0 = Gubu({ a: Define('foo', 11), b: Refer('foo') });
        expect(shape_ReferB0({ a: 10, b: 12 })).toEqual({ a: 10, b: 12 });
        expect(() => shape_ReferB0({ a: 'A', b: 'B' })).toThrow(`Validation failed for path "a" with value "A" because the value is not of type number.
Validation failed for path "b" with value "B" because the value is not of type number.`);
        // TODO: also recursive
        let shape_RenameB0 = Gubu({ a: Rename('b', Number) });
        expect(shape_RenameB0({ a: 10 })).toEqual({ b: 10 });
        expect(() => shape_RenameB0({})).toThrow('Validation failed for path "a" with value "" because the value is required.');
        let shape_RenameB1 = Gubu({ a: Rename({ name: 'b', keep: true }, 123) });
        expect(shape_RenameB1({ a: 10 })).toEqual({ a: 10, b: 10 });
        expect(shape_RenameB1({})).toEqual({ a: 123, b: 123 });
        let shape_RequiredB0 = Gubu(Required(11));
        expect(shape_RequiredB0(11)).toEqual(11);
        expect(() => shape_RequiredB0()).toThrow('Validation failed for path "" with value "" because the value is required.');
        // FIX
        let shape_SomeB0 = Gubu(Some({ x: 1 }, { y: 2 }));
        expect(shape_SomeB0({ x: 1 })).toEqual({ x: 1 });
        expect(shape_SomeB0({ y: 2 })).toEqual({ y: 2 });
        expect(shape_SomeB0({ x: 1, y: 2 })).toEqual({ x: 1, y: 2 });
        expect(shape_SomeB0({ x: true, y: 2 })).toEqual({ x: true, y: 2 });
        expect(shape_SomeB0({ x: 1, y: true })).toEqual({ x: 1, y: true });
        expect(() => shape_SomeB0({ x: true, y: true })).toThrow(`Value "{x:true,y:true}" for path "" does not satisfy some of: {"x":1},{"y":2}`);
        // TODO: more complex objects
        let shape_ValueB0 = Gubu(Value({}, Number));
        expect(shape_ValueB0({ x: 10 })).toEqual({ x: 10 });
        expect(shape_ValueB0({ x: 10, y: 11 })).toEqual({ x: 10, y: 11 });
        expect(() => shape_ValueB0({ x: true })).toThrow('Validation failed for path "x" with value "true" because the value is not of type number.');
        // TODO: with explicits
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
        })).toMatchObject({
            string: 'S',
            number: 11,
            boolean: false,
            object: { x: 22 },
            array: [33],
        });
    });
    test('type-native-required', () => {
        let g0 = Gubu({
            string: String,
            number: Number,
            boolean: Boolean,
            object: Object,
            array: Array,
            function: Function,
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
        let g6 = Gubu([1]);
        expect(g6(new Array(3))).toEqual([1, 1, 1]);
        let a0 = [11, 22, 33];
        delete a0[1];
        expect(g6(a0)).toEqual([11, 1, 33]);
        let g7 = Gubu([Never()]);
        expect(g7([])).toEqual([]);
        expect(() => g7([1])).toThrow('Validation failed for path "0" with value "1" because no value is allowed.');
        expect(() => g7(new Array(1))).toThrow('Validation failed for path "0" with value "" because no value is allowed.');
        let g8 = Gubu(Closed([Any()]));
        expect(g8([])).toEqual([]);
        expect(g8([1])).toEqual([1]);
        expect(g8([1, 'x'])).toEqual([1, 'x']);
        expect(g8(new Array(1))).toEqual([undefined]);
        expect(g8(new Array(2))).toEqual([undefined, undefined]);
        let g9 = Gubu(Closed([1]));
        expect(g9([])).toEqual([]);
        expect(g9([1])).toEqual([1]);
        expect(g9([1, 2])).toEqual([1, 2]);
        expect(g9(new Array(1))).toEqual([1]);
        expect(g9(new Array(2))).toEqual([1, 1]);
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
        expect(() => g2({}))
            .toThrow('Validation failed for path "a" with value "" because check "custom: (v) => v > 10" failed.');
        let g3 = Gubu((v) => v > 10);
        expect(g3(11)).toEqual(11);
        expect(() => g3(9)).toThrow('Validation failed for path "" with value "9" because check "custom: (v) => v > 10" failed.');
    });
    test('custom-modify', () => {
        let g0 = Gubu({
            a: (v, u) => (u.val = v * 2, true),
            b: (_v, u) => {
                u.err = 'BAD VALUE $VALUE AT $PATH';
                return false;
            },
            c: (v, u, s) => (u.val = (v ? v + ` (key=${s.key})` : undefined), true),
            d: (_v, u, _s) => (u.val = undefined, true)
        });
        expect(g0({ a: 3 })).toEqual({ a: 6 });
        expect(() => g0({ b: 1 })).toThrow('BAD VALUE 1 AT b');
        expect(g0({ c: 'x' })).toEqual({ c: 'x (key=c)' });
        expect(g0({ d: 'D' })).toEqual({ d: 'D' });
        let g1 = Gubu({
            a: (_v, u, _s) => (u.uval = undefined, true)
        });
        expect(g1({ a: 'A' })).toEqual({ a: undefined });
        expect(g1({ a: 'A', b: undefined })).toEqual({ a: undefined });
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
    test('custom-builder-hyperbole', () => {
        const Hyperbole = function (shape0) {
            let node = buildize(this, shape0);
            node.b.push((v, u) => {
                if ('string' === typeof (v)) {
                    u.val = v.toUpperCase();
                }
                return true;
            });
            node.a.push((v, u) => {
                if ('string' === typeof (v)) {
                    u.val = v + '!';
                }
                return true;
            });
            return node;
        };
        const g0 = Gubu(Hyperbole('foo'));
        expect(g0('a')).toEqual('A!');
        expect(() => g0(1)).toThrow('type');
        expect(g0()).toEqual('foo!'); // before called before processing!
        const g1 = Gubu(Optional(Hyperbole(One(String, Number))));
        expect(g1('a')).toEqual('A!');
        expect(g1(1)).toEqual(1);
        expect(g1()).toEqual(undefined);
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
        expect(() => g0()).toThrow('Validation failed for path "a" with value "" because the value is required.');
        let g1 = Gubu({ a: Required([1]) });
        expect(g1({ a: [11] })).toEqual({ a: [11] });
        expect(() => g1({})).toThrow('Validation failed for path "a" with value "" because the value is required.');
        expect(() => g1()).toThrow('Validation failed for path "a" with value "" because the value is required.');
        let g2 = Gubu(Required(1));
        expect(g2(1)).toEqual(1);
        expect(g2(2)).toEqual(2);
        // TODO: note this in docs - deep child requires must be satisfied unless Optional
        let g3 = Gubu({ a: { b: String } });
        expect(() => g3()).toThrow(/"a.b".*required/);
        expect(() => g3({})).toThrow(/"a.b".*required/);
        expect(() => g3({ a: {} })).toThrow(/"a.b".*required/);
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
        expect(g1(tmp.a1 = [new Date(), /a/, 'Q'])).toEqual(tmp.a1);
        expect(g1((tmp.a2 = [new Date(), /a/], tmp.a2.x = 1, tmp.a2))).toEqual(tmp.a2);
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
        let g4 = Gubu(Closed({ x: 1 }));
        expect(g4({})).toEqual({ x: 1 });
        expect(g4({ x: 11 })).toEqual({ x: 11 });
        expect(() => g4({ x: 11, y: 2 })).toThrow('property \"y\" is not allowed');
    });
    test('builder-one', () => {
        let g0 = Gubu(One(Number, String));
        expect(g0(1)).toEqual(1);
        expect(g0('x')).toEqual('x');
        expect(() => g0(true)).toThrow('Value "true" for path "" does not satisfy one of: "Number","String"');
        expect(() => g0()).toThrow('Value "" for path "" does not satisfy one of: "Number","String"');
        let g0o = Gubu(Optional(One(Number, String)));
        expect(g0o(1)).toEqual(1);
        expect(g0o('x')).toEqual('x');
        expect(g0o()).toEqual(undefined);
        expect(() => g0o(true)).toThrow('Value "true" for path "" does not satisfy one of: "Number","String"');
        let g1 = Gubu([One({ x: Number }, { x: String })]);
        expect(g1([{ x: 1 }, { x: 'x' }, { x: 2 }, { x: 'y' }]))
            .toMatchObject([{ x: 1 }, { x: 'x' }, { x: 2 }, { x: 'y' }]);
        expect(() => g1([{ x: 1 }, { x: true }, { x: 2 }, { x: false }]))
            .toThrow(`Value "{x:true}" for path "1" does not satisfy one of: {"x":"Number"},{"x":"String"}
Value "{x:false}" for path "3" does not satisfy one of: {"x":"Number"},{"x":"String"}`);
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
        expect(() => g2([
            { x: 'red', y: 3 },
            { x: 'green', z: 'Z' },
        ])).toThrow(`Value "{x:red,y:3}" for path "0" does not satisfy one of: {"x":"\\"red\\"","y":"String"},{"x":"\\"green\\"","z":"Number"}
Value "{x:green,z:Z}" for path "1" does not satisfy one of: {"x":"\\"red\\"","y":"String"},{"x":"\\"green\\"","z":"Number"}`);
    });
    test('builder-some', () => {
        let g0 = Gubu({ a: Some(Number, String) });
        expect(g0({ a: 1 })).toEqual({ a: 1 });
        expect(g0({ a: 'x' })).toEqual({ a: 'x' });
        expect(() => g0({ a: true })).toThrow(`Value "true" for path "a" does not satisfy some of: "Number","String"`);
        expect(() => g0({})).toThrow('Value "" for path "a" does not satisfy some of: "Number","String"');
        let g1 = Gubu(Some(Number, String));
        expect(g1(1)).toEqual(1);
        expect(g1('x')).toEqual('x');
        expect(() => g1(true)).toThrow(`Value "true" for path "" does not satisfy some of: "Number","String"`);
        let g2 = Gubu([Some(Number, String)]);
        expect(g2([1])).toEqual([1]);
        expect(g2(['x'])).toEqual(['x']);
        expect(g2([1, 2])).toEqual([1, 2]);
        expect(g2([1, 'x'])).toEqual([1, 'x']);
        expect(g2(['x', 1])).toEqual(['x', 1]);
        expect(g2(['x', 'y'])).toEqual(['x', 'y']);
        expect(g2(['x', 1, 'y', 2])).toEqual(['x', 1, 'y', 2]);
        expect(() => g2([true])).toThrow(`Value "true" for path "0" does not satisfy some of: "Number","String"`);
        let g3 = Gubu({ a: [Some(Number, String)] });
        expect(g3({ a: [1] })).toEqual({ a: [1] });
        expect(g3({ a: ['x'] })).toEqual({ a: ['x'] });
        expect(g3({ a: ['x', 1, 'y', 2] })).toEqual({ a: ['x', 1, 'y', 2] });
        expect(() => g3({ a: [1, 2, true] })).toThrow(`Value "true" for path "a.2" does not satisfy some of: "Number","String"`);
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
        expect(() => g0({ x: 'b', y: 'a' })).toThrow(`Value "{x:b,y:a}" for path "" does not satisfy all of: {\"x\":1},{\"y\":\"a\"}`);
        expect(() => g0()).toThrow('Validation failed for path "" with value "" because the value is required.');
        let g1 = Gubu({ a: All((v) => v > 10, (v) => v < 20) });
        expect(g1({ a: 11 })).toEqual({ a: 11 });
        expect(() => g1({ a: 0 })).toThrow('Value "0" for path "a" does not satisfy all of: "(v) => v > 10","(v) => v < 20"');
        let g2 = Gubu(All({ x: 1 }, { y: { z: 'a' } }));
        expect(g2({ x: 11, y: { z: 'AA' } })).toEqual({ x: 11, y: { z: 'AA' } });
        expect(() => g2({ x: 11, y: { z: true } })).toThrow('Value "{x:11,y:{z:true}}" for path "" does not satisfy all of: {"x":1},{"y":{"z":"a"}}');
        let g3 = Gubu(All({ x: 1 }, { y: 2 }));
        expect(g3({ x: 11, y: 22 })).toEqual({ x: 11, y: 22 });
        expect(() => g3({ x: 'X', y: 'Y' })).toThrow('Value "{x:X,y:Y}" for path "" does not satisfy all of: {"x":1},{"y":2}');
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
        let g0 = Gubu(Never());
        expect(() => g0(1)).toThrow('Validation failed for path "" with value "1" because no value is allowed.');
        let g1 = Gubu({ a: Never() });
        expect(() => g1({ a: 'x' })).toThrow('Validation failed for path "a" with value "x" because no value is allowed.');
        // Another way to do closed arrays.
        let g2 = Gubu([Never(), 1, 'x']);
        expect(g2([2, 'y'])).toEqual([2, 'y']);
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
        expect(() => g1('zed')).toThrow('exactly one of: "foo","bar"');
    });
    test('builder-define-refer-basic', () => {
        let g0 = Gubu({ a: Define('A', { x: 1 }), b: Refer('A'), c: Refer('A') });
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
            d: [Min(4, Number)],
            e: [Min(2, {})],
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
        expect(g0({ e: [{ x: 1, y: 2 }] })).toMatchObject({ e: [{ x: 1, y: 2 }] });
        expect(g0({ e: [{ x: 1, y: 2, z: 3 }] }))
            .toMatchObject({ e: [{ x: 1, y: 2, z: 3 }] });
        expect(() => g0({ e: [{ x: 1 }] })).toThrow('Value "{x:1}" for path "e.0" must be a minimum length of 2 (was 1).');
        expect(() => g0({ e: [{}] })).toThrow('Value "{}" for path "e.0" must be a minimum length of 2 (was 0).');
        expect(g0({ e: [] })).toMatchObject({ e: [] });
    });
    test('builder-max', () => {
        let g0 = Gubu({
            a: Max(10),
            b: Max(2, [String]),
            c: Max(3, 'foo'),
            d: [Max(4, Number)],
            e: [Max(2, {})],
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
        expect(g0({ e: [{ x: 1, y: 2 }] })).toMatchObject({ e: [{ x: 1, y: 2 }] });
        expect(g0({ e: [{ x: 1 }] }))
            .toMatchObject({ e: [{ x: 1 }] });
        expect(g0({ e: [{}] }))
            .toMatchObject({ e: [{}] });
        expect(() => g0({ e: [{ x: 1, y: 2, z: 3 }] })).toThrow('Value "{x:1,y:2,z:3}" for path "e.0" must be a maximum length of 2 (was 3).');
        expect(g0({ e: [] })).toMatchObject({ e: [] });
    });
    test('builder-above', () => {
        let g0 = Gubu({
            a: Above(10),
            b: Above(2, [String]),
            c: Above(3, 'foo'),
            d: [Above(4, Number)],
            e: [Above(2, {})],
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
            .toThrow('Value "" for path "c" must have length above 3 (was 0).');
        expect(g0({ d: [5, 6] })).toMatchObject({ d: [5, 6] });
        expect(() => g0({ d: [4, 5, 6, 3] }))
            .toThrow(`Value "4" for path "d.0" must be above 4 (was 4).
Value "3" for path "d.3" must be above 4 (was 3).`);
        expect(g0({ e: [{ x: 1, y: 2, z: 3 }] }))
            .toMatchObject({ e: [{ x: 1, y: 2, z: 3 }] });
        expect(() => g0({ e: [{ x: 1, y: 2 }] }))
            .toThrow('Value "{x:1,y:2}" for path "e.0" must have length above 2 (was 2).');
        expect(() => g0({ e: [{ x: 1 }] }))
            .toThrow('Value "{x:1}" for path "e.0" must have length above 2 (was 1).');
        expect(() => g0({ e: [{}] }))
            .toThrow('Value "{}" for path "e.0" must have length above 2 (was 0).');
        expect(g0({ e: [] })).toMatchObject({ e: [] });
    });
    test('builder-below', () => {
        let g0 = Gubu({
            a: Below(10),
            b: Below(2, [String]),
            c: Below(3, 'foo'),
            d: [Below(4, Number)],
            e: [Below(2, {})],
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
        expect(g0({ e: [{ x: 1 }] }))
            .toMatchObject({ e: [{ x: 1 }] });
        expect(g0({ e: [{}] }))
            .toMatchObject({ e: [{}] });
        expect(() => g0({ e: [{ x: 1, y: 2 }] })).toThrow('Value "{x:1,y:2}" for path "e.0" must have length below 2 (was 2).');
        expect(g0({ e: [] })).toMatchObject({ e: [] });
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
        expect(() => g1({ a: { b: 11 } }, c0)).toThrow('Value "11" for path "a.b" does not satisfy all of: "Number","(v, _u, s) => v < s.ctx.max"');
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
                v: 1,
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
                        v: 1,
                        p: '',
                        w: 'type',
                        m: 1050,
                        t: 'Validation failed for path "" with value "1" because the value is not of type nan.'
                    }
                ]
            });
            expect(JSON.stringify(e)).toEqual('{"gubu":true,"name":"GubuError","code":"shape","err":[{"n":{"$":{"v$":"' + package_json_1.default.version + '"},"t":"nan","v":null,"r":false,"o":false,"d":0,"u":{},"a":[],"b":[]},"v":1,"p":"","w":"type","m":1050,"t":"Validation failed for path \\"\\" with value \\"1\\" because the value is not of type nan.","u":{}}],"message":"Validation failed for path \\"\\" with value \\"1\\" because the value is not of type nan."}');
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
    test('spec-required', () => {
        let g0 = Gubu(Required(1));
        expect(g0.spec()).toMatchObject({ d: 0, o: false, r: true, t: 'number', v: 1 });
        let g1 = Gubu(Required({ a: 1 }));
        expect(g1.spec()).toMatchObject({
            d: 0, o: false, r: true, t: 'object', v: {
                a: { d: 1, o: false, r: false, t: 'number', v: 1 }
            }
        });
        let g2 = Gubu(Required({ a: Required(1) }));
        expect(g2.spec()).toMatchObject({
            d: 0, o: false, r: true, t: 'object', v: {
                a: { d: 1, o: false, r: true, t: 'number', v: 1 }
            }
        });
        let g3 = Gubu(Required({ a: Required({ b: 1 }) }));
        expect(g3.spec()).toMatchObject({
            d: 0, o: false, r: true, t: 'object', v: {
                a: {
                    d: 1, o: false, r: true, t: 'object', v: {
                        b: {
                            d: 2, o: false, r: false, t: 'number', v: 1
                        }
                    }
                }
            }
        });
        let g4 = Gubu(Required({ a: Optional({ b: 1 }) }));
        expect(g4.spec()).toMatchObject({
            d: 0, o: false, r: true, t: 'object', v: {
                a: {
                    d: 1, o: true, r: false, t: 'object', v: {
                        b: {
                            d: 2, o: false, r: false, t: 'number', v: 1
                        }
                    }
                }
            }
        });
        let g5 = Gubu(Optional({ a: Required({ b: 1 }) }));
        expect(g5.spec()).toMatchObject({
            d: 0, o: true, r: false, t: 'object', v: {
                a: {
                    d: 1, o: false, r: true, t: 'object', v: {
                        b: {
                            d: 2, o: false, r: false, t: 'number', v: 1
                        }
                    }
                }
            }
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
    test('truncate', () => {
        expect(truncate('')).toEqual('');
        expect(truncate('0')).toEqual('0');
        expect(truncate('01')).toEqual('01');
        expect(truncate('012')).toEqual('012');
        expect(truncate('0123')).toEqual('0123');
        expect(truncate('01234')).toEqual('01234');
        expect(truncate('012345')).toEqual('012345');
        expect(truncate('0123456')).toEqual('0123456');
        expect(truncate('01234567')).toEqual('01234567');
        expect(truncate('012345678')).toEqual('012345678');
        expect(truncate('0123456789')).toEqual('0123456789');
        expect(truncate('01234567890123456789012345678')).toEqual('01234567890123456789012345678');
        expect(truncate('012345678901234567890123456789')).toEqual('012345678901234567890123456789');
        expect(truncate('0123456789012345678901234567890')).toEqual('012345678901234567890123456...');
        expect(truncate('', 6)).toEqual('');
        expect(truncate('0', 6)).toEqual('0');
        expect(truncate('01', 6)).toEqual('01');
        expect(truncate('012', 6)).toEqual('012');
        expect(truncate('0123', 6)).toEqual('0123');
        expect(truncate('01234', 6)).toEqual('01234');
        expect(truncate('012345', 6)).toEqual('012345');
        expect(truncate('0123456', 6)).toEqual('012...');
        expect(truncate('01234567', 6)).toEqual('012...');
        expect(truncate('012345678', 6)).toEqual('012...');
        expect(truncate('0123456789', 6)).toEqual('012...');
        expect(truncate('', 5)).toEqual('');
        expect(truncate('0', 5)).toEqual('0');
        expect(truncate('01', 5)).toEqual('01');
        expect(truncate('012', 5)).toEqual('012');
        expect(truncate('0123', 5)).toEqual('0123');
        expect(truncate('01234', 5)).toEqual('01234');
        expect(truncate('012345', 5)).toEqual('01...');
        expect(truncate('0123456', 5)).toEqual('01...');
        expect(truncate('01234567', 5)).toEqual('01...');
        expect(truncate('012345678', 5)).toEqual('01...');
        expect(truncate('0123456789', 5)).toEqual('01...');
        expect(truncate('', 4)).toEqual('');
        expect(truncate('0', 4)).toEqual('0');
        expect(truncate('01', 4)).toEqual('01');
        expect(truncate('012', 4)).toEqual('012');
        expect(truncate('0123', 4)).toEqual('0123');
        expect(truncate('01234', 4)).toEqual('0...');
        expect(truncate('012345', 4)).toEqual('0...');
        expect(truncate('0123456', 4)).toEqual('0...');
        expect(truncate('01234567', 4)).toEqual('0...');
        expect(truncate('012345678', 4)).toEqual('0...');
        expect(truncate('0123456789', 4)).toEqual('0...');
        expect(truncate('', 3)).toEqual('');
        expect(truncate('0', 3)).toEqual('0');
        expect(truncate('01', 3)).toEqual('01');
        expect(truncate('012', 3)).toEqual('012');
        expect(truncate('0123', 3)).toEqual('...');
        expect(truncate('01234', 3)).toEqual('...');
        expect(truncate('012345', 3)).toEqual('...');
        expect(truncate('0123456', 3)).toEqual('...');
        expect(truncate('01234567', 3)).toEqual('...');
        expect(truncate('012345678', 3)).toEqual('...');
        expect(truncate('0123456789', 3)).toEqual('...');
        expect(truncate('', 2)).toEqual('');
        expect(truncate('0', 2)).toEqual('0');
        expect(truncate('01', 2)).toEqual('01');
        expect(truncate('012', 2)).toEqual('..');
        expect(truncate('0123', 2)).toEqual('..');
        expect(truncate('01234', 2)).toEqual('..');
        expect(truncate('012345', 2)).toEqual('..');
        expect(truncate('0123456', 2)).toEqual('..');
        expect(truncate('01234567', 2)).toEqual('..');
        expect(truncate('012345678', 2)).toEqual('..');
        expect(truncate('0123456789', 2)).toEqual('..');
        expect(truncate('', 1)).toEqual('');
        expect(truncate('0', 1)).toEqual('0');
        expect(truncate('01', 1)).toEqual('.');
        expect(truncate('012', 1)).toEqual('.');
        expect(truncate('0123', 1)).toEqual('.');
        expect(truncate('01234', 1)).toEqual('.');
        expect(truncate('012345', 1)).toEqual('.');
        expect(truncate('0123456', 1)).toEqual('.');
        expect(truncate('01234567', 1)).toEqual('.');
        expect(truncate('012345678', 1)).toEqual('.');
        expect(truncate('0123456789', 1)).toEqual('.');
        expect(truncate('', 0)).toEqual('');
        expect(truncate('0', 0)).toEqual('');
        expect(truncate('01', 0)).toEqual('');
        expect(truncate('012', 0)).toEqual('');
        expect(truncate('0123', 0)).toEqual('');
        expect(truncate('01234', 0)).toEqual('');
        expect(truncate('012345', 0)).toEqual('');
        expect(truncate('0123456', 0)).toEqual('');
        expect(truncate('01234567', 0)).toEqual('');
        expect(truncate('012345678', 0)).toEqual('');
        expect(truncate('0123456789', 0)).toEqual('');
        expect(truncate('', -1)).toEqual('');
        expect(truncate('0', -1)).toEqual('');
        expect(truncate('01', -1)).toEqual('');
        expect(truncate('012', -1)).toEqual('');
        expect(truncate('0123', -1)).toEqual('');
        expect(truncate('01234', -1)).toEqual('');
        expect(truncate('012345', -1)).toEqual('');
        expect(truncate('0123456', -1)).toEqual('');
        expect(truncate('01234567', -1)).toEqual('');
        expect(truncate('012345678', -1)).toEqual('');
        expect(truncate('0123456789', -1)).toEqual('');
        expect(truncate(NaN, 5)).toEqual('NaN');
        expect(truncate(null, 5)).toEqual('');
        expect(truncate(undefined, 5)).toEqual('');
    });
    test('stringify', () => {
        expect(stringify({ a: 1 })).toEqual('{"a":1}');
        expect(stringify(Required())).toEqual(`"any"`);
        let c0 = {};
        c0.x = c0;
        expect(stringify(c0)).toEqual('"[object Object]"');
        function f0() { }
        class C0 {
        }
        expect(stringify([1, f0, () => true, C0])).toEqual('[1,"f0","() => true","C0"]');
    });
    test('G-basic', () => {
        expect(G$({ v: 11 })).toMatchObject({
            '$': { v$: package_json_1.default.version },
            t: 'number',
            v: 11,
            r: false,
            o: false,
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
