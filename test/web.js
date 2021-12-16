(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
/* Copyright (c) 2021 Richard Rodger and other contributors, MIT License */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GRequired = exports.GRename = exports.GRefer = exports.GOptional = exports.GOne = exports.GNone = exports.GEmpty = exports.GDefine = exports.GClosed = exports.GBefore = exports.GAny = exports.GAll = exports.GAfter = exports.Required = exports.Rename = exports.Refer = exports.Optional = exports.One = exports.None = exports.Empty = exports.Define = exports.Closed = exports.Before = exports.Any = exports.All = exports.After = exports.makeErr = exports.buildize = exports.norm = exports.G$ = exports.Gubu = void 0;
/*
 * NOTE: `undefined` is not considered a value or type, and thus means 'any'.
 */
// TODO: custom undefined handling?
// TODO: closed on array
// TODO: composable?
// TODO: function deref?
// TODO: BigInt spec roundtrip test
// TODO: Only - builder, exact values
// TODO: Min,Max - builder, depends on value
const package_json_1 = __importDefault(require("./package.json"));
const GUBU$ = Symbol.for('gubu$');
const GUBU = { gubu$: GUBU$, v$: package_json_1.default.version };
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
    var _a, _b, _c, _d, _e, _f, _g;
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
            vs.d = null == vs.d ? -1 : vs.d;
            vs.u = vs.u || {};
            if ((_b = vs.u.list) === null || _b === void 0 ? void 0 : _b.specs) {
                vs.u.list.specs = [...vs.u.list.specs];
            }
            return vs;
        }
    }
    // Not a ValSpec, so build one based on value and its type.
    let t = (null === spec ? 'null' : typeof (spec));
    t = (undefined === t ? 'any' : t);
    // console.log('Nt', t)
    let v = spec;
    let r = false; // Optional by default
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
            u.n = (_c = v.constructor) === null || _c === void 0 ? void 0 : _c.name;
            u.i = v.constructor;
        }
    }
    else if ('function' === t) {
        if (IS_TYPE[spec.name]) {
            t = spec.name.toLowerCase();
            r = true;
            v = clone(EMPTY_VAL[t]);
        }
        else if (spec.gubu === GUBU || true === ((_d = spec.$) === null || _d === void 0 ? void 0 : _d.gubu)) {
            let gs = (spec === null || spec === void 0 ? void 0 : spec.spec) ? spec.spec() : spec;
            t = gs.t;
            v = gs.v;
            r = gs.r;
            u = gs.u;
        }
        else if ((undefined === spec.prototype && Function === spec.constructor) ||
            Function === ((_e = spec.prototype) === null || _e === void 0 ? void 0 : _e.constructor)) {
            t = 'custom';
            b = v;
        }
        else {
            t = 'instance';
            r = true;
            u.n = (_g = (_f = v.prototype) === null || _f === void 0 ? void 0 : _f.constructor) === null || _g === void 0 ? void 0 : _g.name;
            u.i = v;
        }
    }
    else if ('number' === t && isNaN(v)) {
        t = 'nan';
    }
    // console.log('Nv', v)
    let vs = {
        $: GUBU,
        t,
        // v: (null != v && 'object' === typeof (v)) ? { ...v } : v,
        v: (null != v && ('object' === t || 'array' === t)) ? { ...v } : v,
        r,
        k: '',
        d: -1,
        u,
    };
    if (b) {
        vs.b = b;
    }
    // console.log('N', vs)
    return vs;
}
exports.norm = norm;
function make(inspec, inopts) {
    const opts = null == inopts ? {} : inopts;
    opts.name = null == opts.name ? ('' + Math.random()).substring(2) : '' + opts.name;
    let top = { '': inspec };
    // let spec: ValSpec = norm(inspec) // Tree of validation nodes.
    let spec = norm(top); // Tree of validation nodes.
    // console.log(spec)
    let gubuShape = function GubuShape(inroot, inctx) {
        var _a, _b, _c, _d;
        const ctx = inctx || {};
        const root = {
            // '': (undefined === inroot && null != spec.v['']) ?
            //   clone(EMPTY_VAL[spec.v[''].t]) :
            //   inroot
            '': inroot
        };
        const nodes = [spec, -1];
        const srcs = [root, -1];
        const path = []; // Key path to current node.
        // let dI: number = 0  // Node depth.
        let dI = -1; // Node depth.
        let nI = 2; // Next free slot in nodes.
        let pI = 0; // Pointer to current node.
        let sI = -1; // Pointer to next sibling node.
        let cN = 0; // Number of children of current node.
        let err = []; // Errors collected.
        let node; // Current node.  
        let src; // Current source value to validate.
        // Iterative depth-first traversal of the spec.
        while (true) {
            // Dereference the back pointers to ancestor siblings.
            // Only objects|arrays can be nodes, so a number is a back pointer.
            // NOTE: terminates because (+{...} -> NaN, +[] -> 0) -> false (JS wat FTW!)
            node = nodes[pI];
            while (+node) {
                pI = node;
                node = nodes[pI];
                dI--;
            }
            sI = pI + 1;
            src = srcs[pI];
            if (!node) {
                break;
            }
            if (-1 < dI) {
                path[dI] = node.k;
            }
            dI++;
            cN = 0;
            pI = nI;
            let keys = Object.keys(node.v);
            // Treat array indexes as keys.
            // Inject missing indexes if present in ValSpec.
            if ('array' === node.t) {
                keys = Object.keys(src);
                for (let vk in node.v) {
                    if ('0' !== vk && !keys.includes(vk)) {
                        keys.splice(parseInt(vk) - 1, 0, '' + (parseInt(vk) - 1));
                    }
                }
            }
            // console.log('KEYS', keys)
            for (let key of keys) {
                path[dI] = key;
                let sval = src[key];
                let stype = typeof (sval);
                if ('number' === stype && isNaN(sval)) {
                    stype = 'nan';
                }
                let n = node.v[key];
                let tvs = null;
                // NOTE: special case handling for arrays keys.
                if ('array' === node.t) {
                    // First array entry is general type spec.
                    // Following are special case elements offset by +1.
                    // Use these if src has no corresponding element.
                    let akey = '' + (parseInt(key) + 1);
                    n = node.v[akey];
                    if (undefined !== n) {
                        tvs = n = GUBU$ === ((_a = n.$) === null || _a === void 0 ? void 0 : _a.gubu$) ? n : (n = node.v[akey] = norm(n));
                    }
                    if (undefined === n) {
                        n = node.v[0];
                        key = '' + 0;
                        // No first element defining element type spec, so use Any.
                        if (undefined === n) {
                            n = node.v[0] = Any();
                        }
                        tvs = n = GUBU$ === ((_b = n.$) === null || _b === void 0 ? void 0 : _b.gubu$) ? n : (n = node.v[key] = norm(n));
                    }
                }
                else {
                    tvs = (null != n && GUBU$ === ((_c = n.$) === null || _c === void 0 ? void 0 : _c.gubu$)) ? n : (n = node.v[key] = norm(n));
                }
                tvs.k = key;
                tvs.d = dI;
                let t = tvs.t;
                let vss;
                let listkind = '';
                let failN = 0;
                if ('list' === t) {
                    vss = tvs.u.list.specs;
                    listkind = tvs.u.list.kind;
                }
                else {
                    vss = [tvs];
                }
                let terr = [];
                for (let vsI = 0; vsI < vss.length; vsI++) {
                    let vs = vss[vsI];
                    // console.log('Ta', vs)
                    vs = GUBU$ === ((_d = vs.$) === null || _d === void 0 ? void 0 : _d.gubu$) ? vs : (vss[vsI] = norm(vs));
                    // console.log('Tb', vs)
                    let t = vs.t;
                    let pass = true;
                    let done = false;
                    // udpate can set t
                    if (vs.b) {
                        let update = handleValidate(vs.b, sval, {
                            dI, nI, sI, pI, cN,
                            key, node: vs, src, nodes, srcs, path, terr, err, ctx
                        });
                        // console.log('BU', update)
                        pass = update.pass;
                        if (undefined !== update.val) {
                            sval = src[key] = update.val;
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
                        nI = undefined === update.nI ? nI : update.nI;
                        sI = undefined === update.sI ? sI : update.sI;
                        pI = undefined === update.pI ? pI : update.pI;
                        cN = undefined === update.cN ? cN : update.cN;
                    }
                    // console.log('M', t, stype, sval, vs.v)
                    //   // sval instanceof vs.v,
                    //   'C',
                    //   'any' !== t,
                    //   'custom' !== t,
                    //   undefined !== sval,
                    //   t !== stype,
                    //   !('object' === stype && 'instance' !== t && null != sval),
                    //   !('instance' === t && sval instanceof vs.v),
                    //   !('null' === t && null === sval)
                    // )
                    if (!done) {
                        if ('none' === t) {
                            terr.push(makeErrImpl('none', sval, path, dI, vs, 1070));
                        }
                        else if ('object' === t) {
                            // console.log('SVAL', sval, null === sval)
                            // if (vs.r && null == sval) {
                            if (vs.r && undefined === sval) {
                                terr.push(makeErrImpl('required', sval, path, dI, vs, 1010));
                            }
                            else if (
                            //(null != sval && ('object' !== stype || Array.isArray(sval)))
                            undefined !== sval && (null === sval ||
                                'object' !== stype ||
                                Array.isArray(sval))) {
                                // console.log('SVAL Q')
                                terr.push(makeErrImpl('type', sval, path, dI, vs, 1020));
                            }
                            else {
                                nodes[nI] = vs;
                                srcs[nI] = src[key] = (src[key] || {});
                                nI++;
                                cN++;
                            }
                        }
                        else if ('array' === t) {
                            // if (vs.r && null == sval) {
                            if (vs.r && undefined === sval) {
                                terr.push(makeErrImpl('required', sval, path, dI, vs, 1030));
                            }
                            // else if (null != sval && !Array.isArray(sval)) {
                            else if (undefined !== sval && !Array.isArray(sval)) {
                                terr.push(makeErrImpl('type', sval, path, dI, vs, 1040));
                            }
                            else {
                                nodes[nI] = vs;
                                srcs[nI] = src[key] = (src[key] || []);
                                nI++;
                                cN++;
                            }
                        }
                        // Invalid type.
                        else if (!('any' === t ||
                            'custom' === t ||
                            undefined === sval ||
                            t === stype ||
                            ('instance' === t && vs.u.i && sval instanceof vs.u.i) ||
                            // ('instance' !== t && 'object' === stype && null != sval) ||
                            ('null' === t && null === sval))) 
                        // 'any' !== t &&
                        // 'custom' !== t &&
                        // undefined !== sval &&
                        // t !== stype &&
                        // !('instance' !== t && 'object' === stype && null != sval) &&
                        // !('instance' === t && vs.u.i && sval instanceof vs.u.i) &&
                        // !('null' === t && null === sval)
                        {
                            terr.push(makeErrImpl('type', sval, path, dI, vs, 1050));
                            pass = false;
                        }
                        // Value itself, or default.
                        else if (undefined === sval) {
                            if (vs.r) {
                                terr.push(makeErrImpl('required', sval, path, dI, vs, 1060));
                                pass = false;
                            }
                            // NOTE: `undefined` is special and cannot be set
                            else if (undefined !== vs.v) {
                                src[key] = vs.v;
                            }
                        }
                        // Empty strings fail if string is required. Use Empty to allow.
                        else if ('string' === t && '' === sval) {
                            if (vs.r && !vs.u.empty) {
                                terr.push(makeErrImpl('required', sval, path, dI, vs, 1080));
                            }
                            // Optional empty strings take the default, unless Empty allows.
                            else if (!vs.u.empty) {
                                src[key] = vs.v;
                            }
                        }
                    }
                    if (vs.a) {
                        let update = handleValidate(vs.a, sval, {
                            dI, nI, sI, pI, cN,
                            key, node: vs, src, nodes, srcs, path, terr, err, ctx
                        });
                        pass = update.pass;
                        if (undefined !== update.val) {
                            sval = src[key] = update.val;
                        }
                        nI = undefined === update.nI ? nI : update.nI;
                        sI = undefined === update.sI ? sI : update.sI;
                        pI = undefined === update.pI ? pI : update.pI;
                        cN = undefined === update.cN ? cN : update.cN;
                    }
                    if (!pass) {
                        failN++;
                        if ('all' === listkind) {
                            break;
                        }
                    }
                    else if ('one' === listkind) {
                        break;
                    }
                }
                if (0 < terr.length &&
                    !(('one' === listkind || 'some' === listkind) && failN < vss.length)) {
                    err.push(...terr);
                }
            }
            if (0 < cN) {
                // Follow pointer back to next parent sibling.
                nodes[nI++] = sI;
            }
            else {
                // Next sibling.
                pI = sI;
                dI--;
            }
            // console.log('***')
            // for (let i = 0; i < nodeStack.length; i++) {
            //   console.log(
            //     ('' + i).padStart(4),
            //     J(nodeStack[i]).substring(0, 111).padEnd(112),
            //     '/',
            //     J(curStack[i]).substring(0, 33).padEnd(34),
            //   )
            // }
            // console.log('END', 'c=' + cN, 's=' + sI, 'p=' + pI, 'n=' + nI)
        }
        if (0 < err.length) {
            if (ctx.err) {
                ctx.err.push(...err);
            }
            else {
                throw new GubuError('shape', err, ctx);
            }
        }
        return root[''];
    };
    // TODO: test Number, String, etc also in arrays
    gubuShape.spec = () => {
        // Normalize spec, discard errors.
        gubuShape(undefined, { err: [] });
        // return JSON.parse(JSON.stringify(spec, (_key, val) => {
        return JSON.parse(stringify(spec.v[''], (_key, val) => {
            if (GUBU$ === val) {
                return true;
            }
            return val;
        }));
    };
    gubuShape.toString = () => {
        return `[Gubu ${opts.name}]`;
    };
    gubuShape.gubu = GUBU;
    return gubuShape;
}
// function J(x: any) {
//   return null == x ? '' : JSON.stringify(x).replace(/"/g, '')
// }
function handleValidate(vf, sval, state) {
    let update = { pass: true, done: false };
    if (undefined !== sval || state.node.r) {
        let valid = vf(sval, update, state);
        if (!valid || update.err) {
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
                state.terr.push(makeErrImpl(w, sval, state.path, state.dI, state.node, 1040));
            }
            update.pass = false;
        }
    }
    // console.log('HV', update)
    return update;
}
function pathstr(path, dI) {
    return path.slice(1, dI + 1).filter(s => null != s).join('.');
}
const Required = function (spec) {
    let vs = buildize(this || spec);
    vs.r = true;
    return vs;
};
exports.Required = Required;
const Optional = function (spec) {
    let vs = buildize(this || spec);
    vs.r = false;
    return vs;
};
exports.Optional = Optional;
const Empty = function (spec) {
    let vs = buildize(this || spec);
    vs.u.empty = true;
    return vs;
};
exports.Empty = Empty;
// Optional value provides default.
const Any = function (spec) {
    let vs = buildize(this || spec);
    vs.t = 'any';
    if (undefined !== spec) {
        vs.v = spec;
    }
    return vs;
};
exports.Any = Any;
const None = function (spec) {
    let vs = buildize(this || spec);
    vs.t = 'none';
    return vs;
};
exports.None = None;
const makeListBuilder = function (kind) {
    return function (...specs) {
        let vs = buildize();
        vs.t = 'list';
        vs.u.list = {
            specs: specs.map(s => buildize(s)).map(s => (s.u.list = {
                kind
            },
                s)),
            kind
        };
        return vs;
    };
};
// Pass on first match. Short circuits.
const One = makeListBuilder('one');
exports.One = One;
// Pass only if all match. Short circuits.
const All = makeListBuilder('all');
exports.All = All;
const Before = function (validate, spec) {
    let vs = buildize(this || spec);
    vs.b = validate;
    return vs;
};
exports.Before = Before;
const After = function (validate, spec) {
    let vs = buildize(this || spec);
    // vs.t = vs.t || 'custom'
    vs.a = validate;
    return vs;
};
exports.After = After;
// TODO: array needs special handling as first entry is type spec
const Closed = function (spec) {
    let vs = buildize(this || spec);
    vs.b = (val, update, state) => {
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
            for (let k of vkeys) {
                if (undefined === allowed[k]) {
                    update.err =
                        makeErrImpl('closed', val, state.path, state.dI, vs, 3010, '', { k });
                    return false;
                }
            }
        }
        return true;
    };
    return vs;
};
exports.Closed = Closed;
const Define = function (inopts, spec) {
    let vs = buildize(this || spec);
    let opts = 'object' === typeof inopts ? inopts || {} : {};
    let name = 'string' === typeof inopts ? inopts : opts.name;
    if (null != name && '' != name) {
        vs.b = (_val, _update, state) => {
            let ref = state.ctx.ref = state.ctx.ref || {};
            ref[name] = state.node;
            return true;
        };
    }
    return vs;
};
exports.Define = Define;
const Refer = function (inopts, spec) {
    let vs = buildize(this || spec);
    let opts = 'object' === typeof inopts ? inopts || {} : {};
    let name = 'string' === typeof inopts ? inopts : opts.name;
    // Fill should be false (the default) if used recursively, to prevent loops.
    let fill = !!opts.fill;
    // console.log('R0', opts, name, fill)
    if (null != name && '' != name) {
        vs.b = (val, update, state) => {
            if (undefined !== val || fill) {
                let ref = state.ctx.ref = state.ctx.ref || {};
                if (undefined !== ref[name]) {
                    // console.log('R1', ref[name])
                    let node = { ...ref[name] };
                    node.k = state.node.k;
                    node.t = node.t || 'none';
                    update.node = node;
                    update.type = node.t;
                    // console.log('R3', update)
                }
            }
            // TODO: option to fail if ref not found?
            return true;
        };
    }
    return vs;
};
exports.Refer = Refer;
const Rename = function (inopts, spec) {
    let vs = buildize(this || spec);
    let opts = 'object' === typeof inopts ? inopts || {} : {};
    let name = 'string' === typeof inopts ? inopts : opts.name;
    if (null != name && '' != name) {
        vs.a = (val, _update, state) => {
            state.src[name] = val;
            if (!opts.keep) {
                delete state.src[state.key];
            }
            return true;
        };
    }
    return vs;
};
exports.Rename = Rename;
function buildize(invs) {
    let vs = norm(invs);
    return Object.assign(vs, {
        After,
        All,
        Any,
        Before,
        Closed,
        Define,
        Empty,
        None,
        One,
        Optional,
        Refer,
        Rename,
        Required,
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
                        'none' === why ? 'no value is allowed' :
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
        return JSON.stringify(x, (key, val) => {
            if (r) {
                val = r(key, val);
            }
            if ('bigint' === typeof (val)) {
                val = val.toString();
            }
            return val;
        });
    }
    catch (e) {
        return JSON.stringify(String(x));
    }
}
function clone(x) {
    return null == x ? x : 'object' !== typeof (x) ? x : JSON.parse(JSON.stringify(x));
}
Object.assign(make, {
    After,
    All,
    Any,
    Before,
    Closed,
    Define,
    Empty,
    None,
    One,
    Optional,
    Refer,
    Rename,
    Required,
});
Object.defineProperty(make, 'name', { value: 'gubu' });
const G$ = (spec) => norm({ ...spec, $: { gubu$: true } });
exports.G$ = G$;
const Gubu = make;
exports.Gubu = Gubu;
const GAfter = After;
exports.GAfter = GAfter;
const GAll = All;
exports.GAll = GAll;
const GAny = Any;
exports.GAny = GAny;
const GBefore = Before;
exports.GBefore = GBefore;
const GClosed = Closed;
exports.GClosed = GClosed;
const GDefine = Define;
exports.GDefine = GDefine;
const GEmpty = Empty;
exports.GEmpty = GEmpty;
const GNone = None;
exports.GNone = GNone;
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

},{"./package.json":2}],2:[function(require,module,exports){
module.exports={
  "name": "gubu",
  "version": "0.0.3",
  "description": "An object shape validation utility.",
  "main": "gubu.js",
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
    "test-web": "browserify -o test/web.js -e test/entry.js -im && open test/web.html",
    "watch": "tsc -w -d",
    "build": "tsc -d",
    "build-web": "cp gubu.js gubu.min.js && browserify -o gubu.min.js -e gubu.js -s Gubu -im -i assert -p tinyify",
    "clean": "rm -rf node_modules yarn.lock package-lock.json",
    "reset": "npm run clean && npm i && npm test",
    "repo-tag": "REPO_VERSION=`node -e \"console.log(require('./package').version)\"` && echo TAG: v$REPO_VERSION && git commit -a -m v$REPO_VERSION && git push && git tag v$REPO_VERSION && git push --tags;",
    "repo-publish": "npm run clean && npm i && npm run repo-publish-quick",
    "repo-publish-quick": "npm run build && npm run test && npm run repo-tag && npm publish --access public --registry https://registry.npmjs.org "
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
  if('symbol' !== o) return String(o)
  if('object' !== o) return ''+o
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
const gubu_1 = require("../gubu");
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
        expect((0, gubu_1.Gubu)()).toBeDefined();
        expect((0, gubu_1.Gubu)().toString()).toMatch(/\[Gubu \d+\]/);
        expect((0, gubu_1.Gubu)(undefined, { name: 'foo' }).toString()).toMatch(/\[Gubu foo\]/);
        let g0 = (0, gubu_1.Gubu)({
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
        const shape = (0, gubu_1.Gubu)({ a: 1, b: String });
        // Object shape is good! Prints `{ a: 99, b: 'foo' }`
        expect(shape({ a: 99, b: 'foo' })).toEqual({ a: 99, b: 'foo' });
        // Object shape is also good. Prints `{ a: 1, b: 'foo' }`
        expect(shape({ b: 'foo' })).toEqual({ a: 1, b: 'foo' });
        // Object shape is bad. Throws an exception:
        // "TODO: msg"
        expect(() => shape({ a: 'BAD' })).toThrow('Validation failed for path "a" with value "BAD" because the value is not of type number.\nValidation failed for path "b" with value "" because the value is required.');
    });
    test('G-basic', () => {
        expect((0, gubu_1.G$)({ v: 11 })).toMatchObject({
            '$': { v$: package_json_1.default.version },
            t: 'number',
            v: 11,
            r: false,
            k: '',
            d: -1,
            u: {}
        });
        expect((0, gubu_1.G$)({ v: Number })).toMatchObject({
            '$': { v$: package_json_1.default.version },
            t: 'number',
            v: 0,
            r: false,
            k: '',
            d: -1,
            u: {}
        });
        expect((0, gubu_1.G$)({ v: BigInt(11) })).toMatchObject({
            '$': { v$: package_json_1.default.version },
            t: 'bigint',
            v: BigInt(11),
            r: false,
            k: '',
            d: -1,
            u: {}
        });
        let s0 = Symbol('foo');
        expect((0, gubu_1.G$)({ v: s0 })).toMatchObject({
            '$': { v$: package_json_1.default.version },
            t: 'symbol',
            v: s0,
            r: false,
            k: '',
            d: -1,
            u: {}
        });
        // NOTE: special case for plain functions.
        // Normally functions become custom validations.
        let f0 = () => true;
        expect((0, gubu_1.G$)({ v: f0 })).toMatchObject({
            '$': { v$: package_json_1.default.version },
            t: 'function',
            v: f0,
            r: false,
            k: '',
            d: -1,
            u: {}
        });
    });
    test('shapes-basic', () => {
        let tmp = {};
        expect((0, gubu_1.Gubu)(String)('x')).toEqual('x');
        expect((0, gubu_1.Gubu)(Number)(1)).toEqual(1);
        expect((0, gubu_1.Gubu)(Boolean)(true)).toEqual(true);
        expect((0, gubu_1.Gubu)(BigInt)(BigInt(1))).toEqual(BigInt(1));
        expect((0, gubu_1.Gubu)(Object)({ x: 1 })).toEqual({ x: 1 });
        expect((0, gubu_1.Gubu)(Array)([1])).toEqual([1]);
        expect((0, gubu_1.Gubu)(Function)(tmp.f0 = () => true)).toEqual(tmp.f0);
        expect((0, gubu_1.Gubu)(Symbol)(tmp.s0 = Symbol('foo'))).toEqual(tmp.s0);
        expect((0, gubu_1.Gubu)(Date)(tmp.d0 = new Date())).toEqual(tmp.d0);
        expect((0, gubu_1.Gubu)(RegExp)(tmp.r0 = /a/)).toEqual(tmp.r0);
        expect((0, gubu_1.Gubu)(Foo)(tmp.c0 = new Foo(2))).toEqual(tmp.c0);
        // console.log(gubu(new Date()).spec())
        expect((0, gubu_1.Gubu)('a')('x')).toEqual('x');
        expect((0, gubu_1.Gubu)(0)(1)).toEqual(1);
        expect((0, gubu_1.Gubu)(false)(true)).toEqual(true);
        expect((0, gubu_1.Gubu)(BigInt(-1))(BigInt(1))).toEqual(BigInt(1));
        expect((0, gubu_1.Gubu)({})({ x: 1 })).toEqual({ x: 1 });
        expect((0, gubu_1.Gubu)([])([1])).toEqual([1]);
        // NOTE: raw function would be a custom validator
        expect((0, gubu_1.Gubu)((0, gubu_1.G$)({ v: () => null }))(tmp.f1 = () => false)).toEqual(tmp.f1);
        expect((0, gubu_1.Gubu)(Symbol('bar'))(tmp.s0)).toEqual(tmp.s0);
        expect((0, gubu_1.Gubu)(new Date())(tmp.d1 = new Date(Date.now() - 1111))).toEqual(tmp.d1);
        expect((0, gubu_1.Gubu)(new RegExp('a'))(tmp.r1 = /b/)).toEqual(tmp.r1);
        expect((0, gubu_1.Gubu)(new Foo(4))(tmp.c1 = new Foo(5))).toEqual(tmp.c1);
        expect((0, gubu_1.Gubu)(new Bar(6))(tmp.c2 = new Bar(7))).toEqual(tmp.c2);
        expect((0, gubu_1.Gubu)(null)(null)).toEqual(null);
        expect(() => (0, gubu_1.Gubu)(null)(1)).toThrow(/path "".*value "1".*not of type null/);
        expect((0, gubu_1.Gubu)((_v, u) => (u.val = 1, true))(null)).toEqual(1);
        // console.log(gubu(Date).spec())
        expect(() => (0, gubu_1.Gubu)(String)(1)).toThrow(/path "".*not of type string/);
        expect(() => (0, gubu_1.Gubu)(Number)('x')).toThrow(/path "".*not of type number/);
        expect(() => (0, gubu_1.Gubu)(Boolean)('x')).toThrow(/path "".*not of type boolean/);
        expect(() => (0, gubu_1.Gubu)(BigInt)('x')).toThrow(/path "".*not of type bigint/);
        expect(() => (0, gubu_1.Gubu)(Object)('x')).toThrow(/path "".*not of type object/);
        expect(() => (0, gubu_1.Gubu)(Array)('x')).toThrow(/path "".*not of type array/);
        expect(() => (0, gubu_1.Gubu)(Function)('x')).toThrow(/path "".*not of type function/);
        expect(() => (0, gubu_1.Gubu)(Symbol)('x')).toThrow(/path "".*not of type symbol/);
        expect(() => (0, gubu_1.Gubu)(Date)(/a/)).toThrow(/path "".*not an instance of Date/);
        expect(() => (0, gubu_1.Gubu)(RegExp)(new Date()))
            .toThrow(/path "".*not an instance of RegExp/);
        expect(() => (0, gubu_1.Gubu)(Foo)(tmp.c3 = new Bar(8)))
            .toThrow(/path "".*not an instance of Foo/);
        expect(() => (0, gubu_1.Gubu)(Bar)(tmp.c4 = new Foo(9)))
            .toThrow(/path "".*not an instance of Bar/);
        // console.log(gubu(new Date()).spec())
        expect(() => (0, gubu_1.Gubu)('a')(1)).toThrow(/path "".*not of type string/);
        expect(() => (0, gubu_1.Gubu)(0)('x')).toThrow(/path "".*not of type number/);
        expect(() => (0, gubu_1.Gubu)(false)('x')).toThrow(/path "".*not of type boolean/);
        expect(() => (0, gubu_1.Gubu)(BigInt(-1))('x')).toThrow(/path "".*not of type bigint/);
        expect(() => (0, gubu_1.Gubu)({})('x')).toThrow(/path "".* not of type object/);
        expect(() => (0, gubu_1.Gubu)([])('x')).toThrow(/path "".*not of type array/);
        expect(() => (0, gubu_1.Gubu)((0, gubu_1.G$)({ v: () => null }))('x'))
            .toThrow(/path "".*not of type function/);
        expect(() => (0, gubu_1.Gubu)(Symbol('bar'))('x')).toThrow(/path "".*not of type symbol/);
        expect(() => (0, gubu_1.Gubu)(new Date())('x')).toThrow(/path "".*not an instance of Date/);
        expect(() => (0, gubu_1.Gubu)(new RegExp('a'))('x'))
            .toThrow(/path "".*not an instance of RegExp/);
        expect(() => (0, gubu_1.Gubu)(new Foo(4))('a')).toThrow(/path "".*not an instance of Foo/);
        expect(() => (0, gubu_1.Gubu)(new Bar(6))('a')).toThrow(/path "".*not an instance of Bar/);
        expect(() => (0, gubu_1.Gubu)(new Foo(10))(new Bar(11)))
            .toThrow(/path "".*not an instance of Foo/);
        expect(() => (0, gubu_1.Gubu)(new Bar(12))(new Foo(12)))
            .toThrow(/path "".*not an instance of Bar/);
        expect((0, gubu_1.Gubu)({ a: String })({ a: 'x' })).toEqual({ a: 'x' });
        expect((0, gubu_1.Gubu)({ a: Number })({ a: 1 })).toEqual({ a: 1 });
        expect((0, gubu_1.Gubu)({ a: Boolean })({ a: true })).toEqual({ a: true });
        expect((0, gubu_1.Gubu)({ a: Object })({ a: { x: 1 } })).toEqual({ a: { x: 1 } });
        expect(() => (0, gubu_1.Gubu)({ a: String })({ a: 1 }))
            .toThrow(/path "a".*not of type string/);
        expect(() => (0, gubu_1.Gubu)({ a: Number })({ a: 'x' }))
            .toThrow(/path "a".*not of type number/);
        expect(() => (0, gubu_1.Gubu)({ a: Boolean })({ a: 'x' }))
            .toThrow(/path "a".*not of type boolean/);
        expect(() => (0, gubu_1.Gubu)({ a: Object })({ a: 'x' }))
            .toThrow(/path "a".*not of type object/);
        expect((0, gubu_1.Gubu)([String])(['x'])).toEqual(['x']);
        expect((0, gubu_1.Gubu)([Number])([1])).toEqual([1]);
        expect((0, gubu_1.Gubu)([Boolean])([true])).toEqual([true]);
        expect((0, gubu_1.Gubu)([Object])([{ x: 1 }])).toEqual([{ x: 1 }]);
        expect(() => (0, gubu_1.Gubu)([String])([1]))
            .toThrow(/path "0".*not of type string/);
        expect(() => (0, gubu_1.Gubu)([Number])(['x']))
            .toThrow(/path "0".*not of type number/);
        expect(() => (0, gubu_1.Gubu)([Boolean])(['x']))
            .toThrow(/path "0".*not of type boolean/);
        expect(() => (0, gubu_1.Gubu)([Object])([1]))
            .toThrow(/path "0".*not of type object/);
    });
    test('shapes-fails', () => {
        let tmp = {};
        let string0 = (0, gubu_1.Gubu)(String);
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
        let number0 = (0, gubu_1.Gubu)(Number);
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
        let object0 = (0, gubu_1.Gubu)(Object);
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
        let array0 = (0, gubu_1.Gubu)(Array);
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
        const num0 = (0, gubu_1.Gubu)(1);
        expect(num0(1)).toEqual(1);
        expect(() => num0(NaN)).toThrow(/not of type number/);
        const nan0 = (0, gubu_1.Gubu)(NaN);
        expect(nan0(NaN)).toEqual(NaN);
        expect(() => nan0(1)).toThrow(/not of type nan/);
        // Empty strings only allowed by Empty() builder.
        const rs0 = (0, gubu_1.Gubu)(String);
        expect(() => rs0('')).toThrow('Validation failed for path "" with value "" because the value is required.');
        const rs0e = (0, gubu_1.Gubu)((0, gubu_1.Empty)(String));
        expect(rs0e('')).toEqual('');
        const os0 = (0, gubu_1.Gubu)('x');
        expect(os0('')).toEqual('x');
        const os0e = (0, gubu_1.Gubu)((0, gubu_1.Empty)('x'));
        expect(os0e('')).toEqual('');
    });
    test('builder-construct', () => {
        const GUBU$ = Symbol.for('gubu$');
        expect((0, gubu_1.Required)('x')).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: 'x',
            r: true,
        });
        expect((0, gubu_1.Optional)(String)).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: '',
            r: false,
        });
        expect((0, gubu_1.Required)((0, gubu_1.Required)('x'))).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: 'x',
            r: true,
        });
        expect((0, gubu_1.Optional)((0, gubu_1.Required)('x'))).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: 'x',
            r: false,
        });
        expect((0, gubu_1.Required)('x').Required()).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: 'x',
            r: true,
        });
        expect((0, gubu_1.Required)('x').Optional()).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: 'x',
            r: false,
        });
        expect((0, gubu_1.Optional)((0, gubu_1.Optional)(String))).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: '',
            r: false,
        });
        expect((0, gubu_1.Optional)(String).Optional()).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: '',
            r: false,
        });
        expect((0, gubu_1.Optional)(String).Required()).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: '',
            r: true,
        });
        expect((0, gubu_1.Required)((0, gubu_1.Optional)(String))).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: '',
            r: true,
        });
        // console.log(Before(() => true, { a: 1 }))
    });
    test('type-default-optional', () => {
        let f0 = () => true;
        let g0 = (0, gubu_1.Gubu)({
            string: 's',
            number: 1,
            boolean: true,
            object: { x: 2 },
            array: [3],
            function: (0, gubu_1.G$)({ t: 'function', v: f0 })
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
        let g0 = (0, gubu_1.Gubu)({
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
        let e0 = (0, gubu_1.Gubu)({ s0: String, s1: 'x' });
        expect(e0({ s0: 'a' })).toMatchObject({ s0: 'a', s1: 'x' });
        expect(() => e0({ s0: 1 })).toThrow(/Validation failed for path "s0" with value "1" because the value is not of type string\./);
        expect(() => e0({ s1: 1 })).toThrow(/Validation failed for path "s0" with value "" because the value is required\.\nValidation failed for path "s1" with value "1" because the value is not of type string\./);
        // TODO: more fails
    });
    test('type-native-optional', () => {
        let { Optional } = gubu_1.Gubu;
        let g0 = (0, gubu_1.Gubu)({
            string: Optional(String),
            number: Optional(Number),
            boolean: Optional(Boolean),
            object: Optional(Object),
            array: Optional(Array),
            function: Optional(Function),
            // TODO: any type? Date, RegExp, Custom ???
        });
    });
    test('array-elements', () => {
        let g0 = (0, gubu_1.Gubu)({
            a: [String]
        });
        expect(g0({ a: ['X', 'Y'] })).toEqual({ a: ['X', 'Y'] });
        expect(() => g0({ a: ['X', 1] })).toThrow(/Validation failed for path "a.1" with value "1" because the value is not of type string\./);
        let g1 = (0, gubu_1.Gubu)([String]);
        expect(g1(['X', 'Y'])).toEqual(['X', 'Y']);
        expect(() => g1(['X', 1])).toThrow(/Validation failed for path "1" with value "1" because the value is not of type string\./);
        let g2 = (0, gubu_1.Gubu)([(0, gubu_1.Any)(), { x: 1 }, { y: true }]);
        expect(g2([{ x: 2 }, { y: false }])).toEqual([{ x: 2 }, { y: false }]);
        expect(g2([{ x: 2 }, { y: false }, 'Q'])).toEqual([{ x: 2 }, { y: false }, 'Q']);
        expect(() => g2([{ x: 'X' }, { y: false }])).toThrow('Validation failed for path "0.x" with value "X" because the value is not of type number.');
        expect(() => g2(['Q', { y: false }])).toThrow('Validation failed for path "0" with value "Q" because the value is not of type object.');
        expect(g2([{ x: 2 }])).toEqual([{ x: 2 }, { y: true }]);
        expect(g2([undefined, { y: false }, 'Q'])).toEqual([{ x: 1 }, { y: false }, 'Q']);
    });
    test('custom-basic', () => {
        let g0 = (0, gubu_1.Gubu)({ a: (v) => v > 10 });
        expect(g0({ a: 11 })).toMatchObject({ a: 11 });
        expect(() => g0({ a: 9 })).toThrow(/Validation failed for path "a" with value "9" because check "custom" failed\./);
        let g1 = (0, gubu_1.Gubu)({ a: (0, gubu_1.Optional)((v) => v > 10) });
        expect(g1({ a: 11 })).toMatchObject({ a: 11 });
        expect(() => g1({ a: 9 })).toThrow(/Validation failed for path "a" with value "9" because check "custom" failed\./);
        expect(g1({})).toMatchObject({});
        let g2 = (0, gubu_1.Gubu)({ a: (0, gubu_1.Required)((v) => v > 10) });
        expect(g1({ a: 11 })).toMatchObject({ a: 11 });
        expect(() => g2({ a: 9 })).toThrow(/Validation failed for path "a" with value "9" because check "custom" failed\./);
        expect(() => g2({})).toThrow(/Validation failed for path "a" with value "" because check "custom" failed\./);
    });
    test('builder-before-after-basic', () => {
        let g0 = (0, gubu_1.Gubu)((0, gubu_1.Before)((val, _update) => {
            val.b = 1 + val.a;
            return true;
        }, { a: 1 })
            .After((val, _update) => {
            val.c = 10 * val.a;
            return true;
        }));
        expect(g0({ a: 2 })).toMatchObject({ a: 2, b: 3, c: 20 });
        let g1 = (0, gubu_1.Gubu)({
            x: (0, gubu_1.After)((val, _update) => {
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
    /*
      test('deep-required', () => {
        let { Required } = gubu
     
        let g0 = gubu({
          a: 1,
          b: Required({
            c: [1],
            d: 'x',
            e: {
              f: [{
                g: true,
                h: 2
              }]
            }
          }),
        })
      })
     
    */
    test('deep-object-basic', () => {
        let a1 = (0, gubu_1.Gubu)({ a: 1 });
        expect(a1({})).toMatchObject({ a: 1 });
        let ab1 = (0, gubu_1.Gubu)({ a: { b: 1 } });
        expect(ab1({})).toMatchObject({ a: { b: 1 } });
        let abc1 = (0, gubu_1.Gubu)({ a: { b: { c: 1 } } });
        expect(abc1({})).toMatchObject({ a: { b: { c: 1 } } });
        let ab1c2 = (0, gubu_1.Gubu)({ a: { b: 1 }, c: 2 });
        expect(ab1c2({})).toMatchObject({ a: { b: 1 }, c: 2 });
        let ab1cd2 = (0, gubu_1.Gubu)({ a: { b: 1 }, c: { d: 2 } });
        expect(ab1cd2({})).toMatchObject({ a: { b: 1 }, c: { d: 2 } });
        let abc1ade2f3 = (0, gubu_1.Gubu)({ a: { b: { c: 1 }, d: { e: 2 } }, f: 3 });
        expect(abc1ade2f3({})).toMatchObject({ a: { b: { c: 1 }, d: { e: 2 } }, f: 3 });
        let d0 = (0, gubu_1.Gubu)({
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
        let a0 = (0, gubu_1.Gubu)([1]);
        // console.dir(a0.spec(), { depth: null })
        expect(a0()).toMatchObject([]);
        expect(a0([])).toMatchObject([]);
        expect(a0([11])).toMatchObject([11]);
        expect(a0([11, 22])).toMatchObject([11, 22]);
        let a1 = (0, gubu_1.Gubu)([-1, 1, 2, 3]);
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
        let g0 = (0, gubu_1.Gubu)({ a: (0, gubu_1.Required)({ x: 1 }) });
        expect(g0({ a: { x: 1 } })).toEqual({ a: { x: 1 } });
        expect(() => g0({})).toThrow('Validation failed for path "a" with value "" because the value is required.');
        let g1 = (0, gubu_1.Gubu)({ a: (0, gubu_1.Required)([1]) });
        expect(g1({ a: [11] })).toEqual({ a: [11] });
        expect(() => g1({})).toThrow('Validation failed for path "a" with value "" because the value is required.');
    });
    test('builder-closed', () => {
        let tmp = {};
        let g0 = (0, gubu_1.Gubu)({ a: { b: { c: (0, gubu_1.Closed)({ x: 1 }) } } });
        expect(g0({ a: { b: { c: { x: 2 } } } })).toEqual({ a: { b: { c: { x: 2 } } } });
        expect(() => g0({ a: { b: { c: { x: 2, y: 3 } } } })).toThrow(/Validation failed for path "a.b.c" with value "{x:2,y:3}" because the property "y" is not allowed\./);
        let g1 = (0, gubu_1.Gubu)((0, gubu_1.Closed)([(0, gubu_1.Any)(), Date, RegExp]));
        expect(g1(tmp.a0 = [new Date(), /a/])).toEqual(tmp.a0);
        expect(() => g1([new Date(), /a/, 'Q'])).toThrow(/Validation failed for path "" with value "\[[^Z]+Z,{},Q\]" /); // because the property "2" is not allowed\./)
    });
    test('builder-one', () => {
        let g0 = (0, gubu_1.Gubu)({ a: (0, gubu_1.One)(Number, String) });
        expect(g0({ a: 1 })).toEqual({ a: 1 });
        expect(g0({ a: 'x' })).toEqual({ a: 'x' });
        expect(() => g0({ a: true })).toThrow('Validation failed for path "a" with value "true" because the value is not of type number.\nValidation failed for path "a" with value "true" because the value is not of type string.');
        let g1 = (0, gubu_1.Gubu)((0, gubu_1.One)(Number, String));
        expect(g1(1)).toEqual(1);
        expect(g1('x')).toEqual('x');
        expect(() => g1(true)).toThrow('Validation failed for path "" with value "true" because the value is not of type number.\nValidation failed for path "" with value "true" because the value is not of type string.');
        let g2 = (0, gubu_1.Gubu)([(0, gubu_1.One)(Number, String)]);
        expect(g2([1])).toEqual([1]);
        expect(g2(['x'])).toEqual(['x']);
        expect(g2([1, 2])).toEqual([1, 2]);
        expect(g2([1, 'x'])).toEqual([1, 'x']);
        expect(g2(['x', 1])).toEqual(['x', 1]);
        expect(g2(['x', 'y'])).toEqual(['x', 'y']);
        expect(g2(['x', 1, 'y', 2])).toEqual(['x', 1, 'y', 2]);
        expect(() => g2([true])).toThrow('Validation failed for path "0" with value "true" because the value is not of type number.\nValidation failed for path "0" with value "true" because the value is not of type string.');
        let g3 = (0, gubu_1.Gubu)({ a: [(0, gubu_1.One)(Number, String)] });
        expect(g3({ a: [1] })).toEqual({ a: [1] });
        expect(g3({ a: ['x'] })).toEqual({ a: ['x'] });
        expect(g3({ a: ['x', 1, 'y', 2] })).toEqual({ a: ['x', 1, 'y', 2] });
        expect(() => g3({ a: [1, 2, true] })).toThrow('Validation failed for path "a.2" with value "true" because the value is not of type number.\nValidation failed for path "a.2" with value "true" because the value is not of type string.');
        let g4 = (0, gubu_1.Gubu)({ a: [(0, gubu_1.One)({ x: 1 }, { x: 'X' })] });
        expect(g4({ a: [{ x: 2 }, { x: 'Q' }, { x: 3, y: true }, { x: 'W', y: false }] }))
            .toEqual({ a: [{ x: 2 }, { x: 'Q' }, { x: 3, y: true }, { x: 'W', y: false }] });
        let g5 = (0, gubu_1.Gubu)({ a: [(0, gubu_1.One)({ x: 1 }, (0, gubu_1.Closed)({ x: 'X' }))] });
        expect(g5({ a: [{ x: 2 }, { x: 'Q' }] }))
            .toEqual({ a: [{ x: 2 }, { x: 'Q' }] });
    });
    // test('builder-some', () => {
    //   let g0 = gubu({ a: Some(Number, String) })
    //   expect(g0({ a: 1 })).toEqual({ a: 1 })
    //   expect(g0({ a: 'x' })).toEqual({ a: 'x' })
    //   expect(() => g0({ a: true })).toThrow('Validation failed for path "a" with value "true" because the value is not of type number.\nValidation failed for path "a" with value "true" because the value is not of type string.')
    //   let g1 = gubu(Some(Number, String))
    //   expect(g1(1)).toEqual(1)
    //   expect(g1('x')).toEqual('x')
    //   expect(() => g1(true)).toThrow('Validation failed for path "" with value "true" because the value is not of type number.\nValidation failed for path "" with value "true" because the value is not of type string.')
    //   let g2 = gubu([Some(Number, String)])
    //   expect(g2([1])).toEqual([1])
    //   expect(g2(['x'])).toEqual(['x'])
    //   expect(g2([1, 2])).toEqual([1, 2])
    //   expect(g2([1, 'x'])).toEqual([1, 'x'])
    //   expect(g2(['x', 1])).toEqual(['x', 1])
    //   expect(g2(['x', 'y'])).toEqual(['x', 'y'])
    //   expect(g2(['x', 1, 'y', 2])).toEqual(['x', 1, 'y', 2])
    //   expect(() => g2([true])).toThrow('Validation failed for path "0" with value "true" because the value is not of type number.\nValidation failed for path "0" with value "true" because the value is not of type string.')
    //   let g3 = gubu({ a: [Some(Number, String)] })
    //   expect(g3({ a: [1] })).toEqual({ a: [1] })
    //   expect(g3({ a: ['x'] })).toEqual({ a: ['x'] })
    //   expect(g3({ a: ['x', 1, 'y', 2] })).toEqual({ a: ['x', 1, 'y', 2] })
    //   expect(() => g3({ a: [1, 2, true] })).toThrow('Validation failed for path "a.2" with value "true" because the value is not of type number.\nValidation failed for path "a.2" with value "true" because the value is not of type string.')
    //   let g4 = gubu({ a: [Some({ x: 1 }, { x: 'X' })] })
    //   expect(g4({ a: [{ x: 2 }, { x: 'Q' }, { x: 3, y: true }, { x: 'W', y: false }] }))
    //     .toEqual({ a: [{ x: 2 }, { x: 'Q' }, { x: 3, y: true }, { x: 'W', y: false }] })
    //   let g5 = gubu({ a: [Some({ x: 1 }, Closed({ x: 'X' }))] })
    //   expect(g5({ a: [{ x: 2 }, { x: 'Q' }] }))
    //     .toEqual({ a: [{ x: 2 }, { x: 'Q' }] })
    // })
    test('builder-all', () => {
        let g0 = (0, gubu_1.Gubu)((0, gubu_1.All)({ x: 1 }, { y: 'a' }));
        expect(g0({ x: 1, y: 'a' })).toEqual({ x: 1, y: 'a' });
        expect(() => g0({ x: 'b', y: 'a' })).toThrow('Validation failed for path "x" with value "b" because the value is not of type number.');
        let g1 = (0, gubu_1.Gubu)({ a: (0, gubu_1.All)((v) => v > 10, (v) => v < 20) });
        expect(g1({ a: 11 })).toEqual({ a: 11 });
        expect(() => g1({ a: 0 })).toThrow('Validation failed for path "a" with value "0" because check "custom" failed.');
    });
    test('builder-custom-between', () => {
        const rangeCheck = (0, gubu_1.Gubu)([(0, gubu_1.None)(), Number, Number]);
        const Between = function (inopts, spec) {
            let vs = (0, gubu_1.buildize)(this || spec);
            let range = rangeCheck(inopts);
            vs.b = (val, update, state) => {
                // Don't run any more checks after this.
                update.done = true;
                if ('number' === typeof (val) && range[0] < val && val < range[1]) {
                    return true;
                }
                else {
                    update.err = [
                        (0, gubu_1.makeErr)(val, state, `Value "$VALUE" for path "$PATH" is ` +
                            `not between ${range[0]} and ${range[1]}.`)
                    ];
                    return false;
                }
            };
            return vs;
        };
        const g0 = (0, gubu_1.Gubu)({ a: [Between([10, 20])] });
        expect(g0({ a: [11, 12, 13] })).toEqual({ a: [11, 12, 13] });
        expect(() => g0({ a: [11, 9, 13, 'y'] })).toThrow('Value "9" for path "a.1" is not between 10 and 20.\nValue "y" for path "a.3" is not between 10 and 20.');
    });
    test('builder-required', () => {
        let g0 = (0, gubu_1.Gubu)({ a: (0, gubu_1.Required)(1) });
        expect(g0({ a: 2 })).toMatchObject({ a: 2 });
        expect(() => g0({ a: 'x' })).toThrow(/number/);
    });
    test('builder-optional', () => {
        let g0 = (0, gubu_1.Gubu)({ a: (0, gubu_1.Optional)(String) });
        expect(g0({ a: 'x' })).toMatchObject({ a: 'x' });
        expect(g0({})).toMatchObject({ a: '' });
        expect(() => g0({ a: 1 })).toThrow(/string/);
    });
    test('builder-any', () => {
        let g0 = (0, gubu_1.Gubu)({ a: (0, gubu_1.Any)(), b: (0, gubu_1.Any)('B') });
        expect(g0({ a: 2, b: 1 })).toMatchObject({ a: 2, b: 1 });
        expect(g0({ a: 'x', b: 'y' })).toMatchObject({ a: 'x', b: 'y' });
        expect(g0({ b: 1 })).toEqual({ b: 1 });
        expect(g0({ a: 1, b: 'B' })).toEqual({ a: 1, b: 'B' });
    });
    test('builder-none', () => {
        let g0 = (0, gubu_1.Gubu)((0, gubu_1.None)());
        expect(() => g0(1)).toThrow('Validation failed for path "" with value "1" because no value is allowed.');
        let g1 = (0, gubu_1.Gubu)({ a: (0, gubu_1.None)() });
        expect(() => g1({ a: 'x' })).toThrow('Validation failed for path "a" with value "x" because no value is allowed.');
        // Another way to do closed arrays.
        let g2 = (0, gubu_1.Gubu)([(0, gubu_1.None)(), 1, 'x']);
        expect(g2([2, 'y'])).toEqual([2, 'y']);
        expect(() => g2([2, 'y', true])).toThrow('Validation failed for path "2" with value "true" because no value is allowed.');
    });
    test('builder-rename', () => {
        let g0 = (0, gubu_1.Gubu)({ a: (0, gubu_1.Rename)('b', { x: 1 }) });
        expect(g0({ a: { x: 2 } })).toMatchObject({ b: { x: 2 } });
    });
    test('builder-define-refer-basic', () => {
        let g0 = (0, gubu_1.Gubu)({ a: (0, gubu_1.Define)('A', { x: 1 }), b: (0, gubu_1.Refer)('A'), c: (0, gubu_1.Refer)('A') });
        // console.log(g0.spec())
        expect(g0({ a: { x: 2 }, b: { x: 2 } }))
            .toEqual({ a: { x: 2 }, b: { x: 2 } });
        expect(g0({ a: { x: 33 }, b: { x: 44 }, c: { x: 55 } }))
            .toEqual({ a: { x: 33 }, b: { x: 44 }, c: { x: 55 } });
        expect(() => g0({ a: { x: 33 }, b: { x: 'X' } }))
            .toThrow('Validation failed for path "b.x" with value "X" because the value is not of type number.');
        let g1 = (0, gubu_1.Gubu)({
            a: (0, gubu_1.Define)('A', { x: 1 }),
            b: (0, gubu_1.Refer)('A'),
            c: (0, gubu_1.Refer)({ name: 'A', fill: true })
        });
        expect(g1({ a: { x: 2 }, b: { x: 2 } }))
            .toEqual({ a: { x: 2 }, b: { x: 2 } });
        expect(g1({ a: { x: 2 }, b: { x: 2 }, c: {} }))
            .toEqual({ a: { x: 2 }, b: { x: 2 }, c: { x: 1 } });
        expect(g1({ a: { x: 33 }, b: { x: 44 }, c: { x: 2 } }))
            .toEqual({ a: { x: 33 }, b: { x: 44 }, c: { x: 2 } });
    });
    test('builder-define-refer-recursive', () => {
        let g0 = (0, gubu_1.Gubu)({
            a: (0, gubu_1.Define)('A', {
                b: {
                    c: 1,
                    a: (0, gubu_1.Refer)('A')
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
        // let g0 = gubu({ a: { b: String } })
        // expect(g0({ a: { b: 'x' } })).toEqual({ a: { b: 'x' } })
        // expect(() => g0(1)).toThrow('path ""')
        // expect(() => g0({ a: 1 })).toThrow('path "a"')
        // expect(() => g0({ a: { b: 1 } })).toThrow('path "a.b"')
        // expect(() => g0({ a: { b: { c: 1 } } })).toThrow('path "a.b"')
        let g1 = (0, gubu_1.Gubu)(String);
        // expect(g1('x')).toEqual('x')
        // expect(() => g1(1)).toThrow('path ""')
        // expect(() => g1(true)).toThrow('path ""')
        // expect(() => g1(null)).toThrow('path ""')
        // expect(() => g1(undefined)).toThrow('path ""')
        // expect(() => g1([])).toThrow('path ""')
        expect(() => g1({})).toThrow('path ""');
        // expect(() => g1(new Date())).toThrow('path ""')
    });
    test('error-desc', () => {
        const g0 = (0, gubu_1.Gubu)(NaN);
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
            expect(JSON.stringify(e)).toEqual("{\"gubu\":true,\"name\":\"GubuError\",\"code\":\"shape\",\"err\":[{\"n\":{\"$\":{\"v$\":\"" + package_json_1.default.version + "\"},\"t\":\"nan\",\"v\":null,\"r\":false,\"k\":\"\",\"d\":0,\"u\":{}},\"s\":1,\"p\":\"\",\"w\":\"type\",\"m\":1050,\"t\":\"Validation failed for path \\\"\\\" with value \\\"1\\\" because the value is not of type nan.\"}],\"message\":\"Validation failed for path \\\"\\\" with value \\\"1\\\" because the value is not of type nan.\"}");
        }
    });
    test('spec-basic', () => {
        expect((0, gubu_1.Gubu)(Number).spec()).toMatchObject({
            $: { gubu$: true, v$: package_json_1.default.version },
            d: 0, k: '', r: true, t: 'number', u: {}, v: 0,
        });
        expect((0, gubu_1.Gubu)(String).spec()).toMatchObject({
            $: { gubu$: true, v$: package_json_1.default.version },
            d: 0, k: '', r: true, t: 'string', u: {}, v: '',
        });
        expect((0, gubu_1.Gubu)(BigInt).spec()).toMatchObject({
            $: { gubu$: true, v$: package_json_1.default.version },
            d: 0, k: '', r: true, t: 'bigint', u: {}, v: "0",
        });
        expect((0, gubu_1.Gubu)(null).spec()).toMatchObject({
            $: { gubu$: true, v$: package_json_1.default.version },
            d: 0, k: '', r: false, t: 'null', u: {}, v: null,
        });
    });
    test('spec-roundtrip', () => {
        let m0 = { a: 1 };
        let g0 = (0, gubu_1.Gubu)(m0);
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
                    t: 'number',
                    u: {},
                    v: 1,
                },
            },
        };
        expect(s0).toEqual(s0s);
        expect(g0({ a: 2 })).toEqual({ a: 2 });
        let g0r = (0, gubu_1.Gubu)(s0);
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
        let g1 = (0, gubu_1.Gubu)(m1);
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
                            t: 'number',
                            u: {},
                            v: 1,
                        },
                    },
                },
            },
        };
        expect(s1).toEqual(s1s);
        let g1r = (0, gubu_1.Gubu)(s1);
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
        let g0 = (0, gubu_1.Gubu)(String);
        let g1 = (0, gubu_1.Gubu)(g0);
        let g1s = (0, gubu_1.Gubu)(g0.spec());
        // console.log(g1.spec())
        expect(g1('x')).toEqual('x');
        expect(() => g1(1)).toThrow();
        expect(g1s('x')).toEqual('x');
        expect(() => g1s(1)).toThrow();
        let g2 = (0, gubu_1.Gubu)({ a: Number });
        let g3 = (0, gubu_1.Gubu)({ b: g2 });
        let g3s = (0, gubu_1.Gubu)({ b: g2.spec() });
        // console.dir(g3.spec(), { depth: null })
        expect(g3({ b: { a: 1 } })).toEqual({ b: { a: 1 } });
        expect(() => g3({ b: { a: 'x' } })).toThrow();
        expect(g3s({ b: { a: 1 } })).toEqual({ b: { a: 1 } });
        expect(() => g3s({ b: { a: 'x' } })).toThrow();
    });
    test('large', () => {
        let m0 = [[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[
                                                                                                                                                                                                                                                                                    String
                                                                                                                                                                                                                                                                                ]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]];
        let g0 = (0, gubu_1.Gubu)(m0);
        let o0 = g0([[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[
                                                                                                                                                                                                                                                                                    'x', 'y', 'z'
                                                                                                                                                                                                                                                                                ]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]);
        // console.dir(o0, { depth: null })
        expect(o0).toEqual([[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[
                                                                                                                                                                                                                                                                                    'x', 'y', 'z'
                                                                                                                                                                                                                                                                                ]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]);
        let m1 = {
            a: {
                a: {
                    a: {
                        a: {
                            a: {
                                a: {
                                    a: {
                                        a: {
                                            a: {
                                                a: {
                                                    a: {
                                                        a: {
                                                            a: {
                                                                a: {
                                                                    a: {
                                                                        a: {
                                                                            a: {
                                                                                a: {
                                                                                    a: {
                                                                                        a: {
                                                                                            a: {
                                                                                                a: {
                                                                                                    a: {
                                                                                                        a: {
                                                                                                            a: {
                                                                                                                a: {
                                                                                                                    a: {
                                                                                                                        a: {
                                                                                                                            a: {
                                                                                                                                a: {
                                                                                                                                    a: {
                                                                                                                                        a: {
                                                                                                                                            a: {
                                                                                                                                                a: {
                                                                                                                                                    a: {
                                                                                                                                                        a: {
                                                                                                                                                            a: {
                                                                                                                                                                a: {
                                                                                                                                                                    a: {
                                                                                                                                                                        a: {
                                                                                                                                                                            a: {
                                                                                                                                                                                a: {
                                                                                                                                                                                    a: {
                                                                                                                                                                                        a: {
                                                                                                                                                                                            a: {
                                                                                                                                                                                                a: {
                                                                                                                                                                                                    a: {
                                                                                                                                                                                                        a: {
                                                                                                                                                                                                            a: {
                                                                                                                                                                                                                a: {
                                                                                                                                                                                                                    a: {
                                                                                                                                                                                                                        a: {
                                                                                                                                                                                                                            a: {
                                                                                                                                                                                                                                a: {
                                                                                                                                                                                                                                    a: {
                                                                                                                                                                                                                                        a: {
                                                                                                                                                                                                                                            a: {
                                                                                                                                                                                                                                                a: {
                                                                                                                                                                                                                                                    a: {
                                                                                                                                                                                                                                                        a: {
                                                                                                                                                                                                                                                            a: {
                                                                                                                                                                                                                                                                a: {
                                                                                                                                                                                                                                                                    a: {
                                                                                                                                                                                                                                                                        a: {
                                                                                                                                                                                                                                                                            a: {
                                                                                                                                                                                                                                                                                a: {
                                                                                                                                                                                                                                                                                    a: { x: Number }
                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                }
                                                                                                                                                                                                                            }
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                    }
                                                                                                                                                                                                                }
                                                                                                                                                                                                            }
                                                                                                                                                                                                        }
                                                                                                                                                                                                    }
                                                                                                                                                                                                }
                                                                                                                                                                                            }
                                                                                                                                                                                        }
                                                                                                                                                                                    }
                                                                                                                                                                                }
                                                                                                                                                                            }
                                                                                                                                                                        }
                                                                                                                                                                    }
                                                                                                                                                                }
                                                                                                                                                            }
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        let g1 = (0, gubu_1.Gubu)(m1);
        let o1 = g1({
            a: {
                a: {
                    a: {
                        a: {
                            a: {
                                a: {
                                    a: {
                                        a: {
                                            a: {
                                                a: {
                                                    a: {
                                                        a: {
                                                            a: {
                                                                a: {
                                                                    a: {
                                                                        a: {
                                                                            a: {
                                                                                a: {
                                                                                    a: {
                                                                                        a: {
                                                                                            a: {
                                                                                                a: {
                                                                                                    a: {
                                                                                                        a: {
                                                                                                            a: {
                                                                                                                a: {
                                                                                                                    a: {
                                                                                                                        a: {
                                                                                                                            a: {
                                                                                                                                a: {
                                                                                                                                    a: {
                                                                                                                                        a: {
                                                                                                                                            a: {
                                                                                                                                                a: {
                                                                                                                                                    a: {
                                                                                                                                                        a: {
                                                                                                                                                            a: {
                                                                                                                                                                a: {
                                                                                                                                                                    a: {
                                                                                                                                                                        a: {
                                                                                                                                                                            a: {
                                                                                                                                                                                a: {
                                                                                                                                                                                    a: {
                                                                                                                                                                                        a: {
                                                                                                                                                                                            a: {
                                                                                                                                                                                                a: {
                                                                                                                                                                                                    a: {
                                                                                                                                                                                                        a: {
                                                                                                                                                                                                            a: {
                                                                                                                                                                                                                a: {
                                                                                                                                                                                                                    a: {
                                                                                                                                                                                                                        a: {
                                                                                                                                                                                                                            a: {
                                                                                                                                                                                                                                a: {
                                                                                                                                                                                                                                    a: {
                                                                                                                                                                                                                                        a: {
                                                                                                                                                                                                                                            a: {
                                                                                                                                                                                                                                                a: {
                                                                                                                                                                                                                                                    a: {
                                                                                                                                                                                                                                                        a: {
                                                                                                                                                                                                                                                            a: {
                                                                                                                                                                                                                                                                a: {
                                                                                                                                                                                                                                                                    a: {
                                                                                                                                                                                                                                                                        a: {
                                                                                                                                                                                                                                                                            a: {
                                                                                                                                                                                                                                                                                a: {
                                                                                                                                                                                                                                                                                    a: { x: 1 }
                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                }
                                                                                                                                                                                                                            }
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                    }
                                                                                                                                                                                                                }
                                                                                                                                                                                                            }
                                                                                                                                                                                                        }
                                                                                                                                                                                                    }
                                                                                                                                                                                                }
                                                                                                                                                                                            }
                                                                                                                                                                                        }
                                                                                                                                                                                    }
                                                                                                                                                                                }
                                                                                                                                                                            }
                                                                                                                                                                        }
                                                                                                                                                                    }
                                                                                                                                                                }
                                                                                                                                                            }
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        expect(o1).toEqual({
            a: {
                a: {
                    a: {
                        a: {
                            a: {
                                a: {
                                    a: {
                                        a: {
                                            a: {
                                                a: {
                                                    a: {
                                                        a: {
                                                            a: {
                                                                a: {
                                                                    a: {
                                                                        a: {
                                                                            a: {
                                                                                a: {
                                                                                    a: {
                                                                                        a: {
                                                                                            a: {
                                                                                                a: {
                                                                                                    a: {
                                                                                                        a: {
                                                                                                            a: {
                                                                                                                a: {
                                                                                                                    a: {
                                                                                                                        a: {
                                                                                                                            a: {
                                                                                                                                a: {
                                                                                                                                    a: {
                                                                                                                                        a: {
                                                                                                                                            a: {
                                                                                                                                                a: {
                                                                                                                                                    a: {
                                                                                                                                                        a: {
                                                                                                                                                            a: {
                                                                                                                                                                a: {
                                                                                                                                                                    a: {
                                                                                                                                                                        a: {
                                                                                                                                                                            a: {
                                                                                                                                                                                a: {
                                                                                                                                                                                    a: {
                                                                                                                                                                                        a: {
                                                                                                                                                                                            a: {
                                                                                                                                                                                                a: {
                                                                                                                                                                                                    a: {
                                                                                                                                                                                                        a: {
                                                                                                                                                                                                            a: {
                                                                                                                                                                                                                a: {
                                                                                                                                                                                                                    a: {
                                                                                                                                                                                                                        a: {
                                                                                                                                                                                                                            a: {
                                                                                                                                                                                                                                a: {
                                                                                                                                                                                                                                    a: {
                                                                                                                                                                                                                                        a: {
                                                                                                                                                                                                                                            a: {
                                                                                                                                                                                                                                                a: {
                                                                                                                                                                                                                                                    a: {
                                                                                                                                                                                                                                                        a: {
                                                                                                                                                                                                                                                            a: {
                                                                                                                                                                                                                                                                a: {
                                                                                                                                                                                                                                                                    a: {
                                                                                                                                                                                                                                                                        a: {
                                                                                                                                                                                                                                                                            a: {
                                                                                                                                                                                                                                                                                a: {
                                                                                                                                                                                                                                                                                    a: { x: 1 }
                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                }
                                                                                                                                                                                                                            }
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                    }
                                                                                                                                                                                                                }
                                                                                                                                                                                                            }
                                                                                                                                                                                                        }
                                                                                                                                                                                                    }
                                                                                                                                                                                                }
                                                                                                                                                                                            }
                                                                                                                                                                                        }
                                                                                                                                                                                    }
                                                                                                                                                                                }
                                                                                                                                                                            }
                                                                                                                                                                        }
                                                                                                                                                                    }
                                                                                                                                                                }
                                                                                                                                                            }
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    });
});

},{"../gubu":1,"../package.json":2}]},{},[3]);
