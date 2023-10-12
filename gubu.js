"use strict";
/* Copyright (c) 2021-2022 Richard Rodger and other contributors, MIT License */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GExact = exports.GEmpty = exports.GDefault = exports.GDefine = exports.GClosed = exports.GChild = exports.GCheck = exports.GBelow = exports.GBefore = exports.GAny = exports.GAll = exports.GAfter = exports.GAbove = exports.Some = exports.Ignore = exports.Skip = exports.Required = exports.Rename = exports.Refer = exports.Optional = exports.Open = exports.One = exports.Len = exports.Never = exports.Min = exports.Max = exports.Key = exports.Func = exports.Exact = exports.Empty = exports.Default = exports.Define = exports.Closed = exports.Child = exports.Check = exports.Below = exports.Before = exports.Any = exports.All = exports.After = exports.Above = exports.MakeArgu = exports.expr = exports.truncate = exports.stringify = exports.makeErr = exports.buildize = exports.nodize = exports.G$ = exports.Gubu = void 0;
exports.GSome = exports.GIgnore = exports.GSkip = exports.GRequired = exports.GRename = exports.GRefer = exports.GOptional = exports.GOpen = exports.GOne = exports.GLen = exports.GNever = exports.GMin = exports.GMax = exports.GKey = exports.GFunc = void 0;
// FEATURE: regexp in array: [/a/] => all elements must match /a/
// FEATURE: validator on completion of object or array
// FEATURE: support non-index properties on array shape
// FEATURE: state should indicate if value was present, not just undefined
// FEATURE: support custom builder registration so that can chain on builtins
// FEATURE: merge shapes (allows extending given shape - e.g. adding object props)
// TODO: Validation of Builder parameters
// TODO: GubuShape.d is damaged by composition
// TODO: Better stringifys for builder shapes
// TODO: Error messages should state property is missing, not `value ""`
// TODO: node.s can be a lazy function to avoid unnecessary string building
// TODO: Finish Default shape-builder
// DOC: Skip also makes value optional - thus Skip() means any value, or nonexistent
// DOC: Optional
const util_1 = require("util");
// Package version.
const VERSION = '5.0.1';
// Unique symbol for marking and recognizing Gubu shapes.
const GUBU$ = Symbol.for('gubu$');
// A singleton for fast equality checks.
const GUBU = { gubu$: GUBU$, v$: VERSION };
// A special marker for property abscence.
const GUBU$NIL = Symbol.for('gubu$nil');
// RegExp: first letter is upper case
const UPPER_CASE_FIRST_RE = /^[A-Z]/;
// Help the minifier
const S = {
    MT: '',
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
    undefined: 'undefined',
    any: 'any',
    list: 'list',
    instance: 'instance',
    null: 'null',
    type: 'type',
    Object: 'Object',
    Array: 'Array',
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
    Value: 'Value',
    forprop: ' for property ',
    $PATH: '"$PATH"',
    $VALUE: '"$VALUE"',
};
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
        this.key = S.MT;
        this.type = S.never;
        this.stop = true;
        this.nextSibling = true;
        this.fromDefault = false;
        // NOTE: tri-valued; undefined = soft ignore
        this.ignoreVal = undefined;
        this.curerr = [];
        this.err = [];
        this.parents = [];
        this.keys = [];
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
        // Uncomment for debugging (definition below).
        // this.printStacks()
        this.stop = false;
        this.fromDefault = false;
        this.ignoreVal = undefined;
        this.isRoot = 0 === this.pI;
        this.check = undefined;
        // Dereference the back pointers to ancestor siblings.
        // Only objects|arrays can be nodes, so a number is a back pointer.
        // NOTE: terminates because (+{...} -> NaN, +[] -> 0) -> false (JS wat FTW!)
        let nextNode = this.nodes[this.pI];
        while (+nextNode) {
            this.dI--;
            this.ctx.log &&
                -1 < this.dI &&
                this.ctx.log('e' +
                    (Array.isArray(this.parents[this.pI]) ? 'a' : 'o'), this);
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
        this.parent = this.parents[this.pI];
        this.nextSibling = true;
        this.type = this.node.t;
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
        var _a;
        prefix = (null == prefix) ? '' : (prefix + ': ');
        super(prefix + err.map((e) => e.t).join('\n'));
        this.gubu = true;
        let name = 'GubuError';
        let ge = this;
        ge.name = name;
        this.code = code;
        this.prefix = prefix;
        this.desc = () => ({ name, code, err, ctx, });
        this.stack = (_a = this.stack) === null || _a === void 0 ? void 0 : _a.replace(/.*\/gubu\/gubu\.[tj]s.*\n/g, '');
        this.props = err.map((e) => {
            var _a;
            return ({
                path: e.p,
                what: e.w,
                type: (_a = e.n) === null || _a === void 0 ? void 0 : _a.t,
                value: e.v
            });
        });
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
// Identify JavaScript wrapper types by name.
const IS_TYPE = {
    String: true,
    Number: true,
    Boolean: true,
    Object: true,
    Array: true,
    Function: true,
    Symbol: true,
    BigInt: true,
};
// Empty values for each type.
const EMPTY_VAL = {
    string: S.MT,
    number: 0,
    boolean: false,
    object: {},
    array: [],
    symbol: Symbol(S.MT),
    bigint: BigInt(0),
    null: null,
};
// Normalize a value into a Node.
function nodize(shape, depth, meta) {
    var _a, _b, _c, _d;
    // If using builder as property of Gubu, `this` is just Gubu, not a node.
    if (make === shape) {
        shape = undefined;
    }
    // Is this a (possibly incomplete) Node?
    else if (null != shape && ((_a = shape.$) === null || _a === void 0 ? void 0 : _a.gubu$)) {
        // Assume complete if gubu$ has special internal reference.
        if (GUBU$ === shape.$.gubu$) {
            shape.d = null == depth ? shape.d : depth;
            return shape;
        }
        // Normalize an incomplete Node, avoiding any recursive calls to norm.
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
            node.m = node.m || meta;
            return node;
        }
    }
    // Not a Node, so build one based on value and its type.
    let t = (null === shape ? S.null : typeof (shape));
    t = (S.undefined === t ? S.any : t);
    let v = shape;
    let f = v;
    let c = GUBU$NIL;
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
            t = S.instance;
            u.n = v.constructor.name;
            u.i = v.constructor;
            f = v;
        }
        else {
            // c = GUBU$NIL
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
        else if (v.gubu === GUBU || true === ((_b = v.$) === null || _b === void 0 ? void 0 : _b.gubu)) {
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
        else if ('Function' === v.constructor.name &&
            UPPER_CASE_FIRST_RE.test(v.name)) {
            t = S.instance;
            r = true;
            u.n = (_d = (_c = v.prototype) === null || _c === void 0 ? void 0 : _c.constructor) === null || _d === void 0 ? void 0 : _d.name;
            u.i = v;
        }
    }
    else if (S.number === t && isNaN(v)) {
        t = S.nan;
    }
    else if (S.string === t && S.MT === v) {
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
        m: meta
    };
    return node;
}
exports.nodize = nodize;
// Create a GubuShape from a shape specification.
function make(intop, inopts) {
    const opts = null == inopts ? {} : inopts;
    // Ironically, we can't Gubu GubuOptions, so we have to set
    // option defaults manually.
    opts.name =
        null == opts.name ?
            'G' + (S.MT + Math.random()).substring(2, 8) : S.MT + opts.name;
    opts.prefix = null == opts.prefix ? undefined : opts.prefix;
    // Meta properties are off by default.
    let optsmeta = opts.meta = opts.meta || {};
    optsmeta.active = (true === optsmeta.active) || false;
    optsmeta.suffix = 'string' == typeof optsmeta.suffix ? optsmeta.suffix : '$$';
    // Key expressions are on by default.
    let optskeyexpr = opts.keyexpr = opts.keyexpr || {};
    optskeyexpr.active = (false !== optskeyexpr.active);
    let top = nodize(intop, 0);
    // Lazily execute top against root to see if they match
    function exec(root, ctx, match // Suppress errors and return boolean result (true if match)
    ) {
        let s = new State(root, top, ctx, match);
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
            // Call Befores
            if (0 < n.b.length) {
                for (let bI = 0; bI < n.b.length; bI++) {
                    let update = handleValidate(n.b[bI], s);
                    n = s.node;
                    if (undefined !== update.done) {
                        done = update.done;
                    }
                }
            }
            if (!done) {
                let descend = true;
                let valundef = undefined === s.val;
                if (S.never === s.type) {
                    s.curerr.push(makeErrImpl(S.never, s, 1070));
                }
                else if (S.object === s.type) {
                    let val;
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
                    else if (!n.p && valundef && undefined !== n.f) {
                        s.updateVal(n.f);
                        s.fromDefault = true;
                        val = s.val;
                        descend = false;
                    }
                    else if (!n.p || !valundef) {
                        // Descend into object, constructing child defaults
                        s.updateVal(s.val || (s.fromDefault = true, {}));
                        val = s.val;
                    }
                    if (descend) {
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
                                    let meta = undefined;
                                    // TODO: make optional, needs tests
                                    // Experimental feature for jsonic docs
                                    // NOTE: Meta key *must* immediately preceed key:
                                    // { x$$: <META>, x: 1 }}
                                    if (optsmeta.active && k.endsWith(optsmeta.suffix)) {
                                        meta = { short: '' };
                                        if ('string' === typeof (n.v[k])) {
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
                                        // let parts = k.split(' ')
                                        let m = /^\s*("(\\.|[^"\\])*"|[^\s]+):\s*(.*?)\s*$/
                                            .exec(k);
                                        if (m) {
                                            rk = m[1];
                                            let src = m[3];
                                            ov = expr({ src, val: ov });
                                            delete n.v[k];
                                        }
                                    }
                                    let nvs = nodize(ov, 1 + s.dI, meta);
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
                                if (GUBU$NIL === n.c) {
                                    s.ignoreVal = true;
                                    s.curerr.push(makeErrImpl('closed', s, 1100, undefined, { k: extra }));
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
                else if (S.array === s.type) {
                    if (n.r && valundef) {
                        s.ignoreVal = true;
                        s.curerr.push(makeErrImpl(S.required, s, 1030));
                    }
                    else if (!valundef && !isarr(s.val)) {
                        s.curerr.push(makeErrImpl(S.type, s, 1040));
                    }
                    else if (!n.p && valundef && undefined !== n.f) {
                        s.updateVal(n.f);
                        s.fromDefault = true;
                    }
                    else if (!n.p || null != s.val) {
                        s.updateVal(s.val || (s.fromDefault = true, []));
                        // n.c set by nodize for array with len=1
                        let hasChildShape = GUBU$NIL !== n.c;
                        let hasValueElements = 0 < s.val.length;
                        let elementKeys = keys(n.v).filter(k => !isNaN(+k));
                        let hasFixedElements = 0 < elementKeys.length;
                        s.ctx.log && s.ctx.log('sa', s);
                        if (hasValueElements || hasFixedElements) {
                            s.pI = s.nI;
                            let elementIndex = 0;
                            // Fixed element array means match shapes at each index only.
                            if (hasFixedElements) {
                                if (elementKeys.length < s.val.length && !hasChildShape) {
                                    s.ignoreVal = true;
                                    s.curerr.push(makeErrImpl('closed', s, 1090, undefined, { k: elementKeys.length }));
                                }
                                else {
                                    for (; elementIndex < elementKeys.length; elementIndex++) {
                                        let elementShape = n.v[elementIndex] =
                                            nodize(n.v[elementIndex], 1 + s.dI);
                                        s.nodes[s.nI] = elementShape;
                                        s.vals[s.nI] = s.val[elementIndex];
                                        s.parents[s.nI] = s.val;
                                        s.keys[s.nI] = S.MT + elementIndex;
                                        s.nI++;
                                    }
                                }
                            }
                            // Single element array shape means 0 or more elements of shape
                            if (hasChildShape && hasValueElements) {
                                let elementShape = n.c = nodize(n.c, 1 + s.dI);
                                for (; elementIndex < s.val.length; elementIndex++) {
                                    s.nodes[s.nI] = elementShape;
                                    s.vals[s.nI] = s.val[elementIndex];
                                    s.parents[s.nI] = s.val;
                                    s.keys[s.nI] = S.MT + elementIndex;
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
                // Invalid type.
                else if (!(S.any === s.type ||
                    S.list === s.type ||
                    undefined === s.val ||
                    s.type === s.valType ||
                    (S.instance === s.type && n.u.i && s.val instanceof n.u.i) ||
                    (S.null === s.type && null === s.val))) {
                    s.curerr.push(makeErrImpl(S.type, s, 1050));
                }
                // Value itself, or default.
                else if (undefined === s.val) {
                    let parentKey = s.path[s.dI];
                    if (n.r &&
                        (S.undefined !== s.type || !s.parent.hasOwnProperty(parentKey))) {
                        s.ignoreVal = true;
                        s.curerr.push(makeErrImpl(S.required, s, 1060));
                    }
                    else if (
                    // undefined !== n.v &&
                    undefined !== n.f &&
                        !n.p ||
                        S.undefined === s.type) {
                        // Inject default value.
                        s.updateVal(n.f);
                        s.fromDefault = true;
                    }
                    else if (S.any === s.type) {
                        s.ignoreVal = undefined === s.ignoreVal ? true : s.ignoreVal;
                    }
                    // TODO: ensure object,array points called even if errors
                    s.ctx.log && s.ctx.log('kv', s);
                }
                // Empty strings fail even if string is optional. Use Empty() to allow.
                else if (S.string === s.type && S.MT === s.val && !n.u.empty) {
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
                }
            }
            // Explicit ignoreVal overrides Skip
            let ignoreVal = s.node.p ? false === s.ignoreVal ? false : true : !!s.ignoreVal;
            let setParent = !s.match && null != s.parent && !done && !ignoreVal;
            if (setParent) {
                s.parent[s.key] = s.val;
            }
            if (s.nextSibling) {
                s.pI = s.sI;
            }
            if (s.node.e) {
                s.err.push(...s.curerr);
            }
        }
        // console.log(s.printStacks())
        // s.err = s.err.filter(e => null != e)
        if (0 < s.err.length) {
            if (isarr(s.ctx.err)) {
                s.ctx.err.push(...s.err);
            }
            else if (!s.match && false !== s.ctx.err) {
                throw new GubuError('shape', opts.prefix, s.err, s.ctx);
            }
        }
        return s.match ? 0 === s.err.length : s.root;
    }
    function gubuShape(root, ctx) {
        return exec(root, ctx, false);
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
    gubuShape.error = (root, ctx) => {
        let actx = ctx || {};
        actx.err = actx.err || [];
        exec(root, actx, false);
        return actx.err;
    };
    gubuShape.spec = () => {
        // TODO: when c is GUBU$NIL it is not present, should have some indicator value
        // Normalize spec, discard errors.
        gubuShape(undefined, { err: false });
        return JP(stringify(top, (_key, val) => {
            if (GUBU$ === val) {
                return true;
            }
            return val;
        }, false, true));
    };
    gubuShape.node = () => {
        gubuShape.spec();
        return top;
    };
    let desc = S.MT;
    gubuShape.toString = () => {
        desc = truncate(S.MT === desc ?
            stringify((top &&
                top.$ &&
                (GUBU$ === top.$.gubu$ || true === top.$.gubu$)) ? top.v : top) :
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
function expr(spec) {
    // console.log('EXPR', spec.src)
    let top = false;
    if (null == spec.tokens) {
        top = true;
        spec.tokens = [];
        let tre = /\s*,?\s*([)(\.]|"(\\.|[^"\\])*"|\/(\\.|[^\/\\])*\/[a-z]?|[^)(,\s]+)\s*/g;
        let t = null;
        while (t = tre.exec(spec.src)) {
            spec.tokens.push(t[1]);
        }
        // console.log('TOKENS', spec.tokens.join(' '))
    }
    spec.i = spec.i || 0;
    let head = spec.tokens[spec.i];
    let fn = BuilderMap[head];
    if (')' === spec.tokens[spec.i]) {
        spec.i++;
        return spec.val;
    }
    spec.i++;
    let fixed = {
        Number: Number,
        String: String,
        Boolean: Boolean,
    };
    if (null == fn) {
        try {
            let val = fixed[head];
            if (val) {
                return val;
            }
            else if ('undefined' === head) {
                return undefined;
            }
            else if ('NaN' === head) {
                return NaN;
            }
            else if (head.match(/^\/.+\/$/)) {
                return new RegExp(head.substring(1, head.length - 1));
            }
            else {
                return JSON.parse(head);
            }
        }
        catch (je) {
            throw new SyntaxError(`Gubu: unexpected token ${head} in builder expression ${spec.src}`);
        }
    }
    if ('(' === spec.tokens[spec.i]) {
        spec.i++;
    }
    let args = [];
    let t = null;
    while (null != (t = spec.tokens[spec.i]) && ')' !== t) {
        let ev = expr(spec);
        args.push(ev);
        // console.log('ARGS', spec.i, ev, 'A:', args)
    }
    spec.i++;
    // console.log('CALL', spec.i, fn.name, args)
    spec.val = fn.call(spec.val, ...args);
    // if (!cb && spec.i < spec.tokens.length) {
    if ('.' === spec.tokens[spec.i]) {
        spec.i++;
        return expr(spec);
    }
    else if (top && spec.i < spec.tokens.length) {
        return expr(spec);
    }
    return spec.val;
}
exports.expr = expr;
function handleValidate(vf, s) {
    var _a;
    let update = {};
    let valid = false;
    let thrown;
    try {
        // Check does not have to deal with `undefined`
        valid = undefined === s.val && ((_a = vf.gubu$) === null || _a === void 0 ? void 0 : _a.Check) ? true :
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
        let w = update.why || 'check';
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
            if (null == fname || S.MT == fname) {
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
const Required = function (shape) {
    let node = buildize(this, shape);
    node.r = true;
    node.p = false;
    // Handle an explicit undefined.
    if (undefined === shape && 1 === arguments.length) {
        node.t = S.undefined;
        node.v = undefined;
    }
    return node;
};
exports.Required = Required;
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
const Skip = function (shape) {
    let node = buildize(this, shape);
    node.r = false;
    // Do not insert empty arrays and objects.
    node.p = true;
    return node;
};
exports.Skip = Skip;
const Ignore = function (shape) {
    let node = buildize(this, shape);
    node.r = false;
    // Do not insert empty arrays and objects.
    node.p = true;
    node.e = false;
    node.a.push(function Key(_val, update, state) {
        if (0 < state.curerr.length) {
            update.uval = undefined;
            update.done = false;
        }
        return true;
    });
    return node;
};
exports.Ignore = Ignore;
const Func = function (shape) {
    let node = buildize(this);
    node.t = S.function;
    node.v = shape;
    node.f = shape;
    return node;
};
exports.Func = Func;
const Default = function (dval, shape) {
    let node = buildize(this, undefined === shape ? dval : shape);
    node.r = false;
    node.f = dval;
    let t = typeof dval;
    if (S.function === t && IS_TYPE[dval.name]) {
        node.t = dval.name.toLowerCase();
        node.f = clone(EMPTY_VAL[node.t]);
    }
    // Always insert default.
    node.p = false;
    return node;
};
exports.Default = Default;
const Empty = function (shape) {
    let node = buildize(this, shape);
    node.u.empty = true;
    return node;
};
exports.Empty = Empty;
// Value provides default.
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
const Never = function (shape) {
    let node = buildize(this, shape);
    node.t = S.never;
    return node;
};
exports.Never = Never;
const Key = function (depth, join) {
    let node = buildize(this);
    let ascend = 'number' === typeof depth;
    node.t = S.string;
    if (ascend && null == join) {
        node = nodize([]);
    }
    let custom = null;
    if ('function' === typeof depth) {
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
            if ('string' === typeof join) {
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
    let node = buildize();
    node.t = S.list;
    node.r = true;
    let shapes = inshapes.map(s => Gubu(s));
    node.u.list = inshapes;
    node.b.push(function All(val, update, state) {
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
                makeErr(state, S.Value + ' ' + S.$VALUE + S.forprop + S.$PATH + ' does not satisfy all of: ' +
                    `${inshapes.map(x => stringify(x, null, true)).join(', ')}`)
            ];
        }
        return pass;
    });
    return node;
};
exports.All = All;
// Pass if some match.
// TODO: UDPATE DOC: Does not short circuit (as defaults may be missed).
const Some = function (...inshapes) {
    let node = buildize();
    node.t = S.list;
    node.r = true;
    let shapes = inshapes.map(s => Gubu(s));
    node.u.list = inshapes;
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
                makeErr(state, S.Value + ' ' + S.$VALUE + S.forprop + S.$PATH + ' does not satisfy any of: ' +
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
    let node = buildize();
    node.t = S.list;
    node.r = true;
    let shapes = inshapes.map(s => Gubu(s));
    node.u.list = inshapes;
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
                makeErr(state, S.Value + ' ' + S.$VALUE + S.forprop + S.$PATH + ' does not satisfy one of: ' +
                    `${inshapes.map(x => stringify(x, null, true)).join(', ')}`)
            ];
        }
        return true;
    });
    return node;
};
exports.One = One;
const Exact = function (...vals) {
    let node = buildize();
    node.b.push(function Exact(val, update, state) {
        for (let i = 0; i < vals.length; i++) {
            if (val === vals[i]) {
                return true;
            }
        }
        update.err =
            makeErr(state, S.Value + ' ' + S.$VALUE + S.forprop + S.$PATH + ' must be exactly one of: ' +
                `${state.node.s}.`);
        update.done = true;
        return false;
    });
    node.s = vals.map(v => stringify(v, null, true)).join(', ');
    return node;
};
exports.Exact = Exact;
const Before = function (validate, shape) {
    let node = buildize(this, shape);
    node.b.push(validate);
    return node;
};
exports.Before = Before;
const After = function (validate, shape) {
    let node = buildize(this, shape);
    node.a.push(validate);
    return node;
};
exports.After = After;
const Check = function (check, shape) {
    let node = buildize(this, shape);
    if (S.function === typeof check) {
        let c$ = check;
        c$.gubu$ = c$.gubu$ || {};
        c$.gubu$.Check = true;
        node.b.push(check);
        node.s = (null == node.s ? S.MT : node.s + ';') + stringify(check, null, true);
        node.r = true;
    }
    else if (S.object === typeof check) {
        let dstr = Object.prototype.toString.call(check);
        if (dstr.includes('RegExp')) {
            let refn = (v) => (null == v || Number.isNaN(v)) ? false : !!String(v).match(check);
            defprop(refn, S.name, {
                value: String(check)
            });
            defprop(refn, 'gubu$', { value: { Check: true } });
            node.b.push(refn);
            node.s = stringify(check);
            node.r = true;
        }
    }
    // string is type name.
    // TODO: validate check is ValType
    else if (S.string === typeof check) {
        node.t = check;
        node.r = true;
    }
    return node;
};
exports.Check = Check;
const Open = function (shape) {
    let node = buildize(this, shape);
    node.c = Any();
    return node;
};
exports.Open = Open;
const Closed = function (shape) {
    let node = buildize(this, shape);
    // Makes one element array fixed.
    if (S.array === node.t && GUBU$NIL !== node.c && 0 === node.n) {
        node.v = [node.c];
        node.c = GUBU$NIL;
    }
    else {
        node.c = GUBU$NIL;
    }
    return node;
};
exports.Closed = Closed;
const Define = function (inopts, shape) {
    let node = buildize(this, shape);
    let opts = S.object === typeof inopts ? inopts || {} : {};
    let name = S.string === typeof inopts ? inopts : opts.name;
    if (null != name && S.MT != name) {
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
const Refer = function (inopts, shape) {
    let node = buildize(this, shape);
    let opts = S.object === typeof inopts ? inopts || {} : {};
    let name = S.string === typeof inopts ? inopts : opts.name;
    // Fill should be false (the default) if used recursively, to prevent loops.
    let fill = !!opts.fill;
    if (null != name && S.MT != name) {
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
const Rename = function (inopts, shape) {
    let node = buildize(this, shape);
    let opts = S.object === typeof inopts ? inopts || {} : {};
    let name = S.string === typeof inopts ? inopts : opts.name;
    let keep = 'boolean' === typeof opts.keep ? opts.keep : undefined;
    // NOTE: Rename claims are experimental.
    let claim = isarr(opts.claim) ? opts.claim : [];
    if (null != name && S.MT != name) {
        // If there is a claim, grab the value so that validations
        // can be applied to it.
        let before = (val, update, s) => {
            if (undefined === val && 0 < claim.length) {
                s.ctx.Rename = (s.ctx.Rename || {});
                s.ctx.Rename.fromDefault = (s.ctx.Rename.fromDefault || {});
                for (let cn of claim) {
                    let fromDefault = s.ctx.Rename.fromDefault[cn] || {};
                    // Only use claim if it was not a default value.
                    if (undefined !== s.parent[cn] && !fromDefault.yes) {
                        update.val = s.parent[cn];
                        if (!s.match) {
                            s.parent[name] = update.val;
                        }
                        update.node = fromDefault.node;
                        // Old errors on the claimed value are no longer valid.
                        for (let eI = 0; eI < s.err.length; eI++) {
                            if (s.err[eI].k === fromDefault.key) {
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
                            s.nodes.splice(j, 0, nodize(fromDefault.dval));
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
            s.ctx.Rename.fromDefault = (s.ctx.Rename.fromDefault || {});
            s.ctx.Rename.fromDefault[name] = {
                yes: s.fromDefault,
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
function valueLen(val) {
    return S.number === typeof (val) ? val :
        S.number === typeof (val === null || val === void 0 ? void 0 : val.length) ? val.length :
            null != val && S.object === typeof (val) ? keys(val).length :
                NaN;
}
function truncate(str, len) {
    let strval = String(str);
    let outlen = null == len || isNaN(len) ? 30 : len < 0 ? 0 : ~~len;
    let strlen = null == str ? 0 : strval.length;
    let substr = null == str ? S.MT : strval.substring(0, strlen);
    substr = outlen < strlen ? substr.substring(0, outlen - 3) + '...' : substr;
    return substr.substring(0, outlen);
}
exports.truncate = truncate;
const Min = function (min, shape) {
    let node = buildize(this, shape);
    node.b.push(function Min(val, update, state) {
        let vlen = valueLen(val);
        if (min <= vlen) {
            return true;
        }
        state.checkargs = { min: 1 };
        let errmsgpart = S.number === typeof (val) ? S.MT : 'length ';
        update.err =
            makeErr(state, S.Value + ' ' + S.$VALUE + S.forprop + S.$PATH +
                ` must be a minimum ${errmsgpart}of ${min} (was ${vlen}).`);
        return false;
    });
    node.s = S.Min + '(' + min + (null == shape ? S.MT :
        (',' + stringify(shape))) + ')';
    return node;
};
exports.Min = Min;
const Max = function (max, shape) {
    let node = buildize(this, shape);
    node.b.push(function Max(val, update, state) {
        let vlen = valueLen(val);
        if (vlen <= max) {
            return true;
        }
        let errmsgpart = S.number === typeof (val) ? S.MT : 'length ';
        update.err =
            makeErr(state, S.Value + ' ' + S.$VALUE + S.forprop + S.$PATH + ` must be a maximum ${errmsgpart}of ${max} (was ${vlen}).`);
        return false;
    });
    node.s = S.Max + '(' + max + (null == shape ? S.MT : (',' + stringify(shape))) + ')';
    return node;
};
exports.Max = Max;
const Above = function (above, shape) {
    let node = buildize(this, shape);
    node.b.push(function Above(val, update, state) {
        let vlen = valueLen(val);
        if (above < vlen) {
            return true;
        }
        let errmsgpart = S.number === typeof (val) ? 'be' : 'have length';
        update.err =
            makeErr(state, S.Value + ' ' + S.$VALUE + S.forprop + S.$PATH + ` must ${errmsgpart} above ${above} (was ${vlen}).`);
        return false;
    });
    node.s = S.Above + '(' + above + (null == shape ? S.MT : (',' + stringify(shape))) + ')';
    return node;
};
exports.Above = Above;
const Below = function (below, shape) {
    let node = buildize(this, shape);
    node.b.push(function Below(val, update, state) {
        let vlen = valueLen(val);
        if (vlen < below) {
            return true;
        }
        let errmsgpart = S.number === typeof (val) ? 'be' : 'have length';
        update.err =
            makeErr(state, S.Value + ' ' + S.$VALUE + S.forprop + S.$PATH + ` must ${errmsgpart} below ${below} (was ${vlen}).`);
        return false;
    });
    node.s = S.Below + '(' + below + (null == shape ? S.MT : (',' + stringify(shape))) + ')';
    return node;
};
exports.Below = Below;
const Len = function (len, shape) {
    let node = buildize(this, shape || Any());
    node.b.push(function Len(val, update, state) {
        let vlen = valueLen(val);
        if (len === vlen) {
            return true;
        }
        let errmsgpart = S.number === typeof (val) ? S.MT : ' in length';
        update.err =
            makeErr(state, S.Value + ' ' + S.$VALUE + S.forprop + S.$PATH + ` must be exactly ${len}${errmsgpart} (was ${vlen}).`);
        return false;
    });
    node.s = S.Len + '(' + len + (null == shape ? S.MT : (',' + stringify(shape))) + ')';
    return node;
};
exports.Len = Len;
/*
const Value: Builder = function(
  this: Node,
  value?: any,
  shape?: any
): Node {
  let node = undefined == shape ? buildize(this) : buildize(shape)
  let child = nodize(value)
  node.c = child
  return node
}
*/
// Child shape
const Child = function (child, shape) {
    let node = buildize(this, shape || {});
    node.c = nodize(child);
    return node;
};
exports.Child = Child;
function buildize(node0, node1) {
    // Detect chaining. If not chained, ignore `this` if it is the global context.
    let node = nodize(null == node0 || node0.window === node0 || node0.global === node0
        ? node1 : node0);
    // Only add chainable Builders.
    // NOTE: One, Some, All not chainable.
    return Object.assign(node, {
        Above,
        After,
        Any,
        Before,
        Below,
        Check,
        Child,
        Closed,
        Open,
        Define,
        Empty,
        Exact,
        Max,
        Min,
        Never,
        Len,
        Refer,
        Rename,
        Required,
        Skip,
        Ignore,
    });
}
exports.buildize = buildize;
// External utility to make ErrDesc objects.
function makeErr(state, text, why, user) {
    return makeErrImpl(why || 'check', state, 4000, text, user);
}
exports.makeErr = makeErr;
// TODO: optional message prefix from ctx
// Internal utility to make ErrDesc objects.
function makeErrImpl(why, s, mark, text, user, fname) {
    var _a;
    let err = {
        k: s.key,
        n: s.node,
        v: s.val,
        p: pathstr(s),
        w: why,
        c: ((_a = s.check) === null || _a === void 0 ? void 0 : _a.name) || 'none',
        a: s.checkargs || {},
        m: mark,
        t: S.MT,
        u: user || {},
    };
    let jstr = undefined === s.val ? S.MT : stringify(s.val);
    let valstr = truncate(jstr.replace(/"/g, S.MT));
    if (null == text || S.MT === text) {
        let valkind = valstr.startsWith('[') ? S.array :
            valstr.startsWith('{') ? S.object : 'value';
        let propkind = (valstr.startsWith('[') || isarr(s.parents[s.pI])) ?
            'index' : 'property';
        let propkindverb = 'is';
        let propkey = user === null || user === void 0 ? void 0 : user.k;
        propkey = isarr(propkey) ?
            (propkind = (1 < propkey.length ?
                (propkindverb = 'are', 'properties') : propkind),
                propkey.join(', ')) :
            propkey;
        err.t = `Validation failed for ` +
            (0 < err.p.length ? `${propkind} "${err.p}" with ` : S.MT) +
            `${valkind} "${valstr}" because ` +
            (S.type === why ? (S.instance === s.node.t ?
                `the ${valkind} is not an instance of ${s.node.u.n} ` :
                `the ${valkind} is not of type ${s.node.t}`) :
                S.required === why ? (S.MT === s.val ? 'an empty string is not allowed' :
                    `the ${valkind} is required`) :
                    'closed' === why ?
                        `the ${propkind} "${propkey}" ${propkindverb} not allowed` :
                        S.never === why ? 'no value is allowed' :
                            `check "${null == fname ? why : fname}" failed`) +
            (err.u.thrown ? ' (threw: ' + err.u.thrown.message + ')' : '.');
    }
    else {
        err.t = text
            .replace(/\$VALUE/g, valstr)
            .replace(/\$PATH/g, err.p);
    }
    return err;
}
function node2str(n) {
    return (null != n.s && S.MT !== n.s) ? n.s :
        (!n.r && undefined !== n.v) ? n.v : n.t;
}
function stringify(src, replacer, dequote, expand) {
    let str;
    if (!expand &&
        src && src.$ && (GUBU$ === src.$.gubu$ || true === src.$.gubu$)) {
        src = node2str(src);
    }
    try {
        str = JS(src, (key, val) => {
            var _a, _b;
            if (replacer) {
                val = replacer(key, val);
            }
            if (null != val &&
                S.object === typeof (val) &&
                val.constructor &&
                S.Object !== val.constructor.name &&
                S.Array !== val.constructor.name) {
                val =
                    S.function === typeof val.toString ? val.toString() : val.constructor.name;
            }
            else if (S.function === typeof (val)) {
                if (S.function === typeof (make[val.name]) && isNaN(+key)) {
                    val = undefined;
                }
                else if (null != val.name && S.MT !== val.name) {
                    val = val.name;
                }
                else {
                    val = truncate(val.toString().replace(/[ \t\r\n]+/g, ' '));
                }
            }
            else if ('bigint' === typeof (val)) {
                val = String(val.toString());
            }
            else if (Number.isNaN(val)) {
                return 'NaN';
            }
            else if (true !== expand &&
                (true === ((_a = val === null || val === void 0 ? void 0 : val.$) === null || _a === void 0 ? void 0 : _a.gubu$) || GUBU$ === ((_b = val === null || val === void 0 ? void 0 : val.$) === null || _b === void 0 ? void 0 : _b.gubu$))) {
                val = node2str(val);
            }
            return val;
        });
        str = String(str);
    }
    catch (e) {
        str = JS(String(src));
    }
    if (true === dequote) {
        str = str.replace(/^"/, S.MT).replace(/"$/, S.MT);
    }
    return str;
}
exports.stringify = stringify;
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
    Define,
    Default,
    Empty,
    Exact,
    Func,
    Key,
    Max,
    Min,
    Never,
    Len,
    One,
    Open,
    Optional,
    Refer,
    Rename,
    Required,
    Skip,
    Ignore,
    Some,
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
    ...(Object.entries(BuilderMap).reduce((a, n) => (a['G' + n[0]] = n[1]), {})),
    isShape: (v) => (v && GUBU === v.gubu),
    G$,
    buildize,
    makeErr,
    stringify,
    truncate,
    nodize,
    expr,
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
const GClosed = Closed;
exports.GClosed = GClosed;
const GDefine = Define;
exports.GDefine = GDefine;
const GDefault = Default;
exports.GDefault = GDefault;
const GEmpty = Empty;
exports.GEmpty = GEmpty;
const GExact = Exact;
exports.GExact = GExact;
const GFunc = Func;
exports.GFunc = GFunc;
const GKey = Key;
exports.GKey = GKey;
const GMax = Max;
exports.GMax = GMax;
const GMin = Min;
exports.GMin = GMin;
const GNever = Never;
exports.GNever = GNever;
const GLen = Len;
exports.GLen = GLen;
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
const GIgnore = Ignore;
exports.GIgnore = GIgnore;
const GSome = Some;
exports.GSome = GSome;
function MakeArgu(prefix) {
    return function Argu(args, whence, spec) {
        spec = spec || whence;
        whence = 'string' === typeof whence ? ' (' + whence + ')' : '';
        let shape = Gubu(spec, { prefix: prefix + whence });
        let keys = shape.spec().k;
        let argmap = {};
        for (let kI = 0; kI < keys.length; kI++) {
            argmap[keys[kI]] = kI < args.length ? args[kI] : args[args.length - 1];
        }
        return shape(argmap);
    };
}
exports.MakeArgu = MakeArgu;
//# sourceMappingURL=gubu.js.map