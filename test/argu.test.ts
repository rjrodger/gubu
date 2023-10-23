/* Copyright (c) 2021-2023 Richard Rodger and other contributors, MIT License */

import type {
  State,
  Update,
} from '../gubu'


import { Gubu as GubuX } from '../gubu'


// Handle web (Gubu) versus node ({Gubu}) export.
let GubuModule = require('../gubu')

if (GubuModule.Gubu) {
  GubuModule = GubuModule.Gubu
}


const Gubu: GubuX = GubuModule

const {
  MakeArgu,
  Skip,
  Rest,
  Any,
} = Gubu



describe('argu', () => {

  test('basic', () => {
    let Argu = MakeArgu('QAZ')

    function foo(...args: any[]) {
      let argmap = Argu(args, 'foo', {
        a: 1,
        b: 'B'
      })
      return argmap
    }


    expect(foo(2, 'X')).toEqual({ a: 2, b: 'X' })
    expect(() => foo(2, 3)).toThrow('QAZ (foo): Validation failed for property "b" with number "3" because the number is not of type string.')

  })


  test('seneca-add', () => {
    let Argu = MakeArgu('seneca')

    function bar(...args: any[]) {
      let argmap = Argu(args, 'bar', {
        a: Skip(String),
        b: Skip(Object),
        c: Function,
        d: Rest(Any()),
      })
      return argmap
    }


    const f0 = () => { }
    expect(bar('a', { x: 1 }, f0)).toEqual({ a: 'a', b: { x: 1 }, c: f0, d: [] })
    expect(bar({ x: 1 }, f0)).toEqual({ a: undefined, b: { x: 1 }, c: f0, d: [] })
    expect(bar('b', f0)).toEqual({ a: 'b', b: undefined, c: f0, d: [] })
    expect(bar(f0)).toEqual({ a: undefined, b: undefined, c: f0, d: [] })

    expect(bar('a', { x: 1 }, f0, 11))
      .toEqual({ a: 'a', b: { x: 1 }, c: f0, d: [11] })
    expect(bar({ x: 1 }, f0, 12))
      .toEqual({ a: undefined, b: { x: 1 }, c: f0, d: [12] })
    expect(bar('b', f0, 13))
      .toEqual({ a: 'b', b: undefined, c: f0, d: [13] })
    expect(bar(f0, 14))
      .toEqual({ a: undefined, b: undefined, c: f0, d: [14] })

    expect(bar('a', { x: 1 }, f0, 11, 12))
      .toEqual({ a: 'a', b: { x: 1 }, c: f0, d: [11, 12] })
    expect(bar({ x: 1 }, f0, 21, 22))
      .toEqual({ a: undefined, b: { x: 1 }, c: f0, d: [21, 22] })
    expect(bar('b', f0, 31, 32))
      .toEqual({ a: 'b', b: undefined, c: f0, d: [31, 32] })
    expect(bar(f0, 41, 42))
      .toEqual({ a: undefined, b: undefined, c: f0, d: [41, 42] })

  })

})


