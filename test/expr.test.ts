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
  Min,
  Max,
  // Value,
  Child,
  Check,
} = Gubu


describe('extend', () => {

  test('meta-basic', () => {
    let g0 = Gubu({
      'x$$': { foo: 99 },
      x: 1
    }, { meta: { active: true } })

    expect(g0.spec().v.x.m).toEqual({ short: '', foo: 99 })
  })


  test('expr-active', () => {
    let g0 = Gubu({
      'x: Min(1)': 1
    })
    expect(() => g0({ x: 0 })).toThrow('minimum')

    let g1 = Gubu({
      'x: Min(1)': 1
    }, { keyexpr: { active: false } })
    expect(g1({})).toEqual({ 'x: Min(1)': 1 })
  })


  test('expr-basic', () => {
    let g0 = Gubu({
      // 'x: Open': {
      x: {
        y: 1
      }
    })// , { keyexpr: { active: true } })
    // console.log(g0({ x: { y: 2, z: 'Z' } }))
    // expect(g0({ x: { y: 2, z: 'Z' } })).toEqual({ x: { y: 2, z: 'Z' } })
    expect(() => g0({ x: { y: 'q' } })).toThrow("Validation failed for property \"x.y\" with string \"q\" because the string is not of type number.")


    let g1 = Gubu({
      'x:Min(1 Max(4))': 2,
      'y:Min(1) Max(4)': 2,
      'z:Min(1).Max(4)': 2,
    }, { keyexpr: { active: true } })

    expect(g1({ x: 3 })).toEqual({ x: 3, y: 2, z: 2 })
    expect(g1({ y: 3 })).toEqual({ x: 2, y: 3, z: 2 })
    expect(g1({ z: 3 })).toEqual({ x: 2, y: 2, z: 3 })

    expect(() => g1({ x: 0 })).toThrow('Value "0" for property "x" must be a minimum of 1 (was 0)')
    expect(() => g1({ x: 5 })).toThrow('Value "5" for property "x" must be a maximum of 4 (was 5)')

    // expect(g1({ y: 5 }))
    expect(() => g1({ y: 0 })).toThrow('Value "0" for property "y" must be a minimum of 1 (was 0)')
    // TODO: FIX: this msg is doubled
    expect(() => g1({ y: 5 })).toThrow('Value "5" for property "y" must be a maximum of 4 (was 5)')

    expect(() => g1({ z: 0 })).toThrow('Value "0" for property "z" must be a minimum of 1 (was 0)')
    // TODO: FIX: this msg is doubled
    expect(() => g1({ z: 5 })).toThrow('Value "5" for property "z" must be a maximum of 4 (was 5)')

  })


  // TODO: regexps!
  // TODO: what if builder expr is just a literal?

  test('expr-syntax', () => {
    let GE = (exp: string, val: any) =>
      Gubu({ ['x:' + exp]: val })

    expect(() => GE('BadBuilder', 1))
      .toThrow('Gubu: unexpected token BadBuilder in builder expression BadBuilder')

    expect(GE('1', 2)({ x: 3 })).toEqual({ x: 3 })
    expect(GE('1', 2)({ x: 1 })).toEqual({ x: 1 })
  })


  test('expr-regexp', () => {
    let g0 = Gubu({
      'x: Check(/a/)': String,
    }, { keyexpr: { active: true } })

    expect(g0({ x: 'zaz' })).toEqual({ x: 'zaz' })
    expect(() => g0({ x: 'zbz' })).toThrow('check "/a/" failed')
  })


  test('expr-object-open', () => {
    let g0 = Gubu({
      'a: Open': { x: 1, y: 'q' }
    })
    expect(g0({ a: { z: true } })).toEqual({ a: { x: 1, y: 'q', z: true } })
    expect(() => g0({ a: { x: 'q' } })).toThrow('not of type number')

    let g1 = Gubu({
      a: { b: { c: { 'd: Open': { x: 1 } } } }
    })
    expect(g1({ a: { b: { c: { d: { y: 2 } } } } }))
      .toEqual({ a: { b: { c: { d: { x: 1, y: 2 } } } } })
    expect(() => g1({ a: { b: { c: { d: { x: 'q' } } } } }))
      .toThrow('not of type number')

    let g2 = Gubu({
      'a: Child(Number)': { x: 'q' }
    })
    expect(g2({ a: { z: 1 } })).toEqual({ a: { x: 'q', z: 1 } })
    expect(() => g2({ a: { z: 'q' } })).toThrow('not of type number')

  })


  test('expr-object', () => {
    let g0 = Gubu({
      a: Child(Number, {})
    })
    expect(g0({ a: { x: 1 } })).toEqual({ a: { x: 1 } })
    expect(() => g0({ a: { x: 'q' } })).toThrow('not of type number')

    let g1 = Gubu({
      'a: Child(Number)': {}
    })
    expect(g1({ a: { x: 1 } })).toEqual({ a: { x: 1 } })
    expect(() => g1({ a: { x: 'q' } })).toThrow('not of type number')
  })


  test('expr-array', () => {
    let g0 = Gubu({
      a: Child(Number, [])
    })
    expect(g0({ a: [1, 2] })).toEqual({ a: [1, 2] })
    expect(() => g0({ a: [1, 'x'] })).toThrow('not of type number')

    let g1 = Gubu({
      'a: Child(Number)': []
    })
    expect(g1({ a: [1, 2] })).toEqual({ a: [1, 2] })
    expect(() => g1({ a: [1, 'x'] })).toThrow('not of type number')
  })


})


