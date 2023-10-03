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
} = Gubu


describe('extend', () => {

  test('meta', () => {
    let g0 = Gubu({
      'x$$': { foo: 99 },
      x: 1
    }, { meta: { active: true } })
    // console.log(g0)
    // console.log(g0.spec())
    // console.log(g0.node())
    // console.log(g0({}))
    // console.log(g0({}))

    expect(g0.spec().v.x.m).toEqual({ short: '', foo: 99 })
  })

  test('expr', () => {
    let g0 = Gubu({
      // 'x: Open': {
      x: {
        y: 1
      }
    })// , { keyexpr: { active: true } })
    // console.log(g0({ x: { y: 2, z: 'Z' } }))
    // expect(g0({ x: { y: 2, z: 'Z' } })).toEqual({ x: { y: 2, z: 'Z' } })
    expect(() => g0({ x: { y: 'q' } })).toThrow("Validation failed for property \"x.y\" with value \"q\" because the value is not of type number.")


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
})


