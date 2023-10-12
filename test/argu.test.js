"use strict";
/* Copyright (c) 2021-2023 Richard Rodger and other contributors, MIT License */
Object.defineProperty(exports, "__esModule", { value: true });
// Handle web (Gubu) versus node ({Gubu}) export.
let GubuModule = require('../gubu');
if (GubuModule.Gubu) {
    GubuModule = GubuModule.Gubu;
}
const Gubu = GubuModule;
const { MakeArgu } = Gubu;
describe('argu', () => {
    test('basic', () => {
        let Argu = MakeArgu('QAZ');
        function foo(...args) {
            let argmap = Argu(args, 'foo', {
                a: 1,
                b: 'B'
            });
            return argmap;
        }
        expect(foo(2, 'X')).toEqual({ a: 2, b: 'X' });
        expect(() => foo(2, 3)).toThrow('QAZ (foo): Validation failed for property "b" with value "3" because the value is not of type string.');
    });
    test('seneca-add', () => {
        let Argu = MakeArgu('seneca');
        function bar(...args) {
            let argmap = Argu(args, 'bar', {
                'a: One(String,{})': {},
                'b: Ignore(One(String,{}))': {},
                c: Function,
            });
            return argmap;
        }
        const f0 = () => { };
        expect(bar('a', 'b', f0)).toEqual({ a: 'a', b: 'b', c: f0 });
        expect(bar('a', {}, f0)).toEqual({ a: 'a', b: {}, c: f0 });
        expect(bar('a', f0)).toEqual({ a: 'a', b: undefined, c: f0 });
    });
});
//# sourceMappingURL=argu.test.js.map