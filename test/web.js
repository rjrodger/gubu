(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Gubu = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
/* Copyright (c) 2021-2024 Richard Rodger and other contributors, MIT License */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GKey = exports.GIgnore = exports.GFunc = exports.GFault = exports.GExact = exports.GEmpty = exports.GDefine = exports.GDefault = exports.GClosed = exports.GChild = exports.GCheck = exports.GBelow = exports.GBefore = exports.GAny = exports.GAll = exports.GAfter = exports.GAbove = exports.Rest = exports.Type = exports.Some = exports.Skip = exports.Required = exports.Rename = exports.Refer = exports.Optional = exports.Open = exports.One = exports.Never = exports.Min = exports.Max = exports.Len = exports.Key = exports.Ignore = exports.Func = exports.Fault = exports.Exact = exports.Empty = exports.Define = exports.Default = exports.Closed = exports.Child = exports.Check = exports.Below = exports.Before = exports.Any = exports.All = exports.After = exports.Above = exports.G$ = exports.Gubu = void 0;
exports.GRest = exports.GType = exports.GSome = exports.GSkip = exports.GRequired = exports.GRename = exports.GRefer = exports.GOptional = exports.GOpen = exports.GOne = exports.GNever = exports.GMin = exports.GMax = exports.GLen = void 0;
exports.nodize = nodize;
exports.buildize = buildize;
exports.makeErr = makeErr;
exports.stringify = stringify;
exports.truncate = truncate;
exports.expr = expr;
exports.MakeArgu = MakeArgu;
exports.build = build;
// FIX: does not work if Gubu is inside a Proxy - jest fails
// FEATURE: regexp in array: [/a/] => all elements must match /a/
// FEATURE: validator on completion of object or array
// FEATURE: support non-index properties on array shape
// FEATURE: state should indicate if value was present, not just undefined
// FEATURE: support custom builder registration so that can chain on builtins
// FEATURE: merge shapes (allows extending given shape - e.g. adding object props)
// FEATURE: Key validation by RegExp
// TODO: Validation of Builder parameters
// TODO: GubuShape.d is damaged by composition
// TODO: Better stringifys for builder shapes
// TODO: Error messages should state property is missing, not `value ""`
// TODO: node.s can be a lazy function to avoid unnecessary string building
// TODO: Finish Default shape-builder
// FIX: Gubu(Gubu(..)) should work
// DOC: Skip also makes value optional - thus Skip() means any value, or nonexistent
// DOC: Optional
const util_1 = require("util");
// Package version.
const VERSION = '8.0.1';
// Unique symbol for marking and recognizing Gubu shapes.
const GUBU$ = Symbol.for('gubu$');
// A singleton for fast equality checks.
const GUBU = { gubu$: GUBU$, v$: VERSION };
// TODO GUBU$UNDEF for explicit undefined
// A special marker for property abscence.
const GUBU$UNDEF = Symbol.for('gubu$undef');
// RegExp: first letter is upper case
const UPPER_CASE_FIRST_RE = /^[A-Z]/;
const { toString } = Object.prototype;
// Help the minifier
const S = {
    gubu: 'gubu',
    name: 'name',
    nan: 'nan',
    never: 'never',
    number: 'number',
    required: 'required',
    array: 'array',
    function: 'function',
    object: 'object',
    string: 'string',
    boolean: 'boolean',
    undefined: 'undefined',
    any: 'any',
    list: 'list',
    instance: 'instance',
    null: 'null',
    type: 'type',
    closed: 'closed',
    shape: 'shape',
    check: 'check',
    regexp: 'regexp',
    String: 'String',
    Number: 'Number',
    Boolean: 'Boolean',
    Object: 'Object',
    Array: 'Array',
    Symbol: 'Symbol',
    Function: 'Function',
    Value: 'Value',
    Above: 'Above',
    After: 'After',
    All: 'All',
    Any: 'Any',
    Before: 'Before',
    Below: 'Below',
    Check: 'Check',
    Child: 'Child',
    Closed: 'Closed',
    Define: 'Define',
    Default: 'Default',
    Empty: 'Empty',
    Exact: 'Exact',
    Func: 'Func',
    Key: 'Key',
    Max: 'Max',
    Min: 'Min',
    Never: 'Never',
    Len: 'Len',
    One: 'One',
    Open: 'Open',
    Optional: 'Optional',
    Refer: 'Refer',
    Rename: 'Rename',
    Required: 'Required',
    Skip: 'Skip',
    Ignore: 'Ignore',
    Some: 'Some',
    Fault: 'Fault',
    Rest: 'Rest',
    forprop: ' for property ',
    $PATH: '"$PATH"',
    $VALUE: '"$VALUE"',
};
const TNAT = {
    [S.String]: String,
    [S.Number]: Number,
    [S.Boolean]: Boolean,
    [S.Object]: Object,
    [S.Array]: Array,
    [S.Symbol]: Symbol,
    [S.Function]: Function,
};
// Utility shortcuts.
const keys = (arg) => Object.keys(arg);
const defprop = (o, p, a) => Object.defineProperty(o, p, a);
const isarr = (arg) => Array.isArray(arg);
const JP = (arg) => JSON.parse(arg);
const JS = (a0, a1) => JSON.stringify(a0, a1);
// The current validation state.
class State {
    constructor(root, top, ctx, match) {
        this.match = false;
        this.dI = 0; // Node depth.
        this.nI = 2; // Next free slot in nodes.
        this.cI = -1; // Pointer to next node.
        this.pI = 0; // Pointer to current node.
        this.sI = -1; // Pointer to next sibling node.
        this.valType = S.never;
        this.isRoot = false;
        this.key = '';
        this.type = S.never;
        this.stop = true;
        this.nextSibling = true;
        this.fromDflt = false;
        // NOTE: tri-valued; undefined = soft ignore
        this.ignoreVal = undefined;
        this.curerr = [];
        this.err = [];
        // TODO: is this needed - try using ancestors instead
        this.parents = [];
        this.keys = [];
        this.ancestors = [];
        // NOTE: not "clean"!
        // Actual path is always only path[0,dI+1]
        this.path = [];
        this.root = root;
        this.vals = [root, -1];
        this.node = top;
        this.nodes = [top, -1];
        this.ctx = ctx || {};
        this.match = !!match;
    }
    next() {
        // Uncomment for debugging (definition below). DO NOT REMOVE.
        // this.printStacks()
        this.stop = false;
        this.fromDflt = false;
        this.ignoreVal = undefined;
        this.isRoot = 0 === this.pI;
        this.check = undefined;
        // Dereference the back pointers to ancestor siblings.
        // Only objects|arrays can be nodes, so a number is a back pointer.
        // NOTE: terminates because (+{...} -> NaN, +[] -> 0) -> false (JS wat FTW!)
        let nextNode = this.nodes[this.pI];
        // See note for path below.
        this.ancestors[this.dI] = this.node;
        while (+nextNode) {
            this.dI--;
            this.ctx.log &&
                -1 < this.dI &&
                this.ctx.log('e' +
                    (isarr(this.parents[this.pI]) ? 'a' : 'o'), this);
            this.pI = +nextNode;
            nextNode = this.nodes[this.pI];
        }
        if (!nextNode) {
            this.stop = true;
            return;
        }
        else {
            this.node = nextNode;
        }
        this.updateVal(this.vals[this.pI]);
        this.key = this.keys[this.pI];
        this.cI = this.pI;
        this.sI = this.pI + 1;
        // TODO: remove and use ancestors?
        if (Object.isFrozen(this.parents[this.pI])) {
            this.parents[this.pI] = { ...this.parents[this.pI] };
        }
        this.parent = this.parents[this.pI];
        this.nextSibling = true;
        this.type = this.node.t;
        // NOTE: this is always correct for the current node, up to dI, because
        // previous values at dI get overwritten. Avoids need to duplicate on each descent.
        // ancestors uses same approach.
        this.path[this.dI] = this.key;
        this.oval = this.val;
        this.curerr.length = 0;
    }
    updateVal(val) {
        this.val = val;
        this.valType = typeof (this.val);
        if (S.number === this.valType && isNaN(this.val)) {
            this.valType = S.nan;
        }
        if (this.isRoot && !this.match) {
            this.root = this.val;
        }
    }
}
// Custom Error class.
class GubuError extends TypeError {
    constructor(code, prefix, err, ctx) {
        prefix = (null == prefix) ? '' : (prefix + ': ');
        super(prefix + err.map((e) => e.t).join('\n'));
        this.gubu = true;
        let name = 'GubuError';
        let ge = this;
        ge.name = name;
        this.code = code;
        this.prefix = prefix;
        this.desc = () => ({ name, code, err, ctx, });
        this.stack = this.stack?.replace(/.*\/gubu\/gubu\.[tj]s.*\n/g, '');
        this.props = err.map((e) => ({
            path: e.p,
            what: e.w,
            type: e.n?.t,
            value: e.v
        }));
    }
    toJSON() {
        return {
            ...this,
            err: this.desc().err,
            name: this.name,
            message: this.message,
        };
    }
}
// TODO: There are a lot more!!! Error, Blob, etc
// Identify JavaScript wrapper types by name.
const IS_TYPE = {
    Array: true,
    BigInt: true,
    Boolean: true,
    Function: true,
    Number: true,
    Object: true,
    String: true,
    Symbol: true,
};
// Empty values for each type.
const EMPTY_VAL = {
    string: '',
    number: 0,
    boolean: false,
    object: {},
    array: [],
    symbol: Symbol(''),
    bigint: BigInt(0),
    null: null,
    regexp: /.*/,
};
// Normalize a value into a Node<S>.
function nodize(shape, depth, meta) {
    // If using builder as property of Gubu, `this` is just Gubu, not a node.
    if (make === shape) {
        shape = undefined;
    }
    // Is this a (possibly incomplete) Node<S>?
    else if (null != shape && shape.$?.gubu$) {
        // Assume complete if gubu$ has special internal reference.
        if (GUBU$ === shape.$.gubu$) {
            shape.d = null == depth ? shape.d : depth;
            return shape;
        }
        // Normalize an incomplete Node<S>, avoiding any recursive calls to norm.
        else if (true === shape.$.gubu$) {
            let node = { ...shape };
            node.$ = { v$: VERSION, ...node.$, gubu$: GUBU$ };
            node.v =
                (null != node.v && S.object === typeof (node.v)) ? { ...node.v } : node.v;
            // Leave as-is: node.c
            node.t = node.t || typeof (node.v);
            if (S.function === node.t && IS_TYPE[node.v.name]) {
                node.t = node.v.name.toLowerCase();
                node.v = clone(EMPTY_VAL[node.t]);
                node.f = node.v;
            }
            node.r = !!node.r;
            node.p = !!node.p;
            node.d = null == depth ? null == node.d ? -1 : node.d : depth;
            node.b = node.b || [];
            node.a = node.a || [];
            node.u = node.u || {};
            node.m = node.m || meta || {};
            return node;
        }
    }
    // Not a Node<S>, so build one based on value and its type.
    let t = (null === shape ? S.null : typeof (shape));
    t = (S.undefined === t ? S.any : t);
    let v = shape;
    let f = v;
    let c = undefined;
    let r = false; // Not required by default.
    let p = false; // Only true when Skip builder is used.
    let u = {};
    let a = [];
    let b = [];
    if (S.object === t) {
        f = undefined;
        if (isarr(v)) {
            t = S.array;
            if (1 === v.length) {
                c = v[0];
                v = [];
            }
            // Else no child, thus closed.
        }
        else if (null != v &&
            Function !== v.constructor &&
            Object !== v.constructor &&
            null != v.constructor) {
            let strdesc = toString.call(v);
            if ('[object RegExp]' === strdesc) {
                t = S.regexp;
                r = true;
            }
            else {
                t = S.instance;
                u.n = v.constructor.name;
                u.i = v.constructor;
            }
            f = v;
        }
        else {
            // Empty object "{}" is considered Open
            if (0 === keys(v).length) {
                c = Any();
            }
        }
    }
    // NOTE: use Check for validation functions
    else if (S.function === t) {
        if (IS_TYPE[shape.name]) {
            t = shape.name.toLowerCase();
            r = true;
            v = clone(EMPTY_VAL[t]);
            f = v;
            // Required "Object" is considered Open
            if (S.Object === shape.name) {
                c = Any();
            }
        }
        else if (v.gubu === GUBU || true === v.$?.gubu) {
            let gs = v.node ? v.node() : v;
            t = gs.t;
            v = gs.v;
            f = v;
            r = gs.r;
            u = { ...gs.u };
            a = [...gs.a];
            b = [...gs.b];
        }
        // Instance of a class.
        // Note: uses the convention that a class name is captialized.
        else if (S.Function === v.constructor.name &&
            UPPER_CASE_FIRST_RE.test(v.name)) {
            t = S.instance;
            r = true;
            u.n = v.prototype?.constructor?.name;
            u.i = v;
        }
    }
    else if (S.number === t && isNaN(v)) {
        t = S.nan;
    }
    else if (S.string === t && '' === v) {
        u.empty = true;
    }
    let vmap = (null != v && (S.object === t || S.array === t)) ? { ...v } : v;
    let node = {
        $: GUBU,
        t,
        v: vmap,
        f,
        n: null != vmap && S.object === typeof (vmap) ? keys(vmap).length : 0,
        c,
        r,
        p,
        d: null == depth ? -1 : depth,
        k: [],
        e: true,
        u,
        a,
        b,
        m: meta || {},
        [Symbol.for('nodejs.util.inspect.custom')]() {
            const nd = { ...this };
            delete nd.$;
            return JSON.stringify(nd, (_k, v) => 'function' === typeof v && !BuilderMap[v.name] ? v.name : v).replace(/"/g, '').replace(/,/g, ' ');
        }
    };
    // console.log('NODIZE', shape, node)
    return node;
}
function nodizeDeep(root, depth) {
    const nodes = [[{}, 'root', root, depth]];
    for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];
        const n = p[0][p[1]] = nodize(p[2], p[3]);
        if (undefined !== n.c) {
            if (!n.c.$?.gubu$) {
                nodes.push([n, 'c', n.c, n.d]);
            }
        }
        let vt = typeof n.v;
        if (S.object === vt && null != n.v) {
            Object.entries(n.v).map((m) => {
                if (!m[1].$?.gubu$) {
                    nodes.push([n.v, m[0], m[1], n.d + 1]);
                }
            });
        }
    }
    // console.log('ND', nodes.length)
    return nodes[0][0].root;
    /*
    if (null == n?.$?.gubu$) {
      n = nodize(n, depth), depth
    }
  
    if (undefined !== n.c && !n.c.$?.gubu$) {
      n.c = nodize(n.c, n.d + 1)
    }
  
    let vt = typeof n.v
    if (S.object === vt && null != n.v) {
      Object.entries(n.v).map((m: any[]) => (n.v[m[0]] = nodizeDeep(m[1], n.d + 1)))
    }
    return n
  
    */
}
// Create a GubuShape from a shape specification.
function make(intop, inopts) {
    const opts = null == inopts ? {} : inopts;
    // TODO: move to prepopts utility function
    // Ironically, we can't Gubu GubuOptions, so we have to set
    // option defaults manually.
    opts.name =
        null == opts.name ?
            'G' + ('' + Math.random()).substring(2, 8) : '' + opts.name;
    opts.prefix = null == opts.prefix ? undefined : opts.prefix;
    // Meta properties are off by default.
    let optsmeta = opts.meta = opts.meta || {};
    optsmeta.active = (true === optsmeta.active) || false;
    optsmeta.suffix = S.string == typeof optsmeta.suffix ? optsmeta.suffix : '$$';
    // Key expressions are on by default.
    let optskeyexpr = opts.keyexpr = opts.keyexpr || {};
    optskeyexpr.active = (false !== optskeyexpr.active);
    // Key specs are off by default.
    let optskeyspec = opts.keyspec = (opts.keyspec || {});
    optskeyspec.active = (true === optskeyspec.active);
    optskeyspec.keymark =
        S.string == typeof optskeyspec.keymark ? optskeyspec.keymark : optsmeta.suffix;
    // console.log('OKS', optskeyspec)
    let top = nodize(intop, 0);
    let desc = '';
    let json = undefined;
    // Lazily execute top against root to see if they match
    function exec(root, ctx, match // Suppress errors and return boolean result (true if match)
    ) {
        const skipd = ctx?.skip?.depth;
        const skipa = Array.isArray(ctx?.skip?.depth) ? ctx.skip.depth : null;
        const skipk = Array.isArray(ctx?.skip?.keys) ? ctx.skip.keys : null;
        const s = new State(root, top, ctx, match);
        // Iterative depth-first traversal of the shape using append-only array stacks.
        // Stack entries are either sub-nodes to validate, or back pointers to
        // next depth-first sub-node index.
        while (true) {
            s.next();
            if (s.stop) {
                break;
            }
            let n = s.node;
            let done = false;
            let fatal = false;
            // Context skip can override node skip
            let skip = (n.d === skipd ||
                (skipa && skipa.includes(n.d)) ||
                (skipk && 1 === n.d && skipk.includes(s.key))) ? true : n.p;
            // console.log('SKIP', skip, s.key, n.d, ctx?.skip?.depth, n.r)
            // Call Befores
            if (0 < n.b.length) {
                for (let bI = 0; bI < n.b.length; bI++) {
                    let update = handleValidate(n.b[bI], s);
                    n = s.node;
                    if (undefined !== update.done) {
                        done = update.done;
                    }
                    fatal = fatal || !!update.fatal;
                }
            }
            if (!done) {
                let descend = true;
                let valundef = undefined === s.val;
                if (S.never === s.type) {
                    s.curerr.push(makeErrImpl(S.never, s, 1070));
                }
                // Handle objects.
                else if (S.object === s.type) {
                    let val;
                    if (undefined !== n.c) {
                        n.c = nodizeDeep(n.c, 1 + s.dI);
                    }
                    if (n.r && valundef) {
                        s.ignoreVal = true;
                        s.curerr.push(makeErrImpl(S.required, s, 1010));
                    }
                    else if (!valundef && (null === s.val ||
                        S.object !== s.valType ||
                        isarr(s.val))) {
                        s.curerr.push(makeErrImpl(S.type, s, 1020));
                        val = isarr(s.val) ? s.val : {};
                    }
                    // Not skippable, use default or create object
                    else if (!skip && valundef && undefined !== n.f) {
                        s.updateVal(n.f);
                        s.fromDflt = true;
                        val = s.val;
                        descend = false;
                    }
                    else if (!skip || !valundef) {
                        // Descend into object, constructing child defaults
                        s.updateVal(s.val || (s.fromDflt = true, {}));
                        val = s.val;
                    }
                    if (descend) {
                        // console.log('DESCEND', s.node)
                        val = null == val && false === s.ctx.err ? {} : val;
                        if (null != val) {
                            s.ctx.log && s.ctx.log('so', s);
                            let hasKeys = false;
                            let vkeys = keys(n.v);
                            let start = s.nI;
                            if (0 < vkeys.length) {
                                hasKeys = true;
                                s.pI = start;
                                //for (let k of vkeys) {
                                for (let kI = 0; kI < vkeys.length; kI++) {
                                    let k = vkeys[kI];
                                    // console.log('KEY', k, kI)
                                    let meta = undefined;
                                    // TODO: make optional, needs tests
                                    // Experimental feature for jsonic docs
                                    // NOTE: Meta key *must* immediately preceed key:
                                    // { x$$: <META>, x: 1 }}
                                    if (optsmeta.active && k.endsWith(optsmeta.suffix)) {
                                        meta = { short: '' };
                                        if (S.string === typeof (n.v[k])) {
                                            meta.short = n.v[k];
                                        }
                                        else {
                                            meta = { ...meta, ...n.v[k] };
                                        }
                                        delete n.v[k];
                                        kI++;
                                        if (vkeys.length <= kI) {
                                            break;
                                        }
                                        if (vkeys[kI] !== k
                                            .substring(0, k.length - optsmeta.suffix.length)) {
                                            throw new Error('Invalid meta key: ' + k);
                                        }
                                        k = vkeys[kI];
                                    }
                                    let rk = k;
                                    let ov = n.v[k];
                                    if (optskeyexpr.active) {
                                        let m = /^\s*("(\\.|[^"\\])*"|[^\s]+):\s*(.*?)\s*$/
                                            .exec(k);
                                        if (m) {
                                            rk = m[1];
                                            let src = m[3];
                                            ov = expr({ src, d: 1 + s.dI, meta }, ov);
                                            delete n.v[k];
                                        }
                                    }
                                    if (optskeyspec.active && k.startsWith(optskeyspec.keymark)) {
                                        if (k === optskeyspec.keymark) {
                                            // console.log('KEYSPEC-A', k, ov, n)
                                            // console.dir(s, { depth: null })
                                            let outn = expr({
                                                src: ov, d: 1 + s.dI, meta,
                                                ancestors: s.ancestors,
                                                node: n,
                                            }, n);
                                            // console.log('KEYSPEC-B', k, ov, '\nN   =', n, '\nOUTN=', outn)
                                            Object.assign(n, outn);
                                        }
                                        else {
                                            // console.log('DELETE', k, s)
                                            n.m.$$ = (n.m.$$ || {});
                                            n.m.$$[k.substring(optskeyspec.keymark.length)] = n.v[k];
                                        }
                                        delete n.v[k];
                                        continue;
                                    }
                                    let nvs = nodize(ov, 1 + s.dI, meta);
                                    // console.log('NVS', k, ov, nvs)
                                    n.v[rk] = nvs;
                                    if (!n.k.includes(rk)) {
                                        n.k.push(rk);
                                    }
                                    s.nodes[s.nI] = nvs;
                                    s.vals[s.nI] = val[rk];
                                    s.parents[s.nI] = val;
                                    s.keys[s.nI] = rk;
                                    s.nI++;
                                }
                            }
                            let extra = keys(val).filter(k => undefined === n.v[k]);
                            if (0 < extra.length) {
                                if (undefined === n.c) {
                                    s.ignoreVal = true;
                                    s.curerr.push(makeErrImpl(S.closed, s, 1100, undefined, { k: extra }));
                                }
                                else {
                                    hasKeys = true;
                                    s.pI = start;
                                    for (let k of extra) {
                                        let nvs = n.c = nodize(n.c, 1 + s.dI);
                                        s.nodes[s.nI] = nvs;
                                        s.vals[s.nI] = val[k];
                                        s.parents[s.nI] = val;
                                        s.keys[s.nI] = k;
                                        s.nI++;
                                    }
                                }
                            }
                            if (hasKeys) {
                                s.dI++;
                                s.nodes[s.nI] = s.sI;
                                s.parents[s.nI] = val;
                                s.nextSibling = false;
                                s.nI++;
                            }
                            else {
                                s.ctx.log && s.ctx.log('eo', s);
                            }
                        }
                    }
                }
                // Handle arrays.
                else if (S.array === s.type) {
                    if (n.r && valundef) {
                        s.ignoreVal = true;
                        s.curerr.push(makeErrImpl(S.required, s, 1030));
                    }
                    else if (!valundef && !isarr(s.val)) {
                        s.curerr.push(makeErrImpl(S.type, s, 1040));
                    }
                    else if (!skip && valundef && undefined !== n.f) {
                        s.updateVal(n.f);
                        s.fromDflt = true;
                    }
                    else if (!skip || null != s.val) {
                        s.updateVal(s.val || (s.fromDflt = true, []));
                        // n.c set by nodize for array with len=1
                        let hasChildShape = undefined !== n.c;
                        let hasValueElements = 0 < s.val.length;
                        let elementKeys = keys(n.v).filter(k => !isNaN(+k));
                        let hasFixedElements = 0 < elementKeys.length;
                        if (hasChildShape) {
                            n.c = nodizeDeep(n.c, 1 + s.dI);
                        }
                        s.ctx.log && s.ctx.log('sa', s);
                        if (hasValueElements || hasFixedElements) {
                            s.pI = s.nI;
                            let elementIndex = 0;
                            // Fixed element array means match shapes at each index only.
                            if (hasFixedElements) {
                                if (elementKeys.length < s.val.length && !hasChildShape) {
                                    s.ignoreVal = true;
                                    s.curerr.push(makeErrImpl(S.closed, s, 1090, undefined, { k: elementKeys.length }));
                                }
                                else {
                                    for (; elementIndex < elementKeys.length; elementIndex++) {
                                        let elementShape = n.v[elementIndex] =
                                            nodize(n.v[elementIndex], 1 + s.dI);
                                        s.nodes[s.nI] = elementShape;
                                        s.vals[s.nI] = s.val[elementIndex];
                                        s.parents[s.nI] = s.val;
                                        s.keys[s.nI] = '' + elementIndex;
                                        s.nI++;
                                    }
                                }
                            }
                            // Single element array shape means 0 or more elements of shape
                            if (hasChildShape && hasValueElements) {
                                let elementShape = n.c; // = nodize(n.c, 1 + s.dI)
                                for (; elementIndex < s.val.length; elementIndex++) {
                                    s.nodes[s.nI] = elementShape;
                                    s.vals[s.nI] = s.val[elementIndex];
                                    s.parents[s.nI] = s.val;
                                    s.keys[s.nI] = '' + elementIndex;
                                    s.nI++;
                                }
                            }
                            if (!s.ignoreVal) {
                                s.dI++;
                                s.nodes[s.nI] = s.sI;
                                s.parents[s.nI] = s.val;
                                s.nextSibling = false;
                                s.nI++;
                            }
                        }
                        else {
                            // Ensure single element array still generates log
                            // for the element when only walking shape.
                            s.ctx.log &&
                                hasChildShape &&
                                undefined == root &&
                                s.ctx.log('kv', { ...s, key: 0, val: n.c });
                            s.ctx.log && s.ctx.log('ea', s);
                        }
                    }
                }
                // Handle regexps.
                else if (S.regexp === s.type) {
                    if (valundef && !n.r) {
                        s.ignoreVal = true;
                    }
                    else if (S.string !== s.valType) {
                        s.ignoreVal = true;
                        s.curerr.push(makeErrImpl(S.type, s, 1045));
                    }
                    else if (!s.val.match(n.v)) {
                        s.ignoreVal = true;
                        s.curerr.push(makeErrImpl(S.regexp, s, 1045));
                    }
                }
                // Invalid type.
                else if (!(S.any === s.type ||
                    S.list === s.type ||
                    S.check === s.type ||
                    undefined === s.val ||
                    s.type === s.valType ||
                    (S.instance === s.type && n.u.i && s.val instanceof n.u.i) ||
                    (S.null === s.type && null === s.val))) {
                    s.curerr.push(makeErrImpl(S.type, s, 1050));
                }
                // Value itself, or default.
                else if (undefined === s.val) {
                    let parentKey = s.path[s.dI];
                    if (!skip &&
                        n.r &&
                        (S.undefined !== s.type || !s.parent.hasOwnProperty(parentKey))) {
                        s.ignoreVal = true;
                        s.curerr.push(makeErrImpl(S.required, s, 1060));
                    }
                    else if (
                    // undefined !== n.v &&
                    undefined !== n.f &&
                        !skip ||
                        S.undefined === s.type) {
                        // Inject default value.
                        s.updateVal(n.f);
                        s.fromDflt = true;
                    }
                    else if (S.any === s.type) {
                        s.ignoreVal = undefined === s.ignoreVal ? true : s.ignoreVal;
                    }
                    // TODO: ensure object,array points called even if errors
                    s.ctx.log && s.ctx.log('kv', s);
                }
                // Empty strings fail even if string is optional. Use Empty() to allow.
                else if (S.string === s.type && '' === s.val && !n.u.empty) {
                    s.curerr.push(makeErrImpl(S.required, s, 1080));
                    s.ctx.log && s.ctx.log('kv', s);
                }
                else {
                    s.ctx.log && s.ctx.log('kv', s);
                }
            }
            // Call Afters
            if (0 < n.a.length) {
                for (let aI = 0; aI < n.a.length; aI++) {
                    let update = handleValidate(n.a[aI], s);
                    n = s.node;
                    if (undefined !== update.done) {
                        done = update.done;
                    }
                    fatal = fatal || !!update.fatal;
                }
            }
            // Explicit ignoreVal overrides Skip
            // let ignoreVal = s.node.p ? false === s.ignoreVal ? false : true : !!s.ignoreVal
            let ignoreVal = skip ? false === s.ignoreVal ? false : true : !!s.ignoreVal;
            let setParent = !s.match && null != s.parent && !done && !ignoreVal;
            if (setParent) {
                s.parent[s.key] = s.val;
            }
            if (s.nextSibling) {
                s.pI = s.sI;
            }
            if (s.node.e || fatal) {
                s.err.push(...s.curerr);
            }
        }
        // s.err = s.err.filter(e => null != e)
        if (0 < s.err.length) {
            if (isarr(s.ctx.err)) {
                s.ctx.err.push(...s.err);
            }
            else if (!s.match && false !== s.ctx.err) {
                throw new GubuError(S.shape, opts.prefix, s.err, s.ctx);
            }
        }
        return s.match ? 0 === s.err.length : s.root;
    }
    function gubuShape(root, ctx) {
        return (exec(root, ctx, false));
    }
    function valid(root, ctx) {
        let actx = ctx || {};
        actx.err = actx.err || [];
        exec(root, actx, false);
        return 0 === actx.err.length;
    }
    gubuShape.valid = valid;
    gubuShape.match = (root, ctx) => {
        ctx = ctx || {};
        return exec(root, ctx, true);
    };
    // List the errors from a given root value.
    gubuShape.error = (root, ctx) => {
        let actx = ctx || {};
        actx.err = actx.err || [];
        exec(root, actx, false);
        return actx.err;
    };
    gubuShape.spec = () => {
        // Normalize spec, discard errors.
        gubuShape(undefined, { err: false });
        const str = stringify(top, (_key, val) => {
            if (GUBU$ === val) {
                return true;
            }
            return val;
        }, false, true);
        // console.log('STR', str)
        return JP(str);
    };
    gubuShape.node = () => {
        gubuShape.spec();
        return top;
    };
    gubuShape.stringify = (...rest) => {
        const json = gubuShape.jsonify();
        return '' === desc ?
            (desc = ('string' === typeof json ? json.replace(/^"(.*)"$/, '$1') :
                JSON.stringify(json, ...rest))) : desc;
    };
    gubuShape.jsonify = () => {
        return null == json ? (json = node2json(gubuShape.node())) : json;
    };
    /*
    gubuShape.stringify = (...rest: any) => {
      let n = top
      n = (null != n && n.$ && (GUBU$ === n.$.gubu$ || true === (n.$ as any).gubu$)) ?
        ('array' === n.t ? [n.c] :
          (null == n.s ? n.v : ('function' === typeof n.s ? (n.s = n.s()) : n.s))) : n
      // console.log('STR', n, top, rest)
  
      let str = Gubu.stringify(n, ...rest)
      str = str.replace(/^"/, '').replace(/"$/, '')
  
      return str
    }
    */
    gubuShape.toString = () => {
        desc = truncate('' === desc ?
            stringify((null != top &&
                top.$ &&
                (GUBU$ === top.$.gubu$ || true === top.$.gubu$)) ? top.v : top, null, true) :
            desc);
        return `[Gubu ${opts.name} ${desc}]`;
    };
    if (util_1.inspect && util_1.inspect.custom) {
        gubuShape[util_1.inspect.custom] = gubuShape.toString;
    }
    gubuShape.gubu = GUBU;
    // Validate shape spec. This will throw if there's an issue with the spec.
    gubuShape.spec();
    return gubuShape;
}
// Parse a builder expression into actual Builders.
// Function call syntax; Depth first; literals must be JSON values;
// Commas are optional. Top level builders are applied in order.
// Dot-concatenated builders are applied in order.
// Primary value is passed as Builder `this` context.
// Examples:
// Gubu({
//   'x: Open': {},
//   'y: Min(1) Max(4)': 2,
//   'z: Required(Min(1))': 2,
//   'q: Min(1).Below(4)': 3,
// })
function expr(spec, current) {
    // FIRST NODIZE VAL, THEN ADD EXPR BUILDERS
    // if ('string' != typeof spec) {
    //   console.log('EXPR', spec.i, spec.tokens && spec.tokens.slice(spec.i))
    // }
    let g = undefined;
    let top = false;
    if ('string' === typeof spec) {
        spec = { src: spec };
    }
    const currentIsNode = current?.$?.gubu$;
    spec.i = spec.i || 0;
    if (null == spec.tokens) {
        g = undefined != spec.val ? nodize(spec.val, (spec.d || 0) + 1, spec.meta) : undefined;
        top = true;
        spec.tokens = [];
        //         A       BC      D L   E         F  M   H        N        I        JK
        let tre = /\s*,?\s*([)(\.]|"(\\.|[^"\\])*"|\/(\\.|[^\/\\])*\/[a-z]?|[^)(,.\s]+)\s*/g;
        // A: prefixing space and/or comma
        // B-J: the next token is submatch 1, containing a set of alternates
        // C: class parens-dot
        // D: quoted string
        // L: backslash escape within string
        // E: unescaped chat (not a quote or backslash)
        // F: regexp
        // M: literal dot
        // H: not a regexp escape or end slash
        // N: regexp end and flags
        // I: not a char token (thus a builder name)
        // K: suffix space
        let t = null;
        while (t = tre.exec(spec.src)) {
            spec.tokens.push(t[1]);
        }
        // console.log('TOKENS-A', spec, current)//.join(' '))
        // Append current into leftmost deepest Builder args
        if (!currentIsNode) {
            let tI = 0;
            let paren = false;
            // for (; tI < spec.tokens.length && ')' !== spec.tokens[tI]; tI++);
            for (; tI < spec.tokens.length; tI++) {
                if (')' == spec.tokens[tI]) {
                    paren = true;
                    break;
                }
            }
            if (paren || tI === spec.tokens.length) {
                //let ctj = JSON.stringify(current)
                // if (undefined !== ctj) {
                if (undefined !== current) {
                    let refname = 'token_' + spec.d + '_' + spec.i;
                    spec.refs = (spec.refs || {});
                    spec.refs[refname] = current;
                    if (paren) {
                        // spec.tokens.splice(tI, 0, ctj)
                        spec.tokens.splice(tI, 0, '$$' + refname);
                    }
                    else {
                        // spec.tokens.push('(', ctj, ')')
                        spec.tokens.push('(', '$$' + refname, ')');
                    }
                }
            }
        }
        // console.log('TOKENS-B', spec.tokens.join(' '), spec.refs)
    }
    let head = spec.tokens[spec.i];
    // console.log('HEAD', head, spec.i)
    let fn = BuilderMap[head];
    // console.log('FN', head, fn)
    if (')' === spec.tokens[spec.i]) {
        spec.i++;
        return current;
    }
    spec.i++;
    let args = [];
    if (null == fn) {
        try {
            let m;
            // let val = TNAT[head]
            if (TNAT[head]) {
                fn = Type;
                args.unshift(head);
            }
            else if (S.undefined === head) {
                return undefined;
            }
            else if ('NaN' === head) {
                return NaN;
            }
            else if (head.match(/^\/.+\/$/)) {
                return new RegExp(head.substring(1, head.length - 1));
            }
            else if (m = head.match(/^\$\$([^$]+)$/)) {
                return spec.node ?
                    ((spec.node.m?.$$ || {})[m[1]] || spec.node.v['$$' + m[1]])
                    : (spec.refs ? spec.refs[m[1]] : undefined);
            }
            else {
                let val = JP(head);
                if (top) {
                    fn = Default;
                    args.unshift(val);
                }
                else {
                    return val;
                }
            }
        }
        catch (je) {
            // console.log(je)
            throw new SyntaxError(`Gubu: unexpected token ${head} in builder expression ${spec.src}`);
        }
    }
    if ('(' === spec.tokens[spec.i]) {
        spec.i++;
        let t = null;
        while (null != (t = spec.tokens[spec.i]) && ')' !== t) {
            // console.log('ARG', spec.i, t)
            let ev = expr(spec);
            // console.log('ARG-RES', spec.i, t, ev)
            args.push(ev);
        }
        spec.i++;
    }
    // console.log('CALL', currentIsNode, fn.name, current, args)
    // g = fn.call(current, ...args)
    if (!currentIsNode) {
        g = fn.call(undefined, ...args);
    }
    else {
        g = fn.call(current, ...args);
    }
    // console.log('CALL-RES', g)
    if ('.' === spec.tokens[spec.i]) {
        // spec.g.m.ti$ = spec.i - 1
        spec.i++;
        // console.log('DOWN-DOT')
        g = expr(spec, g);
    }
    // else if (top && spec.i < spec.tokens.length) {
    else if (top && spec.i < spec.tokens.length) {
        // spec.g.m.ti$ = spec.i - 1
        // console.log('DOWN-LEN', spec.i, spec.tokens[spec.i])
        g = expr(spec, g);
    }
    // console.log('RES-OUT', stringify(g), g)
    return g;
}
function build(v, top = true) {
    let out;
    const t = Array.isArray(v) ? 'array' : null === v ? 'null' : typeof v;
    if ('string' === t) {
        out = expr(v);
    }
    else if (S.object === t) {
        out = Object.entries(v).reduce((a, n) => {
            a[n[0]] = '$$' === n[0] ? n[1] : build(n[1], false);
            return a;
        }, {});
    }
    else if (S.array === t) {
        out = v.map((n) => build(n, false));
    }
    if (top) {
        // console.log('BUILD OUT')
        // console.dir(out, { depth: null })
        let opts = { keyspec: { active: true } };
        let g = Gubu(out, opts);
        return g;
    }
    return out;
}
function handleValidate(vf, s) {
    let update = {};
    let valid = false;
    let thrown;
    try {
        // Check does not have to deal with `undefined`
        valid = undefined === s.val && (vf.gubu$?.Check) ? true :
            (s.check = vf, vf(s.val, update, s));
    }
    catch (ve) {
        thrown = ve;
    }
    let hasErrs = isarr(update.err) ? 0 < update.err.length : null != update.err;
    if (!valid || hasErrs) {
        // Skip allows undefined
        if (undefined === s.val && (s.node.p || !s.node.r) && true !== update.done) {
            delete update.err;
            return update;
        }
        let w = update.why || S.check;
        let p = pathstr(s);
        if (S.string === typeof (update.err)) {
            s.curerr.push(makeErr(s, update.err));
        }
        else if (S.object === typeof (update.err)) {
            // Assumes makeErr already called
            s.curerr.push(...[update.err].flat().filter(e => null != e).map((e) => {
                e.p = null == e.p ? p : e.p;
                e.m = null == e.m ? 2010 : e.m;
                return e;
            }));
        }
        else {
            let fname = vf.name;
            if (null == fname || '' == fname) {
                fname = truncate(vf.toString().replace(/[ \t\r\n]+/g, ' '));
            }
            s.curerr.push(makeErrImpl(w, s, 1045, undefined, { thrown }, fname));
        }
        update.done = null == update.done ? true : update.done;
    }
    // Use uval for undefined and NaN
    if (update.hasOwnProperty('uval')) {
        s.updateVal(update.uval);
        s.ignoreVal = false;
    }
    else if (undefined !== update.val && !Number.isNaN(update.val)) {
        s.updateVal(update.val);
        s.ignoreVal = false;
    }
    if (undefined !== update.node) {
        s.node = update.node;
    }
    if (undefined !== update.type) {
        s.type = update.type;
    }
    return update;
}
// Create string description of property path, using "dot notation".
function pathstr(s) {
    return s.path.slice(1, s.dI + 1).filter(p => null != p).join('.');
}
function valueLen(val) {
    return S.number === typeof (val) ? val :
        S.number === typeof (val?.length) ? val.length :
            null != val && S.object === typeof (val) ? keys(val).length :
                NaN;
}
function truncate(str, len) {
    let strval = String(str);
    let outlen = null == len || isNaN(len) ? 30 : len < 0 ? 0 : ~~len;
    let strlen = null == str ? 0 : strval.length;
    let substr = null == str ? '' : strval.substring(0, strlen);
    substr = outlen < strlen ? substr.substring(0, outlen - 3) + '...' : substr;
    return substr.substring(0, outlen);
}
// Builder Definitions
// ===================
// Value is required.
const Required = function (shape) {
    let node = buildize(this, shape);
    // console.log('AAA', node)
    node.r = true;
    node.p = false;
    if (undefined === shape) {
        node.f = undefined;
        // Handle an explicit undefined.
        if (1 === arguments.length) {
            node.t = S.undefined;
            node.v = undefined;
        }
    }
    // Required(foo) by itself does set default value = foo,
    // which might then be used later. But if chained, the default cannot survive.
    else if (this?.$?.gubu$) {
        node.f = undefined;
    }
    return node;
};
exports.Required = Required;
// Value can contain additional undeclared properties.
const Open = function (shape) {
    let node = buildize(this, shape);
    node.c = Any();
    return node;
};
exports.Open = Open;
// Value is optional.
const Optional = function (shape) {
    let node = buildize(this, shape);
    node.r = false;
    // Handle an explicit undefined.
    if (undefined === shape && 1 === arguments.length) {
        node.t = S.undefined;
        node.v = undefined;
    }
    return node;
};
exports.Optional = Optional;
// Value can be anything.
const Any = function (shape) {
    let node = buildize(this, shape);
    node.t = S.any;
    if (undefined !== shape) {
        node.v = shape;
        node.f = shape;
    }
    return node;
};
exports.Any = Any;
// Custom error message.
const Fault = function (msg, shape) {
    let node = buildize(this, shape);
    node.z = msg;
    return node;
};
exports.Fault = Fault;
// Value is skipped if not present (optional, but no default).
const Skip = function (shape) {
    let node = buildize(this, shape);
    node.r = false;
    // Do not insert empty arrays and objects.
    node.p = true;
    return node;
};
exports.Skip = Skip;
// Errors for this value are ignored, and the value is undefined.
const Ignore = function (shape) {
    let node = buildize(this, shape);
    node.r = false;
    // Do not insert empty arrays and objects.
    node.p = true;
    node.e = false;
    node.a.push(function Ignore(_val, update, state) {
        if (0 < state.curerr.length) {
            update.uval = undefined;
            update.done = false;
        }
        return true;
    });
    return node;
};
exports.Ignore = Ignore;
// Value must be a function.
const Func = function (shape) {
    let node = buildize(this);
    node.t = S.function;
    node.v = shape;
    node.f = shape;
    return node;
};
exports.Func = Func;
// Specify default value.
const Default = function (dval, shape) {
    // console.log('AAA', this, shape)
    let node = buildize(this, dval);
    // console.log('BBB', node)
    if (undefined !== shape) {
        node = buildize(node, shape);
    }
    // console.log('CCC', node)
    node.r = false;
    node.f = dval;
    if (undefined === shape) {
        let t = typeof dval;
        if (S.function === t && IS_TYPE[dval.name]) {
            node.t = dval.name.toLowerCase();
            node.f = clone(EMPTY_VAL[node.t]);
        }
    }
    else {
        const sn = nodize(shape);
        node.t = sn.t;
    }
    // Always insert default.
    node.p = false;
    return node;
};
exports.Default = Default;
// String can be empty.
const Empty = function (shape) {
    let node = buildize(this, shape);
    node.u.empty = true;
    return node;
};
exports.Empty = Empty;
// Value will never match anything.
const Never = function (shape) {
    let node = buildize(this, shape);
    node.t = S.never;
    return node;
};
exports.Never = Never;
// Inject the key path of the value.
// OR: provide validation of Key - depth could also be a RegExp
const Key = function (depth, join) {
    let node = buildize(this);
    let ascend = S.number === typeof depth;
    node.t = S.string;
    if (ascend && null == join) {
        node = nodize([]);
    }
    let custom = null;
    if (S.function === typeof depth) {
        custom = depth;
        node = Any();
    }
    node.b.push(function Key(_val, update, state) {
        if (custom) {
            update.val = custom(state.path, state);
        }
        else if (ascend) {
            let d = depth;
            update.val = state.path.slice(state.path.length - 1 - (0 <= d ? d : 0), state.path.length - 1 + (0 <= d ? 0 : 1));
            if (S.string === typeof join) {
                update.val = update.val.join(join);
            }
        }
        else if (null == depth) {
            update.val = state.path[state.path.length - 2];
        }
        return true;
    });
    return node;
};
exports.Key = Key;
// Pass only if all match. Does not short circuit (as defaults may be missed).
const All = function (...inshapes) {
    const node = buildize(this);
    node.t = S.list;
    node.r = true;
    const shapes = inshapes.map(s => Gubu(s));
    node.u.list = shapes.map(g => g.node());
    const validator = function All(val, update, state) {
        let pass = true;
        // let err: any = []
        for (let shape of shapes) {
            let subctx = { ...state.ctx, err: [] };
            shape(val, subctx);
            if (0 < subctx.err.length) {
                pass = false;
            }
        }
        if (!pass) {
            update.why = S.All;
            update.err = [
                makeErr(state, S.Value + ' ' + S.$VALUE + S.forprop + S.$PATH +
                    ' does not satisfy all of: ' +
                    `${inshapes.map(x => stringify(x, null, true)).join(', ')}`)
            ];
        }
        return pass;
    };
    validator.a = inshapes;
    // validator.s = () => S.All + '(' + inshapes.map((s: any) => stringify(s)).join(',') + ')'
    node.b.push(validator);
    return node;
};
exports.All = All;
// Pass if some match. Note: all are evaluated, does not short circuit. This ensures
// defaults are not missed.
const Some = function (...inshapes) {
    let node = buildize(this);
    node.t = S.list;
    node.r = true;
    let shapes = inshapes.map(s => Gubu(s));
    // node.u.list = inshapes
    node.u.list = shapes.map(g => g.node());
    node.b.push(function Some(val, update, state) {
        let pass = false;
        for (let shape of shapes) {
            let subctx = { ...state.ctx, err: [] };
            let match = shape.match(val, subctx);
            if (match) {
                update.val = shape(val, subctx);
            }
            pass || (pass = match);
        }
        if (!pass) {
            update.why = S.Some;
            update.err = [
                makeErr(state, S.Value + ' ' + S.$VALUE + S.forprop + S.$PATH +
                    ' does not satisfy any of: ' +
                    `${inshapes.map(x => stringify(x, null, true)).join(', ')}`)
            ];
        }
        return pass;
    });
    return node;
};
exports.Some = Some;
// Pass if exactly one matches. Does not short circuit (as defaults may be missed).
const One = function (...inshapes) {
    let node = buildize(this);
    node.t = S.list;
    node.r = true;
    let shapes = inshapes.map(s => Gubu(s));
    // node.u.list = inshapes
    node.u.list = shapes.map(g => g.node());
    node.b.push(function One(val, update, state) {
        let passN = 0;
        for (let shape of shapes) {
            let subctx = { ...state.ctx, err: [] };
            if (shape.match(val, subctx)) {
                passN++;
                update.val = shape(val, subctx);
                // TODO: update docs - short circuits!
                break;
            }
        }
        if (1 !== passN) {
            update.why = S.One;
            update.err = [
                makeErr(state, S.Value + ' ' + S.$VALUE + S.forprop + S.$PATH +
                    ' does not satisfy one of: ' +
                    `${inshapes.map(x => stringify(x, null, true)).join(', ')}`)
            ];
        }
        return true;
    });
    return node;
};
exports.One = One;
// Value must match excatly one of the literal values provided.
const Exact = function (...vals) {
    const node = buildize(this);
    const validator = function Exact(val, update, state) {
        for (let i = 0; i < vals.length; i++) {
            if (val === vals[i]) {
                return true;
            }
        }
        const hasDftl = state.node.hasOwnProperty('f');
        // console.log('QQQ', hasDftl, val, state.node.f)
        if (hasDftl && undefined === val) {
            const valDftl = state.node.f;
            for (let i = 0; i < vals.length; i++) {
                if (valDftl === vals[i]) {
                    return true;
                }
            }
        }
        update.err =
            makeErr(state, S.Value + ' ' + S.$VALUE + S.forprop + S.$PATH + ' must be exactly one of: ' +
                vals.map((v) => stringify(v, null, true)).join(', '));
        update.done = true;
        return false;
    };
    validator.a = vals;
    validator.s =
        () => S.Exact + '(' + vals.map((v) => stringify(v, null, true)).join(',') + ')';
    node.b.push(validator);
    return node;
};
exports.Exact = Exact;
// Define a custom operation to run before standard matching.
const Before = function (validate, shape) {
    let node = buildize(this, shape);
    node.b.push(validate);
    return node;
};
exports.Before = Before;
// Define a custom operation to run after standard matching.
const After = function (validate, shape) {
    let node = buildize(this, shape);
    node.a.push(validate);
    return node;
};
exports.After = After;
// Define a customer validation function.
const Check = function (check, shape) {
    let node = buildize(this, shape);
    node.r = true;
    if (S.function === typeof check) {
        let c$ = check;
        c$.gubu$ = c$.gubu$ || {};
        c$.gubu$.Check = true;
        c$.s = () => S.Check + '(' + stringify(check, null, true) + ')';
        node.b.push(check);
        node.t = S.check;
    }
    else if (S.object === typeof check) {
        let dstr = Object.prototype.toString.call(check);
        if (dstr.includes('RegExp')) {
            let refn = (v) => (null == v || Number.isNaN(v)) ? false : !!String(v).match(check);
            defprop(refn, S.name, {
                value: String(check)
            });
            defprop(refn, 'gubu$', { value: { Check: true } });
            refn.s = () => S.Check + '(' + stringify(check, null, true) + ')';
            node.b.push(refn);
            node.t = S.check;
        }
    }
    // string is type name.
    // TODO: validate check is ValType
    else if (S.string === typeof check) {
        node.t = check;
    }
    if (undefined !== shape) {
        const sn = nodize(shape);
        node.t = sn.t;
    }
    return node;
};
exports.Check = Check;
// Value cannot contain undeclared properties or elements.
const Closed = function (shape) {
    let node = buildize(this, shape);
    // Makes one element array fixed.
    if (S.array === node.t && undefined !== node.c && 0 === node.n) {
        node.v = [node.c];
    }
    node.c = undefined;
    return node;
};
exports.Closed = Closed;
// Define a named reference to this value. See Refer.
const Define = function (inopts, shape) {
    let node = buildize(this, shape);
    let opts = S.object === typeof inopts ? inopts || {} : {};
    let name = S.string === typeof inopts ? inopts : opts.name;
    if (null != name && '' != name) {
        node.b.push(function Define(_val, _update, state) {
            let ref = state.ctx.ref = state.ctx.ref || {};
            ref[name] = state.node;
            return true;
        });
    }
    return node;
};
exports.Define = Define;
// TODO: copy option to copy value instead of node - need index of value in stack
// Inject a referenced value. See Define.
const Refer = function (inopts, shape) {
    let node = buildize(this, shape);
    let opts = S.object === typeof inopts ? inopts || {} : {};
    let name = S.string === typeof inopts ? inopts : opts.name;
    // Fill should be false (the default) if used recursively, to prevent loops.
    let fill = !!opts.fill;
    if (null != name && '' != name) {
        node.b.push(function Refer(val, update, state) {
            if (undefined !== val || fill) {
                let ref = state.ctx.ref = state.ctx.ref || {};
                if (undefined !== ref[name]) {
                    let node = { ...ref[name] };
                    node.t = node.t || S.never;
                    update.node = node;
                    update.type = node.t;
                }
            }
            // TODO: option to fail if ref not found?
            return true;
        });
    }
    return node;
};
exports.Refer = Refer;
// TODO: no mutate is State.match
// Rename a property.
const Rename = function (inopts, shape) {
    let node = buildize(this, shape);
    let opts = S.object === typeof inopts ? inopts || {} : {};
    let name = S.string === typeof inopts ? inopts : opts.name;
    let keep = S.boolean === typeof opts.keep ? opts.keep : undefined;
    // NOTE: Rename claims are experimental.
    let claim = isarr(opts.claim) ? opts.claim : [];
    if (null != name && '' != name) {
        // If there is a claim, grab the value so that validations
        // can be applied to it.
        let before = (val, update, s) => {
            if (undefined === val && 0 < claim.length) {
                s.ctx.Rename = (s.ctx.Rename || {});
                s.ctx.Rename.fromDflt = (s.ctx.Rename.fromDflt || {});
                for (let cn of claim) {
                    let fromDflt = s.ctx.Rename.fromDflt[cn] || {};
                    // Only use claim if it was not a default value.
                    if (undefined !== s.parent[cn] && !fromDflt.yes) {
                        update.val = s.parent[cn];
                        if (!s.match) {
                            s.parent[name] = update.val;
                        }
                        update.node = fromDflt.node;
                        // Old errors on the claimed value are no longer valid.
                        for (let eI = 0; eI < s.err.length; eI++) {
                            if (s.err[eI].k === fromDflt.key) {
                                s.err.splice(eI, 1);
                                eI--;
                            }
                        }
                        if (!keep) {
                            delete s.parent[cn];
                        }
                        else {
                            let j = s.cI + 1;
                            // Add the default to the end of the node set to ensure it
                            // is properly validated.
                            s.nodes.splice(j, 0, nodize(fromDflt.dval));
                            s.vals.splice(j, 0, undefined);
                            s.parents.splice(j, 0, s.parent);
                            s.keys.splice(j, 0, cn);
                            s.nI++;
                            s.pI++;
                        }
                        break;
                    }
                }
                if (undefined === update.val) {
                    update.val = s.node.v;
                }
            }
            return true;
        };
        defprop(before, S.name, { value: 'Rename:' + name });
        node.b.push(before);
        let after = (val, update, s) => {
            s.parent[name] = val;
            if (!s.match &&
                !keep &&
                s.key !== name &&
                // Arrays require explicit deletion as validation is based on index
                // and will be lost.
                !(isarr(s.parent) && false !== keep)) {
                delete s.parent[s.key];
                update.done = true;
            }
            s.ctx.Rename = (s.ctx.Rename || {});
            s.ctx.Rename.fromDflt = (s.ctx.Rename.fromDflt || {});
            s.ctx.Rename.fromDflt[name] = {
                yes: s.fromDflt,
                key: s.key,
                dval: s.node.v,
                node: s.node
            };
            return true;
        };
        defprop(after, S.name, { value: 'Rename:' + name });
        node.a.push(after);
    }
    return node;
};
exports.Rename = Rename;
// Children must have a specified shape.
const Child = function (child, shape) {
    // console.log('NEW CHILD', this, child, shape)
    // Child provides implicit open object if no shape defined.
    let node = buildize(this, shape);
    // console.log('CHILD A', node, child, shape)
    node.c = nodize(child);
    // console.log('CHILD B', node)
    if (undefined === node.v) {
        node.t = 'object';
        node.v = {};
        node.f = {};
    }
    // console.log('CHILD OUT', node)
    return node;
};
exports.Child = Child;
const Rest = function (child, shape) {
    let node = buildize(this, shape || []);
    node.t = 'array';
    node.c = nodize(child);
    node.m = node.m || {};
    node.m.rest = true;
    return node;
};
exports.Rest = Rest;
const Type = function (tname, shape) {
    let tnat = nodize(TNAT[tname]);
    // console.log('TYPE', tname, tnat)
    let node = buildize(this, shape);
    if (node !== tnat) {
        node.t = tnat.t;
        node.r = tnat.r;
        node.p = tnat.p;
        node.v = tnat.v;
    }
    return node;
};
exports.Type = Type;
// Size Builders: Min, Max, Above, Below, Len
// ==========================================
function makeSizeBuilder(self, size, shape, name, valid) {
    // console.log('SIZE', self, size, shape, name)
    let node = buildize(self, shape);
    // console.log('SB', node)
    size = +size;
    let validator = function (val, update, state) {
        return valid(valueLen(val), size, val, update, state);
    };
    Object.defineProperty(validator, S.name, { value: name });
    validator.a = [size];
    validator.s = () => name + '(' + size + ')';
    validator[Symbol.for('nodejs.util.inspect.custom')] = validator.s();
    validator.toJSON = () => validator.s();
    node.b.push(validator);
    // console.log('NODE', node)
    return node;
}
// Specific a minimum value or length.
const Min = function (min, shape) {
    // console.log('MIN', this, min, shape)
    return makeSizeBuilder(this, min, shape, S.Min, (vsize, min, val, update, state) => {
        if (min <= vsize) {
            return true;
        }
        state.checkargs = { min: 1 };
        let errmsgpart = S.number === typeof (val) ? '' : 'length ';
        update.err =
            makeErr(state, S.Value + ' ' + S.$VALUE + S.forprop + S.$PATH +
                ` must be a minimum ${errmsgpart}of ${min} (was ${vsize}).`);
        return false;
    });
};
exports.Min = Min;
// Specific a maximum value or length.
const Max = function (max, shape) {
    // console.log('MAX', this, max, shape)
    return makeSizeBuilder(this, max, shape, S.Max, (vsize, max, val, update, state) => {
        if (vsize <= max) {
            return true;
        }
        let errmsgpart = S.number === typeof (val) ? '' : 'length ';
        update.err =
            makeErr(state, S.Value + ' ' + S.$VALUE + S.forprop + S.$PATH +
                ` must be a maximum ${errmsgpart}of ${max} (was ${vsize}).`);
        return false;
    });
};
exports.Max = Max;
// Specify a lower bound value or length.
const Above = function (above, shape) {
    return makeSizeBuilder(this, above, shape, S.Above, (vsize, above, val, update, state) => {
        if (above < vsize) {
            return true;
        }
        let errmsgpart = S.number === typeof (val) ? 'be' : 'have length';
        update.err =
            makeErr(state, S.Value + ' ' + S.$VALUE + S.forprop + S.$PATH +
                ` must ${errmsgpart} above ${above} (was ${vsize}).`);
        return false;
    });
};
exports.Above = Above;
// Specify an upper bound value or length.
const Below = function (below, shape) {
    return makeSizeBuilder(this, below, shape, S.Below, (vsize, below, val, update, state) => {
        if (vsize < below) {
            return true;
        }
        let errmsgpart = S.number === typeof (val) ? 'be' : 'have length';
        update.err =
            makeErr(state, S.Value + ' ' + S.$VALUE + S.forprop + S.$PATH +
                ` must ${errmsgpart} below ${below} (was ${vsize}).`);
        return false;
    });
};
exports.Below = Below;
// Value must have a specific length.
const Len = function (len, shape) {
    return makeSizeBuilder(this, len, shape, S.Below, (vsize, len, val, update, state) => {
        if (len === vsize) {
            return true;
        }
        let errmsgpart = S.number === typeof (val) ? '' : ' in length';
        update.err =
            makeErr(state, S.Value + ' ' + S.$VALUE + S.forprop + S.$PATH +
                ` must be exactly ${len}${errmsgpart} (was ${vsize}).`);
        return false;
    });
};
exports.Len = Len;
// Make a Node chainable with Builder methods.
function buildize(self, shape) {
    // Detect chaining. If not chained, ignore `this` if it is the global context.
    let globalNode = null != self && (self.window === self || self.global === self);
    let node;
    if ((undefined === self || globalNode) && undefined !== shape) {
        // console.log('BUILDIZE-SHAPE', shape)
        node = nodize(shape);
    }
    else if (undefined !== self && !globalNode) {
        // console.log('BUILDIZE-NODE', self, shape)
        // Merge self into shape, retaining previous chained builders.
        if (undefined !== shape) {
            node = nodize(shape);
            let selfNode = nodize(self);
            //console.log('BUILDER-MERGE', node, selfNode)
            //console.log('BUILDER-NODEV', node.v)
            // TODO: need a more robust way to prevent Builders breaking each other.
            if (undefined === node.v && 'list' !== node.t) {
                node.v = selfNode.v;
                node.t = selfNode.t;
            }
            ;
            ['f', 'r', 'p', 'c', 'e', 'z'].map((pn) => node[pn] = undefined !== selfNode[pn] ? selfNode[pn] : node[pn]);
            node.u = Object.assign({ ...selfNode.u }, node.u);
            node.m = Object.assign({ ...selfNode.m }, node.m);
            node.a = selfNode.a.concat(node.a);
            node.b = selfNode.b.concat(node.b);
            // console.log('BUILDER-DONE', node)
        }
        else {
            node = nodize(self);
        }
    }
    else {
        node = nodize(undefined);
    }
    // console.log('BUILDIZE-OUT', node)
    // let base = (null == self || globalNode) ? shape : self
    // let over = (null == node1 || base === node1) ? undefined : node1
    // console.log('BZ', base, over)
    // let node = nodize(base)
    // if (undefined !== over) {
    //   let onode = nodize(over)
    //   node.t = onode.t
    //   node.v = onode.v
    //   node.f = onode.f
    // }
    // console.log('BZ out', node)
    // Only add chainable Builders.
    // NOTE: One, Some, All not chainable.
    return node.Above ? node : Object.assign(node, {
        Above,
        After,
        Any,
        Before,
        Below,
        Check,
        Child,
        Closed,
        Default,
        Define,
        Empty,
        Exact,
        Fault,
        Ignore,
        Len,
        Max,
        Min,
        Never,
        Open,
        Refer,
        Rename,
        Required,
        Rest,
        Skip,
        Type,
    });
}
// External utility to make ErrDesc objects.
function makeErr(state, text, why, user) {
    return makeErrImpl(why || S.check, state, 4000, text, user);
}
// TODO: optional message prefix from ctx
// Internal utility to make ErrDesc objects.
function makeErrImpl(why, s, mark, text, user, fname) {
    let err = {
        k: s.key,
        n: s.node,
        v: s.val,
        p: pathstr(s),
        w: why,
        c: s.check?.name || 'none',
        a: s.checkargs || {},
        m: mark,
        t: '',
        u: user || {},
    };
    let jstr = undefined === s.val ? S.undefined : stringify(s.val);
    let valstr = truncate(jstr.replace(/"/g, ''));
    text = text || s.node.z;
    if (null == text || '' === text) {
        let valkind = valstr.startsWith('[') ? S.array :
            valstr.startsWith('{') ? S.object :
                (null == s.val || (S.number === typeof s.val && isNaN(s.val))
                    ? 'value' : (typeof s.val));
        let propkind = (valstr.startsWith('[') || isarr(s.parents[s.pI])) ?
            'index' : 'property';
        let propkindverb = 'is';
        let propkey = user?.k;
        propkey = isarr(propkey) ?
            (propkind = (1 < propkey.length ?
                (propkindverb = 'are', 'properties') : propkind),
                propkey.join(', ')) :
            propkey;
        err.t = `Validation failed for ` +
            (0 < err.p.length ? `${propkind} "${err.p}" with ` : '') +
            `${valkind} "${valstr}" because ` +
            (S.type === why ?
                (S.instance === s.node.t ?
                    `the ${valkind} is not an instance of ${s.node.u.n}` :
                    `the ${valkind} is not of type ${S.regexp === s.node.t ? S.string : s.node.t}`)
                :
                    S.required === why ?
                        ('' === s.val ?
                            'an empty string is not allowed'
                            :
                                `the ${valkind} is required`)
                        :
                            'closed' === why ?
                                `the ${propkind} "${propkey}" ${propkindverb} not allowed`
                                :
                                    S.regexp === why ?
                                        'the string did not match ' + s.node.v
                                        :
                                            S.never === why ?
                                                'no value is allowed'
                                                :
                                                    `check "${null == fname ? why : fname}" failed`)
            + (err.u.thrown ? ' (threw: ' + err.u.thrown.message + ')' : '.');
    }
    else {
        err.t = text
            .replace(/\$VALUE/g, valstr)
            .replace(/\$PATH/g, err.p);
    }
    return err;
}
// Convert Node to JSON suitable for Gubu.build.
function node2json(n) {
    let t = n.t;
    const fixed = {
        number: S.Number,
        string: S.String,
        boolean: S.Boolean,
    };
    if (fixed[t]) {
        let s = '';
        if (n.r) {
            s += fixed[t];
        }
        if ('' === s) {
            s = JSON.stringify(n.v);
        }
        s += n.b.map((v) => v.s ? ('.' + v.s(n)) : '').join('');
        return s;
    }
    else if (S.any === t) {
        let s = '';
        if (n.r) {
            s += 'Required()';
        }
        if ('any' == n.c?.t) {
            s += ('' === s ? '' : '.') + 'Open()';
        }
        s += n.b.map((v) => v.s ? ('.' + v.s(n)) : '').join('');
        if (s.startsWith('.')) {
            s = s.slice(1);
        }
        if ('' === s) {
            s = 'Any()';
        }
        return s;
    }
    else if (S.check === t) {
        let s = '';
        // Required is implicit with Check
        s += n.b.map((v) => v.s ? ('.' + v.s(n)) : '').join('');
        if (s.startsWith('.')) {
            s = s.slice(1);
        }
        // console.log('N2J CHECK', n, s)
        return s;
    }
    else if (S.object === t) {
        let o = {};
        for (let k in n.v) {
            o[k] = node2json(n.v[k]);
        }
        if (undefined !== n.c) {
            if (fixed[n.c.t]) {
                o.$$ = 'Child(' + fixed[n.c.t] + ')';
            }
            else if ('any' === n.c.t) {
                o.$$ = 'Open()';
            }
            else {
                o.$$ = 'Child($$child)';
                o.$$child = node2json(n.c);
            }
        }
        if (0 < n.b.length) {
            if (undefined === o.$$) {
                o.$$ = '';
            }
            o.$$ += n.b.map((v) => v.s ? ('.' + v.s(n)) : '').join('');
            if (o.$$.startsWith('.')) {
                o.$$ = o.$$.slice(1);
            }
        }
        // naturalize, since `Child(Number)` implies `Child(Number,{})`
        if (o.$$ && 1 === Object.keys(o).length && o.$$.startsWith('Child')) {
            return o.$$;
        }
        return o;
    }
    else if ('list' === t) {
        // TODO: fix for refs in main loop when validating
        // make this work: build({ a: { '$$': 'One(Number,$$ref0)', '$$ref0': { x: '1' } } })
        let refs = {};
        let rI = 0;
        let list = n.u.list
            .map((n) => node2json(n))
            .map((n, _) => S.object === typeof n ? (refs[_ = '$$ref' + (rI++)] = n, _) : n);
        let s = n.b[0].name + '(' + list.join(',') + ')';
        return 0 === rI ? s : { $$: s, ...refs };
    }
    else if ('array' === t) {
        let a = [];
        if (undefined !== n.c) {
            a[0] = node2json(n.c);
        }
        else {
            a = Object.keys(n.v)
                .reduce((a, i) => (a[+i] = n.v[i], a), [])
                .map((n) => node2json(n));
        }
        return a;
    }
}
function stringify(src, replacer, dequote, expand) {
    let str;
    const use_node2str = !expand &&
        !!(src && src.$) && (GUBU$ === src.$.gubu$ || true === src.$.gubu$);
    // console.log('SRC-A', use_node2str, !expand, !!(src && src.$), GUBU$ === src?.$?.gubu$)
    // console.trace()
    if (use_node2str) {
        // src = node2str(src)
        src = JSON.stringify(node2json(src));
        // console.log('SRC-B', src)
        if (dequote) {
            src = 'string' === typeof src ? src.replace(/\\/g, '').replace(/"/g, '') : '';
        }
        return src;
    }
    // console.log('SRC-C', src)
    try {
        str = JS(src, (key, val) => {
            // console.log('AAA', key, val)
            if (replacer) {
                val = replacer(key, val);
            }
            if (null != val &&
                S.object === typeof (val) &&
                val.constructor &&
                S.Object !== val.constructor.name &&
                S.Array !== val.constructor.name) {
                // console.log('AAA', key, val)
                let strdesc = toString.call(val);
                if ('[object RegExp]' === strdesc) {
                    val = val.toString();
                }
                else {
                    val =
                        S.function === typeof val.toString ? val.toString() : val.constructor.name;
                }
            }
            else if (!expand && GUBU$ === val?.$?.gubu$) {
                if ('number' === val.t || 'string' === val.t || 'boolean' === val.t) {
                    val = val.v;
                }
                else {
                    val = node2json(val);
                    // console.log('CCC', key, val, dequote, typeof val)
                    val = JSON.stringify(val);
                    if (dequote) {
                        val = 'string' === typeof val ? val.replace(/\\/g, '').replace(/"/g, '') : '';
                    }
                }
                // console.log('BBB', key, val, dequote)
            }
            else if (S.function === typeof (val)) {
                // console.log('BBB', key, val)
                if (S.function === typeof (make[val.name]) && isNaN(+key)) {
                    val = undefined;
                }
                else if (null != val.name && '' !== val.name) {
                    val = val.name;
                }
                else {
                    val = truncate(val.toString().replace(/[ \t\r\n]+/g, ' '));
                }
            }
            else if ('bigint' === typeof (val)) {
                // console.log('CCC', key, val)
                val = String(val.toString());
            }
            else if (Number.isNaN(val)) {
                // console.log('DDD', key, val)
                return 'NaN';
            }
            else if (true !== expand &&
                (true === val?.$?.gubu$ || GUBU$ === val?.$?.gubu$)) {
                // console.log('EEE', key, val)
                // val = node2str(val)
                val = JSON.stringify(node2json(val));
            }
            // console.log('WWW', key, val, typeof val)
            return val;
        });
        str = String(str);
    }
    catch (e) {
        str = JS(String(src));
    }
    if (true === dequote) {
        str = str.replace(/^"/, '').replace(/"$/, '');
    }
    // console.log('STR', str)
    return str;
}
function clone(x) {
    return null == x ? x : S.object !== typeof (x) ? x : JP(JS(x));
}
const G$ = (node) => nodize({
    ...node,
    $: { gubu$: true }
});
exports.G$ = G$;
const BuilderMap = {
    Above,
    After,
    All,
    Any,
    Before,
    Below,
    Check,
    Child,
    Closed,
    Default,
    Define,
    Empty,
    Exact,
    Fault,
    Func,
    Ignore,
    Key,
    Len,
    Max,
    Min,
    Never,
    One,
    Open,
    Optional,
    Refer,
    Rename,
    Required,
    Skip,
    Some,
    Rest,
    Type,
};
// Fix builder names after terser mangles them.
/* istanbul ignore next */
if (S.undefined !== typeof (window)) {
    for (let builderName in BuilderMap) {
        defprop(BuilderMap[builderName], S.name, { value: builderName });
    }
}
Object.assign(make, {
    Gubu: make,
    // Builders by name, allows `const { Open } = Gubu`.
    ...BuilderMap,
    // Builders by alias, allows `const { GOpen } = Gubu`, to avoid naming conflicts.
    ...(Object.entries(BuilderMap).reduce((a, n) => (a['G' + n[0]] = n[1], a), {})),
    isShape: (v) => (v && GUBU === v.gubu),
    G$,
    buildize,
    makeErr,
    stringify,
    truncate,
    nodize,
    expr,
    build,
    MakeArgu,
});
defprop(make, S.name, { value: S.gubu });
// The primary export.
const Gubu = make;
exports.Gubu = Gubu;
// "G" Namespaced builders for convenient use in case of conflicts.
const GAbove = Above;
exports.GAbove = GAbove;
const GAfter = After;
exports.GAfter = GAfter;
const GAll = All;
exports.GAll = GAll;
const GAny = Any;
exports.GAny = GAny;
const GBefore = Before;
exports.GBefore = GBefore;
const GBelow = Below;
exports.GBelow = GBelow;
const GCheck = Check;
exports.GCheck = GCheck;
const GChild = Child;
exports.GChild = GChild;
const GRest = Rest;
exports.GRest = GRest;
const GClosed = Closed;
exports.GClosed = GClosed;
const GDefault = Default;
exports.GDefault = GDefault;
const GDefine = Define;
exports.GDefine = GDefine;
const GEmpty = Empty;
exports.GEmpty = GEmpty;
const GExact = Exact;
exports.GExact = GExact;
const GFault = Fault;
exports.GFault = GFault;
const GFunc = Func;
exports.GFunc = GFunc;
const GIgnore = Ignore;
exports.GIgnore = GIgnore;
const GKey = Key;
exports.GKey = GKey;
const GLen = Len;
exports.GLen = GLen;
const GMax = Max;
exports.GMax = GMax;
const GMin = Min;
exports.GMin = GMin;
const GNever = Never;
exports.GNever = GNever;
const GOne = One;
exports.GOne = GOne;
const GOpen = Open;
exports.GOpen = GOpen;
const GOptional = Optional;
exports.GOptional = GOptional;
const GRefer = Refer;
exports.GRefer = GRefer;
const GRename = Rename;
exports.GRename = GRename;
const GRequired = Required;
exports.GRequired = GRequired;
const GSkip = Skip;
exports.GSkip = GSkip;
const GSome = Some;
exports.GSome = GSome;
const GType = Type;
exports.GType = GType;
function MakeArgu(prefix) {
    // TODO: caching, make arguments optionals
    return function Argu(args, whence, argSpec) {
        let partial = false;
        if (S.string === typeof args) {
            partial = true;
            argSpec = whence;
            whence = args;
        }
        argSpec = argSpec || whence;
        whence = S.string === typeof whence ? ' (' + whence + ')' : '';
        const shape = Gubu(argSpec, { prefix: prefix + whence });
        const top = shape.node();
        const keys = top.k;
        let inargs = args;
        let argmap = {};
        let kI = 0;
        let skips = 0;
        for (; kI < keys.length; kI++) {
            let kn = top.v[keys[kI]];
            // Skip in arg shape means a literal skip,
            // shifting all following agument elements down.
            if (kn.p) {
                // if (0 === kI) {
                kn = top.v[keys[kI]] =
                    ((kI) => After(function Skipper(_val, update, state) {
                        if (0 < state.curerr.length) {
                            skips++;
                            for (let sI = keys.length - 1; sI > kI; sI--) {
                                // Subtract kI as state.pI has already advanced kI along val list.
                                // If Rest, append to array at correct position.
                                if (top.v[keys[sI]].m.rest) {
                                    argmap[keys[sI]]
                                        .splice(top.v[keys[sI]].m.rest_pos + kI - sI, 0, argmap[keys[sI - 1]]);
                                }
                                else {
                                    state.vals[state.pI + sI - kI] = state.vals[state.pI + sI - kI - 1];
                                    argmap[keys[sI]] = argmap[keys[sI - 1]];
                                }
                            }
                            update.uval = undefined;
                            update.done = false;
                        }
                        return true;
                    }, kn))(kI);
                kn.e = false;
            }
            if (kI === keys.length - 1 && !top.v[keys[kI]].m.rest) {
                top.v[keys[kI]] = After(function ArgCounter(_val, update, state) {
                    if ((keys.length - skips) < inargs.length) {
                        if (0 === state.curerr.length) {
                            update.err =
                                `Too many arguments for type signature ` +
                                    `(was ${inargs.length}, expected ${keys.length - skips})`;
                        }
                        update.fatal = true;
                        return false;
                    }
                    return true;
                }, top.v[keys[kI]]);
            }
        }
        function buildArgMap(args) {
            for (let kI = 0; kI < keys.length; kI++) {
                let kn = top.v[keys[kI]];
                if (kn.m.rest) {
                    argmap[keys[kI]] = [...args].slice(kI);
                    kn.m.rest_pos = argmap[keys[kI]].length;
                }
                else {
                    argmap[keys[kI]] = args[kI];
                }
            }
            return argmap;
        }
        return partial ?
            function PartialArgu(args) {
                inargs = args;
                argmap = {};
                kI = 0;
                skips = 0;
                return shape(buildArgMap(args));
            } :
            shape(buildArgMap(args));
    };
}

},{"util":3}],2:[function(require,module,exports){
const { Gubu } = require('./gubu.js')
module.exports = Gubu

},{"./gubu.js":1}],3:[function(require,module,exports){

},{}]},{},[2])(2)
});

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./gubu.js":1,"util":2}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
module.exports={
  "name": "gubu",
  "version": "8.0.1",
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
    "test-web": "npm run build && npm run build-web && browserify -i util -o test/web.js -e test/entry.js -im && open test/web.test.html",
    "watch": "npm run version && tsc -w -d",
    "build": "npm run version && tsc -d",
    "build-web": "cp gubu.js gubu.min.js && browserify -i util -o gubu.min.js -e gubu.web.js -s Gubu -im",
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
    "@rollup/plugin-commonjs": "^26.0.1",
    "@types/jest": "^29.5.12",
    "browserify": "^17.0.0",
    "es-jest": "^2.1.0",
    "esbuild": "^0.23.0",
    "esbuild-jest": "^0.5.0",
    "jest": "^29.7.0",
    "tinyify": "^4.0.0",
    "ts-jest": "^29.1.5",
    "typescript": "^5.5.3",
    "vite": "^5.2.8",
    "vite-plugin-commonjs": "^0.10.1"
  },
  "overrides": {
    "acorn": "8.12.1"
  }
}

},{}],4:[function(require,module,exports){
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

},{"../gubu":1}],5:[function(require,module,exports){
"use strict";
/* Copyright (c) 2021-2023 Richard Rodger and other contributors, MIT License */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bar = exports.Foo = void 0;
const package_json_1 = __importDefault(require("../package.json"));
// Handle web (Gubu) versus node ({Gubu}) export.
let GubuModule = require('../gubu');
if (GubuModule.Gubu) {
    GubuModule = GubuModule.Gubu;
}
const Gubu = GubuModule;
const buildize = Gubu.buildize;
const makeErr = Gubu.makeErr;
const VERSION = package_json_1.default.version;
const { Above, After, All, Any, Before, Below, Check, Child, Closed, Default, Define, Empty, Exact, Func, Key, Len, Max, Min, Never, One, Open, Optional, Refer, Rename, Required, Skip, Some, Type, } = Gubu;
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
        expect(() => g0o(true))
            .toThrow('Value "true" for property "" does not satisfy one of: Number, String');
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
        ])).toThrow(`Value "{x:green,z:2,y:22}" for property "0" does not satisfy one of: {"x":"Exact(red)","y":"String"}, {"x":"Exact(green)","z":"Number"}
Value "{x:red,y:Y,z:YY}" for property "1" does not satisfy one of: {"x":"Exact(red)","y":"String"}, {"x":"Exact(green)","z":"Number"}`);
        expect(() => g2([
            { x: 'red', y: 3 },
            { x: 'green', z: 'Z' },
        ])).toThrow(`Value "{x:red,y:3}" for property "0" does not satisfy one of: {"x":"Exact(red)","y":"String"}, {"x":"Exact(green)","z":"Number"}
Value "{x:green,z:Z}" for property "1" does not satisfy one of: {"x":"Exact(red)","y":"String"}, {"x":"Exact(green)","z":"Number"}`);
    });
    test('builder-some', () => {
        let g0 = Gubu({ a: Some(Number, String) });
        expect(g0({ a: 1 })).toEqual({ a: 1 });
        expect(g0({ a: 'x' })).toEqual({ a: 'x' });
        expect(() => g0({ a: true }))
            .toThrow(`Value "true" for property "a" does not satisfy any of: Number, String`);
        expect(() => g0({}))
            .toThrow('Value "undefined" for property "a" does not satisfy any of: Number, String');
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
        expect(() => g2([true]))
            .toThrow(`Value "true" for property "0" does not satisfy any of: Number, String`);
        let g3 = Gubu({ a: [Some(Number, String)] });
        expect(g3({ a: [1] })).toEqual({ a: [1] });
        expect(g3({ a: ['x'] })).toEqual({ a: ['x'] });
        expect(g3({ a: ['x', 1, 'y', 2] })).toEqual({ a: ['x', 1, 'y', 2] });
        expect(() => g3({ a: [1, 2, true] }))
            .toThrow(`Value "true" for property "a.2" does not satisfy any of: Number, String`);
        let g4 = Gubu({ a: [Some(Open({ x: 1 }), Open({ x: 'X' }))] });
        expect(g4({ a: [{ x: 2 }, { x: 'Q' }, { x: 3, y: true }, { x: 'W', y: false }] }))
            .toEqual({ a: [{ x: 2 }, { x: 'Q' }, { x: 3, y: true }, { x: 'W', y: false }] });
        let g5 = Gubu({ a: [Some({ x: 1 }, Closed({ x: 'X' }))] });
        expect(g5({ a: [{ x: 2 }, { x: 'Q' }] }))
            .toEqual({ a: [{ x: 2 }, { x: 'Q' }] });
    });
    test('builder-all', () => {
        let g0 = Gubu(All(Open({ x: 1 }), Open({ y: 'a' })));
        expect(g0.stringify())
            .toEqual('{"$$":"All($$ref0,$$ref1)","$$ref0":{"x":"1","$$":"Open()"}' +
            ',"$$ref1":{"y":"\\"a\\"","$$":"Open()"}}');
        expect(g0({ x: 11, y: 'aa' })).toEqual({ x: 11, y: 'aa' });
        expect(g0({})).toEqual({ x: 1, y: 'a' });
        expect(() => g0({ x: 'b', y: 'a' })).toThrow('Value "{x:b,y:a}" for property "" does not satisfy all of:' +
            ' {x:1,$$:Open()}, {y:a,$$:Open()}');
        expect(() => g0()).toThrow('Validation failed for value "undefined" because the value is required.');
        let g0s = Gubu(All(Open({ x: 1 }), Open({ y: 'a' })).Skip());
        expect(g0s({ x: 11, y: 'aa' })).toEqual({ x: 11, y: 'aa' });
        expect(g0s({})).toEqual({ x: 1, y: 'a' });
        expect(() => g0s({ x: 'b', y: 'a' })).toThrow('Value "{x:b,y:a}" for property "" does not satisfy all of:' +
            ' {x:1,$$:Open()}, {y:a,$$:Open()}');
        expect(g0s()).toEqual(undefined);
        // TODO: Optional
        // expect(g0s()).toEqual({ x: 1, y: 'a' })
        let g1 = Gubu({
            a: All(Check((v) => v > 10), Check((v) => v < 20))
        });
        // console.dir(g1.spec(), { depth: null })
        expect(g1({ a: 11 })).toEqual({ a: 11 });
        expect(() => g1({ a: 0 })).toThrow('Value "0" for property "a" does not satisfy all of: ' +
            'Check((v) => v > 10), Check((v) => v < 20)');
        let g2 = Gubu(All({ x: 1, y: Any() }, { x: Any(), y: 'a' }));
        expect(g2({ x: 11, y: 'AA' })).toEqual({ x: 11, y: 'AA' });
        // g2({ x: 11, y: true })
        expect(() => g2({ x: 11, y: true }))
            .toThrow('Value "{x:11,y:true}" for property "" does not satisfy all of:' +
            ' {"x":1,"y":"Any()"}, {"x":"Any()","y":"a"}');
        let g3 = Gubu(All({ x: 1, y: Any() }, { x: Any(), y: { z: 'a' } }));
        expect(g3({ x: 11, y: { z: 'AA' } })).toEqual({ x: 11, y: { z: 'AA' } });
        expect(() => g3({ x: 11, y: { z: true } }))
            .toThrow('Value "{x:11,y:{z:true}}" for property "" does not satisfy all of:' +
            ' {"x":1,"y":"Any()"}, {"x":"Any()","y":{"z":"a"}}');
        let g4 = Gubu(All(Open({ x: 1 }), Open({ y: 2 })));
        expect(g4({ x: 11, y: 22 })).toEqual({ x: 11, y: 22 });
        expect(() => g4({ x: 'X', y: 'Y' })).toThrow('Value "{x:X,y:Y}" for property "" does not satisfy all of:' +
            ' {x:1,$$:Open()}, {y:2,$$:Open()}');
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
    test('builder-type', () => {
        let d0 = Gubu({
            a: Type('Number')
        });
        expect(d0.stringify(null, true)).toEqual('{"a":"Number"}');
        expect(d0({ a: 1 })).toEqual({ a: 1 });
        expect(() => d0({ a: 'A' })).toThrow('not of type number');
    });
    test('compose-minmax', () => {
        let cs = Symbol.for('nodejs.util.inspect.custom');
        let g0 = Gubu(Min(1, Max(3)));
        expect(g0(2)).toEqual(2);
        expect(g0.stringify()).toEqual('Max(3).Min(1)');
        expect((g0.node()[cs]()))
            .toEqual('{t:any n:0 r:false p:false d:0 k:[] e:true u:{} a:[] b:[Max(3) Min(1)] m:{}}');
        let g1 = Gubu(Max(3, Min(1)));
        expect(g1(2)).toEqual(2);
        expect(g1.stringify()).toEqual('Min(1).Max(3)');
        expect((g1.node()[cs]()))
            .toEqual('{t:any n:0 r:false p:false d:0 k:[] e:true u:{} a:[] b:[Min(1) Max(3)] m:{}}');
        let g2 = Gubu(Min(1, Max(3, 2)));
        expect(g2(2)).toEqual(2);
        expect(g2.stringify()).toEqual('2.Max(3).Min(1)');
        expect((g2.node()[cs]()))
            .toEqual('{t:number v:2 f:2 n:0 r:false p:false d:0 k:[] e:true' +
            ' u:{} a:[] b:[Max(3) Min(1)] m:{}}');
        let g3 = Gubu(Max(3).Min(1));
        expect(g3(2)).toEqual(2);
        expect(g3.stringify()).toEqual('Max(3).Min(1)');
        expect((g3.node()[cs]()))
            .toEqual('{t:any n:0 r:false p:false d:0 k:[] e:true' +
            ' u:{} a:[] b:[Max(3) Min(1)] m:{}}');
        let g4 = Gubu(Max(3, 2).Min(1));
        expect(g4(2)).toEqual(2);
        expect(g4.stringify()).toEqual('2.Max(3).Min(1)');
        expect((g4.node()[cs]()))
            .toEqual('{t:number v:2 f:2 n:0 r:false p:false d:0 k:[] e:true' +
            ' u:{} a:[] b:[Max(3) Min(1)] m:{}}');
        let g5 = Gubu(Min(1, 2).Max(3));
        expect(g5(2)).toEqual(2);
        expect(g5.stringify()).toEqual('2.Min(1).Max(3)');
        expect(g5.node()[cs]())
            .toEqual('{t:number v:2 f:2 n:0 r:false p:false d:0 k:[] e:true' +
            ' u:{} a:[] b:[Min(1) Max(3)] m:{}}');
        let g6 = Gubu(Min(1, { x: 11 }).Max(3));
        expect(g6({ x: 22 })).toEqual({ x: 22 });
        expect(g6.stringify()).toEqual('{"x":"11","$$":"Min(1).Max(3)"}');
        expect((g6.node()[cs]()))
            .toEqual('{t:object v:{x:{$:{v$:' + VERSION + '} t:number v:11 f:11 n:0 r:false p:false d:1 k:[]' +
            ' e:true u:{} a:[] b:[] m:{}}} n:1 r:false p:false d:0 k:[x] e:true u:{} a:[]' +
            ' b:[Min(1) Max(3)] m:{}}');
        let g7 = Gubu(Min(1).Max(3, { x: 11 }));
        expect(g7({ x: 22 })).toEqual({ x: 22 });
        expect(g7.stringify()).toEqual('{"x":"11","$$":"Min(1).Max(3)"}');
        expect((g7.node()[cs]()))
            .toEqual('{t:object v:{x:{$:{v$:' + VERSION + '} t:number v:11 f:11 n:0 r:false p:false d:1 k:[]' +
            ' e:true u:{} a:[] b:[] m:{}}} n:1 r:false p:false d:0 k:[x] e:true u:{} a:[]' +
            ' b:[Min(1) Max(3)] m:{}}');
    });
    test('compose-node', () => {
        let g0 = Gubu({ a: Required(Child({ x: String }, { b: 1 })) });
        let g1 = Gubu({ a: Required({ b: 1 }).Child({ x: String }) });
        let g4 = Gubu({ a: Child({ x: String }, Required({ b: 1 })) });
        let g5 = Gubu({ a: Child({ x: String }, { b: 1 }).Required() });
        let g6 = Gubu({ a: Child({ x: String }).Required({ b: 1 }) });
        let g7 = Gubu({ a: Required().Child({ x: String }, { b: 1 }) });
        // console.dir(g0.spec(), { depth: null })
        let VERSION = package_json_1.default.version;
        let spec = {
            '$': { 'gubu$': true, 'v$': VERSION },
            t: 'object',
            v: {
                a: {
                    '$': { 'gubu$': true, 'v$': VERSION },
                    t: 'object',
                    v: {
                        b: {
                            '$': { 'gubu$': true, 'v$': VERSION },
                            t: 'number',
                            v: 1,
                            f: 1,
                            n: 0,
                            r: false,
                            p: false,
                            d: 2,
                            k: [],
                            e: true,
                            u: {},
                            a: [],
                            b: [],
                            m: {}
                        }
                    },
                    n: 1,
                    c: {
                        '$': { 'gubu$': true, 'v$': VERSION },
                        t: 'object',
                        v: {
                            x: {
                                '$': { 'gubu$': true, 'v$': VERSION },
                                t: 'string',
                                v: '',
                                f: '',
                                n: 0,
                                r: true,
                                p: false,
                                d: 3,
                                k: [],
                                e: true,
                                u: {},
                                a: [],
                                b: [],
                                m: {}
                            }
                        },
                        n: 1,
                        r: false,
                        p: false,
                        d: 2,
                        k: [],
                        e: true,
                        u: {},
                        a: [],
                        b: [],
                        m: {}
                    },
                    r: true,
                    p: false,
                    d: 1,
                    k: ['b'],
                    e: true,
                    u: {},
                    a: [],
                    b: [],
                    m: {}
                }
            },
            n: 1,
            r: false,
            p: false,
            d: 0,
            k: ['a'],
            e: true,
            u: {},
            a: [],
            b: [],
            m: {}
        };
        const g0spec = g0.spec();
        expect(g0spec).toEqual(spec);
        expect(g1.spec()).toEqual(g0spec);
        expect(g4.spec()).toEqual(g0spec);
        expect(g5.spec()).toEqual(g0spec);
        expect(g6.spec()).toEqual(g0spec);
        expect(g7.spec()).toEqual(g0spec);
    });
    test('builder-exports', () => {
        expect(JSON.stringify(Gubu.Skip())).toEqual(JSON.stringify(Skip()));
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
        expect(() => shape_AboveB0(10))
            .toThrow('Value "10" for property "" must be above 10 (was 10).');
        expect(() => shape_AboveB0(true))
            .toThrow('Value "true" for property "" must have length above 10 (was NaN).');
        let shape_AboveB1 = Gubu(Above(2));
        expect(shape_AboveB1('abc')).toEqual('abc');
        expect(() => shape_AboveB1('ab'))
            .toThrow('Value "ab" for property "" must have length above 2 (was 2).');
        expect(shape_AboveB1([1, 2, 3])).toEqual([1, 2, 3]);
        expect(() => shape_AboveB1([1, 2]))
            .toThrow('Value "[1,2]" for property "" must have length above 2 (was 2).');
        expect(shape_AboveB1({ a: 1, b: 2, c: 3 })).toEqual({ a: 1, b: 2, c: 3 });
        expect(() => shape_AboveB1({ a: 1, b: 2 }))
            .toThrow('Value "{a:1,b:2}" for property "" must have length above 2 (was 2).');
        let shape_AboveB2 = Gubu(Above(2, Number));
        expect(shape_AboveB2(3)).toEqual(3);
        expect(() => shape_AboveB2([1, 2, 3]))
            .toThrow('Validation failed for array "[1,2,3]" because the array is not of type number.');
        let shape_AboveB3 = Gubu(Skip(Above(2, Number)));
        expect(shape_AboveB3(3)).toEqual(3);
        expect(shape_AboveB3()).toEqual(undefined);
        let shape_AfterB0 = Gubu(After((v) => v > 10, 15));
        expect(shape_AfterB0(11)).toEqual(11);
        expect(() => shape_AfterB0(10))
            .toThrow('Validation failed for number "10" because check "(v) => v > 10" failed.');
        expect(() => shape_AfterB0('x'))
            .toThrow(`Validation failed for string "x" because the string is not of type number.
Validation failed for string "x" because check "(v) => v > 10" failed.`);
        expect(shape_AfterB0()).toEqual(15);
        let shape_AfterB1 = Gubu(Skip(Number).After((v) => v % 2 === 0));
        expect(shape_AfterB1(2)).toEqual(2);
        expect(() => shape_AfterB1(3))
            .toThrow('Validation failed for number "3" because check "(v) => v % 2 === 0" failed.');
        expect(() => shape_AfterB1('x'))
            .toThrow('Validation failed for string "x" because check "(v) => v % 2 === 0" failed.');
        expect(shape_AfterB1()).toEqual(undefined);
        let shape_AfterB2 = Gubu(After((v) => v.x % 2 === 0, Required({ x: Number })));
        expect(shape_AfterB2({ x: 2 })).toEqual({ x: 2 });
        expect(() => shape_AfterB2({ x: 3 }))
            .toThrow('Validation failed for object "{x:3}" because check "(v) => v.x % 2 === 0" failed.');
        expect(() => shape_AfterB2({}))
            .toThrow(`Validation failed for object "{}" because check "(v) => v.x % 2 === 0" failed.
Validation failed for property "x" with value "undefined" because the value is required.`);
        expect(() => shape_AfterB2())
            .toThrow(`Validation failed for value "undefined" because the value is required.`);
        // TODO: modify value
        let shape_AllB0 = Gubu(All(Number, Check((v) => v > 10)));
        expect(shape_AllB0(11)).toEqual(11);
        expect(() => shape_AllB0(10))
            .toThrow('Value "10" for property "" does not satisfy all of: ' +
            'Number, Check((v) => v > 10)');
        let shape_AllB1 = Gubu(All());
        expect(shape_AllB1(123)).toEqual(123);
        expect(() => shape_AllB1()).toThrow('required');
        let shape_AllB2 = Gubu({ a: Default({ b: 'B' }, All(Open({ b: String }), Max(2))) });
        expect(shape_AllB2({})).toEqual({ a: { b: 'B' } });
        expect(shape_AllB2({ a: { b: 'X' } })).toEqual({ a: { b: 'X' } });
        expect(shape_AllB2({ a: { b: 'X', c: 'Y' } })).toEqual({ a: { b: 'X', c: 'Y' } });
        expect(() => shape_AllB2({ a: { b: 'X', c: 'Y', d: 'Z' } }))
            .toThrow('Value "{b:X,c:Y,d:Z}" for property "a" does not satisfy all of:' +
            ' {b:String,$$:Open()}, Max(2)');
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
        expect(() => shape_BeforeB0(10))
            .toThrow('Validation failed for number "10" because check "(v) => v > 10" failed.');
        // TODO: modify value
        let shape_BelowB0 = Gubu(Below(10));
        expect(shape_BelowB0(9)).toEqual(9);
        expect(() => shape_BelowB0(10))
            .toThrow('Value "10" for property "" must be below 10 (was 10).');
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
        expect(() => shape_ClosedB0([1, 2]))
            .toThrow('Validation failed for array "[1,2]" because the index "1" is not allowed.');
        let shape_DefineB0 = Gubu({ a: Define('foo', 11), b: Refer('foo') });
        expect(shape_DefineB0({ a: 10, b: 12 })).toEqual({ a: 10, b: 12 });
        expect(() => shape_DefineB0({ a: 'A', b: 'B' }))
            .toThrow(`Validation failed for property "a" with string "A" because the string is not of type number.
Validation failed for property "b" with string "B" because the string is not of type number.`);
        let shape_EmptyB0 = Gubu({ a: Empty(String), b: String });
        expect(shape_EmptyB0({ a: '', b: 'ABC' })).toEqual({ a: '', b: 'ABC' });
        expect(() => shape_EmptyB0({ a: '', b: '' }))
            .toThrow('Validation failed for property "b" with string "" because an empty string is not allowed.');
        let shape_ExactB0 = Gubu(Exact(11, 12, true));
        expect(shape_ExactB0(11)).toEqual(11);
        expect(shape_ExactB0(12)).toEqual(12);
        expect(shape_ExactB0(true)).toEqual(true);
        expect(() => shape_ExactB0(10))
            .toThrow('Value "10" for property "" must be exactly one of: 11, 12, true');
        expect(() => shape_ExactB0(false))
            .toThrow('Value "false" for property "" must be exactly one of: 11, 12, true');
        let shape_MaxB0 = Gubu(Max(11));
        expect(shape_MaxB0(11)).toEqual(11);
        expect(shape_MaxB0(10)).toEqual(10);
        expect(() => shape_MaxB0(12))
            .toThrow('Value "12" for property "" must be a maximum of 11 (was 12).');
        let shape_MinB0 = Gubu(Min(11));
        expect(shape_MinB0(11)).toEqual(11);
        expect(shape_MinB0(12)).toEqual(12);
        expect(() => shape_MinB0(10))
            .toThrow('Value "10" for property "" must be a minimum of 11 (was 10).');
        let shape_NeverB0 = Gubu(Never());
        expect(() => shape_NeverB0(10))
            .toThrow('Validation failed for number "10" because no value is allowed.');
        expect(() => shape_NeverB0(true))
            .toThrow('Validation failed for boolean "true" because no value is allowed.');
        let shape_OneB0 = Gubu(One(Exact(10), Exact(11), Exact(true)));
        expect(shape_OneB0(10)).toEqual(10);
        expect(shape_OneB0(11)).toEqual(11);
        expect(shape_OneB0(true)).toEqual(true);
        expect(() => shape_OneB0(12))
            .toThrow('Value "12" for property "" does not satisfy one of: ' +
            'Exact(10), Exact(11), Exact(true)');
        expect(() => shape_OneB0(false))
            .toThrow('Value "false" for property "" does not satisfy one of: ' +
            'Exact(10), Exact(11), Exact(true)');
        expect(() => shape_OneB0(null))
            .toThrow('Value "null" for property "" does not satisfy one of: ' +
            'Exact(10), Exact(11), Exact(true)');
        expect(() => shape_OneB0(NaN))
            .toThrow('Value "NaN" for property "" does not satisfy one of: ' +
            'Exact(10), Exact(11), Exact(true)');
        expect(() => shape_OneB0(undefined))
            .toThrow('Value "undefined" for property "" does not satisfy one of: ' +
            'Exact(10), Exact(11), Exact(true)');
        expect(() => shape_OneB0())
            .toThrow('Value "undefined" for property "" does not satisfy one of: ' +
            'Exact(10), Exact(11), Exact(true)');
        let shape_OneB1 = Gubu(One(Number, String));
        expect(shape_OneB1(123)).toEqual(123);
        expect(shape_OneB1('abc')).toEqual('abc');
        expect(() => shape_OneB1(true))
            .toThrow('Value "true" for property "" does not satisfy one of: Number, String');
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
        expect(() => shape_ReferB0({ a: 'A', b: 'B' }))
            .toThrow(`Validation failed for property "a" with string "A" because the string is not of type number.
Validation failed for property "b" with string "B" because the string is not of type number.`);
        let shape_ReferB1 = Gubu({ a: Define('foo', 11), b: Refer({ name: 'foo', fill: true }) });
        expect(shape_ReferB1({ a: 10, b: 12 })).toEqual({ a: 10, b: 12 });
        expect(shape_ReferB1({ a: 10 })).toEqual({ a: 10, b: 11 });
        expect(shape_ReferB1({})).toEqual({ a: 11, b: 11 });
        expect(shape_ReferB1({ b: 12 })).toEqual({ a: 11, b: 12 });
        expect(() => shape_ReferB1({ a: 'A', b: 'B' }))
            .toThrow(`Validation failed for property "a" with string "A" because the string is not of type number.
Validation failed for property "b" with string "B" because the string is not of type number.`);
        // TODO: also recursive
        let shape_RenameB0 = Gubu({ a: Rename('b', Number) });
        expect(shape_RenameB0({ a: 10 })).toEqual({ b: 10 });
        expect(() => shape_RenameB0({}))
            .toThrow('Validation failed for property "a" with value "undefined" because the value is required.');
        let shape_RenameB1 = Gubu({ a: Rename({ name: 'b', keep: true }, 123) });
        expect(shape_RenameB1({ a: 10 })).toEqual({ a: 10, b: 10 });
        expect(shape_RenameB1({})).toEqual({ a: 123, b: 123 });
        let shape_RequiredB0 = Gubu(Required(11));
        expect(shape_RequiredB0(11)).toEqual(11);
        expect(() => shape_RequiredB0())
            .toThrow('Validation failed for value "undefined" because the value is required.');
        let shape_RequiredB1 = Gubu(Open(Required({ x: 1 })));
        expect(shape_RequiredB1({ x: 2 })).toEqual({ x: 2 });
        expect(shape_RequiredB1({ x: 2, y: 3 })).toEqual({ x: 2, y: 3 });
        expect(() => shape_RequiredB1())
            .toThrow('Validation failed for value "undefined" because the value is required.');
        let shape_RequiredB2 = Gubu(Open({ x: 1 }).Required());
        expect(shape_RequiredB2({ x: 2 })).toEqual({ x: 2 });
        expect(shape_RequiredB2({ x: 2, y: 3 })).toEqual({ x: 2, y: 3 });
        expect(() => shape_RequiredB2())
            .toThrow('Validation failed for value "undefined" because the value is required.');
        // TODO: update docs - need better example where one prop differentiates
        let shape_SomeB0 = Gubu(Some({ x: 1 }, { y: 2 }));
        expect(shape_SomeB0({ x: 1 })).toEqual({ x: 1 });
        expect(shape_SomeB0({ y: 2 })).toEqual({ y: 2 });
        expect(() => shape_SomeB0({ x: 11, y: 22 }))
            .toThrow('Value "{x:11,y:22}" for property "" does not satisfy any of: {"x":1}, {"y":2}');
        expect(() => shape_SomeB0({ x: true, y: 2 })).toThrow('any of');
        expect(() => shape_SomeB0({ x: 1, y: true })).toThrow('any of');
        expect(() => shape_SomeB0({ x: true, y: true }))
            .toThrow(`Value "{x:true,y:true}" for property "" does not satisfy any of: {"x":1}, {"y":2}`);
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
});

},{"../gubu":1,"../package.json":3}],6:[function(require,module,exports){
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

},{"./argu.test.js":4,"./builder.test.js":5,"./gubu.test.js":7,"./readme.test.js":10}],7:[function(require,module,exports){
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
        expect(Gubu('x', { name: 'bar' }).toString()).toMatch(/\[Gubu bar x\]/);
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
        let g3 = Gubu({ ...new Foo(1) });
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
            a: Check((_value, update) => {
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
        expect(() => a1(['x', 'y']))
            .toThrow('Validation failed for index "0" with string "x" because ' +
            'the string is not of type number.');
        expect(() => a1([1, 2]))
            .toThrow('Validation failed for index "1" with number "2" because ' +
            'the number is not of type string.');
        let a2 = Gubu([9, String]);
        expect(() => a2()).toThrow('required');
        expect(() => a2([])).toThrow('required');
        expect(() => a2([1])).toThrow('required');
        expect(a2([1, 'x'])).toMatchObject([1, 'x']);
        expect(() => a2([1, 'x', 'y'])).toThrow('not allowed');
        expect(() => a2(['x', 1]))
            .toThrow(`Validation failed for index "0" with string "x" because the string is not of type number.
Validation failed for index "1" with number "1" because the number is not of type string.`);
        expect(() => a2(['x', 'y']))
            .toThrow('Validation failed for index "0" with string "x" because ' +
            'the string is not of type number.');
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
        expect(() => g0({ a: 11 }, c0))
            .toThrow('Validation failed for property "a" with number "11" because ' +
            'check "(v, _u, s) => v < s.ctx.max" failed.');
        let g1 = Gubu({
            a: { b: All(Number, Check((v, _u, s) => v < s.ctx.max)) }
        });
        expect(g1({ a: { b: 3 } }, c0)).toMatchObject({ a: { b: 3 } });
        expect(() => g1({ a: { b: 11 } }, c0))
            .toThrow('Value "11" for property "a.b" does not satisfy all of: ' +
            'Number, Check((v, _u, s) => v < s.ctx.max)');
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
            t: 'check',
            n: 0,
            r: true,
            p: false,
            d: 0,
            u: {},
            a: [],
            b: ['f0'],
            // s: 'f0'
        });
        expect(c1.spec()).toMatchObject({
            t: 'check',
            n: 0,
            r: false,
            p: true,
            d: 0,
            u: {},
            a: [],
            b: ['f0'],
            // s: 'f0'
        });
        expect(c2.spec()).toMatchObject({
            t: 'check',
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
        expect(stringify(Gubu({ a: Number }).spec())).toEqual('{"a":"Number"}');
        expect(stringify(Gubu({ a: String }).spec())).toEqual('{"a":"String"}');
        expect(stringify(Gubu({ a: Boolean }).spec())).toEqual('{"a":"Boolean"}');
        expect(stringify(Required())).toEqual(`"Required()"`);
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
        const size = 11111;
        let m0 = {};
        let c0 = m0;
        for (let i = 0; i < size; i++) {
            c0 = c0.a = {};
        }
        let g0 = Gubu(m0);
        expect(g0(m0)).toEqual(m0);
        let m1 = [];
        let c1 = m1;
        for (let i = 0; i < size; i++) {
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
    test('context-skipping', () => {
        let g0 = Gubu({
            a: Number,
            b: Skip(Boolean),
        });
        expect(g0({ a: 1 })).toEqual({ a: 1 });
        expect(g0({ a: 1, b: true })).toEqual({ a: 1, b: true });
        expect(() => g0({ a: 1, b: true, c: 'C' })).toThrow('not allowed');
        let g1 = Gubu(Open(g0));
        expect(g1({ a: 1 })).toEqual({ a: 1 });
        expect(g1({ a: 1, b: true })).toEqual({ a: 1, b: true });
        expect(g1({ a: 1, b: true, c: 'C' })).toEqual({ a: 1, b: true, c: 'C' });
        expect(g1({}, { skip: { depth: 1 } })).toEqual({});
        expect(g1({ a: 1 }, { skip: { depth: 1 } })).toEqual({ a: 1 });
        expect(g1({ a: 1, b: true }, { skip: { depth: 1 } })).toEqual({ a: 1, b: true });
        expect(g1({ a: 1, b: true, c: 'C' }, { skip: { depth: 1 } }))
            .toEqual({ a: 1, b: true, c: 'C' });
        expect(g1({}, { skip: { depth: [1] } })).toEqual({});
        expect(g1({ a: 1 }, { skip: { depth: [1] } })).toEqual({ a: 1 });
        expect(g1({ a: 1, b: true }, { skip: { depth: [1] } })).toEqual({ a: 1, b: true });
        expect(g1({ a: 1, b: true, c: 'C' }, { skip: { depth: [1] } }))
            .toEqual({ a: 1, b: true, c: 'C' });
        expect(g1({}, { skip: { keys: ['a'] } })).toEqual({});
        expect(g1({ a: 1 }, { skip: { keys: ['a'] } })).toEqual({ a: 1 });
        expect(g1({ a: 1, b: true }, { skip: { keys: ['a'] } })).toEqual({ a: 1, b: true });
        expect(g1({ a: 1, b: true, c: 'C' }, { skip: { keys: ['a'] } }))
            .toEqual({ a: 1, b: true, c: 'C' });
        let g2 = Gubu({
            a: Number,
            b: { a: Boolean }
        });
        expect(g2({ b: { a: true } }, { skip: { keys: ['a'] } })).toEqual({ b: { a: true } });
        expect(g2({ a: 1, b: { a: true } }, { skip: { keys: ['a'] } }))
            .toEqual({ a: 1, b: { a: true } });
        expect(() => g2({ a: 1, b: {} }, { skip: { keys: ['a'] } })).toThrow('required');
    });
});

},{"../gubu":1,"../package.json":3,"./large":8,"./long":9}],8:[function(require,module,exports){

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

},{}],9:[function(require,module,exports){

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

},{}],10:[function(require,module,exports){
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

},{"../gubu":1}]},{},[6]);
