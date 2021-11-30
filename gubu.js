"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Custom = exports.Optional = exports.Required = exports.gubu = void 0;
function make(spec) {
    spec = spec || {};
    console.log('\n===', J(spec));
    return function gubu(insrc) {
        let src = insrc || {};
        const root = {};
        const pathStack = [];
        const nodeStack = [spec, -1];
        const curStack = [root, -1];
        let nI = 2;
        let pI = 0;
        let sI = -1;
        let cN = 0;
        let err = undefined;
        let node;
        let cur;
        while (true) {
            node = nodeStack[pI];
            while (+node) {
                // nodeStack[pI] = 0
                pI = node;
                node = nodeStack[pI];
            }
            sI = pI + 1;
            cur = curStack[pI];
            console.log('BB', 'p=' + pI, 's=' + sI, node, cur);
            if (!node) {
                console.log('WWW');
                break;
            }
            cN = 0;
            pI = nI;
            for (let k of Object.keys(node)) {
                let nval = node[k];
                let ntype = typeof (nval);
                let sval = src[k];
                let stype = typeof (sval);
                if ('object' === ntype) {
                    nodeStack[nI] = nval;
                    curStack[nI] = cur[k] = (cur[k] || {});
                    nI++;
                    cN++;
                }
                // spec= k:String // required type
                else if ('function' === ntype) {
                    if (nval.name.toLowerCase() === stype) {
                        cur[k] = sval;
                    }
                    else {
                        err = { path: [...pathStack] };
                        break;
                    }
                }
                // type from default
                else if (undefined !== sval && ntype !== stype) {
                    err = { path: [...pathStack] };
                    break;
                }
                // spec= k:1 // default
                else if (undefined === sval) {
                    cur[k] = nval;
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
                console.log(('' + i).padStart(4), J(nodeStack[i]).substring(0, 33).padEnd(34), '/', J(curStack[i]).substring(0, 33).padEnd(34));
            }
            console.log('END', 'c=' + cN, 's=' + sI, 'p=' + pI, 'n=' + nI);
        }
        // TODO: collect errors
        if (err) {
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