/* Copyright (c) 2021 Richard Rodger and other contributors, MIT License */


import {
  gubu,
  Required,
  Optional,
  Any,
  G$,
} from '../gubu'


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


  test('buildize-construct', () => {
    expect(Required('x')).toMatchObject({
      '$': { 'gubu$': true },
      t: 'string',
      y: '',
      v: 'x',
      r: true,
    })

    expect(Optional(String)).toMatchObject({
      '$': { 'gubu$': true },
      t: 'string',
      y: '',
      v: '',
      r: false,
    })


    expect(Required(Required('x'))).toMatchObject({
      '$': { 'gubu$': true },
      t: 'string',
      y: '',
      v: 'x',
      r: true,
    })

    expect(Optional(Required('x'))).toMatchObject({
      '$': { 'gubu$': true },
      t: 'string',
      y: '',
      v: 'x',
      r: false,
    })

    expect(Required('x').Required()).toMatchObject({
      '$': { 'gubu$': true },
      t: 'string',
      y: '',
      v: 'x',
      r: true,
    })

    expect(Required('x').Optional()).toMatchObject({
      '$': { 'gubu$': true },
      t: 'string',
      y: '',
      v: 'x',
      r: false,
    })


    expect(Optional(Optional(String))).toMatchObject({
      '$': { 'gubu$': true },
      t: 'string',
      y: '',
      v: '',
      r: false,
    })

    expect(Optional(String).Optional()).toMatchObject({
      '$': { 'gubu$': true },
      t: 'string',
      y: '',
      v: '',
      r: false,
    })

    expect(Optional(String).Required()).toMatchObject({
      '$': { 'gubu$': true },
      t: 'string',
      y: '',
      v: '',
      r: true,
    })

    expect(Required(Optional(String))).toMatchObject({
      '$': { 'gubu$': true },
      t: 'string',
      y: '',
      v: '',
      r: true,
    })

  })


  test('type-default-optional', () => {
    let f0 = () => true

    let g0 = gubu({
      string: 's',
      number: 1,
      boolean: true,
      object: { x: 2 },
      array: [3],
      function: G$({ type: 'function', value: f0 })
    })

    expect(g0()).toMatchObject({
      string: 's',
      number: 1,
      boolean: true,
      object: { x: 2 },
      array: [3],
      function: f0
    })

    expect(g0({
      string: 'S',
      number: 11,
      boolean: false,
      object: { x: 22 },
      array: [33],
      function: f0,
    })).toMatchObject({
      string: 'S',
      number: 11,
      boolean: false,
      object: { x: 22 },
      array: [33],
      function: f0,
    })

    // TODO: fails
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

    let o0 = {
      string: 's',
      number: 1,
      boolean: true,
      object: { x: 2 },
      array: [3],
      function: () => true
    }
    expect(g0(o0)).toMatchObject(o0)


    let e0 = gubu({ s0: String, s1: 'x' })
    expect(e0({ s0: 'a' })).toMatchObject({ s0: 'a', s1: 'x' })
    expect(() => e0({ s0: 1 })).toThrow(/string/)

    // TODO: more fails

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
    expect(() => g0({ a: ['X', 1] })).toThrow(/gubu.*string/)
  })

  /*
    test('deep-required', () => {
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
  */


  test('deep-basic', () => {
    let a1 = gubu({ a: 1 })
    expect(a1({})).toMatchObject({ a: 1 })

    let ab1 = gubu({ a: { b: 1 } })
    expect(ab1({})).toMatchObject({ a: { b: 1 } })

    let abc1 = gubu({ a: { b: { c: 1 } } })
    expect(abc1({})).toMatchObject({ a: { b: { c: 1 } } })


    let ab1c2 = gubu({ a: { b: 1 }, c: 2 })
    expect(ab1c2({})).toMatchObject({ a: { b: 1 }, c: 2 })

    let ab1cd2 = gubu({ a: { b: 1 }, c: { d: 2 } })
    expect(ab1cd2({})).toMatchObject({ a: { b: 1 }, c: { d: 2 } })

    let abc1ade2f3 = gubu({ a: { b: { c: 1 }, d: { e: 2 } }, f: 3 })
    expect(abc1ade2f3({})).toMatchObject({ a: { b: { c: 1 }, d: { e: 2 } }, f: 3 })
  })


  /*
  test('valspec-basic', () => {
    const G = (x: any) => x
    let a1 = gubu({
      a: G$({ type: 'number', required: true }),
    })
    expect(a1({ b: 1 })).toMatchObject({ a: 'A', b: 1 })
  })
  */


  test('buildize-required', () => {
    let g0 = gubu({ a: Required(1) })
    expect(g0({ a: 2 })).toMatchObject({ a: 2 })
    expect(() => g0({ a: 'x' })).toThrow(/number/)
  })

  test('buildize-optional', () => {
    let g0 = gubu({ a: Optional(String) })
    expect(g0({ a: 'x' })).toMatchObject({ a: 'x' })
    expect(g0({})).toMatchObject({ a: '' })
    expect(() => g0({ a: 1 })).toThrow(/string/)
  })

  test('buildize-any', () => {
    let g0 = gubu({ a: Any(), b: Any(true) })
    expect(g0({ a: 2, b: 1 })).toMatchObject({ a: 2, b: 1 })
    expect(g0({ a: 'x', b: 'y' })).toMatchObject({ a: 'x', b: 'y' })
    expect(g0({ b: 1 })).toEqual({ b: 1 })
  })

})


