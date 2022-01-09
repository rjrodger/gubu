"use strict";
/* Copyright (c) 2021-2022 Richard Rodger and other contributors, MIT License */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GValue = exports.GSome = exports.GRequired = exports.GRename = exports.GRefer = exports.GOptional = exports.GOne = exports.GNever = exports.GMin = exports.GMax = exports.GExact = exports.GEmpty = exports.GDefine = exports.GClosed = exports.GBelow = exports.GBefore = exports.GAny = exports.GAll = exports.GAfter = exports.GAbove = exports.Value = exports.Some = exports.Required = exports.Rename = exports.Refer = exports.Optional = exports.One = exports.Never = exports.Min = exports.Max = exports.Exact = exports.Empty = exports.Define = exports.Closed = exports.Below = exports.Before = exports.Any = exports.All = exports.After = exports.Above = exports.Args = exports.stringify = exports.makeErr = exports.buildize = exports.norm = exports.G$ = exports.Gubu = void 0;
// FEATURE: validator on completion of object or array
// FEATURE: support non-index properties on array shape
// FEATURE: state should indicate if value was present, not just undefined
// TODO: GubuShape.d is damaged by composition
const util_1 = require("util");
const package_json_1 = __importDefault(require("./package.json"));
const GUBU$ = Symbol.for('gubu$');
const GUBU = { gubu$: GUBU$, v$: package_json_1.default.version };
// The current validation state.
class State {
    constructor(root, top, ctx) {
        this.dI = 0; // Node depth.
        this.nI = 2; // Next free slot in nodes.
        this.cI = -1; // Pointer to next node.
        this.pI = 0; // Pointer to current node.
        this.sI = -1; // Pointer to next sibling node.
        this.valType = 'never';
        this.isRoot = false;
        this.key = '';
        this.type = 'never';
        this.stop = true;
        this.nextSibling = true;
        this.fromDefault = false;
        this.ignoreVal = false;
        this.err = [];
        this.parents = [];
        this.keys = [];
        this.path = [];
        this.root = root;
        this.vals = [root, -1];
        this.node = top;
        this.nodes = [top, -1];
        this.ctx = ctx || {};
    }
    next() {
        // this.printStacks()
        this.stop = false;
        this.fromDefault = false;
        this.ignoreVal = false;
        this.isRoot = 0 === this.pI;
        // Dereference the back pointers to ancestor siblings.
        // Only objects|arrays can be nodes, so a number is a back pointer.
        // NOTE: terminates because (+{...} -> NaN, +[] -> 0) -> false (JS wat FTW!)
        let nextNode = this.nodes[this.pI];
        while (+nextNode) {
            this.pI = +nextNode;
            nextNode = this.nodes[this.pI];
            this.dI--;
        }
        if (!nextNode) {
            this.stop = true;
            return;
        }
        else {
            this.node = nextNode;
        }
        this.updateVal(this.vals[this.pI]);
        this.key = this.keys[this.pI];
        this.cI = this.pI;
        this.sI = this.pI + 1;
        this.parent = this.parents[this.pI];
        this.nextSibling = true;
        this.type = this.node.t;
        this.path[this.dI] = this.key;
        this.oval = this.val;
    }
    updateVal(val) {
        this.val = val;
        this.valType = typeof (this.val);
        if ('number' === this.valType && isNaN(this.val)) {
            this.valType = 'nan';
        }
        if (this.isRoot) {
            this.root = this.val;
        }
        // console.log('UV', this.val)
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
    symbol: Symbol(''),
    bigint: BigInt(0),
    null: null,
};
// Normalize a value into a Node.
function norm(shape, depth) {
    var _a, _b, _c, _d, _e;
    // Is this a (possibly incomplete) Node?
    if (null != shape && ((_a = shape.$) === null || _a === void 0 ? void 0 : _a.gubu$)) {
        // Assume complete if gubu$ has special internal reference.
        if (GUBU$ === shape.$.gubu$) {
            shape.d = null == depth ? shape.d : depth;
            return shape;
        }
        // Normalize an incomplete Node, avoiding any recursive calls to norm.
        else if (true === shape.$.gubu$) {
            let node = { ...shape };
            node.$ = { v$: package_json_1.default.version, ...node.$, gubu$: GUBU$ };
            node.v =
                (null != node.v && 'object' === typeof (node.v)) ? { ...node.v } : node.v;
            node.t = node.t || typeof (node.v);
            if ('function' === node.t && IS_TYPE[node.v.name]) {
                node.t = node.v.name.toLowerCase();
                node.v = clone(EMPTY_VAL[node.t]);
            }
            node.r = !!node.r;
            node.o = !!node.o;
            node.d = null == depth ? null == node.d ? -1 : node.d : depth;
            node.b = node.b || [];
            node.a = node.a || [];
            node.u = node.u || {};
            return node;
        }
    }
    // Not a Node, so build one based on value and its type.
    let t = (null === shape ? 'null' : typeof (shape));
    t = ('undefined' === t ? 'any' : t);
    let v = shape;
    let r = false; // Optional by default.
    let o = false; // Only true when Optional builder is used.
    let b = undefined;
    let u = {};
    if ('object' === t) {
        if (Array.isArray(shape)) {
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
        if (IS_TYPE[shape.name]) {
            t = shape.name.toLowerCase();
            r = true;
            v = clone(EMPTY_VAL[t]);
        }
        else if (shape.gubu === GUBU || true === ((_b = shape.$) === null || _b === void 0 ? void 0 : _b.gubu)) {
            let gs = shape.spec ? shape.spec() : shape;
            t = gs.t;
            v = gs.v;
            r = gs.r;
            u = gs.u;
        }
        else if ((undefined === shape.prototype && Function === shape.constructor) ||
            Function === ((_c = shape.prototype) === null || _c === void 0 ? void 0 : _c.constructor)) {
            t = 'custom';
            b = v;
            v = undefined;
        }
        else {
            t = 'instance';
            r = true;
            u.n = (_e = (_d = v.prototype) === null || _d === void 0 ? void 0 : _d.constructor) === null || _e === void 0 ? void 0 : _e.name;
            u.i = v;
        }
    }
    else if ('number' === t && isNaN(v)) {
        t = 'nan';
    }
    let node = {
        $: GUBU,
        t,
        v: (null != v && ('object' === t || 'array' === t)) ? { ...v } : v,
        r,
        o,
        d: null == depth ? -1 : depth,
        u,
        a: [],
        b: [],
    };
    if (b) {
        node.b.push(b);
    }
    return node;
}
exports.norm = norm;
function make(intop, inopts) {
    const opts = null == inopts ? {} : inopts;
    opts.name =
        null == opts.name ? 'G' + ('' + Math.random()).substring(2, 8) : '' + opts.name;
    let top = norm(intop, 0);
    let gubuShape = function GubuShape(root, inctx) {
        let s = new State(root, top, inctx);
        // Iterative depth-first traversal of the shape.
        while (true) {
            s.next();
            if (s.stop) {
                break;
            }
            // let n = s.node
            let done = false;
            if (0 < s.node.b.length) {
                for (let bI = 0; bI < s.node.b.length; bI++) {
                    let update = handleValidate(s.node.b[bI], s);
                    if (undefined !== update.done) {
                        done = update.done;
                    }
                }
            }
            if (!done) {
                if ('never' === s.type) {
                    s.err.push(makeErrImpl('never', s, 1070));
                }
                else if ('object' === s.type) {
                    if (s.node.r && undefined === s.val) {
                        s.err.push(makeErrImpl('required', s, 1010));
                    }
                    else if (undefined !== s.val && (null === s.val ||
                        'object' !== s.valType ||
                        Array.isArray(s.val))) {
                        s.err.push(makeErrImpl('type', s, 1020));
                    }
                    else if (!s.node.o || null != s.val) {
                        s.updateVal(s.val || (s.fromDefault = true, {}));
                        let vkeys = Object.keys(s.node.v);
                        if (0 < vkeys.length) {
                            s.pI = s.nI;
                            for (let k of vkeys) {
                                let nvs = s.node.v[k] = norm(s.node.v[k], 1 + s.dI);
                                s.nodes[s.nI] = nvs;
                                s.vals[s.nI] = s.val[k];
                                s.parents[s.nI] = s.val;
                                s.keys[s.nI] = k;
                                s.nI++;
                            }
                            s.dI++;
                            s.nodes[s.nI++] = s.sI;
                            s.nextSibling = false;
                        }
                    }
                }
                else if ('array' === s.type) {
                    if (s.node.r && undefined === s.val) {
                        s.err.push(makeErrImpl('required', s, 1030));
                    }
                    else if (undefined !== s.val && !Array.isArray(s.val)) {
                        s.err.push(makeErrImpl('type', s, 1040));
                    }
                    else if (!s.node.o || null != s.val) {
                        s.updateVal(s.val || (s.fromDefault = true, []));
                        let vkeys = Object.keys(s.node.v).filter(k => !isNaN(+k));
                        if (0 < s.val.length || 1 < vkeys.length) {
                            s.pI = s.nI;
                            let nvs = undefined === s.node.v[0] ? Any() :
                                s.node.v[0] = norm(s.node.v[0], 1 + s.dI);
                            // Special elements
                            let j = 1;
                            if (1 < vkeys.length) {
                                for (; j < vkeys.length; j++) {
                                    let jvs = s.node.v[j] = norm(s.node.v[j], 1 + s.dI);
                                    s.nodes[s.nI] = jvs;
                                    s.vals[s.nI] = s.val[(j - 1)];
                                    s.parents[s.nI] = s.val;
                                    s.keys[s.nI] = '' + (j - 1);
                                    s.nI++;
                                }
                            }
                            for (let i = j - 1; i < s.val.length; i++) {
                                s.nodes[s.nI] = nvs;
                                s.vals[s.nI] = s.val[i];
                                s.parents[s.nI] = s.val;
                                s.keys[s.nI] = '' + i;
                                s.nI++;
                            }
                            s.dI++;
                            s.nodes[s.nI++] = s.sI;
                            s.nextSibling = false;
                        }
                    }
                }
                // Invalid type.
                else if (!('any' === s.type ||
                    'custom' === s.type ||
                    'list' === s.type ||
                    undefined === s.val ||
                    s.type === s.valType ||
                    ('instance' === s.type && s.node.u.i && s.val instanceof s.node.u.i) ||
                    ('null' === s.type && null === s.val))) {
                    s.err.push(makeErrImpl('type', s, 1050));
                }
                // Value itself, or default.
                else if (undefined === s.val) {
                    let parentKey = s.path[s.dI];
                    if (s.node.r &&
                        ('undefined' !== s.type || !s.parent.hasOwnProperty(parentKey))) {
                        s.err.push(makeErrImpl('required', s, 1060));
                    }
                    else if ('custom' !== s.type &&
                        undefined !== s.node.v &&
                        !s.node.o ||
                        'undefined' === s.type) {
                        s.updateVal(s.node.v);
                        s.fromDefault = true;
                    }
                }
                // Empty strings fail even if string is optional. Use Empty() to allow.
                else if ('string' === s.type && '' === s.val && !s.node.u.empty) {
                    s.err.push(makeErrImpl('required', s, 1080));
                }
            }
            if (0 < s.node.a.length) {
                for (let aI = 0; aI < s.node.a.length; aI++) {
                    let update = handleValidate(s.node.a[aI], s);
                    if (undefined !== update.done) {
                        done = update.done;
                    }
                }
            }
            if (s.parent && !done && !s.ignoreVal && !s.node.o) {
                // console.log('PS', s.key, s.val)
                s.parent[s.key] = s.val;
            }
            if (s.nextSibling) {
                s.pI = s.sI;
            }
        }
        if (0 < s.err.length) {
            if (s.ctx.err) {
                s.ctx.err.push(...s.err);
            }
            else {
                throw new GubuError('shape', s.err, s.ctx);
            }
        }
        return s.root;
    };
    // TODO: test Number, String, etc also in arrays
    gubuShape.spec = () => {
        // Normalize spec, discard errors.
        gubuShape(undefined, { err: [] });
        return JSON.parse(stringify(top, (_key, val) => {
            if (GUBU$ === val) {
                return true;
            }
            return val;
        }));
    };
    let desc = '';
    gubuShape.toString = gubuShape[util_1.inspect.custom] = () => {
        desc = '' === desc ?
            stringify((top &&
                top.$ &&
                (GUBU$ === top.$.gubu$ || true === top.$.gubu$)) ? top.v : top) :
            desc;
        desc = desc.substring(0, 33) + (33 < desc.length ? '...' : '');
        return `[Gubu ${opts.name} ${desc}]`;
    };
    gubuShape.gubu = GUBU;
    return gubuShape;
}
function handleValidate(vf, s) {
    let update = {};
    let valid = vf(s.val, update, s);
    if (!valid || update.err) {
        // Explicit Optional allows undefined
        if (undefined === s.val && (s.node.o || !s.node.r)) {
            delete update.err;
            return update;
        }
        let w = update.why || 'custom';
        let p = pathstr(s);
        if ('string' === typeof (update.err)) {
            s.err.push(makeErr(s, update.err));
        }
        else if ('object' === typeof (update.err)) {
            // Assumes makeErr already called
            s.err.push(...[update.err].flat().map(e => {
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
            s.err.push(makeErrImpl(w, s, 1045, undefined, {}, fname));
        }
        update.done = null == update.done ? true : update.done;
    }
    // Use uval for undefined and NaN
    if (update.hasOwnProperty('uval')) {
        s.updateVal(update.val);
    }
    else if (undefined !== update.val && !Number.isNaN(update.val)) {
        // console.log('QQQ', update)
        s.updateVal(update.val);
    }
    else if ('custom' === s.node.t) {
        s.ignoreVal = true;
    }
    if (undefined !== update.node) {
        s.node = update.node;
    }
    if (undefined !== update.type) {
        s.type = update.type;
    }
    // TODO: remove?
    s.nI = undefined === update.nI ? s.nI : update.nI;
    s.sI = undefined === update.sI ? s.sI : update.sI;
    s.pI = undefined === update.pI ? s.pI : update.pI;
    return update;
}
// function pathstr(path: string[], dI: number) {
function pathstr(s) {
    return s.path.slice(1, s.dI + 1).filter(p => null != p).join('.');
}
const Required = function (shape) {
    let node = buildize(this, shape);
    node.r = true;
    if (undefined === shape && 1 === arguments.length) {
        node.t = 'undefined';
        node.v = undefined;
    }
    return node;
};
exports.Required = Required;
const Optional = function (shape) {
    let node = buildize(this, shape);
    node.r = false;
    // Mark Optional as explicit => do not insert empty arrays and objects.
    node.o = true;
    return node;
};
exports.Optional = Optional;
const Empty = function (shape) {
    let node = buildize(this, shape);
    node.u.empty = true;
    return node;
};
exports.Empty = Empty;
// Optional value provides default.
const Any = function (shape) {
    let node = buildize(this, shape);
    node.t = 'any';
    if (undefined !== shape) {
        node.v = shape;
    }
    return node;
};
exports.Any = Any;
const Never = function (shape) {
    let node = buildize(this, shape);
    node.t = 'never';
    return node;
};
exports.Never = Never;
// Pass only if all match. Does not short circuit (as defaults may be missed).
const All = function (...inshapes) {
    let node = buildize();
    node.t = 'list';
    let shapes = inshapes.map(s => Gubu(s));
    node.u.list = inshapes;
    node.b.push(function All(val, update, state) {
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
                makeErr(state, `Value "$VALUE" for path "$PATH" does not satisfy All shape:`),
                ...err
            ];
        }
        return pass;
    });
    return node;
};
exports.All = All;
// Pass if some match. Does not short circuit (as defaults may be missed).
const Some = function (...inshapes) {
    let node = buildize();
    node.t = 'list';
    let shapes = inshapes.map(s => Gubu(s));
    node.u.list = inshapes;
    node.b.push(function Some(val, update, state) {
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
                makeErr(state, `Value "$VALUE" for path "$PATH" does not satisfy Some shape:`),
                ...err
            ];
        }
        return pass;
    });
    return node;
};
exports.Some = Some;
// Pass if exactly one matches. Does not short circuit (as defaults may be missed).
const One = function (...inshapes) {
    let node = buildize();
    node.t = 'list';
    let shapes = inshapes.map(s => Gubu(s));
    node.u.list = inshapes;
    node.b.push(function One(val, update, state) {
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
                makeErr(state, `Value "$VALUE" for path "$PATH" does not satisfy One shape:`),
                ...err
            ];
        }
        return true;
    });
    return node;
};
exports.One = One;
const Exact = function (...vals) {
    let node = buildize();
    node.b.push(function Exact(val, update, state) {
        for (let i = 0; i < vals.length; i++) {
            if (val === vals[i]) {
                return true;
            }
        }
        update.err =
            makeErr(state, `Value "$VALUE" for path "$PATH" must be exactly one of: ` +
                `${vals.map(v => stringify(v)).join(', ')}.`);
        return false;
    });
    return node;
};
exports.Exact = Exact;
const Before = function (validate, shape) {
    let node = buildize(this, shape);
    node.b.push(validate);
    return node;
};
exports.Before = Before;
const After = function (validate, shape) {
    let node = buildize(this, shape);
    node.a.push(validate);
    return node;
};
exports.After = After;
// TODO: array without specials should have no effect
const Closed = function (shape) {
    let node = buildize(this, shape);
    node.b.push(function Closed(val, update, s) {
        if (null != val && 'object' === typeof (val) && !Array.isArray(val)) {
            let vkeys = Object.keys(val);
            let allowed = node.v;
            // NOTE: disabling array for now
            // // For arrays, handle non-index properties, and special element offset.
            // if ('array' === s.node.t) {
            //   allowed = Object.keys(node.v).slice(1)
            //     .map((x: any) => {
            //       let i = parseInt(x)
            //       if (isNaN(i)) {
            //         return x
            //       }
            //       else {
            //         return i - 1
            //       }
            //     })
            //     .reduce((a: any, i: any) => (a[i] = true, a), {})
            // }
            update.err = [];
            for (let k of vkeys) {
                if (undefined === allowed[k]) {
                    update.err.push(makeErrImpl('closed', s, 3010, '', { k }));
                }
            }
            return 0 === update.err.length;
        }
        return true;
    });
    return node;
};
exports.Closed = Closed;
const Define = function (inopts, shape) {
    let node = buildize(this, shape);
    let opts = 'object' === typeof inopts ? inopts || {} : {};
    let name = 'string' === typeof inopts ? inopts : opts.name;
    if (null != name && '' != name) {
        node.b.push(function Define(_val, _update, state) {
            let ref = state.ctx.ref = state.ctx.ref || {};
            ref[name] = state.node;
            return true;
        });
    }
    return node;
};
exports.Define = Define;
const Refer = function (inopts, shape) {
    let node = buildize(this, shape);
    let opts = 'object' === typeof inopts ? inopts || {} : {};
    let name = 'string' === typeof inopts ? inopts : opts.name;
    // Fill should be false (the default) if used recursively, to prevent loops.
    let fill = !!opts.fill;
    if (null != name && '' != name) {
        node.b.push(function Refer(val, update, state) {
            if (undefined !== val || fill) {
                let ref = state.ctx.ref = state.ctx.ref || {};
                if (undefined !== ref[name]) {
                    let node = { ...ref[name] };
                    node.t = node.t || 'never';
                    update.node = node;
                    update.type = node.t;
                }
            }
            // TODO: option to fail if ref not found?
            return true;
        });
    }
    return node;
};
exports.Refer = Refer;
const Rename = function (inopts, shape) {
    let node = buildize(this, shape);
    let opts = 'object' === typeof inopts ? inopts || {} : {};
    let name = 'string' === typeof inopts ? inopts : opts.name;
    let keep = 'boolean' === typeof opts.keep ? opts.keep : undefined;
    // NOTE: Rename claims are experimental.
    let claim = Array.isArray(opts.claim) ? opts.claim : [];
    if (null != name && '' != name) {
        // If there is a claim, grab the value so that validations
        // can be applied to it.
        let vsb = (val, update, s) => {
            if (undefined === val && 0 < claim.length) {
                s.ctx.Rename = (s.ctx.Rename || {});
                s.ctx.Rename.fromDefault = (s.ctx.Rename.fromDefault || {});
                for (let cn of claim) {
                    let fromDefault = s.ctx.Rename.fromDefault[cn] || {};
                    // Only use claim if it was not a default value.
                    if (undefined !== s.parent[cn] && !fromDefault.yes) {
                        update.val = s.parent[name] = s.parent[cn];
                        update.node = fromDefault.node;
                        // Old errors on the claimed value are no longer valid.
                        for (let eI = 0; eI < s.err.length; eI++) {
                            if (s.err[eI].k === fromDefault.key) {
                                s.err.splice(eI, 1);
                                eI--;
                            }
                        }
                        if (!keep) {
                            delete s.parent[cn];
                        }
                        else {
                            let j = s.cI + 1;
                            // Add the default to the end of the node set to ensure it
                            // is properly validated.
                            s.nodes.splice(j, 0, norm(fromDefault.dval));
                            s.vals.splice(j, 0, undefined);
                            s.parents.splice(j, 0, s.parent);
                            s.keys.splice(j, 0, cn);
                            s.nI++;
                            s.pI++;
                        }
                        break;
                    }
                }
                if (undefined === update.val) {
                    update.val = s.node.v;
                }
            }
            return true;
        };
        Object.defineProperty(vsb, 'name', { value: 'Rename:' + name });
        node.b.push(vsb);
        let vsa = (val, update, state) => {
            state.parent[name] = val;
            if (!keep &&
                state.key !== name &&
                // Arrays require explicit deletion as validation is based on index
                // and will be lost.
                !(Array.isArray(state.parent) && false !== keep)) {
                delete state.parent[state.key];
                update.done = true;
            }
            state.ctx.Rename = (state.ctx.Rename || {});
            state.ctx.Rename.fromDefault = (state.ctx.Rename.fromDefault || {});
            state.ctx.Rename.fromDefault[name] = {
                yes: state.fromDefault,
                key: state.key,
                dval: state.node.v,
                node: state.node
            };
            return true;
        };
        Object.defineProperty(vsa, 'name', { value: 'Rename:' + name });
        node.a.push(vsa);
    }
    return node;
};
exports.Rename = Rename;
function valueLen(val) {
    return 'number' === typeof (val) ? val :
        'number' === typeof (val === null || val === void 0 ? void 0 : val.length) ? val.length :
            null != val && 'object' === typeof (val) ? Object.keys(val).length :
                NaN;
}
const Min = function (min, shape) {
    let node = buildize(this, shape);
    node.b.push(function Min(val, update, state) {
        let vlen = valueLen(val);
        if (min <= vlen) {
            return true;
        }
        let errmsgpart = 'number' === typeof (val) ? '' : 'length ';
        update.err =
            makeErr(state, `Value "$VALUE" for path "$PATH" must be a minimum ${errmsgpart}of ${min} (was ${vlen}).`);
        return false;
    });
    return node;
};
exports.Min = Min;
const Max = function (max, shape) {
    let node = buildize(this, shape);
    node.b.push(function Max(val, update, state) {
        let vlen = valueLen(val);
        if (vlen <= max) {
            return true;
        }
        let errmsgpart = 'number' === typeof (val) ? '' : 'length ';
        update.err =
            makeErr(state, `Value "$VALUE" for path "$PATH" must be a maximum ${errmsgpart}of ${max} (was ${vlen}).`);
        return false;
    });
    return node;
};
exports.Max = Max;
const Above = function (above, shape) {
    let node = buildize(this, shape);
    node.b.push(function Above(val, update, state) {
        let vlen = valueLen(val);
        if (above < vlen) {
            return true;
        }
        let errmsgpart = 'number' === typeof (val) ? 'be' : 'have length';
        update.err =
            makeErr(state, `Value "$VALUE" for path "$PATH" must ${errmsgpart} above ${above} (was ${vlen}).`);
        return false;
    });
    return node;
};
exports.Above = Above;
const Below = function (below, shape) {
    let node = buildize(this, shape);
    node.b.push(function Below(val, update, state) {
        let vlen = valueLen(val);
        if (vlen < below) {
            return true;
        }
        let errmsgpart = 'number' === typeof (val) ? 'be' : 'have length';
        update.err =
            makeErr(state, `Value "$VALUE" for path "$PATH" must ${errmsgpart} below ${below} (was ${vlen}).`);
        return false;
    });
    return node;
};
exports.Below = Below;
const Value = function (shape0, shape1) {
    let node = undefined == shape1 ? buildize(this) : buildize(shape0);
    let shape = norm(undefined == shape1 ? shape0 : shape1);
    node.a.push(function Below(val, _update, s) {
        if (null != val) {
            let namedKeys = Object.keys(s.node.v);
            let valKeys = Object.keys(val)
                .reduce((a, k) => ((namedKeys.includes(k) || a.push(k)), a), []);
            if (0 < valKeys.length) {
                let endI = s.nI + valKeys.length - 1;
                let nI = s.nI;
                if (0 < namedKeys.length) {
                    nI--;
                    s.nodes[endI] = s.nodes[nI];
                    s.vals[endI] = s.vals[nI];
                    s.parents[endI] = s.parents[nI];
                    s.keys[endI] = s.keys[nI];
                }
                else {
                    endI++;
                    s.nodes[endI] = s.sI;
                    s.pI = nI;
                }
                for (let k of valKeys) {
                    s.nodes[nI] = norm(shape, 1 + s.dI);
                    s.vals[nI] = val[k];
                    s.parents[nI] = val;
                    s.keys[nI] = k;
                    nI++;
                }
                s.nI = endI + 1;
                s.nextSibling = false;
                s.dI++;
            }
        }
        return true;
    });
    return node;
};
exports.Value = Value;
function buildize(invs0, invs1) {
    let invs = undefined === invs0 ? invs1 : invs0.window === invs0 ? invs1 : invs0;
    let node = norm(invs);
    return Object.assign(node, {
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
        Value,
    });
}
exports.buildize = buildize;
// External utility to make ErrDesc objects.
function makeErr(state, text, why, user) {
    return makeErrImpl(why || 'custom', state, 4000, text, user);
}
exports.makeErr = makeErr;
// Internal utility to make ErrDesc objects.
function makeErrImpl(why, s, mark, text, user, fname) {
    let err = {
        k: s.key,
        n: s.node,
        v: s.val,
        p: pathstr(s),
        w: why,
        m: mark,
        t: '',
        u: user || {},
    };
    let jstr = undefined === s.val ? '' : stringify(s.val);
    let valstr = jstr.replace(/"/g, '');
    valstr = valstr.substring(0, 77) + (77 < valstr.length ? '...' : '');
    if (null == text || '' === text) {
        err.t = `Validation failed for path "${err.p}" ` +
            `with value "${valstr}" because ` +
            ('type' === why ? ('instance' === s.node.t ? `the value is not an instance of ${s.node.u.n}` :
                `the value is not of type ${s.node.t}`) :
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
exports.stringify = stringify;
function clone(x) {
    return null == x ? x : 'object' !== typeof (x) ? x : JSON.parse(JSON.stringify(x));
}
const G$ = (node) => norm({ ...node, $: { gubu$: true } });
exports.G$ = G$;
// Fix builder names after terser mangles them.
/* istanbul ignore next */
if ('undefined' !== typeof (window)) {
    Object.defineProperty(Above, 'name', { value: 'Above' });
    Object.defineProperty(After, 'name', { value: 'After' });
    Object.defineProperty(All, 'name', { value: 'All' });
    Object.defineProperty(Any, 'name', { value: 'Any' });
    Object.defineProperty(Before, 'name', { value: 'Before' });
    Object.defineProperty(Below, 'name', { value: 'Below' });
    Object.defineProperty(Closed, 'name', { value: 'Closed' });
    Object.defineProperty(Define, 'name', { value: 'Define' });
    Object.defineProperty(Empty, 'name', { value: 'Empty' });
    Object.defineProperty(Exact, 'name', { value: 'Exact' });
    Object.defineProperty(Max, 'name', { value: 'Max' });
    Object.defineProperty(Min, 'name', { value: 'Min' });
    Object.defineProperty(Never, 'name', { value: 'Never' });
    Object.defineProperty(One, 'name', { value: 'One' });
    Object.defineProperty(Optional, 'name', { value: 'Optional' });
    Object.defineProperty(Refer, 'name', { value: 'Refer' });
    Object.defineProperty(Rename, 'name', { value: 'Rename' });
    Object.defineProperty(Required, 'name', { value: 'Required' });
    Object.defineProperty(Some, 'name', { value: 'Some' });
    Object.defineProperty(Value, 'name', { value: 'Value' });
}
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
    Value,
    GAbove: Above,
    GAfter: After,
    GAll: All,
    GAny: Any,
    GBefore: Before,
    GBelow: Below,
    GClosed: Closed,
    GDefine: Define,
    GEmpty: Empty,
    GExact: Exact,
    GMax: Max,
    GMin: Min,
    GNever: Never,
    GOne: One,
    GOptional: Optional,
    GRefer: Refer,
    GRename: Rename,
    GRequired: Required,
    GSome: Some,
    GValue: Value,
    G$,
    buildize,
    makeErr,
    stringify,
    Args,
});
Object.defineProperty(make, 'name', { value: 'gubu' });
const Gubu = make;
exports.Gubu = Gubu;
// Experimental: function argument validation.
// Uses Rename claims to support optional prefix arguments.
function Args(shapes, wrapped) {
    function fix(s) {
        return 'function' === typeof (s) ? G$({ v: s }) : s;
    }
    let restArg = undefined;
    let args = Object.keys(shapes)
        .reduce((as, name, index, keys) => {
        if (name.startsWith('...') && index + 1 === keys.length) {
            restArg = { name: name.substring(3), shape: fix(shapes[name]) };
        }
        else {
            let fullname = name;
            let claim = (name.split(':')[1] || '').split(',').filter(c => '' !== c);
            if (0 < claim.length) {
                name = fullname.split(':')[0];
            }
            else {
                claim = undefined;
            }
            as[index + 1] = Rename({ name, claim, keep: true }, fix(shapes[fullname]));
        }
        return as;
    }, [Never()]);
    if (restArg) {
        args[0] = After((v, _u, s) => {
            s.parent[restArg.name] = (s.parent[restArg.name] || []);
            s.parent[restArg.name].push(v);
            return true;
        }, restArg.shape);
        // TODO: should use Complete
        args = After((v, _u, _s) => {
            if (v) {
                v[restArg.name] = (v[restArg.name] || []);
            }
            return true;
        }, args);
    }
    let argsShape = Gubu(args);
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
const GValue = Value;
exports.GValue = GValue;
//# sourceMappingURL=gubu.js.map