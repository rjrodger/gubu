"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Custom = exports.Any = exports.Optional = exports.Required = exports.buildize = exports.norm = exports.G$ = exports.gubu = void 0;
/*
 * NOTE: `undefined` is not considered a value or type, and thus means 'any'.
 */
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
function G$(opts) {
    let vs = norm();
    if (null != opts) {
        // TODO: self validate to generate a normed spec!
    }
    return vs;
}
exports.G$ = G$;
function norm(spec) {
    if (GUBU === (spec === null || spec === void 0 ? void 0 : spec.$))
        return spec;
    let t = null === spec ? 'null' : typeof (spec);
    t = (undefined === t ? 'any' : t);
    let v = spec;
    let a = '';
    let r = false; // Optional by default
    let d = undefined;
    if ('object' === t && Array.isArray(spec)) {
        t = 'array';
        // defaults: [,<spec>] -> [], [<spec>] -> [<spec>]
        a = undefined === spec[0] ? 'empty' : 'fill';
    }
    else if ('function' === t) {
        if (IS_TYPE[spec.name]) {
            t = spec.name.toLowerCase();
            r = true;
            v = EMPTY_VAL[t];
        }
        else {
            t = 'custom';
            d = spec;
        }
    }
    let vs = {
        $: GUBU,
        t,
        a,
        v,
        c: {
            r
        },
        k: '',
        d: -1,
    };
    if (d) {
        vs.f = d;
    }
    return vs;
}
exports.norm = norm;
function make(inspec) {
    let spec = norm(inspec); // Tree of validation nodes.
    return function gubu(inroot) {
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
            if (node.a) {
                if (0 < src.length) {
                    keys = Object.keys(src);
                }
                else if ('empty' === node.a) {
                    keys = [];
                }
            }
            for (let key of keys) {
                path[dI] = key;
                let sval = src[key];
                let stype = typeof (sval);
                let n = node.v['array' === node.t ? 0 : key];
                // console.log('VTa', k, sval, stype, n)
                // TODO: add node parent
                let vs = GUBU === n.$ ? n : (node.v[key] = norm(n));
                vs.k = key;
                vs.d = dI;
                // TODO: won't work with multiple nested arrays - use a path stack
                // let p = n.p + (n.p.endsWith('.') ? k : '')
                // let p = key
                let t = vs.t;
                if ('custom' === t && vs.f) {
                    let update = {};
                    let valid = vs.f(sval, update, {
                        dI, nI, sI, pI, cN, key, node: vs, nodes, srcs, path, err
                    });
                    if (!valid || update.err) {
                        let w = 'custom';
                        let p = pathstr(path, dI);
                        let f = null == vs.f.name || '' === vs.f.name ?
                            vs.f.toString().replace(/\r?\n/g, ' ').substring(0, 33) :
                            vs.f.name;
                        if ('object' === typeof (update.err)) {
                            err.push(...[update.err].flat().map(e => {
                                e.p = null == e.p ? p : e.p;
                                e.f = null == e.f ? f : e.f;
                                return e;
                            }));
                        }
                        else {
                            err.push({ node: vs, s: sval, p, w, f });
                        }
                    }
                    else {
                        if (undefined !== update.val) {
                            sval = src[key] = update.val;
                        }
                        nI = undefined === update.nI ? nI : update.nI;
                        sI = undefined === update.sI ? sI : update.sI;
                        pI = undefined === update.pI ? pI : update.pI;
                        cN = undefined === update.cN ? cN : update.cN;
                    }
                }
                else if ('object' === t) {
                    nodes[nI] = vs;
                    // TODO: err if obj required
                    srcs[nI] = src[key] = (src[key] || {});
                    nI++;
                    cN++;
                }
                else if ('array' === t) {
                    nodes[nI] = vs;
                    srcs[nI] = src[key] = (src[key] || []);
                    nI++;
                    cN++;
                }
                // type from default
                else if ('any' !== t && undefined !== sval && t !== stype) {
                    err.push({ node: vs, s: sval, p: pathstr(path, dI), w: 'type' });
                }
                // spec= k:1 // default
                else if (undefined === sval) {
                    if (vs.c.r) {
                        err.push({ node: vs, s: sval, p: pathstr(path, dI), w: 'required' });
                    }
                    // NOTE: `undefined` is special and cannot be set
                    else if (undefined !== vs.v) {
                        src[key] = vs.v;
                    }
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
function J(x) {
    return null == x ? '' : JSON.stringify(x).replace(/"/g, '');
}
function pathstr(path, dI) {
    return path.slice(1, dI + 1).filter(s => null != s).join('.');
}
const Required = function (spec) {
    let vs = buildize(this || spec);
    vs.c.r = true;
    return vs;
};
exports.Required = Required;
const Optional = function (spec) {
    let vs = buildize(this || spec);
    vs.c.r = false;
    return vs;
};
exports.Optional = Optional;
const Any = function (spec) {
    let vs = buildize(this || spec);
    vs.t = 'any';
    vs.c.r = true === spec; // Special convenience
    return vs;
};
exports.Any = Any;
function Custom(validate) {
    let vs = buildize();
    vs.t = 'custom';
    vs.f = validate;
    return vs;
}
exports.Custom = Custom;
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
});
Object.defineProperty(make, 'name', { value: 'gubu' });
const gubu = make;
exports.gubu = gubu;
//# sourceMappingURL=gubu.js.map