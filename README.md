<a name="top"></a>

# Gubu: An object shape validation utility.

[Quick Example](#quick-example) | 
[Common Use Cases](#common-use-cases) | 
[Install and Usage](#install) | 
[Shape Rules](#shape-rules) | 
[API](#api)


NOTE: WORK IN PROGRESS

This is a schema validator in the tradition of [Joi](https://joi.dev)
or any JSON-Schema validator, with the key features:

* Schemas are WYSIWYG - you define a schema with a template matching your object structure;
* The most useful cases are the easiest to specify (e.g. optional defaults are just literal values);
* The implementation is iterative (a depth-first loop over the
  property tree) not recursive, so it's nice and fast and can handle
  any size of data and schema.
  
Why write yet another validator? I've used `Joi` for a long time, but
always found its schema definition a little verbose at the syntax
level. I've never liked JSON-Schema - it's just too noisy to
eyeball. What I do like is [Vue.js property
validation](https://vuejs.org/v2/guide/components-props.html#Prop-Validation),
but that only works at the top level. I did write a prototype deep
[Vue property validator using
Joi](https://github.com/rjrodger/joiprops), but it's pretty clunky.

This validator is motivated by two use cases: adding message
validation to the [Seneca microservices
framework](https://senecajs.org), and providing deep defaults for
complex custom Vue.js components. I think it does both jobs rather
nicely with an easy-to-read syntax.


[![npm version](https://img.shields.io/npm/v/gubu.svg)](https://npmjs.com/package/gubu)
[![build](https://github.com/rjrodger/gubu/actions/workflows/build.yml/badge.svg)](https://github.com/rjrodger/gubu/actions/workflows/build.yml)
[![Coverage Status](https://coveralls.io/repos/github/rjrodger/gubu/badge.svg?branch=main)](https://coveralls.io/github/rjrodger/gubu?branch=main)
[![Known Vulnerabilities](https://snyk.io/test/github/rjrodger/gubu/badge.svg)](https://snyk.io/test/github/rjrodger/gubu)
[![DeepScan grade](https://deepscan.io/api/teams/5016/projects/19509/branches/508695/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=5016&pid=19509&bid=508695)
[![Maintainability](https://api.codeclimate.com/v1/badges/de19e425771fb65e98e2/maintainability)](https://codeclimate.com/github/rjrodger/gubu/maintainability)

| ![Voxgig](https://www.voxgig.com/res/img/vgt01r.png) | This open source module is sponsored and supported by [Voxgig](https://www.voxgig.com). |
|---|---|




## Quick Example
<sub><sup>[top](#top)</sup></sub>


```js

const { Gubu } = require('gubu')

// Property a is optional, must be a Number, and defaults to 1.
// Property b is required, and must be a String.
const shape = Gubu({ a: 1, b: String })

// Object shape is good! Prints `{ a: 99, b: 'foo' }`
console.log( shape({ a: 99, b: 'foo' }) )

// Object shape is also good. Prints `{ a: 1, b: 'foo' }`
console.log( shape({ b: 'foo' }) )

// Object shape is bad. Throws an exception with message:
//   Validation failed for path "a" with value "BAD" because the value is not of type number.
//   Validation failed for path "b" with value "" because the value is required.'
console.log( shape({ a: 'BAD' }) )

```

As shown above, you use the exported `Gubu` function to create a
validation checker (does the argument match the schema shape?). If
valid, the checker returns its first argument, otherwise it throws an
exception listing all (not just the first!) the validity errors.
 

## Common Use Cases
<sub><sup>[top](#top)</sup></sub>


### Option defaults and validation

Let's say you have a server that needs to run on a given host and
port, but by default should run on *localhost* on port 8080. The host should
be a non-empty string, and the port should be a number.

```js
const optionShape = Gubu({
  host: 'localhost',
  port: 8080
})

// These print: { host: 'localhost', port: 8080 }
console.log(optionShape())
console.log(optionShape({}))

// Prints: { host: 'localhost', port: 9090 }
console.log(optionShape({ port: 9090 }))

// All of these throw an error.
console.log(optionShape({ host: 9090 }))   // Not a string.
console.log(optionShape({ port: '9090' })) // Not a number.
console.log(optionShape({ host: '' }))     // Not really a usable string!

```

### Deep structures

You're building a front end component that displays data from the back
end, and you want to handle bad data gracefully.

```
const productListShape = Gubu({
  view: {
    discounts: [
      // All elements must match this shape.
      { 
        name: String, 

        // A custom validation!
        percent: (v: any) => 0 < v && v < 100 
      }
    ],
    products: [
      { 
        name: String, 
        price: Number, 
      }
    ]
  }
})


// Oh noes! The back end gave me nothing! Luckily I can still work with a
// valid, if empty, data structure.

productListShape({}) // returns:
{ view: { discounts: [], products: [] } }





```



## Install
<sub><sup>[top](#top)</sup></sub>


```sh
$ npm install gubu
```


## Usage

The *Gubu* module has no dependencies. A single function named `Gubu`
is exported.  Utility functions are provided as properties of `Gubu`
or can be exported separately.


### TypeScript

*Gubu* is written in TypeScript, and can be imported naturally:

```
import { Gubu } from 'gubu' 
```

Types are provided in [gubu.d.ts](gubu.d.ts).


### Browser

A minified version is provided as [gubu.min.js](gubu.min.js), which
can be directly loaded into a web page and exports a `Gubu` global
object.

However you're probably better off importing this module in the usual
manner for your build process and bundling it together with everything
else.



### Shape Rules
<sub><sup>[top](#top)</sup></sub>


The general principle of Gubu's design is that the schema shape should
match a valid object or value as closely as possible.

For scalar values you can provide a native type object to make the value required:
* `Gubu(String)` matches strings: `'foo'`
* `Gubu(Number)` matches numbers: `123`
* `Gubu(Boolean)` matches booleans: `true`

Or defaults to make the value optional:
* `Gubu('bar')` matches strings: `'foo'`, and `undefined`
* `Gubu(0)` matches numbers: `123`, and `undefined`
* `Gubu(false)` matches booleans: `true`, and `undefined`

If a value is optional and `undefined`, the default value is returned:
`Gubu('bar')()` returns `'bar'`.

The values `null` and `NaN` must match exactly. The value `undefined`
is special - it literally means no value.

Empty strings are not considered to be valid if a string is required
(this is usually what you want). To allow empty string, use
`Gubu(Empty(String))` (where `Empty` is exported by the `Gubu` module).

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

The above shape will match:

```
{
  foo: {
    bar: {
      zed: 'x',
      qaz: 1
    }
  }
}
```


For arrays, the first elements is treated as the shape that all
elements in the array must match:

* `Gubu([String])` matches `['a', 'b', 'c']`
* `Gubu([{x:1}])` matches `[{x: 11}, {x: 22}, {x: 33}]`


If you need specific elements to match specific shapes, add these
shapes after the first element:

* `Gubu([String,Number])` matches `[1, 'b', 'c']` - the first element is a `Number`, the rest `Strings`.

Thus, the element `0` of a shape array defines the general element,
and following elements define special cases (offset by 1).


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
allows strings to be empty). You wrap your value with the builder
function to apply the desired effect.


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

You can also access builders as properties of the main `Gubu`
function, and you can also chain most builders. Thus a `Required` and
`Closed` object can be specified with:

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
<sub><sup>[top](#top)</sup></sub>


### Shape

A shape specification can either be at the root of a JSON structure,
an array element, or the value of an object property.  For a value to
pass validation, it is compared to the shape, and must match the
constraints of the shape. If the shape has elements or properties,
these must also match, and are validated recursively in a depth-first
manner [^1].


#### Required Scalars

The value must be of the indicated type, and must exist.

* `String`: match any string, but not the empty string [^2].
* `Number`: match any number, but not `BigInt` values.
* `Boolean`: match any boolean.
* `Symbol`: match any symbol.
* `BigInt`: match any `BigInt` (including the `1n` syntax form).
* `Date`: match an object created with `new Date(...)`
* `RegExp`: match an object created with `/.../` or `new RegExp(...)`


#### Optional Scalars with Defaults

The value must be of the indicated type, and is derived from the given
default. If the value does not exist, the default value is inserted.

* `foo`: match any string, but replace an empty string [^3].
* `123`: match any number, but not `BigInt` values.
* `true`: match any boolean.
* `new Symbol('bar')`: match any symbol.
* `new BigInt(456)`: match any `BigInt` (including the `1n` syntax form).
* `new Date()`: match an object created with `new Date(...)`
* `/x/`: match an object created with `/.../` or `new RegExp(...)`


#### Objects


#### Arrays


#### Functions


#### Validations


#### Custom Validations


### Gubu function


### Errors


### Builders


### Edge Cases

#### Empty Strings

Unfortunately the empty string is not really a subtype of the `string`
type, since it evaluates to `false`. In the case of HTTP input,
missing parameters values are often provided as empty strings, when
they are in fact `undefined`. There are heartfelt arguments on both
sides of this issue.

The engineering compromise is based on the priniciple of explicit
notice. Since reasonable people have a reasonable disagreement about
this behaviour, a mitigation of the issue is to make it
explicit. Thus, the `Empty(String)`, or `Empty('foo')` shapes need to
be used if you want to accept empty strngs.

As a shortcut, you can use `''` directly for optional strings, and
that shape will accept empty strings, and give you an empty string as
a default.


## Credits

This module is inspired by [Joi](https://joi.dev), which I used for
many years. It also draws from the way [Vue](https://vuejs.com) does
property validation.


## GUBU

The name comes from a sort of in-joke in Irish politics. It is
[grotesque, unbelievable, bizarre and
unprecedented](https://en.wikipedia.org/wiki/GUBU), that anyone would
write yet another validation library for JavaScript, let alone a third
one! (See [parambulator](https://github.com/rjrodger/parambulator) and
[norma](https://github.com/rjrodger/norma) - but don't use those,
*Gubu* is better!).

Also I like short names.


## License
Copyright (c) 2021, Richard Rodger and other contributors.
Licensed under [MIT][].

[MIT]: ./LICENSE


## Footnotes

[^1]: The implementation algorithm is iterative, just a loop that
      processes values in depth-first order.

[^2]: An empty string is not considered to match the `string` type. To
      allow empty strings, use `Empty(String)`. See [Empty
      Strings](#empty-strings).

[^3]: An empty string is not considered to match the `string` type. To
      allow empty strings, use `Empty('some-default')`. See [Empty
      Strings](#empty-strings).

