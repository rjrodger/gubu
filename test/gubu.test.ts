/* Copyright (c) 2021 Richard Rodger and other contributors, MIT License */


import Pkg from '../package.json'




import type {
  Builder,
  ValSpec,
  State,
  Update,
} from '../gubu'


const Large = require('./large')
const Long = require('./long')


// Handle web (Gubu) versus node ({Gubu}) export.
let GubuModule = require('../gubu')

if (GubuModule.Gubu) {
  GubuModule = GubuModule.Gubu
}


const Gubu = GubuModule
const G$ = Gubu.G$
const buildize = Gubu.buildize
const makeErr = Gubu.makeErr

const Above = Gubu.Above
const After = Gubu.After
const All = Gubu.All
const Any = Gubu.Any
const Before = Gubu.Before
const Below = Gubu.Below
const Closed = Gubu.Closed
const Define = Gubu.Define
const Empty = Gubu.Empty
const Exact = Gubu.Exact
const Max = Gubu.Max
const Min = Gubu.Min
const Never = Gubu.Never
const Optional = Gubu.Optional
const One = Gubu.One
const Refer = Gubu.Refer
const Rename = Gubu.Rename
const Required = Gubu.Required
const Some = Gubu.Some




class Foo {
  a = -1
  constructor(a: number) {
    this.a = a
  }
}

class Bar {
  b = -2
  constructor(b: number) {
    this.b = b
  }
}



