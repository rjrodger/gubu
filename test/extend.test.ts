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
      'x: Open': {
        y: 1
      }
    }, { keyexpr: { active: true } })
    // console.log(g0({ x: { y: 2, z: 'Z' } }))
    expect(g0({ x: { y: 2, z: 'Z' } })).toEqual({ x: { y: 2, z: 'Z' } })
  })
})


