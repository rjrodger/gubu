"use strict";
/* Copyright (c) 2021-2023 Richard Rodger and other contributors, MIT License */
Object.defineProperty(exports, "__esModule", { value: true });
// Handle web (Gubu) versus node ({Gubu}) export.
let GubuModule = require('../gubu');
if (GubuModule.Gubu) {
    GubuModule = GubuModule.Gubu;
}
const Gubu = GubuModule;
const { Min, Max, Value, Check, } = Gubu;
describe('extend', () => {
    test('meta-basic', () => {
        let g0 = Gubu({
            'x$$': { foo: 99 },
            x: 1
        }, { meta: { active: true } });
        expect(g0.spec().v.x.m).toEqual({ short: '', foo: 99 });
    });
    test('expr-basic', () => {
        let g0 = Gubu({
            // 'x: Open': {
            x: {
                y: 1
            }
        }); // , { keyexpr: { active: true } })
        // console.log(g0({ x: { y: 2, z: 'Z' } }))
        // expect(g0({ x: { y: 2, z: 'Z' } })).toEqual({ x: { y: 2, z: 'Z' } })
        expect(() => g0({ x: { y: 'q' } })).toThrow("Validation failed for property \"x.y\" with value \"q\" because the value is not of type number.");
        let g1 = Gubu({
            'x:Min(1 Max(4))': 2,
            'y:Min(1) Max(4)': 2,
            'z:Min(1).Max(4)': 2,
        }, { keyexpr: { active: true } });
        expect(g1({ x: 3 })).toEqual({ x: 3, y: 2, z: 2 });
        expect(g1({ y: 3 })).toEqual({ x: 2, y: 3, z: 2 });
        expect(g1({ z: 3 })).toEqual({ x: 2, y: 2, z: 3 });
        expect(() => g1({ x: 0 })).toThrow('Value "0" for property "x" must be a minimum of 1 (was 0)');
        expect(() => g1({ x: 5 })).toThrow('Value "5" for property "x" must be a maximum of 4 (was 5)');
        // expect(g1({ y: 5 }))
        expect(() => g1({ y: 0 })).toThrow('Value "0" for property "y" must be a minimum of 1 (was 0)');
        // TODO: FIX: this msg is doubled
        expect(() => g1({ y: 5 })).toThrow('Value "5" for property "y" must be a maximum of 4 (was 5)');
        expect(() => g1({ z: 0 })).toThrow('Value "0" for property "z" must be a minimum of 1 (was 0)');
        // TODO: FIX: this msg is doubled
        expect(() => g1({ z: 5 })).toThrow('Value "5" for property "z" must be a maximum of 4 (was 5)');
    });
    // TODO: regexps!
    // TODO: what if builder expr is just a literal?
    test('expr-syntax', () => {
        let GE = (exp, val) => Gubu({ ['x:' + exp]: val }, { keyexpr: { active: true } });
        expect(() => GE('BadBuilder', 1))
            .toThrow('Gubu: unexpected token BadBuilder in builder expression BadBuilder');
    });
    test('expr-regexp', () => {
        let g0 = Gubu({
            'x: Check(/a/)': String,
        }, { keyexpr: { active: true } });
        expect(g0({ x: 'zaz' })).toEqual({ x: 'zaz' });
        expect(() => g0({ x: 'zbz' })).toThrow('check "/a/" failed');
    });
    /* Refactor to make this work
    test('expr-array', () => {
      let g0 = Gubu({
        // 'a: Value(Check(/a/))': [String]
        'a: Value(String)': [String]
        // a: Value(Check(/a/), [String])
      }, { keyexpr: { active: true } })
  
      console.log(g0.spec())
  
      expect(g0({ a: ['zaz'] })).toEqual({ a: ['zaz'] })
      expect(() => g0({ a: ['zbz'] })).toThrow('check "/a/" failed')
    })
    */
});
//# sourceMappingURL=extend.test.js.map