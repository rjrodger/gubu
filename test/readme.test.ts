/* Copyright (c) 2021-2023 Richard Rodger and other contributors, MIT License */


import type {
  Node,
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
const buildize = Gubu.buildize
const makeErr = Gubu.makeErr


const {
  Above,
  After,
  All,
  Any,
  Before,
  Below,
  Check,
  Child,
  Closed,
  Default,
  Define,
  Empty,
  Exact,
  Func,
  Key,
  Len,
  Max,
  Min,
  Never,
  One,
  Open,
  Optional,
  Refer,
  Rename,
  Required,
  Skip,
  Some,
} = Gubu




describe('readme', () => {
  test('readme-optional', () => {
    let shape = Gubu(Optional(String))
    expect(shape()).toEqual('')
    expect(shape('a')).toEqual('a')
    expect(() => shape(1)).toThrow('type')

    shape = Gubu(Optional(Some(String, Number)))
    expect(shape('a')).toEqual('a')
    expect(shape(1)).toEqual(1)
    expect(shape()).toEqual(undefined) // Overrides Some

    shape = Gubu(Some(String, Number))
    expect(shape('a')).toEqual('a')
    expect(shape(1)).toEqual(1)
    expect(() => shape()).toThrow('satisfy')
  })


  test('readme-default', () => {
    let shape = Gubu(Default('none', String))
    expect(shape()).toEqual('none')
    expect(shape('a')).toEqual('a')
    expect(() => shape(1)).toThrow('type')

    shape = Gubu(Default({ a: null }, { a: Number }))
    expect(shape({ a: 1 })).toEqual({ a: 1 })
    expect(shape()).toEqual({ a: null })
    expect(() => shape({ a: 'x' })).toThrow('type')
  })

})