describe('gubu', () => {

  test('happy', () => {
    expect(Gubu()).toBeDefined()
    expect(Gubu().toString()).toMatch(/\[Gubu G\d+ undefined\]/)
    expect(Gubu(undefined, { name: 'foo' }).toString()).toMatch(/\[Gubu foo undefined\]/)
    expect(Gubu('x', { name: 'bar' }).toString()).toMatch(/\[Gubu bar "x"\]/)

    let g0 = Gubu({
      a: 'foo',
      b: 100
    })

    expect(g0({})).toEqual({ a: 'foo', b: 100 })
    expect(g0({ a: 'bar' })).toEqual({ a: 'bar', b: 100 })
    expect(g0({ b: 999 })).toEqual({ a: 'foo', b: 999 })
    expect(g0({ a: 'bar', b: 999 })).toEqual({ a: 'bar', b: 999 })
    expect(g0({ a: 'bar', b: 999, c: true })).toEqual({ a: 'bar', b: 999, c: true })
  })


  test('readme-quick', () => {

    // Property a is optional, must be a Number, and defaults to 1.
    // Property b is required, and must be a String.
    const shape = Gubu({ a: 1, b: String })

    // Object shape is good! Prints `{ a: 99, b: 'foo' }`
    expect(shape({ a: 99, b: 'foo' })).toEqual({ a: 99, b: 'foo' })

    // Object shape is also good. Prints `{ a: 1, b: 'foo' }`
    expect(shape({ b: 'foo' })).toEqual({ a: 1, b: 'foo' })

    // Object shape is bad. Throws an exception:
    // "TODO: msg"
    expect(() => shape({ a: 'BAD' })).toThrow('Validation failed for path "a" with value "BAD" because the value is not of type number.\nValidation failed for path "b" with value "" because the value is required.')

  })


  test('readme-common', () => {
    const optionShape = Gubu({
      host: 'localhost',
      port: 8080
    })

    // console.log(optionShape({}))

    expect(optionShape()).toEqual({
      host: 'localhost',
      port: 8080
    })

    expect(optionShape({})).toEqual({
      host: 'localhost',
      port: 8080
    })

    expect(optionShape({ host: 'foo' })).toEqual({
      host: 'foo',
      port: 8080
    })

    expect(optionShape({ host: 'foo', port: undefined })).toEqual({
      host: 'foo',
      port: 8080
    })

    expect(optionShape({ host: 'foo', port: 9090 })).toEqual({
      host: 'foo',
      port: 9090
    })

    expect(() => optionShape({ host: 9090 })).toThrow('type')
    expect(() => optionShape({ port: '9090' })).toThrow('type')
    expect(() => optionShape({ host: '' })).toThrow('required')


    // TODO: better example to show deep structure defaults

    // const productListShape = Gubu({
    //   v: { p: [{ name: String, price: Number }] }
    //   // view: {
    //   // discounts: [{ name: String, percent: (v: any) => 0 < v && v < 100 }],
    //   // products: [
    //   //   { name: String, price: Number }
    //   // ]
    //   // }
    // })

    // // expect(productListShape({})).toEqual({ view: { discounts: [], products: [] } })

    // let update = { err: [] }
    // let result = productListShape({
    //   // FIX - ARRAYS BROKEN!
    //   v: { p: [{ name: 'x', price: 1 }, { name: 'foo', price: undefined }] }
    //   // view: {
    //   // products: [
    //   //   { name: 'Apple', price: 100 },
    //   //   { name: 'Pear', price: 200 },
    //   //   // { name: 'Banana', price: undefined }
    //   //   { name: 'Banana', price: 'x' }
    //   // ]
    //   // }
    // })// , update)

    // console.dir(result, { depth: null })
    // console.log(update)
  })


  test('shapes-basic', () => {
    let tmp: any = {}


    expect(Gubu(String)('x')).toEqual('x')
    expect(Gubu(Number)(1)).toEqual(1)
    expect(Gubu(Boolean)(true)).toEqual(true)
    expect(Gubu(BigInt)(BigInt(1))).toEqual(BigInt(1))
    expect(Gubu(Object)({ x: 1 })).toEqual({ x: 1 })
    expect(Gubu(Array)([1])).toEqual([1])
    expect(Gubu(Function)(tmp.f0 = () => true)).toEqual(tmp.f0)
    expect(Gubu(Symbol)(tmp.s0 = Symbol('foo'))).toEqual(tmp.s0)
    expect(Gubu(Date)(tmp.d0 = new Date())).toEqual(tmp.d0)
    expect(Gubu(RegExp)(tmp.r0 = /a/)).toEqual(tmp.r0)
    expect(Gubu(Foo)(tmp.c0 = new Foo(2))).toEqual(tmp.c0)

    // console.log(gubu(new Date()).spec())

    expect(Gubu('a')('x')).toEqual('x')
    expect(Gubu(0)(1)).toEqual(1)
    expect(Gubu(false)(true)).toEqual(true)
    expect(Gubu(BigInt(-1))(BigInt(1))).toEqual(BigInt(1))
    expect(Gubu({})({ x: 1 })).toEqual({ x: 1 })
    expect(Gubu([])([1])).toEqual([1])
    // NOTE: raw function would be a custom validator
    expect(Gubu(G$({ v: () => null }))(tmp.f1 = () => false)).toEqual(tmp.f1)
    expect(Gubu(Symbol('bar'))(tmp.s0)).toEqual(tmp.s0)
    expect(Gubu(new Date())(tmp.d1 = new Date(Date.now() - 1111))).toEqual(tmp.d1)
    expect(Gubu(new RegExp('a'))(tmp.r1 = /b/)).toEqual(tmp.r1)
    expect(Gubu(new Foo(4))(tmp.c1 = new Foo(5))).toEqual(tmp.c1)
    expect(Gubu(new Bar(6))(tmp.c2 = new Bar(7))).toEqual(tmp.c2)

    expect(Gubu(null)(null)).toEqual(null)
    expect(() => Gubu(null)(1)).toThrow(/path "".*value "1".*not of type null/)

    expect(Gubu((_v: any, u: Update) => (u.val = 1, true))(null)).toEqual(1)

    // console.log(gubu(Date).spec())


    expect(() => Gubu(String)(1)).toThrow(/path "".*not of type string/)
    expect(() => Gubu(Number)('x')).toThrow(/path "".*not of type number/)
    expect(() => Gubu(Boolean)('x')).toThrow(/path "".*not of type boolean/)
    expect(() => Gubu(BigInt)('x')).toThrow(/path "".*not of type bigint/)
    expect(() => Gubu(Object)('x')).toThrow(/path "".*not of type object/)
    expect(() => Gubu(Array)('x')).toThrow(/path "".*not of type array/)
    expect(() => Gubu(Function)('x')).toThrow(/path "".*not of type function/)
    expect(() => Gubu(Symbol)('x')).toThrow(/path "".*not of type symbol/)
    expect(() => Gubu(Date)(/a/)).toThrow(/path "".*not an instance of Date/)
    expect(() => Gubu(RegExp)(new Date()))
      .toThrow(/path "".*not an instance of RegExp/)
    expect(() => Gubu(Foo)(tmp.c3 = new Bar(8)))
      .toThrow(/path "".*not an instance of Foo/)
    expect(() => Gubu(Bar)(tmp.c4 = new Foo(9)))
      .toThrow(/path "".*not an instance of Bar/)


    // console.log(gubu(new Date()).spec())

    expect(() => Gubu('a')(1)).toThrow(/path "".*not of type string/)
    expect(() => Gubu(0)('x')).toThrow(/path "".*not of type number/)
    expect(() => Gubu(false)('x')).toThrow(/path "".*not of type boolean/)
    expect(() => Gubu(BigInt(-1))('x')).toThrow(/path "".*not of type bigint/)
    expect(() => Gubu({})('x')).toThrow(/path "".* not of type object/)
    expect(() => Gubu([])('x')).toThrow(/path "".*not of type array/)
    expect(() => Gubu(G$({ v: () => null }))('x'))
      .toThrow(/path "".*not of type function/)
    expect(() => Gubu(Symbol('bar'))('x')).toThrow(/path "".*not of type symbol/)
    expect(() => Gubu(new Date())('x')).toThrow(/path "".*not an instance of Date/)
    expect(() => Gubu(new RegExp('a'))('x'))
      .toThrow(/path "".*not an instance of RegExp/)
    expect(() => Gubu(new Foo(4))('a')).toThrow(/path "".*not an instance of Foo/)
    expect(() => Gubu(new Bar(6))('a')).toThrow(/path "".*not an instance of Bar/)
    expect(() => Gubu(new Foo(10))(new Bar(11)))
      .toThrow(/path "".*not an instance of Foo/)
    expect(() => Gubu(new Bar(12))(new Foo(12)))
      .toThrow(/path "".*not an instance of Bar/)



    expect(Gubu({ a: String })({ a: 'x' })).toEqual({ a: 'x' })
    expect(Gubu({ a: Number })({ a: 1 })).toEqual({ a: 1 })
    expect(Gubu({ a: Boolean })({ a: true })).toEqual({ a: true })
    expect(Gubu({ a: Object })({ a: { x: 1 } })).toEqual({ a: { x: 1 } })


    expect(() => Gubu({ a: String })({ a: 1 }))
      .toThrow(/path "a".*not of type string/)
    expect(() => Gubu({ a: Number })({ a: 'x' }))
      .toThrow(/path "a".*not of type number/)
    expect(() => Gubu({ a: Boolean })({ a: 'x' }))
      .toThrow(/path "a".*not of type boolean/)
    expect(() => Gubu({ a: Object })({ a: 'x' }))
      .toThrow(/path "a".*not of type object/)

    expect(Gubu([String])(['x'])).toEqual(['x'])
    expect(Gubu([Number])([1])).toEqual([1])
    expect(Gubu([Boolean])([true])).toEqual([true])
    expect(Gubu([Object])([{ x: 1 }])).toEqual([{ x: 1 }])

    expect(() => Gubu([String])([1]))
      .toThrow(/path "0".*not of type string/)
    expect(() => Gubu([Number])(['x']))
      .toThrow(/path "0".*not of type number/)
    expect(() => Gubu([Boolean])(['x']))
      .toThrow(/path "0".*not of type boolean/)
    expect(() => Gubu([Object])([1]))
      .toThrow(/path "0".*not of type object/)

  })


  test('shapes-fails', () => {
    let tmp: any = {}

    let string0 = Gubu(String)
    expect(string0('x')).toEqual('x')
    expect(() => string0(1)).toThrow(/not of type string/)
    expect(() => string0(true)).toThrow(/not of type string/)
    expect(() => string0(BigInt(11))).toThrow(/not of type string/)
    expect(() => string0(null)).toThrow(/not of type string/)
    expect(() => string0({})).toThrow(/not of type string/)
    expect(() => string0([])).toThrow(/not of type string/)
    expect(() => string0(/a/)).toThrow(/not of type string/)
    expect(() => string0(NaN)).toThrow(/not of type string/)
    expect(() => string0(Infinity)).toThrow(/not of type string/)
    expect(() => string0(undefined)).toThrow(/value is required/)
    expect(() => string0(new Date())).toThrow(/not of type string/)
    expect(() => string0(new Foo(1))).toThrow(/not of type string/)

    let number0 = Gubu(Number)
    expect(number0(1)).toEqual(1)
    expect(number0(Infinity)).toEqual(Infinity)
    expect(() => number0('x')).toThrow(/not of type number/)
    expect(() => number0(true)).toThrow(/not of type number/)
    expect(() => number0(BigInt(11))).toThrow(/not of type number/)
    expect(() => number0(null)).toThrow(/not of type number/)
    expect(() => number0({})).toThrow(/not of type number/)
    expect(() => number0([])).toThrow(/not of type number/)
    expect(() => number0(/a/)).toThrow(/not of type number/)
    expect(() => number0(NaN)).toThrow(/not of type number/)
    expect(() => number0(undefined)).toThrow(/value is required/)
    expect(() => number0(new Date())).toThrow(/not of type number/)
    expect(() => number0(new Foo(1))).toThrow(/not of type number/)

    let object0 = Gubu(Object)
    expect(object0({})).toEqual({})
    expect(object0(tmp.r0 = /a/)).toEqual(tmp.r0)
    expect(object0(tmp.d0 = new Date())).toEqual(tmp.d0)
    expect(object0(tmp.f0 = new Foo(1))).toEqual(tmp.f0)
    expect(() => object0(1)).toThrow(/not of type object/)
    expect(() => object0('x')).toThrow(/not of type object/)
    expect(() => object0(true)).toThrow(/not of type object/)
    expect(() => object0(BigInt(11))).toThrow(/not of type object/)
    expect(() => object0(null)).toThrow(/not of type object/)
    expect(() => object0([])).toThrow(/not of type object/)
    expect(() => object0(NaN)).toThrow(/not of type object/)
    expect(() => object0(undefined)).toThrow(/value is required/)

    let array0 = Gubu(Array)
    expect(array0([])).toEqual([])
    expect(() => array0('x')).toThrow(/not of type array/)
    expect(() => array0(true)).toThrow(/not of type array/)
    expect(() => array0(BigInt(11))).toThrow(/not of type array/)
    expect(() => array0(null)).toThrow(/not of type array/)
    expect(() => array0({})).toThrow(/not of type array/)
    expect(() => array0(/a/)).toThrow(/not of type array/)
    expect(() => array0(NaN)).toThrow(/not of type array/)
    expect(() => array0(undefined)).toThrow(/value is required/)
    expect(() => array0(new Date())).toThrow(/not of type array/)
    expect(() => array0(new Foo(1))).toThrow(/not of type array/)

  })


  test('shapes-builtins', () => {
    let d0 = new Date(2121, 1, 1)
    let g0 = Gubu({ a: Date })
    expect(g0({ a: d0 })).toEqual({ a: d0 })
    expect(() => g0({})).toThrow('required')
    expect(() => g0({ a: Date })).toThrow('instance')
    expect(() => g0({ a: /QXQ/ })).toThrow(/QXQ.*instance/)

    let g1 = Gubu({ a: Optional(Date) })
    expect(g1({ a: d0 })).toEqual({ a: d0 })
    expect(g1({})).toEqual({})


    let r0 = /a/
    let g2 = Gubu({ a: RegExp })
    expect(g2({ a: r0 })).toEqual({ a: r0 })
    expect(() => g2({})).toThrow('required')
    expect(() => g2({ a: RegExp })).toThrow('instance')
    expect(() => g2({ a: d0 })).toThrow(/2121.*instance/)

    let g3 = Gubu({ a: Optional(RegExp) })
    expect(g3({ a: r0 })).toEqual({ a: r0 })
    expect(g3({})).toEqual({})

  })


  test('shapes-edges', () => {

    // NaN is actually Not-a-Number (whereas 'number' === typeof(NaN))
    const num0 = Gubu(1)
    expect(num0(1)).toEqual(1)
    expect(() => num0(NaN)).toThrow(/not of type number/)

    const nan0 = Gubu(NaN)
    expect(nan0(NaN)).toEqual(NaN)
    expect(() => nan0(1)).toThrow(/not of type nan/)


    // Empty strings only allowed by Empty() builder.

    const rs0 = Gubu(String)
    expect(rs0('x')).toEqual('x')
    expect(() => rs0('')).toThrow('Validation failed for path "" with value "" because the value is required.')

    const rs0e = Gubu(Empty(String))
    expect(rs0e('x')).toEqual('x')
    expect(rs0e('')).toEqual('')

    const os0 = Gubu('x')
    // expect(os0('')).toEqual('x')
    expect(() => os0('')).toThrow('required')
    expect(os0()).toEqual('x')
    expect(os0(undefined)).toEqual('x')
    expect(os0('x')).toEqual('x')
    expect(os0('y')).toEqual('y')

    const os0e = Gubu(Empty('x'))
    expect(os0e('')).toEqual('')
    expect(os0e()).toEqual('x')
    expect(os0e(undefined)).toEqual('x')
    expect(os0e('x')).toEqual('x')
    expect(os0e('y')).toEqual('y')

    const os1e = Gubu(Optional(Empty(String)))
    expect(os1e()).toEqual(undefined)
    expect(os1e('')).toEqual('')
    expect(os1e('x')).toEqual('x')

    const os1eO = Gubu({ a: Optional(Empty(String)) })
    expect(os1eO({})).toEqual({})
    expect(os1eO({ a: '' })).toEqual({ a: '' })
    expect(os1eO({ a: 'x' })).toEqual({ a: 'x' })


    // Long values are truncated in error descriptions.
    expect(() => Gubu(Number)('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')).toThrow('Validation failed for path "" with value "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa..." because the value is not of type number.')


    // Explicit `undefined` and `null`

    const u0 = Gubu({ a: undefined })
    expect(u0({ a: undefined })).toEqual({ a: undefined })
    expect(u0({})).toEqual({ a: undefined })

    const u0n = Gubu({ a: null })
    expect(u0n({ a: null })).toEqual({ a: null })
    expect(u0n({})).toEqual({ a: null })
    expect(() => u0n({ a: 1 })).toThrow('type')

    const u1 = Gubu({ a: Required(undefined) })
    expect(u1({ a: undefined })).toEqual({ a: undefined })
    expect(() => u1({})).toThrow('required')

    const u1n = Gubu({ a: Required(null) })
    expect(u1n({ a: null })).toEqual({ a: null })
    expect(() => u1n({})).toThrow('required')
    expect(() => u1n({ a: 1 })).toThrow('type')

    const u2 = Gubu({ a: Required(NaN) })
    expect(u2({ a: NaN })).toEqual({ a: NaN })
    expect(() => u2({})).toThrow('required')

  })


  test('builder-construct', () => {
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
  })


  test('type-default-optional', () => {
    let f0 = () => true

    let g0 = Gubu({
      string: 's',
      number: 1,
      boolean: true,
      object: { x: 2 },
      array: [3],
      function: G$({ t: 'function', v: f0 })
    })

    expect(g0({})).toMatchObject({
      string: 's',
      number: 1,
      boolean: true,
      object: { x: 2 },
      array: [],
      function: f0
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
    let g0 = Gubu({
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


    let e0 = Gubu({ s0: String, s1: 'x' })
    expect(e0({ s0: 'a' })).toMatchObject({ s0: 'a', s1: 'x' })

    expect(() => e0({ s0: 1 })).toThrow(/Validation failed for path "s0" with value "1" because the value is not of type string\./)
    expect(() => e0({ s1: 1 })).toThrow(/Validation failed for path "s0" with value "" because the value is required\.\nValidation failed for path "s1" with value "1" because the value is not of type string\./)

    // TODO: more fails

  })


  test('type-native-optional', () => {
    let { Optional } = Gubu

    // Explicit Optional over native type sets no value.
    let g0 = Gubu({
      string: Optional(String),
      number: Optional(Number),
      boolean: Optional(Boolean),
      object: Optional(Object),
      array: Optional(Array),
      function: Optional(Function),
    })

    expect(g0({})).toEqual({})
  })


  test('array-elements', () => {
    let g0 = Gubu({
      a: [String]
    })

    expect(g0({ a: [] })).toEqual({ a: [] })
    expect(g0({ a: ['X'] })).toEqual({ a: ['X'] })
    expect(g0({ a: ['X', 'Y'] })).toEqual({ a: ['X', 'Y'] })
    expect(g0({ a: ['X', 'Y', 'Z'] })).toEqual({ a: ['X', 'Y', 'Z'] })

    expect(() => g0({ a: [null] })).toThrow(/"a.0".*"null".*type string/)
    expect(() => g0({ a: [''] })).toThrow(/"a.0".*"".*required/)

    expect(() => g0({ a: [11] })).toThrow(/"a.0".*"11".*type string/)
    expect(() => g0({ a: ['X', 11] })).toThrow(/"a.1".*"11".*type string/)
    expect(() => g0({ a: ['X', 'Y', 11] })).toThrow(/"a.2".*"11".*type string/)
    expect(() => g0({ a: ['X', 'Y', 'Z', 11] })).toThrow(/"a.3".*"11".*type string/)

    expect(() => g0({ a: ['X', null] })).toThrow(/"a.1".*"null".*type string/)
    expect(() => g0({ a: ['X', ''] })).toThrow(/"a.1".*"".*required/)

    expect(() => g0({ a: [11, 'K'] })).toThrow(/"a.0".*"11".*string/)
    expect(() => g0({ a: ['X', 11, 'K'] })).toThrow(/"a.1".*"11".*string/)
    expect(() => g0({ a: ['X', 'Y', 11, 'K'] })).toThrow(/"a.2".*"11".*string/)
    expect(() => g0({ a: ['X', 'Y', 'Z', 11, 'K'] })).toThrow(/"a.3".*"11".*string/)

    expect(() => g0({ a: [22, 'Y', 11, 'K'] })).toThrow(/"a.0".*"22".*"a.2".*"11"/s)
    expect(() => g0({ a: ['X', 'Y', 'Z', 11, 'K', 'L'] })).toThrow(/"a.3".*"11"/)


    let g1 = Gubu([String])
    expect(g1(['X', 'Y'])).toEqual(['X', 'Y'])
    expect(() => g1(['X', 1])).toThrow(/Validation failed for path "1" with value "1" because the value is not of type string\./)

    let g2 = Gubu([Any(), { x: 1 }, { y: true }])
    expect(g2([{ x: 2 }, { y: false }])).toEqual([{ x: 2 }, { y: false }])
    expect(g2([{ x: 2 }, { y: false }, 'Q'])).toEqual([{ x: 2 }, { y: false }, 'Q'])
    expect(() => g2([{ x: 'X' }, { y: false }])).toThrow('Validation failed for path "0.x" with value "X" because the value is not of type number.')
    expect(() => g2(['Q', { y: false }])).toThrow('Validation failed for path "0" with value "Q" because the value is not of type object.')
    expect(g2([{ x: 2 }])).toEqual([{ x: 2 }, { y: true }])
    expect(g2([undefined, { y: false }, 'Q'])).toEqual([{ x: 1 }, { y: false }, 'Q'])


    let g3 = Gubu([null])
    expect(g3([null, null])).toEqual([null, null])


    // NOTE: array without spec can hold anything.
    let g4 = Gubu([])
    expect(g4([null, 1, 'x', true])).toEqual([null, 1, 'x', true])


    expect(() => Gubu({ x: 1 })('q')).toThrow(/type object/)
    expect(() => Gubu({ y: { x: 1 } })({ y: 'q' })).toThrow(/type object/)

    let g5 = Gubu([{ x: 1 }])
    expect(g5([])).toEqual([])
    expect(g5([{ x: 11 }])).toEqual([{ x: 11 }])
    expect(g5([{ x: 11 }, { x: 22 }])).toEqual([{ x: 11 }, { x: 22 }])
    expect(g5([{ x: 11 }, { x: 22 }, { x: 33 }]))
      .toEqual([{ x: 11 }, { x: 22 }, { x: 33 }])

    expect(() => g5(['q'])).toThrow(/"0".*"q".*type object/)
    expect(() => g5([{ x: 11 }, 'q'])).toThrow(/"1".*"q".*type object/)
    expect(() => g5([{ x: 11 }, { y: 22 }, 'q'])).toThrow(/"2".*"q".*type object/)
    expect(() => g5([{ x: 11 }, { y: 22 }, { z: 33 }, 'q'])).toThrow(/"3".*"q".*type object/)

    expect(() => g5(['q', { k: 99 }])).toThrow(/"0".*"q".*type object/)
    expect(() => g5([{ x: 11 }, 'q', { k: 99 }])).toThrow(/"1".*"q".*type object/)
    expect(() => g5([{ x: 11 }, { y: 22 }, 'q', { k: 99 }]))
      .toThrow(/"2".*"q".*type object/)
    expect(() => g5([{ x: 11 }, { y: 22 }, { z: 33 }, 'q', { k: 99 }]))
      .toThrow(/"3".*"q".*type object/)
  })


  test('object-properties', () => {

    // NOTE: unclosed object without props can hold anything
    let g0 = Gubu({})
    expect(g0({ a: null, b: 1, c: 'x', d: true }))
      .toEqual({ a: null, b: 1, c: 'x', d: true })

    let g1 = Gubu(Closed({}))
    expect(g1({})).toEqual({})
    expect(() => g1({ a: null, b: 1, c: 'x', d: true })).toThrow('Validation failed for path "" with value "{a:null,b:1,c:x,d:true}" because the property "a" is not allowed.\nValidation failed for path "" with value "{a:null,b:1,c:x,d:true}" because the property "b" is not allowed.\nValidation failed for path "" with value "{a:null,b:1,c:x,d:true}" because the property "c" is not allowed.\nValidation failed for path "" with value "{a:null,b:1,c:x,d:true}" because the property "d" is not allowed.')
  })


  test('custom-basic', () => {
    let g0 = Gubu({ a: (v: any) => v > 10 })
    expect(g0({ a: 11 })).toMatchObject({ a: 11 })
    expect(() => g0({ a: 9 })).toThrow(/Validation failed for path "a" with value "9" because check "custom: a" failed\./)

    let g1 = Gubu({ a: Optional((v: any) => v > 10) })
    expect(g1({ a: 11 })).toMatchObject({ a: 11 })
    expect(() => g1({ a: 9 })).toThrow('Validation failed for path "a" with value "9" because check "custom: (v) => v > 10" failed.')
    expect(g1({})).toMatchObject({})

    let g2 = Gubu({ a: Required((v: any) => v > 10) })
    expect(g1({ a: 11 })).toMatchObject({ a: 11 })
    expect(() => g2({ a: 9 })).toThrow('Validation failed for path "a" with value "9" because check "custom: (v) => v > 10" failed.')
    expect(() => g2({})).toThrow(`Validation failed for path "a" with value "" because check "custom: (v) => v > 10" failed.
Validation failed for path "a" with value "" because the value is required.`)

    let g3 = Gubu((v: any) => v > 10)
    expect(g3(11)).toEqual(11)
    expect(() => g3(9)).toThrow('Validation failed for path "" with value "9" because check "custom: (v) => v > 10" failed.')

  })


  test('after-multiple', () => {
    let g0 = Gubu(
      After(
        function v1(v: any, u: any) { u.val = v + 1; return true },
        After(
          function v2(v: any, u: any) { u.val = v * 2; return true },
          Number
        )))
    expect(g0(1)).toEqual(3)
    expect(g0(2)).toEqual(5)
  })


  test('builder-before-after-basic', () => {
    let g0 = Gubu(
      Before((val: any, _update: Update) => {
        val.b = 1 + val.a
        return true
      }, { a: 1 })
        .After((val: any, _update: Update) => {
          val.c = 10 * val.a
          return true
        }))

    expect('' + g0).toMatch(/\[Gubu G\d+ \{"a":1\}\]/)
    expect(g0({ a: 2 })).toMatchObject({ a: 2, b: 3, c: 20 })

    let g1 = Gubu({
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



  test('deep-object-basic', () => {
    let a1 = Gubu({ a: 1 })
    expect(a1({})).toMatchObject({ a: 1 })

    let ab1 = Gubu({ a: { b: 1 } })
    expect(ab1({})).toMatchObject({ a: { b: 1 } })

    let abc1 = Gubu({ a: { b: { c: 1 } } })
    expect(abc1({})).toMatchObject({ a: { b: { c: 1 } } })


    let ab1c2 = Gubu({ a: { b: 1 }, c: 2 })
    expect(ab1c2({})).toMatchObject({ a: { b: 1 }, c: 2 })

    let ab1cd2 = Gubu({ a: { b: 1 }, c: { d: 2 } })
    expect(ab1cd2({})).toMatchObject({ a: { b: 1 }, c: { d: 2 } })

    let abc1ade2f3 = Gubu({ a: { b: { c: 1 }, d: { e: 2 } }, f: 3 })
    expect(abc1ade2f3({})).toMatchObject({ a: { b: { c: 1 }, d: { e: 2 } }, f: 3 })


    let d0 = Gubu({
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
    let a0 = Gubu([1])
    // console.dir(a0.spec(), { depth: null })
    expect(a0()).toMatchObject([])
    expect(a0([])).toMatchObject([])
    expect(a0([11])).toMatchObject([11])
    expect(a0([11, 22])).toMatchObject([11, 22])

    let a1 = Gubu([-1, 1, 2, 3])
    // console.dir(a1.spec(), { depth: null })
    expect(a1()).toMatchObject([1, 2, 3])
    expect(a1([])).toMatchObject([1, 2, 3])
    expect(a1([11])).toMatchObject([11, 2, 3])
    expect(a1([11, 22])).toMatchObject([11, 22, 3])
    expect(a1([11, 22, 33])).toMatchObject([11, 22, 33])
    expect(a1([11, 22, 33, 44])).toMatchObject([11, 22, 33, 44])
    expect(a1([undefined, 22])).toMatchObject([1, 22, 3])

  })



  test('builder-required', () => {
    let g0 = Gubu({ a: Required({ x: 1 }) })
    expect(g0({ a: { x: 1 } })).toEqual({ a: { x: 1 } })
    expect(() => g0({})).toThrow('Validation failed for path "a" with value "" because the value is required.')

    let g1 = Gubu({ a: Required([1]) })
    expect(g1({ a: [11] })).toEqual({ a: [11] })
    expect(() => g1({})).toThrow('Validation failed for path "a" with value "" because the value is required.')

    let g2 = Gubu(Required(1))
    expect(g2(1)).toEqual(1)
    expect(g2(2)).toEqual(2)

  })


  test('builder-closed', () => {
    let tmp: any = {}

    let g0 = Gubu({ a: { b: { c: Closed({ x: 1 }) } } })
    expect(g0({ a: { b: { c: { x: 2 } } } })).toEqual({ a: { b: { c: { x: 2 } } } })
    expect(() => g0({ a: { b: { c: { x: 2, y: 3 } } } })).toThrow(/Validation failed for path "a.b.c" with value "{x:2,y:3}" because the property "y" is not allowed\./)

    let g1 = Gubu(Closed([Any(), Date, RegExp]))
    expect(g1(tmp.a0 = [new Date(), /a/])).toEqual(tmp.a0)
    expect(() => g1([new Date(), /a/, 'Q'])).toThrow(/Validation failed for path "" with value "\[[^Z]+Z,\/a\/,Q\]" /) // because the property "2" is not allowed\./)

  })


  test('builder-one', () => {
    let g0 = Gubu(One(Number, String))
    expect(g0(1)).toEqual(1)
    expect(g0('x')).toEqual('x')
    expect(() => g0(true)).toThrow(`Value "true" for path "" does not satisfy One shape:
Validation failed for path "" with value "true" because the value is not of type number.
Validation failed for path "" with value "true" because the value is not of type string.`)

    let g1 = Gubu([One({ x: Number }, { x: String })])
    expect(g1([{ x: 1 }, { x: 'x' }, { x: 2 }, { x: 'y' }]))
      .toMatchObject([{ x: 1 }, { x: 'x' }, { x: 2 }, { x: 'y' }])
    expect(() => g1([{ x: 1 }, { x: true }, { x: 2 }, { x: false }]))
      .toThrow(`Value "{x:true}" for path "1" does not satisfy One shape:
Validation failed for path "x" with value "true" because the value is not of type number.
Validation failed for path "x" with value "true" because the value is not of type string.
Value "{x:false}" for path "3" does not satisfy One shape:
Validation failed for path "x" with value "false" because the value is not of type number.
Validation failed for path "x" with value "false" because the value is not of type string.`)

    let g2 = Gubu([One(
      { x: Exact('red'), y: String },
      { x: Exact('green'), z: Number }
    )])
    expect(g2([
      { x: 'red', y: 'Y' },
      { x: 'green', z: 1 },
      { x: 'green', z: 2, y: 22 },
      { x: 'red', y: 'Y', z: 'YY' }
    ])).toMatchObject([
      { x: 'red', y: 'Y' },
      { x: 'green', z: 1 },
      { x: 'green', z: 2, y: 22 },
      { x: 'red', y: 'Y', z: 'YY' }
    ])

    // TODO: improve error messaging for this case (multiple specs fail)
    expect(() => g2([
      { x: 'red', y: 3 },
      { x: 'green', z: 'Z' },
    ])).toThrow(`Value "{x:red,y:3}" for path "0" does not satisfy One shape:
Validation failed for path "y" with value "3" because the value is not of type string.
Value "red" for path "x" must be exactly one of: "green".
Validation failed for path "z" with value "" because the value is required.
Value "{x:green,z:Z}" for path "1" does not satisfy One shape:
Value "green" for path "x" must be exactly one of: "red".
Validation failed for path "y" with value "" because the value is required.
Validation failed for path "z" with value "Z" because the value is not of type number.`)
  })


  test('builder-some', () => {
    let g0 = Gubu({ a: Some(Number, String) })
    expect(g0({ a: 1 })).toEqual({ a: 1 })
    expect(g0({ a: 'x' })).toEqual({ a: 'x' })
    expect(() => g0({ a: true })).toThrow(`Value "true" for path "a" does not satisfy Some shape:
Validation failed for path "" with value "true" because the value is not of type number.
Validation failed for path "" with value "true" because the value is not of type string.`)

    let g1 = Gubu(Some(Number, String))
    expect(g1(1)).toEqual(1)
    expect(g1('x')).toEqual('x')
    expect(() => g1(true)).toThrow(`Value "true" for path "" does not satisfy Some shape:
Validation failed for path "" with value "true" because the value is not of type number.
Validation failed for path "" with value "true" because the value is not of type string.`)

    let g2 = Gubu([Some(Number, String)])
    expect(g2([1])).toEqual([1])
    expect(g2(['x'])).toEqual(['x'])
    expect(g2([1, 2])).toEqual([1, 2])
    expect(g2([1, 'x'])).toEqual([1, 'x'])
    expect(g2(['x', 1])).toEqual(['x', 1])
    expect(g2(['x', 'y'])).toEqual(['x', 'y'])
    expect(g2(['x', 1, 'y', 2])).toEqual(['x', 1, 'y', 2])
    expect(() => g2([true])).toThrow(`Value "true" for path "0" does not satisfy Some shape:
Validation failed for path "" with value "true" because the value is not of type number.
Validation failed for path "" with value "true" because the value is not of type string.`)

    let g3 = Gubu({ a: [Some(Number, String)] })
    expect(g3({ a: [1] })).toEqual({ a: [1] })
    expect(g3({ a: ['x'] })).toEqual({ a: ['x'] })
    expect(g3({ a: ['x', 1, 'y', 2] })).toEqual({ a: ['x', 1, 'y', 2] })
    expect(() => g3({ a: [1, 2, true] })).toThrow(`Value "true" for path "a.2" does not satisfy Some shape:
Validation failed for path "" with value "true" because the value is not of type number.
Validation failed for path "" with value "true" because the value is not of type string.`)

    let g4 = Gubu({ a: [Some({ x: 1 }, { x: 'X' })] })
    expect(g4({ a: [{ x: 2 }, { x: 'Q' }, { x: 3, y: true }, { x: 'W', y: false }] }))
      .toEqual({ a: [{ x: 2 }, { x: 'Q' }, { x: 3, y: true }, { x: 'W', y: false }] })

    let g5 = Gubu({ a: [Some({ x: 1 }, Closed({ x: 'X' }))] })
    expect(g5({ a: [{ x: 2 }, { x: 'Q' }] }))
      .toEqual({ a: [{ x: 2 }, { x: 'Q' }] })
  })


  test('builder-all', () => {
    let g0 = Gubu(All({ x: 1 }, { y: 'a' }))
    expect(g0({ x: 1, y: 'a' })).toEqual({ x: 1, y: 'a' })
    expect(() => g0({ x: 'b', y: 'a' })).toThrow(
      `Value "{x:b,y:a}" for path "" does not satisfy All shape:
Validation failed for path "x" with value "b" because the value is not of type number.`)

    let g1 = Gubu({ a: All((v: number) => v > 10, (v: number) => v < 20) })
    expect(g1({ a: 11 })).toEqual({ a: 11 })
    expect(() => g1({ a: 0 })).toThrow(
      `Value "0" for path "a" does not satisfy All shape:
Validation failed for path "" with value "0" because check "custom: (v) => v > 10" failed.`)

    let g2 = Gubu(All({ x: 1 }, { y: { z: 'a' } }))
    expect(g2({ x: 11, y: { z: 'AA' } })).toEqual({ x: 11, y: { z: 'AA' } })
    expect(() => g2({ x: 11, y: { z: true } })).toThrow(/path "y.z".*"true".*string/)

    let g3 = Gubu(All({ x: 1 }, { y: 2 }))
    expect(g3({ x: 11, y: 22 })).toEqual({ x: 11, y: 22 })
    expect(() => g3({ x: 'X', y: 'Y' })).toThrow(
      `Value "{x:X,y:Y}" for path "" does not satisfy All shape:
Validation failed for path "x" with value "X" because the value is not of type number.
Validation failed for path "y" with value "Y" because the value is not of type number.`)

  })


  test('builder-custom-between', () => {
    const rangeCheck = Gubu([Never(), Number, Number])
    const Between: Builder =
      function(this: ValSpec, inopts: any, spec?: any): ValSpec {
        let vs = buildize(this || spec)
        let range: number[] = rangeCheck(inopts)

        vs.b = (val: any, update: Update, state: State) => {
          // Don't run any more checks after this.
          update.done = true

          if ('number' === typeof (val) && range[0] < val && val < range[1]) {
            return true
          }
          else {
            update.err = [
              makeErr(val, state,
                `Value "$VALUE" for path "$PATH" is ` +
                `not between ${range[0]} and ${range[1]}.`)
            ]
            return false
          }
        }

        return vs
      }

    const g0 = Gubu({ a: [Between([10, 20])] })
    expect(g0({ a: [11, 12, 13] })).toEqual({ a: [11, 12, 13] })
    expect(() => g0({ a: [11, 9, 13, 'y'] })).toThrow('Value "9" for path "a.1" is not between 10 and 20.\nValue "y" for path "a.3" is not between 10 and 20.')
  })


  test('builder-required', () => {
    let g0 = Gubu({ a: Required(1) })
    expect(g0({ a: 2 })).toMatchObject({ a: 2 })
    expect(() => g0({ a: 'x' })).toThrow(/number/)
  })


  test('builder-optional', () => {
    let g0 = Gubu({ a: Optional(String) })
    expect(g0({ a: 'x' })).toMatchObject({ a: 'x' })

    // NOTE: Optional(Type) does not insert a default value.
    expect(g0({})).toMatchObject({})
    expect(() => g0({ a: 1 })).toThrow(/string/)
  })


  test('builder-any', () => {
    let g0 = Gubu({ a: Any(), b: Any('B') })
    expect(g0({ a: 2, b: 1 })).toMatchObject({ a: 2, b: 1 })
    expect(g0({ a: 'x', b: 'y' })).toMatchObject({ a: 'x', b: 'y' })
    expect(g0({ b: 1 })).toEqual({ b: 1 })
    expect(g0({ a: 1, b: 'B' })).toEqual({ a: 1, b: 'B' })
  })


  test('builder-never', () => {
    let g0 = Gubu(Never())
    expect(() => g0(1)).toThrow('Validation failed for path "" with value "1" because no value is allowed.')
    let g1 = Gubu({ a: Never() })
    expect(() => g1({ a: 'x' })).toThrow('Validation failed for path "a" with value "x" because no value is allowed.')

    // Another way to do closed arrays.
    let g2 = Gubu([Never(), 1, 'x'])
    expect(g2([2, 'y'])).toEqual([2, 'y'])
    expect(() => g2([2, 'y', true])).toThrow('Validation failed for path "2" with value "true" because no value is allowed.')
  })


  test('builder-rename', () => {
    let g0 = Gubu({ a: Rename('b', { x: 1 }) })
    expect(g0({ a: { x: 2 } })).toMatchObject({ b: { x: 2 } })

    let g1 = Gubu([
      Never(),
      Rename('a', String),
      Rename('b', 2),
      Rename({ name: 'c', keep: false }, true)
    ])
    expect(g1(['x', 22])).toMatchObject({ 0: 'x', 1: 22, a: 'x', b: 22 })
    expect('' + g1(['x', 22])).toEqual('x,22,')
    expect(g1(['x'])).toMatchObject({ 0: 'x', a: 'x', b: 2 })
    expect('' + g1(['x'])).toEqual('x,2,')
    expect(() => g1([])).toThrow('required')
    expect(g1(['x', 22, false]))
      .toMatchObject({ 0: 'x', 1: 22, a: 'x', b: 22, c: false })
  })


  test('builder-exact', () => {
    let g0 = Gubu({ a: Exact(null) })
    expect(g0({ a: null })).toMatchObject({ a: null })
    expect(() => g0({ a: 1 })).toThrow('exactly one of: null')

    let g1 = Gubu(Exact('foo', 'bar'))
    expect(g1('foo')).toEqual('foo')
    expect(g1('bar')).toEqual('bar')
    expect(() => g1('zed')).toThrow('exactly one of: "foo", "bar"')
  })


  test('builder-define-refer-basic', () => {
    let g0 = Gubu({ a: Define('A', { x: 1 }), b: Refer('A'), c: Refer('A') })
    // console.log(g0.spec())
    expect(g0({ a: { x: 2 }, b: { x: 2 } }))
      .toEqual({ a: { x: 2 }, b: { x: 2 } })
    expect(g0({ a: { x: 33 }, b: { x: 44 }, c: { x: 55 } }))
      .toEqual({ a: { x: 33 }, b: { x: 44 }, c: { x: 55 } })
    expect(() => g0({ a: { x: 33 }, b: { x: 'X' } }))
      .toThrow('Validation failed for path "b.x" with value "X" because the value is not of type number.')

    let g1 = Gubu({
      a: Define('A', { x: 1 }),
      b: Refer('A'),
      c: Refer({ name: 'A', fill: true })
    })
    expect(g1({ a: { x: 2 } }))
      .toEqual({ a: { x: 2 }, c: { x: 1 } })
    expect(g1({ a: { x: 2 }, b: { x: 2 } }))
      .toEqual({ a: { x: 2 }, b: { x: 2 }, c: { x: 1 } })
    expect(g1({ a: { x: 2 }, b: { x: 2 }, c: {} }))
      .toEqual({ a: { x: 2 }, b: { x: 2 }, c: { x: 1 } })
    expect(g1({ a: { x: 33 }, b: { x: 44 }, c: { x: 2 } }))
      .toEqual({ a: { x: 33 }, b: { x: 44 }, c: { x: 2 } })

  })


  test('builder-define-refer-recursive', () => {
    let g0 = Gubu({
      a: Define('A', {
        b: {
          c: 1,
          a: Refer('A')
        }
      }),
    })

    expect(g0({
      a: {
        b: {
          c: 2,
        }
      }
    })).toEqual({
      a: {
        b: {
          c: 2,
        }
      }
    })

    expect(g0({
      a: {
        b: {
          c: 2,
          a: {
            b: {
              c: 3
            }
          }
        }
      }
    })).toEqual({
      a: {
        b: {
          c: 2,
          a: {
            b: {
              c: 3
            }
          }
        }
      }
    })

    expect(() => g0({
      a: {
        b: {
          c: 2,
          a: {
            b: {
              c: 'C'
            }
          }
        }
      }
    })).toThrow('Validation failed for path "a.b.a.b.c" with value "C" because the value is not of type number.')

    expect(g0({
      a: {
        b: {
          c: 2,
          a: {
            b: {
              c: 3,
              a: {
                b: {
                  c: 4
                }
              }
            }
          }
        }
      }
    })).toEqual({
      a: {
        b: {
          c: 2,
          a: {
            b: {
              c: 3,
              a: {
                b: {
                  c: 4
                }
              }
            }
          }
        }
      }
    })
  })


  test('builder-min', () => {
    let g0 = Gubu({
      a: Min(10),
      b: Min(2, [String]),
      c: Min(3, 'foo'),
      d: [Min(4, Number)]
    })
    expect(g0({ a: 10 })).toMatchObject({ a: 10 })
    expect(g0({ a: 11 })).toMatchObject({ a: 11 })
    expect(() => g0({ a: 9 }))
      .toThrow(`Value "9" for path "a" must be a minimum of 10 (was 9).`)

    expect(g0({ b: ['x', 'y'] })).toMatchObject({ b: ['x', 'y'] })
    expect(g0({ b: ['x', 'y', 'z'] })).toMatchObject({ b: ['x', 'y', 'z'] })
    expect(() => g0({ b: ['x'] }))
      .toThrow(`Value "[x]" for path "b" must be a minimum length of 2 (was 1).`)
    expect(() => g0({ b: [] }))
      .toThrow(`Value "[]" for path "b" must be a minimum length of 2 (was 0).`)

    expect(g0({ c: 'bar' })).toMatchObject({ c: 'bar' })
    expect(g0({ c: 'barx' })).toMatchObject({ c: 'barx' })
    expect(() => g0({ c: 'ba' }))
      .toThrow(`Value "ba" for path "c" must be a minimum length of 3 (was 2).`)

    expect(g0({ d: [4, 5, 6] })).toMatchObject({ d: [4, 5, 6] })
    expect(() => g0({ d: [4, 5, 6, 3] }))
      .toThrow(`Value "3" for path "d.3" must be a minimum of 4 (was 3).`)
  })


  test('builder-max', () => {
    let g0 = Gubu({
      a: Max(10),
      b: Max(2, [String]),
      c: Max(3, 'foo'),
      d: [Max(4, Number)]
    })
    expect(g0({ a: 10 })).toMatchObject({ a: 10 })
    expect(g0({ a: 9 })).toMatchObject({ a: 9 })
    expect(() => g0({ a: 11 }))
      .toThrow(`Value "11" for path "a" must be a maximum of 10 (was 11).`)

    expect(g0({ b: ['x', 'y'] })).toMatchObject({ b: ['x', 'y'] })
    expect(g0({ b: ['x'] })).toMatchObject({ b: ['x'] })
    expect(g0({ b: [] })).toMatchObject({ b: [] })
    expect(() => g0({ b: ['x', 'y', 'z'] }))
      .toThrow(`Value "[x,y,z]" for path "b" must be a maximum length of 2 (was 3).`)

    expect(g0({ c: 'bar' })).toMatchObject({ c: 'bar' })
    expect(g0({ c: 'ba' })).toMatchObject({ c: 'ba' })
    expect(g0({ c: 'b' })).toMatchObject({ c: 'b' })
    expect(() => g0({ c: 'barx' }))
      .toThrow(`Value "barx" for path "c" must be a maximum length of 3 (was 4).`)
    expect(() => g0({ c: '' }))
      .toThrow(`Validation failed for path "c" with value "" because the value is required.`)

    expect(g0({ d: [4, 3, 2, 1, 0, -1] })).toMatchObject({ d: [4, 3, 2, 1, 0, -1] })
    expect(g0({ d: [] })).toMatchObject({ d: [] })
    expect(() => g0({ d: [4, 5] }))
      .toThrow(`Value "5" for path "d.1" must be a maximum of 4 (was 5).`)
  })


  test('builder-above', () => {
    let g0 = Gubu({
      a: Above(10),
      b: Above(2, [String]),
      c: Above(3, 'foo'),
      d: [Above(4, Number)]
    })
    expect(g0({ a: 12 })).toMatchObject({ a: 12 })
    expect(g0({ a: 11 })).toMatchObject({ a: 11 })
    expect(() => g0({ a: 10 }))
      .toThrow(`Value "10" for path "a" must be above 10 (was 10).`)
    expect(() => g0({ a: 9 }))
      .toThrow(`Value "9" for path "a" must be above 10 (was 9).`)

    expect(g0({ b: ['x', 'y', 'z'] })).toMatchObject({ b: ['x', 'y', 'z'] })
    expect(() => g0({ b: ['x', 'y'] }))
      .toThrow(`Value "[x,y]" for path "b" must have length above 2 (was 2).`)
    expect(() => g0({ b: ['x'] }))
      .toThrow(`Value "[x]" for path "b" must have length above 2 (was 1).`)
    expect(() => g0({ b: [] }))
      .toThrow(`Value "[]" for path "b" must have length above 2 (was 0).`)

    expect(g0({ c: 'barx' })).toMatchObject({ c: 'barx' })
    expect(() => g0({ c: 'bar' }))
      .toThrow(`Value "bar" for path "c" must have length above 3 (was 3).`)
    expect(() => g0({ c: 'ba' }))
      .toThrow(`Value "ba" for path "c" must have length above 3 (was 2).`)
    expect(() => g0({ c: 'b' }))
      .toThrow(`Value "b" for path "c" must have length above 3 (was 1).`)
    expect(() => g0({ c: '' }))
      .toThrow(`Validation failed for path "c" with value "" because the value is required.`)

    expect(g0({ d: [5, 6] })).toMatchObject({ d: [5, 6] })
    expect(() => g0({ d: [4, 5, 6, 3] }))
      .toThrow(`Value "4" for path "d.0" must be above 4 (was 4).
Value "3" for path "d.3" must be above 4 (was 3).`)
  })


  test('builder-below', () => {
    let g0 = Gubu({
      a: Below(10),
      b: Below(2, [String]),
      c: Below(3, 'foo'),
      d: [Below(4, Number)]
    })
    expect(g0({ a: 8 })).toMatchObject({ a: 8 })
    expect(g0({ a: 9 })).toMatchObject({ a: 9 })
    expect(() => g0({ a: 10 }))
      .toThrow(`Value "10" for path "a" must be below 10 (was 10).`)
    expect(() => g0({ a: 11 }))
      .toThrow(`Value "11" for path "a" must be below 10 (was 11).`)

    expect(g0({ b: ['x'] })).toMatchObject({ b: ['x'] })
    expect(g0({ b: [] })).toMatchObject({ b: [] })
    expect(() => g0({ b: ['x', 'y', 'z'] }))
      .toThrow(`Value "[x,y,z]" for path "b" must have length below 2 (was 3).`)
    expect(() => g0({ b: ['x', 'y'] }))
      .toThrow(`Value "[x,y]" for path "b" must have length below 2 (was 2).`)

    expect(g0({ c: 'ba' })).toMatchObject({ c: 'ba' })
    expect(g0({ c: 'b' })).toMatchObject({ c: 'b' })
    expect(() => g0({ c: 'bar' }))
      .toThrow(`Value "bar" for path "c" must have length below 3 (was 3).`)
    expect(() => g0({ c: 'barx' }))
      .toThrow(`Value "barx" for path "c" must have length below 3 (was 4).`)
    expect(() => g0({ c: '' }))
      .toThrow(`Validation failed for path "c" with value "" because the value is required.`)

    expect(g0({ d: [3, 2, 1, 0, -1] })).toMatchObject({ d: [3, 2, 1, 0, -1] })
    expect(g0({ d: [] })).toMatchObject({ d: [] })
    expect(() => g0({ d: [4, 5] }))
      .toThrow(`Value "4" for path "d.0" must be below 4 (was 4).
Value "5" for path "d.1" must be below 4 (was 5).`)
  })


  test('context-basic', () => {
    let c0 = { max: 10 }
    let g0 = Gubu({
      a: (v: any, _u: Update, s: State) => v < s.ctx.max
    })
    expect(g0({ a: 2 }, c0)).toMatchObject({ a: 2 })
    expect(() => g0({ a: 11 }, c0)).toThrow('Validation failed for path "a" with value "11" because check "custom: a" failed.')


    let g1 = Gubu({
      a: { b: All(Number, (v: any, _u: Update, s: State) => v < s.ctx.max) }
    })
    expect(g1({ a: { b: 3 } }, c0)).toMatchObject({ a: { b: 3 } })
    expect(() => g1({ a: { b: 11 } }, c0)).toThrow(`Value "11" for path "a.b" does not satisfy All shape:
Validation failed for path "" with value "11" because check "custom: (v, _u, s) => v < s.ctx.max" failed.`)
  })


  test('error-path', () => {
    let g0 = Gubu({ a: { b: String } })
    expect(g0({ a: { b: 'x' } })).toEqual({ a: { b: 'x' } })
    expect(() => g0(1)).toThrow('path ""')
    expect(() => g0({ a: 1 })).toThrow('path "a"')
    expect(() => g0({ a: { b: 1 } })).toThrow('path "a.b"')
    expect(() => g0({ a: { b: { c: 1 } } })).toThrow('path "a.b"')

    let g1 = Gubu(String)
    expect(g1('x')).toEqual('x')
    expect(() => g1(1)).toThrow('path ""')
    expect(() => g1(true)).toThrow('path ""')
    expect(() => g1(null)).toThrow('path ""')
    expect(() => g1(undefined)).toThrow('path ""')
    expect(() => g1([])).toThrow('path ""')
    expect(() => g1({})).toThrow('path ""')
    expect(() => g1(new Date())).toThrow('path ""')
  })


  test('error-desc', () => {
    const g0 = Gubu(NaN)
    let err: any = []
    let o0 = g0(1, { err })
    expect(o0).toEqual(1)
    expect(err).toMatchObject([{
      n: { t: 'nan', v: NaN, r: false, k: '', d: 0, u: {} },
      s: 1,
      p: '',
      w: 'type',
      m: 1050,
      t: 'Validation failed for path "" with value "1" because the value is not of type nan.'
    }])

    try {
      g0(1, { a: 'A' })
    }
    catch (e: any) {
      expect(e.message).toEqual('Validation failed for path "" with value "1" because the value is not of type nan.')
      expect(e.code).toEqual('shape')
      expect(e.gubu).toEqual(true)
      expect(e.name).toEqual('GubuError')
      expect(e.desc()).toMatchObject({
        code: 'shape',
        ctx: { a: 'A' },
        err: [
          {
            n: { t: 'nan', v: NaN, r: false, k: '', d: 0, u: {} },
            s: 1,
            p: '',
            w: 'type',
            m: 1050,
            t: 'Validation failed for path "" with value "1" because the value is not of type nan.'
          }
        ]
      })
      expect(JSON.stringify(e)).toEqual("{\"gubu\":true,\"name\":\"GubuError\",\"code\":\"shape\",\"err\":[{\"n\":{\"$\":{\"v$\":\"" + Pkg.version + "\"},\"t\":\"nan\",\"v\":null,\"r\":false,\"o\":false,\"k\":\"\",\"d\":0,\"u\":{},\"a\":[]},\"s\":1,\"p\":\"\",\"w\":\"type\",\"m\":1050,\"t\":\"Validation failed for path \\\"\\\" with value \\\"1\\\" because the value is not of type nan.\"}],\"message\":\"Validation failed for path \\\"\\\" with value \\\"1\\\" because the value is not of type nan.\"}")
    }
  })


  test('spec-basic', () => {
    expect(Gubu(Number).spec()).toMatchObject({
      $: { gubu$: true, v$: Pkg.version },
      d: 0, k: '', r: true, t: 'number', u: {}, v: 0,
    })

    expect(Gubu(String).spec()).toMatchObject({
      $: { gubu$: true, v$: Pkg.version },
      d: 0, k: '', r: true, t: 'string', u: {}, v: '',
    })

    expect(Gubu(BigInt).spec()).toMatchObject({
      $: { gubu$: true, v$: Pkg.version },
      d: 0, k: '', r: true, t: 'bigint', u: {}, v: "0",
    })

    expect(Gubu(null).spec()).toMatchObject({
      $: { gubu$: true, v$: Pkg.version },
      d: 0, k: '', r: false, t: 'null', u: {}, v: null,
    })

  })


  test('spec-roundtrip', () => {
    let m0 = { a: 1 }
    let g0 = Gubu(m0)
    expect(m0).toEqual({ a: 1 })

    expect(g0({ a: 2 })).toEqual({ a: 2 })
    expect(m0).toEqual({ a: 1 })

    let s0 = g0.spec()
    expect(m0).toEqual({ a: 1 })
    let s0s = {
      $: {
        gubu$: true,
        v$: Pkg.version,
      },
      d: 0,
      k: '',
      r: false,
      o: false,
      t: 'object',
      u: {},
      a: [],
      v: {
        a: {
          $: {
            gubu$: true,
            v$: Pkg.version,
          },
          d: 1,
          k: 'a',
          r: false,
          o: false,
          t: 'number',
          u: {},
          a: [],
          v: 1,
        },
      },
    }
    expect(s0).toEqual(s0s)
    expect(g0({ a: 2 })).toEqual({ a: 2 })

    let g0r = Gubu(s0)
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
    let g1 = Gubu(m1)
    expect(g1({ a: [2] })).toEqual({ a: [2] })
    expect(m1).toEqual({ a: [1] })

    let s1 = g1.spec()
    let s1s = {
      $: {
        gubu$: true,
        v$: Pkg.version,
      },
      // d: -1,
      d: 0,
      k: '',
      r: false,
      o: false,
      t: 'object',
      u: {},
      a: [],
      v: {
        a: {
          $: {
            gubu$: true,
            v$: Pkg.version,
          },
          d: 1,
          k: 'a',
          r: false,
          o: false,
          t: 'array',
          u: {},
          a: [],
          v: {
            0: {
              $: {
                gubu$: true,
                v$: Pkg.version,
              },
              d: 2,
              k: '0',
              r: false,
              o: false,
              t: 'number',
              u: {},
              a: [],
              v: 1,
            },
          },
        },
      },
    }
    expect(s1).toEqual(s1s)

    let g1r = Gubu(s1)
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



  test('compose', () => {
    let g0 = Gubu(String)
    let g1 = Gubu(g0)
    let g1s = Gubu(g0.spec())
    // console.log(g1.spec())

    expect(g1('x')).toEqual('x')
    expect(() => g1(1)).toThrow()
    expect(g1s('x')).toEqual('x')
    expect(() => g1s(1)).toThrow()


    let g2 = Gubu({ a: Number })
    let g3 = Gubu({ b: g2 })
    let g3s = Gubu({ b: g2.spec() })
    // console.dir(g3.spec(), { depth: null })
    expect(g3({ b: { a: 1 } })).toEqual({ b: { a: 1 } })
    expect(() => g3({ b: { a: 'x' } })).toThrow()
    expect(g3s({ b: { a: 1 } })).toEqual({ b: { a: 1 } })
    expect(() => g3s({ b: { a: 'x' } })).toThrow()
  })


  test('G-basic', () => {
    expect(G$({ v: 11 })).toMatchObject({
      '$': { v$: Pkg.version },
      t: 'number',
      v: 11,
      r: false,
      o: false,
      k: '',
      d: -1,
      a: [],
      u: {}
    })

    expect(G$({ v: Number })).toMatchObject({
      '$': { v$: Pkg.version },
      t: 'number',
      v: 0,
      r: false,
      o: false,
      k: '',
      d: -1,
      a: [],
      u: {}
    })

    expect(G$({ v: BigInt(11) })).toMatchObject({
      '$': { v$: Pkg.version },
      t: 'bigint',
      v: BigInt(11),
      r: false,
      o: false,
      k: '',
      d: -1,
      a: [],
      u: {}
    })

    let s0 = Symbol('foo')
    expect(G$({ v: s0 })).toMatchObject({
      '$': { v$: Pkg.version },
      t: 'symbol',
      v: s0,
      r: false,
      o: false,
      k: '',
      d: -1,
      a: [],
      u: {}
    })

    // NOTE: special case for plain functions.
    // Normally functions become custom validations.
    let f0 = () => true

    expect(G$({ v: f0 })).toMatchObject({
      '$': { v$: Pkg.version },
      t: 'function',
      v: f0,
      r: false,
      o: false,
      k: '',
      d: -1,
      a: [],
      u: {}
    })
  })


  test('just-large', () => {
    let m0: any = Large.m0
    let g0 = Gubu(m0)
    let o0 = g0(Large.i0)
    expect(o0).toEqual(Large.c0)

    let m1 = Large.m1
    let g1 = Gubu(m1)
    let o1 = g1(Large.i1)
    expect(o1).toEqual(Large.c1)
  })


  test('just-long', () => {
    expect(Gubu(Long.m0)(Long.i0)).toEqual(Long.i0)
    expect(Gubu(Long.m1)(Long.i1)).toEqual(Long.i1)
  })


  test('even-larger', () => {
    let m0: any = {}
    let c0 = m0
    for (let i = 0; i < 11111; i++) {
      c0 = c0.a = {}
    }
    let g0 = Gubu(m0)
    expect(g0(m0)).toEqual(m0)

    let m1: any = []
    let c1 = m1
    for (let i = 0; i < 11111; i++) {
      c1 = c1[0] = []
    }
    let g1 = Gubu(m1)
    expect(g1(m1)).toEqual(m1)
  })


  test('even-longer', () => {
    let m0: any = {}
    for (let i = 0; i < 11111; i++) {
      m0['a' + i] = true
    }
    let g0 = Gubu(m0)
    expect(g0(m0)).toEqual(m0)

    let m1: any = {}
    for (let i = 0; i < 11111; i++) {
      m1[i] = true
    }
    let g1 = Gubu(m1)
    expect(g1(m1)).toEqual(m1)
  })

})


