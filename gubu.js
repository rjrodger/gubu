"use strict";
/* Copyright (c) 2021-2023 Richard Rodger and other contributors, MIT License */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GDefine = exports.GDefault = exports.GClosed = exports.GChild = exports.GCheck = exports.GBelow = exports.GBefore = exports.GAny = exports.GAll = exports.GAfter = exports.GAbove = exports.Rest = exports.Some = exports.Skip = exports.Required = exports.Rename = exports.Refer = exports.Optional = exports.Open = exports.One = exports.Never = exports.Min = exports.Max = exports.Len = exports.Key = exports.Ignore = exports.Func = exports.Fault = exports.Exact = exports.Empty = exports.Define = exports.Default = exports.Closed = exports.Child = exports.Check = exports.Below = exports.Before = exports.Any = exports.All = exports.After = exports.Above = exports.MakeArgu = exports.expr = exports.truncate = exports.stringify = exports.makeErr = exports.buildize = exports.nodize = exports.G$ = exports.Gubu = void 0;
exports.GRest = exports.GSome = exports.GSkip = exports.GRequired = exports.GRename = exports.GRefer = exports.GOptional = exports.GOpen = exports.GOne = exports.GNever = exports.GMin = exports.GMax = exports.GLen = exports.GKey = exports.GIgnore = exports.GFunc = exports.GFault = exports.GExact = exports.GEmpty = void 0;
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
// DOC: Skip also makes value optional - thus Skip() means any value, or nonexistent
// DOC: Optional
const util_1 = require("util");
// Package version.
const VERSION = '7.0.0';
// Unique symbol for marking and recognizing Gubu shapes.
const GUBU$ = Symbol.for('gubu$');
// A singleton for fast equality checks.
const GUBU = { gubu$: GUBU$, v$: VERSION };
// A special marker for property abscence.
const GUBU$NIL = Symbol.for('gubu$nil');
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
    Object: 'Object',
    Array: 'Array',
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
        this.fromDflt = false;
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
        return Object.assign(Object.assign({}, this), { err: this.desc().err, name: this.name, message: this.message });
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
    var _a, _b, _c, _d;
    // If using builder as property of Gubu, `this` is just Gubu, not a node.
    if (make === shape) {
        shape = undefined;
    }
    // Is this a (possibly incomplete) Node<S>?
    else if (null != shape && ((_a = shape.$) === null || _a === void 0 ? void 0 : _a.gubu$)) {
        // Assume complete if gubu$ has special internal reference.
        if (GUBU$ === shape.$.gubu$) {
            shape.d = null == depth ? shape.d : depth;
            return shape;
        }
        // Normalize an incomplete Node<S>, avoiding any recursive calls to norm.
        else if (true === shape.$.gubu$) {
            let node = Object.assign({}, shape);
            node.$ = Object.assign(Object.assign({ v$: VERSION }, node.$), { gubu$: GUBU$ });
            node.v =
                (null != node.v && S.object === typeof (node.v)) ? Object.assign({}, node.v) : node.v;
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
        else if (v.gubu === GUBU || true === ((_b = v.$) === null || _b === void 0 ? void 0 : _b.gubu)) {
            let gs = v.node ? v.node() : v;
            t = gs.t;
            v = gs.v;
            f = v;
            r = gs.r;
            u = Object.assign({}, gs.u);
            a = [...gs.a];
            b = [...gs.b];
        }
        // Instance of a class.
        // Note: uses the convention that a class name is captialized.
        else if (S.Function === v.constructor.name &&
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
    else if (S.string === t && '' === v) {
        u.empty = true;
    }
    let vmap = (null != v && (S.object === t || S.array === t)) ? Object.assign({}, v) : v;
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
        m: meta || {}
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
            'G' + ('' + Math.random()).substring(2, 8) : '' + opts.name;
    opts.prefix = null == opts.prefix ? undefined : opts.prefix;
    // Meta properties are off by default.
    let optsmeta = opts.meta = opts.meta || {};
    optsmeta.active = (true === optsmeta.active) || false;
    optsmeta.suffix = S.string == typeof optsmeta.suffix ? optsmeta.suffix : '$$';
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
            let fatal = false;
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
                        s.fromDflt = true;
                        val = s.val;
                        descend = false;
                    }
                    else if (!n.p || !valundef) {
                        // Descend into object, constructing child defaults
                        s.updateVal(s.val || (s.fromDflt = true, {}));
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
                                        if (S.string === typeof (n.v[k])) {
                                            meta.short = n.v[k];
                                        }
                                        else {
                                            meta = Object.assign(Object.assign({}, meta), n.v[k]);
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
                    else if (!n.p && valundef && undefined !== n.f) {
                        s.updateVal(n.f);
                        s.fromDflt = true;
                    }
                    else if (!n.p || null != s.val) {
                        s.updateVal(s.val || (s.fromDflt = true, []));
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
                                let elementShape = n.c = nodize(n.c, 1 + s.dI);
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
                                s.ctx.log('kv', Object.assign(Object.assign({}, s), { key: 0, val: n.c }));
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
            let ignoreVal = s.node.p ? false === s.ignoreVal ? false : true : !!s.ignoreVal;
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
    gubuShape.stringify = (shape) => {
        let n = null == shape ? top : (shape.node && shape.node());
        n = (null != n && n.$ && (GUBU$ === n.$.gubu$ || true === n.$.gubu$)) ? n.v : n;
        return Gubu.stringify(n);
    };
    let desc = '';
    gubuShape.toString = () => {
        desc = truncate('' === desc ?
            stringify((null != top &&
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
    let top = false;
    if (null == spec.tokens) {
        top = true;
        spec.tokens = [];
        let tre = /\s*,?\s*([)(\.]|"(\\.|[^"\\])*"|\/(\\.|[^\/\\])*\/[a-z]?|[^)(,\s]+)\s*/g;
        let t = null;
        while (t = tre.exec(spec.src)) {
            spec.tokens.push(t[1]);
        }
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
            else if (S.undefined === head) {
                return undefined;
            }
            else if ('NaN' === head) {
                return NaN;
            }
            else if (head.match(/^\/.+\/$/)) {
                return new RegExp(head.substring(1, head.length - 1));
            }
            else {
                return JP(head);
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
    }
    spec.i++;
    spec.val = fn.call(spec.val, ...args);
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
        S.number === typeof (val === null || val === void 0 ? void 0 : val.length) ? val.length :
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
exports.truncate = truncate;
// Value is required.
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
// OR: providde validation of Key - depth could also be a RegExp
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
    let node = buildize();
    node.t = S.list;
    node.r = true;
    let shapes = inshapes.map(s => Gubu(s));
    node.u.list = inshapes;
    node.b.push(function All(val, update, state) {
        let pass = true;
        // let err: any = []
        for (let shape of shapes) {
            let subctx = Object.assign(Object.assign({}, state.ctx), { err: [] });
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
    });
    return node;
};
exports.All = All;
// Pass if some match. Note: all are evaluated, does not short circuit. This ensures
// defaults are not missed.
const Some = function (...inshapes) {
    let node = buildize();
    node.t = S.list;
    node.r = true;
    let shapes = inshapes.map(s => Gubu(s));
    node.u.list = inshapes;
    node.b.push(function Some(val, update, state) {
        let pass = false;
        for (let shape of shapes) {
            let subctx = Object.assign(Object.assign({}, state.ctx), { err: [] });
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
    let node = buildize();
    node.t = S.list;
    node.r = true;
    let shapes = inshapes.map(s => Gubu(s));
    node.u.list = inshapes;
    node.b.push(function One(val, update, state) {
        let passN = 0;
        for (let shape of shapes) {
            let subctx = Object.assign(Object.assign({}, state.ctx), { err: [] });
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
// Vlaue must match excatly one of the literal values provided.
const Exact = function (...vals) {
    let node = buildize();
    node.b.push(function Exact(val, update, state) {
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
                `${state.node.s}.`);
        update.done = true;
        return false;
    });
    node.s = vals.map(v => stringify(v, null, true)).join(', ');
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
    if (S.function === typeof check) {
        let c$ = check;
        c$.gubu$ = c$.gubu$ || {};
        c$.gubu$.Check = true;
        node.b.push(check);
        node.s = (null == node.s ? '' : node.s + ';') + stringify(check, null, true);
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
// Value cannot contain undeclared properties or elements.
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
                    let node = Object.assign({}, ref[name]);
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
// Specific a minimum value or length.
const Min = function (min, shape) {
    let node = buildize(this, shape);
    node.b.push(function Min(val, update, state) {
        let vlen = valueLen(val);
        if (min <= vlen) {
            return true;
        }
        state.checkargs = { min: 1 };
        let errmsgpart = S.number === typeof (val) ? '' : 'length ';
        update.err =
            makeErr(state, S.Value + ' ' + S.$VALUE + S.forprop + S.$PATH +
                ` must be a minimum ${errmsgpart}of ${min} (was ${vlen}).`);
        return false;
    });
    node.s = S.Min + '(' + min + (null == shape ? '' :
        (',' + stringify(shape))) + ')';
    return node;
};
exports.Min = Min;
// Specific a maximum value or length.
const Max = function (max, shape) {
    let node = buildize(this, shape);
    node.b.push(function Max(val, update, state) {
        let vlen = valueLen(val);
        if (vlen <= max) {
            return true;
        }
        let errmsgpart = S.number === typeof (val) ? '' : 'length ';
        update.err =
            makeErr(state, S.Value + ' ' + S.$VALUE + S.forprop + S.$PATH + ` must be a maximum ${errmsgpart}of ${max} (was ${vlen}).`);
        return false;
    });
    node.s = S.Max + '(' + max + (null == shape ? '' : (',' + stringify(shape))) + ')';
    return node;
};
exports.Max = Max;
// Specify a lower bound value or length.
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
    node.s = S.Above + '(' + above + (null == shape ? '' : (',' + stringify(shape))) + ')';
    return node;
};
exports.Above = Above;
// Specify an upper bound value or length.
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
    node.s = S.Below + '(' + below + (null == shape ? '' : (',' + stringify(shape))) + ')';
    return node;
};
exports.Below = Below;
// Value must have a specific length.
const Len = function (len, shape) {
    let node = buildize(this, shape || Any());
    node.b.push(function Len(val, update, state) {
        let vlen = valueLen(val);
        if (len === vlen) {
            return true;
        }
        let errmsgpart = S.number === typeof (val) ? '' : ' in length';
        update.err =
            makeErr(state, S.Value + ' ' + S.$VALUE + S.forprop + S.$PATH + ` must be exactly ${len}${errmsgpart} (was ${vlen}).`);
        return false;
    });
    node.s = S.Len + '(' + len + (null == shape ? '' : (',' + stringify(shape))) + ')';
    return node;
};
exports.Len = Len;
// Children must have a specified shape.
const Child = function (child, shape) {
    // Child provides implicit open object if no shape defined.
    let node = buildize(this, shape || {});
    node.c = nodize(child);
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
// Make a Node chainable with Builder methods.
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
    });
}
exports.buildize = buildize;
// External utility to make ErrDesc objects.
function makeErr(state, text, why, user) {
    return makeErrImpl(why || S.check, state, 4000, text, user);
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
        let propkey = user === null || user === void 0 ? void 0 : user.k;
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
function node2str(n) {
    return (null != n.s && '' !== n.s) ? n.s :
        (!n.r && undefined !== n.v) ?
            ('function' === typeof n.v.constructor ? n.v : n.v.toString())
            : n.t;
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
                let strdesc = toString.call(val);
                if ('[object RegExp]' === strdesc) {
                    val = val.toString();
                }
                else {
                    val =
                        S.function === typeof val.toString ? val.toString() : val.constructor.name;
                }
            }
            else if (S.function === typeof (val)) {
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
                val = String(val.toString());
            }
            else if (Number.isNaN(val)) {
                return 'NaN';
            }
            else if (true !== expand &&
                (true === ((_a = val === null || val === void 0 ? void 0 : val.$) === null || _a === void 0 ? void 0 : _a.gubu$) || GUBU$ === ((_b = val === null || val === void 0 ? void 0 : val.$) === null || _b === void 0 ? void 0 : _b.gubu$))) {
                val = node2str(val);
            }
            // console.log('WWW', val, typeof val)
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
    return str;
}
exports.stringify = stringify;
function clone(x) {
    return null == x ? x : S.object !== typeof (x) ? x : JP(JS(x));
}
const G$ = (node) => nodize(Object.assign(Object.assign({}, node), { $: { gubu$: true } }));
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
};
// Fix builder names after terser mangles them.
/* istanbul ignore next */
if (S.undefined !== typeof (window)) {
    for (let builderName in BuilderMap) {
        defprop(BuilderMap[builderName], S.name, { value: builderName });
    }
}
Object.assign(make, Object.assign(Object.assign(Object.assign({ Gubu: make }, BuilderMap), (Object.entries(BuilderMap).reduce((a, n) => (a['G' + n[0]] = n[1], a), {}))), { isShape: (v) => (v && GUBU === v.gubu), G$,
    buildize,
    makeErr,
    stringify,
    truncate,
    nodize,
    expr,
    MakeArgu }));
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
exports.MakeArgu = MakeArgu;
//# sourceMappingURL=gubu.js.map