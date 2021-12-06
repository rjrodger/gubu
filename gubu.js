"use strict";
// import { Jsonic } from 'jsonic'
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rename = exports.Closed = exports.All = exports.Some = exports.One = exports.Custom = exports.Any = exports.Optional = exports.Required = exports.buildize = exports.norm = exports.G$ = exports.gubu = void 0;
/*
 * NOTE: `undefined` is not considered a value or type, and thus means 'any'.
 */
const package_json_1 = __importDefault(require("./package.json"));
// TODO: freeze
const GUBU$ = Symbol.for('gubu$');
const GUBU = { gubu$: GUBU$, version: package_json_1.default.version };
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
};
const EMPTY_VAL = {
    string: '',
    number: 0,
    boolean: false,
    object: {},
    array: [],
    // function: () => undefined,
};
function norm(spec) {
    var _a, _b;
    if (null != spec && ((_a = spec.$) === null || _a === void 0 ? void 0 : _a.gubu$)) {
        if (GUBU$ === spec.$.gubu$) {
            return spec;
        }
        else if (true === spec.$.gubu$) {
            let vs = { ...spec };
            vs.$ = { ...vs.$, gubu$: GUBU$ };
            vs.v = (null != vs.v && 'object' === typeof (vs.v)) ? { ...vs.v } : vs.v;
            if ((_b = vs.u.list) === null || _b === void 0 ? void 0 : _b.specs) {
                vs.u.list.specs = [...vs.u.list.specs];
            }
            return vs;
        }
    }
    let t = null === spec ? 'null' : typeof (spec);
    t = (undefined === t ? 'any' : t);
    let v = spec;
    let r = false; // Optional by default
    let f = undefined;
    if ('object' === t && Array.isArray(spec)) {
        t = 'array';
    }
    else if ('function' === t) {
        if (IS_TYPE[spec.name]) {
            t = spec.name.toLowerCase();
            r = true;
            v = clone(EMPTY_VAL[t]);
        }
        else {
            t = 'custom';
            f = spec;
        }
    }
    let vs = {
        $: GUBU,
        t,
        v: (null != v && 'object' === typeof (v)) ? { ...v } : v,
        r,
        k: '',
        d: -1,
        u: {},
    };
    if (f) {
        vs.f = f;
    }
    return vs;
}
exports.norm = norm;
function make(inspec) {
    let spec = norm(inspec); // Tree of validation nodes.
    let gubuSchema = function GubuSchema(inroot, inctx) {
        var _a, _b, _c, _d;
        const ctx = inctx || {};
        const root = inroot || clone(EMPTY_VAL[spec.t]);
        const nodes = [spec, -1];
        const srcs = [root, -1];
        const path = []; // Key path to current node.
        let dI = 0; // Node depth.
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
            path[dI++] = node.k;
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
                // let vkey = 'array' === node.t ? 1 + parseInt(key) : key
                // let n = node.v[vkey]
                // console.log('VKEY', n, vkey, node.v)
                //if (undefined === n && 'array' === node.t) {
                let n = node.v[key];
                // let vkey = key
                // let tvs: ValSpec = GUBU$ === n.$?.gubu$ ? n : (n = node.v[key] = norm(n))
                // let tvs: ValSpec = GUBU$ === n.$?.gubu$ ? n : norm(n)
                // let tvs: ValSpec = null as unknown as ValSpec
                let tvs = null;
                if ('array' === node.t) {
                    // First array entry is general type spec.
                    // Following are special case elements offset by +1.
                    // Use these if src has no corresponding element.
                    let akey = '' + (parseInt(key) + 1);
                    n = node.v[akey];
                    if (undefined !== n) {
                        // vkey = akey
                        tvs = n = GUBU$ === ((_a = n.$) === null || _a === void 0 ? void 0 : _a.gubu$) ? n : (n = node.v[akey] = norm(n));
                    }
                    // console.log('Q A', key, parseInt(key) + 1, n)
                    if (undefined === n) {
                        n = node.v[0];
                        key = '' + 0;
                        // No first element defining element type spec, so use Any.
                        if (undefined === n) {
                            n = node.v[0] = Any();
                        }
                        tvs = n = GUBU$ === ((_b = n.$) === null || _b === void 0 ? void 0 : _b.gubu$) ? n : (n = node.v[key] = norm(n));
                    }
                    // console.log('Q Z', key, n)
                }
                else {
                    // node.v[key] = tvs
                    tvs = GUBU$ === ((_c = n.$) === null || _c === void 0 ? void 0 : _c.gubu$) ? n : (n = node.v[key] = norm(n));
                }
                // let tvs: ValSpec = GUBU$ === n.$?.gubu$ ? n : (n = node.v[vkey] = norm(n))
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
                    if (vs.b) {
                        let update = handleValidate(vs.b, sval, {
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
                    if ('custom' === t && vs.f) {
                        let update = handleValidate(vs.f, sval, {
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
                    else if ('object' === t) {
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
                    // type from default
                    else if ('any' !== t && undefined !== sval && t !== stype) {
                        terr.push(makeErr('type', sval, path, dI, vs, 1050));
                        pass = false;
                    }
                    // spec= k:1 // default
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
                // TODO: GubuError
                // let ex: any = new Error(err.map((e: ErrSpec) => e.t).join('\n'))
                // ex.err = err
                // throw ex
                throw new GubuError('shape', err, ctx);
            }
        }
        return root;
    };
    // TODO: test Number, String, etc also in arrays
    gubuSchema.spec = () => {
        // Normalize spec, discard errors.
        gubuSchema(undefined, { err: [] });
        return JSON.parse(JSON.stringify(spec, (_key, val) => {
            if (GUBU$ === val) {
                return true;
            }
            return val;
        }));
    };
    return gubuSchema;
}
// function J(x: any) {
//   return null == x ? '' : JSON.stringify(x).replace(/"/g, '')
// }
function handleValidate(vf, sval, state) {
    let update = { pass: true };
    let valid = vf(sval, update, state);
    if (!valid || update.err) {
        let w = update.why || 'custom';
        let p = pathstr(state.path, state.dI);
        let f = null == vf.name || '' === vf.name ?
            vf.toString().replace(/\r?\n/g, ' ').substring(0, 33) :
            vf.name;
        if ('object' === typeof (update.err)) {
            // Assumes makeErr already called
            state.terr.push(...[update.err].flat().map(e => {
                e.p = null == e.p ? p : e.p;
                e.f = null == e.f ? f : e.f;
                e.m = null == e.m ? 2010 : e.m;
                return e;
            }));
        }
        else {
            // state.terr.push({ node: state.node, s: sval, p, w, f, m: 2020 })
            state.terr.push(makeErr(w, sval, state.path, state.dI, state.node, 1040));
        }
        update.pass = false;
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
function Custom(validate) {
    let vs = buildize();
    vs.t = 'custom';
    vs.f = validate;
    return vs;
}
exports.Custom = Custom;
// TODO: pure Before, After
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
    });
}
exports.buildize = buildize;
function makeErr(w, s, path, dI, n, m, t, u) {
    let err = {
        node: n,
        s,
        p: pathstr(path, dI),
        w,
        m,
        t: '',
    };
    if (null == t || '' === t) {
        let jstr = undefined === s ? '' : JSON.stringify(s);
        let valstr = jstr.replace(/"/g, '');
        valstr = valstr.substring(0, 77) + (77 < valstr.length ? '...' : '');
        err.t = `Validation failed for path "${err.p}" ` +
            `with value "${valstr}" because ` +
            ('type' === w ? `the value is not of type ${n.t}` :
                'required' === w ? `the value is required` :
                    'closed' === w ? `the property "${u === null || u === void 0 ? void 0 : u.k}" is not allowed` :
                        `checked "${w}" failed`) +
            '.';
    }
    return err;
}
function clone(x) {
    return null == x ? x : 'object' !== typeof (x) ? x : JSON.parse(JSON.stringify(x));
}
Object.assign(make, {
    Required,
    Optional,
    Custom,
    Any,
    One,
    Some,
    All,
    Closed,
    Rename,
});
Object.defineProperty(make, 'name', { value: 'gubu' });
const G$type = {
    string: true,
    number: true,
    boolean: true,
    object: true,
    array: true,
    function: true,
};
const G$spec = make({
    type: (v, _u, s) => {
        if (G$type[v]) {
            s.ctx.vs.t = v;
            return true;
        }
    },
    value: (v, _u, s) => {
        s.ctx.vs.v = v;
        return true;
    },
    required: (v, _u, s) => {
        s.ctx.vs.r = !!v;
        return true;
    },
});
function G$(spec) {
    let vs = norm();
    if (null != spec) {
        G$spec(spec, { vs });
    }
    return vs;
}
exports.G$ = G$;
const gubu = make;
exports.gubu = gubu;
//# sourceMappingURL=gubu.js.map