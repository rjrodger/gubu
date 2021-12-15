# Gubu: An object shape validation utility.

NOTE: WORK IN PROGRESS

This is a schema validator in the tradition of [Joi](https://joi.dev) or any JSON-Schema validator, with the key features:
* Schemas are WYSIWYG - you define a schema with a template matching your object strucure;
* Covers the most useful cases in a natural way - in particular, defaults are specified directly and the type is inferred from the default;
* Very light and easily extensible.
  
Why write yet another validator? I've used `Joi` for a long time, but
always found its schema definition a little verbose at the syntax
level. I've never liked JSON-Schema - it's just too noisy to
eyeball. What I do like is [Vue.js property
validation](https://vuejs.org/v2/guide/components-props.html#Prop-Validation),
but that only works at the top level.

I needed this validator for two cases: adding message validation to
the [Seneca microservices framework](https://senecajs.org), and
providing deep defaults for complex custom Vue.js components.


[![npm version](https://img.shields.io/npm/v/gubu.svg)](https://npmjs.com/package/gubu)
[![build](https://github.com/rjrodger/gubu/actions/workflows/build.yml/badge.svg)](https://github.com/rjrodger/gubu/actions/workflows/build.yml)
[![Coverage Status](https://coveralls.io/repos/github/rjrodger/gubu/badge.svg?branch=main)](https://coveralls.io/github/rjrodger/gubu?branch=main)
[![Known Vulnerabilities](https://snyk.io/test/github/rjrodger/gubu/badge.svg)](https://snyk.io/test/github/rjrodger/gubu)
[![DeepScan grade](https://deepscan.io/api/teams/5016/projects/19459/branches/505694/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=5016&pid=19459&bid=505694)
[![Maintainability](https://api.codeclimate.com/v1/badges/ee603417bbb953d35ebe/maintainability)](https://codeclimate.com/github/rjrodger/gubu/maintainability)

| ![Voxgig](https://www.voxgig.com/res/img/vgt01r.png) | This open source module is sponsored and supported by [Voxgig](https://www.voxgig.com). |
|---|---|


## Quick Example


```js

const { Gubu } = require('gubu')

// Property a is optional, must be a Number, and defaults to 1.
// Property b is required, and must be a String.
const shape = Gubu({ a: 1, b: String })

// Object shape is good! Prints `{ a: 99, b: 'foo' }`
console.log( shape({ a: 99, b: 'foo' }) )

// Object shape is also good. Prints `{ a: 1, b: 'foo' }`
console.log( shape({ b: 'foo' }) )

// Object shape is bad. Throws an exception:
// "TODO: msg"
console.log( shape({ a: 'BAD' }) )

```

Use the exported `Gubu` function to create a validation function that
checks the first argument for validity - does it match the schema shape?


## Install

```sh
$ npm install gubu
```


## Usage

The *Gubu* module has no dependencies. A single function named `Gubu` is exported.


### TypeScript

*Gubu* is written in TypeScript, and can be imported naturally:

```
import { Gubu } from 'gubu' 
```


### Browser

TODO


### Shape Rules

The general principle is that the schema shape should match valid
object as closely as possible.

For scalar values you can provide a native type object to make the value required:
* `Gubu(String)` matches strings: `'foo'`
* `Gubu(Number)` matches numbers: `123`
* `Gubu(Boolean)` matches booleans: `true`

Empty strings are not considered to be valid if a string is required
(this is usually what you want). To allow empty string, use
`Gubu(Empty(String))` (where `Empty` is exported by the `Gubu` module).

Or defaults to make the value optional:
* `Gubu('bar')` matches strings: `'foo'`, and `undefined` (becoming `'bar'`), but not `null`
* `Gubu(0)` matches numbers: `123`, and `undefined` (becoming `0`), but not `null`
* `Gubu(false)` matches booleans: `true`, and `undefined` (becoming `false`), but not `null`

The values `null` and `NaN` must match exactly. The value `undefined`
is special - it literally means no value.

For objects, write them as you want them:

```
let shape = Gubu({
  foo: {
    bar: {
      zed: String,
      qaz: Number,
    }
  }
})
```

For arrays, the first elements is treated as the shape that all elements must match:

* `Gubu([String])` matches `['a', 'b', 'c']`
* `Gubu([{x:1}])` matches `[{x: 11}, {x: 22}, {x: 33}]`


Elements after the first are treated a special cases, defined specific
shapes for each element (offset by 1):

* `Gubu([String,Number])` matches `[1, 'b', 'c']` - the first element is a `Number`, the rest `Strings`.


You can specify custom validation using functions:

* `Gubu({a: (v) => 10<v })`: matches `{a: 11}` as `10 < 11`

And you can manipulate the value if you need to:

* `Gubu({a: (v,u) => 10<v ? (u.val=2*v, true) : false })`: matches `{a: 11}` as `10 < 11` and returns `{a: 22}`.


You can also compose validations together:

```
const shape = Gubu({ a: Gubu({ x: Number }) })

// Matches { a: { x: 1 } } as expected
shape({ a: { x: 1 } })
```


*Gubu* exports shape "builder" utility functions that let you further
refine the shape (You've already seen the `Empty` builder above that
allows strings to be empty). Wrap your value with the function
in-place in the shape.


The `Required` builder makes a value required:

```
const { Gubu, Required } = require(`gubu`)

const shape = Gubu({
  a: Required({x: 1})  // Property `a` is required and must match `{x: 1}`.
})
```


The `Closed` builder prohibits an object from having additional unspecified properties:

```
const { Gubu, Closed } = require(`gubu`)

// Only properties `a` and `b` are allowed.
const shape = Gubu(Closed({
  a: 1,
  b: true
}))
```

You can access builders as properties of the main `Gubu` function to
keep them namespaced. You can also chain most builders. Thus a
required, closed object can be specificied with:


```
const { Gubu } = require(`gubu`)

const shape = Gubu({
  a: Gubu.Closed({ x: 1 }).Required(),
  b: Gubu.Required({ x: 1 }).Closed(),  // Also works.
})
```

You can also write your own builders - see the [API Builders](#builders) section.


In addition to this README, the [unit tests](lib/gubu.test.ts) are
comprehensive and provide many usage examples.


## API


### Builders



## Credits


## GUBU

The name comes from a sort of in-joke in Irish politics. It is
[grotesque, unbelievable, bizarre and
unprecedented](https://en.wikipedia.org/wiki/GUBU), that anyone would
write yet another validation library for JavaSCript, let alone a
second one (The first one I wrote is
[parambulator](https://github.com/rjrodger/parambulator)).

Also I like short names.


## License
Copyright (c) 2021, Richard Rodger and other contributors.
Licensed under [MIT][].

[MIT]: ./LICENSE

