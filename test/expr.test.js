"use strict";
/* Copyright (c) 2021-2024 Richard Rodger and other contributors, MIT License */
Object.defineProperty(exports, "__esModule", { value: true });
const JP = JSON.parse;
// Handle web (Gubu) versus node ({Gubu}) export.
let GubuModule = require('../gubu');
if (GubuModule.Gubu) {
    GubuModule = GubuModule.Gubu;
}
const Gubu = GubuModule;
const { Child, Min, Max, Required, Default, Above, Below, One, expr, build, } = Gubu;
const D = (x) => console.dir(x, { depth: null });
describe('expr', () => {
    test('meta-basic', () => {
        let g0 = Gubu({
            'x$$': { foo: 99 },
            x: 1
        }, { meta: { active: true } });
        expect(g0.spec().v.x.m).toEqual({ short: '', foo: 99 });
    });
    test('expr-direct', () => {
        const p0 = expr({ src: 'String' });
        expect(p0).toEqual(String);
        expect(() => expr({ src: 'Bad' })).toThrow('unexpected token Bad');
        const p1 = expr({ src: 'Max(2,String)' });
        expect(p1.t).toEqual('string');
        expect(p1.s).toEqual('Max(2,String)');
    });
    test('expr-active', () => {
        let g0 = Gubu({
            'x: Min(1)': 1
        });
        expect(() => g0({ x: 0 })).toThrow('minimum');
        let g1 = Gubu({
            'x: Min(1)': 1
        }, { keyexpr: { active: false } });
        expect(g1({})).toEqual({ 'x: Min(1)': 1 });
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
        expect(() => g0({ x: { y: 'q' } })).toThrow("Validation failed for property \"x.y\" with string \"q\" because the string is not of type number.");
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
        expect(() => g1({ y: 0 })).toThrow('Value "0" for property "y" must be a minimum of 1 (was 0)');
        expect(() => g1({ y: 5 })).toThrow('Value "5" for property "y" must be a maximum of 4 (was 5)');
        expect(() => g1({ z: 0 })).toThrow('Value "0" for property "z" must be a minimum of 1 (was 0)');
        // TODO: FIX: this msg is doubled
        expect(() => g1({ z: 5 })).toThrow('Value "5" for property "z" must be a maximum of 4 (was 5)');
    });
    test('expr-syntax', () => {
        let GE = (exp, val) => Gubu({ ['x:' + exp]: val });
        expect(() => GE('BadBuilder', 1))
            .toThrow('Gubu: unexpected token BadBuilder in builder expression BadBuilder');
        expect(GE('1', 2)({ x: 3 })).toEqual({ x: 3 });
        expect(GE('1', 2)({ x: 1 })).toEqual({ x: 1 });
    });
    test('expr-regexp', () => {
        let g0 = Gubu({
            'x: Check(/a/)': String,
        }, { keyexpr: { active: true } });
        expect(g0({ x: 'zaz' })).toEqual({ x: 'zaz' });
        expect(() => g0({ x: 'zbz' })).toThrow('check "/a/" failed');
    });
    test('expr-object-open', () => {
        let g0 = Gubu({
            'a: Open': { x: 1, y: 'q' }
        });
        expect(g0({ a: { z: true } })).toEqual({ a: { x: 1, y: 'q', z: true } });
        expect(() => g0({ a: { x: 'q' } })).toThrow('not of type number');
        let g1 = Gubu({
            a: { b: { c: { 'd: Open': { x: 1 } } } }
        });
        expect(g1({ a: { b: { c: { d: { y: 2 } } } } }))
            .toEqual({ a: { b: { c: { d: { x: 1, y: 2 } } } } });
        expect(() => g1({ a: { b: { c: { d: { x: 'q' } } } } }))
            .toThrow('not of type number');
        let g2 = Gubu({
            'a: Child(Number)': { x: 'q' }
        });
        expect(g2({ a: { z: 1 } })).toEqual({ a: { x: 'q', z: 1 } });
        expect(() => g2({ a: { z: 'q' } })).toThrow('not of type number');
    });
    test('expr-object-basic', () => {
        let g0 = Gubu({
            a: Child(Number, {})
        });
        expect(g0({ a: { x: 1 } })).toEqual({ a: { x: 1 } });
        expect(() => g0({ a: { x: 'q' } })).toThrow('not of type number');
        let g1 = Gubu({
            'a: Child(Number)': {}
        });
        console.log(g1({ a: { x: 1 } }));
        expect(g1({ a: { x: 1 } })).toEqual({ a: { x: 1 } });
        expect(() => g1({ a: { x: 'q' } })).toThrow('not of type number');
    });
    test('expr-array', () => {
        let g0 = Gubu({
            a: Child(Number, [])
        });
        expect(g0({ a: [1, 2] })).toEqual({ a: [1, 2] });
        expect(() => g0({ a: [1, 'x'] })).toThrow('not of type number');
        let g1 = Gubu({
            'a: Child(Number)': []
        });
        expect(g1({ a: [1, 2] })).toEqual({ a: [1, 2] });
        expect(() => g1({ a: [1, 'x'] })).toThrow('not of type number');
    });
    test('expr-child', () => {
        let g0 = Gubu.build('Child(Number)');
        expect(g0.stringify()).toEqual('Child(Number)');
        expect(g0({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
        expect(() => g0({ c: 'C' })).toThrow('not of type number');
        let g0d = Gubu(Child(Number));
        expect(g0d.stringify()).toEqual('Child(Number)');
        expect(g0d({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
        expect(() => g0d({ c: 'C' })).toThrow('not of type number');
        let g1 = Gubu.build({ a: 'Child(Number)' });
        expect(g1.stringify()).toEqual('{"a":"Child(Number)"}');
        expect(g1({ a: { b: 2 } })).toEqual({ a: { b: 2 } });
        expect(() => g1({ a: { c: 'C' } })).toThrow('not of type number');
        let g2 = Gubu.build(['Child(Number)']);
        expect(g2.stringify()).toEqual('["Child(Number)"]');
        expect(g2([{ b: 2 }])).toEqual([{ b: 2 }]);
        expect(() => g2([{ c: 'C' }])).toThrow('not of type number');
        let g3 = Gubu.build({ 'a:Child(Number)': 0 });
        expect(g3.stringify()).toEqual('{"a":"Child(Number)"}');
        expect(g3({ a: { b: 2 } })).toEqual({ a: { b: 2 } });
        expect(() => g3({ a: { c: 'C' } })).toThrow('not of type number');
    });
    test('desc-call-order', () => {
        let g = Gubu({ a: Min(1) });
        expect(g({ a: 1 })).toEqual({ a: 1 });
        // let gs = g.stringify(null, true)
        let gs = g.stringify();
        expect(gs).toEqual('{"a":"Min(1)"}');
        let gr = Gubu.build(JP(gs));
        expect(gr.jsonify()).toEqual({ a: 'Min(1)' });
        g = Gubu({ a: Max(1) });
        expect(g({ a: 1 })).toEqual({ a: 1 });
        gs = g.stringify();
        expect(gs).toEqual('{"a":"Max(1)"}');
        gr = Gubu.build(JP(gs));
        expect(gr.jsonify()).toEqual({ a: 'Max(1)' });
        g = Gubu({ a: Min(1, Max(3)) });
        expect(g({ a: 2 })).toEqual({ a: 2 });
        gs = g.stringify();
        expect(gs).toEqual('{"a":"Max(3).Min(1)"}');
        gr = Gubu.build(JP(gs));
        expect(gr.jsonify()).toEqual({ a: 'Max(3).Min(1)' });
        g = Gubu({ a: Max(3, Min(1)) });
        expect(g({ a: 2 })).toEqual({ a: 2 });
        gs = g.stringify();
        // console.log(gs)
        expect(gs).toEqual('{"a":"Min(1).Max(3)"}');
        gr = Gubu.build(JP(gs));
        expect(gr.jsonify()).toEqual({ a: 'Min(1).Max(3)' });
        g = Gubu({ a: Required(Max(3, Min(1))) });
        expect(g({ a: 2 })).toEqual({ a: 2 });
        gs = g.stringify();
        // console.log(gs)
        expect(gs).toEqual('{"a":"Required().Min(1).Max(3)"}');
        gr = Gubu.build(JP(gs));
        expect(gr.jsonify()).toEqual({ a: 'Required().Min(1).Max(3)' });
        g = Gubu({ a: Max(3, Min(1, Required())) });
        expect(g({ a: 2 })).toEqual({ a: 2 });
        gs = g.stringify();
        // console.log(gs)
        expect(gs).toEqual('{"a":"Required().Min(1).Max(3)"}');
        gr = Gubu.build(JP(gs));
        expect(gr.jsonify()).toEqual({ a: 'Required().Min(1).Max(3)' });
        g = Gubu({ a: Max(3, Min(1, Default(2))) });
        expect(g({ a: 2 })).toEqual({ a: 2 });
        expect(g({})).toEqual({ a: 2 });
        gs = g.stringify();
        // console.log(gs)
        expect(gs).toEqual('{"a":"2.Min(1).Max(3)"}');
        gr = Gubu.build(JP(gs));
        expect(gr.jsonify()).toEqual({ a: '2.Min(1).Max(3)' });
        g = Gubu({ a: Max(3, Min(1, Default(2, Required()))) });
        expect(g({ a: 2 })).toEqual({ a: 2 });
        expect(g({})).toEqual({ a: 2 });
        gs = g.stringify();
        expect(gs).toEqual('{"a":"2.Min(1).Max(3)"}');
        gr = Gubu.build(JP(gs));
        expect(gr.jsonify()).toEqual({ a: '2.Min(1).Max(3)' });
        g = Gubu({ a: Max(3, Min(1, Required(Default(2)))) });
        expect(g({ a: 2 })).toEqual({ a: 2 });
        gs = g.stringify();
        expect(gs).toEqual('{"a":"Number.Min(1).Max(3)"}');
        gr = Gubu.build(JP(gs));
        expect(gr.jsonify()).toEqual({ a: 'Number.Min(1).Max(3)' });
    });
    test('expr-type', () => {
        let g = Gubu({ a: Number });
        expect(g({ a: 1 })).toEqual({ a: 1 });
        let gs = g.stringify(null, true);
        expect(gs).toEqual('{"a":"Number"}');
        let gr = Gubu.build(JP(gs));
        // console.log(gr)
        expect(gr.jsonify()).toEqual({ a: 'Number' });
        // console.log(gr)
        expect(gr.r).toEqual(true);
        expect(gr.t).toEqual('number');
    });
    test('expr-define', () => {
        const s0 = build('"Min(1)"');
        // console.log(s0)
        const g0 = Gubu(s0);
        expect(g0.stringify()).toEqual('"Min(1)"');
        const s1 = build('Min(1).Max(3)');
        // console.log(s1)
        const g1 = Gubu(s1);
        expect(g1.stringify()).toEqual('"Min(1).Max(3)"');
        const s2 = build({ a: 'Min(1)' });
        // console.log(s2)
        const g2 = Gubu(s2);
        expect(g2.stringify()).toEqual('{"a":"Min(1)"}');
        const s3 = build({ a: 'String().Min(1)' });
        // console.log(s3)
        const g3 = Gubu(s3);
        expect(g3.stringify()).toEqual('{"a":"String.Min(1)"}');
        const s3a = build({ a: 'String.Min(1)' });
        // console.log(s3a)
        const g3a = Gubu(s3a);
        expect(g3a.stringify()).toEqual('{"a":"String.Min(1)"}');
        const s3b = build({ a: 'Min(1).String()' });
        // console.log(s3b)
        const g3b = Gubu(s3b);
        expect(g3b.stringify()).toEqual('{"a":"Min(1).String"}');
        const s3c = build({ a: 'Min(1).String' });
        // console.log(s3c)
        const g3c = Gubu(s3c);
        expect(g3c.stringify()).toEqual('{"a":"Min(1).String"}');
        const s4 = build(['String().Min(1)']);
        // console.log(s4)
        const g4 = Gubu(s4);
        // expect(g4.spec())
        expect(g4.stringify()).toEqual('["String.Min(1)"]');
        const s5 = build(['String.Min(1)']);
        // console.log(s5)
        const g5 = Gubu(s5);
        expect(g5.stringify()).toEqual('["String.Min(1)"]');
    });
    test('desc-basic', () => {
        function pass(shape, json, str, pass, fail) {
            let g0 = Gubu(shape);
            let j0 = g0.jsonify();
            expect(j0).toEqual(json);
            let s0 = g0.stringify();
            expect(s0).toEqual(str);
            let b0 = Gubu.build(j0);
            expect(b0.stringify()).toEqual(s0);
            expect(b0(pass)).toEqual(pass);
            expect(() => b0(fail)).toThrow();
        }
        pass({ a: 1 }, { a: "1" }, '{"a":"1"}', { a: 2 }, { a: 'A' });
        pass({ a: Number }, { a: "Number" }, '{"a":"Number"}', { a: 2 }, { a: 'A' });
        pass({ a: Min(1, Number) }, { a: "Number.Min(1)" }, '{"a":"Number.Min(1)"}', { a: 2 }, { a: 0 });
        pass({ a: Min(1, 2) }, { a: "2.Min(1)" }, '{"a":"2.Min(1)"}', { a: 3 }, { a: 0 });
        pass({ a: Min(1, Max(3, 2)) }, { a: "2.Max(3).Min(1)" }, '{"a":"2.Max(3).Min(1)"}', { a: 3 }, { a: 4 });
        pass({ a: Max(2, Number) }, { a: "Number.Max(2)" }, '{"a":"Number.Max(2)"}', { a: 2 }, { a: 3 });
        pass({ a: Child(Number) }, { a: "Child(Number)" }, '{"a":"Child(Number)"}', { a: { x: 1 } }, { a: { x: 'X' } });
        pass({ a: One(Number, String) }, { a: "One(Number,String)" }, '{"a":"One(Number,String)"}', { a: 1 }, { a: true });
        pass({ a: One(Number, { x: String }) }, { a: { $$: 'One(Number,$$ref0)', $$ref0: { x: 'String' } } }, '{"a":{"$$":"One(Number,$$ref0)","$$ref0":{"x":"String"}}}', { a: { x: 'X' } }, { a: { x: 1 } });
    });
    test('desc-child', () => {
        let d0 = { a: { '$$': 'Child($$child)', '$$child': { x: Number } } };
        let g0 = Gubu(d0, { keyspec: { active: true } });
        let v0 = g0({ a: { b: { x: 1 } } });
        expect(v0).toEqual({ a: { b: { x: 1 } } });
        expect(() => g0({ a: { b: { x: 'B' } } })).toThrow('not of type number');
        let j0 = g0.jsonify();
        expect(j0).toEqual({ a: { '$$': 'Child($$child)', '$$child': { x: 'Number' } } });
        let b0 = Gubu.build(j0);
        let bv0 = b0({ a: { b: { x: 1 } } });
        expect(bv0).toEqual({ a: { b: { x: 1 } } });
        expect(b0.stringify()).toEqual('{"a":{"$$":"Child($$child)","$$child":{"x":"Number"}}}');
    });
});
//# sourceMappingURL=expr.test.js.map