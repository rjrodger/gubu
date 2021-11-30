"use strict";
/* Copyright (c) 2021 Richard Rodger and other contributors, MIT License */
Object.defineProperty(exports, "__esModule", { value: true });
const gubu_1 = require("../gubu");
describe('gubu', () => {
    test('happy', () => {
        expect((0, gubu_1.gubu)()).toBeDefined();
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
    test('type-default-optional', () => {
        let g0 = (0, gubu_1.gubu)({
            string: 's',
            number: 1,
            boolean: true,
            object: { x: 2 },
            array: [3],
            function: () => true
        });
        expect(g0()).toEqual({
            string: 's',
            number: 1,
            boolean: true,
            object: { x: 2 },
            array: [3],
            function: () => true
        });
        expect(g0({
            string: 'S',
            number: 11,
            boolean: false,
            object: { x: 22 },
            array: [33],
            function: () => false
        })).toEqual({
            string: 'S',
            number: 11,
            boolean: false,
            object: { x: 22 },
            array: [33],
            function: () => false
        });
        expect(() => g0({ string: 1 })).toThrow(/gubu.*string/);
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
            a: ['x']
        });
        expect(g0({ a: ['X', 'Y'] })).toEqual({ a: ['X', 'Y'] });
        expect(() => g0({ a: ['X', 1] })).toThrow();
    });
    test('deep-basic', () => {
        let { Required } = gubu_1.gubu;
        let g0 = (0, gubu_1.gubu)({
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
        });
    });
    test('custom-basic', () => {
        let { Custom } = gubu_1.gubu;
        let g0 = (0, gubu_1.gubu)({
            a: Custom((val, root) => {
                if (1 === val) {
                    throw new Error('1');
                }
                if (2 === val) {
                    return 'TWO';
                }
                if (false === val) {
                    return 0;
                }
                return val;
            }),
        });
    });
    test('deepx', () => {
        let a1 = (0, gubu_1.gubu)({ a: 1 });
        expect(a1({})).toMatchObject({ a: 1 });
        let ab1 = (0, gubu_1.gubu)({ a: { b: 1 } });
        expect(ab1({})).toMatchObject({ a: { b: 1 } });
        let abc1 = (0, gubu_1.gubu)({ a: { b: { c: 1 } } });
        expect(abc1({})).toMatchObject({ a: { b: { c: 1 } } });
        // let ab1c2 = gubu({ a: { b: 1 }, c: 2 })
        // expect(ab1c2({})).toMatchObject({ a: { b: 1 }, c: 2 })
        // let ab1cd2 = gubu({ a: { b: 1 }, c: { d: 2 } })
        // expect(ab1cd2({})).toMatchObject({ a: { b: 1 }, c: { d: 2 } })
        // let abc1ade2f3 = gubu({ a: { b: { c: 1 }, d: { e: 2 } }, f: 3 })
        // expect(abc1ade2f3({})).toMatchObject({ a: { b: { c: 1 }, d: { e: 2 } }, f: 3 })
    });
});
//# sourceMappingURL=gubu.test.js.map