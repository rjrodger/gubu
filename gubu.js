"use strict";
/* Copyright (c) 2021-2022 Richard Rodger and other contributors, MIT License */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GSome = exports.GRequired = exports.GRename = exports.GRefer = exports.GOptional = exports.GOne = exports.GNever = exports.GMin = exports.GMax = exports.GExact = exports.GEmpty = exports.GDefine = exports.GClosed = exports.GBelow = exports.GBefore = exports.GAny = exports.GAll = exports.GAfter = exports.GAbove = exports.Some = exports.Required = exports.Rename = exports.Refer = exports.Optional = exports.One = exports.Never = exports.Min = exports.Max = exports.Exact = exports.Empty = exports.Define = exports.Closed = exports.Below = exports.Before = exports.Any = exports.All = exports.After = exports.Above = exports.Args = exports.makeErr = exports.buildize = exports.norm = exports.G$ = exports.Gubu = void 0;
// TODO: spread shape for all object values:  Value(vshape)
// TODO: validator on completion of object or array
const util_1 = require("util");
const package_json_1 = __importDefault(require("./package.json"));
const GUBU$ = Symbol.for('gubu$');
const GUBU = { gubu$: GUBU$, v$: package_json_1.default.version };
// The current validation state.
class State {
    constructor(root, top, ctx) {
        this.dI = 0; // Node depth.
        this.nI = 2; // Next free slot in nodes.
        this.pI = 0; // Pointer to current node.
        this.sI = -1; // Pointer to next sibling node.
        this.pass = true;
        this.err = [];
        this.terr = [];
        this.srcs = [root, -1];
        this.node = top;
        this.nodes = [top, -1];
        this.parents = [];
        this.path = [];
        this.key = top.k;
        this.ctx = ctx;
    }
}
class GubuError extends TypeError {
    constructor(code, err, ctx) {
        let message = err.map((e) => e.t).join('\n');
        super(message);
        let name = 'GubuError';
        let ge = this;
        ge.gubu = true;
        ge.name = name;
        ge.code = code;
        ge.desc = () => ({ name, code, err, ctx, });
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
const EMPTY_VAL = {
    string: '',
    number: 0,
    boolean: false,
    object: {},
    array: [],
    function: () => undefined,
    symbol: Symbol(''),
    bigint: BigInt(0),
    null: null,
};
function norm(spec) {
    var _a, _b, _c, _d, _e, _f;
    // Is this a (possibly incomplete) ValSpec?
    if (null != spec && ((_a = spec.$) === null || _a === void 0 ? void 0 : _a.gubu$)) {
        // Assume complete if gubu$ has special internal reference.
        if (GUBU$ === spec.$.gubu$) {
            return spec;
        }
        // Normalize an incomplete ValSpec, avoiding any recursive calls to norm.
        else if (true === spec.$.gubu$) {
            let vs = { ...spec };
            vs.$ = { v$: package_json_1.default.version, ...vs.$, gubu$: GUBU$ };
            vs.v = (null != vs.v && 'object' === typeof (vs.v)) ? { ...vs.v } : vs.v;
            vs.t = vs.t || typeof (vs.v);
            if ('function' === vs.t && IS_TYPE[vs.v.name]) {
                vs.t = vs.v.name.toLowerCase();
                vs.v = clone(EMPTY_VAL[vs.t]);
            }
            vs.k = null == vs.k ? '' : vs.k;
            vs.r = !!vs.r;
            vs.o = !!vs.o;
            vs.d = null == vs.d ? -1 : vs.d;
            vs.b = vs.b || [];
            vs.a = vs.a || [];
            vs.u = vs.u || {};
            if ((_b = vs.u.list) === null || _b === void 0 ? void 0 : _b.specs) {
                vs.u.list.specs = [...vs.u.list.specs];
            }
            return vs;
        }
    }
    // Not a ValSpec, so build one based on value and its type.
    let t = (null === spec ? 'null' : typeof (spec));
    t = ('undefined' === t ? 'any' : t);
    let v = spec;
    let r = false; // Optional by default.
    let o = false; // Only true when Optional builder is used.
    let b = undefined;
    let u = {};
    if ('object' === t) {
        if (Array.isArray(spec)) {
            t = 'array';
        }
        else if (null != v &&
            Function !== v.constructor &&
            Object !== v.constructor &&
            null != v.constructor) {
            t = 'instance';
            u.n = v.constructor.name;
            u.i = v.constructor;
        }
    }
    else if ('function' === t) {
        if (IS_TYPE[spec.name]) {
            t = spec.name.toLowerCase();
            r = true;
            v = clone(EMPTY_VAL[t]);
        }
        else if (spec.gubu === GUBU || true === ((_c = spec.$) === null || _c === void 0 ? void 0 : _c.gubu)) {
            let gs = spec.spec ? spec.spec() : spec;
            t = gs.t;
            v = gs.v;
            r = gs.r;
            u = gs.u;
        }
        else if ((undefined === spec.prototype && Function === spec.constructor) ||
            Function === ((_d = spec.prototype) === null || _d === void 0 ? void 0 : _d.constructor)) {
            t = 'custom';
            b = v;
        }
        else {
            t = 'instance';
            r = true;
            u.n = (_f = (_e = v.prototype) === null || _e === void 0 ? void 0 : _e.constructor) === null || _f === void 0 ? void 0 : _f.name;
            u.i = v;
        }
    }
    else if ('number' === t && isNaN(v)) {
        t = 'nan';
    }
    let vs = {
        $: GUBU,
        t,
        v: (null != v && ('object' === t || 'array' === t)) ? { ...v } : v,
        r,
        o,
        k: '',
        d: -1,
        u,
        a: [],
        b: [],
    };
    if (b) {
        // vs.b = b
        vs.b.push(b);
    }
    return vs;
}
exports.norm = norm;
function make(inspec, inopts) {
    const opts = null == inopts ? {} : inopts;
    opts.name =
        null == opts.name ? 'G' + ('' + Math.random()).substring(2, 8) : '' + opts.name;
    // let top = { '': inspec }
    let top = inspec;
    let spec = norm(top); // Tree of validation nodes.
    // TODO: move to norm?
    spec.d = 0;
    let gubuShape = function GubuShape(inroot, inctx) {
        const ctx = inctx || {};
        let root = inroot;
        let s = new State(root, spec, ctx);
        // let s.node: any       // Current node.  
        // let src: any        // Current source value to validate.
        let parent;
        // Iterative depth-first traversal of the spec.
        while (true) {
            let isRoot = 0 === s.pI;
            // printStacks(nodes, srcs, parents)
            // Dereference the back pointers to ancestor siblings.
            // Only objects|arrays can be nodes, so a number is a back pointer.
            // NOTE: terminates because (+{...} -> NaN, +[] -> 0) -> false (JS wat FTW!)
            let nextNode = s.nodes[s.pI];
            // console.log('NODE-0', 'd=' + dI, pI, nI, +node, node.k, node.t)
            while (+nextNode) {
                s.pI = +nextNode;
                nextNode = s.nodes[s.pI];
                s.dI--;
            }
            // console.log('NODE-1', 'd=' + dI, pI, nI, +node, node?.k, node?.t)
            if (!nextNode) {
                break;
            }
            else {
                s.node = nextNode;
            }
            s.sI = s.pI + 1;
            // src = s.srcs[s.pI]
            let sval = s.srcs[s.pI];
            parent = s.parents[s.pI];
            s.pI = s.nI;
            let nextSibling = true;
            let key = s.node.k;
            let t = s.node.t;
            // let sval = src
            s.path[s.dI] = key;
            // console.log('PATH', dI, pathstr(path, dI), 'KEY', key)
            let oval = sval;
            let stype = typeof (sval);
            if ('number' === stype && isNaN(sval)) {
                stype = 'nan';
            }
            let terr = [];
            let vs = s.node;
            let pass = true;
            let done = false;
            if (0 < vs.b.length) {
                for (let bI = 0; bI < vs.b.length; bI++) {
                    let update = handleValidate(vs.b[bI], sval, {
                        dI: s.dI, nI: s.nI, sI: s.sI, pI: s.pI,
                        key, node: vs, val: sval, parent, nodes: s.nodes, srcs: s.srcs, path: s.path, terr, err: s.err, ctx,
                        pass, oval, parents: s.parents
                    });
                    pass = update.pass;
                    if (undefined !== update.val) {
                        sval = update.val;
                        if (isRoot) {
                            root = sval;
                        }
                        stype = typeof (sval);
                    }
                    if (undefined !== update.node) {
                        vs = update.node;
                    }
                    if (undefined !== update.type) {
                        t = update.type;
                    }
                    if (undefined !== update.done) {
                        done = update.done;
                    }
                    s.nI = undefined === update.nI ? s.nI : update.nI;
                    s.sI = undefined === update.sI ? s.sI : update.sI;
                    s.pI = undefined === update.pI ? s.pI : update.pI;
                }
            }
            if (!done) {
                if ('never' === t) {
                    terr.push(makeErrImpl('never', sval, s.path, s.dI, vs, 1070));
                }
                else if ('object' === t) {
                    if (vs.r && undefined === sval) {
                        terr.push(makeErrImpl('required', sval, s.path, s.dI, vs, 1010));
                    }
                    else if (undefined !== sval && (null === sval ||
                        'object' !== stype ||
                        Array.isArray(sval))) {
                        terr.push(makeErrImpl('type', sval, s.path, s.dI, vs, 1020));
                    }
                    // else if (null != src[key] || !vs.o) {
                    else if (!vs.o) {
                        sval = sval || {};
                        if (isRoot) {
                            root = sval;
                        }
                        let vkeys = Object.keys(vs.v);
                        if (0 < vkeys.length) {
                            s.pI = s.nI;
                            for (let k of vkeys) {
                                let nvs = vs.v[k] = norm(vs.v[k]);
                                // TODO: move to norm?
                                nvs.k = k;
                                nvs.d = 1 + s.dI;
                                s.nodes[s.nI] = nvs;
                                s.srcs[s.nI] = sval[k];
                                s.parents[s.nI] = sval;
                                s.nI++;
                            }
                            s.dI++;
                            s.nodes[s.nI++] = s.sI;
                            nextSibling = false;
                        }
                    }
                }
                else if ('array' === t) {
                    if (vs.r && undefined === sval) {
                        terr.push(makeErrImpl('required', sval, s.path, s.dI, vs, 1030));
                    }
                    else if (undefined !== sval && !Array.isArray(sval)) {
                        terr.push(makeErrImpl('type', sval, s.path, s.dI, vs, 1040));
                    }
                    else if (!vs.o) {
                        sval = sval || [];
                        if (isRoot) {
                            root = sval;
                        }
                        let vkeys = Object.keys(vs.v).filter(k => !isNaN(+k));
                        if (0 < sval.length || 1 < vkeys.length) {
                            s.pI = s.nI;
                            let nvs = undefined === vs.v[0] ? Any() : vs.v[0] = norm(vs.v[0]);
                            nvs.k = '0';
                            nvs.d = 1 + s.dI;
                            // Special elements
                            let j = 1;
                            if (1 < vkeys.length) {
                                for (; j < vkeys.length; j++) {
                                    let jvs = vs.v[j] = norm(vs.v[j]);
                                    // TODO: move to norm?
                                    jvs.k = '' + (j - 1);
                                    jvs.d = 1 + s.dI;
                                    s.nodes[s.nI] = { ...jvs, k: '' + (j - 1) };
                                    s.srcs[s.nI] = sval[(j - 1)];
                                    s.parents[s.nI] = sval;
                                    s.nI++;
                                }
                            }
                            for (let i = j - 1; i < sval.length; i++) {
                                s.nodes[s.nI] = { ...nvs, k: '' + i };
                                s.srcs[s.nI] = sval[i];
                                s.parents[s.nI] = sval;
                                s.nI++;
                            }
                            s.dI++;
                            s.nodes[s.nI++] = s.sI;
                            nextSibling = false;
                        }
                    }
                }
                // Invalid type.
                else if (!('any' === t ||
                    'custom' === t ||
                    'list' === t ||
                    undefined === sval ||
                    t === stype ||
                    ('instance' === t && vs.u.i && sval instanceof vs.u.i) ||
                    ('null' === t && null === sval))) {
                    terr.push(makeErrImpl('type', sval, s.path, s.dI, vs, 1050));
                    pass = false;
                }
                // Value itself, or default.
                else if (undefined === sval) {
                    let parentKey = s.path[s.dI];
                    if (vs.r && ('undefined' !== t || !parent.hasOwnProperty(parentKey))) {
                        terr.push(makeErrImpl('required', sval, s.path, s.dI, vs, 1060));
                        pass = false;
                    }
                    else if (undefined !== vs.v && !vs.o || 'undefined' === t) {
                        sval = vs.v;
                        if (isRoot) {
                            root = sval;
                        }
                    }
                }
                // Empty strings fail even if string is optional. Use Empty to allow.
                else if ('string' === t && '' === sval) {
                    if (!vs.u.empty) {
                        terr.push(makeErrImpl('required', sval, s.path, s.dI, vs, 1080));
                    }
                }
            }
            //   // console.log('KEY3', key, pass, done, vs.a)
            if (0 < vs.a.length) {
                for (let aI = 0; aI < vs.a.length; aI++) {
                    let update = handleValidate(vs.a[aI], sval, {
                        dI: s.dI, nI: s.nI, sI: s.sI, pI: s.pI,
                        key, node: vs, val: sval, parent, nodes: s.nodes, srcs: s.srcs, path: s.path, terr, err: s.err, ctx,
                        pass, oval, parents: s.parents
                    });
                    if (undefined !== update.val) {
                        sval = update.val;
                        if (isRoot) {
                            root = sval;
                        }
                        stype = typeof (sval);
                    }
                    if (undefined !== update.done) {
                        done = update.done;
                    }
                    s.nI = undefined === update.nI ? s.nI : update.nI;
                    s.sI = undefined === update.sI ? s.sI : update.sI;
                    s.pI = undefined === update.pI ? s.pI : update.pI;
                }
            }
            if (0 < terr.length) {
                s.err.push(...terr);
            }
            if (parent && !done) {
                parent[key] = sval;
            }
            if (nextSibling) {
                s.pI = s.sI;
            }
        }
        if (0 < s.err.length) {
            if (ctx.err) {
                ctx.err.push(...s.err);
            }
            else {
                throw new GubuError('shape', s.err, ctx);
            }
        }
        return root;
    };
    // TODO: test Number, String, etc also in arrays
    gubuShape.spec = () => {
        // Normalize spec, discard errors.
        gubuShape(undefined, { err: [] });
        return JSON.parse(stringify(spec, (_key, val) => {
            if (GUBU$ === val) {
                return true;
            }
            return val;
        }));
    };
    let desc = '';
    gubuShape.toString = gubuShape[util_1.inspect.custom] = () => {
        desc = '' === desc ?
            stringify((inspec &&
                inspec.$ &&
                (GUBU$ === inspec.$.gubu$ || true === inspec.$.gubu$)) ? inspec.v : inspec) :
            desc;
        desc = desc.substring(0, 33) + (33 < desc.length ? '...' : '');
        return `[Gubu ${opts.name} ${desc}]`;
    };
    gubuShape.gubu = GUBU;
    return gubuShape;
}
/*
function printStacks(nodes: any[], srcs: any[], parents: any[]) {
  for (let i = 0; i < nodes.length || i < srcs.length || i < parents.length; i++) {
    console.log(i, '\t',
      isNaN(+nodes[i]) ? nodes[i].k + ':' + nodes[i].t : +nodes[i],
      '\t', srcs[i], '\t', parents[i])
  }
}
*/
function handleValidate(vf, sval, state) {
    let update = { pass: true, done: false };
    let valid = vf(sval, update, state);
    if (!valid || update.err) {
        // Explicit Optional allows undefined
        if (undefined === sval && (state.node.o || !state.node.r)) {
            delete update.err;
            update.pass = true;
            return update;
        }
        let w = update.why || 'custom';
        let p = pathstr(state.path, state.dI);
        if ('object' === typeof (update.err)) {
            // Assumes makeErr already called
            state.terr.push(...[update.err].flat().map(e => {
                e.p = null == e.p ? p : e.p;
                e.m = null == e.m ? 2010 : e.m;
                return e;
            }));
        }
        else {
            let fname = vf.name;
            if (null == fname || '' == fname) {
                fname = vf.toString().replace(/[ \t\r\n]+/g, ' ');
                fname = 33 < fname.length ? fname.substring(0, 30) + '...' : fname;
            }
            state.terr.push(makeErrImpl(w, sval, state.path, state.dI, state.node, 1045, undefined, {}, fname));
        }
        update.pass = false;
    }
    return update;
}
function pathstr(path, dI) {
    return path.slice(1, dI + 1).filter(s => null != s).join('.');
}
const Required = function (spec) {
    let vs = buildize(this, spec);
    vs.r = true;
    if (undefined === spec && 1 === arguments.length) {
        vs.t = 'undefined';
        vs.v = undefined;
    }
    return vs;
};
exports.Required = Required;
const Optional = function (spec) {
    let vs = buildize(this, spec);
    vs.r = false;
    // Mark Optional as explicit, this do not insert empty arrays and objects.
    vs.o = true;
    return vs;
};
exports.Optional = Optional;
const Empty = function (spec) {
    let vs = buildize(this, spec);
    vs.u.empty = true;
    return vs;
};
exports.Empty = Empty;
// Optional value provides default.
const Any = function (spec) {
    let vs = buildize(this, spec);
    vs.t = 'any';
    if (undefined !== spec) {
        vs.v = spec;
    }
    return vs;
};
exports.Any = Any;
const Never = function (spec) {
    let vs = buildize(this, spec);
    vs.t = 'never';
    return vs;
};
exports.Never = Never;
// Pass only if all match. Does not short circuit (as defaults may be missed).
const All = function (...specs) {
    let vs = buildize();
    vs.t = 'list';
    let shapes = specs.map(s => Gubu(s));
    vs.u.list = specs;
    vs.b.push(function All(val, update, state) {
        let pass = true;
        let err = [];
        for (let shape of shapes) {
            let subctx = { ...state.ctx, err: [] };
            shape(val, subctx);
            if (0 < subctx.err.length) {
                pass = false;
                err.push(...subctx.err);
            }
        }
        if (!pass) {
            update.why = 'all';
            update.err = [
                makeErr(val, state, `Value "$VALUE" for path "$PATH" does not satisfy All shape:`),
                ...err
            ];
        }
        return pass;
    });
    return vs;
};
exports.All = All;
// Pass if some match. Does not short circuit (as defaults may be missed).
const Some = function (...specs) {
    let vs = buildize();
    vs.t = 'list';
    let shapes = specs.map(s => Gubu(s));
    vs.u.list = specs;
    vs.b.push(function Some(val, update, state) {
        let pass = false;
        let err = [];
        for (let shape of shapes) {
            let subctx = { ...state.ctx, err: [] };
            shape(val, subctx);
            if (0 < subctx.err.length) {
                pass || (pass = false);
                err.push(...subctx.err);
            }
            else {
                pass = true;
            }
        }
        if (!pass) {
            update.why = 'some';
            update.err = [
                makeErr(val, state, `Value "$VALUE" for path "$PATH" does not satisfy Some shape:`),
                ...err
            ];
        }
        return pass;
    });
    return vs;
};
exports.Some = Some;
// Pass if exactly one matches. Does not short circuit (as defaults may be missed).
const One = function (...specs) {
    let vs = buildize();
    vs.t = 'list';
    let shapes = specs.map(s => Gubu(s));
    vs.u.list = specs;
    vs.b.push(function One(val, update, state) {
        let passN = 0;
        let err = [];
        for (let shape of shapes) {
            let subctx = { ...state.ctx, err: [] };
            shape(val, subctx);
            if (0 < subctx.err.length) {
                passN++;
                err.push(...subctx.err);
            }
        }
        if (1 !== passN) {
            update.why = 'one';
            update.err = [
                makeErr(val, state, `Value "$VALUE" for path "$PATH" does not satisfy One shape:`),
                ...err
            ];
        }
        return true;
    });
    return vs;
};
exports.One = One;
const Exact = function (...vals) {
    let vs = buildize();
    vs.b.push(function Exact(val, update, state) {
        for (let i = 0; i < vals.length; i++) {
            if (val === vals[i]) {
                return true;
            }
        }
        update.err =
            makeErr(val, state, `Value "$VALUE" for path "$PATH" must be exactly one of: ` +
                `${vals.map(v => stringify(v)).join(', ')}.`);
        return false;
    });
    return vs;
};
exports.Exact = Exact;
const Before = function (validate, spec) {
    let vs = buildize(this, spec);
    vs.b.push(validate);
    return vs;
};
exports.Before = Before;
const After = function (validate, spec) {
    let vs = buildize(this, spec);
    vs.a.push(validate);
    return vs;
};
exports.After = After;
const Closed = function (spec) {
    let vs = buildize(this, spec);
    vs.b.push(function Closed(val, update, state) {
        if (null != val && 'object' === typeof (val)) {
            let vkeys = Object.keys(val);
            let allowed = vs.v;
            // For arrays, handle non-index properties, and special element offset.
            if ('array' === state.node.t) {
                allowed = Object.keys(vs.v).slice(1)
                    .map((x) => {
                    let i = parseInt(x);
                    if (isNaN(i)) {
                        return x;
                    }
                    else {
                        return i - 1;
                    }
                })
                    .reduce((a, i) => (a[i] = true, a), {});
            }
            update.err = [];
            for (let k of vkeys) {
                if (undefined === allowed[k]) {
                    update.err.push(makeErrImpl('closed', val, state.path, state.dI, vs, 3010, '', { k }));
                }
            }
            return 0 === update.err.length;
        }
        return true;
    });
    return vs;
};
exports.Closed = Closed;
const Define = function (inopts, spec) {
    let vs = buildize(this, spec);
    let opts = 'object' === typeof inopts ? inopts || {} : {};
    let name = 'string' === typeof inopts ? inopts : opts.name;
    if (null != name && '' != name) {
        vs.b.push(function Define(_val, _update, state) {
            let ref = state.ctx.ref = state.ctx.ref || {};
            ref[name] = state.node;
            return true;
        });
    }
    return vs;
};
exports.Define = Define;
const Refer = function (inopts, spec) {
    let vs = buildize(this, spec);
    let opts = 'object' === typeof inopts ? inopts || {} : {};
    let name = 'string' === typeof inopts ? inopts : opts.name;
    // Fill should be false (the default) if used recursively, to prevent loops.
    let fill = !!opts.fill;
    if (null != name && '' != name) {
        vs.b.push(function Refer(val, update, state) {
            if (undefined !== val || fill) {
                let ref = state.ctx.ref = state.ctx.ref || {};
                if (undefined !== ref[name]) {
                    let node = { ...ref[name] };
                    node.k = state.node.k;
                    node.t = node.t || 'never';
                    update.node = node;
                    update.type = node.t;
                }
            }
            // TODO: option to fail if ref not found?
            return true;
        });
    }
    return vs;
};
exports.Refer = Refer;
const Rename = function (inopts, spec) {
    let vs = buildize(this, spec);
    let opts = 'object' === typeof inopts ? inopts || {} : {};
    let name = 'string' === typeof inopts ? inopts : opts.name;
    let keep = 'boolean' === typeof opts.keep ? opts.keep : undefined;
    let claim = Array.isArray(opts.claim) ? opts.claim : [];
    if (null != name && '' != name) {
        // If there is a claim, grab the value so that validations
        // can be applied to it.
        let vsb = (val, update, state) => {
            if (undefined === val) {
                for (let cn of claim) {
                    if (undefined !== state.parent[cn]) {
                        update.val = state.parent[name] = state.parent[cn];
                        delete state.parent[cn];
                    }
                }
            }
            return true;
        };
        Object.defineProperty(vsb, 'name', { value: 'Rename:' + name });
        vs.b.push(vsb);
        let vsa = (val, update, state) => {
            // state.src[name] = val
            state.parent[name] = val;
            if (!keep &&
                // Arrays require explicit deletion as validation is based on index
                // and will be lost.
                !(Array.isArray(state.parent) && false !== keep)) {
                delete state.parent[state.key];
                update.done = true;
            }
            return true;
        };
        Object.defineProperty(vsa, 'name', { value: 'Rename:' + name });
        vs.a.push(vsa);
    }
    return vs;
};
exports.Rename = Rename;
function valueLen(val) {
    return 'number' === typeof (val) ? val :
        'number' === typeof (val === null || val === void 0 ? void 0 : val.length) ? val.length :
            null != val && 'object' === typeof (val) ? Object.keys(val).length :
                NaN;
}
const Min = function (min, spec) {
    let vs = buildize(this, spec);
    vs.b.push(function Min(val, update, state) {
        let vlen = valueLen(val);
        if (min <= vlen) {
            return true;
        }
        let errmsgpart = 'number' === typeof (val) ? '' : 'length ';
        update.err =
            makeErr(val, state, `Value "$VALUE" for path "$PATH" must be a minimum ${errmsgpart}of ${min} (was ${vlen}).`);
        return false;
    });
    return vs;
};
exports.Min = Min;
const Max = function (max, spec) {
    let vs = buildize(this, spec);
    vs.b.push(function Max(val, update, state) {
        let vlen = valueLen(val);
        if (vlen <= max) {
            return true;
        }
        let errmsgpart = 'number' === typeof (val) ? '' : 'length ';
        update.err =
            makeErr(val, state, `Value "$VALUE" for path "$PATH" must be a maximum ${errmsgpart}of ${max} (was ${vlen}).`);
        return false;
    });
    return vs;
};
exports.Max = Max;
const Above = function (above, spec) {
    let vs = buildize(this, spec);
    vs.b.push(function Above(val, update, state) {
        let vlen = valueLen(val);
        if (above < vlen) {
            return true;
        }
        let errmsgpart = 'number' === typeof (val) ? 'be' : 'have length';
        update.err =
            makeErr(val, state, `Value "$VALUE" for path "$PATH" must ${errmsgpart} above ${above} (was ${vlen}).`);
        return false;
    });
    return vs;
};
exports.Above = Above;
const Below = function (below, spec) {
    let vs = buildize(this, spec);
    vs.b.push(function Below(val, update, state) {
        let vlen = valueLen(val);
        if (vlen < below) {
            return true;
        }
        let errmsgpart = 'number' === typeof (val) ? 'be' : 'have length';
        update.err =
            makeErr(val, state, `Value "$VALUE" for path "$PATH" must ${errmsgpart} below ${below} (was ${vlen}).`);
        return false;
    });
    return vs;
};
exports.Below = Below;
function buildize(invs0, invs1) {
    let invs = undefined === invs0 ? invs1 : invs0.window === invs0 ? invs1 : invs0;
    let vs = norm(invs);
    return Object.assign(vs, {
        Above,
        After,
        All,
        Any,
        Before,
        Below,
        Closed,
        Define,
        Empty,
        Exact,
        Max,
        Min,
        Never,
        One,
        Optional,
        Refer,
        Rename,
        Required,
        Some,
    });
}
exports.buildize = buildize;
// External utility to make ErrDesc objects.
function makeErr(val, state, text, why) {
    return makeErrImpl(why || 'custom', val, state.path, state.dI, state.node, 4000, text);
}
exports.makeErr = makeErr;
// Internal utility to make ErrDesc objects.
function makeErrImpl(why, sval, path, dI, node, mark, text, user, fname) {
    let err = {
        n: node,
        s: sval,
        p: pathstr(path, dI),
        w: why,
        m: mark,
        t: '',
    };
    let jstr = undefined === sval ? '' : stringify(sval);
    let valstr = jstr.replace(/"/g, '');
    valstr = valstr.substring(0, 77) + (77 < valstr.length ? '...' : '');
    if (null == text || '' === text) {
        err.t = `Validation failed for path "${err.p}" ` +
            `with value "${valstr}" because ` +
            ('type' === why ? ('instance' === node.t ? `the value is not an instance of ${node.u.n}` :
                `the value is not of type ${node.t}`) :
                'required' === why ? `the value is required` :
                    'closed' === why ? `the property "${user === null || user === void 0 ? void 0 : user.k}" is not allowed` :
                        'never' === why ? 'no value is allowed' :
                            `check "${why + (fname ? ': ' + fname : '')}" failed`) +
            '.';
    }
    else {
        err.t = text
            .replace(/\$VALUE/g, valstr)
            .replace(/\$PATH/g, err.p);
    }
    return err;
}
function stringify(x, r) {
    try {
        let str = JSON.stringify(x, (key, val) => {
            if (r) {
                val = r(key, val);
            }
            if (null != val &&
                'object' === typeof (val) &&
                val.constructor &&
                'Object' !== val.constructor.name &&
                'Array' !== val.constructor.name) {
                val =
                    'function' === typeof val.toString ? val.toString() : val.constructor.name;
            }
            else if ('function' === typeof (val)) {
                if ('function' === typeof (make[val.name])) {
                    val = undefined;
                }
                else {
                    val = val.name;
                }
            }
            else if ('bigint' === typeof (val)) {
                val = String(val.toString());
            }
            return val;
        });
        return String(str);
    }
    catch (e) {
        return JSON.stringify(String(x));
    }
}
function clone(x) {
    return null == x ? x : 'object' !== typeof (x) ? x : JSON.parse(JSON.stringify(x));
}
const G$ = (spec) => norm({ ...spec, $: { gubu$: true } });
exports.G$ = G$;
Object.assign(make, {
    Above,
    After,
    All,
    Any,
    Before,
    Below,
    Closed,
    Define,
    Empty,
    Exact,
    Max,
    Min,
    Never,
    One,
    Optional,
    Refer,
    Rename,
    Required,
    Some,
    G$,
    buildize,
    makeErr,
    Args,
});
Object.defineProperty(make, 'name', { value: 'gubu' });
const Gubu = make;
exports.Gubu = Gubu;
// TODO: claim not working
function Args(spec, wrapped) {
    let restArg = undefined;
    let argsSpec = Object.keys(spec)
        .reduce((as, name, index, keys) => {
        if (name.startsWith('...') && index + 1 === keys.length) {
            restArg = { name: name.substring(3), spec: spec[name] };
        }
        else {
            let claim = (name.split(':')[1] || '').split(',').filter(c => '' !== c);
            if (0 < claim.length) {
                name = name.split(':')[0];
            }
            else {
                claim = undefined;
            }
            // console.log('NAME', name, claim)
            as[index + 1] = Rename({ name, claim }, spec[name]);
        }
        return as;
    }, [Never()]);
    if (restArg) {
        argsSpec[0] = After((v, _u, s) => {
            s.parent[restArg.name] = (s.parent[restArg.name] || []);
            s.parent[restArg.name].push(v);
            return true;
        }, restArg.spec);
        // TODO: should use Complete
        argsSpec = After((v, _u, _s) => {
            if (v) {
                v[restArg.name] = (v[restArg.name] || []);
            }
            return true;
        }, argsSpec);
    }
    let argsShape = Gubu(argsSpec);
    if (wrapped) {
        let argsWrap = function () {
            let inargs = Array.prototype.slice.call(arguments);
            let args = argsShape(inargs);
            return wrapped.call(this, args);
        };
        if (null != wrapped.name && '' != wrapped.name) {
            Object.defineProperty(argsWrap, 'name', { value: wrapped.name + '_args' });
        }
        return argsWrap;
    }
    return argsShape;
}
exports.Args = Args;
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
const GClosed = Closed;
exports.GClosed = GClosed;
const GDefine = Define;
exports.GDefine = GDefine;
const GEmpty = Empty;
exports.GEmpty = GEmpty;
const GExact = Exact;
exports.GExact = GExact;
const GMax = Max;
exports.GMax = GMax;
const GMin = Min;
exports.GMin = GMin;
const GNever = Never;
exports.GNever = GNever;
const GOne = One;
exports.GOne = GOne;
const GOptional = Optional;
exports.GOptional = GOptional;
const GRefer = Refer;
exports.GRefer = GRefer;
const GRename = Rename;
exports.GRename = GRename;
const GRequired = Required;
exports.GRequired = GRequired;
const GSome = Some;
exports.GSome = GSome;
//# sourceMappingURL=gubu.js.map