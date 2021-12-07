"use strict";
/* Copyright (c) 2021 Richard Rodger and other contributors, MIT License */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const package_json_1 = __importDefault(require("../package.json"));
const gubu_1 = require("../gubu");
describe('gubu', () => {
    test('happy', () => {
        expect((0, gubu_1.gubu)()).toBeDefined();
        expect((0, gubu_1.gubu)().toString()).toMatch(/\[Gubu \d+\]/);
        expect((0, gubu_1.gubu)(undefined, { name: 'foo' }).toString()).toMatch(/\[Gubu foo\]/);
        let g0 = (0, gubu_1.gubu)({
            a: 'foo',
            b: 100
        });
        expect(g0()).toEqual({ a: 'foo', b: 100 });
        expect(g0({ a: 'bar' })).toEqual({ a: 'bar', b: 100 });
        expect(g0({ b: 999 })).toEqual({ a: 'foo', b: 999 });
        expect(g0({ a: 'bar', b: 999 })).toEqual({ a: 'bar', b: 999 });
        expect(g0({ a: 'bar', b: 999, c: true })).toEqual({ a: 'bar', b: 999, c: true });
    });
    test('G-basic', () => {
        expect((0, gubu_1.G$)({ v: 11 })).toMatchObject({
            '$': { v$: package_json_1.default.version },
            t: 'number',
            v: 11,
            r: false,
            k: '',
            d: -1,
            u: {}
        });
        expect((0, gubu_1.G$)({ v: Number })).toMatchObject({
            '$': { v$: package_json_1.default.version },
            t: 'number',
            v: 0,
            r: false,
            k: '',
            d: -1,
            u: {}
        });
        expect((0, gubu_1.G$)({ v: BigInt(11) })).toMatchObject({
            '$': { v$: package_json_1.default.version },
            t: 'bigint',
            v: BigInt(11),
            r: false,
            k: '',
            d: -1,
            u: {}
        });
        let s0 = Symbol('foo');
        expect((0, gubu_1.G$)({ v: s0 })).toMatchObject({
            '$': { v$: package_json_1.default.version },
            t: 'symbol',
            v: s0,
            r: false,
            k: '',
            d: -1,
            u: {}
        });
        // NOTE: special case for plain functions.
        // Normally functions become custom validations.
        let f0 = () => true;
        expect((0, gubu_1.G$)({ v: f0 })).toMatchObject({
            '$': { v$: package_json_1.default.version },
            t: 'function',
            v: f0,
            r: false,
            k: '',
            d: -1,
            u: {}
        });
    });
    test('shapes-basic', () => {
        // expect(() => gubu(Date)(/a/)).toThrow(/path "".*not an instance of Date/)
        // expect(() => gubu(new Date())(/a/)).toThrow(/path "".*not an instance of Date/)
        // console.log(gubu(Date).spec())
        // console.log(gubu(new Date()).spec())
        // return;
        let tmp = {};
        class Foo {
            constructor(a) {
                this.a = -1;
                this.a = a;
            }
        }
        class Bar {
            constructor(b) {
                this.b = -2;
                this.b = b;
            }
        }
        expect((0, gubu_1.gubu)(String)('x')).toEqual('x');
        expect((0, gubu_1.gubu)(Number)(1)).toEqual(1);
        expect((0, gubu_1.gubu)(Boolean)(true)).toEqual(true);
        expect((0, gubu_1.gubu)(BigInt)(BigInt(1))).toEqual(BigInt(1));
        expect((0, gubu_1.gubu)(Object)({ x: 1 })).toEqual({ x: 1 });
        expect((0, gubu_1.gubu)(Array)([1])).toEqual([1]);
        expect((0, gubu_1.gubu)(Function)(tmp.f0 = () => true)).toEqual(tmp.f0);
        expect((0, gubu_1.gubu)(Symbol)(tmp.s0 = Symbol('foo'))).toEqual(tmp.s0);
        expect((0, gubu_1.gubu)(Date)(tmp.d0 = new Date())).toEqual(tmp.d0);
        expect((0, gubu_1.gubu)(RegExp)(tmp.r0 = /a/)).toEqual(tmp.r0);
        expect((0, gubu_1.gubu)(Foo)(tmp.c0 = new Foo(2))).toEqual(tmp.c0);
        // console.log(gubu(new Date()).spec())
        expect((0, gubu_1.gubu)('a')('x')).toEqual('x');
        expect((0, gubu_1.gubu)(0)(1)).toEqual(1);
        expect((0, gubu_1.gubu)(false)(true)).toEqual(true);
        expect((0, gubu_1.gubu)(BigInt(-1))(BigInt(1))).toEqual(BigInt(1));
        expect((0, gubu_1.gubu)({})({ x: 1 })).toEqual({ x: 1 });
        expect((0, gubu_1.gubu)([])([1])).toEqual([1]);
        // NOTE: raw function would be a custom validator
        expect((0, gubu_1.gubu)((0, gubu_1.G$)({ v: () => null }))(tmp.f1 = () => false)).toEqual(tmp.f1);
        expect((0, gubu_1.gubu)(Symbol('bar'))(tmp.s0)).toEqual(tmp.s0);
        expect((0, gubu_1.gubu)(new Date())(tmp.d1 = new Date(Date.now() - 1111))).toEqual(tmp.d1);
        expect((0, gubu_1.gubu)(new RegExp('a'))(tmp.r1 = /b/)).toEqual(tmp.r1);
        expect((0, gubu_1.gubu)(new Foo(4))(tmp.c1 = new Foo(5))).toEqual(tmp.c1);
        expect((0, gubu_1.gubu)(new Bar(6))(tmp.c2 = new Bar(7))).toEqual(tmp.c2);
        expect((0, gubu_1.gubu)(null)(null)).toEqual(null);
        expect(() => (0, gubu_1.gubu)(null)(1)).toThrow(/path "".*value "1".*not of type null/);
        expect((0, gubu_1.gubu)((_v, u) => (u.val = 1, true))(null)).toEqual(1);
        // console.log(gubu(Date).spec())
        expect(() => (0, gubu_1.gubu)(String)(1)).toThrow(/path "".*not of type string/);
        expect(() => (0, gubu_1.gubu)(Number)('x')).toThrow(/path "".*not of type number/);
        expect(() => (0, gubu_1.gubu)(Boolean)('x')).toThrow(/path "".*not of type boolean/);
        expect(() => (0, gubu_1.gubu)(BigInt)('x')).toThrow(/path "".*not of type bigint/);
        expect(() => (0, gubu_1.gubu)(Object)('x')).toThrow(/path "".*not of type object/);
        expect(() => (0, gubu_1.gubu)(Array)('x')).toThrow(/path "".*not of type array/);
        expect(() => (0, gubu_1.gubu)(Function)('x')).toThrow(/path "".*not of type function/);
        expect(() => (0, gubu_1.gubu)(Symbol)('x')).toThrow(/path "".*not of type symbol/);
        expect(() => (0, gubu_1.gubu)(Date)(/a/)).toThrow(/path "".*not an instance of Date/);
        expect(() => (0, gubu_1.gubu)(RegExp)(new Date()))
            .toThrow(/path "".*not an instance of RegExp/);
        expect(() => (0, gubu_1.gubu)(Foo)(tmp.c3 = new Bar(8)))
            .toThrow(/path "".*not an instance of Foo/);
        expect(() => (0, gubu_1.gubu)(Bar)(tmp.c4 = new Foo(9)))
            .toThrow(/path "".*not an instance of Bar/);
        // console.log(gubu(new Date()).spec())
        expect(() => (0, gubu_1.gubu)('a')(1)).toThrow(/path "".*not of type string/);
        expect(() => (0, gubu_1.gubu)(0)('x')).toThrow(/path "".*not of type number/);
        expect(() => (0, gubu_1.gubu)(false)('x')).toThrow(/path "".*not of type boolean/);
        expect(() => (0, gubu_1.gubu)(BigInt(-1))('x')).toThrow(/path "".*not of type bigint/);
        expect(() => (0, gubu_1.gubu)({})('x')).toThrow(/path "".* not of type object/);
        expect(() => (0, gubu_1.gubu)([])('x')).toThrow(/path "".*not of type array/);
        expect(() => (0, gubu_1.gubu)((0, gubu_1.G$)({ v: () => null }))('x'))
            .toThrow(/path "".*not of type function/);
        expect(() => (0, gubu_1.gubu)(Symbol('bar'))('x')).toThrow(/path "".*not of type symbol/);
        expect(() => (0, gubu_1.gubu)(new Date())('x')).toThrow(/path "".*not an instance of Date/);
        expect(() => (0, gubu_1.gubu)(new RegExp('a'))('x'))
            .toThrow(/path "".*not an instance of RegExp/);
        expect(() => (0, gubu_1.gubu)(new Foo(4))('a')).toThrow(/path "".*not an instance of Foo/);
        expect(() => (0, gubu_1.gubu)(new Bar(6))('a')).toThrow(/path "".*not an instance of Bar/);
        expect(() => (0, gubu_1.gubu)(new Foo(10))(new Bar(11)))
            .toThrow(/path "".*not an instance of Foo/);
        expect(() => (0, gubu_1.gubu)(new Bar(12))(new Foo(12)))
            .toThrow(/path "".*not an instance of Bar/);
        expect((0, gubu_1.gubu)({ a: String })({ a: 'x' })).toEqual({ a: 'x' });
        expect((0, gubu_1.gubu)({ a: Number })({ a: 1 })).toEqual({ a: 1 });
        expect((0, gubu_1.gubu)({ a: Boolean })({ a: true })).toEqual({ a: true });
        expect((0, gubu_1.gubu)({ a: Object })({ a: { x: 1 } })).toEqual({ a: { x: 1 } });
        expect(() => (0, gubu_1.gubu)({ a: String })({ a: 1 }))
            .toThrow(/path "a".*not of type string/);
        expect(() => (0, gubu_1.gubu)({ a: Number })({ a: 'x' }))
            .toThrow(/path "a".*not of type number/);
        expect(() => (0, gubu_1.gubu)({ a: Boolean })({ a: 'x' }))
            .toThrow(/path "a".*not of type boolean/);
        expect(() => (0, gubu_1.gubu)({ a: Object })({ a: 'x' }))
            .toThrow(/path "a".*not of type object/);
        expect((0, gubu_1.gubu)([String])(['x'])).toEqual(['x']);
        expect((0, gubu_1.gubu)([Number])([1])).toEqual([1]);
        expect((0, gubu_1.gubu)([Boolean])([true])).toEqual([true]);
        expect((0, gubu_1.gubu)([Object])([{ x: 1 }])).toEqual([{ x: 1 }]);
        expect(() => (0, gubu_1.gubu)([String])([1]))
            .toThrow(/path "0".*not of type string/);
        expect(() => (0, gubu_1.gubu)([Number])(['x']))
            .toThrow(/path "0".*not of type number/);
        expect(() => (0, gubu_1.gubu)([Boolean])(['x']))
            .toThrow(/path "0".*not of type boolean/);
        expect(() => (0, gubu_1.gubu)([Object])([1]))
            .toThrow(/path "0".*not of type object/);
    });
    test('buildize-construct', () => {
        const GUBU$ = Symbol.for('gubu$');
        expect((0, gubu_1.Required)('x')).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: 'x',
            r: true,
        });
        expect((0, gubu_1.Optional)(String)).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: '',
            r: false,
        });
        expect((0, gubu_1.Required)((0, gubu_1.Required)('x'))).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: 'x',
            r: true,
        });
        expect((0, gubu_1.Optional)((0, gubu_1.Required)('x'))).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: 'x',
            r: false,
        });
        expect((0, gubu_1.Required)('x').Required()).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: 'x',
            r: true,
        });
        expect((0, gubu_1.Required)('x').Optional()).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: 'x',
            r: false,
        });
        expect((0, gubu_1.Optional)((0, gubu_1.Optional)(String))).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: '',
            r: false,
        });
        expect((0, gubu_1.Optional)(String).Optional()).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: '',
            r: false,
        });
        expect((0, gubu_1.Optional)(String).Required()).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: '',
            r: true,
        });
        expect((0, gubu_1.Required)((0, gubu_1.Optional)(String))).toMatchObject({
            '$': { 'gubu$': GUBU$ },
            t: 'string',
            v: '',
            r: true,
        });
        // console.log(Before(() => true, { a: 1 }))
    });
    test('type-default-optional', () => {
        let f0 = () => true;
        let g0 = (0, gubu_1.gubu)({
            string: 's',
            number: 1,
            boolean: true,
            object: { x: 2 },
            array: [3],
            function: (0, gubu_1.G$)({ t: 'function', v: f0 })
        });
        expect(g0()).toMatchObject({
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
            // function: f0,
        })).toMatchObject({
            string: 'S',
            number: 11,
            boolean: false,
            object: { x: 22 },
            array: [33],
            // function: f0,
        });
        // TODO: fails
    });
    test('type-native-required', () => {
        let g0 = (0, gubu_1.gubu)({
            string: String,
            number: Number,
            boolean: Boolean,
            object: Object,
            array: Array,
            function: Function,
            // TODO: any type? Date, RegExp, Custom ???
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
        let e0 = (0, gubu_1.gubu)({ s0: String, s1: 'x' });
        expect(e0({ s0: 'a' })).toMatchObject({ s0: 'a', s1: 'x' });
        expect(() => e0({ s0: 1 })).toThrow(/Validation failed for path "s0" with value "1" because the value is not of type string\./);
        expect(() => e0({ s1: 1 })).toThrow(/Validation failed for path "s0" with value "" because the value is required\.\nValidation failed for path "s1" with value "1" because the value is not of type string\./);
        // TODO: more fails
    });
    test('type-native-optional', () => {
        let { Optional } = gubu_1.gubu;
        let g0 = (0, gubu_1.gubu)({
            string: Optional(String),
            number: Optional(Number),
            boolean: Optional(Boolean),
            object: Optional(Object),
            array: Optional(Array),
            function: Optional(Function),
            // TODO: any type? Date, RegExp, Custom ???
        });
    });
    test('array-elements', () => {
        let g0 = (0, gubu_1.gubu)({
            a: [String]
        });
        expect(g0({ a: ['X', 'Y'] })).toEqual({ a: ['X', 'Y'] });
        expect(() => g0({ a: ['X', 1] })).toThrow(/Validation failed for path "a.1" with value "1" because the value is not of type string\./);
    });
    test('custom-basic', () => {
        let g0 = (0, gubu_1.gubu)({ a: (v) => v > 10 });
        expect(g0({ a: 11 })).toMatchObject({ a: 11 });
        expect(() => g0({ a: 9 })).toThrow(/Validation failed for path "a" with value "9" because check "custom" failed\./);
        let g1 = (0, gubu_1.gubu)({ a: (0, gubu_1.Optional)((v) => v > 10) });
        expect(g1({ a: 11 })).toMatchObject({ a: 11 });
        expect(() => g1({ a: 9 })).toThrow(/Validation failed for path "a" with value "9" because check "custom" failed\./);
        expect(g1({})).toMatchObject({});
        let g2 = (0, gubu_1.gubu)({ a: (0, gubu_1.Required)((v) => v > 10) });
        expect(g1({ a: 11 })).toMatchObject({ a: 11 });
        expect(() => g2({ a: 9 })).toThrow(/Validation failed for path "a" with value "9" because check "custom" failed\./);
        expect(() => g2({})).toThrow(/Validation failed for path "a" with value "" because check "custom" failed\./);
    });
    test('before-after-basic', () => {
        let g0 = (0, gubu_1.gubu)((0, gubu_1.Before)((val, _update) => {
            val.b = 1 + val.a;
            return true;
        }, { a: 1 })
            .After((val, _update) => {
            val.c = 10 * val.a;
            return true;
        }));
        expect(g0({ a: 2 })).toMatchObject({ a: 2, b: 3, c: 20 });
        let g1 = (0, gubu_1.gubu)({
            x: (0, gubu_1.After)((val, _update) => {
                val.c = 10 * val.a;
                return true;
            }, { a: 1 })
                .Before((val, _update) => {
                val.b = 1 + val.a;
                return true;
            })
        });
        expect(g1({ x: { a: 2 } })).toMatchObject({ x: { a: 2, b: 3, c: 20 } });
    });
    /*
      test('deep-required', () => {
        let { Required } = gubu
     
        let g0 = gubu({
          a: 1,
          b: Required({
            c: [1],
            d: 'x',
            e: {
              f: [{
                g: true,
                h: 2
              }]
            }
          }),
        })
      })
     
    */
    test('deep-object-basic', () => {
        let a1 = (0, gubu_1.gubu)({ a: 1 });
        expect(a1({})).toMatchObject({ a: 1 });
        let ab1 = (0, gubu_1.gubu)({ a: { b: 1 } });
        expect(ab1({})).toMatchObject({ a: { b: 1 } });
        let abc1 = (0, gubu_1.gubu)({ a: { b: { c: 1 } } });
        expect(abc1({})).toMatchObject({ a: { b: { c: 1 } } });
        let ab1c2 = (0, gubu_1.gubu)({ a: { b: 1 }, c: 2 });
        expect(ab1c2({})).toMatchObject({ a: { b: 1 }, c: 2 });
        let ab1cd2 = (0, gubu_1.gubu)({ a: { b: 1 }, c: { d: 2 } });
        expect(ab1cd2({})).toMatchObject({ a: { b: 1 }, c: { d: 2 } });
        let abc1ade2f3 = (0, gubu_1.gubu)({ a: { b: { c: 1 }, d: { e: 2 } }, f: 3 });
        expect(abc1ade2f3({})).toMatchObject({ a: { b: { c: 1 }, d: { e: 2 } }, f: 3 });
        let d0 = (0, gubu_1.gubu)({
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
    test('deep-array-basic', () => {
        let a0 = (0, gubu_1.gubu)([1]);
        // console.dir(a0.spec(), { depth: null })
        expect(a0()).toMatchObject([]);
        expect(a0([])).toMatchObject([]);
        expect(a0([11])).toMatchObject([11]);
        expect(a0([11, 22])).toMatchObject([11, 22]);
        let a1 = (0, gubu_1.gubu)([-1, 1, 2, 3]);
        // console.dir(a1.spec(), { depth: null })
        expect(a1()).toMatchObject([1, 2, 3]);
        expect(a1([])).toMatchObject([1, 2, 3]);
        expect(a1([11])).toMatchObject([11, 2, 3]);
        expect(a1([11, 22])).toMatchObject([11, 22, 3]);
        expect(a1([11, 22, 33])).toMatchObject([11, 22, 33]);
        expect(a1([11, 22, 33, 44])).toMatchObject([11, 22, 33, 44]);
        expect(a1([undefined, 22])).toMatchObject([1, 22, 3]);
    });
    test('closed', () => {
        let g0 = (0, gubu_1.gubu)({
            a: { b: { c: (0, gubu_1.Closed)({ x: 1 }) } }
        });
        expect(g0({ a: { b: { c: { x: 2 } } } })).toEqual({ a: { b: { c: { x: 2 } } } });
        expect(() => g0({ a: { b: { c: { x: 2, y: 3 } } } })).toThrow(/Validation failed for path "a.b.c" with value "{x:2,y:3}" because the property "y" is not allowed\./);
    });
    test('buildize-required', () => {
        let g0 = (0, gubu_1.gubu)({ a: (0, gubu_1.Required)(1) });
        expect(g0({ a: 2 })).toMatchObject({ a: 2 });
        expect(() => g0({ a: 'x' })).toThrow(/number/);
    });
    test('buildize-optional', () => {
        let g0 = (0, gubu_1.gubu)({ a: (0, gubu_1.Optional)(String) });
        expect(g0({ a: 'x' })).toMatchObject({ a: 'x' });
        expect(g0({})).toMatchObject({ a: '' });
        expect(() => g0({ a: 1 })).toThrow(/string/);
    });
    test('buildize-any', () => {
        let g0 = (0, gubu_1.gubu)({ a: (0, gubu_1.Any)(), b: (0, gubu_1.Any)(true) });
        expect(g0({ a: 2, b: 1 })).toMatchObject({ a: 2, b: 1 });
        expect(g0({ a: 'x', b: 'y' })).toMatchObject({ a: 'x', b: 'y' });
        expect(g0({ b: 1 })).toEqual({ b: 1 });
        expect(() => g0({ a: 1 })).toThrow('Validation failed for path "b" with value "" because the value is required');
    });
    test('spec-basic', () => {
        expect((0, gubu_1.gubu)(Number).spec()).toMatchObject({
            $: { gubu$: true, v$: package_json_1.default.version },
            d: 0, k: '', r: true, t: 'number', u: {}, v: 0,
        });
        expect((0, gubu_1.gubu)(String).spec()).toMatchObject({
            $: { gubu$: true, v$: package_json_1.default.version },
            d: 0, k: '', r: true, t: 'string', u: {}, v: '',
        });
        expect((0, gubu_1.gubu)(BigInt).spec()).toMatchObject({
            $: { gubu$: true, v$: package_json_1.default.version },
            d: 0, k: '', r: true, t: 'bigint', u: {}, v: "0",
        });
        expect((0, gubu_1.gubu)(null).spec()).toMatchObject({
            $: { gubu$: true, v$: package_json_1.default.version },
            d: 0, k: '', r: false, t: 'null', u: {}, v: null,
        });
    });
    test('spec-roundtrip', () => {
        let m0 = { a: 1 };
        let g0 = (0, gubu_1.gubu)(m0);
        // console.log('m0 A', m0)
        expect(m0).toEqual({ a: 1 });
        expect(g0({ a: 2 })).toEqual({ a: 2 });
        expect(m0).toEqual({ a: 1 });
        // console.log('m0 B', m0)
        let s0 = g0.spec();
        expect(m0).toEqual({ a: 1 });
        // console.log('m0 C', m0)
        let s0s = {
            $: {
                gubu$: true,
                v$: package_json_1.default.version,
            },
            // d: -1,
            d: 0,
            k: '',
            r: false,
            t: 'object',
            u: {},
            v: {
                a: {
                    $: {
                        gubu$: true,
                        v$: package_json_1.default.version,
                    },
                    d: 1,
                    k: 'a',
                    r: false,
                    t: 'number',
                    u: {},
                    v: 1,
                },
            },
        };
        expect(s0).toEqual(s0s);
        expect(g0({ a: 2 })).toEqual({ a: 2 });
        let g0r = (0, gubu_1.gubu)(s0);
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
        let g1 = (0, gubu_1.gubu)(m1);
        expect(g1({ a: [2] })).toEqual({ a: [2] });
        expect(m1).toEqual({ a: [1] });
        let s1 = g1.spec();
        let s1s = {
            $: {
                gubu$: true,
                v$: package_json_1.default.version,
            },
            // d: -1,
            d: 0,
            k: '',
            r: false,
            t: 'object',
            u: {},
            v: {
                a: {
                    $: {
                        gubu$: true,
                        v$: package_json_1.default.version,
                    },
                    d: 1,
                    k: 'a',
                    r: false,
                    t: 'array',
                    u: {},
                    v: {
                        0: {
                            $: {
                                gubu$: true,
                                v$: package_json_1.default.version,
                            },
                            d: 2,
                            k: '0',
                            r: false,
                            t: 'number',
                            u: {},
                            v: 1,
                        },
                    },
                },
            },
        };
        expect(s1).toEqual(s1s);
        let g1r = (0, gubu_1.gubu)(s1);
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
});
//# sourceMappingURL=gubu.test.js.map