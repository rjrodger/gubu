"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rename = exports.Closed = exports.All = exports.Some = exports.One = exports.Custom = exports.Any = exports.Optional = exports.Required = exports.buildize = exports.norm = exports.G$ = exports.gubu = void 0;
/*
 * NOTE: `undefined` is not considered a value or type, and thus means 'any'.
 */
// TODO: Required object and array
// TODO: describe for debugging
// TODO: freeze
const GUBU = { gubu$: true };
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
    function: () => undefined,
};
function norm(spec) {
    if (GUBU === (spec === null || spec === void 0 ? void 0 : spec.$))
        return spec;
    let t = null === spec ? 'null' : typeof (spec);
    t = (undefined === t ? 'any' : t);
    let v = spec;
    let y = '';
    let r = false; // Optional by default
    let f = undefined;
    if ('object' === t && Array.isArray(spec)) {
        t = 'array';
        // TODO: review!
        // defaults: [,<spec>] -> [], [<spec>] -> [<spec>]
        y = undefined === spec[0] ? 'empty' : 'fill';
    }
    else if ('function' === t) {
        if (IS_TYPE[spec.name]) {
            t = spec.name.toLowerCase();
            r = true;
            v = EMPTY_VAL[t];
        }
        else {
            t = 'custom';
            f = spec;
        }
    }
    let vs = {
        $: GUBU,
        t,
        y,
        v,
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
    return function gubu(inroot, inctx) {
        const ctx = inctx || {};
        const root = inroot || {};
        const nodes = [spec, -1];
        const srcs = [root, -1];
        const path = [];
        let dI = 0;
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
            if (node.y) {
                if (0 < src.length) {
                    keys = Object.keys(src);
                }
                else if ('empty' === node.y) {
                    keys = [];
                }
            }
            // console.log('NODE', node)
            // console.log('KEYS', keys)
            for (let key of keys) {
                path[dI] = key;
                let sval = src[key];
                let stype = typeof (sval);
                // let n = node.v['array' === node.t ? 0 : key]
                // console.log('VTa', k, sval, stype, n)
                // First array entry is general type spec.
                // Following are special case elements offset by +1
                let vkey = node.y ? 1 + parseInt(key) : key;
                let n = node.v[vkey];
                // console.log('VKEY', key, vkey, n)
                if (undefined === n && 'array' === node.t) {
                    n = node.v[0];
                    key = '' + 0;
                }
                else {
                    key = '' + vkey;
                }
                // TODO: add node parent
                let tvs = GUBU === n.$ ? n : (node.v[key] = norm(n));
                tvs.k = key;
                tvs.d = dI;
                // TODO: won't work with multiple nested arrays - use a path stack
                // let p = n.p + (n.p.endsWith('.') ? k : '')
                // let p = key
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
                // console.log('LIST', listkind, vss)
                let terr = [];
                for (let vs of vss) {
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
                            terr.push({
                                node: vs, s: sval, p: pathstr(path, dI), w: 'required',
                                m: 1010
                            });
                        }
                        else if (null != sval && ('object' !== stype || Array.isArray(sval))) {
                            terr.push({
                                node: vs, s: sval, p: pathstr(path, dI), w: 'type',
                                m: 1020
                            });
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
                            terr.push({
                                node: vs, s: sval, p: pathstr(path, dI), w: 'required',
                                m: 1030
                            });
                        }
                        else if (null != sval && !Array.isArray(sval)) {
                            terr.push({
                                node: vs, s: sval, p: pathstr(path, dI), w: 'type',
                                m: 1040
                            });
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
                        terr.push({
                            node: vs, s: sval, p: pathstr(path, dI), w: 'type',
                            m: 1050
                        });
                        pass = false;
                    }
                    // spec= k:1 // default
                    else if (undefined === sval) {
                        if (vs.r) {
                            terr.push({
                                node: vs, s: sval, p: pathstr(path, dI), w: 'required',
                                m: 1060
                            });
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
                nodes[nI++] = sI;
            }
            else {
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
        // TODO: collect errors
        if (0 < err.length) {
            throw new Error('gubu: ' + JSON.stringify(err));
        }
        return root;
    };
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
            state.terr.push(...[update.err].flat().map(e => {
                e.p = null == e.p ? p : e.p;
                e.f = null == e.f ? f : e.f;
                e.m = 2010;
                return e;
            }));
        }
        else {
            state.terr.push({ node: state.node, s: sval, p, w, f, m: 2020 });
        }
        update.pass = false;
    }
    return update;
    // else {
    //   if (undefined !== update.val) {
    //     sval = src[key] = update.val
    //   }
    //   nI = undefined === update.nI ? nI : update.nI
    //   sI = undefined === update.sI ? sI : update.sI
    //   pI = undefined === update.pI ? pI : update.pI
    //   cN = undefined === update.cN ? cN : update.cN
    // }
    // return pass
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
        // console.log('B', val, vs)
        if (null != val && 'object' === typeof (val)) {
            for (let k in val) {
                if (undefined === vs.v[k]) {
                    // TODO: err
                    // update.why = 'closed'
                    update.err = {
                        node: vs, s: val, p: pathstr(state.path, state.dI), w: 'closed',
                        u: { k }
                    };
                    return false;
                }
            }
        }
        return true;
    };
    return vs;
};
exports.Closed = Closed;
// Not a Builder?
const Rename = function (inopts, spec) {
    let vs = buildize(this || spec);
    let opts = 'object' === typeof inopts ? inopts || {} : {};
    let name = 'string' === typeof inopts ? inopts : opts.name;
    if (null != name && '' != name) {
        vs.a = (val, update, state) => {
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
Object.assign(make, {
    Required,
    Optional,
    Custom,
    Any,
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
function G$(opts) {
    let vs = norm();
    if (null != opts) {
        G$spec(opts, { vs });
    }
    return vs;
}
exports.G$ = G$;
const gubu = make;
exports.gubu = gubu;
//# sourceMappingURL=gubu.js.map