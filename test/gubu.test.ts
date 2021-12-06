/* Copyright (c) 2021 Richard Rodger and other contributors, MIT License */


import Pkg from '../package.json'


import {
  gubu,
  Required,
  Optional,
  Any,
  Closed,
  Before,
  After,
  // G$,
  Update,
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
    const GUBU$ = Symbol.for('gubu$')

    expect(Required('x')).toMatchObject({
      '$': { 'gubu$': GUBU$ },
      t: 'string',
      v: 'x',
      r: true,
    })

    expect(Optional(String)).toMatchObject({
      '$': { 'gubu$': GUBU$ },
      t: 'string',
      v: '',
      r: false,
    })


    expect(Required(Required('x'))).toMatchObject({
      '$': { 'gubu$': GUBU$ },
      t: 'string',
      v: 'x',
      r: true,
    })

    expect(Optional(Required('x'))).toMatchObject({
      '$': { 'gubu$': GUBU$ },
      t: 'string',
      v: 'x',
      r: false,
    })

    expect(Required('x').Required()).toMatchObject({
      '$': { 'gubu$': GUBU$ },
      t: 'string',
      v: 'x',
      r: true,
    })

    expect(Required('x').Optional()).toMatchObject({
      '$': { 'gubu$': GUBU$ },
      t: 'string',
      v: 'x',
      r: false,
    })


    expect(Optional(Optional(String))).toMatchObject({
      '$': { 'gubu$': GUBU$ },
      t: 'string',
      v: '',
      r: false,
    })

    expect(Optional(String).Optional()).toMatchObject({
      '$': { 'gubu$': GUBU$ },
      t: 'string',
      v: '',
      r: false,
    })

    expect(Optional(String).Required()).toMatchObject({
      '$': { 'gubu$': GUBU$ },
      t: 'string',
      v: '',
      r: true,
    })

    expect(Required(Optional(String))).toMatchObject({
      '$': { 'gubu$': GUBU$ },
      t: 'string',
      v: '',
      r: true,
    })


    // console.log(Before(() => true, { a: 1 }))
  })


  test('type-default-optional', () => {
    let f0 = () => true

    let g0 = gubu({
      string: 's',
      number: 1,
      boolean: true,
      object: { x: 2 },
      array: [3],
      // function: G$({ type: 'function', value: f0 })
    })

    expect(g0()).toMatchObject({
      string: 's',
      number: 1,
      boolean: true,
      object: { x: 2 },
      array: [],
      // function: f0
    })

    expect(g0({
      string: 'S',
      number: 11,
      boolean: false,
      object: { x: 22 },
      array: [33],
      // function: f0,
    })).toMatchObject({
      string: 'S',
      number: 11,
      boolean: false,
      object: { x: 22 },
      array: [33],
      // function: f0,
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

    expect(() => e0({ s0: 1 })).toThrow(/Validation failed for path "s0" with value "1" because the value is not of type string\./)
    expect(() => e0({ s1: 1 })).toThrow(/Validation failed for path "s0" with value "" because the value is required\.\nValidation failed for path "s1" with value "1" because the value is not of type string\./)

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
      a: [String]
    })

    expect(g0({ a: ['X', 'Y'] })).toEqual({ a: ['X', 'Y'] })
    expect(() => g0({ a: ['X', 1] })).toThrow(/Validation failed for path "a.1" with value "1" because the value is not of type string\./)
  })


  test('custom-basic', () => {
    let g0 = gubu({ a: (v: any) => v > 10 })
    expect(g0({ a: 11 })).toMatchObject({ a: 11 })
    expect(() => g0({ a: 9 })).toThrow(/Validation failed for path "a" with value "9" because check "custom" failed\./)

    let g1 = gubu({ a: Optional((v: any) => v > 10) })
    expect(g1({ a: 11 })).toMatchObject({ a: 11 })
    expect(() => g1({ a: 9 })).toThrow(/Validation failed for path "a" with value "9" because check "custom" failed\./)
    expect(g1({})).toMatchObject({})

    let g2 = gubu({ a: Required((v: any) => v > 10) })
    expect(g1({ a: 11 })).toMatchObject({ a: 11 })
    expect(() => g2({ a: 9 })).toThrow(/Validation failed for path "a" with value "9" because check "custom" failed\./)
    expect(() => g2({})).toThrow(/Validation failed for path "a" with value "" because check "custom" failed\./)
  })


  test('before-after-basic', () => {
    let g0 = gubu(
      Before((val: any, _update: Update) => {
        val.b = 1 + val.a
        return true
      }, { a: 1 })
        .After((val: any, _update: Update) => {
          val.c = 10 * val.a
          return true
        }))

    expect(g0({ a: 2 })).toMatchObject({ a: 2, b: 3, c: 20 })

    let g1 = gubu({
      x:
        After((val: any, _update: Update) => {
          val.c = 10 * val.a
          return true
        }, { a: 1 })
          .Before((val: any, _update: Update) => {
            val.b = 1 + val.a
            return true
          })
    })
    expect(g1({ x: { a: 2 } })).toMatchObject({ x: { a: 2, b: 3, c: 20 } })
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
   
  */


  test('deep-object-basic', () => {
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


    let d0 = gubu({
      a: { b: { c: 1 }, d: { e: { f: 3 } } },
      h: 3,
      i: { j: { k: 4 }, l: { m: 5 } },
      n: { o: 6 }
    })
    expect(d0({})).toMatchObject({
      a: { b: { c: 1 }, d: { e: { f: 3 } } },
      h: 3,
      i: { j: { k: 4 }, l: { m: 5 } },
      n: { o: 6 }
    })

  })


  test('deep-array-basic', () => {
    let a0 = gubu([1])
    // console.dir(a0.spec(), { depth: null })
    expect(a0()).toMatchObject([])
    expect(a0([])).toMatchObject([])
    expect(a0([11])).toMatchObject([11])
    expect(a0([11, 22])).toMatchObject([11, 22])

    let a1 = gubu([-1, 1, 2, 3])
    // console.dir(a1.spec(), { depth: null })
    expect(a1()).toMatchObject([1, 2, 3])
    expect(a1([])).toMatchObject([1, 2, 3])
    expect(a1([11])).toMatchObject([11, 2, 3])
    expect(a1([11, 22])).toMatchObject([11, 22, 3])
    expect(a1([11, 22, 33])).toMatchObject([11, 22, 33])
    expect(a1([11, 22, 33, 44])).toMatchObject([11, 22, 33, 44])
    expect(a1([undefined, 22])).toMatchObject([1, 22, 3])

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


  test('closed', () => {
    let g0 = gubu({
      a: { b: { c: Closed({ x: 1 }) } }
    })

    expect(g0({ a: { b: { c: { x: 2 } } } })).toEqual({ a: { b: { c: { x: 2 } } } })
    expect(() => g0({ a: { b: { c: { x: 2, y: 3 } } } })).toThrow(/Validation failed for path "a.b.c" with value "{x:2,y:3}" because the property "y" is not allowed\./)
  })



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
    // expect(g0({ a: 2, b: 1 })).toMatchObject({ a: 2, b: 1 })
    // expect(g0({ a: 'x', b: 'y' })).toMatchObject({ a: 'x', b: 'y' })
    // expect(g0({ b: 1 })).toEqual({ b: 1 })
  })


  test('spec-roundtrip', () => {
    let m0 = { a: 1 }
    let g0 = gubu(m0)
    // console.log('m0 A', m0)
    expect(m0).toEqual({ a: 1 })

    expect(g0({ a: 2 })).toEqual({ a: 2 })
    expect(m0).toEqual({ a: 1 })
    // console.log('m0 B', m0)

    let s0 = g0.spec()
    expect(m0).toEqual({ a: 1 })
    // console.log('m0 C', m0)
    let s0s = {
      $: {
        gubu$: true,
        version: Pkg.version,
      },
      // d: -1,
      d: 0,
      k: '',
      r: false,
      t: 'object',
      u: {},
      v: {
        a: {
          $: {
            gubu$: true,
            version: Pkg.version,
          },
          d: 1,
          k: 'a',
          r: false,
          t: 'number',
          u: {},
          v: 1,
        },
      },
    }
    expect(s0).toEqual(s0s)
    expect(g0({ a: 2 })).toEqual({ a: 2 })

    let g0r = gubu(s0)
    expect(m0).toEqual({ a: 1 })
    expect(s0).toEqual(s0s)

    expect(g0r({ a: 2 })).toEqual({ a: 2 })
    expect(m0).toEqual({ a: 1 })
    expect(s0).toEqual(s0s)

    let s0r = g0r.spec()
    expect(m0).toEqual({ a: 1 })
    expect(s0r).toEqual(s0s)
    expect(s0).toEqual(s0s)

    expect(g0r({ a: 2 })).toEqual({ a: 2 })
    expect(g0({ a: 2 })).toEqual({ a: 2 })
    let s0_2 = g0r.spec()
    let s0r_2 = g0r.spec()
    expect(m0).toEqual({ a: 1 })
    expect(s0r_2).toEqual(s0s)
    expect(s0_2).toEqual(s0s)


    let m1 = { a: [1] }
    let g1 = gubu(m1)
    expect(g1({ a: [2] })).toEqual({ a: [2] })
    expect(m1).toEqual({ a: [1] })

    let s1 = g1.spec()
    let s1s = {
      $: {
        gubu$: true,
        version: '0.0.1',
      },
      // d: -1,
      d: 0,
      k: '',
      r: false,
      t: 'object',
      u: {},
      v: {
        a: {
          $: {
            gubu$: true,
            version: Pkg.version,
          },
          d: 1,
          k: 'a',
          r: false,
          t: 'array',
          u: {},
          v: {
            0: {
              $: {
                gubu$: true,
                version: Pkg.version,
              },
              d: 2,
              k: '0',
              r: false,
              t: 'number',
              u: {},
              v: 1,
            },
          },
        },
      },
    }
    expect(s1).toEqual(s1s)

    let g1r = gubu(s1)
    expect(g1r({ a: [2] })).toEqual({ a: [2] })
    expect(g1({ a: [2] })).toEqual({ a: [2] })
    expect(m1).toEqual({ a: [1] })
    expect(s1).toEqual(s1s)

    let s1r = g1r.spec()
    expect(g1r({ a: [2] })).toEqual({ a: [2] })
    expect(g1({ a: [2] })).toEqual({ a: [2] })
    expect(m1).toEqual({ a: [1] })
    expect(s1).toEqual(s1s)
    expect(s1r).toEqual(s1s)
  })

})


