"use strict";
// import { Jsonic } from 'jsonic'
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GSome = exports.GRequired = exports.GRename = exports.GRefer = exports.GOptional = exports.GOne = exports.GDefine = exports.GClosed = exports.GBefore = exports.GAny = exports.GAll = exports.GAfter = exports.Some = exports.Required = exports.Rename = exports.Refer = exports.Optional = exports.One = exports.Define = exports.Closed = exports.Before = exports.Any = exports.All = exports.After = exports.buildize = exports.norm = exports.G$ = exports.gubu = void 0;
/*
 * NOTE: `undefined` is not considered a value or type, and thus means 'any'.
 */
// TODO: BigInt spec roundtrip test
const package_json_1 = __importDefault(require("./package.json"));
const GUBU$ = Symbol.for('gubu$');
const GUBU = { gubu$: GUBU$, v$: package_json_1.default.version };
class GubuError extends TypeError {
    constructor(code, err, ctx) {
        let message = err.map((e) => e.t).join('\n');
        super(message);
        let name = 'GubuError';
        let ge = this;
        ge.code = code;
        ge.desc = () => ({ name, code, err, ctx, });
    }
    toJSON() {
        return {
            ...this,
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
            '': (undefined === inroot && null != spec.v['']) ?
                clone(EMPTY_VAL[spec.v[''].t]) :
                inroot
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
                let n = node.v[key];
                let tvs = null;
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
                        nI = undefined === update.nI ? nI : update.nI;
                        sI = undefined === update.sI ? sI : update.sI;
                        pI = undefined === update.pI ? pI : update.pI;
                        cN = undefined === update.cN ? cN : update.cN;
                    }
                    // console.log('M', t, stype, sval, vs.v, sval instanceof vs.v,
                    //   'C',
                    //   'any' !== t,
                    //   'custom' !== t,
                    //   undefined !== sval,
                    //   t !== stype,
                    //   !('object' === stype && 'instance' !== t && null != sval),
                    //   !('instance' === t && sval instanceof vs.v),
                    //   !('null' === t && null === sval)
                    // )
                    if ('object' === t) {
                        if (vs.r && null == sval) {
                            terr.push(makeErr('required', sval, path, dI, vs, 1010));
                        }
                        else if (null != sval && ('object' !== stype || Array.isArray(sval))) {
                            terr.push(makeErr('type', sval, path, dI, vs, 1020));
                        }
                        else {
                            nodes[nI] = vs;
                            srcs[nI] = src[key] = (src[key] || {});
                            nI++;
                            cN++;
                        }
                    }
                    else if ('array' === t) {
                        if (vs.r && null == sval) {
                            terr.push(makeErr('required', sval, path, dI, vs, 1030));
                        }
                        else if (null != sval && !Array.isArray(sval)) {
                            terr.push(makeErr('type', sval, path, dI, vs, 1040));
                        }
                        else {
                            nodes[nI] = vs;
                            srcs[nI] = src[key] = (src[key] || []);
                            nI++;
                            cN++;
                        }
                    }
                    // Invalid type.
                    else if ('any' !== t &&
                        'custom' !== t &&
                        undefined !== sval &&
                        t !== stype &&
                        !('object' === stype && 'instance' !== t && null != sval) &&
                        // !('instance' === t && sval instanceof vs.v) &&
                        !('instance' === t && vs.u.i && sval instanceof vs.u.i) &&
                        !('null' === t && null === sval)) {
                        terr.push(makeErr('type', sval, path, dI, vs, 1050));
                        pass = false;
                    }
                    // Value itself, or default.
                    else if (undefined === sval) {
                        if (vs.r) {
                            terr.push(makeErr('required', sval, path, dI, vs, 1060));
                            pass = false;
                        }
                        // NOTE: `undefined` is special and cannot be set
                        else if (undefined !== vs.v) {
                            src[key] = vs.v;
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
    return gubuShape;
}
// function J(x: any) {
//   return null == x ? '' : JSON.stringify(x).replace(/"/g, '')
// }
function handleValidate(vf, sval, state) {
    let update = { pass: true };
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
                state.terr.push(makeErr(w, sval, state.path, state.dI, state.node, 1040));
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
const Any = function (spec) {
    let vs = buildize(this || spec);
    vs.t = 'any';
    vs.r = true === spec; // Special convenience
    return vs;
};
exports.Any = Any;
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
// Pass if some match, but always check each one - does *not* short circuit.
const Some = makeListBuilder('some');
exports.Some = Some;
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
            for (let k in val) {
                if (undefined === vs.v[k]) {
                    update.err =
                        makeErr('closed', val, state.path, state.dI, vs, 3010, '', { k });
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
    if (null != name && '' != name) {
        vs.b = (val, update, state) => {
            if (undefined !== val || fill) {
                let ref = state.ctx.ref = state.ctx.ref || {};
                // TODO: error if non-exist
                let node = { ...ref[name] };
                node.k = state.node.k;
                node.t = node.t || 'none';
                update.node = node;
                update.type = node.t;
            }
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
        Required,
        Optional,
        Any,
        Closed,
        Before,
        After,
    });
}
exports.buildize = buildize;
function makeErr(w, s, path, dI, n, m, t, u, f) {
    let err = {
        node: n,
        s,
        p: pathstr(path, dI),
        w,
        m,
        t: '',
    };
    if (null == t || '' === t) {
        let jstr = undefined === s ? '' : stringify(s);
        let valstr = jstr.replace(/"/g, '');
        valstr = valstr.substring(0, 77) + (77 < valstr.length ? '...' : '');
        err.t = `Validation failed for path "${err.p}" ` +
            `with value "${valstr}" because ` +
            ('type' === w ? ('instance' === n.t ? `the value is not an instance of ${n.u.n}` :
                `the value is not of type ${n.t}`) :
                'required' === w ? `the value is required` :
                    'closed' === w ? `the property "${u === null || u === void 0 ? void 0 : u.k}" is not allowed` :
                        `check "${w + (f ? ': ' + f : '')}" failed`) +
            '.';
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
    Required,
    Optional,
    // Custom,
    Any,
    One,
    Some,
    All,
    Closed,
    Rename,
    Define,
    Before,
    After,
});
Object.defineProperty(make, 'name', { value: 'gubu' });
/*
const G$type: { [name: string]: boolean } = {
  string: true,
  number: true,
  boolean: true,
  object: true,
  array: true,
  function: true,
}
 
const G$spec = make({
  type: (v: string, _u: Update, s: State) => {
    if (G$type[v]) {
      s.ctx.vs.t = v
      return true
    }
  },
  value: (v: string, _u: Update, s: State) => {
    s.ctx.vs.v = v
    return true
  },
  required: (v: string, _u: Update, s: State) => {
    s.ctx.vs.r = !!v
    return true
  },
})
*/
const G$ = (spec) => norm({ ...spec, $: { gubu$: true } });
exports.G$ = G$;
const gubu = make;
exports.gubu = gubu;
const GRequired = Required;
exports.GRequired = GRequired;
const GOptional = Optional;
exports.GOptional = GOptional;
const GAny = Any;
exports.GAny = GAny;
const GOne = One;
exports.GOne = GOne;
const GSome = Some;
exports.GSome = GSome;
const GAll = All;
exports.GAll = GAll;
const GClosed = Closed;
exports.GClosed = GClosed;
const GRename = Rename;
exports.GRename = GRename;
const GDefine = Define;
exports.GDefine = GDefine;
const GRefer = Refer;
exports.GRefer = GRefer;
const GBefore = Before;
exports.GBefore = GBefore;
const GAfter = After;
exports.GAfter = GAfter;
//# sourceMappingURL=gubu.js.map