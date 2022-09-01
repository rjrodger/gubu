<a name="top"></a>

# Gubu: An object shape validation utility.

[![npm version](https://img.shields.io/npm/v/gubu.svg)](https://npmjs.com/package/gubu)
[![build](https://github.com/rjrodger/gubu/actions/workflows/build.yml/badge.svg)](https://github.com/rjrodger/gubu/actions/workflows/build.yml)
[![Coverage Status](https://coveralls.io/repos/github/rjrodger/gubu/badge.svg?branch=main)](https://coveralls.io/github/rjrodger/gubu?branch=main)
[![Known Vulnerabilities](https://snyk.io/test/github/rjrodger/gubu/badge.svg)](https://snyk.io/test/github/rjrodger/gubu)
[![DeepScan grade](https://deepscan.io/api/teams/5016/projects/19509/branches/508695/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=5016&pid=19509&bid=508695)
[![Maintainability](https://api.codeclimate.com/v1/badges/de19e425771fb65e98e2/maintainability)](https://codeclimate.com/github/rjrodger/gubu/maintainability)

| ![Voxgig](https://www.voxgig.com/res/img/vgt01r.png) | This open source module is sponsored and supported by [Voxgig](https://www.voxgig.com). |
|---|---|

[Quick Example](#quick-example) | 
[Common Use Cases](#common-use-cases) | 
[Install and Usage](#install) | 
[Shape Rules](#shape-rules) | 
[Shape Reference](#shape-builder-reference) | 
[API](#api)


This is a schema validator in the tradition of [Joi](https://joi.dev)
or any [JSON-Schema](https://json-schema.org/) validator, but with a
much nicer developer experience.

The big idea is that your schema looks (almost) exactly like your
data. That makes your schema much easier to read and reason about. You
could call it:

> "Schema By Example"

Let's say you want to have the some options for a module you are writing:

```
{
  port: 8080,
  host: 'localhost'
}
```

This is a valid Gubu specification. It means:


```
{
  port: 8080,        // Must be a number, is optional, and the default is 8080
  host: 'localhost'  // Must be a string, is optional, and the default is 'localhost'
}
```

If you user does not specify these options, then you get the defaults:

```
{} --> { port: 8080, host: 'localhost' }
```

In Gubu, the most common case for options is the easiest: everything
is optional, and the default value defines the type you will accept.
This also works for objects, which get "filled out" if not present:

```
const { Gubu } = require('gubu')

const shape = Gubu({
  server: {
    port: 8080,
    host: 'localhost'
  }
}

let options = {}
shape(options)

// And now options is:
{
  server: {
    port: 8080,
    host: 'localhost'
  }
}
```

Another big feature of Gubu is that you can fill out objects to any
depth (unlike `Object.assign` or the `...` spread operator).

You may have noticed that Gubu mutates the input to be validated (by
injecting defaults as needed). This is deliberate. Cloning arbitrary
values in JavaScript is
[complicated](https://www.digitalocean.com/community/tutorials/copying-objects-in-javascript),
so Gubu leaves that decision to calling code.


To make properties required, you use the standard JavaScript wrapper
objects (*Number*, *String*, *Boolean*, ...):

```
const { Gubu } = import 'gubu' // `import` also works! And in browsers too.

const shape = Gubu({
  timeout: Number,
  message: String,
  debug: Boolean,
})

// All good here - these are valid options!
shape({
  timeout: 10000,
  message: 'Hello!',
  debug: true,
})
```

Required properties don't have defaults (how could they?), so you only
need to specify the type.

To validate arrays, you provide an example element. All elements of the
array must match the example element:

```
const shape = Gubu([Number])

// All good - we want numbers!
shape([100, 200, 300])
```


## Motivation  
  
Why write yet another validator? I've used [Joi](https://joi.dev) for
a long time, but always found its schema definition a little verbose
at the syntax level. I've never liked JSON-Schema - it's just too
noisy to eyeball. What I do like is [Vue.js property
validation](https://vuejs.org/v2/guide/components-props.html#Prop-Validation),
but that only works at the top level. I did write a prototype deep
[Vue property validator using
Joi](https://github.com/rjrodger/joiprops), but it's pretty clunky.

This validator is motivated by two use cases: adding message
validation to the [Seneca microservices
framework](https://senecajs.org), and providing deep defaults for
complex custom Vue.js components. I think it does both jobs rather
nicely with an easy-to-read syntax.

On the philosophical side, this validator is motivated by the idea of
[query-by-example](https://wiki.c2.com/?QueryByExample). This comes
from the belief that software developers should not be subjected to
unnecessary additional levels of abstraction. Abstraction is hard,
takes you further from the problem you're getting paid to solve, and
is hard to "eye-ball". I don't want to parse and run schemas "in my
head", **I just want to see the literal values and structure that I care
about, right here, right now**.


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
//   Validation failed for property "a" with value "BAD" because the value is not of type number.
//   Validation failed for property "b" with value "" because the value is required.
console.log( shape({ a: 'BAD' }) )

// Object shape is bad. Throws an exception with message:
//    Validation failed for object "{b:foo,c:true}" because the property "c" is not allowed.
console.log( shape({ b: 'foo', c: true }) )
```

As shown above, you use the exported `Gubu` function to create a
validation shape checker using an example object. Pass the value you
want to validate to the shape checker. If the value is valid (matches
the example object), the shape checker returns the value (with missing
defaults injected). Otherwise the shape checker throws an exception
listing all (not just the first!) of the validation errors.
 

## Common Use Cases
<sub><sup>[top](#top)</sup></sub>


### Option defaults and validation

Let's say you have a server that needs to run on a given host and
port, but by default should run on `localhost` on port `8080`. The host should
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
console.log(optionShape({ host: '' }))     // The empty string is a host name!
console.log(optionShape({ hpst: 'foo' }))  // 'hpst' is not a valid property name.

```

### Deep structures

You're building a front end component that displays complex data from
the back end, and you want to handle missing data gracefully, at any
depth in the structure.

```js
const productListShape = Gubu({
  products: [
    {
      name: String, // Product name is a required String
      img: 'generic.png' // Use a default image if not defined
    }
  ]
})

let result = productListShape({})

// No products, but our data structure still has an array where
// one is expected, so no `undefined` errors.
result === {
  products: []
}

// Fix data with missing fields
let result = productListShape({
  products: [
    { name: 'Apple', img: 'apple.png' },
    { name: 'Pear', img: 'pear.png' },
    { name: 'Banana' } // Missing image!
  ]
})

// Banana will not have a broken image.
result === {
  products: [
    { name: 'Apple', img: 'apple.png' },
    { name: 'Pear', img: 'pear.png' },
    { name: 'Banana', img: 'generic.png' }
  ]
}

```


### Shape Building

For more specific shapes, such as required objects and arrays, you can
use shape builder functions that still respect your data structure.

The [Required](#required-builder) shape builder makes a value
explicitly required:

```
const { Gubu, Required } = require('gubu')

const userShape = Gubu({
  person: Required({  // person must be a defined object
    name: String,
    age: Number,
  })
})

// This will fail, with message:
//   Validation failed for property "person" with value "" because the value is required.
userShape({}) 

// This will pass, returning the object:
userShape({
  person: {
    name: 'Alice',
    age: 99
  }
})
```

Shape builders are exported by the Gubu module directly, and are also
available as properties of the `Gubu` function:

```
const { Gubu, Required, Closed } = import 'gubu'

Required === Gubu.Required
Closed === Gubu.Closed
```

For the full list of shape builders, see the [API
reference](#shape-builders).

---

[Quick Example](#quick-example) | 
[Common Use Cases](#common-use-cases) | 
[Install and Usage](#install) | 
[Shape Rules](#shape-rules) | 
[Shape Reference](#shape-builder-reference) | 
[API](#api)


## Install
<sub><sup>[top](#top)</sup></sub>

```sh
$ npm install gubu
```


## Usage


The *Gubu* module has no dependencies. A single function named `Gubu`
is exported.  Shape builders (such as [Required](#required-builder))
and utility functions are provided as properties of `Gubu` or can be
exported separately.


### TypeScript

*Gubu* is written in TypeScript, and can be imported naturally:

```
import { Gubu } from 'gubu' 
```

Types are provided in [gubu.d.ts](gubu.d.ts).

Gubu tries to play nice with compile-time type validation of your
shapes, and [mostly succeeds](#typescript-types).


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

The values `null` and `NaN` must match exactly. They are *not* the
same as `undefined`. The value `undefined` is special - it literally
means no value. To allow a property to be absent entirely, use the
[Skip](#skip-builder) shape builder.

Empty strings are not considered to be valid (this is usually what you
want). To allow an empty string, use `Gubu(Empty('foo'))` or
`Gubu(Empty(String))` (where `Empty` is exported by the `Gubu`
module).

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

If you want to allow arbitrary properties in an object, you can use the 
[Open](#open-builder) shape builder:

```
let openObject = Gubu(Open({ a: 1 }))

// This now passes (normally property `b` would not be allowed).
openObject({ a: 11, b: 22 }))
```


For arrays, the first element is treated as the shape that all
elements in the array must match:

* `Gubu([String])` matches `['a', 'b', 'c']`
* `Gubu([{x: 1}])` matches `[{x: 11}, {x: 22}, {x: 33}]`


If you need specific elements to match specific shapes, use the
[Closed](#closed-builder) shape builder:

* `Gubu(Closed([String, Number]))` matches `['a', 1]`.

You can specify custom validation functions using the
[Check](#check-builder) shape builder:

* `Gubu({a: Check((v) => 10 < v) })`: matches `{a: 11}` as `10 < 11`

And you can manipulate the value if you need to:

* `Gubu({a: Check((v, u) => 10 < v ? (u.val = 2 * v, true) : false )})`:
  matches `{a: 11}` as `10 < 11` and returns `{a: 22}`.


You can also compose validations together:

```
const shape = Gubu({ a: Gubu({ x: Number }) })

// Matches { a: { x: 1 } } as expected
shape({ a: { x: 1 } })
```


The shape builder functions ([Required](#required-builder),
[Closed](#closed-builder), etc.) are also available as properties of
the main `Gubu` function, so you don't have to introduce them into
your top level variable namespace.

As a convenience, you can chain most builders. Thus a `Required` and
`Closed` object can be specified with:

```
const { Gubu } = require('gubu')

const shape = Gubu({
  a: Gubu.Closed({ x: 1 }).Required(),
  b: Gubu.Required({ x: 1 }).Closed(), // Same as line above
})
```

You can write your own builders&mdash;see the next section.

In addition to this README, the [unit tests](lib/gubu.test.ts) are
comprehensive and provide many usage examples.


### Shape Builders

The built-in shape builders help you match the following shapes:

* Existence:
  * [Required](#required-builder): Make a value required.
  * [Skip](#skip-builder): Make a value skippable (no default value is injected if missing).
* Value constraints:
  * [Empty](#empty-builder): Allow string values to be empty.
  * [Exact](#exact-builder): The value must match one of an exact list of *literal* values.
  * [All](#all-builder): All shapes must match value.
  * [Some](#some-builder): Some shapes (at least one) must match value.
  * [One](#one-builder): Exactly one shape (and no more) must match value.
  * [Any](#any-builder): This shape will match any value.
  * [Never](#never-builder): This shape will never match anything.
* Length constraints (operate on values with a length or numeric value):
  * [Below](#below-builder): Match a value (or length of value) less than the given amount.
  * [Max](#max-builder): Match a value (or length of value) less than or equal to the given amount.
  * [Min](#min-builder): Match a value (or length of value) greater than or equal to the given amount.
  * [Len](#len-builder): Match a value (or length of value) exactly equal to the given amount.
  * [Above](#above-builder): Match a value (or length of value) greater than the given amount.
  * [Func](#func-builder): The value is explicitly a function.

* General constraints:
  * [Closed](#closed-builder): Allow only explicitly defined elements in an array.
  * [Open](#open-builder): Allow arbitrary properties in an object (no constraint on their value).
  * [Value](#value-builder): All non-explicit child values of a shape must match this shape.
  * [Child](#child-builder): All non-explicit child values of an object must match this shape.
* Mutations:
  * [Rename](#rename-builder): Rename the key of a property.
  * [Define](#define-builder): Define a name for a value.
  * [Refer](#refer-builder): Refer to a defined value by name.
* Customizations:
  * [Check](#check-builder): Define a general custom validation function for the value (recommended).
  * [Before](#before-builder): Define a custom validation function called before a value is processed (advanced use).
  * [After](#after-builder): Define a custom validation function called after a value is processed (advanced use).
  * [Key](#key-builder): The key (or path) of the current object is injected as the value.


### Regular Expressions

The [Check](#check-builder) shape builder will also accept a regular
expression (instead of a function). The value will be converted to a
string (using `String(...)`), and will be valid if it matches the
regular expression. The values `null`, `undefined` and `NaN` are not
converted to strings and will always fail this check.

```
let shape = Gubu({ countryCode: Check(/^[A-Z][A-Z]$/) })

shape({ countryCode: 'IE' })) // PASS.
shape({ countryCode: 'BAD' })) // FAIL: 'Validation failed for property "countryCode" with value "BAD" because check "/^[A-Z][A-Z]$/" failed.'
```


### Recursive Shapes

You can use the [Define](#define-builder) and [Refer](#refer-builder)
shape builders to validate recursive shapes. Use `Define` first to
name a given shape. Then use `Refer` to apply the definition of the shape.

```
let tree = Gubu({
  root: Define('BRANCH', {
    value: String,
    left: Refer('BRANCH'),
    right: Refer('BRANCH'),
  })
})

// This passes, returning the object.
tree({
  root: {
    value: 'A',
    left: {
      value: 'AB',
      left: {
        value: 'ABC'
      },
      right: {
        value: 'ABD'
      },
    },
    right: {
      value: 'AE',
      left: {
        value: 'AEF'
      },
    },
  }
})

// This fails with error:
// "Validation failed for property "root.left.left.left.value" with value "123" because the value is not of type string."

tree({
  root: {
    value: 'A',
    left: {
      value: 'AB',
      left: {
        value: 'ABC',
        left: {
          value: 123
        },
      },
    },
  }
})
```


## API
<sub><sup>[top](#top)</sup></sub>

### Shape

[API](#api) | 
[Shapes](#shape) | 
[Errors](#errors) | 
[Custom Validation](#custom-validation) |
[Builders](#shape-builder-reference)


A shape specification can either be at the root of a JSON structure,
an array element, or the value of an object property.  For a value to
pass validation, it is compared to the shape, and must match the
constraints of the shape. If the shape has elements or properties,
these must also match, and are validated recursively in a depth-first
manner [^1].


#### Required Values

The value must be of the indicated type, and must exist.

* `String`: match any string, but not the empty string [^2].
* `Number`: match any number, but not `BigInt` values.
* `Boolean`: match any boolean.
* `Function`: match any function.
* `Object`: match any object.
* `Array`: match any array.
* `Symbol`: match any symbol.
* `BigInt`: match any `BigInt` (including the `1n` syntax form).
* `Error`: match an object created with `new Error(...)`
* `Date`: match an object created with `new Date(...)`
* `RegExp`: match an object created with `/.../` or `new RegExp(...)`

You can require an instance of any class (that is, an object created
with `new`) by using the class name as the shape.


#### Optional Values with Defaults

The value must be of the indicated type, and is derived from the given
default. If the value does not exist, the default value is inserted.

* `foo`: match any string, but replace an empty string [^3].
* `123`: match any number, but not `BigInt` values.
* `true`: match any boolean.
* `new Object()`: match any object.
* `new Array()`: match any array.
* `new Symbol('bar')`: match any symbol.
* `new BigInt(456)`: match any `BigInt` (including the `1n` syntax form).
* `new Error()`: match an object created with `new Error(...)`
* `new Date()`: match an object created with `new Date(...)`
* `/x/`: match an object created with `/.../` or `new RegExp(...)`

You can provide an instance of any class as a default. The value, if
present, must be an instance of the same class.

Note that `new Function()` does not match anonymous functions, and
should not be used [^4].


#### Objects

Plain objects can be specified directly as they appear in values to be
validated. If you want an object `{foo: 123}`, then the shape is also
`{foo: 123}`, meaning any object with a `foo` property (and no other
properties) that is a `number`. The `foo` property is optional, and
will default to the value `123`.

You can define plain objects to any depth. The shape `{ bar: { foo:
123 } }` defines an object that optionally contains another object as
the value of the property `bar`.

As objects and sub-objects are often referenced directly in data
structures (using dot notation), *Gubu* will construct missing objects
by default, and fill in the missing child values (which may themselves
be objects). These protect your code from `undefined` value errors
in default cases.

The general form of an object shape is:

```
{ 
  'propName0': <SHAPE>,
  'propName1': <SHAPE>,
  ...
  'propNameN': <SHAPE>,
}
```

where `propNameX` is any string (the quotes may be omitted if the
property name is a valid JavaScript identifier&mdash;this is just
normal JavaScript syntax after all).

The `<SHAPE>` can be any valid *Gubu* shape definition.


##### Required Properties (Object)

To mark an object property as required, use the [required
value](#required-values) shapes (such as `String`), or use the shape
builder [Required](#required-builder):

```
const { Required } = Gubu

let shape = Gubu({
  foo: Number,
  bar: Required({
    zed: Boolean
  })
})

// This passes, returning the value unchanged.
shape({ foo: 1, bar: { zed: false } })

// These fail, throwing an Error.
shape({ bar: { zed: false } }) // foo is required
shape({ foo: 'abc', bar: { zed: false } }) // foo is not a number
shape({ foo: 1 }) // bar is required
shape({ foo: 1, bar: {} }) // bar.zed is required
shape({ foo: 1, bar: { zed: false, baz: 2 }, qaz: 3 }) // new properties are not allowed
```

Object properties that are required must always be provided, even if
they are children of optional objects&mdash;they wouldn't be required
otherwise! To allow such deep required properties to be missing, use
an explicit [Skip](#skip-builder) shape builder:

```
let strictShape = Gubu({ a: { b: String } })

// Passes
strictShape({ a: { b: 'ABC' } })

// Fails, even though a is not required, because a.b is required.
strictShape({})


let easyShape = Gubu({ a: Skip({ b: String }) })

// Now both pass
easyShape({ a: { b: 'ABC' } })
easyShape({})

// This still fails, as `a` is now defined, and needs `b`
easyShape({ a: {} })

```
 

##### Open Objects

Normally, objects can only contain explicitly defined properties. To
allow an object to have an unrestricted set of properties, use the
[Open](#open-builder) shape builder:

```
const { Open } = Gubu

let shape = Gubu(Open({
  a: 1
}))

shape({ a: 11, b: 22 }) // PASS: returns { a: 11, b: 22 }
shape({ b: 22, c: 'foo' }) // PASS: returns { a: 1, b: 22, c: 'foo' }

shape({ a: 'foo' }) // FAIL: property `a` must still be a number

```

The [Open](#open-builder) shape builder applies only to the object it
wraps, and does not apply to child objects. You need to use `Open`
explicitly for each object that can have arbitrary properties.


```
shape = Gubu(Open({
  a: Open({
    b: 1
  })
}))


shape({ a: { b: 11, c: 22 }, d: 33 }) // PASS, returns object
```

An empty object shape (`{}`) is automatically open and will allow any
properties.



##### Optional Objects

Objects are optional by default, and will be created if not
present. To prevent this, use the shape builder [Skip](#skip-builder)
to indicate that you do *not* wish an object to be inserted when it is
missing&mdash;it can be skipped.

```
const { Skip } = Gubu
let shape = Gubu({
  a: { x: 1 },
  b: Skip({ y: 2 }),
  c: Skip({ z: Skip({ k: 3 }) }),
})

// Skippable properties are not inserted as defaults if missing.
shape({}) // returns { a: { x: 1 } }, b and c are missing entirely
shape({ b: {} }) // returns { a: { x: 1 }, b: { y: 2 } }, defaults for b are inserted
shape({ c: {} }) // returns { a: { x: 1 }, c: {} }, c has no non-optional defaults
shape({ c: { z: {} } }) // returns { a: { x: 1 }, c: { z: { k: 3 } } } // z has defaults
```

If the object value is present but empty, any default values will be inserted.


##### Object Values

You can define a general shape for all non-explicit object values
using the [Value](#value-builder) shape builder:

```
const { Value } = Gubu

let shape = Gubu(Value(String, {
  a: 123,
}))

// All non-explicit properties must be a String
shape({ a: 11, b: 'abc' }) // b is a string
shape({ c: 'foo', d: 'bar' }) // c and d are strings

// These fail
shape({ a: 'abc' }) // a must be a number
shape({ b: { x: 1 } }) // b must be a string
```

Using the [Value](#value-builder) shape builder in this automatically
makes the object open, but constrains the values that can be used for
non-explicit properties.

The general shape can be any valid shape:


```
const { Required, Value } = Gubu

let shape = Gubu({
  people: Required({}).Value({ name: String, age: Number })
})

// This passes:
shape({ people: { 
  alice: { name: 'Alice', age:99 }, 
  bob:   { name: 'Bob',   age:98 },
} })

// These fail:
shape({ people: { 
  alice: { name: 'Alice', age:99 }, 
  bob:   { name: 'Bob' }, // age is a required number
} })
shape({}) // people is a required object

```


#### Arrays

Arrays can be specified directly using the first element as the shape
that each element of the value array must match. If you want an array
of numbers (`[ 1, 2, 3 ]`, say), then the shape is `[Number]`.

```
let shape = Gubu([Number])
shape() // PASS: returns [] (the array itself is optional)
shape([]) // PASS: returns [] (empty arrays pass)
shape([1]) // PASS: element matches Number shape
shape([1, 2]) // PASS: all elements match Number shape

shape([1, 2, 'bad']) // FAILS; element 2 is not a number


// Array elements can be any complex shape.
shape = Gubu([{x: 1}])
shape([{ x: 123 }, { x: 456 }]) // PASS: elements match {x: 1}
shape([{}]) // PASS:  returns [{x: 1}]

shape([{x: 123}, {x: 'a'}]) // FAILS; element 1 does not match {x: 1}
```

You can also define special shapes for individual elements at specific
indexes, using the [Closed](#closed-builder) shape builder, as shown
below.

The general form of an array shape is:

```
[
  <SHAPE>,
]
```

where `<SHAPE>` is any valid *Gubu* shape definition. All elements
must match `<SHAPE>`, and the empty array is allowed. This is the
standard case and usually what you want.

For special cases, where elements at specific indexes must match
specific shapes, you can define these arrays using the
[Closed](#closed-builder) shape builder.

```
let shape = Gubu(Closed([Number, String, Boolean]))

// This passes, returning the array as is.
shape([ 123, 'abc', true ])

// These fail.
shape([ 'bad' ]) // Index 0 must be a number
shape([ 123 ]) // Index 1 and 2 are missing
shape([ 123, 'abc', true, 'extra' ]) // Too many elements
```

As a shortcut, a shape array with *two or more* elements is considered
closed, and all elements are considered special. Thus `Closed([String,
Number])` is the same as `[String, Number]`. For a single element
closed array, you *must* use the [Closed](#closed-builder) shape
builder to close the array. Thus `Closed([Number])` means the array
can only ever have one element, a number.

As arrays are often referenced directly in data structures, *Gubu*
will construct missing arrays by default, and for closed arrays, fill
in the missing element values if there are empty or `undefined` array
entries.


##### Required Properties (Array)

To mark an array element as required, use the [required
value](#required-values) shapes (such as `String`), or use the shape
builder [Required](#required-builder).

```
let shape = Gubu([{ x: 1 }, Required({ y: true })])

// These pass
shape([{ x: 2 }, { y: false }])
shape([undefined, { y: false }]) // returns [{ x: 1 }, { y: false }]
shape([{ x: 2 }, {}]) // returns [{ x: 2 }, { y: true }]

// These fail
shape([{ x: 2 }, undefined]) // Element 1 is required
shape([{ x: 2 }]) // Element 1 is required
```


##### Array Properties

JavaScript allows arrays to have properties: `let a = []; a.foo = 1`.
Matching against array properties in the current version must be done
by writing a [custom validator](#custom-validation) using the
[Check](#check-builder) shape builder.


##### Length Constraints

You can control the allowed length of an array using the shape
builders [Min](#min-builder), [Max](#max-builder),
[Above](#above-builder), [Below](#below-builder), and
[Len](#len-builder) to restrict the length of the array.

```
let { Min } = Gubu
let shape = Gubu(Min(2, [Number]))

// These pass
shape([11,22]) // length is 2, >= minimum 2
shape([11,22,33]) // length is 3, >= minimum 2

// These fail
shape([11]) // length is 1, not >= minimum 2
shape([]) // length is 0, not >= minimum 2
```


The length constraining shape builders ([Min](#min-builder),
[Max](#max-builder), [Above](#above-builder), [Below](#below-builder),
and [Len](#len-builder)) work in a sensible way depending on the data
type. For strings they control character length, for numbers they
control magnitude, for objects they control property count, and for
arrays, they control length:

```
let { Max } = Gubu

// Maximum string length
shape = Gubu(Max(2, String))
shape('a') // PASS
shape('ab') // PASS
shape('abc') // FAIL: string longer than 2 characters

// Maximum object size
shape = Gubu(Max(2, {})) // An empty object is open, so can accept any properties
shape({ a: 1 }) // PASS
shape({ a: 1, b: 2 }) // PASS
shape({ a: 1, b: 2, c: 3 }) // FAIL: more than 2 properties in object

```


#### Functions

Literal function value operate in the same way as any other literal
values, defining an optional value shape with a default. This allows
you to provide default functions for your module options, if you are
using *Gubu* as an option validator.

```
let shape = Gubu({
  fn: () => true
})

// This passes
shape({ 
  fn: () => false 
})

// This injects the default function
shape({)) === {
  fn: () => true 
})
```


To require a function, use the shape `Function`,
(`Gubu(Function)(()=>true)` will pass).


#### Custom Validation

[API](#api) | 
[Shapes](#shape) | 
[Errors](#errors) | 
[Custom Validation](#custom-validation) |
[Builders](#shape-builder-reference)


You can define custom validators by providing a function to the
[Check](#check-builder) shape builder. The first argument to this
function will provide the value to validate. Return `true` if the
value is valid, and `false` if not.

```
import { Gubu, Check } from 'gubu'

let shape = Gubu({ a: Check((v) => 10 < v) })
shape({ a: 11 }) // passes, as 10 < 11 is true
shape({ a: 9 })  // fails, as 10 < 9 is false
```

<a name="update-type"></a> 
You can modify the value using the second argument to the custom
validation function, by assigning a new value to the `val` property:

```
let shape = Gubu({ 
  a: Check((value, update) => {
    update.val = value * 2 
    return true // Remember to return true to indicate value is valid!
  })
})

shape({ a: 3 }) // returns { a: 6 }
```

As a special case, if you want to explicitly set the value to
`undefined` or `NaN`, use the property `uval`.

You can also provide a custom error message using the `update` argument:

```
let shape = Gubu({ 
  a: Check((value, update) => {
    update.err = 'BAD VALUE $VALUE AT $PATH'
    return false // always fails
  })
})
shape({ a: 3 }) // throws "BAD VALUE 3 AT a"
```

The special replacement tags `$VALUE` and `$PATH` are replaced with
the value, and the property path to the value, respectively.

<a name="state-type"></a> The third argument to a custom validator is
the internal state of the validation process. This is provided for
special cases and workarounds, and the internal set of properties
should not be considered stable. Review the [source
code](https://github.com/rjrodger/gubu/blob/main/gubu.ts#L98) to see
what is available.

```
shape = Gubu({
  a: Check((value: any, update: any, state: any) => {
    update.val = value + ` KEY=${state.key}`
    return true
  })
})
shape({ a: 3 }) // returns { a: '3 KEY=a'}
```

The shape builders [Before](#before-builder) and
[After](#after-builder) operate in a similar manner to the
[Check](#check-builder). They allow you to perform your custom
validation before, or after, normal validation, respectively. They do
not support regular expressions as an argument.

In general, you should use the `Check` shape builder for custom
validation. The `Before` and `After` builders are provided for
advanced usage.


### Gubu function

To construct a shape use the `Gubu` function exported by this module:

```
// Using require
const { Gubu } = require('gubu')

// Using import
import { Gubu } from 'gubu'

let shape = Gubu({ x: 1 })
```

In the browser, *Gubu* adds itself directly to the `window` object for
immediate use (if you directly load this module using a `script`
tag). However you'll probably just want to import *Gubu* in the usual
way into your own source code and let your package builder look after
things.

The `Gubu` function has two arguments:
* `shape` (optional): any valid shape definition (`'abc'`, `String`, `{ x: 123 }`, etc.).
* `options` (optional): an options object.


The shape argument can be anything, and is used to define the
validation shape expected. See the sections above for descriptions of
the various shapes.


The options are:
* `name`: a string defining a custom name for this shape (useful for debugging).

The `Gubu` function provides all built-in [shape builders](#shape-builders)
(`Required`, `Closed`, etc.) as properties. These are also exported directly
from the module, so the following are equivalent:

```
const { Gubu, Required } = import 'gubu'

const { Gubu } = require('gubu')
const { Require } = Gubu
```

If you are concerned about namespacing the builders (if the names
clash with your own names), the shape builders are also available with
a 'G' prefix as an alias:

```
Gubu.GRequired === Gubu.Required
```


### GubuShape function

When you create a shape using `Gubu`, a `GubuShape` shape validator
function is returned:

```
// TypeScript
import { Gubu, GubuShape } from 'gubu'

// GubuShape is inferred:
const shape = Gubu(123) // `shape` is a validator function
```

The shape validator function has two arguments:
* `value`: the value to validate (and modify with defaults).
* `context`: (optional) a context object containing your own data.

The value can be anything. It is not duplicated and **will be
mutated** if defaults are inserted.

> **If you do not wish the value to be mutated, you must clone it yourself
first [^5]**.

The context is a general purpose store for anything you might want to
use in custom validation builders. It may also be used by builders to
hold state information (the name of the builder is used for
namespacing).

The context has one reserved name:
* `err`: an array of validation errors.

If you provide a context with the property `err` as an empty array,
any validation errors will be added to this array, and an Error will
**not be thrown**:

```
let ctx = { err: [] }
Gubu(Number)('abc', ctx)  // does not throw
console.log(err[0]) // prints error description (number was expected)
```

The [error descriptions](#errors) are plain objects, not `Error` objects.

The `GubuShape` function has the following methods:
* `valid(value: any, context?: any): boolean`
  * returns `true` if the value matches the shape
  * **injects defaults into value**
  * does not throw Errors, use context = { err: [] } to get any errors
  * can be used as type guard in TypeScript
* `match(value: any, context?: any): boolean`
  * returns `true` if the value matches the shape
  * **does not inject defaults**, 
  * does not throw Errors, use context = { err: [] } to get any errors
  * can be used as type guard in TypeScript
* `toString()`
  * returns a short string describing this `GubuShape` instance
* `[Util.inspect.custom]()`
  * same as `toString`
* `spec()`
  * returns a declarative description of the shape

The shape description provided by `spec` can be passed to `Gubu` to
generate a new separate shape instance (see the 
[Shape Nodes](#shape-nodes) section).

Many shapes can be fully serialized to JSON, but those with custom
validator functions are not serializable in the current version.

A `GubuShape` can be used be used as part of new shape
definition. They are intended to be composable.


### Errors

[API](#api) | 
[Shapes](#shape) | 
[Errors](#errors) | 
[Custom Validation](#custom-validation) |
[Builders](#shape-builder-reference)


*Gubu* will attempt a full validation of the input value, collect all
errors, and throw an Error if any validation failed. The error object
will be an instance of `GubuError`, which extends `TypeError` with the
following extra properties:

* `gubu`: A marker value, always `true`.
* `code`: Top level error code, in this version, always `'shape'`
* `desc()`: Call this function to get a more detailed description of the error.

The error description returned by `desc()` has the properties:
* `name`: Always `'GubuError'`
* `code`: Top level error code, in this version, always `'shape'`
* `err`: An array of `ErrDesc` objects (these are all the errors that occurred).
* `ctx`: The context object (if any) passed to this `GubuShape` validation call.

The message string of GubuError is a human readable generic
description of the validation failure (with one issue per line) that
is usable in your own application as-is. You can use the `ErrDesc`
object instead to create entirely custom messages. Custom messages for
specific custom errors can also be defined (see below).

```
Gubu(Number)('abc') // throws an Error with message:
`
Validation failed for value "abc" because the value is not of type number.'
`

let shape = Gubu({ 
  top: { 
    foo: String, 
    bar: Number 
  }
})

shape({ top: { foo: 123, bar: 'abc' }}) // throws an Error with message:
`
Validation failed for property "top.foo" with value "123" because the value is not of type string.
Validation failed for property "top.bar" with value "abc" because the value is not of type number.
`
```

#### ErrDesc Object

The `ErrDesc` object is the internal representation of an error,
containing the full details of the error, which you can use for
customization. The properties are:

* `k: string`  : Key of failing value (or empty string at top level).
* `n: Node`    : Failing shape node.
* `v: any`     : Failing value.
* `p: string`  : Key path to value.
* `w: string`  : Error code ("why").
* `m: number`  : Unique error mark for debugging (search in source code of gubu.ts).
* `t: string`  : Error message text.
* `u: any`     : User custom info.

The property `n` is the [shape node](#shape-nodes) whose validation failed.

```
try {
    Gubu({x: Number})({x: 'abc'})
}
catch(gubuError) {
  gubuError.desc()) === {
    name: 'GubuError',
    code: 'shape',
    err: [
      {
        k: undefined,
        n: { 
          '$': { 'gubu$': Symbol(gubu$), 'v$': '<VERSION>' },
          t: 'number',
          v: 0,
          r: true,
          o: false,
          d: 0,
          u: {},
          a: [],
          b: []
        },
        v: 'x',
        p: '',
        w: 'type',
        m: 1050,
        t: 'Validation failed for property "" with value "x" because the value is not of type number.',
        u: {},
      }
    ],
    ctx: {}
  }
}
```

From this description, you can determine that:
* There was one err: `err.length === 1`
* A type constraint failed: `err[0].w === 'type'`
* The value was required: `err[0].n.r === true`
* The value should be a number: `err[0].n.t === 'number'`
* The value occurred at the top level: `err[0].p = ''`

The *path* of an error is the chain of properties that you follow to
reach the failing value. For example, the path of the value of `c` in
`{ a: { b: { c: 123 } }}` is `a.b.c`.

In the case of arrays, the index is used as the property value. Thus,
the path of the second element (`=== 'y'`) of `{ a: ['x','y'] }` is
`a.1`. Paths do not used `[]` notation for arrays.

Values are converted to strings for the error message by using
`JSON.stringify`. Circular values are handled safely. Long values are
truncated to 30 characters.

The *mark* value (property `m`) is a numeric code that uniquely
identifies the generation point of the error in the source code of
[gubu.ts](https://github.com/rjrodger/gubu/blob/main/gubu.ts), and
should be quoted in bug reports (or indeed you can use it yourself to
inspect the source code).


#### Error Collection

Instead of throwing validation errors, you can collect them using the
reserved property `err` in the context argument:

```
let ctx = { err: [] }
Gubu(Number)('abc', ctx)  // does not throw
// ctx.err now contains an array of ErrDesc objects 
```

The return value from `Gubu` in this case (and the value passed in!)
should be considered corrupted (defaults may only be partially
applied). If you want to retain the original value, you must clone it
yourself before passing it to *Gubu* [^5].

You can also set the context `err` property to `false`. In this case
errors are not collected at all, and they are ignored, so that the
full shape depth is always validated. The `GubuShape.spec` method uses
this feature to generate a normalized validation `Node` hierarchy
against the `undefined` value.


#### Custom Errors

When using a [custom validator](#custom-validation) you can provide a custom
error message using the `Update.err` property.

```
let shape = Gubu({ a: (value, update) => {
  update.err = 'BAD VALUE $VALUE AT $PATH'
  return false // always fails
})
shape({ a: 3 }) // throws "BAD VALUE 3 AT a"
```

Where `$VALUE` and `$PATH` are replaced by the value and path to the
value, respectively.


### TypeScript Types

Gubu makes a best-effort to support TypeScript types. The intersection
of the type of the shape and the type of the value is used as the
return type. This almost always does what you want, especially with
optional default values (from which types will be inferred).

The [GubuShape](#gubushape-function) function also contains a property
function `valid` with form:

```
valid(value: any, context?: any): boolean
```

This can be used as a [type guard](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates):

```
const shape = Gubu({ x: 1, y: 'Y' })
let data = { x: 2 }

if (shape.valid(data)) {
  console.log(data) // prints { x: 2, y: 'Y', z: true }
  console.log(data.x) // no type errors; prints 2
  console.log(data.y) // no type errors; prints 'Y'
  console.log(data.q) // type error! does not compile
}
```

The `valid` function does not throw, but you can optionally collect
[errors](#Errors) in the usual way with:
```
...
context = { err: [] }
if (shape.valid(data, context)) {
  ...
}

// failed
else {
  // context.err has the errors!
}
```


Where TypeScript cannot infer your types properly, you'll need to
manually define them:

```
let shape = Gubu(Open({ x: 1}) as unknown as { x: number })
let data = { z: true }

if (shape.valid(data)) {
  console.log(data) // prints{ x: 1, z: true })
  console.log(data.x) // no type errors; prints 1
  console.log(data.z) // no type errors; prints true 
  console.log(data.q) // type error! does not compile
}
```

The holy grail would be for Gubu to use your type definitions directly:

```
interface User {
  name: string
  age: number
  job?: string
}

// DOES NOT WORK!
let shape = Gubu(User)
```

Sadly TypeScript does not provide runtime type information at
present&mdash;[it should](https://www.typescriptneedstypes.com/)!

If you're really keen on being ultra-DRY, and really want to avoid
duplicating type definitions into almost, but not quite, the same shape
definitions, here are your options:

1. Create an instance of your type, and use that as the shape definition:

```
Class Car {
  // These defaults become the shape definitions
  make: string = ''
  model: string = ''
}
const shape = Gubu({ ...new Car() })
```

2. Use code generation. Perhaps you are already building types from a
   SQL Schema? Use the same approach to build the shapes.
   
3. Parse the `d.ts` type definitions at runtime use those to
   dynamically define your shapes.
   
None of these options are that great. For moment, I recommend that you
use the instance trick above if you can (option 1), and live with some
manual fix up.

One more thing: at the moment I don't plan to support definitions in
the other direction, going from shapes to TypeScript types. That would
just be building a bad copy of the TypeScript type system using
different syntax. That said, never say never, and if TypeScript
inference can support it, I may look at it again.


### Shape Nodes

The data structure returned by `GubuShape.spec()` is the internal
representation of the validation shape. This is a hierarchical data
structure where the validation for each key-value pair is defined by a
shape `Node`, which has the following structure:

* `$`: typeof GUBU         : Special marker to indicate a *Gubu* `Node` object.
* `t`: `ValType`           : Value type name (see below).
* `d`: number              : Depth of the object tree.
* `v`: any                 : Default value.
* `r`: boolean             : Value is required.
* `p`: boolean             : Value is skippable (if key is absent, no default is injected).
* `n`: number              : Number of keys in default value.
* `c`: any                 : Default child shape (for array elements and open objects).
* `u`: Record<string, any> : Custom user meta data.
* `b`: Validate[]          : Custom before-validation functions.
* `a`: Validate[]          : Custom after-validation functions.
* `s?`: string             : Custom stringification of the value (mostly for error messages).

The `ValType` is string with exactly one of these values: 
* `'any'` :       Any type.
* `'array'` :     An array.
* `'bigint'` :    A BigInt value.
* `'boolean'` :   The values `true` or `false`.
* `'custom'` :    Custom type defined by a validation function.
* `'function'` :  A function.
* `'instance'` :  An instance of a constructed object.
* `'list'` :      A list of types under a given logical rule.
* `'nan'` :       The `NaN` value.
* `'never'` :     No type.
* `'null'` :      The `null` value.
* `'number'` :    A number.
* `'object'` :    A plain object.
* `'string'` :    A string (but *not* the empty string).
* `'symbol'` :    A symbol reference.
* `'undefined'` : The `undefined` value.


This structure is deliberately terse (hence the one character property
names) to make eye-balling deep structure debugging print-outs easier.

As noted above, in the current version this structure is only fully
serializable to JSON if there are no custom validations, and the
custom user meta data is serializable.

This structure can be accessed in [custom
validators](#custom-validation) via the `state.node` parameter, and in
[shape builders](#shape-builders) via the [before](#custom-builders) and
[after](#custom-builders) hook functions. It is also provided in error
messages under the `n` property.



### Shape Builder Usage

The validation rules for each value shape can be modified using shape
builders. These are wrapping functions that add additional constraints
to the value shape.

For example, the [Required](#required-builder) shape builder marks a
value as required. This is most useful for objects and array, which
are by default optional:

```
const { Gubu, Required } = require('gubu') // shaper builders are exported
let easier = Gubu({ x: 1 })
let stricter = Gubu(Required({ x: 1 }))

easier() // returns { x: 1 }

stricter() // fails
stricter({}) // returns { x: 1 } (x itself is an optional default)
```

Most shape builders can also be chained. For example, the
[Open](#open-builder) shape builder allows additional properties to be
added to an object. To also make the object required you can use
either of these expressions:

```
const { Required, Open } = Gubu // shape builders are also properties of Gubu
Gubu(Open({ a: 1, b: 2 }).Required())
Gubu(Required({ a: 1, b: 2 }).Open())
```

Most shape builders can be composed (check their expected arguments!),
so the following are also equivalent:

```
Gubu(Open(Required({ a: 1, b: 2 })))
Gubu(Required(Open({ a: 1, b: 2 })))
```

This flexibility allows you to adjust shapes without too much
refactoring or "schema noise".


### Shape Builder Reference
<sub><sup>[top](#top)</sup></sub>

[API](#api) | 
[Shapes](#shape) | 
[Errors](#errors) | 
[Custom Validation](#custom-validation) |
[Shape Rules](#shape-rules)

The built-in shape builders are:

* [Above](#above-builder): 
  Match a value (or length of value) greater than the given amount.

* [After](#after-builder): 
  Define a custom validation function called after a value is processed.

* [All](#all-builder): 
  All shapes must match value.

* [Any](#any-builder): 
  This shape will match any value.

* [Before](#before-builder): 
  Define a custom validation function called before a value is processed.

* [Below](#below-builder): 
  Match a value (or length of value) less than the given amount.

* [Check](#check-builder): 
  Check value with a custom validation function or regular expression.

* [Child](#child-builder): 
  All non-explicit child values of an object must match this shape.

* [Closed](#closed-builder): 
  Allow only explicitly defined elements in an array.

* [Define](#define-builder): 
  Define a name for a value.

* [Empty](#empty-builder): 
  Allow string values to be empty.

* [Exact](#exact-builder): 
  The value must one of an exact list of values.

* [Func](#func-builder): 
  The value is explicitly a function.

* [Key](#key-builder): 
  The key (or path) of the current object is injected as the value.

* [Max](#max-builder): 
  Match a value (or length of value) less than or equal to the given amount.

* [Min](#min-builder): 
  Match a value (or length of value) greater than or equal to the given amount.

* [Never](#never-builder): 
  This shape will never match anything.

* [Len](#len-builder): 
  Match a value (or length of value) exactly equal to the given amount.

* [One](#one-builder): 
  Exactly one shape (and no more) must match value.

* [Open](#open-builder): 
  Allow arbitrary properties in an object.

* [Skip](#skip-builder): 
  Make a value explicitly optional (no default created).

* [Refer](#refer-builder): 
  Refer to a defined value by name.

* [Rename](#rename-builder): 
  Rename the key of a property.

* [Required](#required-builder): 
  Make a value required.

* [Some](#some-builder): 
  Some shapes (at least one) must match value.

* [Value](#value-builder): 
  All non-explicit child values of a shape must match this shape.


---
#### Above Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Above( value: number|string|array|object, child?: any )
```

* **Standalone:** `Above(2)`
* **As Parent:** `Above(2, Number)`
* **As Child:** `Skip(Above(2))`
* **Chainable:** `Required(Number).Above(2)`

Only allow values that are above the given value in length. "Length" means:
* Arrays: array length; 
* Strings: string length; 
* Objects: number of keys;
* Numbers: numeric value;
* Object with property `length`: numeric value of `length`;
* Anything else fails.

For more complex validation, use the [Check](#check-builder) shape builder to write
a custom validation function.


```js
const { Above } = Gubu
let shape = Gubu(Above(2))

shape(3) // PASS: 3 > 2; returns 3
shape(2) // FAIL: throws 'Value "2" for property "" must be above 2 (was 2).'

shape('abc') // PASS: 'abc'.length 3 > 2; returns 'abc'
shape('ab')  // FAIL: 'Value "ab" for property "" must have length above 2 (was 2).'

shape([1, 2, 3]) // PASS: array length 3 > 2; returns [1, 2, 3]
shape([1, 2])    // FAIL: throws: 'Value "[1,2]" for property "" must have length above 2 (was 2).'

shape({ a: 1, b: 2, c: 3 }) // PASS: number of keys 3 > 2; returns { a: 1, b: 2, c: 3 }
shape({ a: 1, b: 2 })       // FAIL: throws: 'Value "{a:1,b:2}" for property "" must have length above 2 (was 2).'
```

See also: 
[Below](#below-builder), 
[Min](#min-builder), 
[Max](#max-builder), 
[Len](#len-builder), 
[Check](#check-builder).


---
#### After Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
After( validate: Validate, child?: any )
```

* **Standalone:** `After(() => true)`
* **As Parent:** `After(() => true, {x: 1})`
* **As Child:** `Required(After(() => true))`
* **Chainable:** `Skip({x: 1}).After(() => true)`

Provide a validation function that will run **after** the value has been
processed normally. The validation function has the form:

```
Validate(value: any, update?: Update, state?: State): boolean
```

Return `true` if the value is valid, `false` otherwise. See the 
[Custom Validations](#custom-validation) section.


> NOTE: In general you should use the [Check](#check-builder) shape
> builder for custom validation. This builder is intended for advanced
> usage.

```js
const { After } = Gubu
let shape = Gubu(After(v => 0 === v % 2)) // Pass if value is even

shape(2) // PASS: 2 is even; returns 2
shape()  // PASS: returns undefined (value was not required)
shape(1) // FAIL: 1 is not even


shape = Gubu(After(v => 0 === v.x % 2, Required({x: Number})))

shape({x: 2))   // PASS: 2 is even; returns 2
shape({x: 1})   // FAIL: 1 is not even
shape({x: 'X'}) // FAIL: 'X' is not a number
shape({})       // FAIL: x is required
shape()         // FAIL: {x: Number} is required
```

See also: 
[Check](#check-builder), 
[Before](#before-builder), 
[Update](#update-type), 
[State](#state-type).


---
#### All Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
All( ...children: any[] )
```

* **Standalone:** `All(Number, v => v>10)`
* **As Parent:** INVALID
* **As Child:** `Skip(All({x: 1}, Min(2)))`
* **Chainable:** INVALID

To be valid, the source value must match all of the shapes given as
arguments. All shapes are **always evaluated**, even if some fail, to
ensure all errors are collected.

This shape builder implicitly creates a [Required](#required-builder)
value. Use the [Skip](#skip-builder) shape builder to
make the value skippable (if absent, no default is injected).

To match exact values, use the [Exact](#exact-builder) shape builder
(literal values alone will just create optional defaults).

```js
const { All } = Gubu

let shape = Gubu(All(Number, Check(v => v > 10)))

shape(11) // PASS: 11 is a number, and 11 > 10 
shape(9)  // FAIL: 9 is a number, but 9 < 10 
shape()   // FAIL: a value is required (implicitly)

// Make the All skippable
shape = Gubu({ a: Skip(All(Open({ b: String }), Max(2))) })
shape({ a: { b: 'X' } }) // PASS: returns same object
shape({}) // PASS: `a` is optional, returns {}
```

See also: 
[One](#one-builder), 
[Some](#some-builder), 
[Exact](#exact-builder), 



---
#### Any Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Any( child?: any )
```

* **Standalone:** `Any()`
* **As Parent:** `Any({x: 1})`
* **As Child:** `Required(Any())`
* **Chainable:** `Skip({x: 1}).Any()`

Accept any value. If a child value is provided, it will be used as a
default (when the source value is `undefined`).

```js
const { Any } = Gubu
let shape = Gubu(Any())

console.log(shape(11)) // prints 11
console.log(shape(10)) // prints 10
console.log(shape()) // prints undefined
console.log(shape(null)) // prints null
console.log(shape(NaN)) // prints NaN
console.log(shape({})) // prints {}
console.log(shape([])) // prints []

// with default
shape = Gubu(Any({x: 1}))
console.log(shape(11)) // prints 11
console.log(shape(10)) // prints 10
console.log(shape()) // prints {x: 1}
```



---
#### Before Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Before( validate: Validate, child?: any )
```

* **Standalone:** `Before(() => true)`
* **As Parent:** `Before(() => true, {x: 1})`
* **As Child:** `Required(Before(() => true))`
* **Chainable:** `Skip({x: 1}).Before(() => true)`

Provide a validation function that will run **before** the value has been
processed normally. The validation function has the form:

```
Validate(value: any, update?: Update, state?: State): boolean
```

Return `true` if the value is valid, `false` otherwise. See the 
[Custom Validations](#custom-validation) section.

Even if validation fails, the value will still be processed
normally. This ensures that all errors, particularly those in child
values, are also captured. To prevent further processing, set
`Update.done = true`.

> NOTE: In general you should use the [Check](#check-builder) shape
> builder for custom validation. This builder is intended for advanced
> usage.

```js
const { Before } = Gubu
let shape = Gubu(Before(v => 0 === v % 2)) // Pass if value is even

shape(1) // FAIL: 1 is not even
shape(2) // PASS: 2 is even; returns 2
shape()  // PASS: returns undefined


shape = Gubu(Before(v => 0 === v.x % 2, Required({x: Number})))

shape({x: 1})   // FAIL: 1 is not even
shape({x: 2))   // PASS: 2 is even; returns 2
shape({x: 'X'}) // FAIL: 'X' is not a number
shape({})       // FAIL: x is required
shape()         // FAIL: {x: Number} is required
```

See also: 
[Check](#check-builder), 
[After](#after-builder), 
[Update](#update-type), 
[State](#state-type).



---
#### Below Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Below( value: number|string, child?: any )
```

* **Standalone:** `Below(2)`
* **As Parent:** `Below(2, Number)`
* **As Child:** `Skip(Below(2))`
* **Chainable:** `Required(Number).Below(2)`

Only allow values that are below the given value in length. "Length" means:
* Arrays: array length; 
* Strings: string length; 
* Objects: number of keys;
* Numbers: numeric value;
* Object with property `length`: numeric value of `length`;
* Anything else fails.

For more complex validation, use the [Check](#check-builder) shape builder to write
a custom validation function.


```js
const { Below } = Gubu
let shape = Gubu(Below(2))

shape(1) // PASS: 1 < 2; returns 1
shape(2) // FAIL: throws 'Value "2" for property "" must be below 2 (was 2).'

shape('abc') // PASS: 'abc'.length 1 < 2; returns 'abc' 
shape('ab')  // FAIL: 'Value "ab" for property "" must have length below 2 (was 2).'

shape([1])    // PASS: array length 1 < 2; returns [1]
shape([1, 2]) // FAIL: throws: 'Value "[1, 2]" for property "" must have length below 2 (was 2).'
```

See also: 
[Above](#above-builder), 
[Min](#min-builder), 
[Max](#max-builder), 
[Len](#len-builder), 
[Check](#check-builder).



---
#### Check Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Check( validate: Validate | RegExp, child?: any )
```

* **Standalone:** `Check(v => v > 10)`
* **As Parent:** `Check(v => !(v.foo % 2), { foo: 2 })`
* **As Child:** `Skip('a', (Check(/a/))`
* **Chainable:** `Skip(String).Check(/a/)`

Define a custom validation function. Return `true` if the value is
valid, `false` otherwise.

The custom validation function has three arguments:
* `val`: the value to validate
* `update`: the [Update](#update-type) data structure
* `state`: the [State](#state-type) data structure

See the [custom validation](#custom-validation) section for more
details on these arguments, and usage examples.

Even if validation fails, the value will still be processed
normally. This ensures that all errors, particularly those in child
values, are also captured. To prevent further processing, set
`Update.done = true`.

This shape builder implicitly creates a [Required](#required-builder)
value. Use the [Skip](#skip-builder) shape builder to make the value
skippable (if absent, no default is injected).

The validation function will never be passed an `undefined` value, so
validation functions do not need to check for this case. If you do
need to obtain `undefined` values, use the [Before](#before-builder)
shape builder.

Instead of a validation function, you can also pass a regular
expression. The value will be converted to a string (with
`String(...)`) and matched against the regular expression.


```js
const { Check } = Gubu

let shape = Gubu(Check(v => v > 10))
shape(11) // PASS: 11 > 10 is true, returns 11
shape(10) // FAIL: 10 > 10 is false

shape = Gubu(Check(/a/))
shape('bar') // PASS: bar matches /a/
shape('foo') // FAIL: foo does not match /a/
```

See also: 
[Before](#before-builder), 
[After](#after-builder), 
[Update](#update-type), 
[State](#state-type).



---
#### Closed Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Closed( child?: any )
```

* **Standalone:** `Closed([String])`
* **As Parent:** INVALID
* **As Child:** `Required(Closed([Number]))`
* **Chainable:** `Skip([{x: 1}]).Closed()`

Restricts an array to an explicit set of elements. The array
is "closed" and can only have the elements defined in the shape.

> NOTE: Arrays with two or more elements are already considered
> closed. The `Closed` shape builder makes it possible to close single
> element arrays, which would normally be open with the single element
> defining the general shape of all elements.

```js
const { Closed } = Gubu

// Closed array.
let shape = Gubu(Closed([Number]))
shape([1]) // PASS: returns [1]
shape([1, 2]) // FAIL: element "2" is not allowed

// Open array.
shape = Gubu([Number])
shape([1]) // PASS: returns [1]
shape([1, 2]) // PASS: returns [1, 2], all elements are numbers
```


---
#### Define Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Define( options: string | { name: string }, child?: any )
```

* **Standalone:** `Define('FOO',{x: 1})`
* **As Parent:** `Define('FOO", {x: 1})`
* **As Child:** `Required(Define('FOO', {x: 1}))`
* **Chainable:** `Skip({x: 1}).Define('FOO')`

Define a name for a value that can be referenced by the
[Refer](#refer-builder) shape builder. Definitions must precede usage
by `Refer`, in depth-first order.

In order to prevent infinite loops caused by self-reference in
children, `Refer` does *not* inject default values. This is normally
what you want for [recursive shapes](#recursive-shapes).

To force injection of default values, use the `fill` option (of
`Refer`). Use this option only when there is no self-reference. Note
also that `Refer` does not copy the referred value. Instead it uses
the referred shape, thus `fill` only inserts the default value.

```js
const { Define, Refer } = Gubu

let shape = Gubu({ a: Define('foo', 11), b: Refer('foo') })
console.log(shape({ a: 10, b: 12 })) // prints { a: 10, b: 12 })
console.log(shape({ a: 10 })) // prints { a: 10, b: undefined }) - b is not filled!
console.log(shape({})) // prints { a: 11, b: undefined }) - b is not filled!
console.log(shape({ b: 12 })) // prints { a: 11, b: 12 })
shape({ a: 'A', b: 'B' }) // FAIL: b is not a number

shape = Gubu({ a: Define('foo', 11), b: Refer({ name: 'foo', fill: true }) })
console.log(shape({ a: 10, b: 12 })) // prints { a: 10, b: 12 })
console.log(shape({ a: 10 })) // prints { a: 10, b: 11 }) - b is filled with the default, not a copy
console.log(shape({})) // prints { a: 11, b: 11 }) - b is filled with the default, not a copy
console.log(shape({ b: 12 })) // prints { a: 11, b: 12 })
shape({ a: 'A', b: 'B' }) // FAIL: b is not a number
```



---
#### Empty Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Empty( child?: any )
```

* **Standalone:** `Empty(String)`
* **As Parent:** INVALID
* **As Child:** `Skip(Empty(String))`
* **Chainable:** `Skip(String).Empty()`

Allow the [empty string](#empty-strings) to satisfy a string value.

```js
const { Empty } = Gubu
let shape = Gubu(Empty(String))

shape('abc') // PASS: returns 'abc'
shape('') // PASS: returns ''
shape() // FAIL: a string is still required

shape = Gubu(Empty('abc'))
shape('def') // PASS: returns 'def'
shape('') // PASS: returns ''
shape() // PASS: returns 'abc' as default

shape = Gubu(Skip(Empty(String)))
shape('abc') // PASS: returns 'abc'
shape('') // PASS: returns ''
shape() // PASS: returns undefined

shape = Gubu(Skip(String).Empty())
shape('abc') // PASS: returns 'abc'
shape('') // PASS: returns ''
shape() // PASS: returns undefined

```


---
#### Exact Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Exact( value: any )
```

* **Standalone:** `Exact(123)`
* **As Parent:** INVALID
* **As Child:** `Required(Exact('abc'))`
* **Chainable:** `Skip(String).Exact('A')`

Specific an exact list of one or more **values** that the shape can be
exactly equal to. Use this to restrict the allowed literal values of
the shape. Use this for enumeration-like values.

> Only literal values are accepted. Child shapes are not supported.


```js
const { Exact } = Gubu

let shape = Gubu(Exact(11, 12, true))

console.log(shape(11)) // prints 11
console.log(shape(12)) // prints 12
console.log(shape(true)) // prints true
console.log(shape(10)) // FAIL: 10 is not one of 11, 12, true
console.log(shape(false)) // FAIL: undefined is not one of 11, 12, true
```



---
#### Max Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Max( value: number|string, child?: any )
```

* **Standalone:** `Max(2)`
* **As Parent:** `Max(2, Number)`
* **As Child:** `Skip(Max(2))`
* **Chainable:** `Required(Number).Max(2)`

Only allow values that have length less than or equal to the given
maximum value. "Length" means:
* Arrays: array length; 
* Strings: string length; 
* Objects: number of keys;
* Numbers: numeric value;
* Object with property `length`: numeric value of `length`;
* Anything else fails.

For more complex validation, use the [Check](#check-builder) shape builder to write
a custom validation function.


```js
const { Max } = Gubu
let shape = Gubu(Max(2))

shape(1) // PASS: 1 <= 1; returns 1
shape(2) // PASS: 1 <= 2; returns 2
shape(3) // FAIL: throws 'Value "3" for property "" must be a maximum of 2 (was 3).'

shape('a')   // PASS: 'a'.length 1 <= 2; returns 'a'
shape('ab')  // PASS: 'ab'.length 2 <= 2 ; returns 'ab'
shape('abc') // FAIL: 'Value "abc" for property "" must be a maximum length of 2 (was 3).'

shape([1])       // PASS: array length 1 <= 2; returns [1]
shape([1, 2])    // PASS: array length 2 <= 2; returns [1, 2]
shape([1, 2, 3]) // FAIL: throws: 'Value "[1, 2, 3]" for property "" must be a maximum length of 2 (was 3).'
```

See also:
[Above](#above-builder), 
[Below](#below-builder), 
[Min](#min-builder), 
[Len](#len-builder), 
[Check](#check-builder).



---
#### Min Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Min( value: number|string, child?: any )
```

* **Standalone:** `Min(2)`
* **As Parent:** `Min(2, Number)`
* **As Child:** `Skip(Min(2))`
* **Chainable:** `Required(Number).Min(2)`

Only allow values that have length greater than or equal to the given
minimum value. "Length" means:
* Arrays: array length; 
* Strings: string length; 
* Objects: number of keys;
* Numbers: numeric value;
* Object with property `length`: numeric value of `length`;
* Anything else fails.

For more complex validation, use the [Check](#check-builder) shape builder to write
a custom validation function.

```js
const { Min } = Gubu
let shape = Gubu(Min(2))

shape(3) // PASS: 3 >= 2; returns 3
shape(2) // PASS: 2 >= 2; returns 2
shape(1) // FAIL: throws 'Value "1" for property "" must be a minimum of 2 (was 1).'

shape('abc') // PASS: 'abc'.length 3 >= 2; returns 'abc'
shape('ab')  // PASS: 'ab'.length 2 >= 2 ; returns 'ab'
shape('a')   // FAIL: 'Value "a" for property "" must be a minimum length of 2 (was 1).'

shape([1, 2, 3]) // PASS: array length 3 >= 2; returns [1, 2, 3]
shape([1, 2])    // PASS: array length 2 >= 2; returns [1, 2]
shape([1])       // FAIL: throws: 'Value "[1]" for property "" must be a minimum length of 2 (was 1).'
```

See also: 
[Above](#above-builder), 
[Below](#below-builder), 
[Max](#max-builder), 
[Len](#len-builder), 
[Check](#check-builder).



---
#### Len Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Len( value: number, child?: any )
```

* **Standalone:** `Len(2)`
* **As Parent:** `Len(2, String)`
* **As Child:** `Skip(Len(2))`
* **Chainable:** `Required(String).Len(2)`

Only allow values that have length equal to the given value. "Length" means:
* Arrays: array length; 
* Strings: string length; 
* Objects: number of keys;
* Numbers: numeric value;
* Object with property `length`: numeric value of `length`;
* Anything else fails.

For more complex validation, use the [Check](#check-builder) shape builder to write
a custom validation function.

```js
const { Len } = Gubu
let shape = Gubu(Len(2))

shape('abc') // FAIL: 'Value "abc" for property "" must be exactly 2 in length (was 3).'
shape('ab')  // PASS: 'ab'.length 2 >= 2 ; returns 'ab'
shape('a')   // FAIL: 'Value "a" for property "" must be exactly 2 in length (was 1).'

shape(3) // FAIL: 3 != 2; returns 3
shape(2) // PASS: 2 == 2; returns 2
shape(1) // FAIL: throws 'Value "1" for property "" must be exactly 2 (was 1).'

shape([1, 2, 3 ]) // FAIL: throws: 'Value "[1,2,3]" for property "" must be exactly 2 in length (was 3).'
shape([1, 2])     // PASS: array length 2 >= 2; returns [1, 2]
shape([1])        // FAIL: throws: 'Value "[1]" for property "" must be exactly 2 in length (was 1).'
```

See also: 
[Above](#above-builder), 
[Below](#below-builder), 
[Max](#max-builder), 
[Min](#min-builder), 
[Check](#check-builder).


---
#### Never Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Never( child?: any )
```

* **Standalone:** `Never()`
* **As Parent:** `Never({x: 1})`
* **As Child:** `Required(Never())`
* **Chainable:** `Skip({x: 1}).Never()`

Never match a value. This builder causes the shape to always fail. It
supports parent, child, and chainable forms to make temporary
debugging shape changes easier&mdash;these forms also always fail.


```js
const { Never } = Gubu
let shape = Gubu(Never())

shape(123) // FAIL: always fails
shape()    // FAIL: always fails, even on undefined
```



---
#### One Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
One( ...children: any[] )
```

* **Standalone:** `One(Number, String)`
* **As Parent:** INVALID
* **As Child:** `Skip(One({x: 1}, {x: 2}))`
* **Chainable:** INVALID

To be valid, the source value must match exactly one of the shapes
given as arguments. Shape matching halts at the first matching shape.

This shape builder implicitly creates a [Required](#required-builder)
value. Use the [Skip](#skip-builder) shape builder to
make the value skippable (if absent, no default is injected).

To match exact values, use the [Exact](#exact-builder) shape builder
(literal values alone will just create optional defaults).

```js
const { One } = Gubu
let shape = Gubu(One(Number, String))

shape(123)   // PASS: 123 is a number
shape('abc') // PASS: 'abc' is a string
shape(true)  // FAIL: `true` is not a number or string
shape()      // FAIL: a value is required

shape = Gubu(One(Exact(10), Exact(11), Exact(true)))
shape(10)    // PASS: exact match for `10`
shape(11)    // PASS: exact match for `11`
shape(true)) // PASS: exact match for `true`
shape(12)    // FAIL: no exact match
shape(false) // FAIL: no exact match
shape()      // FAIL: a value is required
```

See also: 
[All](#all-builder), 
[Some](#some-builder), 
[Exact](#exact-builder), 



---
#### Skip Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Skip( child?: any )
```

* **Standalone:** `Skip(Number)`
* **As Parent:** `Skip({x: 1})`
* **As Child:** `Open(Skip({x: 1}))`
* **Chainable:** `Skip({x: 1}).Open()`

Make the value skippable&mdash;if it is missing (no property key), no
default is injected. If the value was implicitly required
([One](#one-builder), [All](#all-builder), etc.) then the value
becomes optional. If the value is undefined, a required child value
will no longer cause validation to fail. If the value is absent, no
default will be inserted.

```js
const { Skip } = Gubu
let shape = Gubu({a: Skip(123)})
console.log(shape({ a: 456 })) // prints { a: 456 }
console.log(shape({}))  // prints {} - no default inserted
console.log(shape({ a: undefined })) // prints { a: undefined }
console.log(shape({ a: true })) // FAIL: true is not a number
```



---
#### Refer Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Refer( options: string | { name: string, fill?: boolean }, child?: any )
```

* **Standalone:** `Refer('FOO',{x: 1})`
* **As Parent:** `Refer('FOO", {x: 1})`
* **As Child:** `Required(Refer('FOO', {x: 1}))`
* **Chainable:** `Skip({x: 1}).Refer('FOO')`

Reference a previously defined shape by name (using
[Define](#define-builder)). Definitions with `Define` must precede
usage by `Refer`, in depth-first order.

In order to prevent infinite loops caused by self-reference in
children, `Refer` does *not* inject default values. This is normally
what you want for [recursive shapes](#recursive-shapes).

To force injection of default values, use the `fill` option (of
`Refer`). Use this option only when there is no self-reference. Note
also that `Refer` does not copy the referred value. Instead it uses
the referred shape, thus `fill` only inserts the default value.

```js
const { Define, Refer } = Gubu

let shape = Gubu({ a: Define('foo', 11), b: Refer('foo') })
console.log(shape({ a: 10, b: 12 })) // prints { a: 10, b: 12 })
console.log(shape({ a: 10 })) // prints { a: 10, b: undefined }) - b is not filled!
console.log(shape({})) // prints { a: 11, b: undefined }) - b is not filled!
console.log(shape({ b: 12 })) // prints { a: 11, b: 12 })
shape({ a: 'A', b: 'B' }) // FAIL: b is not a number

shape = Gubu({ a: Define('foo', 11), b: Refer({ name: 'foo', fill: true }) })
console.log(shape({ a: 10, b: 12 })) // prints { a: 10, b: 12 })
console.log(shape({ a: 10 })) // prints { a: 10, b: 11 }) - b is filled with the default, not a copy
console.log(shape({})) // prints { a: 11, b: 11 }) - b is filled with the default, not a copy
console.log(shape({ b: 12 })) // prints { a: 11, b: 12 })
shape({ a: 'A', b: 'B' }) // FAIL: b is not a number
```



---
#### Rename Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Rename( options: string | { name: string, keep: boolean }, value: any )
```

* **Standalone:** `Rename('bar', Number)`
* **As Parent:** `Rename('bar', {x: 1})`
* **As Child:** `Required({foo: Rename('bar', Number)})`
* **Chainable:** `{foo: Skip(Number).Rename('bar')}`

Rename the key of a value. The first argument to the `Rename` builder
is the new string value of the key, or an options object with properties:
* `name`: `string`: required, new name for the key
* `keep`: `boolean`: optional, keep the old property

```js
const { Rename } = Gubu

let shape = Gubu({ a: Rename('b', Number) })
console.log(shape({ a: 10 })) // prints { b: 10 })

shape = Gubu({ a: Rename({ name: 'b', keep: true }, 123) })
console.log(shape({ a: 10 })) // prints { a: 10, b: 10 })
console.log(shape({})) // prints { a: 123, b: 123 })
```



---
#### Required Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Required( child?: any )
```

* **Standalone:** `Required({x: 1})`
* **As Parent:** `Required({x: 1})`
* **As Child:** `Closed(Required({x: 1}))`
* **Chainable:** `Closed({x: 1}).Required()`

Make the value explicitly required. Undefined values will fail. This
is most useful for objects and arrays, as these are optional by
default.

```js
const { Required } = Gubu
let shape = Gubu(Required({x: 1}))

console.log(shape({ x: 2 })) // PASS: prints { x: 2 })
console.log(shape({ x: 2, y: 3 })) // PASS: prints { x: 2, y: 3 }
console.log(shape()) // FAIL: object is required

shape = Gubu(Open(Required({ x: 1 })))
console.log(shape({ x: 2 })) // PASS: prints { x: 2 })
console.log(shape({ x: 2, y: 3 })) // PASS: prints { x: 2, y: 3 )
console.log(shape()) // FAIL: object is required

// Same as above, but chained
shape = Gubu(Open({ x: 1 }).Required())
console.log(shape({ x: 2 })) // PASS: prints { x: 2 })
console.log(shape({ x: 2, y: 3 })) // PASS: prints { x: 2, y: 3 }
console.log(shape()) // FAIL: object is required
```



---
#### Some Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Some( ...children: any[] )
```

* **Standalone:** `Some({x: 1}, {y: 2})`
* **As Parent:** INVALID
* **As Child:** `Skip(Some({x: 1}, {y: 2}))`
* **Chainable:** INVALID

To be valid, the source value must match some of the shapes given as
arguments (at least one). All shapes are always evaluated, even if
some fail, to ensure all errors are collected.

This shape builder implicitly creates a [Required](#required-builder)
value. Use the [Skip](#skip-builder) shape builder to
make the value skippable (if absent, no default is injected).

To match exact values, use the [Exact](#exact-builder) shape builder
(literal values alone will just create optional defaults).


```js
const { Some } = Gubu
let shape = Gubu(Some({x: 1}, {y: 2}))

shape({ x: 1 }) // PASS: { x: 1 } matches; returns { x: 1 }
shape({ y: 2 }) // PASS: { y: 2 } matches; returns { y: 2 }
shape({ x: 1, y: 2 }) // PASS: { x: 1, y: 2 } matches; returns { x: 1, y: 2 }
shape({ z: 3 })  // FAIL: does not match { x: 1 } or { y: 2 }
```

See also: 
[All](#all-builder), 
[One](#one-builder), 
[Exact](#exact-builder), 



---
#### Value Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Value( general: any, target: any )
```

* **Standalone:** `Value(Number, {})`
* **As Parent:** `Value(Number, {x: 1})`
* **As Child:** `Required(Value(Number, {x: 1}))`
* **Chainable:** `Skip({x: 1}).Value(Number)`

Specify the general shape that each value of an object must
satisfy. Does not apply to any explicitly defined property values.


```js
const { Value } = Gubu
let shape = Gubu(Value())

let shape = Gubu(Value(Number, {}))
console.log(shape({ x: 10 })) // PASS: prints { x: 10 }
console.log(shape({ x: 10, y: 11 })) // PASS: prints { x: 10, y: 11 }
console.log(shape({ x: true })) // FAIL: true is not a numbner

shape = Gubu({
  page: Value(
    {
      title: String,
      template: 'standard'
    },
    {
      home: {
        title: 'Home',
        template: 'home'
      },
      sitemap: {
        title: 'Site Map',
        template: 'sitemap'
      },
    }
  )
})

let result = shape({
  page: {
    about: {
      title: 'About'
    },
    contact: {
      title: 'Contact'
    }
  }
})

result === {
  page: {
    about: {
      template: 'standard',
      title: 'About',
    },
    contact: {
      template: 'standard',
      title: 'Contact',
    },
    home: {
      template: 'home',
      title: 'Home',
    },
    sitemap: {
      template: 'sitemap',
      title: 'Site Map',
    },
  }
}
```


---
#### Child Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Child( general: any )
```

* **Standalone:** `Child(Number)`
* **As Parent:** `Child(Number)`
* **As Child:** `Required(Child(Number))`
* **Chainable:** `Skip({x: 1}).Child(Number)`

Specify the shape that each child value of an object must satisify/
Does not apply to any explicitly defined property child values.


```js
const { Child } = Gubu

let shape = Gubu(Child(Number))
console.log(shape({ x: 10 })) // PASS: prints { x: 10 }
console.log(shape({ x: 10, y: 11 })) // PASS: prints { x: 10, y: 11 }
console.log(shape({ x: true })) // FAIL: true is not a number

shape = Gubu({
  page: Child(
    {
      title: String,
      template: 'standard'
    },
  )
})

let result = shape({
  page: {
    about: {
      title: 'About'
    },
    contact: {
      title: 'Contact'
    }
  }
})

result === {
  page: {
    about: {
      template: 'standard',
      title: 'About',
    },
    contact: {
      template: 'standard',
      title: 'Contact',
    },
  }
}
```


---
#### Func Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Func( Function )
```

* **Standalone:** `Func(()=>true)`
* **As Parent:** `Func(()=>true)`
* **As Child:** `Required({foo: Func(()=>true)})`
* **Chainable:** `{foo: Skip().Func(()=>true)}`

The value is explicitly a function, with the given default. Most useful for 
escaping `String`, `Number`, `Boolean`.


```js
const { Func } = Gubu

let shape = Gubu({ a: Func(Number) })
console.log(shape({ a: Number })) // prints { a: Number })
```


---
#### Key Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Key(depth-or-custom?: number | (path,state)=>value, join?:string)
```

* **Standalone:** `{a:{b:Key()}`
* **As Parent:** `Key(()=>true)`
* **As Child:** `Required({foo: Key(()=>true)})`
* **Chainable:** `{foo: Skip().Key(()=>true)}`

Inject the parent key or path as the value.


```js
const { Key } = Gubu

let shape = Gubu(Child({name:Key()}))
console.log(shape({ a: {}, b: {} })) // prints { a: { name:'a'}, b: { name:'b'} })

shape = Gubu({a:{b:{c:{Child({path:Key(2,'.')}}}}}}))

// prints { a: { b: { c: { name:'b.c'} } } })
console.log(shape({ a: { b: { c: {} } } })) 
```



### Custom Builders

You can write your own shape builders. A shape builder is a function
that generates the internal [Shape Node](#shape-nodes) data structure,
possibly using parameters.

Here is the actual source code for the [Skip](#skip-builder) shape builder:

```ts
const Skip: Builder = function(this: Node, shape?: any) {
  let node = buildize(this, shape)
  node.r = false

  // Do not insert empty arrays and objects.
  node.p = true

  return node
}
```

A shape builder function has the form:

```
Builder( options?: any, ...values?: any[] ): Node
```

You can use the utility function `buildize` to create an initial
[Shape Node](#shape-nodes) instance. To accept a child shape, pass
in the first shape value provided to your `Builder`:

```
const Skip: Builder = function(this: Node, shape?: any) {
  let node = buildize(this, shape)
  ...
```

Once you have a `Node`, you can manipulate it directly:

```
  node.r = false

  // Do not insert empty arrays and objects.
  node.p = true
```

The `Node` structure is deliberately kept small. Most validation
behavior is implemented using the [Before](#custom-builders) and
[After](#custom-builders) shape builders to define
[Validate](#custom-validation) functions.

To add your own extension hooks, append `Validate` functions to the
`a` and `b` array properties of the `Node` structure, to add *before*
and *after* hooks, respectively. Here is a custom validator that
capitalizes strings, and then modifies them:

```ts
// NOTE: This example code is TypeScript
const Hyperbole: Builder = function(this: Node, shape0?: any) {
  let node = buildize(this, shape0)

  // Append a before hook  
  node.b.push((v, u) => {
    if ('string' === typeof (v)) {
      u.val = v.toUpperCase()
    }
    return true // always pass, just alters strings
  })

  // Append an after hook  
  node.a.push((v, u) => {
    if ('string' === typeof (v)) {
      u.val = v + '!'
    }
    return true // always pass, just alters strings
  })

  return node
}

let shape = Gubu(Hyperbole('foo'))
shape('a') // PASS: returns 'A!'
shape(1)   // FAIL: 'foo' defines an optional string shape
shape()    // PASS: optional string; returns 'foo!' as before is called before standard processing

shape = Gubu(Skip(Hyperbole(One(String, Number))))
shape('a') // PASS: returns 'A!'
shape(1)   // PASS: a number is allowed; ignore by Hyperbole; returns 1
shape()    // PASS: optional; returns undefined
```

For more inspiration, review the [source code](gubu/blob/main/gubu.ts)
to see how the built-in shape builders are implemented.


### Edge Cases

#### Empty Strings

Unfortunately the empty string is not really a subtype of the `string`
type, since it evaluates to `false`. In the case of HTTP input,
missing parameter values are often provided as empty strings, when
they are in fact simply not present. 

There are heartfelt arguments on both sides of this issue, but Gubu
must choose, and Gubu chooses not to accept empty strings as a
`string` type. This protects you from all sorts of weird bugs.

The engineering compromise is based on the principle of explicit
notice. Since reasonable people have a reasonable disagreement about
this behavior, a mitigation of the issue is to make it
explicit. Thus, the `Empty(String)`, or `Empty('foo')` shapes need to
be used if you want to accept empty strings (required or optional,
respectively).

As a shortcut, you can use `''` directly for optional strings, and
that shape will accept empty strings, and give you an empty string as
a default.


## Implementation

Unlike most validation libraries, *Gubu* does not use recursion,
avoiding the overhead of a deep function call stack. Instead a single
loop builds append-only stack arrays to track position in a depth
first traversal of the input value to validate. The stack array
elements are references to values, so do not consume much memory.

*Gubu* traverses over the shape definition, not the input value, which
further protects you from unexpectedly deep inputs.

If you're looking for a depth-first iterative tree-traversal algorithm
you've got one right here!

*Gubu* compiles the schema shape on a just-in-time basis. Each value
node is converted into a [Node](#shape-nodes) that describes the
expected value. Core validation such as types and required and
optional values are implemented inline. Shape builders provide further
validation. Each shape builder can accept raw values, or a Node, and
outputs a Node. Thus, shape builders are closed over Nodes under
composition, which means you can pretty much plug them together any
way you want. It also means you can [write your own shape
builders](#custom-builders) and just use them directly without any
setup.



### Contributing

Contributions are welcome! Just submit a PR. Note that this project
uses the MIT license so your contribution is made on the same terms.


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
Copyright (c) 2021-2022, Richard Rodger and other contributors.
Licensed under [MIT][].

[MIT]: ./LICENSE


## Footnotes

[^1]: The implementation algorithm is iterative, just a loop that
      processes values in depth-first order.

[^2]: An empty string is not considered to match the `string` type. To
      allow empty strings (as a required value), use `Empty(String)`. See [Empty
      Strings](#empty-strings).

[^3]: An empty string is not considered to match the `string` type. To
      allow empty strings (as an optional value), use
      `Empty('some-default')` or just `''`. See [Empty
      Strings](#empty-strings).

[^4]: Unfortunately `new Function()` generates a function value with
      the name `anonymous` that cannot be differentiated from a simple
      function declaration of a function also called `anonymous`.

[^5]: Correctly cloning a value in JavaScript is quite tricky, at
      least in the general case. Recursively copying values will only
      work in simple cases, circular references are trouble, and you
      don't even want to think about calling constructors.


