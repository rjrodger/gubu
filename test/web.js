(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).Gubu=e()}}((function(){var e={},t={};Object.defineProperty(t,"__esModule",{value:!0}),t.Gubu=void 0;const n=Symbol.for("gubu$"),r={gubu$:n,v$:"7.1.1"},l=Symbol.for("gubu$nil"),i=/^[A-Z]/,{toString:o}=Object.prototype,s="gubu",u="name",a="nan",c="never",f="number",p="required",h="array",v="function",d="object",g="string",y="boolean",b="undefined",m="any",$="list",x="instance",I="null",k="type",j="closed",O="shape",w="check",N="regexp",S="Object",V="Array",R="Function",A="Value",D="Above",E="All",C="Below",G="Max",T="Min",B="Len",M="One",L="Some",F=" for property ",P='"$PATH"',z='"$VALUE"',q=e=>Object.keys(e),W=(e,t,n)=>Object.defineProperty(e,t,n),_=e=>Array.isArray(e),J=e=>JSON.parse(e),H=(e,t)=>JSON.stringify(e,t);class U{constructor(e,t,n,r){this.match=!1,this.dI=0,this.nI=2,this.cI=-1,this.pI=0,this.sI=-1,this.valType=c,this.isRoot=!1,this.key="",this.type=c,this.stop=!0,this.nextSibling=!0,this.fromDflt=!1,this.ignoreVal=void 0,this.curerr=[],this.err=[],this.parents=[],this.keys=[],this.path=[],this.root=e,this.vals=[e,-1],this.node=t,this.nodes=[t,-1],this.ctx=n||{},this.match=!!r}next(){this.stop=!1,this.fromDflt=!1,this.ignoreVal=void 0,this.isRoot=0===this.pI,this.check=void 0;let e=this.nodes[this.pI];for(;+e;)this.dI--,this.ctx.log&&-1<this.dI&&this.ctx.log("e"+(_(this.parents[this.pI])?"a":"o"),this),this.pI=+e,e=this.nodes[this.pI];e?(this.node=e,this.updateVal(this.vals[this.pI]),this.key=this.keys[this.pI],this.cI=this.pI,this.sI=this.pI+1,Object.isFrozen(this.parents[this.pI])&&(this.parents[this.pI]=Object.assign({},this.parents[this.pI])),this.parent=this.parents[this.pI],this.nextSibling=!0,this.type=this.node.t,this.path[this.dI]=this.key,this.oval=this.val,this.curerr.length=0):this.stop=!0}updateVal(e){this.val=e,this.valType=typeof this.val,f===this.valType&&isNaN(this.val)&&(this.valType=a),this.isRoot&&!this.match&&(this.root=this.val)}}class K extends TypeError{constructor(e,t,n,r){var l;super((t=null==t?"":t+": ")+n.map(e=>e.t).join("\n")),this.gubu=!0,this.name="GubuError",this.code=e,this.prefix=t,this.desc=()=>({name:"GubuError",code:e,err:n,ctx:r}),this.stack=null===(l=this.stack)||void 0===l?void 0:l.replace(/.*\/gubu\/gubu\.[tj]s.*\n/g,""),this.props=n.map(e=>{var t;return{path:e.p,what:e.w,type:null===(t=e.n)||void 0===t?void 0:t.t,value:e.v}})}toJSON(){return Object.assign(Object.assign({},this),{err:this.desc().err,name:this.name,message:this.message})}}const Z={Array:!0,BigInt:!0,Boolean:!0,Function:!0,Number:!0,Object:!0,String:!0,Symbol:!0},Q={string:"",number:0,boolean:!1,object:{},array:[],symbol:Symbol(""),bigint:BigInt(0),null:null,regexp:/.*/};function X(e,t,s){var u,c,p,y;if(Y===e)e=void 0;else if(null!=e&&(null===(u=e.$)||void 0===u?void 0:u.gubu$)){if(n===e.$.gubu$)return e.d=null==t?e.d:t,e;if(!0===e.$.gubu$){let r=Object.assign({},e);return r.$=Object.assign(Object.assign({v$:"7.1.1"},r.$),{gubu$:n}),r.v=null!=r.v&&d===typeof r.v?Object.assign({},r.v):r.v,r.t=r.t||typeof r.v,v===r.t&&Z[r.v.name]&&(r.t=r.v.name.toLowerCase(),r.v=Fe(Q[r.t]),r.f=r.v),r.r=!!r.r,r.p=!!r.p,r.d=null==t?null==r.d?-1:r.d:t,r.b=r.b||[],r.a=r.a||[],r.u=r.u||{},r.m=r.m||s||{},r}}let $=null===e?I:typeof e;$=b===$?m:$;let k=e,j=k,O=l,w=!1,V={},A=[],D=[];if(d===$)j=void 0,_(k)?($=h,1===k.length&&(O=k[0],k=[])):null!=k&&Function!==k.constructor&&Object!==k.constructor&&null!=k.constructor?("[object RegExp]"===o.call(k)?($=N,w=!0):($=x,V.n=k.constructor.name,V.i=k.constructor),j=k):0===q(k).length&&(O=ue());else if(v===$)if(Z[e.name])$=e.name.toLowerCase(),w=!0,k=Fe(Q[$]),j=k,S===e.name&&(O=ue());else if(k.gubu===r||!0===(null===(c=k.$)||void 0===c?void 0:c.gubu)){let e=k.node?k.node():k;$=e.t,k=e.v,j=k,w=e.r,V=Object.assign({},e.u),A=[...e.a],D=[...e.b]}else R===k.constructor.name&&i.test(k.name)&&($=x,w=!0,V.n=null===(y=null===(p=k.prototype)||void 0===p?void 0:p.constructor)||void 0===y?void 0:y.name,V.i=k);else f===$&&isNaN(k)?$=a:g===$&&""===k&&(V.empty=!0);let E=null==k||d!==$&&h!==$?k:Object.assign({},k);return{$:r,t:$,v:E,f:j,n:null!=E&&d===typeof E?q(E).length:0,c:O,r:w,p:!1,d:null==t?-1:t,k:[],e:!0,u:V,a:A,b:D,m:s||{}}}function Y(t,i){const o=null==i?{}:i;o.name=null==o.name?"G"+(""+Math.random()).substring(2,8):""+o.name,o.prefix=null==o.prefix?void 0:o.prefix;let s=o.meta=o.meta||{};s.active=!0===s.active||!1,s.suffix=g==typeof s.suffix?s.suffix:"$$";let u=o.keyexpr=o.keyexpr||{};u.active=!1!==u.active;let a=X(t,0);function f(e,t,n){let r=new U(e,a,t,n);for(;r.next(),!r.stop;){let t=r.node,n=!1,i=!1;if(0<t.b.length)for(let e=0;e<t.b.length;e++){let l=te(t.b[e],r);t=r.node,void 0!==l.done&&(n=l.done),i=i||!!l.fatal}if(!n){let n=!0,i=void 0===r.val;if(c===r.type)r.curerr.push(Be(c,r,1070));else if(d===r.type){let e;if(t.r&&i?(r.ignoreVal=!0,r.curerr.push(Be(p,r,1010))):i||null!==r.val&&d===r.valType&&!_(r.val)?!t.p&&i&&void 0!==t.f?(r.updateVal(t.f),r.fromDflt=!0,e=r.val,n=!1):t.p&&i||(r.updateVal(r.val||(r.fromDflt=!0,{})),e=r.val):(r.curerr.push(Be(k,r,1020)),e=_(r.val)?r.val:{}),n&&(e=null==e&&!1===r.ctx.err?{}:e,null!=e)){r.ctx.log&&r.ctx.log("so",r);let n=!1,i=q(t.v),o=r.nI;if(0<i.length){n=!0,r.pI=o;for(let n=0;n<i.length;n++){let l,o=i[n];if(s.active&&o.endsWith(s.suffix)){if(l={short:""},g===typeof t.v[o]?l.short=t.v[o]:l=Object.assign(Object.assign({},l),t.v[o]),delete t.v[o],n++,i.length<=n)break;if(i[n]!==o.substring(0,o.length-s.suffix.length))throw new Error("Invalid meta key: "+o);o=i[n]}let a=o,c=t.v[o];if(u.active){let e=/^\s*("(\\.|[^"\\])*"|[^\s]+):\s*(.*?)\s*$/.exec(o);e&&(a=e[1],c=ee({src:e[3],val:c}),delete t.v[o])}let f=X(c,1+r.dI,l);t.v[a]=f,t.k.includes(a)||t.k.push(a),r.nodes[r.nI]=f,r.vals[r.nI]=e[a],r.parents[r.nI]=e,r.keys[r.nI]=a,r.nI++}}let a=q(e).filter(e=>void 0===t.v[e]);if(0<a.length)if(l===t.c)r.ignoreVal=!0,r.curerr.push(Be(j,r,1100,void 0,{k:a}));else{n=!0,r.pI=o;for(let n of a){let l=t.c=X(t.c,1+r.dI);r.nodes[r.nI]=l,r.vals[r.nI]=e[n],r.parents[r.nI]=e,r.keys[r.nI]=n,r.nI++}}n?(r.dI++,r.nodes[r.nI]=r.sI,r.parents[r.nI]=e,r.nextSibling=!1,r.nI++):r.ctx.log&&r.ctx.log("eo",r)}}else if(h===r.type)if(t.r&&i)r.ignoreVal=!0,r.curerr.push(Be(p,r,1030));else if(i||_(r.val)){if(!t.p&&i&&void 0!==t.f)r.updateVal(t.f),r.fromDflt=!0;else if(!t.p||null!=r.val){r.updateVal(r.val||(r.fromDflt=!0,[]));let n=l!==t.c,i=0<r.val.length,o=q(t.v).filter(e=>!isNaN(+e)),s=0<o.length;if(r.ctx.log&&r.ctx.log("sa",r),i||s){r.pI=r.nI;let e=0;if(s)if(o.length<r.val.length&&!n)r.ignoreVal=!0,r.curerr.push(Be(j,r,1090,void 0,{k:o.length}));else for(;e<o.length;e++){let n=t.v[e]=X(t.v[e],1+r.dI);r.nodes[r.nI]=n,r.vals[r.nI]=r.val[e],r.parents[r.nI]=r.val,r.keys[r.nI]=""+e,r.nI++}if(n&&i){let n=t.c=X(t.c,1+r.dI);for(;e<r.val.length;e++)r.nodes[r.nI]=n,r.vals[r.nI]=r.val[e],r.parents[r.nI]=r.val,r.keys[r.nI]=""+e,r.nI++}r.ignoreVal||(r.dI++,r.nodes[r.nI]=r.sI,r.parents[r.nI]=r.val,r.nextSibling=!1,r.nI++)}else r.ctx.log&&n&&null==e&&r.ctx.log("kv",Object.assign(Object.assign({},r),{key:0,val:t.c})),r.ctx.log&&r.ctx.log("ea",r)}}else r.curerr.push(Be(k,r,1040));else if(N===r.type)i&&!t.r?r.ignoreVal=!0:g!==r.valType?(r.ignoreVal=!0,r.curerr.push(Be(k,r,1045))):r.val.match(t.v)||(r.ignoreVal=!0,r.curerr.push(Be(N,r,1045)));else if(m===r.type||$===r.type||void 0===r.val||r.type===r.valType||x===r.type&&t.u.i&&r.val instanceof t.u.i||I===r.type&&null===r.val)if(void 0===r.val){let e=r.path[r.dI];!t.r||b===r.type&&r.parent.hasOwnProperty(e)?void 0!==t.f&&!t.p||b===r.type?(r.updateVal(t.f),r.fromDflt=!0):m===r.type&&(r.ignoreVal=void 0===r.ignoreVal||r.ignoreVal):(r.ignoreVal=!0,r.curerr.push(Be(p,r,1060))),r.ctx.log&&r.ctx.log("kv",r)}else g!==r.type||""!==r.val||t.u.empty||r.curerr.push(Be(p,r,1080)),r.ctx.log&&r.ctx.log("kv",r);else r.curerr.push(Be(k,r,1050))}if(0<t.a.length)for(let e=0;e<t.a.length;e++){let l=te(t.a[e],r);t=r.node,void 0!==l.done&&(n=l.done),i=i||!!l.fatal}let o=r.node.p?!1!==r.ignoreVal:!!r.ignoreVal;!r.match&&null!=r.parent&&!n&&!o&&(r.parent[r.key]=r.val),r.nextSibling&&(r.pI=r.sI),(r.node.e||i)&&r.err.push(...r.curerr)}if(0<r.err.length)if(_(r.ctx.err))r.ctx.err.push(...r.err);else if(!r.match&&!1!==r.ctx.err)throw new K(O,o.prefix,r.err,r.ctx);return r.match?0===r.err.length:r.root}function v(e,t){return f(e,t,!1)}v.valid=function(e,t){let n=t||{};return n.err=n.err||[],f(e,n,!1),0===n.err.length},v.match=(e,t)=>f(e,t=t||{},!0),v.error=(e,t)=>{let n=t||{};return n.err=n.err||[],f(e,n,!1),n.err},v.spec=()=>(v(void 0,{err:!1}),J(Le(a,(e,t)=>n===t||t,!1,!0))),v.node=()=>(v.spec(),a),v.stringify=e=>{let t=null==e?a:e.node&&e.node();return t=null==t||!t.$||n!==t.$.gubu$&&!0!==t.$.gubu$?t:t.v,qe.stringify(t)};let y="";return v.toString=()=>(y=le(""===y?Le(null==a||!a.$||n!==a.$.gubu$&&!0!==a.$.gubu$?a:a.v):y),`[Gubu ${o.name} ${y}]`),e.inspect&&e.inspect.custom&&(v[e.inspect.custom]=v.toString),v.gubu=r,v.spec(),v}function ee(e){let t=!1;if(null==e.tokens){t=!0,e.tokens=[];let n=/\s*,?\s*([)(\.]|"(\\.|[^"\\])*"|\/(\\.|[^\/\\])*\/[a-z]?|[^)(,\s]+)\s*/g,r=null;for(;r=n.exec(e.src);)e.tokens.push(r[1])}e.i=e.i||0;let n=e.tokens[e.i],r=ze[n];if(")"===e.tokens[e.i])return e.i++,e.val;e.i++;let l={Number:Number,String:String,Boolean:Boolean};if(null==r)try{return l[n]||(b===n?void 0:"NaN"===n?NaN:n.match(/^\/.+\/$/)?new RegExp(n.substring(1,n.length-1)):J(n))}catch(s){throw new SyntaxError(`Gubu: unexpected token ${n} in builder expression ${e.src}`)}"("===e.tokens[e.i]&&e.i++;let i=[],o=null;for(;null!=(o=e.tokens[e.i])&&")"!==o;){let t=ee(e);i.push(t)}return e.i++,e.val=r.call(e.val,...i),"."===e.tokens[e.i]?(e.i++,ee(e)):t&&e.i<e.tokens.length?ee(e):e.val}function te(e,t){var n;let r,l={},i=!1;try{i=!(void 0!==t.val||!(null===(n=e.gubu$)||void 0===n?void 0:n.Check))||(t.check=e,e(t.val,l,t))}catch(s){r=s}let o=_(l.err)?0<l.err.length:null!=l.err;if(!i||o){if(void 0===t.val&&(t.node.p||!t.node.r)&&!0!==l.done)return delete l.err,l;let n=l.why||w,i=ne(t);if(g===typeof l.err)t.curerr.push(Te(t,l.err));else if(d===typeof l.err)t.curerr.push(...[l.err].flat().filter(e=>null!=e).map(e=>(e.p=null==e.p?i:e.p,e.m=null==e.m?2010:e.m,e)));else{let l=e.name;null!=l&&""!=l||(l=le(e.toString().replace(/[ \t\r\n]+/g," "))),t.curerr.push(Be(n,t,1045,void 0,{thrown:r},l))}l.done=null==l.done||l.done}return l.hasOwnProperty("uval")?(t.updateVal(l.uval),t.ignoreVal=!1):void 0===l.val||Number.isNaN(l.val)||(t.updateVal(l.val),t.ignoreVal=!1),void 0!==l.node&&(t.node=l.node),void 0!==l.type&&(t.type=l.type),l}function ne(e){return e.path.slice(1,e.dI+1).filter(e=>null!=e).join(".")}function re(e){return f===typeof e?e:f===typeof(null==e?void 0:e.length)?e.length:null!=e&&d===typeof e?q(e).length:NaN}function le(e,t){let n=String(e),r=null==t||isNaN(t)?30:t<0?0:~~t,l=null==e?0:n.length,i=null==e?"":n.substring(0,l);return i=r<l?i.substring(0,r-3)+"...":i,i.substring(0,r)}const ie=function(e){let t=Ge(this,e);return t.r=!0,t.p=!1,void 0===e&&1===arguments.length&&(t.t=b,t.v=void 0),t},oe=function(e){let t=Ge(this,e);return t.c=ue(),t},se=function(e){let t=Ge(this,e);return t.r=!1,void 0===e&&1===arguments.length&&(t.t=b,t.v=void 0),t},ue=function(e){let t=Ge(this,e);return t.t=m,void 0!==e&&(t.v=e,t.f=e),t},ae=function(e,t){let n=Ge(this,t);return n.z=e,n},ce=function(e){let t=Ge(this,e);return t.r=!1,t.p=!0,t},fe=function(e){let t=Ge(this,e);return t.r=!1,t.p=!0,t.e=!1,t.a.push((function(e,t,n){return 0<n.curerr.length&&(t.uval=void 0,t.done=!1),!0})),t},pe=function(e){let t=Ge(this);return t.t=v,t.v=e,t.f=e,t},he=function(e,t){let n=Ge(this,void 0===t?e:t);return n.r=!1,n.f=e,v===typeof e&&Z[e.name]&&(n.t=e.name.toLowerCase(),n.f=Fe(Q[n.t])),n.p=!1,n},ve=function(e){let t=Ge(this,e);return t.u.empty=!0,t},de=function(e){let t=Ge(this,e);return t.t=c,t},ge=function(e,t){let n=Ge(this),r=f===typeof e;n.t=g,r&&null==t&&(n=X([]));let l=null;return v===typeof e&&(l=e,n=ue()),n.b.push((function(n,i,o){if(l)i.val=l(o.path,o);else if(r){let n=e;i.val=o.path.slice(o.path.length-1-(0<=n?n:0),o.path.length-1+(0<=n?0:1)),g===typeof t&&(i.val=i.val.join(t))}else null==e&&(i.val=o.path[o.path.length-2]);return!0})),n},ye=function(...e){let t=Ge();t.t=$,t.r=!0;let n=e.map(e=>qe(e));return t.u.list=e,t.b.push((function(t,r,l){let i=!0;for(let e of n){let n=Object.assign(Object.assign({},l.ctx),{err:[]});e(t,n),0<n.err.length&&(i=!1)}return i||(r.why=E,r.err=[Te(l,A+" "+z+F+P+" does not satisfy all of: "+e.map(e=>Le(e,null,!0)).join(", "))]),i})),t},be=function(...e){let t=Ge();t.t=$,t.r=!0;let n=e.map(e=>qe(e));return t.u.list=e,t.b.push((function(t,r,l){let i=!1;for(let e of n){let n=Object.assign(Object.assign({},l.ctx),{err:[]}),o=e.match(t,n);o&&(r.val=e(t,n)),i||(i=o)}return i||(r.why=L,r.err=[Te(l,A+" "+z+F+P+" does not satisfy any of: "+e.map(e=>Le(e,null,!0)).join(", "))]),i})),t},me=function(...e){let t=Ge();t.t=$,t.r=!0;let n=e.map(e=>qe(e));return t.u.list=e,t.b.push((function(t,r,l){let i=0;for(let e of n){let n=Object.assign(Object.assign({},l.ctx),{err:[]});if(e.match(t,n)){i++,r.val=e(t,n);break}}return 1!==i&&(r.why=M,r.err=[Te(l,A+" "+z+F+P+" does not satisfy one of: "+e.map(e=>Le(e,null,!0)).join(", "))]),!0})),t},$e=function(...e){let t=Ge();return t.b.push((function(t,n,r){for(let l=0;l<e.length;l++)if(t===e[l])return!0;if(r.node.hasOwnProperty("f")&&void 0===t){const t=r.node.f;for(let n=0;n<e.length;n++)if(t===e[n])return!0}return n.err=Te(r,A+" "+z+F+P+" must be exactly one of: "+r.node.s+"."),n.done=!0,!1})),t.s=e.map(e=>Le(e,null,!0)).join(", "),t},xe=function(e,t){let n=Ge(this,t);return n.b.push(e),n},Ie=function(e,t){let n=Ge(this,t);return n.a.push(e),n},ke=function(e,t){let n=Ge(this,t);if(v===typeof e){let t=e;t.gubu$=t.gubu$||{},t.gubu$.Check=!0,n.b.push(e),n.s=(null==n.s?"":n.s+";")+Le(e,null,!0),n.r=!0}else if(d===typeof e){if(Object.prototype.toString.call(e).includes("RegExp")){let t=t=>null!=t&&!Number.isNaN(t)&&!!String(t).match(e);W(t,u,{value:String(e)}),W(t,"gubu$",{value:{Check:!0}}),n.b.push(t),n.s=Le(e),n.r=!0}}else g===typeof e&&(n.t=e,n.r=!0);return n},je=function(e){let t=Ge(this,e);return h===t.t&&l!==t.c&&0===t.n?(t.v=[t.c],t.c=l):t.c=l,t},Oe=function(e,t){let n=Ge(this,t),r=g===typeof e?e:(d===typeof e&&e||{}).name;return null!=r&&""!=r&&n.b.push((function(e,t,n){return(n.ctx.ref=n.ctx.ref||{})[r]=n.node,!0})),n},we=function(e,t){let n=Ge(this,t),r=d===typeof e&&e||{},l=g===typeof e?e:r.name,i=!!r.fill;return null!=l&&""!=l&&n.b.push((function(e,t,n){if(void 0!==e||i){let e=n.ctx.ref=n.ctx.ref||{};if(void 0!==e[l]){let n=Object.assign({},e[l]);n.t=n.t||c,t.node=n,t.type=n.t}}return!0})),n},Ne=function(e,t){let n=Ge(this,t),r=d===typeof e&&e||{},l=g===typeof e?e:r.name,i=y===typeof r.keep?r.keep:void 0,o=_(r.claim)?r.claim:[];if(null!=l&&""!=l){let e=(e,t,n)=>{if(void 0===e&&0<o.length){n.ctx.Rename=n.ctx.Rename||{},n.ctx.Rename.fromDflt=n.ctx.Rename.fromDflt||{};for(let e of o){let r=n.ctx.Rename.fromDflt[e]||{};if(void 0!==n.parent[e]&&!r.yes){t.val=n.parent[e],n.match||(n.parent[l]=t.val),t.node=r.node;for(let e=0;e<n.err.length;e++)n.err[e].k===r.key&&(n.err.splice(e,1),e--);if(i){let t=n.cI+1;n.nodes.splice(t,0,X(r.dval)),n.vals.splice(t,0,void 0),n.parents.splice(t,0,n.parent),n.keys.splice(t,0,e),n.nI++,n.pI++}else delete n.parent[e];break}}void 0===t.val&&(t.val=n.node.v)}return!0};W(e,u,{value:"Rename:"+l}),n.b.push(e);let t=(e,t,n)=>(n.parent[l]=e,n.match||i||n.key===l||_(n.parent)&&!1!==i||(delete n.parent[n.key],t.done=!0),n.ctx.Rename=n.ctx.Rename||{},n.ctx.Rename.fromDflt=n.ctx.Rename.fromDflt||{},n.ctx.Rename.fromDflt[l]={yes:n.fromDflt,key:n.key,dval:n.node.v,node:n.node},!0);W(t,u,{value:"Rename:"+l}),n.a.push(t)}return n},Se=function(e,t){let n=Ge(this,t);return n.b.push((function(t,n,r){let l=re(t);if(e<=l)return!0;r.checkargs={min:1};let i=f===typeof t?"":"length ";return n.err=Te(r,A+" "+z+F+P+` must be a minimum ${i}of ${e} (was ${l}).`),!1})),n.s=T+"("+e+(null==t?"":","+Le(t))+")",n},Ve=function(e,t){let n=Ge(this,t);return n.b.push((function(t,n,r){let l=re(t);if(l<=e)return!0;let i=f===typeof t?"":"length ";return n.err=Te(r,A+" "+z+F+P+` must be a maximum ${i}of ${e} (was ${l}).`),!1})),n.s=G+"("+e+(null==t?"":","+Le(t))+")",n},Re=function(e,t){let n=Ge(this,t);return n.b.push((function(t,n,r){let l=re(t);if(e<l)return!0;let i=f===typeof t?"be":"have length";return n.err=Te(r,A+" "+z+F+P+` must ${i} above ${e} (was ${l}).`),!1})),n.s=D+"("+e+(null==t?"":","+Le(t))+")",n},Ae=function(e,t){let n=Ge(this,t);return n.b.push((function(t,n,r){let l=re(t);if(l<e)return!0;let i=f===typeof t?"be":"have length";return n.err=Te(r,A+" "+z+F+P+` must ${i} below ${e} (was ${l}).`),!1})),n.s=C+"("+e+(null==t?"":","+Le(t))+")",n},De=function(e,t){let n=Ge(this,t||ue());return n.b.push((function(t,n,r){let l=re(t);if(e===l)return!0;let i=f===typeof t?"":" in length";return n.err=Te(r,A+" "+z+F+P+` must be exactly ${e}${i} (was ${l}).`),!1})),n.s=B+"("+e+(null==t?"":","+Le(t))+")",n},Ee=function(e,t){let n=Ge(this,t||{});return n.c=X(e),n},Ce=function(e,t){let n=Ge(this,t||[]);return n.t="array",n.c=X(e),n.m=n.m||{},n.m.rest=!0,n};function Ge(e,t){let n=X(null==e||e.window===e||e.global===e?t:e);return Object.assign(n,{Above:Re,After:Ie,Any:ue,Before:xe,Below:Ae,Check:ke,Child:Ee,Closed:je,Default:he,Define:Oe,Empty:ve,Exact:$e,Fault:ae,Ignore:fe,Len:De,Max:Ve,Min:Se,Never:de,Open:oe,Refer:we,Rename:Ne,Required:ie,Rest:Ce,Skip:ce})}function Te(e,t,n,r){return Be(n||w,e,4e3,t,r)}function Be(e,t,n,r,l,i){var o;let s={k:t.key,n:t.node,v:t.val,p:ne(t),w:e,c:(null===(o=t.check)||void 0===o?void 0:o.name)||"none",a:t.checkargs||{},m:n,t:"",u:l||{}},u=le((void 0===t.val?b:Le(t.val)).replace(/"/g,""));if(null==(r=r||t.node.z)||""===r){let n=u.startsWith("[")?h:u.startsWith("{")?d:null==t.val||f===typeof t.val&&isNaN(t.val)?"value":typeof t.val,r=u.startsWith("[")||_(t.parents[t.pI])?"index":"property",o="is",a=null==l?void 0:l.k;a=_(a)?(r=1<a.length?(o="are","properties"):r,a.join(", ")):a,s.t="Validation failed for "+(0<s.p.length?`${r} "${s.p}" with `:"")+`${n} "${u}" because `+(k===e?x===t.node.t?`the ${n} is not an instance of ${t.node.u.n}`:`the ${n} is not of type ${N===t.node.t?g:t.node.t}`:p===e?""===t.val?"an empty string is not allowed":`the ${n} is required`:"closed"===e?`the ${r} "${a}" ${o} not allowed`:N===e?"the string did not match "+t.node.v:c===e?"no value is allowed":`check "${null==i?e:i}" failed`)+(s.u.thrown?" (threw: "+s.u.thrown.message+")":".")}else s.t=r.replace(/\$VALUE/g,u).replace(/\$PATH/g,s.p);return s}function Me(e){return null!=e.s&&""!==e.s?e.s:e.r||void 0===e.v?e.t:"function"==typeof e.v.constructor?e.v:e.v.toString()}function Le(e,t,r,l){let i;l||!e||!e.$||n!==e.$.gubu$&&!0!==e.$.gubu$||(e=Me(e));try{i=H(e,(e,r)=>{var i,s;if(t&&(r=t(e,r)),null!=r&&d===typeof r&&r.constructor&&S!==r.constructor.name&&V!==r.constructor.name)r="[object RegExp]"===o.call(r)||v===typeof r.toString?r.toString():r.constructor.name;else if(v===typeof r)r=v===typeof Y[r.name]&&isNaN(+e)?void 0:null!=r.name&&""!==r.name?r.name:le(r.toString().replace(/[ \t\r\n]+/g," "));else if("bigint"==typeof r)r=String(r.toString());else{if(Number.isNaN(r))return"NaN";!0===l||!0!==(null===(i=null==r?void 0:r.$)||void 0===i?void 0:i.gubu$)&&n!==(null===(s=null==r?void 0:r.$)||void 0===s?void 0:s.gubu$)||(r=Me(r))}return r}),i=String(i)}catch(s){i=H(String(e))}return!0===r&&(i=i.replace(/^"/,"").replace(/"$/,"")),i}function Fe(e){return null==e||d!==typeof e?e:J(H(e))}const Pe=e=>X(Object.assign(Object.assign({},e),{$:{gubu$:!0}})),ze={Above:Re,After:Ie,All:ye,Any:ue,Before:xe,Below:Ae,Check:ke,Child:Ee,Closed:je,Default:he,Define:Oe,Empty:ve,Exact:$e,Fault:ae,Func:pe,Ignore:fe,Key:ge,Len:De,Max:Ve,Min:Se,Never:de,One:me,Open:oe,Optional:se,Refer:we,Rename:Ne,Required:ie,Skip:ce,Some:be,Rest:Ce};if(b!==typeof window)for(let Je in ze)W(ze[Je],u,{value:Je});Object.assign(Y,Object.assign(Object.assign(Object.assign({Gubu:Y},ze),Object.entries(ze).reduce((e,t)=>(e["G"+t[0]]=t[1],e),{})),{isShape:e=>e&&r===e.gubu,G$:Pe,buildize:Ge,makeErr:Te,stringify:Le,truncate:le,nodize:X,expr:ee,MakeArgu:We})),W(Y,u,{value:s});const qe=Y;t.Gubu=qe;function We(e){return function(t,n,r){let l=!1;g===typeof t&&(l=!0,r=n,n=t);const i=qe(r=r||n,{prefix:e+(n=g===typeof n?" ("+n+")":"")}),o=i.node(),s=o.k;let u=t,a={},c=0,f=0;for(;c<s.length;c++){let e=o.v[s[c]];e.p&&(e=o.v[s[c]]=(t=>Ie((function(e,n,r){if(0<r.curerr.length){f++;for(let e=s.length-1;e>t;e--)o.v[s[e]].m.rest?a[s[e]].splice(o.v[s[e]].m.rest_pos+t-e,0,a[s[e-1]]):(r.vals[r.pI+e-t]=r.vals[r.pI+e-t-1],a[s[e]]=a[s[e-1]]);n.uval=void 0,n.done=!1}return!0}),e))(c),e.e=!1),c!==s.length-1||o.v[s[c]].m.rest||(o.v[s[c]]=Ie((function(e,t,n){return!(s.length-f<u.length&&(0===n.curerr.length&&(t.err=`Too many arguments for type signature (was ${u.length}, expected ${s.length-f})`),t.fatal=!0,1))}),o.v[s[c]]))}function p(e){for(let t=0;t<s.length;t++){let n=o.v[s[t]];n.m.rest?(a[s[t]]=[...e].slice(t),n.m.rest_pos=a[s[t]].length):a[s[t]]=e[t]}return a}return l?function(e){return u=e,a={},c=0,f=0,i(p(e))}:i(p(t))}}const{Gubu:_e}=t;return _e}));
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
module.exports={
  "name": "gubu",
  "version": "7.1.1",
  "description": "An object shape validation utility.",
  "main": "gubu.js",
  "browser": "gubu.min.js",
  "type": "commonjs",
  "types": "gubu.d.ts",
  "homepage": "https://github.com/rjrodger/gubu",
  "keywords": [
    "gubu",
    "schema",
    "validation"
  ],
  "author": "Richard Rodger (http://richardrodger.com)",
  "repository": {
    "type": "git",
    "url": "git://github.com/rjrodger/gubu.git"
  },
  "scripts": {
    "test": "npm run version && jest --coverage",
    "test-pure": "npm run version && jest --coverage --config jest.config.pure.js",
    "test-some": "npm run version && jest -t",
    "test-some-pure": "npm run version && jest --config jest.config.pure.js -t",
    "test-watch": "npm run version && jest --coverage --watchAll",
    "test-web": "npm run build && npm run build-web && browserify -i util -o test/web.js -e test/entry.js -im && open test/web.html",
    "watch": "npm run version && tsc -w -d",
    "build": "npm run version && tsc -d",
    "build-web": "cp gubu.js gubu.min.js && browserify -i util -o gubu.min.js -e gubu.web.js -s Gubu -im -p tinyify",
    "version": "node -r fs -e \"v=require('./package.json').version;s=fs.readFileSync('./gubu.ts').toString();if(!s.includes('VERSION = \\''+v+'\\'')){s=s.replace(/VERSION = '.*?'/,'VERSION = \\''+v+'\\'');fs.writeFileSync('./gubu.ts',s)}\"",
    "clean": "rm -rf node_modules yarn.lock package-lock.json",
    "reset": "npm run clean && npm i && npm run build && npm test",
    "repo-tag": "REPO_VERSION=`node -e \"console.log(require('./package').version)\"` && echo TAG: v$REPO_VERSION && git commit -a -m v$REPO_VERSION && git push && git tag v$REPO_VERSION && git push --tags;",
    "repo-publish": "npm run clean && npm i && npm run repo-publish-quick",
    "repo-publish-quick": "npm run build && npm run test && npm run build-web && npm run test-web && npm run repo-tag && npm publish --access public --registry https://registry.npmjs.org "
  },
  "license": "MIT",
  "engines": {
    "node": ">=14"
  },
  "files": [
    "*.js",
    "*.ts",
    "*.map",
    "LICENSE",
    "README.md"
  ],
  "devDependencies": {
    "@types/jest": "^29.5.12",
    "browserify": "^17.0.0",
    "es-jest": "^2.1.0",
    "esbuild": "^0.21.5",
    "esbuild-jest": "^0.5.0",
    "jest": "^29.7.0",
    "tinyify": "^4.0.0",
    "ts-jest": "^29.1.4",
    "typescript": "^5.4.5"
  }
}

},{}],3:[function(require,module,exports){
"use strict";
/* Copyright (c) 2021-2023 Richard Rodger and other contributors, MIT License */
Object.defineProperty(exports, "__esModule", { value: true });
// Handle web (Gubu) versus node ({Gubu}) export.
let GubuModule = require('../gubu');
if (GubuModule.Gubu) {
    GubuModule = GubuModule.Gubu;
}
const Gubu = GubuModule;
const { MakeArgu, Skip, Rest, Any, Empty, One, Default, } = Gubu;
describe('argu', () => {
    test('basic', () => {
        let Argu = MakeArgu('QAZ');
        function foo(...args) {
            let argmap = Argu(args, 'foo', {
                a: 1,
                b: 'B'
            });
            return argmap;
        }
        expect(foo(2, 'X')).toEqual({ a: 2, b: 'X' });
        expect(() => foo(2, 3)).toThrow('QAZ (foo): Validation failed for property "b" with number "3" because the number is not of type string.');
    });
    test('skip-count', () => {
        let Argu = MakeArgu('SKIP');
        let a0 = Argu('foo', {
            a: Skip(Number),
            b: String
        });
        function foo(...args) {
            let argmap = a0(args);
            return argmap.a + argmap.b;
        }
        expect(foo(2, 'X')).toEqual('2X');
        expect(foo('X')).toEqual('undefinedX');
        expect(() => foo())
            .toThrow('SKIP (foo): Validation failed for property "b" with value ' +
            '"undefined" because the value is required.');
        expect(() => foo('X', 'Y'))
            .toThrow('SKIP (foo): ' +
            'Too many arguments for type signature (was 2, expected 1)');
        expect(() => foo(3, 4))
            .toThrow('SKIP (foo): Validation failed for property "b" ' +
            'with number "4" because the number is not of type string.');
        expect(() => foo(3))
            .toThrow('SKIP (foo): Validation failed for property "b" ' +
            'with value "undefined" because the value is required.');
        function bar(a, b, c, d) {
            let argmap = Argu(arguments, 'bar', {
                a: One(Empty(String), Object),
                b: Skip(Object),
                c: Skip(Function),
                d: Skip(Object),
            });
            return argmap;
        }
        expect(bar('s')).toEqual({ a: 's' });
        expect(() => bar('s', 't'))
            .toThrow('SKIP (bar): Validation failed for property \"d\" ' +
            'with string \"t\" because the string is not of type object.');
    });
    test('skip-req-rest', () => {
        let Argu = MakeArgu('seneca');
        function bar(...args) {
            let argmap = Argu(args, 'bar', {
                a: Skip(String),
                b: Skip(Object),
                c: Function,
                d: Rest(Any()),
            });
            return argmap;
        }
        const f0 = () => { };
        expect(bar('a', { x: 1 }, f0)).toEqual({ a: 'a', b: { x: 1 }, c: f0, d: [] });
        expect(bar({ x: 1 }, f0)).toEqual({ a: undefined, b: { x: 1 }, c: f0, d: [] });
        expect(bar('b', f0)).toEqual({ a: 'b', b: undefined, c: f0, d: [] });
        expect(bar(f0)).toEqual({ a: undefined, b: undefined, c: f0, d: [] });
        expect(bar('a', { x: 1 }, f0, 11))
            .toEqual({ a: 'a', b: { x: 1 }, c: f0, d: [11] });
        expect(bar({ x: 1 }, f0, 12))
            .toEqual({ a: undefined, b: { x: 1 }, c: f0, d: [12] });
        expect(bar('b', f0, 13))
            .toEqual({ a: 'b', b: undefined, c: f0, d: [13] });
        expect(bar(f0, 14))
            .toEqual({ a: undefined, b: undefined, c: f0, d: [14] });
        expect(bar('a', { x: 1 }, f0, 11, 12))
            .toEqual({ a: 'a', b: { x: 1 }, c: f0, d: [11, 12] });
        expect(bar({ x: 1 }, f0, 21, 22))
            .toEqual({ a: undefined, b: { x: 1 }, c: f0, d: [21, 22] });
        expect(bar('b', f0, 31, 32))
            .toEqual({ a: 'b', b: undefined, c: f0, d: [31, 32] });
        expect(bar(f0, 41, 42))
            .toEqual({ a: undefined, b: undefined, c: f0, d: [41, 42] });
    });
    test('plugin-args', () => {
        const Argu = MakeArgu('plugin');
        const argu = Argu('args', {
            plugin: One(Object, Function, String),
            options: Default(undefined, One(Object, String)),
            callback: Skip(Function),
        });
        expect(argu([{ x: 11 }]))
            .toEqual({ plugin: { x: 11 }, options: undefined, callback: undefined });
        expect(argu([{ x: 11 }, { y: 2 }]))
            .toEqual({ plugin: { x: 11 }, options: { y: 2 }, callback: undefined });
        const f0 = () => { };
        expect(argu([{ x: 11 }, { y: 2 }, f0]))
            .toEqual({ plugin: { x: 11 }, options: { y: 2 }, callback: f0 });
        expect(argu([f0]))
            .toEqual({ plugin: f0, options: undefined, callback: undefined });
        expect(argu([f0, { x: 1 }]))
            .toEqual({ plugin: f0, options: { x: 1 }, callback: undefined });
        const f1 = () => { };
        expect(argu([f0, { x: 1 }, f1]))
            .toEqual({ plugin: f0, options: { x: 1 }, callback: f1 });
        expect(argu([{ x: 1 }, { y: 2 }, f1]))
            .toEqual({ plugin: { x: 1 }, options: { y: 2 }, callback: f1 });
        expect(() => argu([f0, f1])).toThrow('plugin (args): Value "f1" for property "options"' +
            ' does not satisfy one of: Object, String');
        expect(argu([Object.freeze({ x: 11 })]))
            .toEqual({ plugin: { x: 11 }, options: undefined, callback: undefined });
        expect(argu([f0, Object.freeze({ x: 11 })]))
            .toEqual({ plugin: f0, options: { x: 11 }, callback: undefined });
    });
});

},{"../gubu":1}],4:[function(require,module,exports){
"use strict";
/* Copyright (c) 2021-2023 Richard Rodger and other contributors, MIT License */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bar = exports.Foo = void 0;
// Handle web (Gubu) versus node ({Gubu}) export.
let GubuModule = require('../gubu');
if (GubuModule.Gubu) {
    GubuModule = GubuModule.Gubu;
}
const Gubu = GubuModule;
const buildize = Gubu.buildize;
const makeErr = Gubu.makeErr;
const { Above, After, All, Any, Before, Below, Check, Child, Closed, Default, Define, Empty, Exact, Func, Key, Len, Max, Min, Never, One, Open, Optional, Refer, Rename, Required, Skip, Some,
// Value,
 } = Gubu;
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
describe('builder', () => {
    test('builder-required', () => {
        let g0 = Gubu({ a: Required({ x: 1 }) });
        expect(g0({ a: { x: 1 } })).toEqual({ a: { x: 1 } });
        expect(() => g0({})).toThrow('Validation failed for property "a" with value "undefined" because the value is required.');
        expect(() => g0()).toThrow('Validation failed for property "a" with value "undefined" because the value is required.');
        let g1 = Gubu({ a: Required([1]) });
        expect(g1({ a: [11] })).toEqual({ a: [11] });
        expect(() => g1({})).toThrow('Validation failed for property "a" with value "undefined" because the value is required.');
        expect(() => g1()).toThrow('Validation failed for property "a" with value "undefined" because the value is required.');
        let g2 = Gubu(Required(1));
        expect(g2(1)).toEqual(1);
        expect(g2(2)).toEqual(2);
        // TODO: note this in docs - deep child requires must be satisfied unless Skip
        let g3 = Gubu({ a: { b: String } });
        expect(() => g3()).toThrow(/"a.b".*required/);
        expect(() => g3({})).toThrow(/"a.b".*required/);
        expect(() => g3({ a: {} })).toThrow(/"a.b".*required/);
        let g4 = Gubu({ a: Skip({ b: String }) });
        expect(g4()).toEqual({});
        expect(g4({})).toEqual({});
        expect(g4({ a: undefined })).toEqual({});
        expect(() => g4({ a: {} })).toThrow(/"a.b".*required/);
        let g5 = Gubu(Required({ x: 1 }));
        expect(g5({ x: 2 })).toEqual({ x: 2 });
        expect(() => g5({ x: 2, y: 3 })).toThrow('not allowed');
        expect(() => g5()).toThrow('required');
        expect(() => g5({ y: 3 })).toThrow('not allowed');
        let g6 = Gubu(Closed(Required({ x: 1 })));
        expect(g6({ x: 2 })).toEqual({ x: 2 });
        expect(() => g6({ x: 2, y: 3 })).toThrow('Validation failed for object "{x:2,y:3}" because the property "y" is not allowed.');
        expect(() => g6()).toThrow('required');
        let g7 = Gubu(Closed({ x: 1 }).Required());
        expect(g7({ x: 2 })).toEqual({ x: 2 });
        expect(() => g7({ x: 2, y: 3 })).toThrow('Validation failed for object "{x:2,y:3}" because the property "y" is not allowed.');
        expect(() => g7()).toThrow('required');
        let g8 = Gubu({ a: Required(1) });
        expect(g8({ a: 2 })).toMatchObject({ a: 2 });
        expect(() => g8({ a: 'x' })).toThrow(/number/);
    });
    test('builder-optional', () => {
        expect(Gubu(Optional(1))()).toEqual(1);
        expect(Gubu(Optional(1))(2)).toEqual(2);
        expect(() => Gubu(Optional(1))(true)).toThrow('type');
        expect(Gubu({ a: Optional(1) })()).toEqual({ a: 1 });
        expect(Gubu({ a: Optional(1) })({})).toEqual({ a: 1 });
        expect(Gubu({ a: Optional(1) })({ a: undefined })).toEqual({ a: 1 });
        expect(Gubu({ a: Optional(1) })({ a: 2 })).toEqual({ a: 2 });
        expect(() => Gubu({ a: Optional(1) })({ a: true })).toThrow('type');
        expect(Gubu([Optional(1)])()).toEqual([]);
        expect(Gubu([Optional(1)])([])).toEqual([]);
        expect(Gubu([Optional(1)])([2])).toEqual([2]);
        expect(Gubu([Optional(1)])([2, 3])).toEqual([2, 3]);
        expect(() => Gubu([Optional(1)])([true])).toThrow('type');
        expect(Gubu([null, Optional(1)])()).toEqual([null, 1]);
        expect(Gubu(Closed([Optional(1)]))()).toEqual([1]);
        expect(Gubu(Optional(String))()).toEqual('');
        expect(Gubu(Optional(Number))()).toEqual(0);
        expect(Gubu(Optional(Boolean))()).toEqual(false);
        expect(Gubu(Optional(Object))()).toEqual({});
        expect(Gubu(Optional(Array))()).toEqual([]);
        expect(Gubu(Optional(Required('a')))()).toEqual('a');
        expect(Gubu(Optional(Required(1)))()).toEqual(1);
        expect(Gubu(Optional(Required(true)))()).toEqual(true);
        expect(Gubu(Optional(Required({})))()).toEqual({});
        expect(Gubu(Optional(Required([])))()).toEqual([]);
        expect(Gubu(Optional())()).toEqual(undefined);
        expect(Gubu(Optional())(undefined)).toEqual(undefined);
        expect(Gubu(Optional())(1)).toEqual(1);
        expect(Gubu(Optional())('a')).toEqual('a');
        expect(Gubu(Optional())(true)).toEqual(true);
        expect(Gubu(Optional())({})).toEqual({});
        expect(Gubu(Optional())([])).toEqual([]);
        expect(Gubu(Optional(null))()).toEqual(null);
        expect(Gubu(Optional(NaN))()).toEqual(NaN);
        expect(Gubu(Optional(Infinity))()).toEqual(Infinity);
        expect(Gubu(Optional(-Infinity))()).toEqual(-Infinity);
        expect(Gubu(Optional(null))(null)).toEqual(null);
        expect(Gubu(Optional(NaN))(NaN)).toEqual(NaN);
        expect(Gubu(Optional(Infinity))(Infinity)).toEqual(Infinity);
        expect(Gubu(Optional(-Infinity))(-Infinity)).toEqual(-Infinity);
        expect(() => Gubu(Optional(null))('a')).toThrow('type');
        expect(() => Gubu(Optional(NaN))('a')).toThrow('type');
        expect(() => Gubu(Optional(Infinity))('a')).toThrow('type');
        expect(() => Gubu(Optional(-Infinity))('a')).toThrow('type');
        expect(Gubu(Optional(undefined))()).toEqual(undefined);
        expect(Gubu(Optional(undefined))(undefined)).toEqual(undefined);
        expect(() => Gubu(Optional(undefined))('a')).toThrow('type');
    });
    test('builder-open', () => {
        expect(Gubu({})()).toEqual({});
        expect(Gubu(Open({}))()).toEqual({});
        expect(Gubu({})({})).toEqual({});
        expect(Gubu(Open({}))({})).toEqual({});
        expect(Gubu({})({ x: 1 })).toEqual({ x: 1 });
        expect(Gubu(Open({}))({ x: 1 })).toEqual({ x: 1 });
        expect(() => Gubu({ y: 2 })({ x: 1 })).toThrow('not allowed');
        expect(Gubu(Open({ y: 2 }))({ x: 1 })).toEqual({ y: 2, x: 1 });
        expect(() => Gubu({ y: 2 })({ x: 1, y: 3 })).toThrow('not allowed');
        expect(Gubu(Open({ y: 2 }))({ x: 1, y: 3 })).toEqual({ y: 3, x: 1 });
        expect(Gubu({ a: {} })()).toEqual({ a: {} });
        expect(Gubu({ a: Open({}) })()).toEqual({ a: {} });
        expect(Gubu({ a: {} })({})).toEqual({ a: {} });
        expect(Gubu({ a: Open({}) })({})).toEqual({ a: {} });
        expect(Gubu({ a: {} })({ a: { x: 1 } })).toEqual({ a: { x: 1 } });
        expect(Gubu({ a: Open({}) })({ a: { x: 1 } })).toEqual({ a: { x: 1 } });
        expect(() => Gubu({ a: { y: 2 } })({ a: { x: 1 } })).toThrow('not allowed');
        expect(Gubu({ a: Open({ y: 2 }) })({ a: { x: 1 } })).toEqual({ a: { y: 2, x: 1 } });
        expect(() => Gubu({ a: { y: 2 } })({ a: { x: 1, y: 3 } })).toThrow('not allowed');
        expect(Gubu({ a: Open({ y: 2 }) })({ a: { x: 1, y: 3 } })).toEqual({ a: { y: 3, x: 1 } });
        expect(Gubu({ a: Open({}).Default({ x: 1 }) })()).toEqual({ a: { x: 1 } });
        // expect(() => Gubu(Optional(1))(true)).toThrow('type')
    });
    test('builder-check', () => {
        let g0 = Gubu(Check((v) => v === "x"));
        expect(g0('x')).toEqual('x');
        expect(() => g0('y')).toThrow('Validation failed for string "y" because check "(v) => v === "x"" failed.');
        expect(() => g0(1)).toThrow('Validation failed for number "1" because check "(v) => v === "x"" failed.');
        expect(() => g0()).toThrow('Validation failed for value "undefined" because the value is required.');
        expect(Gubu(Skip(g0))()).toEqual(undefined);
        let g1 = Gubu(Check(/a/));
        expect(g1('a')).toEqual('a');
        expect(g1('qaq')).toEqual('qaq');
        expect(() => g1('q')).toThrow('Validation failed for string "q" because check "/a/" failed.');
        expect(() => g1()).toThrow('Validation failed for value "undefined" because the value is required.');
        let g3 = Gubu(Check('number'));
        expect(g3(1)).toEqual(1);
        expect(() => g3('a')).toThrow('number');
        expect(() => g3()).toThrow('required');
        let g4 = Gubu({ x: Check('number') });
        expect(g4({ x: 1 })).toEqual({ x: 1 });
        expect(() => g4({ x: 'a' })).toThrow('number');
        expect(() => g4({})).toThrow('required');
        expect(() => g4()).toThrow('required');
        let g5 = Gubu(Check(/ul/i));
        expect(g5('*UL*')).toEqual('*UL*');
        expect(() => g5()).toThrow('required');
        expect(() => g5(undefined)).toThrow('required');
        expect(() => g5(NaN)).toThrow('check');
        expect(() => g5(null)).toThrow('check');
        let c0 = Gubu(Check((v) => v === 1));
        expect(c0(1)).toEqual(1);
        expect(() => c0(2)).toThrow('Validation failed for number "2" because check "(v) => v === 1" failed.');
        expect(() => c0('x')).toThrow('check');
        expect(() => c0()).toThrow('required');
        expect(c0.error(1)).toEqual([]);
        expect(c0.error('x')).toMatchObject([{ w: 'check' }]);
        expect(c0.error()).toMatchObject([{ w: 'required' }]);
        let c0s = Gubu(Skip(c0));
        expect(c0s(1)).toEqual(1);
        expect(() => c0s(2)).toThrow('Validation failed for number "2" because check "(v) => v === 1" failed.');
        expect(() => c0s('x')).toThrow('check');
        expect(c0s()).toEqual(undefined);
        expect(c0s.error(1)).toEqual([]);
        expect(c0s.error('x')).toMatchObject([{ w: 'check' }]);
        expect(c0s.error()).toEqual([]);
        let c0d = Gubu(Default('foo', c0));
        expect(c0d(1)).toEqual(1);
        expect(() => c0d(2)).toThrow('Validation failed for number "2" because check "(v) => v === 1" failed.');
        expect(() => c0d('x')).toThrow('check');
        expect(c0d()).toEqual('foo');
        expect(c0d.error(1)).toEqual([]);
        expect(c0d.error('x')).toMatchObject([{ w: 'check' }]);
        expect(c0d.error()).toEqual([]);
        let c1 = Gubu(Check(/a/));
        expect(c1('qaq')).toEqual('qaq');
        expect(() => c1('qbq')).toThrow('Validation failed for string "qbq" because check "/a/" failed.');
        expect(() => c1(1)).toThrow('check');
        expect(() => c1()).toThrow('required');
        let c1d = Gubu(Default('a', Check(/a/)));
        expect(c1d('qaq')).toEqual('qaq');
        expect(() => c1d('qbq')).toThrow('Validation failed for string "qbq" because check "/a/" failed.');
        expect(() => c1d(1)).toThrow('check');
        expect(c1d()).toEqual('a');
        let v0 = Gubu(Check((v) => !!v, Number));
        expect(v0(1)).toEqual(1);
        expect(() => v0('a')).toThrow('number');
    });
    test('builder-closed', () => {
        let tmp = {};
        let g0 = Gubu({ a: { b: { c: Closed({ x: 1 }) } } });
        expect(g0({ a: { b: { c: { x: 2 } } } })).toEqual({ a: { b: { c: { x: 2 } } } });
        expect(() => g0({ a: { b: { c: { x: 2, y: 3 } } } })).toThrow(/Validation failed for property "a.b.c" with object "{x:2,y:3}" because the property "y" is not allowed\./);
        let g1 = Gubu(Closed([Date, RegExp]));
        expect(g1(tmp.a0 = [new Date(), /a/])).toEqual(tmp.a0);
        expect(() => g1([new Date(), /a/, 'Q'])).toThrow('not allowed');
        expect(g1((tmp.a2 = [new Date(), /a/], tmp.a2.x = 1, tmp.a2))).toEqual(tmp.a2);
        let g2 = Gubu({ a: Closed([String]) });
        expect(g2({ a: ['x'] })).toEqual({ a: ['x'] });
        expect(() => g2({})).toThrow('required');
        expect(() => g2({ a: undefined })).toThrow('required');
        expect(() => g2({ a: [] })).toThrow('required');
        expect(() => g2({ a: ['x', 'y'] })).toThrow('not allowed');
        let g4 = Gubu(Closed({ x: 1 }));
        expect(g4({})).toEqual({ x: 1 });
        expect(g4({ x: 11 })).toEqual({ x: 11 });
        expect(() => g4({ x: 11, y: 2 })).toThrow('property \"y\" is not allowed');
    });
    test('builder-one', () => {
        let g0 = Gubu(One(Number, String));
        expect(g0(1)).toEqual(1);
        expect(g0('x')).toEqual('x');
        expect(() => g0(true)).toThrow('Value "true" for property "" does not satisfy one of: Number, String');
        expect(() => g0()).toThrow('Value "undefined" for property "" does not satisfy one of: Number, String');
        let g0o = Gubu(Skip(One(Number, String)));
        expect(g0o(1)).toEqual(1);
        expect(g0o('x')).toEqual('x');
        expect(g0o()).toEqual(undefined);
        expect(() => g0o(true)).toThrow('Value "true" for property "" does not satisfy one of: Number, String');
        let g1 = Gubu([One({ x: Number }, { x: String })]);
        expect(g1([{ x: 1 }, { x: 'x' }, { x: 2 }, { x: 'y' }]))
            .toMatchObject([{ x: 1 }, { x: 'x' }, { x: 2 }, { x: 'y' }]);
        expect(() => g1([{ x: 1 }, { x: true }, { x: 2 }, { x: false }]))
            .toThrow(`Value "{x:true}" for property "1" does not satisfy one of: {"x":"Number"}, {"x":"String"}
Value "{x:false}" for property "3" does not satisfy one of: {"x":"Number"}, {"x":"String"}`);
        let g2 = Gubu([One({ x: Exact('red'), y: String }, { x: Exact('green'), z: Number })]);
        expect(g2([
            { x: 'red', y: 'Y' },
            { x: 'green', z: 1 },
        ])).toMatchObject([
            { x: 'red', y: 'Y' },
            { x: 'green', z: 1 },
        ]);
        expect(() => g2([
            { x: 'green', z: 2, y: 22 },
            { x: 'red', y: 'Y', z: 'YY' }
        ])).toThrow(`Value "{x:green,z:2,y:22}" for property "0" does not satisfy one of: {"x":"red","y":"String"}, {"x":"green","z":"Number"}
Value "{x:red,y:Y,z:YY}" for property "1" does not satisfy one of: {"x":"red","y":"String"}, {"x":"green","z":"Number"}`);
        expect(() => g2([
            { x: 'red', y: 3 },
            { x: 'green', z: 'Z' },
        ])).toThrow(`Value "{x:red,y:3}" for property "0" does not satisfy one of: {"x":"red","y":"String"}, {"x":"green","z":"Number"}
Value "{x:green,z:Z}" for property "1" does not satisfy one of: {"x":"red","y":"String"}, {"x":"green","z":"Number"}`);
    });
    test('builder-some', () => {
        let g0 = Gubu({ a: Some(Number, String) });
        expect(g0({ a: 1 })).toEqual({ a: 1 });
        expect(g0({ a: 'x' })).toEqual({ a: 'x' });
        expect(() => g0({ a: true })).toThrow(`Value "true" for property "a" does not satisfy any of: Number, String`);
        expect(() => g0({})).toThrow('Value "undefined" for property "a" does not satisfy any of: Number, String');
        let g1 = Gubu(Some(Number, String));
        expect(g1(1)).toEqual(1);
        expect(g1('x')).toEqual('x');
        expect(() => g1(true)).toThrow(`Value "true" for property "" does not satisfy any of: Number, String`);
        let g2 = Gubu([Some(Number, String)]);
        expect(g2([1])).toEqual([1]);
        expect(g2(['x'])).toEqual(['x']);
        expect(g2([1, 2])).toEqual([1, 2]);
        expect(g2([1, 'x'])).toEqual([1, 'x']);
        expect(g2(['x', 1])).toEqual(['x', 1]);
        expect(g2(['x', 'y'])).toEqual(['x', 'y']);
        expect(g2(['x', 1, 'y', 2])).toEqual(['x', 1, 'y', 2]);
        expect(() => g2([true])).toThrow(`Value "true" for property "0" does not satisfy any of: Number, String`);
        let g3 = Gubu({ a: [Some(Number, String)] });
        expect(g3({ a: [1] })).toEqual({ a: [1] });
        expect(g3({ a: ['x'] })).toEqual({ a: ['x'] });
        expect(g3({ a: ['x', 1, 'y', 2] })).toEqual({ a: ['x', 1, 'y', 2] });
        expect(() => g3({ a: [1, 2, true] })).toThrow(`Value "true" for property "a.2" does not satisfy any of: Number, String`);
        let g4 = Gubu({ a: [Some(Open({ x: 1 }), Open({ x: 'X' }))] });
        expect(g4({ a: [{ x: 2 }, { x: 'Q' }, { x: 3, y: true }, { x: 'W', y: false }] }))
            .toEqual({ a: [{ x: 2 }, { x: 'Q' }, { x: 3, y: true }, { x: 'W', y: false }] });
        let g5 = Gubu({ a: [Some({ x: 1 }, Closed({ x: 'X' }))] });
        expect(g5({ a: [{ x: 2 }, { x: 'Q' }] }))
            .toEqual({ a: [{ x: 2 }, { x: 'Q' }] });
    });
    test('builder-all', () => {
        let g0 = Gubu(All(Open({ x: 1 }), Open({ y: 'a' })));
        expect(g0({ x: 11, y: 'aa' })).toEqual({ x: 11, y: 'aa' });
        expect(g0({})).toEqual({ x: 1, y: 'a' });
        expect(() => g0({ x: 'b', y: 'a' })).toThrow(`Value "{x:b,y:a}" for property "" does not satisfy all of: {"x":1}, {"y":"a"}`);
        expect(() => g0()).toThrow('Validation failed for value "undefined" because the value is required.');
        let g0s = Gubu(All(Open({ x: 1 }), Open({ y: 'a' })).Skip());
        expect(g0s({ x: 11, y: 'aa' })).toEqual({ x: 11, y: 'aa' });
        expect(g0s({})).toEqual({ x: 1, y: 'a' });
        expect(() => g0s({ x: 'b', y: 'a' })).toThrow(`Value "{x:b,y:a}" for property "" does not satisfy all of: {"x":1}, {"y":"a"}`);
        expect(g0s()).toEqual(undefined);
        // TODO: Optional
        // expect(g0s()).toEqual({ x: 1, y: 'a' })
        let g1 = Gubu({
            a: All(Check((v) => v > 10), Check((v) => v < 20))
        });
        expect(g1({ a: 11 })).toEqual({ a: 11 });
        expect(() => g1({ a: 0 })).toThrow('Value "0" for property "a" does not satisfy all of: (v) => v > 10, (v) => v < 20');
        let g2 = Gubu(All({ x: 1, y: Any() }, { x: Any(), y: 'a' }));
        expect(g2({ x: 11, y: 'AA' })).toEqual({ x: 11, y: 'AA' });
        expect(() => g2({ x: 11, y: true })).toThrow('Value "{x:11,y:true}" for property "" does not satisfy all of: {"x":1,"y":"any"}, {"x":"any","y":"a"}');
        let g3 = Gubu(All({ x: 1, y: Any() }, { x: Any(), y: { z: 'a' } }));
        expect(g3({ x: 11, y: { z: 'AA' } })).toEqual({ x: 11, y: { z: 'AA' } });
        expect(() => g3({ x: 11, y: { z: true } })).toThrow('Value "{x:11,y:{z:true}}" for property "" does not satisfy all of: {"x":1,"y":"any"}, {"x":"any","y":{"z":"a"}}');
        let g4 = Gubu(All(Open({ x: 1 }), Open({ y: 2 })));
        expect(g4({ x: 11, y: 22 })).toEqual({ x: 11, y: 22 });
        expect(() => g4({ x: 'X', y: 'Y' })).toThrow('Value "{x:X,y:Y}" for property "" does not satisfy all of: {"x":1}, {"y":2}');
    });
    test('builder-skip', () => {
        let g0a = Gubu({ a: Skip(String) });
        expect(g0a({ a: 'x' })).toMatchObject({ a: 'x' });
        // NOTE: Skip(Type) does not insert a default value.
        expect(g0a({})).toMatchObject({});
        expect(() => g0a({ a: 1 })).toThrow(/string/);
        let g0 = Gubu(Skip(String));
        expect(g0('a')).toEqual('a');
        expect(g0(undefined)).toEqual(undefined);
        expect(g0()).toEqual(undefined);
        expect(() => g0('')).toThrow('not allowed');
        expect(() => g0(null)).toThrow('type');
        expect(() => g0(NaN)).toThrow('type');
        let g1 = Gubu(Skip('x'));
        expect(g1('a')).toEqual('a');
        expect(g1(undefined)).toEqual(undefined);
        expect(g1()).toEqual(undefined);
        expect(() => g1('')).toThrow('not allowed');
        expect(() => g1(null)).toThrow('type');
        expect(() => g1(NaN)).toThrow('type');
        let g2 = Gubu(Skip(''));
        expect(g2('a')).toEqual('a');
        expect(g2(undefined)).toEqual(undefined);
        expect(g2()).toEqual(undefined);
        expect(g2('')).toEqual('');
        expect(() => g2(null)).toThrow('type');
        expect(() => g2(NaN)).toThrow('type');
        let g3 = Gubu(Skip(Empty(String)));
        expect(g3('a')).toEqual('a');
        expect(g3(undefined)).toEqual(undefined);
        expect(g3()).toEqual(undefined);
        expect(g3('')).toEqual('');
        expect(() => g3(null)).toThrow('type');
        expect(() => g3(NaN)).toThrow('type');
        let g4 = Gubu(Skip(Empty('x')));
        expect(g4('a')).toEqual('a');
        expect(g4(undefined)).toEqual(undefined);
        expect(g4()).toEqual(undefined);
        expect(g4('')).toEqual('');
        expect(() => g4(null)).toThrow('type');
        expect(() => g4(NaN)).toThrow('type');
        let g5 = Gubu(Skip(Empty('')));
        expect(g5('a')).toEqual('a');
        expect(g5(undefined)).toEqual(undefined);
        expect(g5()).toEqual(undefined);
        expect(g5('')).toEqual('');
        expect(() => g5(null)).toThrow('type');
        expect(() => g5(NaN)).toThrow('type');
        let o0 = Gubu({ p: Skip(String) });
        expect(o0({ p: 'a' })).toEqual({ p: 'a' });
        expect(o0({ p: undefined })).toEqual({ p: undefined });
        expect(o0({})).toEqual({});
        expect(() => o0({ p: '' })).toThrow('not allowed');
        expect(() => o0({ p: null })).toThrow('type');
        expect(() => o0({ p: NaN })).toThrow('type');
        let o1 = Gubu({ p: Skip('x') });
        expect(o1({ p: 'a' })).toEqual({ p: 'a' });
        expect(o1({ p: undefined })).toEqual({ p: undefined });
        expect(o1({})).toEqual({});
        expect(() => o1({ p: '' })).toThrow('not allowed');
        expect(() => o1({ p: null })).toThrow('type');
        expect(() => o1({ p: NaN })).toThrow('type');
        let o2 = Gubu({ p: Skip('') });
        expect(o2({ p: 'a' })).toEqual({ p: 'a' });
        expect(o2({ p: undefined })).toEqual({ p: undefined });
        expect(o2({})).toEqual({});
        expect(o2({ p: '' })).toEqual({ p: '' });
        expect(() => o2({ p: null })).toThrow('type');
        expect(() => o2({ p: NaN })).toThrow('type');
        let o3 = Gubu({ p: Skip(Empty(String)) });
        expect(o3({ p: 'a' })).toEqual({ p: 'a' });
        expect(o3({ p: undefined })).toEqual({ p: undefined });
        expect(o3({})).toEqual({});
        expect(o3({ p: '' })).toEqual({ p: '' });
        expect(() => o3({ p: null })).toThrow('type');
        expect(() => o3({ p: NaN })).toThrow('type');
        let o4 = Gubu({ p: Skip(Empty('x')) });
        expect(o4({ p: 'a' })).toEqual({ p: 'a' });
        expect(o4({ p: undefined })).toEqual({ p: undefined });
        expect(o4({})).toEqual({});
        expect(o4({ p: '' })).toEqual({ p: '' });
        expect(() => o4({ p: null })).toThrow('type');
        expect(() => o4({ p: NaN })).toThrow('type');
        let o5 = Gubu({ p: Skip(Empty('')) });
        expect(o5({ p: 'a' })).toEqual({ p: 'a' });
        expect(o5({ p: undefined })).toEqual({ p: undefined });
        expect(o5({})).toEqual({});
        expect(o5({ p: '' })).toEqual({ p: '' });
        expect(() => o5({ p: null })).toThrow('type');
        expect(() => o5({ p: NaN })).toThrow('type');
        let a0 = Gubu([Skip(String)]);
        expect(a0(['a'])).toEqual(['a']);
        expect(a0([undefined])).toEqual([undefined]);
        expect(a0([])).toEqual([]);
        expect(() => a0([''])).toThrow('not allowed');
        expect(() => a0([null])).toThrow('type');
        expect(() => a0([NaN])).toThrow('type');
        let a1 = Gubu([Skip('x')]);
        expect(a1(['a'])).toEqual(['a']);
        expect(a1([undefined])).toEqual([undefined]);
        expect(a1([])).toEqual([]);
        expect(() => a1([''])).toThrow('not allowed');
        expect(() => a1([null])).toThrow('type');
        expect(() => a1([NaN])).toThrow('type');
        let a2 = Gubu([Skip('')]);
        expect(a2(['a'])).toEqual(['a']);
        expect(a2([undefined])).toEqual([undefined]);
        expect(a2([])).toEqual([]);
        expect(a2([''])).toEqual(['']);
        expect(() => a2([null])).toThrow('type');
        expect(() => a2([NaN])).toThrow('type');
        let a3 = Gubu([Skip(Empty(String))]);
        expect(a3(['a'])).toEqual(['a']);
        expect(a3([undefined])).toEqual([undefined]);
        expect(a3([])).toEqual([]);
        expect(a3([''])).toEqual(['']);
        expect(() => a3([null])).toThrow('type');
        expect(() => a3([NaN])).toThrow('type');
        let a4 = Gubu([Skip(Empty('x'))]);
        expect(a4(['a'])).toEqual(['a']);
        expect(a4([undefined])).toEqual([undefined]);
        expect(a4([])).toEqual([]);
        expect(a4([''])).toEqual(['']);
        expect(() => a4([null])).toThrow('type');
        expect(() => a4([NaN])).toThrow('type');
        let a5 = Gubu([Skip(Empty(''))]);
        expect(a5(['a'])).toEqual(['a']);
        expect(a5([undefined])).toEqual([undefined]);
        expect(a5([])).toEqual([]);
        expect(a5([''])).toEqual(['']);
        expect(() => a5([null])).toThrow('type');
        expect(() => a5([NaN])).toThrow('type');
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
        expect(() => g0(1)).toThrow('Validation failed for number "1" because no value is allowed.');
        let g1 = Gubu({ a: Never() });
        expect(() => g1({ a: 'x' })).toThrow('Validation failed for property "a" with string "x" because no value is allowed.');
    });
    test('builder-rename', () => {
        let g0 = Gubu({ a: Rename('b', { x: 1 }) });
        expect(g0({ a: { x: 2 } })).toMatchObject({ b: { x: 2 } });
        let g1 = Gubu([
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
        expect(() => g1('zed')).toThrow('exactly one of: foo, bar');
    });
    test('builder-construct', () => {
        const GUBU$ = Symbol.for('gubu$');
        expect(Required('x')).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: 'x',
            r: true,
        });
        expect(Skip(String)).toMatchObject({
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
        expect(Skip(Required('x'))).toMatchObject({
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
        expect(Required('x').Skip()).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: 'x',
            r: false,
        });
        expect(Skip(Skip(String))).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: '',
            r: false,
        });
        expect(Skip(String).Skip()).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: '',
            r: false,
        });
        expect(Skip(String).Required()).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: '',
            r: true,
        });
        expect(Required(Skip(String))).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: '',
            r: true,
        });
    });
    test('builder-before', () => {
        // Use before to check for undefined, as it not passed to Check
        let b0 = Gubu(Before((v) => undefined === v));
        expect(b0(undefined)).toEqual(undefined);
        expect(() => b0(1)).toThrow('check');
    });
    test('builder-before-after-basic', () => {
        let g0 = Gubu(Before((val, _update) => {
            val.b = 1 + val.a;
            return true;
        }, Open({ a: 1 }))
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
            }, Open({ a: 1 }))
                .Before((val, _update) => {
                val.b = 1 + val.a;
                return true;
            })
        });
        expect(g1({ x: { a: 2 } })).toMatchObject({ x: { a: 2, b: 3, c: 20 } });
    });
    test('builder-custom-hyperbole', () => {
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
        const g1 = Gubu(Skip(Hyperbole(One(String, Number))));
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
        let a1 = Gubu([Number, String]);
        expect(() => a1()).toThrow('required');
        expect(() => a1([])).toThrow('required');
        expect(() => a1([1])).toThrow('required');
        expect(a1([1, 'x'])).toMatchObject([1, 'x']);
        expect(() => a1([1, 'x', 'y'])).toThrow('not allowed');
        expect(() => a1(['x', 'y'])).toThrow('Validation failed for index "0" with string "x" because the string is not of type number.');
        expect(() => a1([1, 2])).toThrow('Validation failed for index "1" with number "2" because the number is not of type string.');
        let a2 = Gubu([9, String]);
        expect(() => a2()).toThrow('required');
        expect(() => a2([])).toThrow('required');
        expect(() => a2([1])).toThrow('required');
        expect(a2([1, 'x'])).toMatchObject([1, 'x']);
        expect(() => a2([1, 'x', 'y'])).toThrow('not allowed');
        expect(() => a2(['x', 1])).toThrow(`Validation failed for index "0" with string "x" because the string is not of type number.
Validation failed for index "1" with number "1" because the number is not of type string.`);
        expect(() => a2(['x', 'y'])).toThrow('Validation failed for index "0" with string "x" because the string is not of type number.');
        let a3 = Gubu([1, 2, 3]);
        expect(a3()).toEqual([1, 2, 3]);
        expect(a3([])).toEqual([1, 2, 3]);
        expect(a3([11])).toEqual([11, 2, 3]);
        expect(a3([11, 22])).toEqual([11, 22, 3]);
        expect(a3([11, 22, 33])).toMatchObject([11, 22, 33]);
        expect(() => a3([11, 22, 33, 44])).toThrow('not allowed');
        expect(a3([undefined, 22, 33])).toMatchObject([1, 22, 33]);
        expect(a3([undefined, undefined, 33])).toMatchObject([1, 2, 33]);
        expect(a3([undefined, undefined, undefined])).toMatchObject([1, 2, 3]);
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
    test('builder-custom-between', () => {
        const rangeCheck = Gubu([Number, Number]);
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
                        makeErr(state, `Value "$VALUE" for property "$PATH" is ` +
                            `not between ${range[0]} and ${range[1]}.`)
                    ];
                    return false;
                }
            });
            return vs;
        };
        const g0 = Gubu({ a: [Between([10, 20])] });
        expect(g0({ a: [11, 12, 13] })).toEqual({ a: [11, 12, 13] });
        expect(() => g0({ a: [11, 9, 13, 'y'] })).toThrow('Value "9" for property "a.1" is not between 10 and 20.\nValue "y" for property "a.3" is not between 10 and 20.');
    });
    test('builder-define-refer-basic', () => {
        let g0 = Gubu({ a: Define('A', { x: 1 }), b: Refer('A'), c: Refer('A') });
        expect(g0({ a: { x: 2 }, b: { x: 2 } }))
            .toEqual({ a: { x: 2 }, b: { x: 2 } });
        expect(g0({ a: { x: 33 }, b: { x: 44 }, c: { x: 55 } }))
            .toEqual({ a: { x: 33 }, b: { x: 44 }, c: { x: 55 } });
        expect(() => g0({ a: { x: 33 }, b: { x: 'X' } }))
            .toThrow('Validation failed for property "b.x" with string "X" because the string is not of type number.');
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
        })).toThrow('Validation failed for property "a.b.a.b.c" with string "C" because the string is not of type number.');
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
    test('builder-min-basic', () => {
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
            .toThrow(`Value "9" for property "a" must be a minimum of 10 (was 9).`);
        expect(g0({ b: ['x', 'y'] })).toMatchObject({ b: ['x', 'y'] });
        expect(g0({ b: ['x', 'y', 'z'] })).toMatchObject({ b: ['x', 'y', 'z'] });
        expect(() => g0({ b: ['x'] }))
            .toThrow(`Value "[x]" for property "b" must be a minimum length of 2 (was 1).`);
        expect(() => g0({ b: [] }))
            .toThrow(`Value "[]" for property "b" must be a minimum length of 2 (was 0).`);
        expect(g0({ c: 'bar' })).toMatchObject({ c: 'bar' });
        expect(g0({ c: 'barx' })).toMatchObject({ c: 'barx' });
        expect(() => g0({ c: 'ba' }))
            .toThrow(`Value "ba" for property "c" must be a minimum length of 3 (was 2).`);
        expect(g0({ d: [4, 5, 6] })).toMatchObject({ d: [4, 5, 6] });
        expect(() => g0({ d: [4, 5, 6, 3] }))
            .toThrow(`Value "3" for property "d.3" must be a minimum of 4 (was 3).`);
        expect(g0({ e: [{ x: 1, y: 2 }] })).toMatchObject({ e: [{ x: 1, y: 2 }] });
        expect(g0({ e: [{ x: 1, y: 2, z: 3 }] }))
            .toMatchObject({ e: [{ x: 1, y: 2, z: 3 }] });
        expect(() => g0({ e: [{ x: 1 }] })).toThrow('Value "{x:1}" for property "e.0" must be a minimum length of 2 (was 1).');
        expect(() => g0({ e: [{}] })).toThrow('Value "{}" for property "e.0" must be a minimum length of 2 (was 0).');
        expect(g0({ e: [] })).toMatchObject({ e: [] });
    });
    test('builder-min-example', () => {
        const { Min } = Gubu;
        let shape = Gubu({
            size: Min(2, 4) // Minimum is 2, default is 4, type is Number, optional
        });
        expect(shape({})).toEqual({ size: 4 });
        expect(shape({ size: 3 })).toEqual({ size: 3 });
        expect(() => shape({ size: 1 })).toThrow('minimum');
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
            .toThrow(`Value "11" for property "a" must be a maximum of 10 (was 11).`);
        expect(g0({ b: ['x', 'y'] })).toMatchObject({ b: ['x', 'y'] });
        expect(g0({ b: ['x'] })).toMatchObject({ b: ['x'] });
        expect(g0({ b: [] })).toMatchObject({ b: [] });
        expect(() => g0({ b: ['x', 'y', 'z'] }))
            .toThrow(`Value "[x,y,z]" for property "b" must be a maximum length of 2 (was 3).`);
        expect(g0({ c: 'bar' })).toMatchObject({ c: 'bar' });
        expect(g0({ c: 'ba' })).toMatchObject({ c: 'ba' });
        expect(g0({ c: 'b' })).toMatchObject({ c: 'b' });
        expect(() => g0({ c: 'barx' }))
            .toThrow(`Value "barx" for property "c" must be a maximum length of 3 (was 4).`);
        expect(() => g0({ c: '' }))
            .toThrow(`Validation failed for property "c" with string "" because an empty string is not allowed.`);
        expect(g0({ d: [4, 3, 2, 1, 0, -1] })).toMatchObject({ d: [4, 3, 2, 1, 0, -1] });
        expect(g0({ d: [] })).toMatchObject({ d: [] });
        expect(() => g0({ d: [4, 5] }))
            .toThrow(`Value "5" for property "d.1" must be a maximum of 4 (was 5).`);
        expect(g0({ e: [{ x: 1, y: 2 }] })).toMatchObject({ e: [{ x: 1, y: 2 }] });
        expect(g0({ e: [{ x: 1 }] }))
            .toMatchObject({ e: [{ x: 1 }] });
        expect(g0({ e: [{}] }))
            .toMatchObject({ e: [{}] });
        expect(() => g0({ e: [{ x: 1, y: 2, z: 3 }] })).toThrow('Value "{x:1,y:2,z:3}" for property "e.0" must be a maximum length of 2 (was 3).');
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
            .toThrow(`Value "10" for property "a" must be above 10 (was 10).`);
        expect(() => g0({ a: 9 }))
            .toThrow(`Value "9" for property "a" must be above 10 (was 9).`);
        expect(g0({ b: ['x', 'y', 'z'] })).toMatchObject({ b: ['x', 'y', 'z'] });
        expect(() => g0({ b: ['x', 'y'] }))
            .toThrow(`Value "[x,y]" for property "b" must have length above 2 (was 2).`);
        expect(() => g0({ b: ['x'] }))
            .toThrow(`Value "[x]" for property "b" must have length above 2 (was 1).`);
        expect(() => g0({ b: [] }))
            .toThrow(`Value "[]" for property "b" must have length above 2 (was 0).`);
        expect(g0({ c: 'barx' })).toMatchObject({ c: 'barx' });
        expect(() => g0({ c: 'bar' }))
            .toThrow(`Value "bar" for property "c" must have length above 3 (was 3).`);
        expect(() => g0({ c: 'ba' }))
            .toThrow(`Value "ba" for property "c" must have length above 3 (was 2).`);
        expect(() => g0({ c: 'b' }))
            .toThrow(`Value "b" for property "c" must have length above 3 (was 1).`);
        expect(() => g0({ c: '' }))
            .toThrow('Value "" for property "c" must have length above 3 (was 0).');
        expect(g0({ d: [5, 6] })).toMatchObject({ d: [5, 6] });
        expect(() => g0({ d: [4, 5, 6, 3] }))
            .toThrow(`Value "4" for property "d.0" must be above 4 (was 4).
Value "3" for property "d.3" must be above 4 (was 3).`);
        expect(g0({ e: [{ x: 1, y: 2, z: 3 }] }))
            .toMatchObject({ e: [{ x: 1, y: 2, z: 3 }] });
        expect(() => g0({ e: [{ x: 1, y: 2 }] }))
            .toThrow('Value "{x:1,y:2}" for property "e.0" must have length above 2 (was 2).');
        expect(() => g0({ e: [{ x: 1 }] }))
            .toThrow('Value "{x:1}" for property "e.0" must have length above 2 (was 1).');
        expect(() => g0({ e: [{}] }))
            .toThrow('Value "{}" for property "e.0" must have length above 2 (was 0).');
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
            .toThrow(`Value "10" for property "a" must be below 10 (was 10).`);
        expect(() => g0({ a: 11 }))
            .toThrow(`Value "11" for property "a" must be below 10 (was 11).`);
        expect(g0({ b: ['x'] })).toMatchObject({ b: ['x'] });
        expect(g0({ b: [] })).toMatchObject({ b: [] });
        expect(() => g0({ b: ['x', 'y', 'z'] }))
            .toThrow(`Value "[x,y,z]" for property "b" must have length below 2 (was 3).`);
        expect(() => g0({ b: ['x', 'y'] }))
            .toThrow(`Value "[x,y]" for property "b" must have length below 2 (was 2).`);
        expect(g0({ c: 'ba' })).toMatchObject({ c: 'ba' });
        expect(g0({ c: 'b' })).toMatchObject({ c: 'b' });
        expect(() => g0({ c: 'bar' }))
            .toThrow(`Value "bar" for property "c" must have length below 3 (was 3).`);
        expect(() => g0({ c: 'barx' }))
            .toThrow(`Value "barx" for property "c" must have length below 3 (was 4).`);
        expect(() => g0({ c: '' }))
            .toThrow(`Validation failed for property "c" with string "" because an empty string is not allowed.`);
        expect(g0({ d: [3, 2, 1, 0, -1] })).toMatchObject({ d: [3, 2, 1, 0, -1] });
        expect(g0({ d: [] })).toMatchObject({ d: [] });
        expect(() => g0({ d: [4, 5] }))
            .toThrow(`Value "4" for property "d.0" must be below 4 (was 4).
Value "5" for property "d.1" must be below 4 (was 5).`);
        expect(g0({ e: [{ x: 1 }] }))
            .toMatchObject({ e: [{ x: 1 }] });
        expect(g0({ e: [{}] }))
            .toMatchObject({ e: [{}] });
        expect(() => g0({ e: [{ x: 1, y: 2 }] })).toThrow('Value "{x:1,y:2}" for property "e.0" must have length below 2 (was 2).');
        expect(g0({ e: [] })).toMatchObject({ e: [] });
    });
    test('builder-len', () => {
        let g0 = Gubu({
            a: Len(1),
            b: Len(2, [String]),
            c: Len(3, 'foo'),
            d: [Len(4, Number)],
            e: [Len(2, {})],
        });
        expect(g0({ a: 'a' })).toMatchObject({ a: 'a' });
        expect(g0({ a: 1 })).toMatchObject({ a: 1 });
        expect(() => g0({ a: 'bb' }))
            .toThrow(`Value "bb" for property "a" must be exactly 1 in length (was 2).`);
        expect(g0({ b: ['x', 'y'] })).toMatchObject({ b: ['x', 'y'] });
        expect(() => g0({ b: ['x', 'y', 'z'] }))
            .toThrow(`Value "[x,y,z]" for property "b" ` +
            `must be exactly 2 in length (was 3).`);
        expect(() => g0({ b: ['x'] }))
            .toThrow(`Value "[x]" for property "b" must be exactly 2 in length (was 1).`);
        expect(() => g0({ b: [] }))
            .toThrow(`Value "[]" for property "b" must be exactly 2 in length (was 0).`);
    });
    test('builder-func', () => {
        let f0 = () => 1;
        let f1 = () => 2;
        let g0 = Gubu(Func(f0));
        expect(g0()).toEqual(f0);
        expect(g0(f1)).toEqual(f1);
        expect(() => g0(1)).toThrow('type');
        // Escapes type functions
        let g1 = Gubu(Func(Number));
        expect(g1()).toEqual(Number);
        expect(g1(Number)).toEqual(Number);
        expect(() => g1(1)).toThrow('type');
    });
    test('builder-key', () => {
        let g0 = Gubu({
            a: {
                b: {
                    c: {
                        name: Key(),
                        part0: Key(0),
                        part1: Key(1),
                        part2: Key(2),
                        join: Key(3, '.'),
                        self: Key(-1),
                        custom: Key((path, _state) => {
                            return path.length;
                        }),
                        x: 1,
                    }
                }
            }
        });
        expect(g0({ a: { b: { c: { x: 2 } } } })).toMatchObject({
            a: {
                b: {
                    c: {
                        name: 'c',
                        self: ['self'],
                        part0: [],
                        part1: ['c'],
                        part2: ['b', 'c'],
                        join: 'a.b.c',
                        custom: 5,
                        x: 2,
                    }
                }
            }
        });
        let g1 = Gubu(Child({ name: Key() }));
        expect(g1({ a: {}, b: {} })).toMatchObject({ a: { name: 'a' }, b: { name: 'b' } });
    });
    test('builder-child', () => {
        let g0 = Gubu(Child(Number));
        expect(g0({ a: 1, b: 2 })).toMatchObject({ a: 1, b: 2 });
        expect(() => g0({ a: 1, b: 2, c: 'c' })).toThrow('type');
        let g1 = Gubu(Child(String, { a: 1 }));
        expect(g1({})).toMatchObject({});
        expect(g1({ a: 2 })).toMatchObject({ a: 2 });
        expect(() => g1({ a: 'x' })).toThrow('type');
        expect(g1({ a: 2, b: 'x' })).toMatchObject({ a: 2, b: 'x' });
        expect(g1({ a: 2, b: 'x', c: 'y' })).toMatchObject({ a: 2, b: 'x', c: 'y' });
        expect(() => g1({ a: 2, b: 3 })).toThrow('Validation failed for property "b" with number "3" because the number is not of type string.');
        expect(() => g1({ a: 2, b: 'x', c: 4 })).toThrow('Validation failed for property "c" with number "4" because the number is not of type string.');
        expect(() => g1({ a: true, b: 'x', c: 'y' })).toThrow('Validation failed for property "a" with boolean "true" because the boolean is not of type number.');
        expect(() => g1({ a: 'z', b: 'x', c: 'y' })).toThrow('Validation failed for property "a" with string "z" because the string is not of type number.');
        let g2 = Gubu({ a: Required({ b: 1 }).Child({ x: String }) });
        expect(g2({ a: { b: 2, c: { x: 'x' } } }))
            .toMatchObject({ a: { b: 2, c: { x: 'x' } } });
        expect(g2({ a: { b: 2, c: { x: 'x' }, d: { x: 'z' } } }))
            .toMatchObject({ a: { b: 2, c: { x: 'x' }, d: { x: 'z' } } });
        expect(() => g2({ a: { b: 2, c: 3 } })).toThrow('Validation failed for property "a.c" with number "3" because the number is not of type object.');
        let g3 = Gubu({ a: Child({ y: Number, x: Number }) });
        expect(g3({ a: { b: { y: 11, x: 11 }, c: { x: 22, y: 22 } } }))
            .toEqual({ a: { b: { x: 11, y: 11 }, c: { x: 22, y: 22 } } });
        let g4 = Gubu({ a: Child({}) });
        expect(g4({ a: { b: { y: 11, x: 11 }, c: { x: 22, y: 22 } } }))
            .toEqual({ a: { b: { x: 11, y: 11 }, c: { x: 22, y: 22 } } });
        let g5 = Gubu({ a: Child({ b: {} }) });
        expect(g5({ a: { x: { b: {} }, y: { b: {} } } }))
            .toEqual({ a: { x: { b: {} }, y: { b: {} } } });
        let g6 = Gubu({ a: Child({ b: Child({ c: 1 }) }) });
        expect(g6({ a: { x: { b: { xx: { c: 11 } } }, y: { b: { yy: { c: 22 } } } } }))
            .toEqual({ a: { x: { b: { xx: { c: 11 } } }, y: { b: { yy: { c: 22 } } } } });
        let g7 = Gubu({ a: Child({ b: 1 }) });
        expect(g7.spec().v.a.c.t).toEqual('object');
    });
    test('builder-skip', () => {
        // Skip does not insert, but does check type.
        let t0 = Gubu(Skip());
        expect(t0()).toEqual(undefined);
        expect(t0(undefined)).toEqual(undefined);
        expect(t0(null)).toEqual(null);
        expect(t0(NaN)).toEqual(NaN);
        expect(t0(true)).toEqual(true);
        expect(t0(false)).toEqual(false);
        expect(t0(0)).toEqual(0);
        expect(t0(1)).toEqual(1);
        expect(t0('a')).toEqual('a');
        expect(t0('')).toEqual('');
        expect(t0({})).toEqual({});
        expect(t0([])).toEqual([]);
        let t1 = Gubu(Skip(1));
        expect(t1()).toEqual(undefined);
        expect(t1(undefined)).toEqual(undefined);
        expect(() => t1(null)).toThrow('type');
        expect(() => t1(NaN)).toThrow('type');
        expect(() => t1(true)).toThrow('type');
        expect(() => t1(false)).toThrow('type');
        expect(t1(0)).toEqual(0);
        expect(t1(1)).toEqual(1);
        expect(() => t1('a')).toThrow('type');
        expect(() => t1('')).toThrow('type');
        expect(() => t1({})).toThrow('type');
        expect(() => t1([])).toThrow('type');
        let t2 = Gubu(Skip(Number));
        expect(t2()).toEqual(undefined);
        expect(t2(undefined)).toEqual(undefined);
        expect(() => t2(null)).toThrow('type');
        expect(() => t2(NaN)).toThrow('type');
        expect(() => t2(true)).toThrow('type');
        expect(() => t2(false)).toThrow('type');
        expect(t2(0)).toEqual(0);
        expect(t2(1)).toEqual(1);
        expect(() => t2('a')).toThrow('type');
        expect(() => t2('')).toThrow('type');
        expect(() => t2({})).toThrow('type');
        expect(() => t2([])).toThrow('type');
        let d1 = Gubu({ a: Skip(1) });
        expect(d1({})).toEqual({});
        expect(d1({ a: undefined })).toEqual({ a: undefined });
        expect(() => d1({ a: null })).toThrow('type');
        expect(() => d1({ a: NaN })).toThrow('type');
        expect(() => d1({ a: true })).toThrow('type');
        expect(() => d1({ a: false })).toThrow('type');
        expect(d1({ a: 0 })).toEqual({ a: 0 });
        expect(d1({ a: 1 })).toEqual({ a: 1 });
        expect(() => d1({ a: 'a' })).toThrow('type');
        expect(() => d1({ a: '' })).toThrow('type');
        expect(() => d1({ a: {} })).toThrow('type');
        expect(() => d1({ a: [] })).toThrow('type');
    });
    test('builder-default', () => {
        let d0 = Gubu({
            a: 1,
            b: Default(2)
        });
        expect(d0()).toEqual({ a: 1, b: 2 });
        expect(d0(undefined)).toEqual({ a: 1, b: 2 });
        expect(() => d0(null)).toThrow('type');
        expect(d0({ a: 3 })).toEqual({ a: 3, b: 2 });
        expect(d0({ b: 4 })).toEqual({ a: 1, b: 4 });
        expect(d0({ a: 3, b: 4 })).toEqual({ a: 3, b: 4 });
        let d1 = Gubu(Default(Number));
        expect(d1(11)).toEqual(11);
        expect(d1(undefined)).toEqual(0);
        expect(d1()).toEqual(0);
        let d2 = Gubu({ a: Default(Number) });
        expect(d2({ a: 11 })).toEqual({ a: 11 });
        expect(d2({ a: undefined })).toEqual({ a: 0 });
        expect(d2()).toEqual({ a: 0 });
        let d3 = Gubu(Default(Object));
        expect(d3({ x: 1 })).toEqual({ x: 1 });
        expect(d3({})).toEqual({});
        expect(d3()).toEqual({});
        let d4 = Gubu({ a: Default(Object) });
        expect(d4({ a: { x: 2 } })).toEqual({ a: { x: 2 } });
        expect(d4({ a: {} })).toEqual({ a: {} });
        expect(d4({ a: undefined })).toEqual({ a: {} });
        expect(d4({})).toEqual({ a: {} });
        expect(d4()).toEqual({ a: {} });
        let d5 = Gubu(Default({ a: null }, { a: Number }));
        expect(d5({ a: 1 })).toEqual({ a: 1 });
        expect(d5()).toEqual({ a: null });
        expect(() => d5({ a: 'x' })).toThrow('type');
        let d6 = Gubu({ a: Default(Array) });
        expect(d6({ a: [1] })).toEqual({ a: [1] });
        expect(d6({ a: [] })).toEqual({ a: [] });
        expect(d6({ a: undefined })).toEqual({ a: [] });
        expect(d6({})).toEqual({ a: [] });
        expect(d6()).toEqual({ a: [] });
        let d7 = Gubu(Default({ a: null }, { a: [Number] }));
        expect(d7({ a: [1, 2] })).toEqual({ a: [1, 2] });
        expect(d7()).toEqual({ a: null });
        expect(() => d7({ a: 'x' })).toThrow('type');
    });
});

},{"../gubu":1}],5:[function(require,module,exports){
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
    toBeTruthy: (cval)=>pass(cval,!!cval),
    toBeFalsy: (cval)=>pass(cval,!cval),
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


require('./readme.test.js')
require('./gubu.test.js')
require('./builder.test.js')
require('./argu.test.js')

},{"./argu.test.js":3,"./builder.test.js":4,"./gubu.test.js":6,"./readme.test.js":9}],6:[function(require,module,exports){
"use strict";
/* Copyright (c) 2021-2023 Richard Rodger and other contributors, MIT License */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bar = exports.Foo = void 0;
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
const stringify = Gubu.stringify;
const truncate = Gubu.truncate;
const nodize = Gubu.nodize;
const { Above, After, All, Any, Before, Below, Check, Closed, Define, Empty, Exact, Func, Max, Min, Never, One, Open, Refer, Rename, Required, Skip, Some, Child, Default, Optional, } = Gubu;
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
        expect(() => g0({ a: 'bar', b: 999, c: true })).toThrow('not allowed');
    });
    // TODO: type support - remove the any's
    test('valid-basic', () => {
        let g0 = Gubu({ x: 1, y: 'Y' });
        let d0 = { x: 2 };
        if (g0.valid(d0)) {
            expect(d0).toEqual({ x: 2, y: 'Y' });
            expect(d0.x).toEqual(2);
            expect(d0.y).toEqual('Y');
        }
        let v0 = { z: true };
        expect(g0.valid(v0)).toEqual(false);
        expect(v0).toEqual({ z: true, x: 1, y: 'Y' });
        v0 = { z: true };
        let ctx0 = { err: [] };
        expect(g0.valid(v0, ctx0)).toEqual(false);
        expect(v0).toEqual({ z: true, x: 1, y: 'Y' });
        expect(ctx0.err[0].w).toEqual('closed');
        let v1 = {};
        expect(g0.match(v1)).toEqual(true);
        expect(v1).toEqual({});
        let v1e = { z: true };
        expect(g0.match(v1e)).toEqual(false);
        expect(v1e).toEqual({ z: true });
        let g0d = Gubu(Open({ x: 1, y: 'Y' }));
        let d0d = { x: 2, z: true };
        let d0do = g0d(d0d);
        expect(d0do).toEqual({ x: 2, y: 'Y', z: true });
        expect(d0do.x).toEqual(2);
        expect(d0do.y).toEqual('Y');
        expect(d0do.z).toEqual(true);
        let g1 = Gubu(Open({ x: Number, y: 'Y' }));
        let d1 = { x: 2, z: true };
        if (g1.valid(d1)) {
            expect(d1).toEqual({ x: 2, y: 'Y', z: true });
            expect(d1.x).toEqual(2);
            expect(d1.y).toEqual('Y');
            expect(d1.z).toEqual(true);
        }
        let g2 = Gubu(Open({ x: { k: 1 }, y: 'Y' }));
        let d2 = { x: { k: 2 }, z: true };
        if (g2.valid(d2)) {
            expect(d2).toEqual({ x: { k: 2 }, y: 'Y', z: true });
            expect(d2.x).toEqual({ k: 2 });
            expect(d2.y).toEqual('Y');
            expect(d2.z).toEqual(true);
        }
        const shape = Gubu({ x: 1, y: 'Y' });
        let data = { x: 2 };
        expect(shape.valid(data)).toEqual(true);
        expect(shape(data)).toEqual({ x: 2, y: 'Y' });
        expect(shape(data).x).toEqual(2);
        expect(shape(data).y).toEqual('Y');
        // CONSOLE-LOG(data.q) // UNCOMMENT TO VERIFY COMPILE FAILS
        let g3 = Gubu(Object.assign({}, new Foo(1)));
        // let d3 = { a: 11, x: true }
        let d3 = { a: 11 };
        if (g3.valid(d3)) {
            // expect(d3).toEqual({ a: 11, x: true })
            expect(d3).toEqual({ a: 11 });
            expect(d3.a).toEqual(11);
            // expect(d3.x).toEqual(true)
        }
        let g4 = Gubu(Open({ x: 1 }));
        let d4 = { z: true };
        if (g4.valid(d4)) {
            expect(d4.x).toEqual(1);
            expect(d4.z).toEqual(true);
            // CONSOLE-LOG(d4.q) // UNCOMMENT TO VERIFY COMPILE FAILS
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
        expect(() => shape({ a: 'BAD' })).toThrow('Validation failed for property "a" with string "BAD" because the string is not of type number.\nValidation failed for property "b" with value "undefined" because the value is required.');
        // Object shape is bad. Throws an exception:
        expect(() => shape({ b: 'foo', c: true })).toThrow('Validation failed for object "{b:foo,c:true}" because the property "c" is not allowed.');
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
        expect(() => optionShape({ host: '' })).toThrow('empty string is not allowed');
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
        expect(() => userShape({})).toThrow('Validation failed for property "person" with value "undefined" because the value is required.');
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
    test('readme-object', () => {
        let shape = Gubu({
            foo: {
                bar: {
                    zed: String,
                    qaz: Number,
                }
            }
        });
        expect(shape({
            foo: {
                bar: {
                    zed: 'x',
                    qaz: 1
                }
            }
        })).toEqual({
            foo: {
                bar: {
                    zed: 'x',
                    qaz: 1
                }
            }
        });
        let openObject = Gubu(Open({ a: 1 }));
        expect(openObject({ a: 11, b: 22 })).toEqual({ a: 11, b: 22 });
    });
    test('readme-regexp', () => {
        let shape = Gubu({ countryCode: Check(/^[A-Z][A-Z]$/) });
        expect(shape({ countryCode: 'IE' })).toEqual({ countryCode: 'IE' });
        expect(() => shape({ countryCode: 'BAD' })).toThrow('Validation failed for property "countryCode" with string "BAD" because check "/^[A-Z][A-Z]$/" failed.');
        expect(() => shape({})).toThrow('Validation failed for property "countryCode" with value "undefined" because the value is required.');
        expect(() => shape({ countryCode: 123 })).toThrow('Validation failed for property "countryCode" with number "123" because check "/^[A-Z][A-Z]$/" failed.');
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
        })).toThrow('Validation failed for property "root.left.left.left.value" with number "123" because the number is not of type string');
    });
    test('scalar-optional-basic', () => {
        let g0 = Gubu(1);
        expect(g0(2)).toEqual(2);
        expect(g0()).toEqual(1);
        expect(() => g0('x')).toThrow('Validation failed for string "x" because the string is not of type number.');
    });
    test('object-optional-basic', () => {
        let g0 = Gubu(Open({ x: 1 }));
        expect(g0({ x: 2, y: true, z: 's' })).toEqual({ x: 2, y: true, z: 's' });
        expect(g0({ x: 2 })).toEqual({ x: 2 });
        expect(g0({})).toEqual({ x: 1 });
        expect(g0()).toEqual({ x: 1 });
        expect(() => g0('s')).toThrow('Validation failed for string "s" because the string is not of type object.');
        expect(() => g0({ x: 't' })).toThrow('Validation failed for property "x" with string "t" because the string is not of type number.');
    });
    test('array-basic-optional', () => {
        let g0 = Gubu([1]);
        expect(g0([11, 22, 33])).toEqual([11, 22, 33]);
        expect(g0([11, 22])).toEqual([11, 22]);
        expect(g0([11])).toEqual([11]);
        expect(g0([])).toEqual([]);
        expect(g0()).toEqual([]);
        expect(() => g0('s')).toThrow('Validation failed for string "s" because the string is not of type array.');
        expect(() => g0(['t'])).toThrow('Validation failed for index "0" with string "t" because the string is not of type number.');
        expect(() => g0(['t', 22])).toThrow('Validation failed for index "0" with string "t" because the string is not of type number.');
        expect(() => g0(['t', 33])).toThrow('Validation failed for index "0" with string "t" because the string is not of type number.');
        expect(() => g0([11, 't'])).toThrow('Validation failed for index "1" with string "t" because the string is not of type number.');
        expect(() => g0([11, 22, 't'])).toThrow('Validation failed for index "2" with string "t" because the string is not of type number.');
        let g1 = Gubu([]);
        expect(g1([11, 22, 33])).toEqual([11, 22, 33]);
        expect(g1([11, 22])).toEqual([11, 22]);
        expect(g1([11])).toEqual([11]);
        expect(g1([])).toEqual([]);
        expect(g1()).toEqual([]);
        expect(() => g1('s')).toThrow('Validation failed for string "s" because the string is not of type array.');
        expect(g1(['t'])).toEqual(['t']);
        expect(g1(['t', 22])).toEqual(['t', 22]);
        expect(g1(['t', 33])).toEqual(['t', 33]);
        expect(g1([11, 't'])).toEqual([11, 't']);
        expect(g1([11, 22, 't'])).toEqual([11, 22, 't']);
    });
    test('function-optional-basic', () => {
        let f0t = () => true;
        let f0f = () => false;
        let g0 = Gubu(f0t);
        expect(g0().toString()).toEqual('() => true');
        expect(g0(f0f).toString()).toEqual('() => false');
        expect(g0(() => null).toString()).toEqual('() => null');
        let g1 = Gubu({ a: f0t });
        expect(g1().a.toString()).toEqual('() => true');
        expect(g1({ a: f0f }).a.toString()).toEqual('() => false');
        expect(g1({ a: () => null }).a.toString()).toEqual('() => null');
        function f1t() { return true; }
        expect(g0(f1t).toString().replace(/\s/g, ''))
            .toEqual('functionf1t(){returntrue;}');
        expect(g1({ a: f1t }).a.toString().replace(/\s/g, ''))
            .toEqual('functionf1t(){returntrue;}');
        function f1f() { return false; }
        let g2 = Gubu({ a: f1t });
        expect(g2({ a: f1f }).a.toString().replace(/\s/g, ''))
            .toEqual('functionf1f(){returnfalse;}');
    });
    test('class-optional-basic', () => {
        class Planet {
            constructor(name) {
                this.name = name;
            }
        }
        const mars = new Planet('Mars');
        let g0 = Gubu(Planet);
        expect(g0(mars)).toEqual(mars);
        expect(() => g0(1)).toThrow('not an instance of Planet');
        expect(() => g0(Planet)).toThrow('not an instance of Planet');
    });
    test('array-basic-required', () => {
        let g1 = Gubu(Array);
        expect(g1([11, 22, 33])).toEqual([11, 22, 33]);
        expect(g1([11, 22])).toEqual([11, 22]);
        expect(g1([11])).toEqual([11]);
        expect(g1([])).toEqual([]);
        expect(() => g1()).toThrow('required');
        expect(() => g1('s')).toThrow('Validation failed for string "s" because the string is not of type array.');
        expect(g1(['t'])).toEqual(['t']);
        expect(g1(['t', 22])).toEqual(['t', 22]);
        expect(g1(['t', 33])).toEqual(['t', 33]);
        expect(g1([11, 't'])).toEqual([11, 't']);
        expect(g1([11, 22, 't'])).toEqual([11, 22, 't']);
        let g2 = Gubu(Required([]));
        expect(g2([11, 22, 33])).toEqual([11, 22, 33]);
        expect(g2([11, 22])).toEqual([11, 22]);
        expect(g2([11])).toEqual([11]);
        expect(g2([])).toEqual([]);
        expect(() => g2()).toThrow('required');
        expect(() => g2('s')).toThrow('Validation failed for string "s" because the string is not of type array.');
        expect(g2(['t'])).toEqual(['t']);
        expect(g2(['t', 22])).toEqual(['t', 22]);
        expect(g2(['t', 33])).toEqual(['t', 33]);
        expect(g2([11, 't'])).toEqual([11, 't']);
        expect(g2([11, 22, 't'])).toEqual([11, 22, 't']);
    });
    test('spec-revert-skip-required', () => {
        let or = Gubu(Skip(Required(1)));
        expect(or.spec()).toMatchObject({ r: false, p: true, v: 1, t: 'number' });
        let ror = Gubu(Required(Skip(Required(1))));
        expect(ror.spec()).toMatchObject({ r: true, p: false, v: 1, t: 'number' });
        let ro = Gubu(Required(Skip(1)));
        expect(ro.spec()).toMatchObject({ r: true, p: false, v: 1, t: 'number' });
        let oro = Gubu(Skip(Required(Skip(1))));
        expect(oro.spec()).toMatchObject({ r: false, p: true, v: 1, t: 'number' });
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
        expect(() => g0('x')).toThrow('Validation failed for string "x" because the string is not of type number.');
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
                    t: 'Validation failed for string "x" because the string is not of type number.',
                    u: {},
                }
            ]
        });
        try {
            g0('x');
        }
        catch (e) {
            expect(e.message).toEqual('Validation failed for string "x" because the string is not of type number.');
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
                        t: 'Validation failed for string "x" because the string is not of type number.',
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
                    t: 'Validation failed for property "q.a" with number "1" because the number is not of type string.',
                    u: {},
                },
                {
                    k: 'b',
                    n: { t: 'number' },
                    v: 'x',
                    p: 'q.b',
                    w: 'type',
                    m: 1050,
                    t: 'Validation failed for property "q.b" with string "x" because the string is not of type number.',
                    u: {},
                }
            ]
        });
        try {
            g1({ q: { a: 1, b: 'x' } });
        }
        catch (e) {
            expect(e.message).toEqual(`Validation failed for property "q.a" with number "1" because the number is not of type string.
Validation failed for property "q.b" with string "x" because the string is not of type number.`);
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
                        t: 'Validation failed for property "q.a" with number "1" because the number is not of type string.',
                        u: {},
                    },
                    {
                        k: 'b',
                        n: { t: 'number' },
                        v: 'x',
                        p: 'q.b',
                        w: 'type',
                        m: 1050,
                        t: 'Validation failed for property "q.b" with string "x" because the string is not of type number.',
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
        expect(Gubu(Error)(tmp.e0 = new Error())).toEqual(tmp.e0);
        expect(Gubu(Date)(tmp.d0 = new Date())).toEqual(tmp.d0);
        expect(Gubu(RegExp)(tmp.r0 = /a/)).toEqual(tmp.r0);
        expect(Gubu(Map)(tmp.m0 = new Map())).toEqual(tmp.m0);
        expect(Gubu(Foo)(tmp.c0 = new Foo(2))).toEqual(tmp.c0);
        expect(Gubu('a')('x')).toEqual('x');
        expect(Gubu(0)(1)).toEqual(1);
        expect(Gubu(false)(true)).toEqual(true);
        expect(Gubu(BigInt(-1))(BigInt(1))).toEqual(BigInt(1));
        expect(Gubu({})({ x: 1 })).toEqual({ x: 1 });
        expect(Gubu([])([1])).toEqual([1]);
        expect(Gubu(() => null)(tmp.f0 = () => false)).toEqual(tmp.f0);
        expect(Gubu(new Object())({ x: 1 })).toEqual({ x: 1 });
        expect(Gubu(new Array())([1])).toEqual([1]);
        // FIX: no way to tell this apart from `function anonymous() {}` ?
        // expect(Gubu(new Function())(tmp.nf0 = () => false)).toEqual(tmp.nf0)
        expect(Gubu(Symbol('bar'))(tmp.s0)).toEqual(tmp.s0);
        expect(Gubu(new Error('a'))(tmp.e1 = new Error('b'))).toEqual(tmp.e1);
        expect(Gubu(new Date())(tmp.d1 = new Date(Date.now() - 1111))).toEqual(tmp.d1);
        // expect(Gubu(new RegExp('a'))(tmp.r1 = /b/)).toEqual(tmp.r1)
        expect(Gubu(new RegExp('a'))(tmp.r1 = 'a')).toEqual(tmp.r1);
        expect(Gubu(new Foo(4))(tmp.c1 = new Foo(5))).toEqual(tmp.c1);
        expect(Gubu(new Bar(6))(tmp.c2 = new Bar(7))).toEqual(tmp.c2);
        expect(Gubu(G$({ v: () => null }))(tmp.f1 = () => false)).toEqual(tmp.f1);
        expect(Gubu(null)(null)).toEqual(null);
        expect(() => Gubu(null)(1)).toThrow('Validation failed for number "1" because the number is not of type null.');
        expect(Gubu(Check((_v, u) => (u.val = 1, true)))(null)).toEqual(1);
        expect(() => Gubu(String)(1)).toThrow(/not of type string/);
        expect(() => Gubu(Number)('x')).toThrow(/not of type number/);
        expect(() => Gubu(Boolean)('x')).toThrow(/not of type boolean/);
        expect(() => Gubu(BigInt)('x')).toThrow(/not of type bigint/);
        expect(() => Gubu(Object)('x')).toThrow(/not of type object/);
        expect(() => Gubu(Array)('x')).toThrow(/not of type array/);
        expect(() => Gubu(Function)('x')).toThrow(/not of type function/);
        expect(() => Gubu(Symbol)('x')).toThrow(/not of type symbol/);
        expect(() => Gubu(Error)('x')).toThrow(/not an instance of Error/);
        expect(() => Gubu(Date)(/a/)).toThrow(/not an instance of Date/);
        expect(() => Gubu(RegExp)(new Date()))
            .toThrow(/not an instance of RegExp/);
        expect(() => Gubu(Foo)(tmp.c3 = new Bar(8)))
            .toThrow(/not an instance of Foo/);
        expect(() => Gubu(Bar)(tmp.c4 = new Foo(9)))
            .toThrow(/not an instance of Bar/);
        expect(() => Gubu('a')(1)).toThrow(/not of type string/);
        expect(() => Gubu(0)('x')).toThrow(/not of type number/);
        expect(() => Gubu(false)('x')).toThrow(/not of type boolean/);
        expect(() => Gubu(BigInt(-1))('x')).toThrow(/not of type bigint/);
        expect(() => Gubu({})('x')).toThrow(/ not of type object/);
        expect(() => Gubu([])('x')).toThrow(/not of type array/);
        expect(() => Gubu(() => null)('x'))
            .toThrow(/not of type function/);
        expect(() => Gubu(Symbol('bar'))('x')).toThrow(/not of type symbol/);
        expect(() => Gubu(new Error('x'))('x')).toThrow(/not an instance of Error/);
        expect(() => Gubu(new Date())('x')).toThrow(/not an instance of Date/);
        expect(() => Gubu(new RegExp('a'))('x'))
            .toThrow('Validation failed for string \"x\" because the string did not match /a/.');
        expect(() => Gubu(new Foo(4))('a')).toThrow(/not an instance of Foo/);
        expect(() => Gubu(new Bar(6))('a')).toThrow(/not an instance of Bar/);
        expect(() => Gubu(new Foo(10))(new Bar(11)))
            .toThrow(/not an instance of Foo/);
        expect(() => Gubu(new Bar(12))(new Foo(12)))
            .toThrow(/not an instance of Bar/);
        // expect(() => Gubu(G$({ v: () => null }))('x'))
        //  .toThrow(/not of type function/)
        expect(Gubu({ a: String })({ a: 'x' })).toEqual({ a: 'x' });
        expect(Gubu({ a: Number })({ a: 1 })).toEqual({ a: 1 });
        expect(Gubu({ a: Boolean })({ a: true })).toEqual({ a: true });
        expect(Gubu({ a: Object })({ a: { x: 1 } })).toEqual({ a: { x: 1 } });
        expect(Gubu({ a: RegExp })({ a: /x/ })).toEqual({ a: /x/ });
        expect(() => Gubu({ a: String })({ a: 1 }))
            .toThrow(/not of type string/);
        expect(() => Gubu({ a: Number })({ a: 'x' }))
            .toThrow(/not of type number/);
        expect(() => Gubu({ a: Boolean })({ a: 'x' }))
            .toThrow(/not of type boolean/);
        expect(() => Gubu({ a: Object })({ a: 'x' }))
            .toThrow(/not of type object/);
        expect(Gubu([String])([])).toEqual([]);
        expect(Gubu([String])(['x'])).toEqual(['x']);
        expect(Gubu([String])(['x', 'y'])).toEqual(['x', 'y']);
        expect(Gubu([Number])([])).toEqual([]);
        expect(Gubu([Number])([1])).toEqual([1]);
        expect(Gubu([Number])([1, 2])).toEqual([1, 2]);
        expect(Gubu([Boolean])([])).toEqual([]);
        expect(Gubu([Boolean])([true])).toEqual([true]);
        expect(Gubu([Boolean])([true, false])).toEqual([true, false]);
        expect(Gubu([Object])([])).toEqual([]);
        expect(Gubu([Object])([{ x: 1 }])).toEqual([{ x: 1 }]);
        expect(Gubu([Object])([{ x: 1 }, { y: 2 }])).toEqual([{ x: 1 }, { y: 2 }]);
        expect(Gubu([RegExp])([])).toEqual([]);
        expect(Gubu([RegExp])([/a/])).toEqual([/a/]);
        expect(Gubu([RegExp])([/a/, /b/])).toEqual([/a/, /b/]);
        expect(Gubu([Date])([])).toEqual([]);
        let d0 = new Date();
        expect(Gubu([Date])([d0])).toEqual([d0]);
        let d1 = new Date();
        expect(Gubu([Date])([d0, d1])).toEqual([d0, d1]);
        expect(() => Gubu([String])([1]))
            .toThrow(/not of type string/);
        expect(() => Gubu([Number])(['x']))
            .toThrow(/not of type number/);
        expect(() => Gubu([Boolean])(['x']))
            .toThrow(/not of type boolean/);
        expect(() => Gubu([Object])([1]))
            .toThrow(/not of type object/);
        expect(() => Gubu([RegExp])(['not']))
            .toThrow(/not an instance of RegExp\./);
    });
    test('shapes-fails', () => {
        let tmp = {};
        let string0 = Gubu(String);
        expect(string0('x')).toEqual('x');
        expect(string0('xy')).toEqual('xy');
        expect(() => string0('')).toThrow(/Validation failed for string "" because an empty string is not allowed./);
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
        expect(object0({ x: 1 })).toEqual({ x: 1 });
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
        expect(array0([11])).toEqual([11]);
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
        let g1 = Gubu({ a: Skip(Date) });
        expect(g1({ a: d0 })).toEqual({ a: d0 });
        expect(g1({ a: undefined })).toEqual({ a: undefined });
        expect(g1({})).toEqual({});
        let r0 = /a/;
        let g2 = Gubu({ a: RegExp });
        expect(g2({ a: r0 })).toEqual({ a: r0 });
        expect(() => g2({})).toThrow('required');
        expect(() => g2({ a: RegExp })).toThrow('instance');
        expect(() => g2({ a: d0 })).toThrow(/2121.*instance/);
        let g3 = Gubu({ a: Skip(RegExp) });
        expect(g3({ a: r0 })).toEqual({ a: r0 });
        expect(g3({})).toEqual({});
    });
    test('object-basic', () => {
        let g1 = Gubu({ x: 1 });
        expect(g1()).toEqual({ x: 1 });
        expect(g1({})).toEqual({ x: 1 });
        expect(g1({ x: 11 })).toEqual({ x: 11 });
        expect(() => g1({ x: 11, y: 22 })).toThrow('Validation failed for object "{x:11,y:22}" because the property "y" is not allowed.');
        expect(() => g1({ x: 11, y: 22, z: 33 })).toThrow('Validation failed for object "{x:11,y:22,z:33}" because the properties "y, z" are not allowed.');
        let g2 = Gubu({ x: 1, y: 2 });
        expect(g2()).toEqual({ x: 1, y: 2 });
        expect(g2({})).toEqual({ x: 1, y: 2 });
        expect(g2({ x: 11 })).toEqual({ x: 11, y: 2 });
        expect(g2({ x: 11, y: 22 })).toEqual({ x: 11, y: 22 });
        expect(() => g2({ x: 11, y: 22, z: 33 })).toThrow('Validation failed for object "{x:11,y:22,z:33}" because the property "z" is not allowed.');
        let g3 = Gubu({ x: 1, y: 2, z: 3 });
        expect(g3()).toEqual({ x: 1, y: 2, z: 3 });
        expect(g3({})).toEqual({ x: 1, y: 2, z: 3 });
        expect(g3({ x: 11 })).toEqual({ x: 11, y: 2, z: 3 });
        expect(g3({ x: 11, y: 22 })).toEqual({ x: 11, y: 22, z: 3 });
        expect(g3({ x: 11, y: 22, z: 33 })).toEqual({ x: 11, y: 22, z: 33 });
        expect(() => g3({ x: 11, y: 22, z: 33, k: 44 })).toThrow('Validation failed for object "{x:11,y:22,z:33,k:44}" because the property "k" is not allowed.');
        let g1o = Gubu(Open({ x: 1 }));
        expect(g1o()).toEqual({ x: 1 });
        expect(g1o({})).toEqual({ x: 1 });
        expect(g1o({ x: 11 })).toEqual({ x: 11 });
        expect(g1o({ x: 11, y: 22 })).toEqual({ x: 11, y: 22 });
        expect(g1o({ x: 11, y: 22, z: 33 })).toEqual({ x: 11, y: 22, z: 33 });
        let g2o = Gubu(Open({ x: 1, y: 2 }));
        expect(g2o()).toEqual({ x: 1, y: 2 });
        expect(g2o({})).toEqual({ x: 1, y: 2 });
        expect(g2o({ x: 11 })).toEqual({ x: 11, y: 2 });
        expect(g2o({ x: 11, y: 22 })).toEqual({ x: 11, y: 22 });
        expect(g2o({ x: 11, y: 22, z: 33 })).toEqual({ x: 11, y: 22, z: 33 });
        let g3o = Gubu(Open({ x: 1, y: 2, z: 3 }));
        expect(g3o()).toEqual({ x: 1, y: 2, z: 3 });
        expect(g3o({})).toEqual({ x: 1, y: 2, z: 3 });
        expect(g3o({ x: 11 })).toEqual({ x: 11, y: 2, z: 3 });
        expect(g3o({ x: 11, y: 22 })).toEqual({ x: 11, y: 22, z: 3 });
        expect(g3o({ x: 11, y: 22, z: 33 })).toEqual({ x: 11, y: 22, z: 33 });
        expect(g3o({ x: 11, y: 22, z: 33, k: 44 }))
            .toEqual({ x: 11, y: 22, z: 33, k: 44 });
        let g1v = Gubu(Child(Number, { x: 1 }));
        expect(g1v()).toEqual({ x: 1 });
        expect(g1v({})).toEqual({ x: 1 });
        expect(g1v({ x: 11 })).toEqual({ x: 11 });
        expect(g1v({ x: 11, y: 22 })).toEqual({ x: 11, y: 22 });
        expect(g1v({ x: 11, y: 22, z: 33 })).toEqual({ x: 11, y: 22, z: 33 });
        expect(() => g1v({ x: 11, y: true })).toThrow('Validation failed for property "y" with boolean "true" because the boolean is not of type number.');
        let g2v = Gubu(Child(Number, { x: 1, y: 2 }));
        expect(g2v()).toEqual({ x: 1, y: 2 });
        expect(g2v({})).toEqual({ x: 1, y: 2 });
        expect(g2v({ x: 11 })).toEqual({ x: 11, y: 2 });
        expect(g2v({ x: 11, y: 22 })).toEqual({ x: 11, y: 22 });
        expect(g2v({ x: 11, y: 22, z: 33 })).toEqual({ x: 11, y: 22, z: 33 });
        expect(() => g2v({ x: 11, y: 22, z: true })).toThrow('Validation failed for property "z" with boolean "true" because the boolean is not of type number.');
        let g3v = Gubu(Child(Number, { x: 1, y: 2, z: 3 }));
        expect(g3v()).toEqual({ x: 1, y: 2, z: 3 });
        expect(g3v({})).toEqual({ x: 1, y: 2, z: 3 });
        expect(g3v({ x: 11 })).toEqual({ x: 11, y: 2, z: 3 });
        expect(g3v({ x: 11, y: 22 })).toEqual({ x: 11, y: 22, z: 3 });
        expect(g3v({ x: 11, y: 22, z: 33 })).toEqual({ x: 11, y: 22, z: 33 });
        expect(g3v({ x: 11, y: 22, z: 33, k: 44 }))
            .toEqual({ x: 11, y: 22, z: 33, k: 44 });
        expect(() => g3v({ x: 11, y: 22, z: 33, k: true })).toThrow('Validation failed for property "k" with boolean "true" because the boolean is not of type number.');
        // Empty object is Open
        let g4 = Gubu({});
        expect(g4()).toEqual({});
        expect(g4({})).toEqual({});
        expect(g4({ x: 1 })).toEqual({ x: 1 });
        expect(g4({ x: 1, y: 'a' })).toEqual({ x: 1, y: 'a' });
        let g5 = Gubu({ k: {} });
        expect(g5()).toEqual({ k: {} });
        expect(g5({})).toEqual({ k: {} });
        expect(g5({ k: {} })).toEqual({ k: {} });
        expect(g5({ k: { n: true } })).toEqual({ k: { n: true } });
        expect(g5({ k: { n: true, m: NaN } })).toEqual({ k: { n: true, m: NaN } });
        expect(() => g5({ x: 1 })).toThrow('not allowed');
        expect(() => Gubu({ x: 1 })('q')).toThrow(/type object/);
        expect(() => Gubu({ y: { x: 1 } })({ y: 'q' })).toThrow(/type object/);
    });
    test('required-cover', () => {
        const v0 = Gubu(Required(Any()));
        expect(v0(1)).toEqual(1);
        expect(() => v0()).toThrow('required');
        const o0 = Gubu({ a: Required(Any()) });
        expect(o0({ a: 1 })).toEqual({ a: 1 });
        expect(() => o0({})).toThrow('required');
        const a0 = Gubu([Required(Any())]);
        expect(a0([])).toEqual([]); // empty array is allowed
        expect(a0([1])).toEqual([1]);
        expect(a0([1, 2])).toEqual([1, 2]);
        expect(a0([1, 2, 3])).toEqual([1, 2, 3]);
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
        expect(() => rs0('')).toThrow('Validation failed for string "" because an empty string is not allowed.');
        const rs0e = Gubu(Empty(String));
        expect(rs0e('x')).toEqual('x');
        expect(rs0e('')).toEqual('');
        expect(() => rs0e()).toThrow('required');
        expect(() => rs0e(undefined)).toThrow('required');
        const os0 = Gubu('x');
        expect(() => os0('')).toThrow('empty string is not allowed');
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
        // Use literal '' as a shortcut
        const os0e3 = Gubu('');
        expect(os0e3('')).toEqual('');
        expect(os0e3()).toEqual('');
        expect(os0e3(undefined)).toEqual('');
        expect(os0e3('x')).toEqual('x');
        expect(os0e3('y')).toEqual('y');
        const os1e = Gubu(Skip(Empty(String)));
        expect(os1e()).toEqual(undefined);
        expect(os1e('')).toEqual('');
        expect(os1e('x')).toEqual('x');
        const os2e = Gubu(Skip(String).Empty());
        expect(os2e()).toEqual(undefined);
        expect(os2e('')).toEqual('');
        expect(os2e('x')).toEqual('x');
        const os1eO = Gubu({ a: Skip(Empty(String)) });
        expect(os1eO({})).toEqual({});
        expect(os1eO({ a: '' })).toEqual({ a: '' });
        expect(os1eO({ a: 'x' })).toEqual({ a: 'x' });
        // Long values are truncated in error descriptions.
        expect(() => Gubu(Number)('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')).toThrow('Validation failed for string "aaaaaaaaaaaaaaaaaaaaaaaaaaa..." because the string is not of type number.');
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
        // Required does inject undefined
        let r0 = Gubu({ a: Boolean, b: Required({ x: Number }), c: Required([]) });
        let o0 = {};
        expect(() => r0(o0)).toThrow('required');
        expect(o0).toEqual({});
        expect(o0.hasOwnProperty('a')).toBeFalsy();
        expect(o0.hasOwnProperty('b')).toBeFalsy();
        expect(o0.hasOwnProperty('c')).toBeFalsy();
    });
    test('function-basic', () => {
        function Qaz() { }
        let g0 = Gubu(Func(Qaz)); // needed other Foo is considered a class
        let tmp = {};
        expect(g0()).toEqual(Qaz);
        expect(g0(tmp.f0 = () => true)).toEqual(tmp.f0);
    });
    test('regexp-basic', () => {
        let g0 = Gubu(/a/);
        expect(g0('a')).toEqual('a');
        expect(g0('xax')).toEqual('xax');
        expect(() => g0('x')).toThrow('Validation failed for string "x" because the string did not match /a/.');
        let g1 = Gubu({ b: /a/ });
        expect(g1({ b: 'a' })).toEqual({ b: 'a' });
        expect(g1({ b: 'xax' })).toEqual({ b: 'xax' });
        expect(() => g1({ b: 'x' })).toThrow('Validation failed for property "b" with string "x" because the string did not match /a/.');
        expect(() => g1({})).toThrow('Validation failed for property "b" with value "undefined" because the value is not of type string.');
        let g2 = Gubu({ b: Optional(/a/) });
        expect(g2({ b: 'a' })).toEqual({ b: 'a' });
        expect(g2({ b: 'xax' })).toEqual({ b: 'xax' });
        expect(g2({})).toEqual({});
        expect(() => g2({ b: 'x' })).toThrow('Validation failed for property "b" with string "x" because the string did not match /a/.');
    });
    test('api-object', () => {
        // This is an allowed way to get shape builders
        const { Required } = Gubu;
        let obj01 = Gubu({
            a: { x: 1 },
            b: Skip({ y: 2 }),
            c: Skip({ z: Skip({ k: 3 }) }),
        });
        expect(obj01()).toEqual({ a: { x: 1 } });
        expect(obj01({})).toEqual({ a: { x: 1 } });
        expect(obj01({ b: {} })).toEqual({ a: { x: 1 }, b: { y: 2 } });
        expect(obj01({ c: {} })).toEqual({ a: { x: 1 }, c: {} });
        expect(obj01({ c: { z: {} } })).toEqual({ a: { x: 1 }, c: { z: { k: 3 } } });
        let obj11 = Gubu({
            people: Required({}).Child({ name: String, age: Number })
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
        })).toThrow('Validation failed for property "people.bob.age" with value "undefined" because the value is required.');
        expect(() => obj11({})).toThrow('Validation failed for property "people" with value "undefined" because the value is required.');
        let shape = Gubu({
            foo: Number,
            bar: Required({
                zed: Boolean
            })
        });
        // This passes, returning the value unchanged.
        shape({ foo: 1, bar: { zed: false } });
        // These fail, throwing an Error.
        expect(() => shape({ bar: { zed: false } })).toThrow('required'); // foo is required
        expect(() => shape({ foo: 'abc', bar: { zed: false } })).toThrow('number'); // foo is not a number
        expect(() => shape({ foo: 1 })).toThrow('required'); // bar is required
        expect(() => shape({ foo: 1, bar: {} })).toThrow('required'); // bar.zed is required
        expect(() => shape({ foo: 1, bar: { zed: false, baz: 2 }, qaz: 3 })).toThrow('not allowed'); // new properties are not allowed
        let strictShape = Gubu({ a: { b: String } });
        // Passes
        expect(strictShape({ a: { b: 'ABC' } })).toEqual({ a: { b: 'ABC' } });
        // Fails, even though a is not required, because a.b is required.
        expect(() => strictShape({})).toThrow('Validation failed for property "a.b" with value "undefined" because the value is required.');
        let easyShape = Gubu({ a: Skip({ b: String }) });
        // Now both pass
        expect(easyShape({ a: { b: 'ABC' } })).toEqual({ a: { b: 'ABC' } });
        expect(easyShape({})).toEqual({});
        // This still fails, as `a` is now defined, and needs `b`
        expect(() => easyShape({ a: {} })).toThrow('Validation failed for property "a.b" with value "undefined" because the value is required.');
        const { Open } = Gubu;
        shape = Gubu(Open({
            a: 1
        }));
        expect(shape({ a: 11, b: 22 })).toEqual({ a: 11, b: 22 });
        expect(shape({ b: 22, c: 'foo' })).toEqual({ a: 1, b: 22, c: 'foo' });
        expect(() => shape({ a: 'foo' })).toThrow('type');
        shape = Gubu(Open({
            a: Open({
                b: 1
            })
        }));
        expect(shape({ a: { b: 11, c: 22 }, d: 33 }))
            .toEqual({ a: { b: 11, c: 22 }, d: 33 });
        const { Child } = Gubu;
        shape = Gubu(Child(String, {
            a: 123,
        }));
        // All non-explicit properties must be a String
        expect(shape({ a: 11, b: 'abc' })).toEqual({ a: 11, b: 'abc' }); // b is a string
        expect(shape({ c: 'foo', d: 'bar' })).toEqual({ a: 123, c: 'foo', d: 'bar' }); // c and d are strings
        // These fail
        expect(() => shape({ a: 'abc' })).toThrow('number'); // a must be a number
        expect(() => shape({ b: { x: 1 } })).toThrow('string'); // b must be a string
    });
    test('api-array', () => {
        let g1 = Gubu([Number]);
        expect(g1()).toEqual([]);
        expect(g1([])).toEqual([]);
        expect(g1([1])).toEqual([1]);
        expect(g1([1, 2])).toEqual([1, 2]);
        expect(g1([1, 2, 3])).toEqual([1, 2, 3]);
        expect(g1([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
        expect(() => g1([1, 2, 'x'])).toThrow('type');
        let g2 = Gubu([{ x: 1 }]);
        expect(g2()).toEqual([]);
        expect(g2([])).toEqual([]);
        expect(g2([{ x: 123 }])).toEqual([{ x: 123 }]);
        expect(g2([{ x: 123 }, { x: 456 }])).toEqual([{ x: 123 }, { x: 456 }]);
        expect(g2([{}])).toEqual([{ x: 1 }]);
        expect(g2([{ x: 123 }, {}])).toEqual([{ x: 123 }, { x: 1 }]);
        expect(() => g2([{ x: 123, y: 'a' }, { x: 456 }]))
            .toThrow('not allowed');
        expect(() => g2([{ x: 123 }, { x: 456, y: 'a' }]))
            .toThrow('not allowed');
        expect(() => g2([{ x: 'a' }])).toThrow('type');
        expect(() => g2([{ x: 1 }, { x: 'a' }])).toThrow('type');
        let gc1 = Gubu(Closed([Number, String, Boolean]));
        expect(gc1([123, 'abc', true])).toEqual([123, 'abc', true]);
        expect(() => gc1(['bad'])).toThrow('type');
        expect(() => gc1([123])).toThrow('required');
        expect(() => gc1([123, 'abc', true, 'extra'])).toThrow('not allowed');
        let gc2 = Gubu(Closed([1, 'a', true]));
        expect(gc2()).toEqual([1, 'a', true]);
        expect(gc2([])).toEqual([1, 'a', true]);
        expect(gc2([2])).toEqual([2, 'a', true]);
        expect(gc2([2, 'b'])).toEqual([2, 'b', true]);
        expect(gc2([2, 'b', false])).toEqual([2, 'b', false]);
        expect(gc2([2, undefined, false])).toEqual([2, 'a', false]);
        expect(gc2([2, , false])).toEqual([2, 'a', false]);
        expect(() => gc2([2, 'b', false, 'bad'])).toThrow('not allowed');
        // 2 or more elements, so considered Closed
        let gc3 = Gubu([{ x: 1 }, Required({ y: true })]);
        expect(gc3([{ x: 2 }, { y: false }])).toEqual([{ x: 2 }, { y: false }]);
        expect(gc3([undefined, { y: false }])).toEqual([{ x: 1 }, { y: false }]);
        expect(gc3([{ x: 2 }, {}])).toEqual([{ x: 2 }, { y: true }]);
        expect(() => gc3([{ x: 2 }, undefined])).toThrow('required');
        expect(() => gc3([{ x: 2 }])).toThrow('required');
        let gc4 = Gubu({ a: Closed([{ x: 1 }, { y: { z: 'Z' } }]) });
        expect(gc4()).toEqual({ 'a': [{ 'x': 1 }, { 'y': { 'z': 'Z' } }] });
        expect(gc4({})).toEqual({
            'a': [{ 'x': 1 }, {
                    'y': {
                        'z': 'Z'
                    }
                }]
        });
        expect(gc4({ a: undefined }))
            .toEqual({ 'a': [{ 'x': 1 }, { 'y': { 'z': 'Z' } }] });
        expect(gc4({ a: [] })).toEqual({ 'a': [{ 'x': 1 }, { 'y': { 'z': 'Z' } }] });
        expect(() => gc4({ a: {} })).toThrow('Validation failed for property "a" with object "{}" because the object is not of type array.');
    });
    test('api-length', () => {
        let g1 = Gubu(Max(2, []));
        expect(g1([1])).toEqual([1]);
        expect(g1(['a', true])).toEqual(['a', true]);
        expect(() => g1([1, 2, 3])).toThrow('maximum length of 2');
        let g2 = Gubu(Min(2, [Number]));
        expect(g2([11, 22])).toEqual([11, 22]);
        expect(g2([11, 22, 33])).toEqual([11, 22, 33]);
        expect(() => g2([11])).toThrow('minimum');
        expect(() => g2([])).toThrow('minimum');
        let g3 = Gubu(Max(2, String));
        expect(g3('a')).toEqual('a');
        expect(g3('ab')).toEqual('ab');
        expect(() => g3('abc')).toThrow('maximum');
        let g4 = Gubu(Max(2, {}));
        expect(g4({ a: 1 })).toEqual({ a: 1 });
        expect(g4({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
        expect(() => g4({ a: 1, b: 2, c: 3 })).toThrow('maximum');
    });
    test('api-functions', () => {
        let f0 = () => true;
        let f1 = () => false;
        let { G$ } = Gubu;
        let shape = Gubu({ fn: G$({ v: f0, f: f0 }) });
        expect(shape({})).toEqual({ fn: f0 });
        expect(shape({ fn: f1 })).toEqual({ fn: f1 });
        let tmp = {};
        shape = Gubu({
            fn: tmp.d0 = () => true
        });
        expect(shape({ fn: tmp.f0 = () => false })).toEqual({ fn: tmp.f0 });
        expect(shape({})).toEqual({ fn: tmp.d0 });
    });
    test('api-custom', () => {
        let shape = Gubu({ a: Check((v) => 10 < v) });
        expect(shape({ a: 11 })).toEqual({ a: 11 }); // passes, as 10 < 11 is true
        expect(() => shape({ a: 9 })).toThrow('Validation failed for property "a" with number "9" because check "(v) => 10 < v" failed.'); // fails, as 10 < 9 is false
        shape = Gubu({
            a: Check((value, update) => {
                update.val = value * 2;
                return true; // Remember to return true to indicate value is valid!
            })
        });
        expect(shape({ a: 3 })).toEqual({ a: 6 });
        shape = Gubu({
            a: Check((value, update) => {
                update.err = 'BAD VALUE $VALUE AT $PATH';
                return false; // always fails
            })
        });
        expect(() => shape({ a: 3 })).toThrow("BAD VALUE 3 AT a");
        shape = Gubu({
            a: Check((value, update, state) => {
                update.val = value + ` KEY=${state.key}`;
                return true;
            })
        });
        expect(shape({ a: 3 })).toEqual({ a: '3 KEY=a' }); // returns { a: '3 KEY=a'}
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
                    f: 1,
                    n: 0,
                    r: false,
                    p: false,
                    d: 1,
                    u: {},
                    a: [],
                    b: [],
                    e: true,
                    k: [],
                    m: {},
                }
            },
            n: 1,
            r: true,
            p: false,
            d: 0,
            u: {},
            a: [],
            b: [],
            e: true,
            k: ['x'],
            m: {},
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
    test('api-builders-examples', () => {
        let shape_AboveB0 = Gubu(Above(10));
        expect(shape_AboveB0(11)).toEqual(11);
        expect(() => shape_AboveB0(10)).toThrow('Value "10" for property "" must be above 10 (was 10).');
        expect(() => shape_AboveB0(true)).toThrow('Value "true" for property "" must have length above 10 (was NaN).');
        let shape_AboveB1 = Gubu(Above(2));
        expect(shape_AboveB1('abc')).toEqual('abc');
        expect(() => shape_AboveB1('ab')).toThrow('Value "ab" for property "" must have length above 2 (was 2).');
        expect(shape_AboveB1([1, 2, 3])).toEqual([1, 2, 3]);
        expect(() => shape_AboveB1([1, 2])).toThrow('Value "[1,2]" for property "" must have length above 2 (was 2).');
        expect(shape_AboveB1({ a: 1, b: 2, c: 3 })).toEqual({ a: 1, b: 2, c: 3 });
        expect(() => shape_AboveB1({ a: 1, b: 2 })).toThrow('Value "{a:1,b:2}" for property "" must have length above 2 (was 2).');
        let shape_AboveB2 = Gubu(Above(2, Number));
        expect(shape_AboveB2(3)).toEqual(3);
        expect(() => shape_AboveB2([1, 2, 3])).toThrow('Validation failed for array "[1,2,3]" because the array is not of type number.');
        let shape_AboveB3 = Gubu(Skip(Above(2, Number)));
        expect(shape_AboveB3(3)).toEqual(3);
        expect(shape_AboveB3()).toEqual(undefined);
        let shape_AfterB0 = Gubu(After((v) => v > 10, 15));
        expect(shape_AfterB0(11)).toEqual(11);
        expect(() => shape_AfterB0(10)).toThrow('Validation failed for number "10" because check "(v) => v > 10" failed.');
        expect(() => shape_AfterB0('x')).toThrow(`Validation failed for string "x" because the string is not of type number.
Validation failed for string "x" because check "(v) => v > 10" failed.`);
        expect(shape_AfterB0()).toEqual(15);
        let shape_AfterB1 = Gubu(Skip(Number).After((v) => v % 2 === 0));
        expect(shape_AfterB1(2)).toEqual(2);
        expect(() => shape_AfterB1(3)).toThrow('Validation failed for number "3" because check "(v) => v % 2 === 0" failed.');
        expect(() => shape_AfterB1('x')).toThrow('Validation failed for string "x" because check "(v) => v % 2 === 0" failed.');
        expect(shape_AfterB1()).toEqual(undefined);
        let shape_AfterB2 = Gubu(After((v) => v.x % 2 === 0, Required({ x: Number })));
        expect(shape_AfterB2({ x: 2 })).toEqual({ x: 2 });
        expect(() => shape_AfterB2({ x: 3 })).toThrow('Validation failed for object "{x:3}" because check "(v) => v.x % 2 === 0" failed.');
        expect(() => shape_AfterB2({})).toThrow(`Validation failed for object "{}" because check "(v) => v.x % 2 === 0" failed.
Validation failed for property "x" with value "undefined" because the value is required.`);
        expect(() => shape_AfterB2()).toThrow(`Validation failed for value "undefined" because the value is required.`);
        // TODO: modify value
        let shape_AllB0 = Gubu(All(Number, Check((v) => v > 10)));
        expect(shape_AllB0(11)).toEqual(11);
        expect(() => shape_AllB0(10)).toThrow(`Value "10" for property "" does not satisfy all of: Number, (v) => v > 10`);
        let shape_AllB1 = Gubu(All());
        expect(shape_AllB1(123)).toEqual(123);
        expect(() => shape_AllB1()).toThrow('required');
        let shape_AllB2 = Gubu({ a: Default({ b: 'B' }, All(Open({ b: String }), Max(2))) });
        expect(shape_AllB2({ a: { b: 'X' } })).toEqual({ a: { b: 'X' } });
        expect(shape_AllB2({ a: { b: 'X', c: 'Y' } })).toEqual({ a: { b: 'X', c: 'Y' } });
        expect(() => shape_AllB2({ a: { b: 'X', c: 'Y', d: 'Z' } })).toThrow('Value "{b:X,c:Y,d:Z}" for property "a" does not satisfy all of: {"b":"string"}, Max(2)');
        expect(shape_AllB2({})).toEqual({ a: { b: 'B' } });
        let shape_AllB3 = Gubu({ a: Skip(All(Open({ b: String }), Max(2))) });
        expect(shape_AllB3({ a: { b: 'X' } })).toEqual({ a: { b: 'X' } });
        expect(shape_AllB3({})).toEqual({});
        let shape_AnyB0 = Gubu(Any());
        expect(shape_AnyB0(11)).toEqual(11);
        expect(shape_AnyB0(10)).toEqual(10);
        expect(shape_AnyB0()).toEqual(undefined);
        expect(shape_AnyB0(null)).toEqual(null);
        expect(shape_AnyB0(NaN)).toEqual(NaN);
        expect(shape_AnyB0({})).toEqual({});
        expect(shape_AnyB0([])).toEqual([]);
        let shape_AnyB1 = Gubu(Any({ x: 1 }));
        expect(shape_AnyB1()).toEqual({ x: 1 });
        let shape_BeforeB0 = Gubu(Before((v) => v > 10, 10));
        expect(shape_BeforeB0(11)).toEqual(11);
        expect(() => shape_BeforeB0(10)).toThrow('Validation failed for number "10" because check "(v) => v > 10" failed.');
        // TODO: modify value
        let shape_BelowB0 = Gubu(Below(10));
        expect(shape_BelowB0(9)).toEqual(9);
        expect(() => shape_BelowB0(10)).toThrow('Value "10" for property "" must be below 10 (was 10).');
        let shape_CheckB0 = Gubu(Check((v) => v > 10));
        expect(shape_CheckB0(11)).toEqual(11);
        expect(() => shape_CheckB0(10)).toThrow('check');
        let shape_CheckB1 = Gubu(Check((v) => !(v.foo % 2), { foo: 2 }));
        expect(shape_CheckB1({ foo: 4 })).toEqual({ foo: 4 });
        expect(() => shape_CheckB1({ foo: 1 })).toThrow('check');
        expect(shape_CheckB1({})).toEqual({ foo: 2 });
        expect(() => shape_CheckB1()).toThrow('required');
        let shape_ClosedB0 = Gubu(Closed([Number]));
        expect(shape_ClosedB0([1])).toEqual([1]);
        expect(() => shape_ClosedB0([1, 2])).toThrow('Validation failed for array "[1,2]" because the index "1" is not allowed.');
        let shape_DefineB0 = Gubu({ a: Define('foo', 11), b: Refer('foo') });
        expect(shape_DefineB0({ a: 10, b: 12 })).toEqual({ a: 10, b: 12 });
        expect(() => shape_DefineB0({ a: 'A', b: 'B' })).toThrow(`Validation failed for property "a" with string "A" because the string is not of type number.
Validation failed for property "b" with string "B" because the string is not of type number.`);
        let shape_EmptyB0 = Gubu({ a: Empty(String), b: String });
        expect(shape_EmptyB0({ a: '', b: 'ABC' })).toEqual({ a: '', b: 'ABC' });
        expect(() => shape_EmptyB0({ a: '', b: '' })).toThrow('Validation failed for property "b" with string "" because an empty string is not allowed.');
        let shape_ExactB0 = Gubu(Exact(11, 12, true));
        expect(shape_ExactB0(11)).toEqual(11);
        expect(shape_ExactB0(12)).toEqual(12);
        expect(shape_ExactB0(true)).toEqual(true);
        expect(() => shape_ExactB0(10)).toThrow('Value "10" for property "" must be exactly one of: 11, 12, true.');
        expect(() => shape_ExactB0(false)).toThrow('Value "false" for property "" must be exactly one of: 11, 12, true.');
        let shape_MaxB0 = Gubu(Max(11));
        expect(shape_MaxB0(11)).toEqual(11);
        expect(shape_MaxB0(10)).toEqual(10);
        expect(() => shape_MaxB0(12)).toThrow('Value "12" for property "" must be a maximum of 11 (was 12).');
        let shape_MinB0 = Gubu(Min(11));
        expect(shape_MinB0(11)).toEqual(11);
        expect(shape_MinB0(12)).toEqual(12);
        expect(() => shape_MinB0(10)).toThrow('Value "10" for property "" must be a minimum of 11 (was 10).');
        let shape_NeverB0 = Gubu(Never());
        expect(() => shape_NeverB0(10)).toThrow('Validation failed for number "10" because no value is allowed.');
        expect(() => shape_NeverB0(true)).toThrow('Validation failed for boolean "true" because no value is allowed.');
        let shape_OneB0 = Gubu(One(Exact(10), Exact(11), Exact(true)));
        expect(shape_OneB0(10)).toEqual(10);
        expect(shape_OneB0(11)).toEqual(11);
        expect(shape_OneB0(true)).toEqual(true);
        expect(() => shape_OneB0(12)).toThrow('Value "12" for property "" does not satisfy one of: 10, 11, true');
        expect(() => shape_OneB0(false)).toThrow('Value "false" for property "" does not satisfy one of: 10, 11, true');
        expect(() => shape_OneB0(null)).toThrow('Value "null" for property "" does not satisfy one of: 10, 11, true');
        expect(() => shape_OneB0(NaN)).toThrow('Value "NaN" for property "" does not satisfy one of: 10, 11, true');
        expect(() => shape_OneB0(undefined)).toThrow('Value "undefined" for property "" does not satisfy one of: 10, 11, true');
        expect(() => shape_OneB0()).toThrow('Value "undefined" for property "" does not satisfy one of: 10, 11, true');
        let shape_OneB1 = Gubu(One(Number, String));
        expect(shape_OneB1(123)).toEqual(123);
        expect(shape_OneB1('abc')).toEqual('abc');
        expect(() => shape_OneB1(true)).toThrow('Value "true" for property "" does not satisfy one of: Number, String');
        // TODO: more complex objects
        let shape_SkipB0 = Gubu({ a: Skip(11) });
        expect(shape_SkipB0({ a: 10 })).toEqual({ a: 10 });
        expect(shape_SkipB0({ a: undefined })).toEqual({ a: undefined });
        expect(shape_SkipB0({})).toEqual({});
        expect(() => shape_SkipB0({ a: null })).toThrow('type');
        expect(() => shape_SkipB0({ a: true })).toThrow('type');
        let shape_ReferB0 = Gubu({ a: Define('foo', 11), b: Refer('foo') });
        expect(shape_ReferB0({ a: 10, b: 12 })).toEqual({ a: 10, b: 12 });
        expect(shape_ReferB0({ a: 10 })).toEqual({ a: 10, b: undefined });
        expect(shape_ReferB0({})).toEqual({ a: 11, b: undefined });
        expect(shape_ReferB0({ b: 12 })).toEqual({ a: 11, b: 12 });
        expect(() => shape_ReferB0({ a: 'A', b: 'B' })).toThrow(`Validation failed for property "a" with string "A" because the string is not of type number.
Validation failed for property "b" with string "B" because the string is not of type number.`);
        let shape_ReferB1 = Gubu({ a: Define('foo', 11), b: Refer({ name: 'foo', fill: true }) });
        expect(shape_ReferB1({ a: 10, b: 12 })).toEqual({ a: 10, b: 12 });
        expect(shape_ReferB1({ a: 10 })).toEqual({ a: 10, b: 11 });
        expect(shape_ReferB1({})).toEqual({ a: 11, b: 11 });
        expect(shape_ReferB1({ b: 12 })).toEqual({ a: 11, b: 12 });
        expect(() => shape_ReferB1({ a: 'A', b: 'B' })).toThrow(`Validation failed for property "a" with string "A" because the string is not of type number.
Validation failed for property "b" with string "B" because the string is not of type number.`);
        // TODO: also recursive
        let shape_RenameB0 = Gubu({ a: Rename('b', Number) });
        expect(shape_RenameB0({ a: 10 })).toEqual({ b: 10 });
        expect(() => shape_RenameB0({})).toThrow('Validation failed for property "a" with value "undefined" because the value is required.');
        let shape_RenameB1 = Gubu({ a: Rename({ name: 'b', keep: true }, 123) });
        expect(shape_RenameB1({ a: 10 })).toEqual({ a: 10, b: 10 });
        expect(shape_RenameB1({})).toEqual({ a: 123, b: 123 });
        let shape_RequiredB0 = Gubu(Required(11));
        expect(shape_RequiredB0(11)).toEqual(11);
        expect(() => shape_RequiredB0()).toThrow('Validation failed for value "undefined" because the value is required.');
        let shape_RequiredB1 = Gubu(Open(Required({ x: 1 })));
        expect(shape_RequiredB1({ x: 2 })).toEqual({ x: 2 });
        expect(shape_RequiredB1({ x: 2, y: 3 })).toEqual({ x: 2, y: 3 });
        expect(() => shape_RequiredB1()).toThrow('Validation failed for value "undefined" because the value is required.');
        let shape_RequiredB2 = Gubu(Open({ x: 1 }).Required());
        expect(shape_RequiredB2({ x: 2 })).toEqual({ x: 2 });
        expect(shape_RequiredB2({ x: 2, y: 3 })).toEqual({ x: 2, y: 3 });
        expect(() => shape_RequiredB2()).toThrow('Validation failed for value "undefined" because the value is required.');
        // TODO: update docs - need better example where one prop differentiates
        let shape_SomeB0 = Gubu(Some({ x: 1 }, { y: 2 }));
        expect(shape_SomeB0({ x: 1 })).toEqual({ x: 1 });
        expect(shape_SomeB0({ y: 2 })).toEqual({ y: 2 });
        expect(() => shape_SomeB0({ x: 11, y: 22 })).toThrow('Value "{x:11,y:22}" for property "" does not satisfy any of: {"x":1}, {"y":2}');
        expect(() => shape_SomeB0({ x: true, y: 2 })).toThrow('any of');
        expect(() => shape_SomeB0({ x: 1, y: true })).toThrow('any of');
        expect(() => shape_SomeB0({ x: true, y: true })).toThrow(`Value "{x:true,y:true}" for property "" does not satisfy any of: {"x":1}, {"y":2}`);
        // TODO: more complex objects
        /*
        let shape_ValueB0 = Gubu(Value(Number, {}))
        expect(shape_ValueB0({ x: 10 })).toEqual({ x: 10 })
        expect(shape_ValueB0({ x: 10, y: 11 })).toEqual({ x: 10, y: 11 })
        expect(() => shape_ValueB0({ x: true })).toThrow('Validation failed for property "x" with boolean "true" because the boolean is not of type number.')
    
        let shape_ValueB1 = Gubu({
          page: Value(
            {
              title: String,
              template: 'standard'
            },
            {
              home: {
                title: 'Home',
                template: 'home'
              },
              sitemap: {
                title: 'Site Map',
                template: 'sitemap'
              },
            })
        })
    
        expect(shape_ValueB1({
          page: {
            about: {
              title: 'About'
            },
            contact: {
              title: 'Contact'
            }
          }
        })).toEqual({
          page: {
            about: {
              template: 'standard',
              title: 'About',
            },
            contact: {
              template: 'standard',
              title: 'Contact',
            },
            home: {
              template: 'home',
              title: 'Home',
            },
            sitemap: {
              template: 'sitemap',
              title: 'Site Map',
            },
          },
        })
        */
    });
    test('type-default-optional', () => {
        let f0 = () => true;
        let g0 = Gubu({
            string: 's',
            number: 1,
            boolean: true,
            object: { x: 2 },
            array: [3],
            function: G$({ t: 'function', v: f0, f: f0 })
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
        expect(() => e0({ s0: 1 })).toThrow(/Validation failed for property "s0" with number "1" because the number is not of type string\./);
        expect(() => e0({ s1: 1 })).toThrow(/Validation failed for property "s0" with value "undefined" because the value is required\.\nValidation failed for property "s1" with number "1" because the number is not of type string\./);
    });
    test('type-native-optional', () => {
        let { Skip } = Gubu;
        // Explicit Skip over native type sets no value.
        let g0 = Gubu({
            string: Skip(String),
            number: Skip(Number),
            boolean: Skip(Boolean),
            object: Skip(Object),
            array: Skip(Array),
            function: Skip(Function),
        });
        expect(g0({})).toEqual({});
    });
    test('array-repeating-elements', () => {
        let g0 = Gubu({
            a: [String]
        });
        expect(g0({ a: [] })).toEqual({ a: [] });
        expect(g0({ a: ['X'] })).toEqual({ a: ['X'] });
        expect(g0({ a: ['X', 'Y'] })).toEqual({ a: ['X', 'Y'] });
        expect(g0({ a: ['X', 'Y', 'Z'] })).toEqual({ a: ['X', 'Y', 'Z'] });
        expect(() => g0({ a: [null] })).toThrow(/"a.0".*"null".*type string/);
        expect(() => g0({ a: [''] })).toThrow('Validation failed for index "a.0" with string "" because an empty string is not allowed.');
        expect(() => g0({ a: [11] })).toThrow(/"a.0".*"11".*type string/);
        expect(() => g0({ a: ['X', 11] })).toThrow(/"a.1".*"11".*type string/);
        expect(() => g0({ a: ['X', 'Y', 11] })).toThrow(/"a.2".*"11".*type string/);
        expect(() => g0({ a: ['X', 'Y', 'Z', 11] })).toThrow(/"a.3".*"11".*type string/);
        expect(() => g0({ a: ['X', null] })).toThrow(/"a.1".*"null".*type string/);
        expect(() => g0({ a: ['X', ''] })).toThrow('Validation failed for index "a.1" with string "" because an empty string is not allowed.');
        expect(() => g0({ a: [11, 'K'] })).toThrow(/"a.0".*"11".*string/);
        expect(() => g0({ a: ['X', 11, 'K'] })).toThrow(/"a.1".*"11".*string/);
        expect(() => g0({ a: ['X', 'Y', 11, 'K'] })).toThrow(/"a.2".*"11".*string/);
        expect(() => g0({ a: ['X', 'Y', 'Z', 11, 'K'] })).toThrow(/"a.3".*"11".*string/);
        expect(() => g0({ a: [22, 'Y', 11, 'K'] })).toThrow(/"a.0".*"22".*"a.2".*"11"/s);
        expect(() => g0({ a: ['X', 'Y', 'Z', 11, 'K', 'L'] })).toThrow(/"a.3".*"11"/);
        // Zero or more elements of shape.
        let g1 = Gubu([String]);
        expect(g1(['X', 'Y'])).toEqual(['X', 'Y']);
        expect(() => g1(['X', 1])).toThrow(/Validation failed for index "1" with number "1" because the number is not of type string\./);
        // Empty array means any element
        let g2 = Gubu([]);
        expect(g2()).toEqual([]);
        expect(g2([])).toEqual([]);
        expect(g2([1])).toEqual([1]);
        expect(g2([1, 'a'])).toEqual([1, 'a']);
        expect(g2([1, 'a', true])).toEqual([1, 'a', true]);
        expect(g2([, 1, 'a', true])).toEqual([undefined, 1, 'a', true]);
        expect(g2([null, 1, , 'a', true])).toEqual([null, 1, undefined, 'a', true]);
        expect(g2([null, 1, , 'a', true])).toEqual([null, 1, undefined, 'a', true]);
        // Required with single element is redundant
        let g3 = Gubu([Required({ x: 1 })]);
        expect(g3([{ x: 11 }])).toEqual([{ x: 11 }]);
        expect(g3([{ x: 11 }, { x: 22 }])).toEqual([{ x: 11 }, { x: 22 }]);
        expect(g3([])).toEqual([]);
        expect(g3()).toEqual([]);
        // Single element is the same as Value(...)
        let g4 = Gubu([Number]);
        expect(g4()).toEqual([]);
        expect(g4([])).toEqual([]);
        expect(g4([1])).toEqual([1]);
        expect(g4([1, 2])).toEqual([1, 2]);
        expect(g4([1, 2, 3])).toEqual([1, 2, 3]);
        expect(() => g4(['a'])).toThrow('Validation failed for index "0" with string "a" because the string is not of type number.');
        expect(() => g4([1, 'a'])).toThrow('Validation failed for index "1" with string "a" because the string is not of type number.');
        expect(() => g4([1, 2, 'a'])).toThrow('Validation failed for index "2" with string "a" because the string is not of type number.');
        /*
        let g4v = Gubu(Value(Number, []))
        expect(g4v()).toEqual([])
        expect(g4v([])).toEqual([])
        expect(g4v([1])).toEqual([1])
        expect(g4v([1, 2])).toEqual([1, 2])
        expect(g4v([1, 2, 3])).toEqual([1, 2, 3])
        expect(() => g4v(['a'])).toThrow('Validation failed for index "0" with string "a" because the string is not of type number.')
        expect(() => g4v([1, 'a'])).toThrow('Validation failed for index "1" with string "a" because the string is not of type number.')
        expect(() => g4v([1, 2, 'a'])).toThrow('Validation failed for index "2" with string "a" because the string is not of type number.')
    
        // Value overrides single element
    
        let g4vo = Gubu(Value(Number, [String]))
        expect(g4vo()).toEqual([])
        expect(g4vo([])).toEqual([])
        expect(g4vo([1])).toEqual([1])
        expect(g4vo([1, 2])).toEqual([1, 2])
        expect(g4vo([1, 2, 3])).toEqual([1, 2, 3])
        expect(() => g4vo(['a'])).toThrow('Validation failed for index "0" with string "a" because the string is not of type number.')
        expect(() => g4vo([1, 'a'])).toThrow('Validation failed for index "1" with string "a" because the string is not of type number.')
        expect(() => g4vo([1, 2, 'a'])).toThrow('Validation failed for index "2" with string "a" because the string is not of type number.')
        */
        // NOTE: array without spec can hold anything.
        let g6 = Gubu([]);
        expect(g6([null, 1, 'x', true])).toEqual([null, 1, 'x', true]);
        let g7 = Gubu([Never()]);
        expect(g7([])).toEqual([]);
        expect(() => g7([1])).toThrow('Validation failed for index "0" with number "1" because no value is allowed.');
        expect(() => g7(new Array(1))).toThrow('Validation failed for index "0" with value "undefined" because no value is allowed.');
        let g8 = Gubu([1]);
        expect(g8(new Array(3))).toEqual([1, 1, 1]);
        let a0 = [11, 22, 33];
        delete a0[1];
        expect(g8(a0)).toEqual([11, 1, 33]);
        let g9 = Gubu([null]);
        expect(g9([null, null])).toEqual([null, null]);
        let g10 = Gubu([{ x: 1 }]);
        expect(g10([])).toEqual([]);
        expect(g10([{ x: 11 }])).toEqual([{ x: 11 }]);
        expect(g10([{ x: 11 }, { x: 22 }])).toEqual([{ x: 11 }, { x: 22 }]);
        expect(g10([{ x: 11 }, { x: 22 }, { x: 33 }]))
            .toEqual([{ x: 11 }, { x: 22 }, { x: 33 }]);
        expect(() => g10(['q'])).toThrow(/"0".*"q".*type object/);
        expect(() => g10([{ x: 11 }, 'q'])).toThrow(/"1".*"q".*type object/);
        expect(() => g10([{ x: 11 }, { y: 22 }, 'q'])).toThrow(/"2".*"q".*type object/);
        expect(() => g10([{ x: 11 }, { y: 22 }, { z: 33 }, 'q'])).toThrow(/"3".*"q".*type object/);
        expect(() => g10(['q', { k: 99 }])).toThrow(/"0".*"q".*type object/);
        expect(() => g10([{ x: 11 }, 'q', { k: 99 }])).toThrow(/"1".*"q".*type object/);
        expect(() => g10([{ x: 11 }, { y: 22 }, 'q', { k: 99 }]))
            .toThrow(/"2".*"q".*type object/);
        expect(() => g10([{ x: 11 }, { y: 22 }, { z: 33 }, 'q', { k: 99 }]))
            .toThrow(/"3".*"q".*type object/);
    });
    test('array-closed', () => {
        // Exact set of elements.
        let g2 = Gubu([{ x: 1 }, { y: true }]);
        expect(g2([{ x: 2 }, { y: false }])).toEqual([{ x: 2 }, { y: false }]);
        expect(() => g2([{ x: 2 }, { y: false }, 'Q'])).toThrow('Validation failed for array "[{x:2},{y:false},Q]" because the index "2" is not allowed.');
        expect(() => g2([{ x: 'X' }, { y: false }])).toThrow('Validation failed for property "0.x" with string "X" because the string is not of type number.');
        expect(() => g2(['Q', { y: false }])).toThrow('Validation failed for index "0" with string "Q" because the string is not of type object.');
        expect(g2([{ x: 2 }])).toEqual([{ x: 2 }, { y: true }]);
        expect(g2([{ x: 2 }, undefined])).toEqual([{ x: 2 }, { y: true }]);
        expect(g2([undefined, { y: false }])).toEqual([{ x: 1 }, { y: false }]);
        expect(g2([, { y: false }])).toEqual([{ x: 1 }, { y: false }]);
        let g3 = Gubu(Closed([Any()]));
        expect(g3([])).toEqual([]);
        expect(g3([1])).toEqual([1]);
        expect(() => g3([1, 'x'])).toThrow('not allowed');
        expect(g3(new Array(1))).toEqual([undefined]);
        expect(() => g3(new Array(2))).toThrow('not allowed');
        let g4 = Gubu(Closed([1]));
        expect(g4([])).toEqual([1]);
        expect(g4([1])).toEqual([1]);
        expect(() => g4(['a'])).toThrow('type');
        expect(() => g4([1, 2])).toThrow('not allowed');
        expect(g4(new Array(1))).toEqual([1]);
        expect(() => g4(new Array(2))).toThrow('not allowed');
        let g5 = Gubu(Closed([Number]));
        expect(() => g5([])).toThrow('required');
        expect(g5([1])).toEqual([1]);
        expect(() => g5(['a'])).toThrow('type');
        expect(() => g5([1, 2])).toThrow('not allowed');
        expect(() => g5(new Array(1))).toThrow('required');
        expect(() => g5(new Array(2))).toThrow('not allowed');
        let g6 = Gubu(Closed([Number, String, Boolean]));
        expect(g6([1, 'a', true])).toEqual([1, 'a', true]);
        expect(g6([0, 'b', false])).toEqual([0, 'b', false]);
        expect(() => g6([0, 'b', false, 1])).toThrow('not allowed');
        expect(() => g6(['a'])).toThrow('type');
        expect(() => g6([1, 2])).toThrow('required');
        expect(() => g6(new Array(0))).toThrow('required');
        expect(() => g6(new Array(1))).toThrow('required');
        expect(() => g6(new Array(2))).toThrow('required');
        expect(() => g6(new Array(3))).toThrow('required');
        expect(() => g6(new Array(4))).toThrow('not allowed');
        let g7 = Gubu(Closed([1, 'a']));
        expect(g7([])).toEqual([1, 'a']);
        expect(g7([, 'b'])).toEqual([1, 'b']);
    });
    test('object-properties', () => {
        // NOTE: unclosed object without props can hold anything
        let g0 = Gubu({});
        expect(g0({ a: null, b: 1, c: 'x', d: true }))
            .toEqual({ a: null, b: 1, c: 'x', d: true });
        let g1 = Gubu(Closed({}));
        expect(g1({})).toEqual({});
        expect(() => g1({ a: null, b: 1, c: 'x', d: true })).toThrow('Validation failed for object "{a:null,b:1,c:x,d:true}" because the properties "a, b, c, d" are not allowed.');
    });
    test('check-basic', () => {
        let g0 = Gubu({ a: Check((v) => v > 10) });
        expect(g0({ a: 11 })).toMatchObject({ a: 11 });
        expect(() => g0({ a: 9 })).toThrow('Validation failed for property "a" with number "9" because check "(v) => v > 10" failed.');
    });
    test('custom-basic', () => {
        let g0 = Gubu({ a: Check((v) => v > 10) });
        expect(g0({ a: 11 })).toMatchObject({ a: 11 });
        expect(() => g0({ a: 9 })).toThrow('Validation failed for property "a" with number "9" because check "(v) => v > 10" failed.');
        let g1 = Gubu({ a: Skip(Check((v) => v > 10)) });
        expect(g1({ a: 11 })).toMatchObject({ a: 11 });
        expect(() => g1({ a: 9 })).toThrow('Validation failed for property "a" with number "9" because check "(v) => v > 10" failed.');
        expect(g1({})).toMatchObject({});
        let g2 = Gubu({ a: Required(Check((v) => v > 10)) });
        expect(g1({ a: 11 })).toMatchObject({ a: 11 });
        expect(() => g2({ a: 9 })).toThrow('Validation failed for property "a" with number "9" because check "(v) => v > 10" failed.');
        expect(() => g2({}))
            .toThrow('Validation failed for property "a" with value "undefined" because the value is required.');
        let g3 = Gubu(Check((v) => v > 10));
        expect(g3(11)).toEqual(11);
        expect(() => g3(9)).toThrow('Validation failed for number "9" because check "(v) => v > 10" failed.');
    });
    test('custom-modify', () => {
        let g0 = Gubu({
            a: (Skip(Check((v, u) => (u.val = v * 2, true)))),
            b: Skip(Check((_v, u) => {
                u.err = 'BAD VALUE $VALUE AT $PATH';
                return false;
            })),
            c: Skip(Check((v, u, s) => (u.val = (v ? v + ` (key=${s.key})` : undefined), true))),
            d: Skip(Check((_v, u, _s) => (u.val = undefined, true)))
        });
        expect(g0({ a: 3 })).toEqual({ a: 6 });
        expect(() => g0({ b: 1 })).toThrow('BAD VALUE 1 AT b');
        expect(g0({ c: 'x' })).toEqual({ c: 'x (key=c)' });
        expect(g0({ d: 'D' })).toEqual({ d: 'D' });
        let g1 = Gubu(Open({
            a: Skip(Check((_v, u, _s) => (u.uval = undefined, true)))
        }));
        expect(g1({ a: 'A' })).toEqual({ a: undefined });
        expect(g1({ a: 'A', b: undefined })).toEqual({ a: undefined });
    });
    test('after-multiple', () => {
        let g0 = Gubu(After(function v1(v, u) { u.val = v + 1; return true; }, After(function v2(v, u) { u.val = v * 2; return true; }, Number)));
        expect(g0(1)).toEqual(3);
        expect(g0(2)).toEqual(5);
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
        let a1 = Gubu([Number, String]);
        expect(() => a1()).toThrow('required');
        expect(() => a1([])).toThrow('required');
        expect(() => a1([1])).toThrow('required');
        expect(a1([1, 'x'])).toMatchObject([1, 'x']);
        expect(() => a1([1, 'x', 'y'])).toThrow('not allowed');
        expect(() => a1(['x', 'y'])).toThrow('Validation failed for index "0" with string "x" because the string is not of type number.');
        expect(() => a1([1, 2])).toThrow('Validation failed for index "1" with number "2" because the number is not of type string.');
        let a2 = Gubu([9, String]);
        expect(() => a2()).toThrow('required');
        expect(() => a2([])).toThrow('required');
        expect(() => a2([1])).toThrow('required');
        expect(a2([1, 'x'])).toMatchObject([1, 'x']);
        expect(() => a2([1, 'x', 'y'])).toThrow('not allowed');
        expect(() => a2(['x', 1])).toThrow(`Validation failed for index "0" with string "x" because the string is not of type number.
Validation failed for index "1" with number "1" because the number is not of type string.`);
        expect(() => a2(['x', 'y'])).toThrow('Validation failed for index "0" with string "x" because the string is not of type number.');
        let a3 = Gubu([1, 2, 3]);
        expect(a3()).toEqual([1, 2, 3]);
        expect(a3([])).toEqual([1, 2, 3]);
        expect(a3([11])).toEqual([11, 2, 3]);
        expect(a3([11, 22])).toEqual([11, 22, 3]);
        expect(a3([11, 22, 33])).toMatchObject([11, 22, 33]);
        expect(() => a3([11, 22, 33, 44])).toThrow('not allowed');
        expect(a3([undefined, 22, 33])).toMatchObject([1, 22, 33]);
        expect(a3([undefined, undefined, 33])).toMatchObject([1, 2, 33]);
        expect(a3([undefined, undefined, undefined])).toMatchObject([1, 2, 3]);
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
    test('context-basic', () => {
        let c0 = { max: 10 };
        let g0 = Gubu({
            a: Check((v, _u, s) => v < s.ctx.max)
        });
        expect(g0({ a: 2 }, c0)).toMatchObject({ a: 2 });
        expect(() => g0({ a: 11 }, c0)).toThrow('Validation failed for property "a" with number "11" because check "(v, _u, s) => v < s.ctx.max" failed.');
        let g1 = Gubu({
            a: { b: All(Number, Check((v, _u, s) => v < s.ctx.max)) }
        });
        expect(g1({ a: { b: 3 } }, c0)).toMatchObject({ a: { b: 3 } });
        expect(() => g1({ a: { b: 11 } }, c0)).toThrow('Value "11" for property "a.b" does not satisfy all of: Number, (v, _u, s) => v < s.ctx.max');
    });
    test('error-path', () => {
        let g0 = Gubu({ a: { b: String } });
        expect(g0({ a: { b: 'x' } })).toEqual({ a: { b: 'x' } });
        expect(() => g0(1)).toThrow('not of type object');
        expect(() => g0({ a: 1 })).toThrow('property "a"');
        expect(() => g0({ a: { b: 1 } })).toThrow('property "a.b"');
        expect(() => g0({ a: { b: { c: 1 } } })).toThrow('property "a.b"');
        let g1 = Gubu(String);
        expect(g1('x')).toEqual('x');
        expect(() => g1(1)).toThrow('for number ');
        expect(() => g1(true)).toThrow('for boolean ');
        expect(() => g1(null)).toThrow('for value ');
        expect(() => g1(undefined)).toThrow('for value ');
        expect(() => g1([])).toThrow('for array ');
        expect(() => g1({})).toThrow('for object ');
        expect(() => g1(new Date())).toThrow('for object ');
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
                t: 'Validation failed for number "1" because the number is not of type nan.'
            }]);
        try {
            g0(1, { a: 'A' });
        }
        catch (e) {
            expect(e.message).toEqual('Validation failed for number "1" because the number is not of type nan.');
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
                        c: 'none',
                        a: {},
                        m: 1050,
                        t: 'Validation failed for number "1" because the number is not of type nan.'
                    }
                ]
            });
            expect(JSON.stringify(e)).toEqual('{"gubu":true,"name":"GubuError","code":"shape","prefix":"","props":[{"path":"","what":"type","type":"nan","value":1}],"err":[{"n":{"$":{"v$":"' + package_json_1.default.version + '"},"t":"nan","v":null,"f":null,"n":0,"r":false,"p":false,"d":0,"k":[],"e":true,"u":{},"a":[],"b":[],"m":{}},"v":1,"p":"","w":"type","c":"none","a":{},"m":1050,"t":"Validation failed for number \\"1\\" because the number is not of type nan.","u":{}}],"message":"Validation failed for number \\"1\\" because the number is not of type nan."}');
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
        expect(g0.spec()).toMatchObject({ d: 0, p: false, r: true, t: 'number', v: 1 });
        let g1 = Gubu(Required({ a: 1 }));
        expect(g1.spec()).toMatchObject({
            d: 0, p: false, r: true, t: 'object', v: {
                a: { d: 1, p: false, r: false, t: 'number', v: 1 }
            }
        });
        let g2 = Gubu(Required({ a: Required(1) }));
        expect(g2.spec()).toMatchObject({
            d: 0, p: false, r: true, t: 'object', v: {
                a: { d: 1, p: false, r: true, t: 'number', v: 1 }
            }
        });
        let g3 = Gubu(Required({ a: Required({ b: 1 }) }));
        expect(g3.spec()).toMatchObject({
            d: 0, p: false, r: true, t: 'object', v: {
                a: {
                    d: 1, p: false, r: true, t: 'object', v: {
                        b: {
                            d: 2, p: false, r: false, t: 'number', v: 1
                        }
                    }
                }
            }
        });
        let g4 = Gubu(Required({ a: Skip({ b: 1 }) }));
        expect(g4.spec()).toMatchObject({
            d: 0, p: false, r: true, t: 'object', v: {
                a: {
                    d: 1, p: true, r: false, t: 'object', v: {
                        b: {
                            d: 2, p: false, r: false, t: 'number', v: 1
                        }
                    }
                }
            }
        });
        let g5 = Gubu(Skip({ a: Required({ b: 1 }) }));
        expect(g5.spec()).toMatchObject({
            d: 0, p: true, r: false, t: 'object', v: {
                a: {
                    d: 1, p: false, r: true, t: 'object', v: {
                        b: {
                            d: 2, p: false, r: false, t: 'number', v: 1
                        }
                    }
                }
            }
        });
    });
    test('spec-compose', () => {
        let f0 = (v) => 1 === v;
        let c0 = Gubu(Check(f0));
        let c1 = Gubu(Skip(Check(f0)));
        // TODO
        let c2 = Gubu(Skip(c0));
        expect(c0.spec()).toMatchObject({
            t: 'any',
            n: 0,
            r: true,
            p: false,
            d: 0,
            u: {},
            a: [],
            b: ['f0'],
            s: 'f0'
        });
        expect(c1.spec()).toMatchObject({
            t: 'any',
            n: 0,
            r: false,
            p: true,
            d: 0,
            u: {},
            a: [],
            b: ['f0'],
            s: 'f0'
        });
        expect(c2.spec()).toMatchObject({
            t: 'any',
            n: 0,
            r: false,
            p: true,
            d: 0,
            u: {},
            a: [],
            b: ['f0'],
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
            p: false,
            t: 'object',
            u: {},
            a: [],
            b: [],
            n: 1,
            e: true,
            k: ['a'],
            m: {},
            v: {
                a: {
                    $: {
                        gubu$: true,
                        v$: package_json_1.default.version,
                    },
                    d: 1,
                    e: true,
                    r: false,
                    k: [],
                    p: false,
                    t: 'number',
                    u: {},
                    a: [],
                    b: [],
                    f: 1,
                    v: 1,
                    n: 0,
                    m: {},
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
            p: false,
            t: 'object',
            u: {},
            a: [],
            b: [],
            n: 1,
            e: true,
            k: ['a'],
            m: {},
            v: {
                a: {
                    $: {
                        gubu$: true,
                        v$: package_json_1.default.version,
                    },
                    d: 1,
                    r: false,
                    p: false,
                    t: 'array',
                    u: {},
                    a: [],
                    b: [],
                    v: {},
                    n: 0,
                    e: true,
                    k: [],
                    m: {},
                    c: {
                        $: {
                            gubu$: true,
                            v$: package_json_1.default.version,
                        },
                        d: 2,
                        r: false,
                        p: false,
                        t: 'number',
                        u: {},
                        a: [],
                        b: [],
                        f: 1,
                        v: 1,
                        n: 0,
                        e: true,
                        k: [],
                        m: {},
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
        const shape = Gubu({ a: Gubu({ x: Number }) });
        expect(shape({ a: { x: 1 } })).toEqual({ a: { x: 1 } });
        let c0 = Gubu(String);
        let c1 = Gubu(Skip(String));
        let c2 = Gubu(Skip(c0));
        expect(c1.spec()).toMatchObject(c2.spec());
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
        expect(stringify({ a: Number })).toEqual('{"a":"Number"}');
        expect(stringify({ a: String })).toEqual('{"a":"String"}');
        expect(stringify({ a: Boolean })).toEqual('{"a":"Boolean"}');
        expect(stringify(Gubu({ a: Number }).spec())).toEqual('{"a":"number"}');
        expect(stringify(Gubu({ a: String }).spec())).toEqual('{"a":"string"}');
        expect(stringify(Gubu({ a: Boolean }).spec())).toEqual('{"a":"boolean"}');
        expect(stringify(Required())).toEqual(`"any"`);
        let c0 = {};
        c0.x = c0;
        expect(stringify(c0)).toEqual('"[object Object]"');
        function f0() { }
        class C0 {
        }
        expect(stringify([1, f0, () => true, C0])).toEqual('[1,"f0","() => true","C0"]');
        expect(stringify(/a/)).toEqual('"/a/"');
    });
    test('nodize', () => {
        expect(nodize(1)).toMatchObject({
            a: [],
            b: [],
            d: -1,
            n: 0,
            p: false,
            r: false,
            t: "number",
            u: {},
            v: 1,
        });
    });
    test('G-basic', () => {
        expect(G$({ v: 11 })).toMatchObject({
            '$': { v$: package_json_1.default.version },
            t: 'number',
            v: 11,
            r: false,
            p: false,
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
            p: false,
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
            p: false,
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
            p: false,
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
            p: false,
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
    // Test compat with https://github.com/rjrodger/optioner
    test('legacy-optioner-compat', () => {
        // TODO:
        // * verbatim arrays - maybe use Exact?
        // * option: treat null same as undefined
        // * option: treat functon as raw default value
        // ** thus need a builder for validation functions
        // ** and a builder for raw functions
        // * Do Array, Object work?
        // * default value within One, Some, etc
        // 'happy'
        let opter = Gubu({
            a: 1,
            b: { c: 2 },
            d: { e: { f: 3 } },
            g: null,
            h: 4,
            i: [5, 6],
            j: Closed([{ k: 7 }]),
        });
        expect(opter()).toEqual({
            a: 1,
            b: { c: 2 },
            d: { e: { f: 3 } },
            g: null,
            h: 4,
            i: [5, 6],
            j: [{ k: 7 }],
        });
        // 'empty'
        opter = Gubu({ a: 1 });
        expect(opter(undefined)).toEqual({ a: 1 });
        // TODO: OPT: expect(opter(null)).toEqual({ a: 1 })
        // 'array'
        opter = Gubu([1, 'a']);
        expect(() => opter({})).toThrow('not of type array');
        expect(opter([])).toEqual([1, 'a']);
        expect(opter([1])).toEqual([1, 'a']);
        let fx = function f(x) {
            return x + 1;
        };
        opter = Gubu({
            a: G$({ v: fx, f: fx })
        });
        let o0 = opter({});
        expect(o0.a(1)).toEqual(2);
        let o1 = opter({
            a: function (x) {
                return x + 2;
            }
        });
        expect(o1.a(1)).toEqual(3);
        // 'edge'
        opter = Gubu({
            a: undefined,
        });
        expect(opter({})).toEqual({});
        // 'default-types'
        opter = Gubu({
            a: 1,
            b: 1.1,
            c: 'x',
            d: true,
        });
        expect(opter({ a: 2, b: 2.2, c: 'y', d: false })).toEqual({ a: 2, b: 2.2, c: 'y', d: false });
        // TODO: SHAPE: Integer
        // expect(() => opter({ a: 3.3 })).toThrow('integer')
        expect(opter({ b: 4 })).toEqual({ a: 1, b: 4, c: 'x', d: true });
        expect(() => opter({ b: 'z' })).toThrow('number');
        expect(() => opter({ c: 1 })).toThrow('string');
        expect(() => opter({ d: 'q' })).toThrow('boolean');
        // 'readme'
        let optioner = Gubu({
            color: 'red',
            // size: Joi.number().integer().max(5).min(1).default(3),
            size: Max(5, Min(1, 3)),
            range: [100, 200],
        });
        expect(optioner({ size: 2 })).toEqual({ color: 'red', size: 2, range: [100, 200] });
        expect(optioner({})).toEqual({ color: 'red', size: 3, range: [100, 200] });
        expect(optioner({ range: [50] })).toEqual({ range: [50, 200], color: 'red', size: 3 });
        expect(() => optioner({ size: 6 })).toThrow('maximum');
        // 'check'
        optioner = Gubu({
            bool: true
        });
        expect(optioner({})).toEqual({ bool: true });
        expect(optioner({ bool: true })).toEqual({ bool: true });
        expect(optioner({ bool: false })).toEqual({ bool: false });
        try {
            optioner({ bool: 'foo' });
            throw new Error('fail');
        }
        catch (e) {
            expect(e.name).toMatch(/GubuError/);
        }
        // 'ignore'
        let optioner_ignore = Gubu(Open({
            a: 1,
        }));
        expect(optioner_ignore({})).toEqual({ a: 1 });
        expect(optioner_ignore({ b: 2 })).toEqual({ a: 1, b: 2 });
        expect(optioner_ignore({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
        let optioner_fail = Gubu(Closed({
            a: 1,
        }));
        expect(optioner_fail({})).toEqual({ a: 1 });
        try {
            optioner_fail({ a: 1, b: 2 });
            throw new Error('fail');
        }
        catch (e) {
            expect(e.name).toMatch(/GubuError/);
        }
        let optioner_ignore_deep = Gubu(Open({
            a: 1,
            b: Open({ c: 2 }),
        }));
        expect(optioner_ignore_deep({})).toEqual({ a: 1, b: { c: 2 } });
        expect(optioner_ignore_deep({ b: { d: 3 } })).toEqual({
            a: 1,
            b: { c: 2, d: 3 },
        });
        let optioner_ignore_deep_fail = Gubu({
            a: 1,
            b: Closed({ c: 2 }),
        });
        expect(optioner_ignore_deep_fail({})).toEqual({ a: 1, b: { c: 2 } });
        try {
            expect(optioner_ignore_deep_fail({ b: { d: 3 } })).toEqual({
                a: 1,
                b: { c: 2, d: 3 },
            });
            throw new Error('fail');
        }
        catch (e) {
            expect(e.name).toMatch(/GubuError/);
        }
        // 'must_match'
        let g0 = Gubu({
            a: Exact(1),
        });
        expect(g0({ a: 1 })).toEqual({ a: 1 });
        expect(() => g0({ a: 1, b: 2 })).toThrow('not allowed');
        expect(() => g0({})).toThrow('exactly');
        expect(() => g0({ a: 2 })).toThrow('exactly');
        expect(() => g0({ a: 'x' })).toThrow('exactly');
        let g1 = Gubu(Open({
            a: Exact(1),
            b: Open({ c: Exact(2) }),
        }));
        expect(g1({ a: 1, b: { c: 2 } })).toEqual({ a: 1, b: { c: 2 } });
        expect(g1({ a: 1, b: { c: 2, z: 3 }, y: 4 })).toEqual({
            a: 1,
            b: { c: 2, z: 3 },
            y: 4,
        });
        expect(() => g1({ a: 1 })).toThrow('exactly');
        expect(() => g1({ a: 1, b: {} })).toThrow('exactly');
        expect(() => g1({ a: 1, b: { c: 'x' } })).toThrow('exactly');
        let g2 = Gubu({
            a: Exact(1),
            b: String
        });
        expect(g2({ a: 1, b: 'x' })).toEqual({ a: 1, b: 'x' });
        expect(() => g2({ a: 1, b: 2 })).toThrow('type');
        var g3 = Gubu({
            a: { b: { c: Exact(1) } },
        });
        expect(g3({ a: { b: { c: 1 } } })).toEqual({ a: { b: { c: 1 } } });
        expect(() => g3({ a: { b: { c: 2 } } })).toThrow('exactly');
        // TODO: fix
        // var g4 = Gubu(
        //   {
        //     a: [Exact(1)],
        //   },
        // )
        // expect(g4({ a: [1] })).toEqual({ a: [1] })
        // expect(g4({ a: [1, 2] })).toEqual({ a: [1, 2] })
        // expect(() => g4({ a: [2] })).toThrow('exactly')
        // var g5 = Gubu(
        //   {
        //     a: [Any(), { b: Exact(1) }],
        //   },
        // )
        // expect(g5({ a: [{ b: 1 }] })).toEqual({ a: [{ b: 1 }] })
        // expect(g5({ a: [{ b: 1, c: 2 }, { b: 3 }] })).toEqual({
        //   a: [{ b: 1, c: 2 }, { b: 3 }],
        // })
        // expect(() => g5({ a: [{ b: 11, c: 2 }, { b: 3 }] })).toThrow('exactly')
        // var g6 = Gubu([Never(), Exact(1)])
        // expect(g6([1])).toEqual([1])
        // expect(() => g6([2])).toThrow('exactly')
        var g7 = Gubu([{}, { a: Exact(2) }, {}]);
        expect(g7([{ a: 1 }, { a: 2 }, { a: 3 }])).toEqual([
            { a: 1 },
            { a: 2 },
            { a: 3 },
        ]);
        expect(() => g7([{ a: 1 }, { a: 3 }])).toThrow('exactly');
        // 'empty-string'
        let opt0 = Gubu({
            a: '',
            b: 'x',
        });
        let res0 = opt0({ a: 'x' });
        expect(res0).toEqual({ a: 'x', b: 'x' });
        let res1 = opt0({ a: '' });
        expect(res1).toEqual({ a: '', b: 'x' });
    });
    test('builder-as-property', () => {
        expect(Gubu.Skip()).toMatchObject(Skip());
    });
    test('skip-vs-any', () => {
        let a0 = Gubu({ x: Any() });
        let s0 = Gubu({ x: Skip() });
        expect(a0()).toEqual({});
        expect(s0()).toEqual({});
        expect(a0({})).toEqual({});
        expect(s0({})).toEqual({});
        expect(a0({ x: 1 })).toEqual({ x: 1 });
        expect(s0({ x: 1 })).toEqual({ x: 1 });
        expect(a0({ x: undefined })).toEqual({ x: undefined });
        expect(s0({ x: undefined })).toEqual({ x: undefined });
        let a1 = Gubu({ x: Required().Any() });
        let s1 = Gubu({ x: Required().Skip() });
        expect(() => a1()).toThrow('required');
        expect(s1()).toEqual({});
        expect(() => a1({})).toThrow('required');
        expect(s1({})).toEqual({});
        expect(a1({ x: 1 })).toEqual({ x: 1 });
        expect(s1({ x: 1 })).toEqual({ x: 1 });
        expect(() => a1({ x: undefined })).toThrow('required');
        expect(s1({ x: undefined })).toEqual({ x: undefined });
    });
    test('non-value-fails', () => {
        let g0 = Gubu({ x: Number });
        expect(() => g0({ x: null })).toThrow('Validation failed for property "x" with value "null" because the value is not of type number.');
        expect(() => g0({ x: undefined })).toThrow('Validation failed for property "x" with value "undefined" because the value is required.');
        expect(() => g0({ x: NaN })).toThrow('Validation failed for property "x" with value "NaN" because the value is not of type number.');
        expect(() => g0({})).toThrow('Validation failed for property "x" with value "undefined" because the value is required.');
        expect(() => g0({ x: '' })).toThrow('Validation failed for property "x" with string "" because the string is not of type number.');
    });
    test('frozen', () => {
        let g0 = Gubu({ x: Object });
        expect(g0({ x: { y: 1 } })).toEqual({ x: { y: 1 } });
        expect(g0({ x: Object.freeze({ y: 1 }) })).toEqual({ x: { y: 1 } });
    });
});

},{"../gubu":1,"../package.json":2,"./large":7,"./long":8}],7:[function(require,module,exports){

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

},{}],8:[function(require,module,exports){

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
    { a30: [Number], b30: [Number], },
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
    { a40: [40], b40: [40], },
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
  ],
  
}

},{}],9:[function(require,module,exports){
"use strict";
/* Copyright (c) 2021-2023 Richard Rodger and other contributors, MIT License */
Object.defineProperty(exports, "__esModule", { value: true });
// Handle web (Gubu) versus node ({Gubu}) export.
let GubuModule = require('../gubu');
if (GubuModule.Gubu) {
    GubuModule = GubuModule.Gubu;
}
const Gubu = GubuModule;
const buildize = Gubu.buildize;
const makeErr = Gubu.makeErr;
const { Above, After, All, Any, Before, Below, Check, Child, Closed, Default, Define, Empty, Exact, Func, Key, Len, Max, Min, Never, One, Open, Optional, Refer, Rename, Required, Skip, Some, } = Gubu;
describe('readme', () => {
    test('readme-optional', () => {
        let shape = Gubu(Optional(String));
        expect(shape()).toEqual('');
        expect(shape('a')).toEqual('a');
        expect(() => shape(1)).toThrow('type');
        shape = Gubu(Optional(Some(String, Number)));
        expect(shape('a')).toEqual('a');
        expect(shape(1)).toEqual(1);
        expect(shape()).toEqual(undefined); // Overrides Some
        shape = Gubu(Some(String, Number));
        expect(shape('a')).toEqual('a');
        expect(shape(1)).toEqual(1);
        expect(() => shape()).toThrow('satisfy');
    });
    test('readme-default', () => {
        let shape = Gubu(Default('none', String));
        expect(shape()).toEqual('none');
        expect(shape('a')).toEqual('a');
        expect(() => shape(1)).toThrow('type');
        shape = Gubu(Default({ a: null }, { a: Number }));
        expect(shape({ a: 1 })).toEqual({ a: 1 });
        expect(shape()).toEqual({ a: null });
        expect(() => shape({ a: 'x' })).toThrow('type');
    });
});

},{"../gubu":1}]},{},[5]);
