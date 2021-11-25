/* Copyright (c) 2021 Richard Rodger and other contributors, MIT License */


import { gubu } from '../gubu'


describe('gubu', () => {

  test('happy', () => {
    expect(gubu()).toBeDefined()

    let g0 = gubu({
      a: 'foo',
      b: 100
    })

    expect(g0()).toEqual({ a: 'foo', b: 100 })
    expect(g0({ a: 'bar' })).toEqual({ a: 'bar', b: 100 })
    expect(g0({ b: 999 })).toEqual({ a: 'foo', b: 999 })
    expect(g0({ a: 'bar', b: 999 })).toEqual({ a: 'bar', b: 999 })
    expect(g0({ a: 'bar', b: 999, c: true })).toEqual({ a: 'bar', b: 999, c: true })

  })




})


