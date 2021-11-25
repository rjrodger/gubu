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


  test('type-default-optional', () => {
    let g0 = gubu({
      string: 's',
      number: 1,
      boolean: true,
      object: { x: 2 },
      array: [3],
      function: () => true
    })

    expect(g0()).toEqual({
      string: 's',
      number: 1,
      boolean: true,
      object: { x: 2 },
      array: [3],
      function: () => true
    })

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
    })


    expect(() => g0({ string: 1 })).toThrow(/gubu.*string/)
  })


  test('type-native-required', () => {
    let g0 = gubu({
      string: String,
      number: Number,
      boolean: Boolean,
      object: Object,
      array: Array,
      function: Function,
      // TODO: any type? Date, RegExp, Custom ???
    })
  })


  test('type-native-optional', () => {
    let { Optional } = gubu

    let g0 = gubu({
      string: Optional(String),
      number: Optional(Number),
      boolean: Optional(Boolean),
      object: Optional(Object),
      array: Optional(Array),
      function: Optional(Function),
      // TODO: any type? Date, RegExp, Custom ???
    })
  })

  test('array-elements', () => {
    let g0 = gubu({
      a: ['x']
    })

    expect(g0({ a: ['X', 'Y'] })).toEqual({ a: ['X', 'Y'] })
    expect(() => g0({ a: ['X', 1] })).toThrow()
  })

  test('deep-basic', () => {
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

  test('custom-basic', () => {
    let { Custom } = gubu

    let g0 = gubu({
      a: Custom((val: any, root: any) => {
        if (1 === val) {
          throw new Error('1')
        }
        if (2 === val) {
          return 'TWO'
        }
        if (false === val) {
          return 0
        }
        return val
      }),
    })
  })


})


