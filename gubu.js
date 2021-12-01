"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Custom = exports.Any = exports.Optional = exports.Required = exports.buildize = exports.norm = exports.G$ = exports.gubu = void 0;
/*
 * NOTE: `undefined` is not considered a value or type, and thus means 'any'.
 */
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
    }
    let vs = {
        $: GUBU,
        t,
        a,
        v,
        c: {
            r
        },
    };
    return vs;
}
exports.norm = norm;
function make(inspec) {
    let spec = norm(inspec);
    return function gubu(insrc) {
        let src = insrc || {};
        const root = src;
        const nodeStack = [spec, -1];
        const curStack = [root, -1];
        let nI = 2;
        let pI = 0;
        let sI = -1;
        let cN = 0;
        let err = [];
        let node;
        let cur;
        // Iterative depth-first traversal of the spec.
        while (true) {
            // Dereference the back pointers to ancestor siblings.
            // Only objects|arrays can be nodes, so a number is a back pointer.
            // NOTE: terminates because (+{...} -> NaN, +[] -> 0) -> false (JS wat FTW!)
            node = nodeStack[pI];
            while (+node) {
                pI = node;
                node = nodeStack[pI];
            }
            sI = pI + 1;
            cur = curStack[pI];
            // console.log('BB', 'p=' + pI, 's=' + sI, node, cur)
            if (!node) {
                break;
            }
            cN = 0;
            pI = nI;
            let keys = Object.keys(node.v);
            if (node.a) {
                if (0 < cur.length) {
                    keys = Object.keys(cur);
                }
                else if ('empty' === node.a) {
                    keys = [];
                }
            }
            // let keys = Object.keys('array' === node.t ? cur : node.v)
            // console.log('K', keys)
            for (let k of keys) {
                let sval = cur[k];
                let stype = typeof (sval);
                let n = node.v['array' === node.t ? 0 : k];
                // console.log('VTa', k, sval, stype, n)
                if (GUBU !== n.$) {
                    n = node.v[k] = norm(n);
                }
                // TODO: won't work with multiple nested arrays - use a path stack
                // let p = n.p + (n.p.endsWith('.') ? k : '')
                let p = k;
                if ('object' === n.t) {
                    nodeStack[nI] = n;
                    curStack[nI] = cur[k] = (cur[k] || {});
                    nI++;
                    cN++;
                }
                else if ('array' === n.t) {
                    nodeStack[nI] = n;
                    curStack[nI] = cur[k] = (cur[k] || []);
                    nI++;
                    cN++;
                }
                // type from default
                else if ('any' !== n.t && undefined !== sval && n.t !== stype) {
                    err.push({ ...n, s: sval, p });
                }
                // spec= k:1 // default
                else if (undefined === sval) {
                    if (n.c.r) {
                        err.push({ ...n, s: sval, p, w: 'required' });
                    }
                    // NOTE: `undefined` is special and cannot be set
                    else if (undefined !== n.v) {
                        cur[k] = n.v;
                    }
                }
            }
            if (0 < cN) {
                nodeStack[nI++] = sI;
            }
            else {
                pI = sI;
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
function Custom(handler) { }
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