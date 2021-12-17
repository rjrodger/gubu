(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).Gubu=e()}}((function(){var e={},t=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(e,"__esModule",{value:!0}),e.Gubu=void 0;const n=t({name:"gubu",version:"0.0.4",description:"An object shape validation utility.",main:"gubu.js",browser:"gubu.min.js",type:"commonjs",types:"gubu.d.ts",homepage:"https://github.com/rjrodger/gubu",keywords:["gubu"],author:"Richard Rodger (http://richardrodger.com)",repository:{type:"git",url:"git://github.com/rjrodger/gubu.git"},scripts:{test:"jest --coverage","test-some":"jest -t","test-watch":"jest --coverage --watchAll","test-web":"npm run build-web && browserify -o test/web.js -e test/entry.js -im && open test/web.html",watch:"tsc -w -d",build:"tsc -d","build-web":"cp gubu.js gubu.min.js && browserify -o gubu.min.js -e gubu.web.js -s Gubu -im -p tinyify",clean:"rm -rf node_modules yarn.lock package-lock.json",reset:"npm run clean && npm i && npm test","repo-tag":"REPO_VERSION=`node -e \"console.log(require('./package').version)\"` && echo TAG: v$REPO_VERSION && git commit -a -m v$REPO_VERSION && git push && git tag v$REPO_VERSION && git push --tags;","repo-publish":"npm run clean && npm i && npm run repo-publish-quick","repo-publish-quick":"npm run build && npm run test && npm run build-web && npm run test-web && npm run repo-tag && npm publish --access public --registry https://registry.npmjs.org "},license:"MIT",engines:{node:">=12"},files:["*.ts","*.js","*.map","LICENSE"],devDependencies:{"@types/jest":"^27.0.3",jest:"^27.4.5","ts-jest":"^27.1.2",typescript:"^4.5.4",browserify:"^17.0.0",tinyify:"^3.0.0"},dependencies:{}}),r=Symbol.for("gubu$"),o={gubu$:r,v$:n.default.version};class i extends TypeError{constructor(e,t,n){super(t.map(e=>e.t).join("\n")),this.gubu=!0,this.name="GubuError",this.code=e,this.desc=()=>({name:"GubuError",code:e,err:t,ctx:n})}toJSON(){return{...this,err:this.desc().err,name:this.name,message:this.message}}}const u={String:!0,Number:!0,Boolean:!0,Object:!0,Array:!0,Function:!0,Symbol:!0,BigInt:!0},s={string:"",number:0,boolean:!1,object:{},array:[],function:()=>{},symbol:Symbol(""),bigint:BigInt(0),null:null};function l(e){var t,i,l,c,a,d;if(null!=e&&(null===(t=e.$)||void 0===t?void 0:t.gubu$)){if(r===e.$.gubu$)return e;if(!0===e.$.gubu$){let t={...e};return t.$={v$:n.default.version,...t.$,gubu$:r},t.v=null!=t.v&&"object"==typeof t.v?{...t.v}:t.v,t.t=t.t||typeof t.v,"function"===t.t&&u[t.v.name]&&(t.t=t.v.name.toLowerCase(),t.v=R(s[t.t])),t.k=null==t.k?"":t.k,t.r=!!t.r,t.o=!!t.o,t.d=null==t.d?-1:t.d,t.u=t.u||{},(null===(i=t.u.list)||void 0===i?void 0:i.specs)&&(t.u.list.specs=[...t.u.list.specs]),t}}let p=null===e?"null":typeof e,f=e,b=!1,v=void 0,y={};if("object"===(p="undefined"===p?"any":p))Array.isArray(e)?p="array":null!=f&&Function!==f.constructor&&Object!==f.constructor&&null!=f.constructor&&(p="instance",y.n=f.constructor.name,y.i=f.constructor);else if("function"===p)if(u[e.name])p=e.name.toLowerCase(),b=!0,f=R(s[p]);else if(e.gubu===o||!0===(null===(l=e.$)||void 0===l?void 0:l.gubu)){let t=e.spec?e.spec():e;p=t.t,f=t.v,b=t.r,y=t.u}else void 0===e.prototype&&Function===e.constructor||Function===(null===(c=e.prototype)||void 0===c?void 0:c.constructor)?(p="custom",v=f):(p="instance",b=!0,y.n=null===(d=null===(a=f.prototype)||void 0===a?void 0:a.constructor)||void 0===d?void 0:d.name,y.i=f);else"number"===p&&isNaN(f)&&(p="nan");let m={$:o,t:p,v:null==f||"object"!==p&&"array"!==p?f:{...f},r:b,o:!1,k:"",d:-1,u:y};return v&&(m.b=v),m}function c(e,t){const n=null==t?{}:t;n.name=null==n.name?(""+Math.random()).substring(2):""+n.name;let u=l({"":e}),s=function(e,t){var n,o,s,c;const d=t||{},p={"":e},f=[u,-1],b=[p,-1],y=[];let m,g,h=-1,j=2,I=0,$=-1,k=0,w=[];for(;;){for(m=f[I];+m;)m=f[I=m],h--;if($=I+1,g=b[I],!m)break;-1<h&&(y[h]=m.k),h++,k=0,I=j;let e=null==m.v?[]:Object.keys(m.v);if("array"===m.t){e=Object.keys(g);for(let t in m.v)"0"===t||e.includes(t)||e.splice(parseInt(t)-1,0,""+(parseInt(t)-1))}for(let t of e){y[h]=t;let e=g[t],i=typeof e;"number"===i&&isNaN(e)&&(i="nan");let u=m.v[t],p=null;if("array"===m.t){let e=""+(parseInt(t)+1);void 0!==(u=m.v[e])&&(p=u=r===(null===(n=u.$)||void 0===n?void 0:n.gubu$)?u:m.v[e]=l(u)),void 0===u&&(u=m.v[0],t="0",void 0===u&&(u=m.v[0]=v()),p=null===u?l(u):r===(null===(o=u.$)||void 0===o?void 0:o.gubu$)?u:m.v[t]=l(u))}else p=null!=u&&r===(null===(s=u.$)||void 0===s?void 0:s.gubu$)?u:m.v[t]=l(u);p.k=t,p.d=h;let O,N="",A=0;"list"===p.t?(O=p.u.list.specs,N=p.u.list.kind):O=[p];let E=[];for(let n=0;n<O.length;n++){let o=O[n],u=(o=r===(null===(c=o.$)||void 0===c?void 0:c.gubu$)?o:O[n]=l(o)).t,s=!0,p=!1;if(o.b){let n=a(o.b,e,{dI:h,nI:j,sI:$,pI:I,cN:k,key:t,node:o,src:g,nodes:f,srcs:b,path:y,terr:E,err:w,ctx:d});s=n.pass,void 0!==n.val&&(e=g[t]=n.val),void 0!==n.node&&(o=n.node),void 0!==n.type&&(u=n.type),void 0!==n.done&&(p=n.done),j=void 0===n.nI?j:n.nI,$=void 0===n.sI?$:n.sI,I=void 0===n.pI?I:n.pI,k=void 0===n.cN?k:n.cN}if(p||("none"===u?E.push(S("none",e,y,h,o,1070)):"object"===u?o.r&&void 0===e?E.push(S("required",e,y,h,o,1010)):void 0===e||null!==e&&"object"===i&&!Array.isArray(e)?null==g[t]&&o.o||(f[j]=o,b[j]=g[t]=g[t]||{},j++,k++):E.push(S("type",e,y,h,o,1020)):"array"===u?o.r&&void 0===e?E.push(S("required",e,y,h,o,1030)):void 0===e||Array.isArray(e)?null==g[t]&&o.o||(f[j]=o,b[j]=g[t]=g[t]||[],j++,k++):E.push(S("type",e,y,h,o,1040)):"any"===u||"custom"===u||void 0===e||u===i||"instance"===u&&o.u.i&&e instanceof o.u.i||"null"===u&&null===e?void 0===e?o.r?(E.push(S("required",e,y,h,o,1060)),s=!1):void 0===o.v||o.o||(g[t]=o.v):"string"===u&&""===e&&(o.r&&!o.u.empty?E.push(S("required",e,y,h,o,1080)):o.u.empty||(g[t]=o.v)):(E.push(S("type",e,y,h,o,1050)),s=!1)),o.a){let n=a(o.a,e,{dI:h,nI:j,sI:$,pI:I,cN:k,key:t,node:o,src:g,nodes:f,srcs:b,path:y,terr:E,err:w,ctx:d});s=n.pass,void 0!==n.val&&(e=g[t]=n.val),j=void 0===n.nI?j:n.nI,$=void 0===n.sI?$:n.sI,I=void 0===n.pI?I:n.pI,k=void 0===n.cN?k:n.cN}if(s){if("one"===N)break}else if(A++,"all"===N)break}0<E.length&&("one"!==N&&"some"!==N||!(A<O.length))&&w.push(...E)}0<k?f[j++]=$:(I=$,h--)}if(0<w.length){if(!d.err)throw new i("shape",w,d);d.err.push(...w)}return p[""]};return s.spec=()=>(s(void 0,{err:[]}),JSON.parse(E(u.v[""],(e,t)=>r===t||t))),s.toString=()=>`[Gubu ${n.name}]`,s.gubu=o,s}function a(e,t,n){let r={pass:!0,done:!1};if((void 0!==t||n.node.r)&&(!e(t,r,n)||r.err)){let e=r.why||"custom",o=d(n.path,n.dI);"object"==typeof r.err?n.terr.push(...[r.err].flat().map(e=>(e.p=null==e.p?o:e.p,e.m=null==e.m?2010:e.m,e))):n.terr.push(S(e,t,n.path,n.dI,n.node,1040)),r.pass=!1}return r}function d(e,t){return e.slice(1,t+1).filter(e=>null!=e).join(".")}const p=function(e){let t=N(this,e);return t.r=!0,t},f=function(e){let t=N(this,e);return t.r=!1,t.o=!0,t},b=function(e){let t=N(this,e);return t.u.empty=!0,t},v=function(e){let t=N(this,e);return t.t="any",void 0!==e&&(t.v=e),t},y=function(e){let t=N(this,e);return t.t="none",t},m=function(e){return function(...t){let n=N();return n.t="list",n.u.list={specs:t.map(e=>N(e)).map(t=>(t.u.list={kind:e},t)),kind:e},n}},g=m("one"),h=m("all"),j=function(e,t){let n=N(this,t);return n.b=e,n},I=function(e,t){let n=N(this,t);return n.a=e,n},$=function(e){let t=N(this,e);return t.b=(e,n,r)=>{if(null!=e&&"object"==typeof e){let o=Object.keys(e),i=t.v;"array"===r.node.t&&(i=Object.keys(t.v).slice(1).map(e=>{let t=parseInt(e);return isNaN(t)?e:t-1}).reduce((e,t)=>(e[t]=!0,e),{})),n.err=[];for(let u of o)void 0===i[u]&&n.err.push(S("closed",e,r.path,r.dI,t,3010,"",{k:u}));return 0===n.err.length}return!0},t},k=function(e,t){let n=N(this,t),r="string"==typeof e?e:("object"==typeof e&&e||{}).name;return null!=r&&""!=r&&(n.b=(e,t,n)=>((n.ctx.ref=n.ctx.ref||{})[r]=n.node,!0)),n},w=function(e,t){let n=N(this,t),r="object"==typeof e&&e||{},o="string"==typeof e?e:r.name,i=!!r.fill;return null!=o&&""!=o&&(n.b=(e,t,n)=>{if(void 0!==e||i){let e=n.ctx.ref=n.ctx.ref||{};if(void 0!==e[o]){let r={...e[o]};r.k=n.node.k,r.t=r.t||"none",t.node=r,t.type=r.t}}return!0}),n},O=function(e,t){let n=N(this,t),r="object"==typeof e&&e||{},o="string"==typeof e?e:r.name;return null!=o&&""!=o&&(n.a=(e,t,n)=>(n.src[o]=e,r.keep||delete n.src[n.key],!0)),n};function N(e,t){let n=l(void 0===e||e.window===e?t:e);return Object.assign(n,{After:I,All:h,Any:v,Before:j,Closed:$,Define:k,Empty:b,None:y,One:g,Optional:f,Refer:w,Rename:O,Required:p})}function A(e,t,n,r){return S(r||"custom",e,t.path,t.dI,t.node,4e3,n)}function S(e,t,n,r,o,i,u,s,l){let c={n:o,s:t,p:d(n,r),w:e,m:i,t:""},a=(void 0===t?"":E(t)).replace(/"/g,"");return a=a.substring(0,77)+(77<a.length?"...":""),c.t=null==u||""===u?`Validation failed for path "${c.p}" with value "${a}" because `+("type"===e?"instance"===o.t?"the value is not an instance of "+o.u.n:"the value is not of type "+o.t:"required"===e?"the value is required":"closed"===e?`the property "${null==s?void 0:s.k}" is not allowed`:"none"===e?"no value is allowed":`check "${e+(l?": "+l:"")}" failed`)+".":u.replace(/\$VALUE/g,a).replace(/\$PATH/g,c.p),c}function E(e,t){try{return JSON.stringify(e,(e,n)=>(t&&(n=t(e,n)),"bigint"==typeof n&&(n=n.toString()),n))}catch(n){return JSON.stringify(String(e))}}function R(e){return null==e||"object"!=typeof e?e:JSON.parse(JSON.stringify(e))}const q=e=>l({...e,$:{gubu$:!0}});Object.assign(c,{After:I,All:h,Any:v,Before:j,Closed:$,Define:k,Empty:b,None:y,One:g,Optional:f,Refer:w,Rename:O,Required:p,G$:q,buildize:N,makeErr:A}),Object.defineProperty(c,"name",{value:"gubu"});const _=c;e.Gubu=_;const{Gubu:x}=e;return x}));
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
module.exports={
  "name": "gubu",
  "version": "0.0.4",
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
    "test-web": "npm run build-web && browserify -o test/web.js -e test/entry.js -im && open test/web.html",
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
    "@types/jest": "^27.0.3",
    "jest": "^27.4.5",
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
const After = Gubu.After;
const All = Gubu.All;
const Any = Gubu.Any;
const Before = Gubu.Before;
const Closed = Gubu.Closed;
const Define = Gubu.Define;
const Empty = Gubu.Empty;
const None = Gubu.None;
const One = Gubu.One;
const Optional = Gubu.Optional;
const Refer = Gubu.Refer;
const Rename = Gubu.Rename;
const Required = Gubu.Required;
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
        expect(Gubu().toString()).toMatch(/\[Gubu \d+\]/);
        expect(Gubu(undefined, { name: 'foo' }).toString()).toMatch(/\[Gubu foo\]/);
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
    test('readme', () => {
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
        expect(() => rs0('')).toThrow('Validation failed for path "" with value "" because the value is required.');
        const rs0e = Gubu(Empty(String));
        expect(rs0e('')).toEqual('');
        const os0 = Gubu('x');
        expect(os0('')).toEqual('x');
        const os0e = Gubu(Empty('x'));
        expect(os0e('')).toEqual('');
        expect(() => Gubu(Number)('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')).toThrow('Validation failed for path "" with value "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa..." because the value is not of type number.');
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
        expect(g0({ a: ['X', 'Y'] })).toEqual({ a: ['X', 'Y'] });
        expect(() => g0({ a: ['X', 1] })).toThrow(/Validation failed for path "a.1" with value "1" because the value is not of type string\./);
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
        expect(() => g0({ a: 9 })).toThrow(/Validation failed for path "a" with value "9" because check "custom" failed\./);
        let g1 = Gubu({ a: Optional((v) => v > 10) });
        expect(g1({ a: 11 })).toMatchObject({ a: 11 });
        expect(() => g1({ a: 9 })).toThrow(/Validation failed for path "a" with value "9" because check "custom" failed\./);
        expect(g1({})).toMatchObject({});
        let g2 = Gubu({ a: Required((v) => v > 10) });
        expect(g1({ a: 11 })).toMatchObject({ a: 11 });
        expect(() => g2({ a: 9 })).toThrow(/Validation failed for path "a" with value "9" because check "custom" failed\./);
        expect(() => g2({})).toThrow(/Validation failed for path "a" with value "" because check "custom" failed\./);
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
    test('deep-array-basic', () => {
        let a0 = Gubu([1]);
        // console.dir(a0.spec(), { depth: null })
        expect(a0()).toMatchObject([]);
        expect(a0([])).toMatchObject([]);
        expect(a0([11])).toMatchObject([11]);
        expect(a0([11, 22])).toMatchObject([11, 22]);
        let a1 = Gubu([-1, 1, 2, 3]);
        // console.dir(a1.spec(), { depth: null })
        expect(a1()).toMatchObject([1, 2, 3]);
        expect(a1([])).toMatchObject([1, 2, 3]);
        expect(a1([11])).toMatchObject([11, 2, 3]);
        expect(a1([11, 22])).toMatchObject([11, 22, 3]);
        expect(a1([11, 22, 33])).toMatchObject([11, 22, 33]);
        expect(a1([11, 22, 33, 44])).toMatchObject([11, 22, 33, 44]);
        expect(a1([undefined, 22])).toMatchObject([1, 22, 3]);
    });
    test('builder-required', () => {
        let g0 = Gubu({ a: Required({ x: 1 }) });
        expect(g0({ a: { x: 1 } })).toEqual({ a: { x: 1 } });
        expect(() => g0({})).toThrow('Validation failed for path "a" with value "" because the value is required.');
        let g1 = Gubu({ a: Required([1]) });
        expect(g1({ a: [11] })).toEqual({ a: [11] });
        expect(() => g1({})).toThrow('Validation failed for path "a" with value "" because the value is required.');
    });
    test('builder-closed', () => {
        let tmp = {};
        let g0 = Gubu({ a: { b: { c: Closed({ x: 1 }) } } });
        expect(g0({ a: { b: { c: { x: 2 } } } })).toEqual({ a: { b: { c: { x: 2 } } } });
        expect(() => g0({ a: { b: { c: { x: 2, y: 3 } } } })).toThrow(/Validation failed for path "a.b.c" with value "{x:2,y:3}" because the property "y" is not allowed\./);
        let g1 = Gubu(Closed([Any(), Date, RegExp]));
        expect(g1(tmp.a0 = [new Date(), /a/])).toEqual(tmp.a0);
        expect(() => g1([new Date(), /a/, 'Q'])).toThrow(/Validation failed for path "" with value "\[[^Z]+Z,{},Q\]" /); // because the property "2" is not allowed\./)
    });
    test('builder-one', () => {
        let g0 = Gubu({ a: One(Number, String) });
        expect(g0({ a: 1 })).toEqual({ a: 1 });
        expect(g0({ a: 'x' })).toEqual({ a: 'x' });
        expect(() => g0({ a: true })).toThrow('Validation failed for path "a" with value "true" because the value is not of type number.\nValidation failed for path "a" with value "true" because the value is not of type string.');
        let g1 = Gubu(One(Number, String));
        expect(g1(1)).toEqual(1);
        expect(g1('x')).toEqual('x');
        expect(() => g1(true)).toThrow('Validation failed for path "" with value "true" because the value is not of type number.\nValidation failed for path "" with value "true" because the value is not of type string.');
        let g2 = Gubu([One(Number, String)]);
        expect(g2([1])).toEqual([1]);
        expect(g2(['x'])).toEqual(['x']);
        expect(g2([1, 2])).toEqual([1, 2]);
        expect(g2([1, 'x'])).toEqual([1, 'x']);
        expect(g2(['x', 1])).toEqual(['x', 1]);
        expect(g2(['x', 'y'])).toEqual(['x', 'y']);
        expect(g2(['x', 1, 'y', 2])).toEqual(['x', 1, 'y', 2]);
        expect(() => g2([true])).toThrow('Validation failed for path "0" with value "true" because the value is not of type number.\nValidation failed for path "0" with value "true" because the value is not of type string.');
        let g3 = Gubu({ a: [One(Number, String)] });
        expect(g3({ a: [1] })).toEqual({ a: [1] });
        expect(g3({ a: ['x'] })).toEqual({ a: ['x'] });
        expect(g3({ a: ['x', 1, 'y', 2] })).toEqual({ a: ['x', 1, 'y', 2] });
        expect(() => g3({ a: [1, 2, true] })).toThrow('Validation failed for path "a.2" with value "true" because the value is not of type number.\nValidation failed for path "a.2" with value "true" because the value is not of type string.');
        let g4 = Gubu({ a: [One({ x: 1 }, { x: 'X' })] });
        expect(g4({ a: [{ x: 2 }, { x: 'Q' }, { x: 3, y: true }, { x: 'W', y: false }] }))
            .toEqual({ a: [{ x: 2 }, { x: 'Q' }, { x: 3, y: true }, { x: 'W', y: false }] });
        let g5 = Gubu({ a: [One({ x: 1 }, Closed({ x: 'X' }))] });
        expect(g5({ a: [{ x: 2 }, { x: 'Q' }] }))
            .toEqual({ a: [{ x: 2 }, { x: 'Q' }] });
    });
    test('builder-all', () => {
        let g0 = Gubu(All({ x: 1 }, { y: 'a' }));
        expect(g0({ x: 1, y: 'a' })).toEqual({ x: 1, y: 'a' });
        expect(() => g0({ x: 'b', y: 'a' })).toThrow('Validation failed for path "x" with value "b" because the value is not of type number.');
        let g1 = Gubu({ a: All((v) => v > 10, (v) => v < 20) });
        expect(g1({ a: 11 })).toEqual({ a: 11 });
        expect(() => g1({ a: 0 })).toThrow('Validation failed for path "a" with value "0" because check "custom" failed.');
    });
    test('builder-custom-between', () => {
        const rangeCheck = Gubu([None(), Number, Number]);
        const Between = function (inopts, spec) {
            let vs = buildize(this || spec);
            let range = rangeCheck(inopts);
            vs.b = (val, update, state) => {
                // Don't run any more checks after this.
                update.done = true;
                if ('number' === typeof (val) && range[0] < val && val < range[1]) {
                    return true;
                }
                else {
                    update.err = [
                        makeErr(val, state, `Value "$VALUE" for path "$PATH" is ` +
                            `not between ${range[0]} and ${range[1]}.`)
                    ];
                    return false;
                }
            };
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
    test('builder-none', () => {
        let g0 = Gubu(None());
        expect(() => g0(1)).toThrow('Validation failed for path "" with value "1" because no value is allowed.');
        let g1 = Gubu({ a: None() });
        expect(() => g1({ a: 'x' })).toThrow('Validation failed for path "a" with value "x" because no value is allowed.');
        // Another way to do closed arrays.
        let g2 = Gubu([None(), 1, 'x']);
        expect(g2([2, 'y'])).toEqual([2, 'y']);
        expect(() => g2([2, 'y', true])).toThrow('Validation failed for path "2" with value "true" because no value is allowed.');
    });
    test('builder-rename', () => {
        let g0 = Gubu({ a: Rename('b', { x: 1 }) });
        expect(g0({ a: { x: 2 } })).toMatchObject({ b: { x: 2 } });
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
        expect(g1({ a: { x: 2 }, b: { x: 2 } }))
            .toEqual({ a: { x: 2 }, b: { x: 2 } });
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
                n: { t: 'nan', v: NaN, r: false, k: '', d: 0, u: {} },
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
                        n: { t: 'nan', v: NaN, r: false, k: '', d: 0, u: {} },
                        s: 1,
                        p: '',
                        w: 'type',
                        m: 1050,
                        t: 'Validation failed for path "" with value "1" because the value is not of type nan.'
                    }
                ]
            });
            expect(JSON.stringify(e)).toEqual("{\"gubu\":true,\"name\":\"GubuError\",\"code\":\"shape\",\"err\":[{\"n\":{\"$\":{\"v$\":\"" + package_json_1.default.version + "\"},\"t\":\"nan\",\"v\":null,\"r\":false,\"o\":false,\"k\":\"\",\"d\":0,\"u\":{}},\"s\":1,\"p\":\"\",\"w\":\"type\",\"m\":1050,\"t\":\"Validation failed for path \\\"\\\" with value \\\"1\\\" because the value is not of type nan.\"}],\"message\":\"Validation failed for path \\\"\\\" with value \\\"1\\\" because the value is not of type nan.\"}");
        }
    });
    test('spec-basic', () => {
        expect(Gubu(Number).spec()).toMatchObject({
            $: { gubu$: true, v$: package_json_1.default.version },
            d: 0, k: '', r: true, t: 'number', u: {}, v: 0,
        });
        expect(Gubu(String).spec()).toMatchObject({
            $: { gubu$: true, v$: package_json_1.default.version },
            d: 0, k: '', r: true, t: 'string', u: {}, v: '',
        });
        expect(Gubu(BigInt).spec()).toMatchObject({
            $: { gubu$: true, v$: package_json_1.default.version },
            d: 0, k: '', r: true, t: 'bigint', u: {}, v: "0",
        });
        expect(Gubu(null).spec()).toMatchObject({
            $: { gubu$: true, v$: package_json_1.default.version },
            d: 0, k: '', r: false, t: 'null', u: {}, v: null,
        });
    });
    test('spec-roundtrip', () => {
        let m0 = { a: 1 };
        let g0 = Gubu(m0);
        // console.log('m0 A', m0)
        expect(m0).toEqual({ a: 1 });
        expect(g0({ a: 2 })).toEqual({ a: 2 });
        expect(m0).toEqual({ a: 1 });
        // console.log('m0 B', m0)
        let s0 = g0.spec();
        expect(m0).toEqual({ a: 1 });
        // console.log('m0 C', m0)
        let s0s = {
            $: {
                gubu$: true,
                v$: package_json_1.default.version,
            },
            // d: -1,
            d: 0,
            k: '',
            r: false,
            o: false,
            t: 'object',
            u: {},
            v: {
                a: {
                    $: {
                        gubu$: true,
                        v$: package_json_1.default.version,
                    },
                    d: 1,
                    k: 'a',
                    r: false,
                    o: false,
                    t: 'number',
                    u: {},
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
            // d: -1,
            d: 0,
            k: '',
            r: false,
            o: false,
            t: 'object',
            u: {},
            v: {
                a: {
                    $: {
                        gubu$: true,
                        v$: package_json_1.default.version,
                    },
                    d: 1,
                    k: 'a',
                    r: false,
                    o: false,
                    t: 'array',
                    u: {},
                    v: {
                        0: {
                            $: {
                                gubu$: true,
                                v$: package_json_1.default.version,
                            },
                            d: 2,
                            k: '0',
                            r: false,
                            o: false,
                            t: 'number',
                            u: {},
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
        // console.log(g1.spec())
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
    test('G-basic', () => {
        expect(G$({ v: 11 })).toMatchObject({
            '$': { v$: package_json_1.default.version },
            t: 'number',
            v: 11,
            r: false,
            o: false,
            k: '',
            d: -1,
            u: {}
        });
        expect(G$({ v: Number })).toMatchObject({
            '$': { v$: package_json_1.default.version },
            t: 'number',
            v: 0,
            r: false,
            o: false,
            k: '',
            d: -1,
            u: {}
        });
        expect(G$({ v: BigInt(11) })).toMatchObject({
            '$': { v$: package_json_1.default.version },
            t: 'bigint',
            v: BigInt(11),
            r: false,
            o: false,
            k: '',
            d: -1,
            u: {}
        });
        let s0 = Symbol('foo');
        expect(G$({ v: s0 })).toMatchObject({
            '$': { v$: package_json_1.default.version },
            t: 'symbol',
            v: s0,
            r: false,
            o: false,
            k: '',
            d: -1,
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
            k: '',
            d: -1,
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
        // let m1: any = []
        // let c1 = m1
        // for (let i = 0; i < 11111; i++) {
        //   c1 = c0.a = {}
        // }
        // let g0 = Gubu(m0)
        // expect(g0(m0)).toEqual(m0)
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
