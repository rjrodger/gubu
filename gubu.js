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
            vs.u = vs.u || {};
            if ((_b = vs.u.list) === null || _b === void 0 ? void 0 : _b.specs) {
                vs.u.list.specs = [...vs.u.list.specs];
            }
            return vs;
        }
    }
    // Not a ValSpec, so build one based on value and its type.
    let t = (null === spec ? 'null' : typeof (spec));
    // t = (undefined === t ? 'any' : t) as ValType
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
            // v = undefined
        }
        else if (spec.gubu === GUBU || true === ((_c = spec.$) === null || _c === void 0 ? void 0 : _c.gubu)) {
            // let gs = spec?.spec ? spec.spec() : spec
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
        // v: (null != v && 'object' === typeof (v)) ? { ...v } : v,
        v: (null != v && ('object' === t || 'array' === t)) ? { ...v } : v,
        r,
        o,
        k: '',
        d: -1,
        u,
    };
    if (b) {
        vs.b = b;
    }
    return vs;
}
exports.norm = norm;
function make(inspec, inopts) {
    const opts = null == inopts ? {} : inopts;
    opts.name = null == opts.name ? ('' + Math.random()).substring(2) : '' + opts.name;
    let top = { '': inspec };
    // let spec: ValSpec = norm(inspec) // Tree of validation nodes.
    let spec = norm(top); // Tree of validation nodes.
    let gubuShape = function GubuShape(inroot, inctx) {
        var _a, _b, _c, _d;
        const ctx = inctx || {};
        const root = { '': inroot };
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
            let keys = null == node.v ? [] : Object.keys(node.v);
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
                        tvs = n = GUBU$ === ((_a = n.$) === null || _a === void 0 ? void 0 : _a.gubu$) ? n : (node.v[akey] = norm(n));
                    }
                    if (undefined === n) {
                        n = node.v[0];
                        key = '' + 0;
                        // No first element defining element type spec, so use Any.
                        if (undefined === n) {
                            n = node.v[0] = Any();
                        }
                        tvs = null === n ? norm(n) :
                            GUBU$ === ((_b = n.$) === null || _b === void 0 ? void 0 : _b.gubu$) ? n : (node.v[key] = norm(n));
                    }
                }
                else {
                    tvs = (null != n && GUBU$ === ((_c = n.$) === null || _c === void 0 ? void 0 : _c.gubu$)) ? n : (node.v[key] = norm(n));
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
                    vs = GUBU$ === ((_d = vs.$) === null || _d === void 0 ? void 0 : _d.gubu$) ? vs : (vss[vsI] = norm(vs));
                    let t = vs.t;
                    let pass = true;
                    let done = false;
                    // udpate can set t
                    if (vs.b) {
                        let update = handleValidate(vs.b, sval, {
                            dI, nI, sI, pI, cN,
                            key, node: vs, src, nodes, srcs, path, terr, err, ctx
                        });
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
                    if (!done) {
                        if ('none' === t) {
                            terr.push(makeErrImpl('none', sval, path, dI, vs, 1070));
                        }
                        else if ('object' === t) {
                            if (vs.r && undefined === sval) {
                                terr.push(makeErrImpl('required', sval, path, dI, vs, 1010));
                            }
                            else if (
                            //(null != sval && ('object' !== stype || Array.isArray(sval)))
                            undefined !== sval && (null === sval ||
                                'object' !== stype ||
                                Array.isArray(sval))) {
                                terr.push(makeErrImpl('type', sval, path, dI, vs, 1020));
                            }
                            // else {
                            else if (null != src[key] || !vs.o) {
                                nodes[nI] = vs;
                                srcs[nI] = src[key] = (src[key] || {});
                                nI++;
                                cN++;
                            }
                        }
                        else if ('array' === t) {
                            if (vs.r && undefined === sval) {
                                terr.push(makeErrImpl('required', sval, path, dI, vs, 1030));
                            }
                            else if (undefined !== sval && !Array.isArray(sval)) {
                                terr.push(makeErrImpl('type', sval, path, dI, vs, 1040));
                            }
                            //else {
                            else if (null != src[key] || !vs.o) {
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
                            else if (undefined !== vs.v && !vs.o) {
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
    return update;
}
function pathstr(path, dI) {
    return path.slice(1, dI + 1).filter(s => null != s).join('.');
}
const Required = function (spec) {
    let vs = buildize(this, spec);
    vs.r = true;
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
const None = function (spec) {
    let vs = buildize(this, spec);
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
    let vs = buildize(this, spec);
    vs.b = validate;
    return vs;
};
exports.Before = Before;
const After = function (validate, spec) {
    let vs = buildize(this, spec);
    // vs.t = vs.t || 'custom'
    vs.a = validate;
    return vs;
};
exports.After = After;
// TODO: array needs special handling as first entry is type spec
const Closed = function (spec) {
    let vs = buildize(this, spec);
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
            update.err = [];
            for (let k of vkeys) {
                if (undefined === allowed[k]) {
                    update.err.push(makeErrImpl('closed', val, state.path, state.dI, vs, 3010, '', { k }));
                }
            }
            return 0 === update.err.length;
        }
        return true;
    };
    return vs;
};
exports.Closed = Closed;
const Define = function (inopts, spec) {
    let vs = buildize(this, spec);
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
    let vs = buildize(this, spec);
    let opts = 'object' === typeof inopts ? inopts || {} : {};
    let name = 'string' === typeof inopts ? inopts : opts.name;
    // Fill should be false (the default) if used recursively, to prevent loops.
    let fill = !!opts.fill;
    if (null != name && '' != name) {
        vs.b = (val, update, state) => {
            if (undefined !== val || fill) {
                let ref = state.ctx.ref = state.ctx.ref || {};
                if (undefined !== ref[name]) {
                    let node = { ...ref[name] };
                    node.k = state.node.k;
                    node.t = node.t || 'none';
                    update.node = node;
                    update.type = node.t;
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
    let vs = buildize(this, spec);
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
function buildize(invs0, invs1) {
    let invs = undefined === invs0 ? invs1 : invs0.window === invs0 ? invs1 : invs0;
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
const G$ = (spec) => norm({ ...spec, $: { gubu$: true } });
exports.G$ = G$;
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
    G$,
    buildize,
    makeErr,
});
Object.defineProperty(make, 'name', { value: 'gubu' });
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
//# sourceMappingURL=gubu.js.map