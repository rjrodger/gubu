"use strict";
/* Copyright (c) 2021-2022 Richard Rodger and other contributors, MIT License */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bar = exports.Foo = void 0;
const package_json_1 = __importDefault(require("../package.json"));
const Large = require('./large');
const Long = require('./long');
// Handle web (Gubu) versus node ({Gubu}) export.
let GubuModule = require('../gubu');
if (GubuModule.Gubu) {
    GubuModule = GubuModule.Gubu;
}
const Gubu = GubuModule;
const G$ = Gubu.G$;
const stringify = Gubu.stringify;
const truncate = Gubu.truncate;
const { Above, After, All, Any, Before, Below, Check, Closed, Define, Empty, Exact, Max, Min, Never, One, Open, Refer, Rename, Required, Skip, Some, Value, } = Gubu;
class Foo {
    constructor(a) {
        this.a = -1;
        this.a = a;
    }
}
exports.Foo = Foo;
class Bar {
    constructor(b) {
        this.b = -2;
        this.b = b;
    }
}
exports.Bar = Bar;
describe('gubu', () => {
    test('happy', () => {
        expect(Gubu()).toBeDefined();
        expect(Gubu().toString()).toMatch(/\[Gubu G\d+ undefined\]/);
        expect(Gubu(undefined, { name: 'foo' }).toString()).toMatch(/\[Gubu foo undefined\]/);
        expect(Gubu('x', { name: 'bar' }).toString()).toMatch(/\[Gubu bar "x"\]/);
        let g0 = Gubu({
            a: 'foo',
            b: 100
        });
        expect(g0({})).toEqual({ a: 'foo', b: 100 });
        expect(g0({ a: 'bar' })).toEqual({ a: 'bar', b: 100 });
        expect(g0({ b: 999 })).toEqual({ a: 'foo', b: 999 });
        expect(g0({ a: 'bar', b: 999 })).toEqual({ a: 'bar', b: 999 });
        expect(() => g0({ a: 'bar', b: 999, c: true })).toThrow('not allowed');
    });
    test('valid-basic', () => {
        let g0 = Gubu({ x: 1, y: 'Y' });
        // let d0 = { x: 2, z: true }
        let d0 = { x: 2 };
        if (g0.valid(d0)) {
            // expect(d0).toEqual({ x: 2, y: 'Y', z: true })
            expect(d0).toEqual({ x: 2, y: 'Y' });
            expect(d0.x).toEqual(2);
            expect(d0.y).toEqual('Y');
            // expect(d0.z).toEqual(true)
        }
        let g0d = Gubu(Open({ x: 1, y: 'Y' }));
        let d0d = { x: 2, z: true };
        let d0do = g0d(d0d);
        expect(d0do).toEqual({ x: 2, y: 'Y', z: true });
        expect(d0do.x).toEqual(2);
        expect(d0do.y).toEqual('Y');
        expect(d0do.z).toEqual(true);
        let g1 = Gubu(Open({ x: Number, y: 'Y' }));
        let d1 = { x: 2, z: true };
        if (g1.valid(d1)) {
            expect(d1).toEqual({ x: 2, y: 'Y', z: true });
            expect(d1.x).toEqual(2);
            expect(d1.y).toEqual('Y');
            expect(d1.z).toEqual(true);
        }
        let g2 = Gubu(Open({ x: { k: 1 }, y: 'Y' }));
        let d2 = { x: { k: 2 }, z: true };
        if (g2.valid(d2)) {
            expect(d2).toEqual({ x: { k: 2 }, y: 'Y', z: true });
            expect(d2.x).toEqual({ k: 2 });
            expect(d2.y).toEqual('Y');
            expect(d2.z).toEqual(true);
        }
        let g3 = Gubu({ ...new Foo(1) });
        // let d3 = { a: 11, x: true }
        let d3 = { a: 11 };
        if (g3.valid(d3)) {
            // expect(d3).toEqual({ a: 11, x: true })
            expect(d3).toEqual({ a: 11 });
            expect(d3.a).toEqual(11);
            // expect(d3.x).toEqual(true)
        }
        let g4 = Gubu(Open({ x: Closed({ k: 1 }), y: 'Y' }));
        let d4 = { z: true };
        if (g4.valid(d4)) {
            expect(d4).toEqual({ x: { k: 1 }, y: 'Y', z: true });
            expect(d4.x).toEqual({ k: 1 });
            expect(d4.x.k).toEqual(1);
            expect(d4.y).toEqual('Y');
            expect(d4.z).toEqual(true);
        }
    });
    test('readme-quick', () => {
        // Property a is optional, must be a Number, and defaults to 1.
        // Property b is required, and must be a String.
        const shape = Gubu({ a: 1, b: String });
        // Object shape is good! Prints `{ a: 99, b: 'foo' }`
        expect(shape({ a: 99, b: 'foo' })).toEqual({ a: 99, b: 'foo' });
        // Object shape is also good. Prints `{ a: 1, b: 'foo' }`
        expect(shape({ b: 'foo' })).toEqual({ a: 1, b: 'foo' });
        // Object shape is bad. Throws an exception:
        expect(() => shape({ a: 'BAD' })).toThrow('Validation failed for property "a" with value "BAD" because the value is not of type number.\nValidation failed for property "b" with value "" because the value is required.');
        // Object shape is bad. Throws an exception:
        expect(() => shape({ b: 'foo', c: true })).toThrow('Validation failed for object "{b:foo,c:true}" because the property "c" is not allowed.');
    });
    test('readme-options', () => {
        const optionShape = Gubu({
            host: 'localhost',
            port: 8080
        });
        // console.log(optionShape({}))
        expect(optionShape()).toEqual({
            host: 'localhost',
            port: 8080
        });
        expect(optionShape({})).toEqual({
            host: 'localhost',
            port: 8080
        });
        expect(optionShape({ host: 'foo' })).toEqual({
            host: 'foo',
            port: 8080
        });
        expect(optionShape({ host: 'foo', port: undefined })).toEqual({
            host: 'foo',
            port: 8080
        });
        expect(optionShape({ host: 'foo', port: 9090 })).toEqual({
            host: 'foo',
            port: 9090
        });
        expect(() => optionShape({ host: 9090 })).toThrow('type');
        expect(() => optionShape({ port: '9090' })).toThrow('type');
        expect(() => optionShape({ host: '' })).toThrow('empty string is not allowed');
    });
    test('readme-deep', () => {
        const productListShape = Gubu({
            products: [
                {
                    name: String,
                    img: 'generic.png'
                }
            ]
        });
        expect(productListShape({})).toEqual({ products: [] });
        let result = productListShape({
            products: [
                { name: 'Apple', img: 'apple.png' },
                { name: 'Pear', img: 'pear.png' },
                { name: 'Banana' } // Missing image!
            ]
        });
        // console.dir(result, { depth: null })
        expect(result).toEqual({
            products: [
                { name: 'Apple', img: 'apple.png' },
                { name: 'Pear', img: 'pear.png' },
                { name: 'Banana', img: 'generic.png' }
            ]
        });
    });
    test('readme-shape-builder', () => {
        const userShape = Gubu({
            person: Required({
                name: String,
                age: Number,
            })
        });
        expect(() => userShape({})).toThrow('Validation failed for property "person" with value "" because the value is required.');
        expect(userShape({
            person: {
                name: 'Alice',
                age: 99
            }
        })).toEqual({
            person: {
                name: 'Alice',
                age: 99
            }
        });
    });
    test('readme-object', () => {
        let shape = Gubu({
            foo: {
                bar: {
                    zed: String,
                    qaz: Number,
                }
            }
        });
        expect(shape({
            foo: {
                bar: {
                    zed: 'x',
                    qaz: 1
                }
            }
        })).toEqual({
            foo: {
                bar: {
                    zed: 'x',
                    qaz: 1
                }
            }
        });
        let openObject = Gubu(Open({ a: 1 }));
        expect(openObject({ a: 11, b: 22 })).toEqual({ a: 11, b: 22 });
    });
    test('readme-regexp', () => {
        let shape = Gubu({ countryCode: Check(/^[A-Z][A-Z]$/) });
        expect(shape({ countryCode: 'IE' })).toEqual({ countryCode: 'IE' });
        expect(() => shape({ countryCode: 'BAD' })).toThrow('Validation failed for property "countryCode" with value "BAD" because check "/^[A-Z][A-Z]$/" failed.');
        expect(() => shape({})).toThrow('Validation failed for property "countryCode" with value "" because check "/^[A-Z][A-Z]$/" failed.');
        expect(() => shape({ countryCode: 123 })).toThrow('Validation failed for property "countryCode" with value "123" because check "/^[A-Z][A-Z]$/" failed.');
    });
    test('readme-recursive', () => {
        let tree = Gubu({
            root: Define('BRANCH', {
                value: String,
                left: Refer('BRANCH'),
                right: Refer('BRANCH'),
            })
        });
        expect(tree({
            root: {
                value: 'A',
                left: {
                    value: 'AB',
                    left: {
                        value: 'ABC'
                    },
                    right: {
                        value: 'ABD'
                    },
                },
                right: {
                    value: 'AE',
                    left: {
                        value: 'AEF'
                    },
                },
            }
        })).toMatchObject({
            root: {
                value: 'A',
                left: {
                    value: 'AB',
                    left: {
                        value: 'ABC'
                    },
                    right: {
                        value: 'ABD'
                    },
                },
                right: {
                    value: 'AE',
                    left: {
                        value: 'AEF'
                    },
                },
            }
        });
        expect(() => tree({
            root: {
                value: 'A',
                left: {
                    value: 'AB',
                    left: {
                        value: 'ABC',
                        left: {
                            value: 123
                        },
                    },
                },
            }
        })).toThrow('Validation failed for property "root.left.left.left.value" with value "123" because the value is not of type string');
    });
    test('scalar-optional-basic', () => {
        let g0 = Gubu(1);
        expect(g0(2)).toEqual(2);
        expect(g0()).toEqual(1);
        expect(() => g0('x')).toThrow('Validation failed for value "x" because the value is not of type number.');
    });
    test('object-optional-basic', () => {
        let g0 = Gubu(Open({ x: 1 }));
        expect(g0({ x: 2, y: true, z: 's' })).toEqual({ x: 2, y: true, z: 's' });
        expect(g0({ x: 2 })).toEqual({ x: 2 });
        expect(g0({})).toEqual({ x: 1 });
        expect(g0()).toEqual({ x: 1 });
        expect(() => g0('s')).toThrow('Validation failed for value "s" because the value is not of type object.');
        expect(() => g0({ x: 't' })).toThrow('Validation failed for property "x" with value "t" because the value is not of type number.');
    });
    test('array-basic-optional', () => {
        let g0 = Gubu([1]);
        expect(g0([11, 22, 33])).toEqual([11, 22, 33]);
        expect(g0([11, 22])).toEqual([11, 22]);
        expect(g0([11])).toEqual([11]);
        expect(g0([])).toEqual([]);
        expect(g0()).toEqual([]);
        expect(() => g0('s')).toThrow('Validation failed for value "s" because the value is not of type array.');
        expect(() => g0(['t'])).toThrow('Validation failed for index "0" with value "t" because the value is not of type number.');
        expect(() => g0(['t', 22])).toThrow('Validation failed for index "0" with value "t" because the value is not of type number.');
        expect(() => g0(['t', 33])).toThrow('Validation failed for index "0" with value "t" because the value is not of type number.');
        expect(() => g0([11, 't'])).toThrow('Validation failed for index "1" with value "t" because the value is not of type number.');
        expect(() => g0([11, 22, 't'])).toThrow('Validation failed for index "2" with value "t" because the value is not of type number.');
        let g1 = Gubu([]);
        expect(g1([11, 22, 33])).toEqual([11, 22, 33]);
        expect(g1([11, 22])).toEqual([11, 22]);
        expect(g1([11])).toEqual([11]);
        expect(g1([])).toEqual([]);
        expect(g1()).toEqual([]);
        expect(() => g1('s')).toThrow('Validation failed for value "s" because the value is not of type array.');
        expect(g1(['t'])).toEqual(['t']);
        expect(g1(['t', 22])).toEqual(['t', 22]);
        expect(g1(['t', 33])).toEqual(['t', 33]);
        expect(g1([11, 't'])).toEqual([11, 't']);
        expect(g1([11, 22, 't'])).toEqual([11, 22, 't']);
    });
    test('array-basic-required', () => {
        let g1 = Gubu(Array);
        expect(g1([11, 22, 33])).toEqual([11, 22, 33]);
        expect(g1([11, 22])).toEqual([11, 22]);
        expect(g1([11])).toEqual([11]);
        expect(g1([])).toEqual([]);
        expect(() => g1()).toThrow('required');
        expect(() => g1('s')).toThrow('Validation failed for value "s" because the value is not of type array.');
        expect(g1(['t'])).toEqual(['t']);
        expect(g1(['t', 22])).toEqual(['t', 22]);
        expect(g1(['t', 33])).toEqual(['t', 33]);
        expect(g1([11, 't'])).toEqual([11, 't']);
        expect(g1([11, 22, 't'])).toEqual([11, 22, 't']);
        let g2 = Gubu(Required([]));
        expect(g2([11, 22, 33])).toEqual([11, 22, 33]);
        expect(g2([11, 22])).toEqual([11, 22]);
        expect(g2([11])).toEqual([11]);
        expect(g2([])).toEqual([]);
        expect(() => g2()).toThrow('required');
        expect(() => g2('s')).toThrow('Validation failed for value "s" because the value is not of type array.');
        expect(g2(['t'])).toEqual(['t']);
        expect(g2(['t', 22])).toEqual(['t', 22]);
        expect(g2(['t', 33])).toEqual(['t', 33]);
        expect(g2([11, 't'])).toEqual([11, 't']);
        expect(g2([11, 22, 't'])).toEqual([11, 22, 't']);
    });
    test('spec-revert-skip-required', () => {
        let or = Gubu(Skip(Required(1)));
        expect(or.spec()).toMatchObject({ r: false, p: true, v: 1, t: 'number' });
        let ror = Gubu(Required(Skip(Required(1))));
        expect(ror.spec()).toMatchObject({ r: true, p: false, v: 1, t: 'number' });
        let ro = Gubu(Required(Skip(1)));
        expect(ro.spec()).toMatchObject({ r: true, p: false, v: 1, t: 'number' });
        let oro = Gubu(Skip(Required(Skip(1))));
        expect(oro.spec()).toMatchObject({ r: false, p: true, v: 1, t: 'number' });
    });
    test('match-basic', () => {
        let tmp = {};
        let g0 = Gubu(Number);
        expect(g0.match(1)).toEqual(true);
        expect(g0.match('x')).toEqual(false);
        expect(g0.match(true)).toEqual(false);
        expect(g0.match({})).toEqual(false);
        expect(g0.match([])).toEqual(false);
        // Match does not mutate root
        let g1 = Gubu({ a: { b: 1 } });
        expect(g1.match(tmp.a1 = {})).toEqual(true);
        expect(tmp.a1).toEqual({});
        expect(g1.match(tmp.a1 = { a: {} })).toEqual(true);
        expect(tmp.a1).toEqual({ a: {} });
        let c0 = { err: [] };
        expect(g1.match(tmp.a1 = { a: 1 }, c0)).toEqual(false);
        expect(tmp.a1).toEqual({ a: 1 });
        expect(c0.err[0].w).toEqual('type');
    });
    test('error-basic', () => {
        let g0 = Gubu(Number);
        expect(g0(1)).toEqual(1);
        expect(() => g0('x')).toThrow('Validation failed for value "x" because the value is not of type number.');
        let ctx0 = { err: [] };
        g0('x', ctx0);
        expect(ctx0).toMatchObject({
            err: [
                {
                    n: { t: 'number' },
                    v: 'x',
                    p: '',
                    w: 'type',
                    m: 1050,
                    t: 'Validation failed for value "x" because the value is not of type number.',
                    u: {},
                }
            ]
        });
        try {
            g0('x');
        }
        catch (e) {
            expect(e.message).toEqual('Validation failed for value "x" because the value is not of type number.');
            expect(e).toMatchObject({
                gubu: true,
                code: 'shape',
            });
            expect(e.desc()).toMatchObject({
                name: 'GubuError',
                code: 'shape',
                err: [
                    {
                        k: undefined,
                        n: { t: 'number' },
                        v: 'x',
                        p: '',
                        w: 'type',
                        m: 1050,
                        t: 'Validation failed for value "x" because the value is not of type number.',
                        u: {},
                    }
                ],
                ctx: {}
            });
        }
        let g1 = Gubu({ q: { a: String, b: Number } });
        let ctx1 = { err: [] };
        g1({ q: { a: 1, b: 'x' } }, ctx1);
        expect(ctx1).toMatchObject({
            err: [
                {
                    k: 'a',
                    n: { t: 'string' },
                    v: 1,
                    p: 'q.a',
                    w: 'type',
                    m: 1050,
                    t: 'Validation failed for property "q.a" with value "1" because the value is not of type string.',
                    u: {},
                },
                {
                    k: 'b',
                    n: { t: 'number' },
                    v: 'x',
                    p: 'q.b',
                    w: 'type',
                    m: 1050,
                    t: 'Validation failed for property "q.b" with value "x" because the value is not of type number.',
                    u: {},
                }
            ]
        });
        try {
            g1({ q: { a: 1, b: 'x' } });
        }
        catch (e) {
            expect(e.message).toEqual(`Validation failed for property "q.a" with value "1" because the value is not of type string.
Validation failed for property "q.b" with value "x" because the value is not of type number.`);
            expect(e).toMatchObject({
                gubu: true,
                code: 'shape',
            });
            expect(e.desc()).toMatchObject({
                name: 'GubuError',
                code: 'shape',
                err: [
                    {
                        k: 'a',
                        n: { t: 'string' },
                        v: 1,
                        p: 'q.a',
                        w: 'type',
                        m: 1050,
                        t: 'Validation failed for property "q.a" with value "1" because the value is not of type string.',
                        u: {},
                    },
                    {
                        k: 'b',
                        n: { t: 'number' },
                        v: 'x',
                        p: 'q.b',
                        w: 'type',
                        m: 1050,
                        t: 'Validation failed for property "q.b" with value "x" because the value is not of type number.',
                        u: {},
                    }
                ],
                ctx: {}
            });
        }
    });
    test('shapes-basic', () => {
        let tmp = {};
        expect(Gubu(String)('x')).toEqual('x');
        expect(Gubu(Number)(1)).toEqual(1);
        expect(Gubu(Boolean)(true)).toEqual(true);
        expect(Gubu(BigInt)(BigInt(1))).toEqual(BigInt(1));
        expect(Gubu(Object)({ x: 1 })).toEqual({ x: 1 });
        expect(Gubu(Array)([1])).toEqual([1]);
        expect(Gubu(Function)(tmp.f0 = () => true)).toEqual(tmp.f0);
        expect(Gubu(Symbol)(tmp.s0 = Symbol('foo'))).toEqual(tmp.s0);
        expect(Gubu(Error)(tmp.e0 = new Error())).toEqual(tmp.e0);
        expect(Gubu(Date)(tmp.d0 = new Date())).toEqual(tmp.d0);
        expect(Gubu(RegExp)(tmp.r0 = /a/)).toEqual(tmp.r0);
        expect(Gubu(Foo)(tmp.c0 = new Foo(2))).toEqual(tmp.c0);
        // console.log(gubu(new Date()).spec())
        expect(Gubu('a')('x')).toEqual('x');
        expect(Gubu(0)(1)).toEqual(1);
        expect(Gubu(false)(true)).toEqual(true);
        expect(Gubu(BigInt(-1))(BigInt(1))).toEqual(BigInt(1));
        expect(Gubu({})({ x: 1 })).toEqual({ x: 1 });
        expect(Gubu([])([1])).toEqual([1]);
        expect(Gubu(() => null)(tmp.f0 = () => false)).toEqual(tmp.f0);
        expect(Gubu(new Object())({ x: 1 })).toEqual({ x: 1 });
        expect(Gubu(new Array())([1])).toEqual([1]);
        // FIX: no way to tell this apart from `function anonymous() {}` ?
        // expect(Gubu(new Function())(tmp.nf0 = () => false)).toEqual(tmp.nf0)
        expect(Gubu(Symbol('bar'))(tmp.s0)).toEqual(tmp.s0);
        expect(Gubu(new Error('a'))(tmp.e1 = new Error('b'))).toEqual(tmp.e1);
        expect(Gubu(new Date())(tmp.d1 = new Date(Date.now() - 1111))).toEqual(tmp.d1);
        expect(Gubu(new RegExp('a'))(tmp.r1 = /b/)).toEqual(tmp.r1);
        expect(Gubu(new Foo(4))(tmp.c1 = new Foo(5))).toEqual(tmp.c1);
        expect(Gubu(new Bar(6))(tmp.c2 = new Bar(7))).toEqual(tmp.c2);
        expect(Gubu(G$({ v: () => null }))(tmp.f1 = () => false)).toEqual(tmp.f1);
        expect(Gubu(null)(null)).toEqual(null);
        expect(() => Gubu(null)(1)).toThrow('Validation failed for value "1" because the value is not of type null.');
        expect(Gubu(Check((_v, u) => (u.val = 1, true)))(null)).toEqual(1);
        expect(() => Gubu(String)(1)).toThrow(/not of type string/);
        expect(() => Gubu(Number)('x')).toThrow(/not of type number/);
        expect(() => Gubu(Boolean)('x')).toThrow(/not of type boolean/);
        expect(() => Gubu(BigInt)('x')).toThrow(/not of type bigint/);
        expect(() => Gubu(Object)('x')).toThrow(/not of type object/);
        expect(() => Gubu(Array)('x')).toThrow(/not of type array/);
        expect(() => Gubu(Function)('x')).toThrow(/not of type function/);
        expect(() => Gubu(Symbol)('x')).toThrow(/not of type symbol/);
        expect(() => Gubu(Error)('x')).toThrow(/not an instance of Error/);
        expect(() => Gubu(Date)(/a/)).toThrow(/not an instance of Date/);
        expect(() => Gubu(RegExp)(new Date()))
            .toThrow(/not an instance of RegExp/);
        expect(() => Gubu(Foo)(tmp.c3 = new Bar(8)))
            .toThrow(/not an instance of Foo/);
        expect(() => Gubu(Bar)(tmp.c4 = new Foo(9)))
            .toThrow(/not an instance of Bar/);
        expect(() => Gubu('a')(1)).toThrow(/not of type string/);
        expect(() => Gubu(0)('x')).toThrow(/not of type number/);
        expect(() => Gubu(false)('x')).toThrow(/not of type boolean/);
        expect(() => Gubu(BigInt(-1))('x')).toThrow(/not of type bigint/);
        expect(() => Gubu({})('x')).toThrow(/ not of type object/);
        expect(() => Gubu([])('x')).toThrow(/not of type array/);
        expect(() => Gubu(() => null)('x'))
            .toThrow(/not of type function/);
        expect(() => Gubu(Symbol('bar'))('x')).toThrow(/not of type symbol/);
        expect(() => Gubu(new Error('x'))('x')).toThrow(/not an instance of Error/);
        expect(() => Gubu(new Date())('x')).toThrow(/not an instance of Date/);
        expect(() => Gubu(new RegExp('a'))('x'))
            .toThrow(/not an instance of RegExp/);
        expect(() => Gubu(new Foo(4))('a')).toThrow(/not an instance of Foo/);
        expect(() => Gubu(new Bar(6))('a')).toThrow(/not an instance of Bar/);
        expect(() => Gubu(new Foo(10))(new Bar(11)))
            .toThrow(/not an instance of Foo/);
        expect(() => Gubu(new Bar(12))(new Foo(12)))
            .toThrow(/not an instance of Bar/);
        expect(() => Gubu(G$({ v: () => null }))('x'))
            .toThrow(/not of type function/);
        expect(Gubu({ a: String })({ a: 'x' })).toEqual({ a: 'x' });
        expect(Gubu({ a: Number })({ a: 1 })).toEqual({ a: 1 });
        expect(Gubu({ a: Boolean })({ a: true })).toEqual({ a: true });
        expect(Gubu({ a: Object })({ a: { x: 1 } })).toEqual({ a: { x: 1 } });
        expect(() => Gubu({ a: String })({ a: 1 }))
            .toThrow(/not of type string/);
        expect(() => Gubu({ a: Number })({ a: 'x' }))
            .toThrow(/not of type number/);
        expect(() => Gubu({ a: Boolean })({ a: 'x' }))
            .toThrow(/not of type boolean/);
        expect(() => Gubu({ a: Object })({ a: 'x' }))
            .toThrow(/not of type object/);
        expect(Gubu([String])(['x'])).toEqual(['x']);
        expect(Gubu([Number])([1])).toEqual([1]);
        expect(Gubu([Boolean])([true])).toEqual([true]);
        expect(Gubu([Object])([{ x: 1 }])).toEqual([{ x: 1 }]);
        expect(() => Gubu([String])([1]))
            .toThrow(/not of type string/);
        expect(() => Gubu([Number])(['x']))
            .toThrow(/not of type number/);
        expect(() => Gubu([Boolean])(['x']))
            .toThrow(/not of type boolean/);
        expect(() => Gubu([Object])([1]))
            .toThrow(/not of type object/);
    });
    test('shapes-fails', () => {
        let tmp = {};
        let string0 = Gubu(String);
        expect(string0('x')).toEqual('x');
        expect(string0('xy')).toEqual('xy');
        expect(() => string0('')).toThrow(/Validation failed for value "" because an empty string is not allowed./);
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
        let number0 = Gubu(Number);
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
        let object0 = Gubu(Object);
        expect(object0({})).toEqual({});
        expect(object0({ x: 1 })).toEqual({ x: 1 });
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
        let array0 = Gubu(Array);
        expect(array0([])).toEqual([]);
        expect(array0([11])).toEqual([11]);
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
    test('shapes-builtins', () => {
        let d0 = new Date(2121, 1, 1);
        let g0 = Gubu({ a: Date });
        expect(g0({ a: d0 })).toEqual({ a: d0 });
        expect(() => g0({})).toThrow('required');
        expect(() => g0({ a: Date })).toThrow('instance');
        expect(() => g0({ a: /QXQ/ })).toThrow(/QXQ.*instance/);
        let g1 = Gubu({ a: Skip(Date) });
        expect(g1({ a: d0 })).toEqual({ a: d0 });
        expect(g1({ a: undefined })).toEqual({ a: undefined });
        expect(g1({})).toEqual({});
        let r0 = /a/;
        let g2 = Gubu({ a: RegExp });
        expect(g2({ a: r0 })).toEqual({ a: r0 });
        expect(() => g2({})).toThrow('required');
        expect(() => g2({ a: RegExp })).toThrow('instance');
        expect(() => g2({ a: d0 })).toThrow(/2121.*instance/);
        let g3 = Gubu({ a: Skip(RegExp) });
        expect(g3({ a: r0 })).toEqual({ a: r0 });
        expect(g3({})).toEqual({});
    });
    test('object-basic', () => {
        let g1 = Gubu({ x: 1 });
        expect(g1()).toEqual({ x: 1 });
        expect(g1({})).toEqual({ x: 1 });
        expect(g1({ x: 11 })).toEqual({ x: 11 });
        expect(() => g1({ x: 11, y: 22 })).toThrow('Validation failed for object "{x:11,y:22}" because the property "y" is not allowed.');
        expect(() => g1({ x: 11, y: 22, z: 33 })).toThrow('Validation failed for object "{x:11,y:22,z:33}" because the properties "y, z" are not allowed.');
        let g2 = Gubu({ x: 1, y: 2 });
        expect(g2()).toEqual({ x: 1, y: 2 });
        expect(g2({})).toEqual({ x: 1, y: 2 });
        expect(g2({ x: 11 })).toEqual({ x: 11, y: 2 });
        expect(g2({ x: 11, y: 22 })).toEqual({ x: 11, y: 22 });
        expect(() => g2({ x: 11, y: 22, z: 33 })).toThrow('Validation failed for object "{x:11,y:22,z:33}" because the property "z" is not allowed.');
        let g3 = Gubu({ x: 1, y: 2, z: 3 });
        expect(g3()).toEqual({ x: 1, y: 2, z: 3 });
        expect(g3({})).toEqual({ x: 1, y: 2, z: 3 });
        expect(g3({ x: 11 })).toEqual({ x: 11, y: 2, z: 3 });
        expect(g3({ x: 11, y: 22 })).toEqual({ x: 11, y: 22, z: 3 });
        expect(g3({ x: 11, y: 22, z: 33 })).toEqual({ x: 11, y: 22, z: 33 });
        expect(() => g3({ x: 11, y: 22, z: 33, k: 44 })).toThrow('Validation failed for object "{x:11,y:22,z:33,k:44}" because the property "k" is not allowed.');
        let g1o = Gubu(Open({ x: 1 }));
        expect(g1o()).toEqual({ x: 1 });
        expect(g1o({})).toEqual({ x: 1 });
        expect(g1o({ x: 11 })).toEqual({ x: 11 });
        expect(g1o({ x: 11, y: 22 })).toEqual({ x: 11, y: 22 });
        expect(g1o({ x: 11, y: 22, z: 33 })).toEqual({ x: 11, y: 22, z: 33 });
        let g2o = Gubu(Open({ x: 1, y: 2 }));
        expect(g2o()).toEqual({ x: 1, y: 2 });
        expect(g2o({})).toEqual({ x: 1, y: 2 });
        expect(g2o({ x: 11 })).toEqual({ x: 11, y: 2 });
        expect(g2o({ x: 11, y: 22 })).toEqual({ x: 11, y: 22 });
        expect(g2o({ x: 11, y: 22, z: 33 })).toEqual({ x: 11, y: 22, z: 33 });
        let g3o = Gubu(Open({ x: 1, y: 2, z: 3 }));
        expect(g3o()).toEqual({ x: 1, y: 2, z: 3 });
        expect(g3o({})).toEqual({ x: 1, y: 2, z: 3 });
        expect(g3o({ x: 11 })).toEqual({ x: 11, y: 2, z: 3 });
        expect(g3o({ x: 11, y: 22 })).toEqual({ x: 11, y: 22, z: 3 });
        expect(g3o({ x: 11, y: 22, z: 33 })).toEqual({ x: 11, y: 22, z: 33 });
        expect(g3o({ x: 11, y: 22, z: 33, k: 44 }))
            .toEqual({ x: 11, y: 22, z: 33, k: 44 });
        let g1v = Gubu(Value(Number, { x: 1 }));
        expect(g1v()).toEqual({ x: 1 });
        expect(g1v({})).toEqual({ x: 1 });
        expect(g1v({ x: 11 })).toEqual({ x: 11 });
        expect(g1v({ x: 11, y: 22 })).toEqual({ x: 11, y: 22 });
        expect(g1v({ x: 11, y: 22, z: 33 })).toEqual({ x: 11, y: 22, z: 33 });
        expect(() => g1v({ x: 11, y: true })).toThrow('Validation failed for property "y" with value "true" because the value is not of type number.');
        let g2v = Gubu(Value(Number, { x: 1, y: 2 }));
        expect(g2v()).toEqual({ x: 1, y: 2 });
        expect(g2v({})).toEqual({ x: 1, y: 2 });
        expect(g2v({ x: 11 })).toEqual({ x: 11, y: 2 });
        expect(g2v({ x: 11, y: 22 })).toEqual({ x: 11, y: 22 });
        expect(g2v({ x: 11, y: 22, z: 33 })).toEqual({ x: 11, y: 22, z: 33 });
        expect(() => g2v({ x: 11, y: 22, z: true })).toThrow('Validation failed for property "z" with value "true" because the value is not of type number.');
        let g3v = Gubu(Value(Number, { x: 1, y: 2, z: 3 }));
        expect(g3v()).toEqual({ x: 1, y: 2, z: 3 });
        expect(g3v({})).toEqual({ x: 1, y: 2, z: 3 });
        expect(g3v({ x: 11 })).toEqual({ x: 11, y: 2, z: 3 });
        expect(g3v({ x: 11, y: 22 })).toEqual({ x: 11, y: 22, z: 3 });
        expect(g3v({ x: 11, y: 22, z: 33 })).toEqual({ x: 11, y: 22, z: 33 });
        expect(g3v({ x: 11, y: 22, z: 33, k: 44 }))
            .toEqual({ x: 11, y: 22, z: 33, k: 44 });
        expect(() => g3v({ x: 11, y: 22, z: 33, k: true })).toThrow('Validation failed for property "k" with value "true" because the value is not of type number.');
        // Empty object is Open
        let g4 = Gubu({});
        expect(g4()).toEqual({});
        expect(g4({})).toEqual({});
        expect(g4({ x: 1 })).toEqual({ x: 1 });
        expect(g4({ x: 1, y: 'a' })).toEqual({ x: 1, y: 'a' });
        let g5 = Gubu({ k: {} });
        expect(g5()).toEqual({ k: {} });
        expect(g5({})).toEqual({ k: {} });
        expect(g5({ k: {} })).toEqual({ k: {} });
        expect(g5({ k: { n: true } })).toEqual({ k: { n: true } });
        expect(g5({ k: { n: true, m: NaN } })).toEqual({ k: { n: true, m: NaN } });
        expect(() => g5({ x: 1 })).toThrow('not allowed');
        expect(() => Gubu({ x: 1 })('q')).toThrow(/type object/);
        expect(() => Gubu({ y: { x: 1 } })({ y: 'q' })).toThrow(/type object/);
    });
    test('required-cover', () => {
        const v0 = Gubu(Required(Any()));
        expect(v0(1)).toEqual(1);
        expect(() => v0()).toThrow('required');
        const o0 = Gubu({ a: Required(Any()) });
        expect(o0({ a: 1 })).toEqual({ a: 1 });
        expect(() => o0({})).toThrow('required');
        const a0 = Gubu([Required(Any())]);
        expect(a0([])).toEqual([]); // empty array is allowed
        expect(a0([1])).toEqual([1]);
        expect(a0([1, 2])).toEqual([1, 2]);
        expect(a0([1, 2, 3])).toEqual([1, 2, 3]);
    });
    test('shapes-edges', () => {
        // NaN is actually Not-a-Number (whereas 'number' === typeof(NaN))
        const num0 = Gubu(1);
        expect(num0(1)).toEqual(1);
        expect(() => num0(NaN)).toThrow(/not of type number/);
        const nan0 = Gubu(NaN);
        expect(nan0(NaN)).toEqual(NaN);
        expect(() => nan0(1)).toThrow(/not of type nan/);
        // Empty strings only allowed by Empty() builder.
        const rs0 = Gubu(String);
        expect(rs0('x')).toEqual('x');
        expect(() => rs0('')).toThrow('Validation failed for value "" because an empty string is not allowed.');
        const rs0e = Gubu(Empty(String));
        expect(rs0e('x')).toEqual('x');
        expect(rs0e('')).toEqual('');
        expect(() => rs0e()).toThrow('required');
        expect(() => rs0e(undefined)).toThrow('required');
        const os0 = Gubu('x');
        expect(() => os0('')).toThrow('empty string is not allowed');
        expect(os0()).toEqual('x');
        expect(os0(undefined)).toEqual('x');
        expect(os0('x')).toEqual('x');
        expect(os0('y')).toEqual('y');
        const os0e = Gubu(Empty('x'));
        expect(os0e('')).toEqual('');
        expect(os0e()).toEqual('x');
        expect(os0e(undefined)).toEqual('x');
        expect(os0e('x')).toEqual('x');
        expect(os0e('y')).toEqual('y');
        const os0e2 = Gubu(Empty(''));
        expect(os0e2('')).toEqual('');
        expect(os0e2()).toEqual('');
        expect(os0e2(undefined)).toEqual('');
        expect(os0e2('x')).toEqual('x');
        expect(os0e2('y')).toEqual('y');
        // Use literal '' as a shortcut
        const os0e3 = Gubu('');
        expect(os0e3('')).toEqual('');
        expect(os0e3()).toEqual('');
        expect(os0e3(undefined)).toEqual('');
        expect(os0e3('x')).toEqual('x');
        expect(os0e3('y')).toEqual('y');
        const os1e = Gubu(Skip(Empty(String)));
        expect(os1e()).toEqual(undefined);
        expect(os1e('')).toEqual('');
        expect(os1e('x')).toEqual('x');
        const os2e = Gubu(Skip(String).Empty());
        expect(os2e()).toEqual(undefined);
        expect(os2e('')).toEqual('');
        expect(os2e('x')).toEqual('x');
        const os1eO = Gubu({ a: Skip(Empty(String)) });
        expect(os1eO({})).toEqual({});
        expect(os1eO({ a: '' })).toEqual({ a: '' });
        expect(os1eO({ a: 'x' })).toEqual({ a: 'x' });
        // Long values are truncated in error descriptions.
        expect(() => Gubu(Number)('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')).toThrow('Validation failed for value "aaaaaaaaaaaaaaaaaaaaaaaaaaa..." because the value is not of type number.');
        // Explicit `undefined` and `null`
        const u0 = Gubu({ a: undefined });
        expect(u0({ a: undefined })).toEqual({ a: undefined });
        expect(u0({})).toEqual({ a: undefined });
        const u0n = Gubu({ a: null });
        expect(u0n({ a: null })).toEqual({ a: null });
        expect(u0n({})).toEqual({ a: null });
        expect(() => u0n({ a: 1 })).toThrow('type');
        const u1 = Gubu({ a: Required(undefined) });
        expect(u1({ a: undefined })).toEqual({ a: undefined });
        expect(() => u1({})).toThrow('required');
        const u1n = Gubu({ a: Required(null) });
        expect(u1n({ a: null })).toEqual({ a: null });
        expect(() => u1n({})).toThrow('required');
        expect(() => u1n({ a: 1 })).toThrow('type');
        const u2 = Gubu({ a: Required(NaN) });
        expect(u2({ a: NaN })).toEqual({ a: NaN });
        expect(() => u2({})).toThrow('required');
        // Required does inject undefined
        let r0 = Gubu({ a: Boolean, b: Required({ x: Number }), c: Required([]) });
        let o0 = {};
        expect(() => r0(o0)).toThrow('required');
        expect(o0).toEqual({});
        expect(o0.hasOwnProperty('a')).toBeFalsy();
        expect(o0.hasOwnProperty('b')).toBeFalsy();
        expect(o0.hasOwnProperty('c')).toBeFalsy();
    });
    test('api-object', () => {
        // This is an allowed way to get shape builders
        const { Required } = Gubu;
        let obj01 = Gubu({
            a: { x: 1 },
            b: Skip({ y: 2 }),
            c: Skip({ z: Skip({ k: 3 }) }),
        });
        expect(obj01()).toEqual({ a: { x: 1 } });
        expect(obj01({})).toEqual({ a: { x: 1 } });
        expect(obj01({ b: {} })).toEqual({ a: { x: 1 }, b: { y: 2 } });
        expect(obj01({ c: {} })).toEqual({ a: { x: 1 }, c: {} });
        expect(obj01({ c: { z: {} } })).toEqual({ a: { x: 1 }, c: { z: { k: 3 } } });
        let obj11 = Gubu({
            people: Required({}).Value({ name: String, age: Number })
        });
        expect(obj11({
            people: {
                alice: { name: 'Alice', age: 99 },
                bob: { name: 'Bob', age: 98 },
            }
        })).toEqual({
            people: {
                alice: { name: 'Alice', age: 99 },
                bob: { name: 'Bob', age: 98 },
            }
        });
        expect(() => obj11({
            people: {
                alice: { name: 'Alice', age: 99 },
                bob: { name: 'Bob' }
            }
        })).toThrow('Validation failed for property "people.bob.age" with value "" because the value is required.');
        expect(() => obj11({})).toThrow('Validation failed for property "people" with value "" because the value is required.');
        let shape = Gubu({
            foo: Number,
            bar: Required({
                zed: Boolean
            })
        });
        // This passes, returning the value unchanged.
        shape({ foo: 1, bar: { zed: false } });
        // These fail, throwing an Error.
        expect(() => shape({ bar: { zed: false } })).toThrow('required'); // foo is required
        expect(() => shape({ foo: 'abc', bar: { zed: false } })).toThrow('number'); // foo is not a number
        expect(() => shape({ foo: 1 })).toThrow('required'); // bar is required
        expect(() => shape({ foo: 1, bar: {} })).toThrow('required'); // bar.zed is required
        expect(() => shape({ foo: 1, bar: { zed: false, baz: 2 }, qaz: 3 })).toThrow('not allowed'); // new properties are not allowed
        let strictShape = Gubu({ a: { b: String } });
        // Passes
        expect(strictShape({ a: { b: 'ABC' } })).toEqual({ a: { b: 'ABC' } });
        // Fails, even though a is not required, because a.b is required.
        expect(() => strictShape({})).toThrow('Validation failed for property "a.b" with value "" because the value is required.');
        let easyShape = Gubu({ a: Skip({ b: String }) });
        // Now both pass
        expect(easyShape({ a: { b: 'ABC' } })).toEqual({ a: { b: 'ABC' } });
        expect(easyShape({})).toEqual({});
        // This still fails, as `a` is now defined, and needs `b`
        expect(() => easyShape({ a: {} })).toThrow('Validation failed for property "a.b" with value "" because the value is required.');
        const { Open } = Gubu;
        shape = Gubu(Open({
            a: 1
        }));
        expect(shape({ a: 11, b: 22 })).toEqual({ a: 11, b: 22 });
        expect(shape({ b: 22, c: 'foo' })).toEqual({ a: 1, b: 22, c: 'foo' });
        expect(() => shape({ a: 'foo' })).toThrow('type');
        shape = Gubu(Open({
            a: Open({
                b: 1
            })
        }));
        expect(shape({ a: { b: 11, c: 22 }, d: 33 }))
            .toEqual({ a: { b: 11, c: 22 }, d: 33 });
        const { Value } = Gubu;
        shape = Gubu(Value(String, {
            a: 123,
        }));
        // All non-explicit properties must be a String
        expect(shape({ a: 11, b: 'abc' })).toEqual({ a: 11, b: 'abc' }); // b is a string
        expect(shape({ c: 'foo', d: 'bar' })).toEqual({ a: 123, c: 'foo', d: 'bar' }); // c and d are strings
        // These fail
        expect(() => shape({ a: 'abc' })).toThrow('number'); // a must be a number
        expect(() => shape({ b: { x: 1 } })).toThrow('string'); // b must be a string
    });
    test('api-array', () => {
        let g1 = Gubu([Number]);
        expect(g1()).toEqual([]);
        expect(g1([])).toEqual([]);
        expect(g1([1])).toEqual([1]);
        expect(g1([1, 2])).toEqual([1, 2]);
        expect(g1([1, 2, 3])).toEqual([1, 2, 3]);
        expect(g1([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
        expect(() => g1([1, 2, 'x'])).toThrow('type');
        let g2 = Gubu([{ x: 1 }]);
        expect(g2()).toEqual([]);
        expect(g2([])).toEqual([]);
        expect(g2([{ x: 123 }])).toEqual([{ x: 123 }]);
        expect(g2([{ x: 123 }, { x: 456 }])).toEqual([{ x: 123 }, { x: 456 }]);
        expect(g2([{}])).toEqual([{ x: 1 }]);
        expect(g2([{ x: 123 }, {}])).toEqual([{ x: 123 }, { x: 1 }]);
        expect(() => g2([{ x: 123, y: 'a' }, { x: 456 }]))
            .toThrow('not allowed');
        expect(() => g2([{ x: 123 }, { x: 456, y: 'a' }]))
            .toThrow('not allowed');
        expect(() => g2([{ x: 'a' }])).toThrow('type');
        expect(() => g2([{ x: 1 }, { x: 'a' }])).toThrow('type');
        let gc1 = Gubu(Closed([Number, String, Boolean]));
        expect(gc1([123, 'abc', true])).toEqual([123, 'abc', true]);
        expect(() => gc1(['bad'])).toThrow('type');
        expect(() => gc1([123])).toThrow('required');
        expect(() => gc1([123, 'abc', true, 'extra'])).toThrow('not allowed');
        let gc2 = Gubu(Closed([1, 'a', true]));
        expect(gc2()).toEqual([1, 'a', true]);
        expect(gc2([])).toEqual([1, 'a', true]);
        expect(gc2([2])).toEqual([2, 'a', true]);
        expect(gc2([2, 'b'])).toEqual([2, 'b', true]);
        expect(gc2([2, 'b', false])).toEqual([2, 'b', false]);
        expect(gc2([2, undefined, false])).toEqual([2, 'a', false]);
        expect(gc2([2, , false])).toEqual([2, 'a', false]);
        expect(() => gc2([2, 'b', false, 'bad'])).toThrow('not allowed');
        // 2 or more elements, so considered Closed
        let gc3 = Gubu([{ x: 1 }, Required({ y: true })]);
        expect(gc3([{ x: 2 }, { y: false }])).toEqual([{ x: 2 }, { y: false }]);
        expect(gc3([undefined, { y: false }])).toEqual([{ x: 1 }, { y: false }]);
        expect(gc3([{ x: 2 }, {}])).toEqual([{ x: 2 }, { y: true }]);
        expect(() => gc3([{ x: 2 }, undefined])).toThrow('required');
        expect(() => gc3([{ x: 2 }])).toThrow('required');
        let gc4 = Gubu({ a: Closed([{ x: 1 }, { y: { z: /a/ } }]) });
        expect(gc4()).toEqual({ 'a': [{ 'x': 1 }, { 'y': { 'z': /a/ } }] });
        expect(gc4({})).toEqual({ 'a': [{ 'x': 1 }, { 'y': { 'z': /a/ } }] });
        expect(gc4({ a: undefined }))
            .toEqual({ 'a': [{ 'x': 1 }, { 'y': { 'z': /a/ } }] });
        expect(gc4({ a: [] })).toEqual({ 'a': [{ 'x': 1 }, { 'y': { 'z': /a/ } }] });
        expect(() => gc4({ a: {} })).toThrow('Validation failed for property "a" with object "{}" because the object is not of type array.');
    });
    test('api-length', () => {
        let g1 = Gubu(Max(2, []));
        expect(g1([1])).toEqual([1]);
        expect(g1(['a', true])).toEqual(['a', true]);
        expect(() => g1([1, 2, 3])).toThrow('maximum length of 2');
        let g2 = Gubu(Min(2, [Number]));
        expect(g2([11, 22])).toEqual([11, 22]);
        expect(g2([11, 22, 33])).toEqual([11, 22, 33]);
        expect(() => g2([11])).toThrow('minimum');
        expect(() => g2([])).toThrow('minimum');
        let g3 = Gubu(Max(2, String));
        expect(g3('a')).toEqual('a');
        expect(g3('ab')).toEqual('ab');
        expect(() => g3('abc')).toThrow('maximum');
        let g4 = Gubu(Max(2, {}));
        expect(g4({ a: 1 })).toEqual({ a: 1 });
        expect(g4({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
        expect(() => g4({ a: 1, b: 2, c: 3 })).toThrow('maximum');
    });
    test('api-functions', () => {
        let f0 = () => true;
        let f1 = () => false;
        let { G$ } = Gubu;
        let shape = Gubu({ fn: G$({ v: f0 }) });
        expect(shape({})).toEqual({ fn: f0 });
        expect(shape({ fn: f1 })).toEqual({ fn: f1 });
        let tmp = {};
        shape = Gubu({
            fn: tmp.d0 = () => true
        });
        expect(shape({ fn: tmp.f0 = () => false })).toEqual({ fn: tmp.f0 });
        expect(shape({})).toEqual({ fn: tmp.d0 });
    });
    test('api-custom', () => {
        let shape = Gubu({ a: Check((v) => 10 < v) });
        expect(shape({ a: 11 })).toEqual({ a: 11 }); // passes, as 10 < 11 is true
        expect(() => shape({ a: 9 })).toThrow('Validation failed for property "a" with value "9" because check "(v) => 10 < v" failed.'); // fails, as 10 < 9 is false
        shape = Gubu({
            a: Check((value, update) => {
                update.val = value * 2;
                return true; // Remember to return true to indicate value is valid!
            })
        });
        expect(shape({ a: 3 })).toEqual({ a: 6 });
        shape = Gubu({
            a: Check((value, update) => {
                update.err = 'BAD VALUE $VALUE AT $PATH';
                return false; // always fails
            })
        });
        expect(() => shape({ a: 3 })).toThrow("BAD VALUE 3 AT a");
        shape = Gubu({
            a: Check((value, update, state) => {
                update.val = value + ` KEY=${state.key}`;
                return true;
            })
        });
        expect(shape({ a: 3 })).toEqual({ a: '3 KEY=a' }); // returns { a: '3 KEY=a'}
    });
    test('api-builders-chain-compose', () => {
        let cr0s = Gubu(Closed(Required({ x: 1 })), { name: 'cr0' });
        let cr1s = Gubu(Required(Closed({ x: 1 })), { name: 'cr1' });
        let cr2s = Gubu(Closed({ x: 1 }).Required(), { name: 'cr2' });
        let cr3s = Gubu(Required({ x: 1 }).Closed(), { name: 'cr3' });
        let s0 = {
            '$': { 'gubu$': true, 'v$': package_json_1.default.version },
            t: 'object',
            v: {
                x: {
                    '$': { 'gubu$': true, 'v$': package_json_1.default.version },
                    t: 'number',
                    v: 1,
                    n: 0,
                    r: false,
                    p: false,
                    d: 1,
                    u: {},
                    a: [],
                    b: []
                }
            },
            n: 1,
            r: true,
            p: false,
            d: 0,
            u: {},
            a: [],
            b: [],
        };
        expect(cr0s.spec()).toEqual(s0);
        expect(cr1s.spec()).toEqual(s0);
        expect(cr2s.spec()).toEqual(s0);
        expect(cr3s.spec()).toEqual(s0);
        expect(cr0s({ x: 11 })).toEqual({ x: 11 });
        expect(cr1s({ x: 11 })).toEqual({ x: 11 });
        expect(cr2s({ x: 11 })).toEqual({ x: 11 });
        expect(cr3s({ x: 11 })).toEqual({ x: 11 });
        expect(() => cr0s({ x: 11, y: 2 })).toThrow('property "y" is not allowed.');
        expect(() => cr1s({ x: 11, y: 2 })).toThrow('property "y" is not allowed.');
        expect(() => cr2s({ x: 11, y: 2 })).toThrow('property "y" is not allowed.');
        expect(() => cr3s({ x: 11, y: 2 })).toThrow('property "y" is not allowed.');
        expect(cr0s({})).toEqual({ x: 1 });
        expect(cr1s({})).toEqual({ x: 1 });
        expect(cr2s({})).toEqual({ x: 1 });
        expect(cr3s({})).toEqual({ x: 1 });
    });
    test('api-builders-index', () => {
        let shape_AboveB0 = Gubu(Above(10));
        expect(shape_AboveB0(11)).toEqual(11);
        expect(() => shape_AboveB0(10)).toThrow('Value "10" for property "" must be above 10 (was 10).');
        expect(() => shape_AboveB0(true)).toThrow('Value "true" for property "" must have length above 10 (was NaN).');
        let shape_AboveB1 = Gubu(Above(2));
        expect(shape_AboveB1('abc')).toEqual('abc');
        expect(() => shape_AboveB1('ab')).toThrow('Value "ab" for property "" must have length above 2 (was 2).');
        expect(shape_AboveB1([1, 2, 3])).toEqual([1, 2, 3]);
        expect(() => shape_AboveB1([1, 2])).toThrow('Value "[1,2]" for property "" must have length above 2 (was 2).');
        let shape_AboveB2 = Gubu(Above(2, Number));
        expect(shape_AboveB2(3)).toEqual(3);
        expect(() => shape_AboveB2([1, 2, 3])).toThrow('Validation failed for array "[1,2,3]" because the array is not of type number.');
        let shape_AboveB3 = Gubu(Skip(Above(2, Number)));
        expect(shape_AboveB3(3)).toEqual(3);
        expect(shape_AboveB3()).toEqual(undefined);
        let shape_AfterB0 = Gubu(After((v) => v > 10, 15));
        expect(shape_AfterB0(11)).toEqual(11);
        expect(() => shape_AfterB0(10)).toThrow('Validation failed for value "10" because check "(v) => v > 10" failed.');
        expect(() => shape_AfterB0('x')).toThrow(`Validation failed for value "x" because the value is not of type number.
Validation failed for value "x" because check "(v) => v > 10" failed.`);
        expect(shape_AfterB0()).toEqual(15);
        let shape_AfterB1 = Gubu(Skip(Number).After((v) => 0 === v % 2));
        expect(shape_AfterB1(2)).toEqual(2);
        expect(() => shape_AfterB1(3)).toThrow('Validation failed for value "3" because check "(v) => 0 === v % 2" failed.');
        expect(() => shape_AfterB1('x')).toThrow('Validation failed for value "x" because check "(v) => 0 === v % 2" failed.');
        expect(shape_AfterB1()).toEqual(undefined);
        let shape_AfterB2 = Gubu(After((v) => 0 === v.x % 2, Required({ x: Number })));
        expect(shape_AfterB2({ x: 2 })).toEqual({ x: 2 });
        expect(() => shape_AfterB2({ x: 3 })).toThrow('Validation failed for object "{x:3}" because check "(v) => 0 === v.x % 2" failed.');
        expect(() => shape_AfterB2({})).toThrow(`Validation failed for object "{}" because check "(v) => 0 === v.x % 2" failed.
Validation failed for property "x" with value "" because the value is required.`);
        expect(() => shape_AfterB2()).toThrow(`Validation failed for value "" because the value is required.
Validation failed for value "" because check "(v) => 0 === v.x % 2" failed (threw: Cannot read prop`);
        // TODO: modify value
        let shape_AllB0 = Gubu(All(Number, Check((v) => v > 10)));
        expect(shape_AllB0(11)).toEqual(11);
        expect(() => shape_AllB0(10)).toThrow(`Value "10" for property "" does not satisfy all of: Number, (v) => v > 10`);
        let shape_AllB1 = Gubu(All());
        expect(shape_AllB1(123)).toEqual(123);
        expect(() => shape_AllB1()).toThrow('required');
        let shape_AllB2 = Gubu({ a: Skip(All({ b: String }, Max(2))) });
        expect(shape_AllB2({ a: { b: 'X' } })).toEqual({ a: { b: 'X' } });
        expect(shape_AllB2({})).toEqual({});
        let shape_AnyB0 = Gubu(Any());
        expect(shape_AnyB0(11)).toEqual(11);
        expect(shape_AnyB0(10)).toEqual(10);
        expect(shape_AnyB0()).toEqual(undefined);
        expect(shape_AnyB0(null)).toEqual(null);
        expect(shape_AnyB0(NaN)).toEqual(NaN);
        expect(shape_AnyB0({})).toEqual({});
        expect(shape_AnyB0([])).toEqual([]);
        let shape_AnyB1 = Gubu(Any({ x: 1 }));
        expect(shape_AnyB1()).toEqual({ x: 1 });
        let shape_BeforeB0 = Gubu(Before((v) => v > 10, 10));
        expect(shape_BeforeB0(11)).toEqual(11);
        expect(() => shape_BeforeB0(10)).toThrow('Validation failed for value "10" because check "(v) => v > 10" failed.');
        // TODO: modify value
        let shape_BelowB0 = Gubu(Below(10));
        expect(shape_BelowB0(9)).toEqual(9);
        expect(() => shape_BelowB0(10)).toThrow('Value "10" for property "" must be below 10 (was 10).');
        let shape_ClosedB0 = Gubu(Closed({ a: 11 }));
        expect(shape_ClosedB0({ a: 10 })).toEqual({ a: 10 });
        expect(() => shape_ClosedB0({ a: 10, b: 11 })).toThrow('Validation failed for object "{a:10,b:11}" because the property "b" is not allowed.');
        let shape_DefineB0 = Gubu({ a: Define('foo', 11), b: Refer('foo') });
        expect(shape_DefineB0({ a: 10, b: 12 })).toEqual({ a: 10, b: 12 });
        expect(() => shape_DefineB0({ a: 'A', b: 'B' })).toThrow(`Validation failed for property "a" with value "A" because the value is not of type number.
Validation failed for property "b" with value "B" because the value is not of type number.`);
        let shape_EmptyB0 = Gubu({ a: Empty(String), b: String });
        expect(shape_EmptyB0({ a: '', b: 'ABC' })).toEqual({ a: '', b: 'ABC' });
        expect(() => shape_EmptyB0({ a: '', b: '' })).toThrow('Validation failed for property "b" with value "" because an empty string is not allowed.');
        let shape_ExactB0 = Gubu(Exact(11, 12, true));
        expect(shape_ExactB0(11)).toEqual(11);
        expect(shape_ExactB0(12)).toEqual(12);
        expect(shape_ExactB0(true)).toEqual(true);
        expect(() => shape_ExactB0(10)).toThrow('Value "10" for property "" must be exactly one of: 11, 12, true.');
        expect(() => shape_ExactB0(false)).toThrow('Value "false" for property "" must be exactly one of: 11, 12, true.');
        let shape_MaxB0 = Gubu(Max(11));
        expect(shape_MaxB0(11)).toEqual(11);
        expect(shape_MaxB0(10)).toEqual(10);
        expect(() => shape_MaxB0(12)).toThrow('Value "12" for property "" must be a maximum of 11 (was 12).');
        let shape_MinB0 = Gubu(Min(11));
        expect(shape_MinB0(11)).toEqual(11);
        expect(shape_MinB0(12)).toEqual(12);
        expect(() => shape_MinB0(10)).toThrow('Value "10" for property "" must be a minimum of 11 (was 10).');
        let shape_NeverB0 = Gubu(Never());
        expect(() => shape_NeverB0(10)).toThrow('Validation failed for value "10" because no value is allowed.');
        expect(() => shape_NeverB0(true)).toThrow('Validation failed for value "true" because no value is allowed.');
        let shape_OneB0 = Gubu(One(Exact(10), Exact(11), Exact(true)));
        expect(shape_OneB0(10)).toEqual(10);
        expect(shape_OneB0(11)).toEqual(11);
        expect(shape_OneB0(true)).toEqual(true);
        expect(() => shape_OneB0(12)).toThrow('Value "12" for property "" does not satisfy one of: 10, 11, true');
        expect(() => shape_OneB0(false)).toThrow('Value "false" for property "" does not satisfy one of: 10, 11, true');
        expect(() => shape_OneB0(null)).toThrow('Value "null" for property "" does not satisfy one of: 10, 11, true');
        expect(() => shape_OneB0(NaN)).toThrow('Value "NaN" for property "" does not satisfy one of: 10, 11, true');
        expect(() => shape_OneB0(undefined)).toThrow('Value "" for property "" does not satisfy one of: 10, 11, true');
        expect(() => shape_OneB0()).toThrow('Value "" for property "" does not satisfy one of: 10, 11, true');
        let shape_OneB1 = Gubu(One(Number, String));
        expect(shape_OneB1(123)).toEqual(123);
        expect(shape_OneB1('abc')).toEqual('abc');
        expect(() => shape_OneB1(true)).toThrow('Value "true" for property "" does not satisfy one of: Number, String');
        // TODO: more complex objects
        let shape_SkipB0 = Gubu({ a: Skip(11) });
        expect(shape_SkipB0({ a: 10 })).toEqual({ a: 10 });
        expect(shape_SkipB0({ a: undefined })).toEqual({ a: undefined });
        expect(shape_SkipB0({})).toEqual({});
        expect(() => shape_SkipB0({ a: null })).toThrow('type');
        expect(() => shape_SkipB0({ a: true })).toThrow('type');
        let shape_ReferB0 = Gubu({ a: Define('foo', 11), b: Refer('foo') });
        expect(shape_ReferB0({ a: 10, b: 12 })).toEqual({ a: 10, b: 12 });
        expect(shape_ReferB0({ a: 10 })).toEqual({ a: 10, b: undefined });
        expect(shape_ReferB0({})).toEqual({ a: 11, b: undefined });
        expect(shape_ReferB0({ b: 12 })).toEqual({ a: 11, b: 12 });
        expect(() => shape_ReferB0({ a: 'A', b: 'B' })).toThrow(`Validation failed for property "a" with value "A" because the value is not of type number.
Validation failed for property "b" with value "B" because the value is not of type number.`);
        let shape_ReferB1 = Gubu({ a: Define('foo', 11), b: Refer({ name: 'foo', fill: true }) });
        expect(shape_ReferB1({ a: 10, b: 12 })).toEqual({ a: 10, b: 12 });
        expect(shape_ReferB1({ a: 10 })).toEqual({ a: 10, b: 11 });
        expect(shape_ReferB1({})).toEqual({ a: 11, b: 11 });
        expect(shape_ReferB1({ b: 12 })).toEqual({ a: 11, b: 12 });
        expect(() => shape_ReferB1({ a: 'A', b: 'B' })).toThrow(`Validation failed for property "a" with value "A" because the value is not of type number.
Validation failed for property "b" with value "B" because the value is not of type number.`);
        // TODO: also recursive
        let shape_RenameB0 = Gubu({ a: Rename('b', Number) });
        expect(shape_RenameB0({ a: 10 })).toEqual({ b: 10 });
        expect(() => shape_RenameB0({})).toThrow('Validation failed for property "a" with value "" because the value is required.');
        let shape_RenameB1 = Gubu({ a: Rename({ name: 'b', keep: true }, 123) });
        expect(shape_RenameB1({ a: 10 })).toEqual({ a: 10, b: 10 });
        expect(shape_RenameB1({})).toEqual({ a: 123, b: 123 });
        let shape_RequiredB0 = Gubu(Required(11));
        expect(shape_RequiredB0(11)).toEqual(11);
        expect(() => shape_RequiredB0()).toThrow('Validation failed for value "" because the value is required.');
        // TODO: update docs - need better example where one prop differentiates
        let shape_SomeB0 = Gubu(Some({ x: 1 }, { y: 2 }));
        expect(shape_SomeB0({ x: 1 })).toEqual({ x: 1 });
        expect(shape_SomeB0({ y: 2 })).toEqual({ y: 2 });
        expect(() => shape_SomeB0({ x: 11, y: 22 })).toThrow('Value "{x:11,y:22}" for property "" does not satisfy any of: {"x":1}, {"y":2}');
        expect(() => shape_SomeB0({ x: true, y: 2 })).toThrow('any of');
        expect(() => shape_SomeB0({ x: 1, y: true })).toThrow('any of');
        expect(() => shape_SomeB0({ x: true, y: true })).toThrow(`Value "{x:true,y:true}" for property "" does not satisfy any of: {"x":1}, {"y":2}`);
        // TODO: more complex objects
        let shape_ValueB0 = Gubu(Value(Number, {}));
        expect(shape_ValueB0({ x: 10 })).toEqual({ x: 10 });
        expect(shape_ValueB0({ x: 10, y: 11 })).toEqual({ x: 10, y: 11 });
        expect(() => shape_ValueB0({ x: true })).toThrow('Validation failed for property "x" with value "true" because the value is not of type number.');
        let shape_ValueB1 = Gubu({
            page: Value({
                title: String,
                template: 'standard'
            }, {
                home: {
                    title: 'Home',
                    template: 'home'
                },
                sitemap: {
                    title: 'Site Map',
                    template: 'sitemap'
                },
            })
        });
        expect(shape_ValueB1({
            page: {
                about: {
                    title: 'About'
                },
                contact: {
                    title: 'Contact'
                }
            }
        })).toEqual({
            page: {
                about: {
                    template: 'standard',
                    title: 'About',
                },
                contact: {
                    template: 'standard',
                    title: 'Contact',
                },
                home: {
                    template: 'home',
                    title: 'Home',
                },
                sitemap: {
                    template: 'sitemap',
                    title: 'Site Map',
                },
            },
        });
    });
    test('type-default-optional', () => {
        let f0 = () => true;
        let g0 = Gubu({
            string: 's',
            number: 1,
            boolean: true,
            object: { x: 2 },
            array: [3],
            function: G$({ t: 'function', v: f0 })
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
        })).toMatchObject({
            string: 'S',
            number: 11,
            boolean: false,
            object: { x: 22 },
            array: [33],
        });
    });
    test('type-native-required', () => {
        let g0 = Gubu({
            string: String,
            number: Number,
            boolean: Boolean,
            object: Object,
            array: Array,
            function: Function,
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
        let e0 = Gubu({ s0: String, s1: 'x' });
        expect(e0({ s0: 'a' })).toMatchObject({ s0: 'a', s1: 'x' });
        expect(() => e0({ s0: 1 })).toThrow(/Validation failed for property "s0" with value "1" because the value is not of type string\./);
        expect(() => e0({ s1: 1 })).toThrow(/Validation failed for property "s0" with value "" because the value is required\.\nValidation failed for property "s1" with value "1" because the value is not of type string\./);
    });
    test('type-native-optional', () => {
        let { Skip } = Gubu;
        // Explicit Skip over native type sets no value.
        let g0 = Gubu({
            string: Skip(String),
            number: Skip(Number),
            boolean: Skip(Boolean),
            object: Skip(Object),
            array: Skip(Array),
            function: Skip(Function),
        });
        expect(g0({})).toEqual({});
    });
    test('array-repeating-elements', () => {
        let g0 = Gubu({
            a: [String]
        });
        expect(g0({ a: [] })).toEqual({ a: [] });
        expect(g0({ a: ['X'] })).toEqual({ a: ['X'] });
        expect(g0({ a: ['X', 'Y'] })).toEqual({ a: ['X', 'Y'] });
        expect(g0({ a: ['X', 'Y', 'Z'] })).toEqual({ a: ['X', 'Y', 'Z'] });
        expect(() => g0({ a: [null] })).toThrow(/"a.0".*"null".*type string/);
        expect(() => g0({ a: [''] })).toThrow('Validation failed for index "a.0" with value "" because an empty string is not allowed.');
        expect(() => g0({ a: [11] })).toThrow(/"a.0".*"11".*type string/);
        expect(() => g0({ a: ['X', 11] })).toThrow(/"a.1".*"11".*type string/);
        expect(() => g0({ a: ['X', 'Y', 11] })).toThrow(/"a.2".*"11".*type string/);
        expect(() => g0({ a: ['X', 'Y', 'Z', 11] })).toThrow(/"a.3".*"11".*type string/);
        expect(() => g0({ a: ['X', null] })).toThrow(/"a.1".*"null".*type string/);
        expect(() => g0({ a: ['X', ''] })).toThrow('Validation failed for index "a.1" with value "" because an empty string is not allowed.');
        expect(() => g0({ a: [11, 'K'] })).toThrow(/"a.0".*"11".*string/);
        expect(() => g0({ a: ['X', 11, 'K'] })).toThrow(/"a.1".*"11".*string/);
        expect(() => g0({ a: ['X', 'Y', 11, 'K'] })).toThrow(/"a.2".*"11".*string/);
        expect(() => g0({ a: ['X', 'Y', 'Z', 11, 'K'] })).toThrow(/"a.3".*"11".*string/);
        expect(() => g0({ a: [22, 'Y', 11, 'K'] })).toThrow(/"a.0".*"22".*"a.2".*"11"/s);
        expect(() => g0({ a: ['X', 'Y', 'Z', 11, 'K', 'L'] })).toThrow(/"a.3".*"11"/);
        // Zero or more elements of shape.
        let g1 = Gubu([String]);
        expect(g1(['X', 'Y'])).toEqual(['X', 'Y']);
        expect(() => g1(['X', 1])).toThrow(/Validation failed for index "1" with value "1" because the value is not of type string\./);
        // Empty array means any element
        let g2 = Gubu([]);
        expect(g2()).toEqual([]);
        expect(g2([])).toEqual([]);
        expect(g2([1])).toEqual([1]);
        expect(g2([1, 'a'])).toEqual([1, 'a']);
        expect(g2([1, 'a', true])).toEqual([1, 'a', true]);
        expect(g2([, 1, 'a', true])).toEqual([undefined, 1, 'a', true]);
        expect(g2([null, 1, , 'a', true])).toEqual([null, 1, undefined, 'a', true]);
        expect(g2([null, 1, , 'a', true])).toEqual([null, 1, undefined, 'a', true]);
        // Required with single element is redundant
        let g3 = Gubu([Required({ x: 1 })]);
        expect(g3([{ x: 11 }])).toEqual([{ x: 11 }]);
        expect(g3([{ x: 11 }, { x: 22 }])).toEqual([{ x: 11 }, { x: 22 }]);
        expect(g3([])).toEqual([]);
        expect(g3()).toEqual([]);
        // Single element is the same as Value(...)
        let g4 = Gubu([Number]);
        expect(g4()).toEqual([]);
        expect(g4([])).toEqual([]);
        expect(g4([1])).toEqual([1]);
        expect(g4([1, 2])).toEqual([1, 2]);
        expect(g4([1, 2, 3])).toEqual([1, 2, 3]);
        expect(() => g4(['a'])).toThrow('Validation failed for index "0" with value "a" because the value is not of type number.');
        expect(() => g4([1, 'a'])).toThrow('Validation failed for index "1" with value "a" because the value is not of type number.');
        expect(() => g4([1, 2, 'a'])).toThrow('Validation failed for index "2" with value "a" because the value is not of type number.');
        let g4v = Gubu(Value(Number, []));
        expect(g4v()).toEqual([]);
        expect(g4v([])).toEqual([]);
        expect(g4v([1])).toEqual([1]);
        expect(g4v([1, 2])).toEqual([1, 2]);
        expect(g4v([1, 2, 3])).toEqual([1, 2, 3]);
        expect(() => g4v(['a'])).toThrow('Validation failed for index "0" with value "a" because the value is not of type number.');
        expect(() => g4v([1, 'a'])).toThrow('Validation failed for index "1" with value "a" because the value is not of type number.');
        expect(() => g4v([1, 2, 'a'])).toThrow('Validation failed for index "2" with value "a" because the value is not of type number.');
        // Value overrides single element
        let g4vo = Gubu(Value(Number, [String]));
        expect(g4vo()).toEqual([]);
        expect(g4vo([])).toEqual([]);
        expect(g4vo([1])).toEqual([1]);
        expect(g4vo([1, 2])).toEqual([1, 2]);
        expect(g4vo([1, 2, 3])).toEqual([1, 2, 3]);
        expect(() => g4vo(['a'])).toThrow('Validation failed for index "0" with value "a" because the value is not of type number.');
        expect(() => g4vo([1, 'a'])).toThrow('Validation failed for index "1" with value "a" because the value is not of type number.');
        expect(() => g4vo([1, 2, 'a'])).toThrow('Validation failed for index "2" with value "a" because the value is not of type number.');
        // NOTE: array without spec can hold anything.
        let g6 = Gubu([]);
        expect(g6([null, 1, 'x', true])).toEqual([null, 1, 'x', true]);
        let g7 = Gubu([Never()]);
        expect(g7([])).toEqual([]);
        expect(() => g7([1])).toThrow('Validation failed for index "0" with value "1" because no value is allowed.');
        expect(() => g7(new Array(1))).toThrow('Validation failed for index "0" with value "" because no value is allowed.');
        let g8 = Gubu([1]);
        expect(g8(new Array(3))).toEqual([1, 1, 1]);
        let a0 = [11, 22, 33];
        delete a0[1];
        expect(g8(a0)).toEqual([11, 1, 33]);
        let g9 = Gubu([null]);
        expect(g9([null, null])).toEqual([null, null]);
        let g10 = Gubu([{ x: 1 }]);
        expect(g10([])).toEqual([]);
        expect(g10([{ x: 11 }])).toEqual([{ x: 11 }]);
        expect(g10([{ x: 11 }, { x: 22 }])).toEqual([{ x: 11 }, { x: 22 }]);
        expect(g10([{ x: 11 }, { x: 22 }, { x: 33 }]))
            .toEqual([{ x: 11 }, { x: 22 }, { x: 33 }]);
        expect(() => g10(['q'])).toThrow(/"0".*"q".*type object/);
        expect(() => g10([{ x: 11 }, 'q'])).toThrow(/"1".*"q".*type object/);
        expect(() => g10([{ x: 11 }, { y: 22 }, 'q'])).toThrow(/"2".*"q".*type object/);
        expect(() => g10([{ x: 11 }, { y: 22 }, { z: 33 }, 'q'])).toThrow(/"3".*"q".*type object/);
        expect(() => g10(['q', { k: 99 }])).toThrow(/"0".*"q".*type object/);
        expect(() => g10([{ x: 11 }, 'q', { k: 99 }])).toThrow(/"1".*"q".*type object/);
        expect(() => g10([{ x: 11 }, { y: 22 }, 'q', { k: 99 }]))
            .toThrow(/"2".*"q".*type object/);
        expect(() => g10([{ x: 11 }, { y: 22 }, { z: 33 }, 'q', { k: 99 }]))
            .toThrow(/"3".*"q".*type object/);
        // TODO: change norm - object Value and array Value should be the same
    });
    test('array-closed', () => {
        // Exact set of elements.
        let g2 = Gubu([{ x: 1 }, { y: true }]);
        expect(g2([{ x: 2 }, { y: false }])).toEqual([{ x: 2 }, { y: false }]);
        expect(() => g2([{ x: 2 }, { y: false }, 'Q'])).toThrow('Validation failed for array "[{x:2},{y:false},Q]" because the index "2" is not allowed.');
        expect(() => g2([{ x: 'X' }, { y: false }])).toThrow('Validation failed for property "0.x" with value "X" because the value is not of type number.');
        expect(() => g2(['Q', { y: false }])).toThrow('Validation failed for index "0" with value "Q" because the value is not of type object.');
        expect(g2([{ x: 2 }])).toEqual([{ x: 2 }, { y: true }]);
        expect(g2([{ x: 2 }, undefined])).toEqual([{ x: 2 }, { y: true }]);
        expect(g2([undefined, { y: false }])).toEqual([{ x: 1 }, { y: false }]);
        expect(g2([, { y: false }])).toEqual([{ x: 1 }, { y: false }]);
        let g3 = Gubu(Closed([Any()]));
        expect(g3([])).toEqual([]);
        expect(g3([1])).toEqual([1]);
        expect(() => g3([1, 'x'])).toThrow('not allowed');
        expect(g3(new Array(1))).toEqual([undefined]);
        expect(() => g3(new Array(2))).toThrow('not allowed');
        let g4 = Gubu(Closed([1]));
        expect(g4([])).toEqual([1]);
        expect(g4([1])).toEqual([1]);
        expect(() => g4(['a'])).toThrow('type');
        expect(() => g4([1, 2])).toThrow('not allowed');
        expect(g4(new Array(1))).toEqual([1]);
        expect(() => g4(new Array(2))).toThrow('not allowed');
        let g5 = Gubu(Closed([Number]));
        expect(() => g5([])).toThrow('required');
        expect(g5([1])).toEqual([1]);
        expect(() => g5(['a'])).toThrow('type');
        expect(() => g5([1, 2])).toThrow('not allowed');
        expect(() => g5(new Array(1))).toThrow('required');
        expect(() => g5(new Array(2))).toThrow('not allowed');
        let g6 = Gubu(Closed([Number, String, Boolean]));
        expect(g6([1, 'a', true])).toEqual([1, 'a', true]);
        expect(g6([0, 'b', false])).toEqual([0, 'b', false]);
        expect(() => g6([0, 'b', false, 1])).toThrow('not allowed');
        expect(() => g6(['a'])).toThrow('type');
        expect(() => g6([1, 2])).toThrow('required');
        expect(() => g6(new Array(0))).toThrow('required');
        expect(() => g6(new Array(1))).toThrow('required');
        expect(() => g6(new Array(2))).toThrow('required');
        expect(() => g6(new Array(3))).toThrow('required');
        expect(() => g6(new Array(4))).toThrow('not allowed');
        let g7 = Gubu(Closed([1, 'a']));
        expect(g7([])).toEqual([1, 'a']);
        expect(g7([, 'b'])).toEqual([1, 'b']);
    });
    test('object-properties', () => {
        // NOTE: unclosed object without props can hold anything
        let g0 = Gubu({});
        expect(g0({ a: null, b: 1, c: 'x', d: true }))
            .toEqual({ a: null, b: 1, c: 'x', d: true });
        let g1 = Gubu(Closed({}));
        expect(g1({})).toEqual({});
        expect(() => g1({ a: null, b: 1, c: 'x', d: true })).toThrow('Validation failed for object "{a:null,b:1,c:x,d:true}" because the properties "a, b, c, d" are not allowed.');
    });
    test('check-basic', () => {
        let g0 = Gubu({ a: Check((v) => v > 10) });
        expect(g0({ a: 11 })).toMatchObject({ a: 11 });
        expect(() => g0({ a: 9 })).toThrow('Validation failed for property "a" with value "9" because check "(v) => v > 10" failed.');
    });
    test('custom-basic', () => {
        let g0 = Gubu({ a: Check((v) => v > 10) });
        expect(g0({ a: 11 })).toMatchObject({ a: 11 });
        expect(() => g0({ a: 9 })).toThrow('Validation failed for property "a" with value "9" because check "(v) => v > 10" failed.');
        let g1 = Gubu({ a: Skip(Check((v) => v > 10)) });
        expect(g1({ a: 11 })).toMatchObject({ a: 11 });
        expect(() => g1({ a: 9 })).toThrow('Validation failed for property "a" with value "9" because check "(v) => v > 10" failed.');
        expect(g1({})).toMatchObject({});
        let g2 = Gubu({ a: Required(Check((v) => v > 10)) });
        expect(g1({ a: 11 })).toMatchObject({ a: 11 });
        expect(() => g2({ a: 9 })).toThrow('Validation failed for property "a" with value "9" because check "(v) => v > 10" failed.');
        expect(() => g2({}))
            .toThrow('Validation failed for property "a" with value "" because check "(v) => v > 10" failed.');
        let g3 = Gubu(Check((v) => v > 10));
        expect(g3(11)).toEqual(11);
        expect(() => g3(9)).toThrow('Validation failed for value "9" because check "(v) => v > 10" failed.');
    });
    test('custom-modify', () => {
        let g0 = Gubu({
            a: (Skip(Check((v, u) => (u.val = v * 2, true)))),
            b: Skip(Check((_v, u) => {
                u.err = 'BAD VALUE $VALUE AT $PATH';
                return false;
            })),
            c: Skip(Check((v, u, s) => (u.val = (v ? v + ` (key=${s.key})` : undefined), true))),
            d: Skip(Check((_v, u, _s) => (u.val = undefined, true)))
        });
        expect(g0({ a: 3 })).toEqual({ a: 6 });
        expect(() => g0({ b: 1 })).toThrow('BAD VALUE 1 AT b');
        expect(g0({ c: 'x' })).toEqual({ c: 'x (key=c)' });
        expect(g0({ d: 'D' })).toEqual({ d: 'D' });
        let g1 = Gubu(Open({
            a: Skip(Check((_v, u, _s) => (u.uval = undefined, true)))
        }));
        expect(g1({ a: 'A' })).toEqual({ a: undefined });
        expect(g1({ a: 'A', b: undefined })).toEqual({ a: undefined });
    });
    test('after-multiple', () => {
        let g0 = Gubu(After(function v1(v, u) { u.val = v + 1; return true; }, After(function v2(v, u) { u.val = v * 2; return true; }, Number)));
        expect(g0(1)).toEqual(3);
        expect(g0(2)).toEqual(5);
    });
    test('deep-object-basic', () => {
        let a1 = Gubu({ a: 1 });
        expect(a1({})).toMatchObject({ a: 1 });
        let ab1 = Gubu({ a: { b: 1 } });
        expect(ab1({})).toMatchObject({ a: { b: 1 } });
        let abc1 = Gubu({ a: { b: { c: 1 } } });
        expect(abc1({})).toMatchObject({ a: { b: { c: 1 } } });
        let ab1c2 = Gubu({ a: { b: 1 }, c: 2 });
        expect(ab1c2({})).toMatchObject({ a: { b: 1 }, c: 2 });
        let ab1cd2 = Gubu({ a: { b: 1 }, c: { d: 2 } });
        expect(ab1cd2({})).toMatchObject({ a: { b: 1 }, c: { d: 2 } });
        let abc1ade2f3 = Gubu({ a: { b: { c: 1 }, d: { e: 2 } }, f: 3 });
        expect(abc1ade2f3({})).toMatchObject({ a: { b: { c: 1 }, d: { e: 2 } }, f: 3 });
        let d0 = Gubu({
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
    test('array-special', () => {
        let a0 = Gubu([1]);
        expect(a0()).toMatchObject([]);
        expect(a0([])).toMatchObject([]);
        expect(a0([11])).toMatchObject([11]);
        expect(a0([11, 22])).toMatchObject([11, 22]);
        let a1 = Gubu([Number, String]);
        expect(() => a1()).toThrow('required');
        expect(() => a1([])).toThrow('required');
        expect(() => a1([1])).toThrow('required');
        expect(a1([1, 'x'])).toMatchObject([1, 'x']);
        expect(() => a1([1, 'x', 'y'])).toThrow('not allowed');
        expect(() => a1(['x', 'y'])).toThrow('Validation failed for index "0" with value "x" because the value is not of type number.');
        expect(() => a1([1, 2])).toThrow('Validation failed for index "1" with value "2" because the value is not of type string.');
        let a2 = Gubu([9, String]);
        expect(() => a2()).toThrow('required');
        expect(() => a2([])).toThrow('required');
        expect(() => a2([1])).toThrow('required');
        expect(a2([1, 'x'])).toMatchObject([1, 'x']);
        expect(() => a2([1, 'x', 'y'])).toThrow('not allowed');
        expect(() => a2(['x', 1])).toThrow('Validation failed for index "1" with value "1" because the value is not of type string.');
        expect(() => a2(['x', 'y'])).toThrow('Validation failed for index "0" with value "x" because the value is not of type number.');
        let a3 = Gubu([1, 2, 3]);
        expect(a3()).toEqual([1, 2, 3]);
        expect(a3([])).toEqual([1, 2, 3]);
        expect(a3([11])).toEqual([11, 2, 3]);
        expect(a3([11, 22])).toEqual([11, 22, 3]);
        expect(a3([11, 22, 33])).toMatchObject([11, 22, 33]);
        expect(() => a3([11, 22, 33, 44])).toThrow('not allowed');
        expect(a3([undefined, 22, 33])).toMatchObject([1, 22, 33]);
        expect(a3([undefined, undefined, 33])).toMatchObject([1, 2, 33]);
        expect(a3([undefined, undefined, undefined])).toMatchObject([1, 2, 3]);
        // non-index properties on array shape are not supported
        // FEATURE: support non-index properties on array shape
        let r0 = null;
        let A0 = [String];
        A0.x = 1;
        let g3 = Gubu({ a: A0 });
        expect(g3({})).toEqual({ a: [] });
        expect(r0 = g3({ a: undefined })).toEqual({ a: [] });
        expect(r0.x).toBeUndefined();
        expect(r0 = g3({ a: [] })).toEqual({ a: [] });
        expect(r0.x).toBeUndefined();
    });
    test('context-basic', () => {
        let c0 = { max: 10 };
        let g0 = Gubu({
            a: Check((v, _u, s) => v < s.ctx.max)
        });
        expect(g0({ a: 2 }, c0)).toMatchObject({ a: 2 });
        expect(() => g0({ a: 11 }, c0)).toThrow('Validation failed for property "a" with value "11" because check "(v, _u, s) => v < s.ctx.max" failed.');
        let g1 = Gubu({
            a: { b: All(Number, Check((v, _u, s) => v < s.ctx.max)) }
        });
        expect(g1({ a: { b: 3 } }, c0)).toMatchObject({ a: { b: 3 } });
        expect(() => g1({ a: { b: 11 } }, c0)).toThrow('Value "11" for property "a.b" does not satisfy all of: Number, (v, _u, s) => v < s.ctx.max');
    });
    test('error-path', () => {
        let g0 = Gubu({ a: { b: String } });
        expect(g0({ a: { b: 'x' } })).toEqual({ a: { b: 'x' } });
        expect(() => g0(1)).toThrow('not of type object');
        expect(() => g0({ a: 1 })).toThrow('property "a"');
        expect(() => g0({ a: { b: 1 } })).toThrow('property "a.b"');
        expect(() => g0({ a: { b: { c: 1 } } })).toThrow('property "a.b"');
        let g1 = Gubu(String);
        expect(g1('x')).toEqual('x');
        expect(() => g1(1)).toThrow('for value ');
        expect(() => g1(true)).toThrow('for value ');
        expect(() => g1(null)).toThrow('for value ');
        expect(() => g1(undefined)).toThrow('for value ');
        expect(() => g1([])).toThrow('for array ');
        expect(() => g1({})).toThrow('for object ');
        expect(() => g1(new Date())).toThrow('for value ');
    });
    test('error-desc', () => {
        const g0 = Gubu(NaN);
        let err = [];
        let o0 = g0(1, { err });
        expect(o0).toEqual(1);
        expect(err).toMatchObject([{
                n: { t: 'nan', v: NaN, r: false, d: 0, u: {} },
                v: 1,
                p: '',
                w: 'type',
                m: 1050,
                t: 'Validation failed for value "1" because the value is not of type nan.'
            }]);
        try {
            g0(1, { a: 'A' });
        }
        catch (e) {
            expect(e.message).toEqual('Validation failed for value "1" because the value is not of type nan.');
            expect(e.code).toEqual('shape');
            expect(e.gubu).toEqual(true);
            expect(e.name).toEqual('GubuError');
            expect(e.desc()).toMatchObject({
                code: 'shape',
                ctx: { a: 'A' },
                err: [
                    {
                        n: { t: 'nan', v: NaN, r: false, d: 0, u: {} },
                        v: 1,
                        p: '',
                        w: 'type',
                        m: 1050,
                        t: 'Validation failed for value "1" because the value is not of type nan.'
                    }
                ]
            });
            expect(JSON.stringify(e)).toEqual('{"gubu":true,"name":"GubuError","code":"shape","err":[{"n":{"$":{"v$":"' + package_json_1.default.version + '"},"t":"nan","v":null,"n":0,"r":false,"p":false,"d":0,"u":{},"a":[],"b":[]},"v":1,"p":"","w":"type","m":1050,"t":"Validation failed for value \\"1\\" because the value is not of type nan.","u":{}}],"message":"Validation failed for value \\"1\\" because the value is not of type nan."}');
        }
    });
    test('spec-basic', () => {
        expect(Gubu(Number).spec()).toMatchObject({
            $: { gubu$: true, v$: package_json_1.default.version },
            d: 0, r: true, t: 'number', u: {}, v: 0,
        });
        expect(Gubu(String).spec()).toMatchObject({
            $: { gubu$: true, v$: package_json_1.default.version },
            d: 0, r: true, t: 'string', u: {}, v: '',
        });
        expect(Gubu(BigInt).spec()).toMatchObject({
            $: { gubu$: true, v$: package_json_1.default.version },
            d: 0, r: true, t: 'bigint', u: {}, v: "0",
        });
        expect(Gubu(null).spec()).toMatchObject({
            $: { gubu$: true, v$: package_json_1.default.version },
            d: 0, r: false, t: 'null', u: {}, v: null,
        });
    });
    test('spec-required', () => {
        let g0 = Gubu(Required(1));
        expect(g0.spec()).toMatchObject({ d: 0, p: false, r: true, t: 'number', v: 1 });
        let g1 = Gubu(Required({ a: 1 }));
        expect(g1.spec()).toMatchObject({
            d: 0, p: false, r: true, t: 'object', v: {
                a: { d: 1, p: false, r: false, t: 'number', v: 1 }
            }
        });
        let g2 = Gubu(Required({ a: Required(1) }));
        expect(g2.spec()).toMatchObject({
            d: 0, p: false, r: true, t: 'object', v: {
                a: { d: 1, p: false, r: true, t: 'number', v: 1 }
            }
        });
        let g3 = Gubu(Required({ a: Required({ b: 1 }) }));
        expect(g3.spec()).toMatchObject({
            d: 0, p: false, r: true, t: 'object', v: {
                a: {
                    d: 1, p: false, r: true, t: 'object', v: {
                        b: {
                            d: 2, p: false, r: false, t: 'number', v: 1
                        }
                    }
                }
            }
        });
        let g4 = Gubu(Required({ a: Skip({ b: 1 }) }));
        expect(g4.spec()).toMatchObject({
            d: 0, p: false, r: true, t: 'object', v: {
                a: {
                    d: 1, p: true, r: false, t: 'object', v: {
                        b: {
                            d: 2, p: false, r: false, t: 'number', v: 1
                        }
                    }
                }
            }
        });
        let g5 = Gubu(Skip({ a: Required({ b: 1 }) }));
        expect(g5.spec()).toMatchObject({
            d: 0, p: true, r: false, t: 'object', v: {
                a: {
                    d: 1, p: false, r: true, t: 'object', v: {
                        b: {
                            d: 2, p: false, r: false, t: 'number', v: 1
                        }
                    }
                }
            }
        });
    });
    test('spec-roundtrip', () => {
        let m0 = { a: 1 };
        let g0 = Gubu(m0);
        expect(m0).toEqual({ a: 1 });
        expect(g0({ a: 2 })).toEqual({ a: 2 });
        expect(m0).toEqual({ a: 1 });
        let s0 = g0.spec();
        expect(m0).toEqual({ a: 1 });
        let s0s = {
            $: {
                gubu$: true,
                v$: package_json_1.default.version,
            },
            d: 0,
            r: false,
            p: false,
            t: 'object',
            u: {},
            a: [],
            b: [],
            n: 1,
            v: {
                a: {
                    $: {
                        gubu$: true,
                        v$: package_json_1.default.version,
                    },
                    d: 1,
                    r: false,
                    p: false,
                    t: 'number',
                    u: {},
                    a: [],
                    b: [],
                    v: 1,
                    n: 0,
                },
            },
        };
        expect(s0).toEqual(s0s);
        expect(g0({ a: 2 })).toEqual({ a: 2 });
        let g0r = Gubu(s0);
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
        let g1 = Gubu(m1);
        expect(g1({ a: [2] })).toEqual({ a: [2] });
        expect(m1).toEqual({ a: [1] });
        let s1 = g1.spec();
        let s1s = {
            $: {
                gubu$: true,
                v$: package_json_1.default.version,
            },
            d: 0,
            r: false,
            p: false,
            t: 'object',
            u: {},
            a: [],
            b: [],
            n: 1,
            v: {
                a: {
                    $: {
                        gubu$: true,
                        v$: package_json_1.default.version,
                    },
                    d: 1,
                    r: false,
                    p: false,
                    t: 'array',
                    u: {},
                    a: [],
                    b: [],
                    v: {},
                    n: 0,
                    c: {
                        $: {
                            gubu$: true,
                            v$: package_json_1.default.version,
                        },
                        d: 2,
                        r: false,
                        p: false,
                        t: 'number',
                        u: {},
                        a: [],
                        b: [],
                        v: 1,
                        n: 0
                    },
                },
            },
        };
        expect(s1).toEqual(s1s);
        let g1r = Gubu(s1);
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
        let g0 = Gubu(String);
        let g1 = Gubu(g0);
        let g1s = Gubu(g0.spec());
        expect(g1('x')).toEqual('x');
        expect(() => g1(1)).toThrow();
        expect(g1s('x')).toEqual('x');
        expect(() => g1s(1)).toThrow();
        let g2 = Gubu({ a: Number });
        let g3 = Gubu({ b: g2 });
        let g3s = Gubu({ b: g2.spec() });
        expect(g3({ b: { a: 1 } })).toEqual({ b: { a: 1 } });
        expect(() => g3({ b: { a: 'x' } })).toThrow();
        expect(g3s({ b: { a: 1 } })).toEqual({ b: { a: 1 } });
        expect(() => g3s({ b: { a: 'x' } })).toThrow();
        const shape = Gubu({ a: Gubu({ x: Number }) });
        expect(shape({ a: { x: 1 } })).toEqual({ a: { x: 1 } });
    });
    test('truncate', () => {
        expect(truncate('')).toEqual('');
        expect(truncate('0')).toEqual('0');
        expect(truncate('01')).toEqual('01');
        expect(truncate('012')).toEqual('012');
        expect(truncate('0123')).toEqual('0123');
        expect(truncate('01234')).toEqual('01234');
        expect(truncate('012345')).toEqual('012345');
        expect(truncate('0123456')).toEqual('0123456');
        expect(truncate('01234567')).toEqual('01234567');
        expect(truncate('012345678')).toEqual('012345678');
        expect(truncate('0123456789')).toEqual('0123456789');
        expect(truncate('01234567890123456789012345678')).toEqual('01234567890123456789012345678');
        expect(truncate('012345678901234567890123456789')).toEqual('012345678901234567890123456789');
        expect(truncate('0123456789012345678901234567890')).toEqual('012345678901234567890123456...');
        expect(truncate('', 6)).toEqual('');
        expect(truncate('0', 6)).toEqual('0');
        expect(truncate('01', 6)).toEqual('01');
        expect(truncate('012', 6)).toEqual('012');
        expect(truncate('0123', 6)).toEqual('0123');
        expect(truncate('01234', 6)).toEqual('01234');
        expect(truncate('012345', 6)).toEqual('012345');
        expect(truncate('0123456', 6)).toEqual('012...');
        expect(truncate('01234567', 6)).toEqual('012...');
        expect(truncate('012345678', 6)).toEqual('012...');
        expect(truncate('0123456789', 6)).toEqual('012...');
        expect(truncate('', 5)).toEqual('');
        expect(truncate('0', 5)).toEqual('0');
        expect(truncate('01', 5)).toEqual('01');
        expect(truncate('012', 5)).toEqual('012');
        expect(truncate('0123', 5)).toEqual('0123');
        expect(truncate('01234', 5)).toEqual('01234');
        expect(truncate('012345', 5)).toEqual('01...');
        expect(truncate('0123456', 5)).toEqual('01...');
        expect(truncate('01234567', 5)).toEqual('01...');
        expect(truncate('012345678', 5)).toEqual('01...');
        expect(truncate('0123456789', 5)).toEqual('01...');
        expect(truncate('', 4)).toEqual('');
        expect(truncate('0', 4)).toEqual('0');
        expect(truncate('01', 4)).toEqual('01');
        expect(truncate('012', 4)).toEqual('012');
        expect(truncate('0123', 4)).toEqual('0123');
        expect(truncate('01234', 4)).toEqual('0...');
        expect(truncate('012345', 4)).toEqual('0...');
        expect(truncate('0123456', 4)).toEqual('0...');
        expect(truncate('01234567', 4)).toEqual('0...');
        expect(truncate('012345678', 4)).toEqual('0...');
        expect(truncate('0123456789', 4)).toEqual('0...');
        expect(truncate('', 3)).toEqual('');
        expect(truncate('0', 3)).toEqual('0');
        expect(truncate('01', 3)).toEqual('01');
        expect(truncate('012', 3)).toEqual('012');
        expect(truncate('0123', 3)).toEqual('...');
        expect(truncate('01234', 3)).toEqual('...');
        expect(truncate('012345', 3)).toEqual('...');
        expect(truncate('0123456', 3)).toEqual('...');
        expect(truncate('01234567', 3)).toEqual('...');
        expect(truncate('012345678', 3)).toEqual('...');
        expect(truncate('0123456789', 3)).toEqual('...');
        expect(truncate('', 2)).toEqual('');
        expect(truncate('0', 2)).toEqual('0');
        expect(truncate('01', 2)).toEqual('01');
        expect(truncate('012', 2)).toEqual('..');
        expect(truncate('0123', 2)).toEqual('..');
        expect(truncate('01234', 2)).toEqual('..');
        expect(truncate('012345', 2)).toEqual('..');
        expect(truncate('0123456', 2)).toEqual('..');
        expect(truncate('01234567', 2)).toEqual('..');
        expect(truncate('012345678', 2)).toEqual('..');
        expect(truncate('0123456789', 2)).toEqual('..');
        expect(truncate('', 1)).toEqual('');
        expect(truncate('0', 1)).toEqual('0');
        expect(truncate('01', 1)).toEqual('.');
        expect(truncate('012', 1)).toEqual('.');
        expect(truncate('0123', 1)).toEqual('.');
        expect(truncate('01234', 1)).toEqual('.');
        expect(truncate('012345', 1)).toEqual('.');
        expect(truncate('0123456', 1)).toEqual('.');
        expect(truncate('01234567', 1)).toEqual('.');
        expect(truncate('012345678', 1)).toEqual('.');
        expect(truncate('0123456789', 1)).toEqual('.');
        expect(truncate('', 0)).toEqual('');
        expect(truncate('0', 0)).toEqual('');
        expect(truncate('01', 0)).toEqual('');
        expect(truncate('012', 0)).toEqual('');
        expect(truncate('0123', 0)).toEqual('');
        expect(truncate('01234', 0)).toEqual('');
        expect(truncate('012345', 0)).toEqual('');
        expect(truncate('0123456', 0)).toEqual('');
        expect(truncate('01234567', 0)).toEqual('');
        expect(truncate('012345678', 0)).toEqual('');
        expect(truncate('0123456789', 0)).toEqual('');
        expect(truncate('', -1)).toEqual('');
        expect(truncate('0', -1)).toEqual('');
        expect(truncate('01', -1)).toEqual('');
        expect(truncate('012', -1)).toEqual('');
        expect(truncate('0123', -1)).toEqual('');
        expect(truncate('01234', -1)).toEqual('');
        expect(truncate('012345', -1)).toEqual('');
        expect(truncate('0123456', -1)).toEqual('');
        expect(truncate('01234567', -1)).toEqual('');
        expect(truncate('012345678', -1)).toEqual('');
        expect(truncate('0123456789', -1)).toEqual('');
        expect(truncate(NaN, 5)).toEqual('NaN');
        expect(truncate(null, 5)).toEqual('');
        expect(truncate(undefined, 5)).toEqual('');
    });
    test('stringify', () => {
        expect(stringify({ a: 1 })).toEqual('{"a":1}');
        expect(stringify(Required())).toEqual(`"any"`);
        let c0 = {};
        c0.x = c0;
        expect(stringify(c0)).toEqual('"[object Object]"');
        function f0() { }
        class C0 {
        }
        expect(stringify([1, f0, () => true, C0])).toEqual('[1,"f0","() => true","C0"]');
        expect(stringify(/a/)).toEqual('"/a/"');
    });
    test('G-basic', () => {
        expect(G$({ v: 11 })).toMatchObject({
            '$': { v$: package_json_1.default.version },
            t: 'number',
            v: 11,
            r: false,
            p: false,
            d: -1,
            a: [],
            b: [],
            u: {}
        });
        expect(G$({ v: Number })).toMatchObject({
            '$': { v$: package_json_1.default.version },
            t: 'number',
            v: 0,
            r: false,
            p: false,
            d: -1,
            a: [],
            b: [],
            u: {}
        });
        expect(G$({ v: BigInt(11) })).toMatchObject({
            '$': { v$: package_json_1.default.version },
            t: 'bigint',
            v: BigInt(11),
            r: false,
            p: false,
            d: -1,
            a: [],
            b: [],
            u: {}
        });
        let s0 = Symbol('foo');
        expect(G$({ v: s0 })).toMatchObject({
            '$': { v$: package_json_1.default.version },
            t: 'symbol',
            v: s0,
            r: false,
            p: false,
            d: -1,
            a: [],
            b: [],
            u: {}
        });
        // NOTE: special case for plain functions.
        // Normally functions become custom validations.
        let f0 = () => true;
        expect(G$({ v: f0 })).toMatchObject({
            '$': { v$: package_json_1.default.version },
            t: 'function',
            v: f0,
            r: false,
            p: false,
            d: -1,
            a: [],
            b: [],
            u: {}
        });
    });
    test('just-large', () => {
        let m0 = Large.m0;
        let g0 = Gubu(m0);
        let o0 = g0(Large.i0);
        expect(o0).toEqual(Large.c0);
        let m1 = Large.m1;
        let g1 = Gubu(m1);
        let o1 = g1(Large.i1);
        expect(o1).toEqual(Large.c1);
    });
    test('just-long', () => {
        expect(Gubu(Long.m0)(Long.i0)).toEqual(Long.i0);
        expect(Gubu(Long.m1)(Long.i1)).toEqual(Long.i1);
    });
    test('even-larger', () => {
        let m0 = {};
        let c0 = m0;
        for (let i = 0; i < 11111; i++) {
            c0 = c0.a = {};
        }
        let g0 = Gubu(m0);
        expect(g0(m0)).toEqual(m0);
        let m1 = [];
        let c1 = m1;
        for (let i = 0; i < 11111; i++) {
            c1 = c1[0] = [];
        }
        let g1 = Gubu(m1);
        expect(g1(m1)).toEqual(m1);
    });
    test('even-longer', () => {
        let m0 = {};
        for (let i = 0; i < 11111; i++) {
            m0['a' + i] = true;
        }
        let g0 = Gubu(m0);
        expect(g0(m0)).toEqual(m0);
        let m1 = {};
        for (let i = 0; i < 11111; i++) {
            m1[i] = true;
        }
        let g1 = Gubu(m1);
        expect(g1(m1)).toEqual(m1);
    });
    // Test compat with https://github.com/rjrodger/optioner
    test('legacy-optioner-compat', () => {
        // TODO:
        // * verbatim arrays - maybe use Exact?
        // * option: treat null same as undefined
        // * option: treat functon as raw default value
        // ** thus need a builder for validation functions
        // ** and a builder for raw functions
        // * Do Array, Object work?
        // * default value within One, Some, etc
        // 'happy'
        let opter = Gubu({
            a: 1,
            b: { c: 2 },
            d: { e: { f: 3 } },
            g: null,
            h: 4,
            i: [5, 6],
            // FIX: implement Closed([single-element])
            // j: [{ k: 7 }],
        });
        expect(opter()).toEqual({
            a: 1,
            b: { c: 2 },
            d: { e: { f: 3 } },
            g: null,
            h: 4,
            i: [5, 6],
            // j: [{ k: 7 }],
        });
        // 'empty'
        opter = Gubu({ a: 1 });
        expect(opter(undefined)).toEqual({ a: 1 });
        // TODO: OPT: expect(opter(null)).toEqual({ a: 1 })
        // 'array'
        opter = Gubu([1, 'a']);
        expect(() => opter({})).toThrow('not of type array');
        expect(opter([])).toEqual([1, 'a']);
        expect(opter([1])).toEqual([1, 'a']);
        let fx = function f(x) {
            return x + 1;
        };
        opter = Gubu({
            a: G$({ v: fx })
        });
        let o0 = opter({});
        expect(o0.a(1)).toEqual(2);
        let o1 = opter({
            a: function (x) {
                return x + 2;
            }
        });
        expect(o1.a(1)).toEqual(3);
        // 'edge'
        opter = Gubu({
            a: undefined,
        });
        expect(opter({})).toEqual({});
        // 'default-types'
        opter = Gubu({
            a: 1,
            b: 1.1,
            c: 'x',
            d: true,
        });
        expect(opter({ a: 2, b: 2.2, c: 'y', d: false })).toEqual({ a: 2, b: 2.2, c: 'y', d: false });
        // TODO: SHAPE: Integer
        // expect(() => opter({ a: 3.3 })).toThrow('integer')
        expect(opter({ b: 4 })).toEqual({ a: 1, b: 4, c: 'x', d: true });
        expect(() => opter({ b: 'z' })).toThrow('number');
        expect(() => opter({ c: 1 })).toThrow('string');
        expect(() => opter({ d: 'q' })).toThrow('boolean');
        // 'readme'
        let optioner = Gubu({
            color: 'red',
            // size: Joi.number().integer().max(5).min(1).default(3),
            size: Max(5, Min(1, 3)),
            range: [100, 200],
        });
        expect(optioner({ size: 2 })).toEqual({ color: 'red', size: 2, range: [100, 200] });
        expect(optioner({})).toEqual({ color: 'red', size: 3, range: [100, 200] });
        expect(optioner({ range: [50] })).toEqual({ range: [50, 200], color: 'red', size: 3 });
        expect(() => optioner({ size: 6 })).toThrow('maximum');
        // 'check'
        optioner = Gubu({
            bool: true
        });
        expect(optioner({})).toEqual({ bool: true });
        expect(optioner({ bool: true })).toEqual({ bool: true });
        expect(optioner({ bool: false })).toEqual({ bool: false });
        try {
            optioner({ bool: 'foo' });
            throw new Error('fail');
        }
        catch (e) {
            expect(e.name).toMatch(/GubuError/);
        }
        // 'ignore'
        let optioner_ignore = Gubu(Open({
            a: 1,
        }));
        expect(optioner_ignore({})).toEqual({ a: 1 });
        expect(optioner_ignore({ b: 2 })).toEqual({ a: 1, b: 2 });
        expect(optioner_ignore({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
        let optioner_fail = Gubu(Closed({
            a: 1,
        }));
        expect(optioner_fail({})).toEqual({ a: 1 });
        try {
            optioner_fail({ a: 1, b: 2 });
            throw new Error('fail');
        }
        catch (e) {
            expect(e.name).toMatch(/GubuError/);
        }
        let optioner_ignore_deep = Gubu(Open({
            a: 1,
            b: Open({ c: 2 }),
        }));
        expect(optioner_ignore_deep({})).toEqual({ a: 1, b: { c: 2 } });
        expect(optioner_ignore_deep({ b: { d: 3 } })).toEqual({
            a: 1,
            b: { c: 2, d: 3 },
        });
        let optioner_ignore_deep_fail = Gubu({
            a: 1,
            b: Closed({ c: 2 }),
        });
        expect(optioner_ignore_deep_fail({})).toEqual({ a: 1, b: { c: 2 } });
        try {
            expect(optioner_ignore_deep_fail({ b: { d: 3 } })).toEqual({
                a: 1,
                b: { c: 2, d: 3 },
            });
            throw new Error('fail');
        }
        catch (e) {
            expect(e.name).toMatch(/GubuError/);
        }
        // 'must_match'
        let g0 = Gubu({
            a: Exact(1),
        });
        expect(g0({ a: 1 })).toEqual({ a: 1 });
        expect(() => g0({ a: 1, b: 2 })).toThrow('not allowed');
        expect(() => g0({})).toThrow('exactly');
        expect(() => g0({ a: 2 })).toThrow('exactly');
        expect(() => g0({ a: 'x' })).toThrow('exactly');
        let g1 = Gubu(Open({
            a: Exact(1),
            b: Open({ c: Exact(2) }),
        }));
        expect(g1({ a: 1, b: { c: 2 } })).toEqual({ a: 1, b: { c: 2 } });
        expect(g1({ a: 1, b: { c: 2, z: 3 }, y: 4 })).toEqual({
            a: 1,
            b: { c: 2, z: 3 },
            y: 4,
        });
        expect(() => g1({ a: 1 })).toThrow('exactly');
        expect(() => g1({ a: 1, b: {} })).toThrow('exactly');
        expect(() => g1({ a: 1, b: { c: 'x' } })).toThrow('exactly');
        let g2 = Gubu({
            a: Exact(1),
            b: String
        });
        expect(g2({ a: 1, b: 'x' })).toEqual({ a: 1, b: 'x' });
        expect(() => g2({ a: 1, b: 2 })).toThrow('type');
        var g3 = Gubu({
            a: { b: { c: Exact(1) } },
        });
        expect(g3({ a: { b: { c: 1 } } })).toEqual({ a: { b: { c: 1 } } });
        expect(() => g3({ a: { b: { c: 2 } } })).toThrow('exactly');
        // TODO: fix
        // var g4 = Gubu(
        //   {
        //     a: [Exact(1)],
        //   },
        // )
        // expect(g4({ a: [1] })).toEqual({ a: [1] })
        // expect(g4({ a: [1, 2] })).toEqual({ a: [1, 2] })
        // expect(() => g4({ a: [2] })).toThrow('exactly')
        // var g5 = Gubu(
        //   {
        //     a: [Any(), { b: Exact(1) }],
        //   },
        // )
        // expect(g5({ a: [{ b: 1 }] })).toEqual({ a: [{ b: 1 }] })
        // expect(g5({ a: [{ b: 1, c: 2 }, { b: 3 }] })).toEqual({
        //   a: [{ b: 1, c: 2 }, { b: 3 }],
        // })
        // expect(() => g5({ a: [{ b: 11, c: 2 }, { b: 3 }] })).toThrow('exactly')
        // var g6 = Gubu([Never(), Exact(1)])
        // expect(g6([1])).toEqual([1])
        // expect(() => g6([2])).toThrow('exactly')
        var g7 = Gubu([{}, { a: Exact(2) }, {}]);
        expect(g7([{ a: 1 }, { a: 2 }, { a: 3 }])).toEqual([
            { a: 1 },
            { a: 2 },
            { a: 3 },
        ]);
        expect(() => g7([{ a: 1 }, { a: 3 }])).toThrow('exactly');
        // 'empty-string'
        let opt0 = Gubu({
            a: '',
            b: 'x',
        });
        let res0 = opt0({ a: 'x' });
        expect(res0).toEqual({ a: 'x', b: 'x' });
        let res1 = opt0({ a: '' });
        expect(res1).toEqual({ a: '', b: 'x' });
    });
});
//# sourceMappingURL=gubu.test.js.map