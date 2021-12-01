"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Custom = exports.Optional = exports.Required = exports.gubu = void 0;
function make(inspec) {
    let spec = {
        $: 1,
        t: 'object',
        p: '',
        v: inspec || {}
    };
    console.log('\n===', J(spec));
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
            node = nodeStack[pI];
            while (+node) {
                pI = node;
                node = nodeStack[pI];
            }
            sI = pI + 1;
            cur = curStack[pI];
            console.log('BB', 'p=' + pI, 's=' + sI, node, cur);
            if (!node) {
                break;
            }
            cN = 0;
            pI = nI;
            let keys = Object.keys('array' === node.t ? cur : node.v);
            console.log('K', keys);
            for (let k of keys) {
                let sval = cur[k];
                let stype = typeof (sval);
                let n = node.v['array' === node.t ? 0 : k];
                console.log('VTa', k, sval, stype, n);
                if (!n.$) {
                    let nval = n;
                    let ntype = typeof (nval);
                    n = node.v[k] = {
                        $: 1,
                        t: 'any',
                        p: node.p + (0 < node.p.length ? '.' : '') +
                            ('array' === node.t ? '' : k),
                        v: nval
                    };
                    if ('object' === ntype) {
                        if (Array.isArray(nval)) {
                            n.t = 'array';
                        }
                        else {
                            n.t = 'object';
                        }
                    }
                    else if ('function' === ntype) {
                        n.t = nval.name.toLowerCase();
                    }
                    else if ('string' === ntype || 'number' === ntype || 'boolean' === ntype) {
                        n.t = ntype;
                    }
                }
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
                else if (undefined !== sval && n.t !== stype) {
                    // TODO: won't work with multiple nested arrays - use a path stack
                    let p = n.p + (n.p.endsWith('.') ? k : '');
                    err.push({ ...n, s: sval, p });
                }
                // spec= k:1 // default
                else if (undefined === sval) {
                    cur[k] = n.v;
                }
            }
            if (0 < cN) {
                nodeStack[nI++] = sI;
            }
            else {
                pI = sI;
            }
            console.log('***');
            for (let i = 0; i < nodeStack.length; i++) {
                console.log(('' + i).padStart(4), J(nodeStack[i]).substring(0, 111).padEnd(112), '/', J(curStack[i]).substring(0, 33).padEnd(34));
            }
            console.log('END', 'c=' + cN, 's=' + sI, 'p=' + pI, 'n=' + nI);
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
function Required(term) { }
exports.Required = Required;
function Optional(term) { }
exports.Optional = Optional;
function Custom(handler) { }
exports.Custom = Custom;
Object.assign(make, {
    Required,
    Optional,
    Custom,
});
Object.defineProperty(make, 'name', { value: 'gubu' });
const gubu = make;
exports.gubu = gubu;
//# sourceMappingURL=gubu.js.map