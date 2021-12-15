"use strict";
/* Copyright (c) 2021 Richard Rodger and other contributors, MIT License */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const package_json_1 = __importDefault(require("../package.json"));
const gubu_1 = require("../gubu");
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
describe('gubu', () => {
    test('happy', () => {
        expect((0, gubu_1.Gubu)()).toBeDefined();
        expect((0, gubu_1.Gubu)().toString()).toMatch(/\[Gubu \d+\]/);
        expect((0, gubu_1.Gubu)(undefined, { name: 'foo' }).toString()).toMatch(/\[Gubu foo\]/);
        let g0 = (0, gubu_1.Gubu)({
            a: 'foo',
            b: 100
        });
        expect(g0({})).toEqual({ a: 'foo', b: 100 });
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
        let tmp = {};
        expect((0, gubu_1.Gubu)(String)('x')).toEqual('x');
        expect((0, gubu_1.Gubu)(Number)(1)).toEqual(1);
        expect((0, gubu_1.Gubu)(Boolean)(true)).toEqual(true);
        expect((0, gubu_1.Gubu)(BigInt)(BigInt(1))).toEqual(BigInt(1));
        expect((0, gubu_1.Gubu)(Object)({ x: 1 })).toEqual({ x: 1 });
        expect((0, gubu_1.Gubu)(Array)([1])).toEqual([1]);
        expect((0, gubu_1.Gubu)(Function)(tmp.f0 = () => true)).toEqual(tmp.f0);
        expect((0, gubu_1.Gubu)(Symbol)(tmp.s0 = Symbol('foo'))).toEqual(tmp.s0);
        expect((0, gubu_1.Gubu)(Date)(tmp.d0 = new Date())).toEqual(tmp.d0);
        expect((0, gubu_1.Gubu)(RegExp)(tmp.r0 = /a/)).toEqual(tmp.r0);
        expect((0, gubu_1.Gubu)(Foo)(tmp.c0 = new Foo(2))).toEqual(tmp.c0);
        // console.log(gubu(new Date()).spec())
        expect((0, gubu_1.Gubu)('a')('x')).toEqual('x');
        expect((0, gubu_1.Gubu)(0)(1)).toEqual(1);
        expect((0, gubu_1.Gubu)(false)(true)).toEqual(true);
        expect((0, gubu_1.Gubu)(BigInt(-1))(BigInt(1))).toEqual(BigInt(1));
        expect((0, gubu_1.Gubu)({})({ x: 1 })).toEqual({ x: 1 });
        expect((0, gubu_1.Gubu)([])([1])).toEqual([1]);
        // NOTE: raw function would be a custom validator
        expect((0, gubu_1.Gubu)((0, gubu_1.G$)({ v: () => null }))(tmp.f1 = () => false)).toEqual(tmp.f1);
        expect((0, gubu_1.Gubu)(Symbol('bar'))(tmp.s0)).toEqual(tmp.s0);
        expect((0, gubu_1.Gubu)(new Date())(tmp.d1 = new Date(Date.now() - 1111))).toEqual(tmp.d1);
        expect((0, gubu_1.Gubu)(new RegExp('a'))(tmp.r1 = /b/)).toEqual(tmp.r1);
        expect((0, gubu_1.Gubu)(new Foo(4))(tmp.c1 = new Foo(5))).toEqual(tmp.c1);
        expect((0, gubu_1.Gubu)(new Bar(6))(tmp.c2 = new Bar(7))).toEqual(tmp.c2);
        expect((0, gubu_1.Gubu)(null)(null)).toEqual(null);
        expect(() => (0, gubu_1.Gubu)(null)(1)).toThrow(/path "".*value "1".*not of type null/);
        expect((0, gubu_1.Gubu)((_v, u) => (u.val = 1, true))(null)).toEqual(1);
        // console.log(gubu(Date).spec())
        expect(() => (0, gubu_1.Gubu)(String)(1)).toThrow(/path "".*not of type string/);
        expect(() => (0, gubu_1.Gubu)(Number)('x')).toThrow(/path "".*not of type number/);
        expect(() => (0, gubu_1.Gubu)(Boolean)('x')).toThrow(/path "".*not of type boolean/);
        expect(() => (0, gubu_1.Gubu)(BigInt)('x')).toThrow(/path "".*not of type bigint/);
        expect(() => (0, gubu_1.Gubu)(Object)('x')).toThrow(/path "".*not of type object/);
        expect(() => (0, gubu_1.Gubu)(Array)('x')).toThrow(/path "".*not of type array/);
        expect(() => (0, gubu_1.Gubu)(Function)('x')).toThrow(/path "".*not of type function/);
        expect(() => (0, gubu_1.Gubu)(Symbol)('x')).toThrow(/path "".*not of type symbol/);
        expect(() => (0, gubu_1.Gubu)(Date)(/a/)).toThrow(/path "".*not an instance of Date/);
        expect(() => (0, gubu_1.Gubu)(RegExp)(new Date()))
            .toThrow(/path "".*not an instance of RegExp/);
        expect(() => (0, gubu_1.Gubu)(Foo)(tmp.c3 = new Bar(8)))
            .toThrow(/path "".*not an instance of Foo/);
        expect(() => (0, gubu_1.Gubu)(Bar)(tmp.c4 = new Foo(9)))
            .toThrow(/path "".*not an instance of Bar/);
        // console.log(gubu(new Date()).spec())
        expect(() => (0, gubu_1.Gubu)('a')(1)).toThrow(/path "".*not of type string/);
        expect(() => (0, gubu_1.Gubu)(0)('x')).toThrow(/path "".*not of type number/);
        expect(() => (0, gubu_1.Gubu)(false)('x')).toThrow(/path "".*not of type boolean/);
        expect(() => (0, gubu_1.Gubu)(BigInt(-1))('x')).toThrow(/path "".*not of type bigint/);
        expect(() => (0, gubu_1.Gubu)({})('x')).toThrow(/path "".* not of type object/);
        expect(() => (0, gubu_1.Gubu)([])('x')).toThrow(/path "".*not of type array/);
        expect(() => (0, gubu_1.Gubu)((0, gubu_1.G$)({ v: () => null }))('x'))
            .toThrow(/path "".*not of type function/);
        expect(() => (0, gubu_1.Gubu)(Symbol('bar'))('x')).toThrow(/path "".*not of type symbol/);
        expect(() => (0, gubu_1.Gubu)(new Date())('x')).toThrow(/path "".*not an instance of Date/);
        expect(() => (0, gubu_1.Gubu)(new RegExp('a'))('x'))
            .toThrow(/path "".*not an instance of RegExp/);
        expect(() => (0, gubu_1.Gubu)(new Foo(4))('a')).toThrow(/path "".*not an instance of Foo/);
        expect(() => (0, gubu_1.Gubu)(new Bar(6))('a')).toThrow(/path "".*not an instance of Bar/);
        expect(() => (0, gubu_1.Gubu)(new Foo(10))(new Bar(11)))
            .toThrow(/path "".*not an instance of Foo/);
        expect(() => (0, gubu_1.Gubu)(new Bar(12))(new Foo(12)))
            .toThrow(/path "".*not an instance of Bar/);
        expect((0, gubu_1.Gubu)({ a: String })({ a: 'x' })).toEqual({ a: 'x' });
        expect((0, gubu_1.Gubu)({ a: Number })({ a: 1 })).toEqual({ a: 1 });
        expect((0, gubu_1.Gubu)({ a: Boolean })({ a: true })).toEqual({ a: true });
        expect((0, gubu_1.Gubu)({ a: Object })({ a: { x: 1 } })).toEqual({ a: { x: 1 } });
        expect(() => (0, gubu_1.Gubu)({ a: String })({ a: 1 }))
            .toThrow(/path "a".*not of type string/);
        expect(() => (0, gubu_1.Gubu)({ a: Number })({ a: 'x' }))
            .toThrow(/path "a".*not of type number/);
        expect(() => (0, gubu_1.Gubu)({ a: Boolean })({ a: 'x' }))
            .toThrow(/path "a".*not of type boolean/);
        expect(() => (0, gubu_1.Gubu)({ a: Object })({ a: 'x' }))
            .toThrow(/path "a".*not of type object/);
        expect((0, gubu_1.Gubu)([String])(['x'])).toEqual(['x']);
        expect((0, gubu_1.Gubu)([Number])([1])).toEqual([1]);
        expect((0, gubu_1.Gubu)([Boolean])([true])).toEqual([true]);
        expect((0, gubu_1.Gubu)([Object])([{ x: 1 }])).toEqual([{ x: 1 }]);
        expect(() => (0, gubu_1.Gubu)([String])([1]))
            .toThrow(/path "0".*not of type string/);
        expect(() => (0, gubu_1.Gubu)([Number])(['x']))
            .toThrow(/path "0".*not of type number/);
        expect(() => (0, gubu_1.Gubu)([Boolean])(['x']))
            .toThrow(/path "0".*not of type boolean/);
        expect(() => (0, gubu_1.Gubu)([Object])([1]))
            .toThrow(/path "0".*not of type object/);
    });
    test('shapes-fails', () => {
        let tmp = {};
        let string0 = (0, gubu_1.Gubu)(String);
        expect(string0('x')).toEqual('x');
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
        let number0 = (0, gubu_1.Gubu)(Number);
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
        let object0 = (0, gubu_1.Gubu)(Object);
        expect(object0({})).toEqual({});
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
        let array0 = (0, gubu_1.Gubu)(Array);
        expect(array0([])).toEqual([]);
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
    test('shapes-edges', () => {
        // NaN is actually Not-a-Number (whereas 'number' === typeof(NaN))
        const num0 = (0, gubu_1.Gubu)(1);
        expect(num0(1)).toEqual(1);
        expect(() => num0(NaN)).toThrow(/not of type number/);
        const nan0 = (0, gubu_1.Gubu)(NaN);
        expect(nan0(NaN)).toEqual(NaN);
        expect(() => nan0(1)).toThrow(/not of type nan/);
        // Empty strings only allowed by Empty() builder.
        const rs0 = (0, gubu_1.Gubu)(String);
        expect(() => rs0('')).toThrow('Validation failed for path "" with value "" because the value is required.');
        const rs0e = (0, gubu_1.Gubu)((0, gubu_1.Empty)(String));
        expect(rs0e('')).toEqual('');
        const os0 = (0, gubu_1.Gubu)('x');
        expect(os0('')).toEqual('x');
        const os0e = (0, gubu_1.Gubu)((0, gubu_1.Empty)('x'));
        expect(os0e('')).toEqual('');
    });
    test('builder-construct', () => {
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
        let g0 = (0, gubu_1.Gubu)({
            string: 's',
            number: 1,
            boolean: true,
            object: { x: 2 },
            array: [3],
            function: (0, gubu_1.G$)({ t: 'function', v: f0 })
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
        let g0 = (0, gubu_1.Gubu)({
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
        let e0 = (0, gubu_1.Gubu)({ s0: String, s1: 'x' });
        expect(e0({ s0: 'a' })).toMatchObject({ s0: 'a', s1: 'x' });
        expect(() => e0({ s0: 1 })).toThrow(/Validation failed for path "s0" with value "1" because the value is not of type string\./);
        expect(() => e0({ s1: 1 })).toThrow(/Validation failed for path "s0" with value "" because the value is required\.\nValidation failed for path "s1" with value "1" because the value is not of type string\./);
        // TODO: more fails
    });
    test('type-native-optional', () => {
        let { Optional } = gubu_1.Gubu;
        let g0 = (0, gubu_1.Gubu)({
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
        let g0 = (0, gubu_1.Gubu)({
            a: [String]
        });
        expect(g0({ a: ['X', 'Y'] })).toEqual({ a: ['X', 'Y'] });
        expect(() => g0({ a: ['X', 1] })).toThrow(/Validation failed for path "a.1" with value "1" because the value is not of type string\./);
        let g1 = (0, gubu_1.Gubu)([String]);
        expect(g1(['X', 'Y'])).toEqual(['X', 'Y']);
        expect(() => g1(['X', 1])).toThrow(/Validation failed for path "1" with value "1" because the value is not of type string\./);
        let g2 = (0, gubu_1.Gubu)([(0, gubu_1.Any)(), { x: 1 }, { y: true }]);
        expect(g2([{ x: 2 }, { y: false }])).toEqual([{ x: 2 }, { y: false }]);
        expect(g2([{ x: 2 }, { y: false }, 'Q'])).toEqual([{ x: 2 }, { y: false }, 'Q']);
        expect(() => g2([{ x: 'X' }, { y: false }])).toThrow('Validation failed for path "0.x" with value "X" because the value is not of type number.');
        expect(() => g2(['Q', { y: false }])).toThrow('Validation failed for path "0" with value "Q" because the value is not of type object.');
        expect(g2([{ x: 2 }])).toEqual([{ x: 2 }, { y: true }]);
        expect(g2([undefined, { y: false }, 'Q'])).toEqual([{ x: 1 }, { y: false }, 'Q']);
    });
    test('custom-basic', () => {
        let g0 = (0, gubu_1.Gubu)({ a: (v) => v > 10 });
        expect(g0({ a: 11 })).toMatchObject({ a: 11 });
        expect(() => g0({ a: 9 })).toThrow(/Validation failed for path "a" with value "9" because check "custom" failed\./);
        let g1 = (0, gubu_1.Gubu)({ a: (0, gubu_1.Optional)((v) => v > 10) });
        expect(g1({ a: 11 })).toMatchObject({ a: 11 });
        expect(() => g1({ a: 9 })).toThrow(/Validation failed for path "a" with value "9" because check "custom" failed\./);
        expect(g1({})).toMatchObject({});
        let g2 = (0, gubu_1.Gubu)({ a: (0, gubu_1.Required)((v) => v > 10) });
        expect(g1({ a: 11 })).toMatchObject({ a: 11 });
        expect(() => g2({ a: 9 })).toThrow(/Validation failed for path "a" with value "9" because check "custom" failed\./);
        expect(() => g2({})).toThrow(/Validation failed for path "a" with value "" because check "custom" failed\./);
    });
    test('builder-before-after-basic', () => {
        let g0 = (0, gubu_1.Gubu)((0, gubu_1.Before)((val, _update) => {
            val.b = 1 + val.a;
            return true;
        }, { a: 1 })
            .After((val, _update) => {
            val.c = 10 * val.a;
            return true;
        }));
        expect(g0({ a: 2 })).toMatchObject({ a: 2, b: 3, c: 20 });
        let g1 = (0, gubu_1.Gubu)({
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
        let a1 = (0, gubu_1.Gubu)({ a: 1 });
        expect(a1({})).toMatchObject({ a: 1 });
        let ab1 = (0, gubu_1.Gubu)({ a: { b: 1 } });
        expect(ab1({})).toMatchObject({ a: { b: 1 } });
        let abc1 = (0, gubu_1.Gubu)({ a: { b: { c: 1 } } });
        expect(abc1({})).toMatchObject({ a: { b: { c: 1 } } });
        let ab1c2 = (0, gubu_1.Gubu)({ a: { b: 1 }, c: 2 });
        expect(ab1c2({})).toMatchObject({ a: { b: 1 }, c: 2 });
        let ab1cd2 = (0, gubu_1.Gubu)({ a: { b: 1 }, c: { d: 2 } });
        expect(ab1cd2({})).toMatchObject({ a: { b: 1 }, c: { d: 2 } });
        let abc1ade2f3 = (0, gubu_1.Gubu)({ a: { b: { c: 1 }, d: { e: 2 } }, f: 3 });
        expect(abc1ade2f3({})).toMatchObject({ a: { b: { c: 1 }, d: { e: 2 } }, f: 3 });
        let d0 = (0, gubu_1.Gubu)({
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
        let a0 = (0, gubu_1.Gubu)([1]);
        // console.dir(a0.spec(), { depth: null })
        expect(a0()).toMatchObject([]);
        expect(a0([])).toMatchObject([]);
        expect(a0([11])).toMatchObject([11]);
        expect(a0([11, 22])).toMatchObject([11, 22]);
        let a1 = (0, gubu_1.Gubu)([-1, 1, 2, 3]);
        // console.dir(a1.spec(), { depth: null })
        expect(a1()).toMatchObject([1, 2, 3]);
        expect(a1([])).toMatchObject([1, 2, 3]);
        expect(a1([11])).toMatchObject([11, 2, 3]);
        expect(a1([11, 22])).toMatchObject([11, 22, 3]);
        expect(a1([11, 22, 33])).toMatchObject([11, 22, 33]);
        expect(a1([11, 22, 33, 44])).toMatchObject([11, 22, 33, 44]);
        expect(a1([undefined, 22])).toMatchObject([1, 22, 3]);
    });
    test('builder-required', () => {
        let g0 = (0, gubu_1.Gubu)({ a: (0, gubu_1.Required)({ x: 1 }) });
        expect(g0({ a: { x: 1 } })).toEqual({ a: { x: 1 } });
        expect(() => g0({})).toThrow('Validation failed for path "a" with value "" because the value is required.');
        let g1 = (0, gubu_1.Gubu)({ a: (0, gubu_1.Required)([1]) });
        expect(g1({ a: [11] })).toEqual({ a: [11] });
        expect(() => g1({})).toThrow('Validation failed for path "a" with value "" because the value is required.');
    });
    test('builder-closed', () => {
        let tmp = {};
        let g0 = (0, gubu_1.Gubu)({ a: { b: { c: (0, gubu_1.Closed)({ x: 1 }) } } });
        expect(g0({ a: { b: { c: { x: 2 } } } })).toEqual({ a: { b: { c: { x: 2 } } } });
        expect(() => g0({ a: { b: { c: { x: 2, y: 3 } } } })).toThrow(/Validation failed for path "a.b.c" with value "{x:2,y:3}" because the property "y" is not allowed\./);
        let g1 = (0, gubu_1.Gubu)((0, gubu_1.Closed)([(0, gubu_1.Any)(), Date, RegExp]));
        expect(g1(tmp.a0 = [new Date(), /a/])).toEqual(tmp.a0);
        expect(() => g1([new Date(), /a/, 'Q'])).toThrow(/Validation failed for path "" with value "\[[^Z]+Z,{},Q\]" /); // because the property "2" is not allowed\./)
    });
    test('builder-one', () => {
        let g0 = (0, gubu_1.Gubu)({ a: (0, gubu_1.One)(Number, String) });
        expect(g0({ a: 1 })).toEqual({ a: 1 });
        expect(g0({ a: 'x' })).toEqual({ a: 'x' });
        expect(() => g0({ a: true })).toThrow('Validation failed for path "a" with value "true" because the value is not of type number.\nValidation failed for path "a" with value "true" because the value is not of type string.');
        let g1 = (0, gubu_1.Gubu)((0, gubu_1.One)(Number, String));
        expect(g1(1)).toEqual(1);
        expect(g1('x')).toEqual('x');
        expect(() => g1(true)).toThrow('Validation failed for path "" with value "true" because the value is not of type number.\nValidation failed for path "" with value "true" because the value is not of type string.');
        let g2 = (0, gubu_1.Gubu)([(0, gubu_1.One)(Number, String)]);
        expect(g2([1])).toEqual([1]);
        expect(g2(['x'])).toEqual(['x']);
        expect(g2([1, 2])).toEqual([1, 2]);
        expect(g2([1, 'x'])).toEqual([1, 'x']);
        expect(g2(['x', 1])).toEqual(['x', 1]);
        expect(g2(['x', 'y'])).toEqual(['x', 'y']);
        expect(g2(['x', 1, 'y', 2])).toEqual(['x', 1, 'y', 2]);
        expect(() => g2([true])).toThrow('Validation failed for path "0" with value "true" because the value is not of type number.\nValidation failed for path "0" with value "true" because the value is not of type string.');
        let g3 = (0, gubu_1.Gubu)({ a: [(0, gubu_1.One)(Number, String)] });
        expect(g3({ a: [1] })).toEqual({ a: [1] });
        expect(g3({ a: ['x'] })).toEqual({ a: ['x'] });
        expect(g3({ a: ['x', 1, 'y', 2] })).toEqual({ a: ['x', 1, 'y', 2] });
        expect(() => g3({ a: [1, 2, true] })).toThrow('Validation failed for path "a.2" with value "true" because the value is not of type number.\nValidation failed for path "a.2" with value "true" because the value is not of type string.');
        let g4 = (0, gubu_1.Gubu)({ a: [(0, gubu_1.One)({ x: 1 }, { x: 'X' })] });
        expect(g4({ a: [{ x: 2 }, { x: 'Q' }, { x: 3, y: true }, { x: 'W', y: false }] }))
            .toEqual({ a: [{ x: 2 }, { x: 'Q' }, { x: 3, y: true }, { x: 'W', y: false }] });
        let g5 = (0, gubu_1.Gubu)({ a: [(0, gubu_1.One)({ x: 1 }, (0, gubu_1.Closed)({ x: 'X' }))] });
        expect(g5({ a: [{ x: 2 }, { x: 'Q' }] }))
            .toEqual({ a: [{ x: 2 }, { x: 'Q' }] });
    });
    // test('builder-some', () => {
    //   let g0 = gubu({ a: Some(Number, String) })
    //   expect(g0({ a: 1 })).toEqual({ a: 1 })
    //   expect(g0({ a: 'x' })).toEqual({ a: 'x' })
    //   expect(() => g0({ a: true })).toThrow('Validation failed for path "a" with value "true" because the value is not of type number.\nValidation failed for path "a" with value "true" because the value is not of type string.')
    //   let g1 = gubu(Some(Number, String))
    //   expect(g1(1)).toEqual(1)
    //   expect(g1('x')).toEqual('x')
    //   expect(() => g1(true)).toThrow('Validation failed for path "" with value "true" because the value is not of type number.\nValidation failed for path "" with value "true" because the value is not of type string.')
    //   let g2 = gubu([Some(Number, String)])
    //   expect(g2([1])).toEqual([1])
    //   expect(g2(['x'])).toEqual(['x'])
    //   expect(g2([1, 2])).toEqual([1, 2])
    //   expect(g2([1, 'x'])).toEqual([1, 'x'])
    //   expect(g2(['x', 1])).toEqual(['x', 1])
    //   expect(g2(['x', 'y'])).toEqual(['x', 'y'])
    //   expect(g2(['x', 1, 'y', 2])).toEqual(['x', 1, 'y', 2])
    //   expect(() => g2([true])).toThrow('Validation failed for path "0" with value "true" because the value is not of type number.\nValidation failed for path "0" with value "true" because the value is not of type string.')
    //   let g3 = gubu({ a: [Some(Number, String)] })
    //   expect(g3({ a: [1] })).toEqual({ a: [1] })
    //   expect(g3({ a: ['x'] })).toEqual({ a: ['x'] })
    //   expect(g3({ a: ['x', 1, 'y', 2] })).toEqual({ a: ['x', 1, 'y', 2] })
    //   expect(() => g3({ a: [1, 2, true] })).toThrow('Validation failed for path "a.2" with value "true" because the value is not of type number.\nValidation failed for path "a.2" with value "true" because the value is not of type string.')
    //   let g4 = gubu({ a: [Some({ x: 1 }, { x: 'X' })] })
    //   expect(g4({ a: [{ x: 2 }, { x: 'Q' }, { x: 3, y: true }, { x: 'W', y: false }] }))
    //     .toEqual({ a: [{ x: 2 }, { x: 'Q' }, { x: 3, y: true }, { x: 'W', y: false }] })
    //   let g5 = gubu({ a: [Some({ x: 1 }, Closed({ x: 'X' }))] })
    //   expect(g5({ a: [{ x: 2 }, { x: 'Q' }] }))
    //     .toEqual({ a: [{ x: 2 }, { x: 'Q' }] })
    // })
    test('builder-all', () => {
        let g0 = (0, gubu_1.Gubu)((0, gubu_1.All)({ x: 1 }, { y: 'a' }));
        expect(g0({ x: 1, y: 'a' })).toEqual({ x: 1, y: 'a' });
        expect(() => g0({ x: 'b', y: 'a' })).toThrow('Validation failed for path "x" with value "b" because the value is not of type number.');
        let g1 = (0, gubu_1.Gubu)({ a: (0, gubu_1.All)((v) => v > 10, (v) => v < 20) });
        expect(g1({ a: 11 })).toEqual({ a: 11 });
        expect(() => g1({ a: 0 })).toThrow('Validation failed for path "a" with value "0" because check "custom" failed.');
    });
    test('builder-custom-between', () => {
        const rangeCheck = (0, gubu_1.Gubu)([(0, gubu_1.None)(), Number, Number]);
        const Between = function (inopts, spec) {
            let vs = (0, gubu_1.buildize)(this || spec);
            let range = rangeCheck(inopts);
            vs.b = (val, update, state) => {
                // Don't run any more checks after this.
                update.done = true;
                if ('number' === typeof (val) && range[0] < val && val < range[1]) {
                    return true;
                }
                else {
                    update.err = [
                        (0, gubu_1.makeErr)(val, state, `Value "$VALUE" for path "$PATH" is ` +
                            `not between ${range[0]} and ${range[1]}.`)
                    ];
                    return false;
                }
            };
            return vs;
        };
        const g0 = (0, gubu_1.Gubu)({ a: [Between([10, 20])] });
        expect(g0({ a: [11, 12, 13] })).toEqual({ a: [11, 12, 13] });
        expect(() => g0({ a: [11, 9, 13, 'y'] })).toThrow('Value "9" for path "a.1" is not between 10 and 20.\nValue "y" for path "a.3" is not between 10 and 20.');
    });
    test('builder-required', () => {
        let g0 = (0, gubu_1.Gubu)({ a: (0, gubu_1.Required)(1) });
        expect(g0({ a: 2 })).toMatchObject({ a: 2 });
        expect(() => g0({ a: 'x' })).toThrow(/number/);
    });
    test('builder-optional', () => {
        let g0 = (0, gubu_1.Gubu)({ a: (0, gubu_1.Optional)(String) });
        expect(g0({ a: 'x' })).toMatchObject({ a: 'x' });
        expect(g0({})).toMatchObject({ a: '' });
        expect(() => g0({ a: 1 })).toThrow(/string/);
    });
    test('builder-any', () => {
        let g0 = (0, gubu_1.Gubu)({ a: (0, gubu_1.Any)(), b: (0, gubu_1.Any)('B') });
        expect(g0({ a: 2, b: 1 })).toMatchObject({ a: 2, b: 1 });
        expect(g0({ a: 'x', b: 'y' })).toMatchObject({ a: 'x', b: 'y' });
        expect(g0({ b: 1 })).toEqual({ b: 1 });
        expect(g0({ a: 1, b: 'B' })).toEqual({ a: 1, b: 'B' });
    });
    test('builder-none', () => {
        let g0 = (0, gubu_1.Gubu)((0, gubu_1.None)());
        expect(() => g0(1)).toThrow('Validation failed for path "" with value "1" because no value is allowed.');
        let g1 = (0, gubu_1.Gubu)({ a: (0, gubu_1.None)() });
        expect(() => g1({ a: 'x' })).toThrow('Validation failed for path "a" with value "x" because no value is allowed.');
        // Another way to do closed arrays.
        let g2 = (0, gubu_1.Gubu)([(0, gubu_1.None)(), 1, 'x']);
        expect(g2([2, 'y'])).toEqual([2, 'y']);
        expect(() => g2([2, 'y', true])).toThrow('Validation failed for path "2" with value "true" because no value is allowed.');
    });
    test('builder-rename', () => {
        let g0 = (0, gubu_1.Gubu)({ a: (0, gubu_1.Rename)('b', { x: 1 }) });
        expect(g0({ a: { x: 2 } })).toMatchObject({ b: { x: 2 } });
    });
    test('builder-define-refer-basic', () => {
        let g0 = (0, gubu_1.Gubu)({ a: (0, gubu_1.Define)('A', { x: 1 }), b: (0, gubu_1.Refer)('A'), c: (0, gubu_1.Refer)('A') });
        // console.log(g0.spec())
        expect(g0({ a: { x: 2 }, b: { x: 2 } }))
            .toEqual({ a: { x: 2 }, b: { x: 2 } });
        expect(g0({ a: { x: 33 }, b: { x: 44 }, c: { x: 55 } }))
            .toEqual({ a: { x: 33 }, b: { x: 44 }, c: { x: 55 } });
        expect(() => g0({ a: { x: 33 }, b: { x: 'X' } }))
            .toThrow('Validation failed for path "b.x" with value "X" because the value is not of type number.');
        let g1 = (0, gubu_1.Gubu)({
            a: (0, gubu_1.Define)('A', { x: 1 }),
            b: (0, gubu_1.Refer)('A'),
            c: (0, gubu_1.Refer)({ name: 'A', fill: true })
        });
        expect(g1({ a: { x: 2 }, b: { x: 2 } }))
            .toEqual({ a: { x: 2 }, b: { x: 2 } });
        expect(g1({ a: { x: 2 }, b: { x: 2 }, c: {} }))
            .toEqual({ a: { x: 2 }, b: { x: 2 }, c: { x: 1 } });
        expect(g1({ a: { x: 33 }, b: { x: 44 }, c: { x: 2 } }))
            .toEqual({ a: { x: 33 }, b: { x: 44 }, c: { x: 2 } });
    });
    test('builder-define-refer-recursive', () => {
        let g0 = (0, gubu_1.Gubu)({
            a: (0, gubu_1.Define)('A', {
                b: {
                    c: 1,
                    a: (0, gubu_1.Refer)('A')
                }
            }),
        });
        expect(g0({
            a: {
                b: {
                    c: 2,
                }
            }
        })).toEqual({
            a: {
                b: {
                    c: 2,
                }
            }
        });
        expect(g0({
            a: {
                b: {
                    c: 2,
                    a: {
                        b: {
                            c: 3
                        }
                    }
                }
            }
        })).toEqual({
            a: {
                b: {
                    c: 2,
                    a: {
                        b: {
                            c: 3
                        }
                    }
                }
            }
        });
        expect(() => g0({
            a: {
                b: {
                    c: 2,
                    a: {
                        b: {
                            c: 'C'
                        }
                    }
                }
            }
        })).toThrow('Validation failed for path "a.b.a.b.c" with value "C" because the value is not of type number.');
        expect(g0({
            a: {
                b: {
                    c: 2,
                    a: {
                        b: {
                            c: 3,
                            a: {
                                b: {
                                    c: 4
                                }
                            }
                        }
                    }
                }
            }
        })).toEqual({
            a: {
                b: {
                    c: 2,
                    a: {
                        b: {
                            c: 3,
                            a: {
                                b: {
                                    c: 4
                                }
                            }
                        }
                    }
                }
            }
        });
    });
    test('error-path', () => {
        // let g0 = gubu({ a: { b: String } })
        // expect(g0({ a: { b: 'x' } })).toEqual({ a: { b: 'x' } })
        // expect(() => g0(1)).toThrow('path ""')
        // expect(() => g0({ a: 1 })).toThrow('path "a"')
        // expect(() => g0({ a: { b: 1 } })).toThrow('path "a.b"')
        // expect(() => g0({ a: { b: { c: 1 } } })).toThrow('path "a.b"')
        let g1 = (0, gubu_1.Gubu)(String);
        // expect(g1('x')).toEqual('x')
        // expect(() => g1(1)).toThrow('path ""')
        // expect(() => g1(true)).toThrow('path ""')
        // expect(() => g1(null)).toThrow('path ""')
        // expect(() => g1(undefined)).toThrow('path ""')
        // expect(() => g1([])).toThrow('path ""')
        expect(() => g1({})).toThrow('path ""');
        // expect(() => g1(new Date())).toThrow('path ""')
    });
    test('error-desc', () => {
        const g0 = (0, gubu_1.Gubu)(NaN);
        let err = [];
        let o0 = g0(1, { err });
        expect(o0).toEqual(1);
        expect(err).toMatchObject([{
                n: { t: 'nan', v: NaN, r: false, k: '', d: 0, u: {} },
                s: 1,
                p: '',
                w: 'type',
                m: 1050,
                t: 'Validation failed for path "" with value "1" because the value is not of type nan.'
            }]);
        try {
            g0(1, { a: 'A' });
        }
        catch (e) {
            expect(e.message).toEqual('Validation failed for path "" with value "1" because the value is not of type nan.');
            expect(e.code).toEqual('shape');
            expect(e.gubu).toEqual(true);
            expect(e.name).toEqual('GubuError');
            expect(e.desc()).toMatchObject({
                code: 'shape',
                ctx: { a: 'A' },
                err: [
                    {
                        n: { t: 'nan', v: NaN, r: false, k: '', d: 0, u: {} },
                        s: 1,
                        p: '',
                        w: 'type',
                        m: 1050,
                        t: 'Validation failed for path "" with value "1" because the value is not of type nan.'
                    }
                ]
            });
            expect(JSON.stringify(e)).toEqual("{\"gubu\":true,\"name\":\"GubuError\",\"code\":\"shape\",\"err\":[{\"n\":{\"$\":{\"v$\":\"" + package_json_1.default.version + "\"},\"t\":\"nan\",\"v\":null,\"r\":false,\"k\":\"\",\"d\":0,\"u\":{}},\"s\":1,\"p\":\"\",\"w\":\"type\",\"m\":1050,\"t\":\"Validation failed for path \\\"\\\" with value \\\"1\\\" because the value is not of type nan.\"}],\"message\":\"Validation failed for path \\\"\\\" with value \\\"1\\\" because the value is not of type nan.\"}");
        }
    });
    test('spec-basic', () => {
        expect((0, gubu_1.Gubu)(Number).spec()).toMatchObject({
            $: { gubu$: true, v$: package_json_1.default.version },
            d: 0, k: '', r: true, t: 'number', u: {}, v: 0,
        });
        expect((0, gubu_1.Gubu)(String).spec()).toMatchObject({
            $: { gubu$: true, v$: package_json_1.default.version },
            d: 0, k: '', r: true, t: 'string', u: {}, v: '',
        });
        expect((0, gubu_1.Gubu)(BigInt).spec()).toMatchObject({
            $: { gubu$: true, v$: package_json_1.default.version },
            d: 0, k: '', r: true, t: 'bigint', u: {}, v: "0",
        });
        expect((0, gubu_1.Gubu)(null).spec()).toMatchObject({
            $: { gubu$: true, v$: package_json_1.default.version },
            d: 0, k: '', r: false, t: 'null', u: {}, v: null,
        });
    });
    test('spec-roundtrip', () => {
        let m0 = { a: 1 };
        let g0 = (0, gubu_1.Gubu)(m0);
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
        let g0r = (0, gubu_1.Gubu)(s0);
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
        let g1 = (0, gubu_1.Gubu)(m1);
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
        let g1r = (0, gubu_1.Gubu)(s1);
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
        let g0 = (0, gubu_1.Gubu)(String);
        let g1 = (0, gubu_1.Gubu)(g0);
        let g1s = (0, gubu_1.Gubu)(g0.spec());
        // console.log(g1.spec())
        expect(g1('x')).toEqual('x');
        expect(() => g1(1)).toThrow();
        expect(g1s('x')).toEqual('x');
        expect(() => g1s(1)).toThrow();
        let g2 = (0, gubu_1.Gubu)({ a: Number });
        let g3 = (0, gubu_1.Gubu)({ b: g2 });
        let g3s = (0, gubu_1.Gubu)({ b: g2.spec() });
        // console.dir(g3.spec(), { depth: null })
        expect(g3({ b: { a: 1 } })).toEqual({ b: { a: 1 } });
        expect(() => g3({ b: { a: 'x' } })).toThrow();
        expect(g3s({ b: { a: 1 } })).toEqual({ b: { a: 1 } });
        expect(() => g3s({ b: { a: 'x' } })).toThrow();
    });
    test('large', () => {
        let m0 = [[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[
                                                                                                                                                                                                                                                                                    String
                                                                                                                                                                                                                                                                                ]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]];
        let g0 = (0, gubu_1.Gubu)(m0);
        let o0 = g0([[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[
                                                                                                                                                                                                                                                                                    'x', 'y', 'z'
                                                                                                                                                                                                                                                                                ]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]);
        // console.dir(o0, { depth: null })
        expect(o0).toEqual([[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[
                                                                                                                                                                                                                                                                                    'x', 'y', 'z'
                                                                                                                                                                                                                                                                                ]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]);
        let m1 = {
            a: {
                a: {
                    a: {
                        a: {
                            a: {
                                a: {
                                    a: {
                                        a: {
                                            a: {
                                                a: {
                                                    a: {
                                                        a: {
                                                            a: {
                                                                a: {
                                                                    a: {
                                                                        a: {
                                                                            a: {
                                                                                a: {
                                                                                    a: {
                                                                                        a: {
                                                                                            a: {
                                                                                                a: {
                                                                                                    a: {
                                                                                                        a: {
                                                                                                            a: {
                                                                                                                a: {
                                                                                                                    a: {
                                                                                                                        a: {
                                                                                                                            a: {
                                                                                                                                a: {
                                                                                                                                    a: {
                                                                                                                                        a: {
                                                                                                                                            a: {
                                                                                                                                                a: {
                                                                                                                                                    a: {
                                                                                                                                                        a: {
                                                                                                                                                            a: {
                                                                                                                                                                a: {
                                                                                                                                                                    a: {
                                                                                                                                                                        a: {
                                                                                                                                                                            a: {
                                                                                                                                                                                a: {
                                                                                                                                                                                    a: {
                                                                                                                                                                                        a: {
                                                                                                                                                                                            a: {
                                                                                                                                                                                                a: {
                                                                                                                                                                                                    a: {
                                                                                                                                                                                                        a: {
                                                                                                                                                                                                            a: {
                                                                                                                                                                                                                a: {
                                                                                                                                                                                                                    a: {
                                                                                                                                                                                                                        a: {
                                                                                                                                                                                                                            a: {
                                                                                                                                                                                                                                a: {
                                                                                                                                                                                                                                    a: {
                                                                                                                                                                                                                                        a: {
                                                                                                                                                                                                                                            a: {
                                                                                                                                                                                                                                                a: {
                                                                                                                                                                                                                                                    a: {
                                                                                                                                                                                                                                                        a: {
                                                                                                                                                                                                                                                            a: {
                                                                                                                                                                                                                                                                a: {
                                                                                                                                                                                                                                                                    a: {
                                                                                                                                                                                                                                                                        a: {
                                                                                                                                                                                                                                                                            a: {
                                                                                                                                                                                                                                                                                a: {
                                                                                                                                                                                                                                                                                    a: { x: Number }
                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                }
                                                                                                                                                                                                                            }
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                    }
                                                                                                                                                                                                                }
                                                                                                                                                                                                            }
                                                                                                                                                                                                        }
                                                                                                                                                                                                    }
                                                                                                                                                                                                }
                                                                                                                                                                                            }
                                                                                                                                                                                        }
                                                                                                                                                                                    }
                                                                                                                                                                                }
                                                                                                                                                                            }
                                                                                                                                                                        }
                                                                                                                                                                    }
                                                                                                                                                                }
                                                                                                                                                            }
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        let g1 = (0, gubu_1.Gubu)(m1);
        let o1 = g1({
            a: {
                a: {
                    a: {
                        a: {
                            a: {
                                a: {
                                    a: {
                                        a: {
                                            a: {
                                                a: {
                                                    a: {
                                                        a: {
                                                            a: {
                                                                a: {
                                                                    a: {
                                                                        a: {
                                                                            a: {
                                                                                a: {
                                                                                    a: {
                                                                                        a: {
                                                                                            a: {
                                                                                                a: {
                                                                                                    a: {
                                                                                                        a: {
                                                                                                            a: {
                                                                                                                a: {
                                                                                                                    a: {
                                                                                                                        a: {
                                                                                                                            a: {
                                                                                                                                a: {
                                                                                                                                    a: {
                                                                                                                                        a: {
                                                                                                                                            a: {
                                                                                                                                                a: {
                                                                                                                                                    a: {
                                                                                                                                                        a: {
                                                                                                                                                            a: {
                                                                                                                                                                a: {
                                                                                                                                                                    a: {
                                                                                                                                                                        a: {
                                                                                                                                                                            a: {
                                                                                                                                                                                a: {
                                                                                                                                                                                    a: {
                                                                                                                                                                                        a: {
                                                                                                                                                                                            a: {
                                                                                                                                                                                                a: {
                                                                                                                                                                                                    a: {
                                                                                                                                                                                                        a: {
                                                                                                                                                                                                            a: {
                                                                                                                                                                                                                a: {
                                                                                                                                                                                                                    a: {
                                                                                                                                                                                                                        a: {
                                                                                                                                                                                                                            a: {
                                                                                                                                                                                                                                a: {
                                                                                                                                                                                                                                    a: {
                                                                                                                                                                                                                                        a: {
                                                                                                                                                                                                                                            a: {
                                                                                                                                                                                                                                                a: {
                                                                                                                                                                                                                                                    a: {
                                                                                                                                                                                                                                                        a: {
                                                                                                                                                                                                                                                            a: {
                                                                                                                                                                                                                                                                a: {
                                                                                                                                                                                                                                                                    a: {
                                                                                                                                                                                                                                                                        a: {
                                                                                                                                                                                                                                                                            a: {
                                                                                                                                                                                                                                                                                a: {
                                                                                                                                                                                                                                                                                    a: { x: 1 }
                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                }
                                                                                                                                                                                                                            }
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                    }
                                                                                                                                                                                                                }
                                                                                                                                                                                                            }
                                                                                                                                                                                                        }
                                                                                                                                                                                                    }
                                                                                                                                                                                                }
                                                                                                                                                                                            }
                                                                                                                                                                                        }
                                                                                                                                                                                    }
                                                                                                                                                                                }
                                                                                                                                                                            }
                                                                                                                                                                        }
                                                                                                                                                                    }
                                                                                                                                                                }
                                                                                                                                                            }
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        expect(o1).toEqual({
            a: {
                a: {
                    a: {
                        a: {
                            a: {
                                a: {
                                    a: {
                                        a: {
                                            a: {
                                                a: {
                                                    a: {
                                                        a: {
                                                            a: {
                                                                a: {
                                                                    a: {
                                                                        a: {
                                                                            a: {
                                                                                a: {
                                                                                    a: {
                                                                                        a: {
                                                                                            a: {
                                                                                                a: {
                                                                                                    a: {
                                                                                                        a: {
                                                                                                            a: {
                                                                                                                a: {
                                                                                                                    a: {
                                                                                                                        a: {
                                                                                                                            a: {
                                                                                                                                a: {
                                                                                                                                    a: {
                                                                                                                                        a: {
                                                                                                                                            a: {
                                                                                                                                                a: {
                                                                                                                                                    a: {
                                                                                                                                                        a: {
                                                                                                                                                            a: {
                                                                                                                                                                a: {
                                                                                                                                                                    a: {
                                                                                                                                                                        a: {
                                                                                                                                                                            a: {
                                                                                                                                                                                a: {
                                                                                                                                                                                    a: {
                                                                                                                                                                                        a: {
                                                                                                                                                                                            a: {
                                                                                                                                                                                                a: {
                                                                                                                                                                                                    a: {
                                                                                                                                                                                                        a: {
                                                                                                                                                                                                            a: {
                                                                                                                                                                                                                a: {
                                                                                                                                                                                                                    a: {
                                                                                                                                                                                                                        a: {
                                                                                                                                                                                                                            a: {
                                                                                                                                                                                                                                a: {
                                                                                                                                                                                                                                    a: {
                                                                                                                                                                                                                                        a: {
                                                                                                                                                                                                                                            a: {
                                                                                                                                                                                                                                                a: {
                                                                                                                                                                                                                                                    a: {
                                                                                                                                                                                                                                                        a: {
                                                                                                                                                                                                                                                            a: {
                                                                                                                                                                                                                                                                a: {
                                                                                                                                                                                                                                                                    a: {
                                                                                                                                                                                                                                                                        a: {
                                                                                                                                                                                                                                                                            a: {
                                                                                                                                                                                                                                                                                a: {
                                                                                                                                                                                                                                                                                    a: { x: 1 }
                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                }
                                                                                                                                                                                                                            }
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                    }
                                                                                                                                                                                                                }
                                                                                                                                                                                                            }
                                                                                                                                                                                                        }
                                                                                                                                                                                                    }
                                                                                                                                                                                                }
                                                                                                                                                                                            }
                                                                                                                                                                                        }
                                                                                                                                                                                    }
                                                                                                                                                                                }
                                                                                                                                                                            }
                                                                                                                                                                        }
                                                                                                                                                                    }
                                                                                                                                                                }
                                                                                                                                                            }
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    });
});
//# sourceMappingURL=gubu.test.js.map