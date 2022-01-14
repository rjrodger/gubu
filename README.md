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

You can also write your own builders - see the [Shape
Builders](#shape-builders) section.

In addition to this README, the [unit tests](lib/gubu.test.ts) are
comprehensive and provide many usage examples.


### Shape Builders

The built-in shape builders help you match the following shapes:

* Required or optional:
  * [Required](#required-builder): Make a value required.
  * [Optional](#optional-builder): Make a value explicitly optional (no default created).
* Value constraints:
  * [Empty](#empty-builder): Allow string values to be empty.
  * [Exact](#exact-builder): The value must match one of an exact list of values.
  * [All](#all-builder): All shapes must match value.
  * [Some](#some-builder): Some shapes (at least one) must match value.
  * [One](#one-builder): Exactly one shape (and no more) must match value.
  * [Any](#any-builder): This shape will match any value.
  * [Never](#never-builder): This shape will never match anything.
* Length constraints (operate on values with a length or numeric value):
  * [Below](#below-builder): Match a value (or length of value) less than the given amount.
  * [Max](#max-builder): Match a value (or length of value) less than or equal to the given amount.
  * [Min](#min-builder): Match a value (or length of value) greater than or equal to the given amount.
  * [Above](#above-builder): Match a value (or length of value) greater than the given amount.
* General constraints:
  * [Closed](#closed-builder): Allow only explicitly defined properties in an object.
  * [Value](#value-builder): All non-explicit values of an object must match this shape.
* Mutations:
  * [Rename](#rename-builder): Rename the key of a property.
  * [Define](#define-builder): Define a name for a value.
  * [Refer](#refer-builder): Refer to a defined value by name.
* Customizations:
  * [Before](#before-builder): Define a custom validation function called before a value is processed.
  * [After](#after-builder): Define a custom validation function called after a value is processed.


### Recursive Shapes

QUICK INTRO WITH EXAMPLE 
[Define](#define-builder)
[Refer](#refer-builder)


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

Plain objects can be specified directly as they appear in values to be
validated. If you want an object `{foo: 123}`, then the shape is also
`{foo: 123}`, meaning any object with a `foo` property that is a
`number`. The `foo` property is optional, and will default to the
value `123`.

You can define plain objects to any depth. The shape `{ bar: { foo:
123} }` defines an object that optionally contains another object as
the value of the property `bar`.

As objects and sub-objects are often referenced directly in data
structures, *Gubu* will construct missing objects by default, and fill
in the missing child values (which may themselves be objects).

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
scalar](#required-scalars) shapes (such as `String`), or use the shape
builder [Required](#required-builder):

```
const { Required } = Gubu

let shape = Gubu({
  foo: Number,
  bar: Required({
    zed: Boolean
  })
})

// These pass, returning the value unchanged.
shape({ foo: 1, bar: { zed: false } })
shape({ foo: 1, bar: { zed: false, baz: 2 }, qaz: 3 }) // new properties are allowed

// These fail, throwing an Error.
shape({ bar: { zed: false } }) // foo is required
shape({ foo: 'abc', bar: { zed: false } }) // foo is not a number
shape({ foo: 1 }) // bar is required
shape({ foo: 1, bar: {} }) // bar.zed is required
```

Object properties that are required must always be provided, even if
they are children of optional objects&mdash;they wouldn't be required
otherwise! To allow such deep required properties to be missing, use
an explicit [Optional](#optional-builder) shape builder:

```
let strictShape = Gubu({ a: { b: String } })

// Passes
strictShape({ a: { b: 'ABC' } })

// Fails, even though a is not required.
strictShape({})


let easyShape = Gubu({ a: Optional({ b: String }) })

// Now both pass
easyShape({ a: { b: 'ABC' } })
easyShape({})

// This still fails, as `a` is now defined, and needs `b`
easyShape({ a: {} })

```
 

##### Closed Objects

To restrict the set of allowed properties, use the shape builder
[Closed](#closed-builder):

```
const { Closed } = Gubu

let shape = Gubu(Closed({
  a: Closed({ x: 1 }),
  b: { y: 2 }
}))

// These pass, returning the value with defaults inserted
shape({ a: { x: 11 }, b: { y: 22 } })
shape({ a: { x: 11 } }) // b is optional, returns { a: { x: 11 }, b: { y: 2 } }
shape({}) // a is optional, returns { a: { x: 1 }, b: { y: 2 } }

// These fail, throwing an Error.
shape({ a: { x: 11 }, b: { y: 22 }, c: { z: 33 } }) // c is not allowed
shape({ a: { x: 11, k: 44 } }) // k is not allowed inside { x: 11 }
```

If a property must be present in an object, used the shape builder
[Required](#required-properties-object).


##### Optional Objects

Objects are optional by default, and will be created if not
present. To prevent this, use the explicit shape builder
[Optional](#optional-builder) to indicate that you do *not* wish an
object to be inserted when it is missing.

```
const { Optional } = Gubu
let shape = Gubu({
  a: { x: 1 },
  b: Optional({ y: 2 }),
  c: Optional({ z: Optional({ k: 3 }) }),
})

// Explicitly optional properties are not inserted as defaults if missing.
shape({}) // returns { a: { x: 1 } }, b and c are missing entirely
shape({ b: {} }) // returns { a: { x: 1 }, b: { y: 2 } }, defaults for b are inserted
shape({ c: {} }) // returns { a: { x: 1 }, c: {} }, c has no non-optional defaults
shape({ c: { z: {} } }) // returns { a: { x: 1 }, c: { z: { k: 3 } } } // z has defaults
```

If the object value is present but empty, any default values will be inserted.


##### Object Values

You can define a general shape for all non-explicit object values
using the shape builder [Value](#value-builder):

```
const { Value } = Gubu
let shape = Gubu(Value({
  a: 123,
}, String))

// All new properties must be a String
shape({ a: 11, b: 'abc' }) // b is a string
shape({ c: 'foo', d: 'bar' }) // c and d are strings

// These fail
shape({ a: 'abc' }) // a must be a number
shape({ b: { x: 1 } }) // b must be a string
```

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

You can also define special shapes for individual elements at specific
indexes, as shown below.

As arrays are often referenced directly in data structures, *Gubu*
will construct missing arrays by default, and fill in the missing
element values if there are empty array entries.

The general form of an array shape is:

```
[
  <SHAPE>,
  <SPECIAL-SHAPE-0>,
  <SPECIAL-SHAPE-1>,
  ...
  <SPECIAL-SHAPE-N>,
]
```

where `<SHAPE>` is any valid *Gubu* shape definition. All elements
must match `<SHAPE>`, unless they are special cases.

For the special cases, they correspond to the first, second, etc
elements of the value array (and are thus offset by +1 in the array
shape):

```
let shape = Gubu([Number,String,Boolean])

// These pass, returning the array as is.
shape([ 'abc', true ])
shape([ 'abc', true, 123 ])
shape([ 'abc', true, 123, 456 ])

// These fail.
shape([ 123 ]) // Index 0 must be a string
shape([ 'abc', 123 ]) // Index 1 must be a boolean
```


##### Required Properties (Array)

To mark an array element as required, use the [required
scalar](#required-scalars) shapes (such as `String`), or use the shape
builder [Required](#required-builder). 

Only required special elements must be present. Empty arrays with a
required general element shape (such as `[Number]`), can still be empty
(`[]` with match). Element constraints apply to elements, not the
array itself.


```
let shape = Gubu([ { x: 1 }, Required({ y: Boolean }) ])

// These pass:
shape([ { y: true } ]) // Index 0 is special
shape([ { y: false }, { x: 123 } ]) // Index >= 1 must match general element shape

// These fail:
shape([]) // Index 0 is required
shape([ { x: 123 } ]) // Index 0 is special
```


##### Length Constraints

You can control the allowed length of an array using the shape builder
[Never](#never-builder) to make all elements special, and also by
using [Min](#min-builder), [Max](#max-builder),
[Above](#above-builder), and [Below](#below-builder) to restrict the
length of the array.

Use the shape builder [Never](#never-builder) as the first element to
prevent additional elements in the array:

```
const { Never } = Gubu
Gubu([Never()]) // Only accepts the empty array []
Gubu([Never(),String]) // Only accepts an array with a string first element ['abc']
```


The length constraining shape builders ([Min](#min-builder),
[Max](#max-builder), [Above](#above-builder), and
[Below](#below-builder)) work in a sensible way depending on the data
type. For strings they control character length, for numbers they
control magnitude, for object they control key count, and for arrays,
they control length:

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


##### Array Properties

JavaScript allows arrays to have properties: `let a = []; a.foo = 1`.
Matching against array properties is not supported in the current
version. The workaround is write a [custom
validator](#custom-validation).



#### Functions

To require a function, use the shape `Function`:
`Gubu(Function)(()=>true)` will pass.

To provide a default function, you'll need to create a shape manually,
using the special `G$` utility. Literal functions are used as [custom
validators](#custom-validation), as this is the most common use case.

```
let { G$ } = Gubu
let shape = Gubu({ fn: G$({ v: ()=>true }) })

shape({}) // returns { fn: ()=>true }
shape({ fn: ()=>false }) // returns { fn: ()=>false }
```


#### Custom Validation

[API](#api) | 
[Shapes](#shape) | 
[Errors](#errors) | 
[Custom Validation](#custom-validation) |
[Builders](#shape-builder-reference)


You can define custom validators by providing a function as the
shape. The first argument to this function will the value to
validate. Return `true` if the value is valid, and `false` if not.

```
let shape = Gubu({ a: (v) => 10 < v })
shape({ a: 11 }) // passes, as 10 < 11 is true
shape({ a: 9 })  // fails, as 10 < 9 is false
```

<a name="update-type"></a>
You modify the value using the second argument (`Update`) to the custom
validation function:

```
let shape = Gubu({ a: (value, update) => {
  update.val = value * 2 
  return true
})
shape({ a: 3 }) // returns { a: 6 }
```

As a special case, if you want to explicitly set the value to
`undefined` or `NaN`, use the property `uval`.

You can also provide a custom error message using the `update` argument:

```
let shape = Gubu({ a: (value, update) => {
  update.err = 'BAD VALUE $VALUE AT $PATH'
  return false // always fails
})
shape({ a: 3 }) // throws "BAD VALUE 3 AT a"
```

The special replacement tags `$VALUE` and `$PATH` are replaced with
the value, and the path to the value, respectively.

<a name="state-type"></a>
The third argument (`State`) to a custom validator is the internal state of the
validation process. This provided for special cases and workarounds,
and the internal set of properties is not stable. Review the [source
code](https://github.com/rjrodger/gubu/blob/main/gubu.ts#L80) to see
what is available.

```
let shape = Gubu({ a: (value, update, state) => {
  update.val = value + ` KEY=${state.key}`
})
shape({ a: 3 }) // returns { a: '3 KEY=a'}
```


### Gubu function

To construct a shape use the `Gubu` function exported by this module:

```
// Using require
const { Gubu } = require(`gubu`)

// Using import
import { Gubu } from 'gubu'

let shape = Gubu({ x: 1 })
```

In the browser, *Gubu* adds itself directly to the `window` object for
immediate use, if you directly load this module using a `script`
tag. However you'll probably just want to import *Gubu* in the usual
way and let your package builder look after things.

The `Gubu` function has arguments:
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
clash with your own names), use a 'G' prefix as an alias:

```
Gubu.GRequired = Gubu.Required
```



### GubuShape function

When you create a shape using `Gubu`, a `GubuShape` shape validator
function is returned:

```
// TypeScript
import { Gubu, GubuShape } from 'gubu'

// Normally you just let this be inferred:
const shape: GubuShape = Gubu(123)
```

The shape validator function has arguments:
* `value`: the value to validate (and modify with defaults).
* `context`: (optional) a context object containing your own data.

The value can be anything. It is not duplicated and **will be
mutated** if defaults are inserted.

The context is a general purpose store for anything you might want to
use in custom validation builders. It may also be used by builders to
hold state information (the name of the builder is used for
namespacing).

The context does have reserved names:
* `err`: an array of validation errors

If you provide a context with the property `err` as an empty array,
any validation errors will be added to this array, and an Error will
**not be thrown**:

```
let ctx = { err: [] }
Gubu(Number)('abc', ctx)  // does not throw
console.log(err[0]) // prints error description (number was expected)
```

The [error descriptions](#errors) are plain objects, not Errors.

The `GubuShape` function has the following properties:
* `toString`: returns a short string describing this `GubuShape` instance
* `[Util.inspect.custom]`: same as `toString`
* `spec`: returns a declarative description of the shape

The shape description provided by `spec` can be passed to `Gubu` to
generate a new separate shape instance.

Many shapes can be fully serialized to JSON, but those with custom
validator function are not serializable in the current version.

A `GubuShape` can be used be used as part of new shape
definition. They are intended to be composable.


### Shape Nodes

The data structure returned by `GubuShape.spec` is the internal
representation of the validation shape. This is a hierarchical data
structure where the validation for each key-value pair is defined by a
shape `Node`, which has the following structure:

* `$`: typeof GUBU         : Special marker to indicate normalized.
* `t`: ValType             : Value type name.
* `d`: number              : Depth.
* `v`: any                 : Default value.
* `r`: boolean             : Value is required.
* `o`: boolean             : Value is explicitly optional.
* `u`: Record<string, any> : Custom user meta data
* `b`: Validate[]          : Custom before validation functions.
* `a`: Validate[]          : Custom after validation functions.

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


This structure is deliberately terse to make eye-balling deep
structure print-outs easier.

As noted above, in the current version this structure is only fully
serializable to JSON if there are no custom validations, and the
custom user meta data is serializable.

This structure can be accessed in [custom
validators](#custom-validators) via the `state` parameter, and in
[shape builders](#shape-builders) via the [before](#custom-builders) and
[after](#custom-builders) hook functions. It is also provided in error
messages under the `n` property.



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
'Validation failed for path "" with value "x" because the value is not of type number.'

Gubu({ top: { foo: String, bar: Number }})({ top: { foo: 123, bar: 'abc'}}) // throws an Error with message:
`
Validation failed for path "top.foo" with value "123" because the value is not of type string.
Validation failed for path "top.bar" with value "abc" because the value is not of type number.
`
```

#### ErrDesc Object

The `ErrDesc` object is the internal representation of an error,
containing the full details of the error, which you can use for
customization. The properties are:

* `k: string`  : Key of failing value.
* `n: Node`    : Failing shape node.
* `v: any`     : Failing value.
* `p: string`  : Key path to value.
* `w: string`  : Error code ("why").
* `m: number`  : Error mark for debugging.
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
        t: 'Validation failed for path "" with value "x" because the value is not of type number.',
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

The *mark* value (property `m`) is a numeric code uniquely identifies
the generation point of the error, and should be quoted in bug
reports (or indeed you can use it yourself to inspect the source code). 


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
applied).

You can also set the context `err` property to `false`. In this case
errors are not collected at all, and they are ignored, so that the
full shape depth is always validated. The `GubuShape.spec` method used
this feature to generate a normalized validation `Node` hierarchy
against the `undefined` value.


#### Custom Errors

When using a (custom validator)[#custom-validation] you can provide a custom
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


type predicate:
unit test valid-basic


https://www.typescriptneedstypes.com/



### Shape Builder Usage

The validation rules for each value shape can be modified using shape
builders. These are wrapping functions that add additional constraints
to the value shape.

The [Required](#required-builder) marks a value as required. This is
most useful for objects and array, which are by default optional:

```
const { Gubu, Required } = require('gubu') // shaper builders are exported
let easier = Gubu({ x: 1 })
let stricter = Gubu(Required({ x: 1 }))

easier() // returns { x: 1 }

stricter() // fails
stricter({}) // returns { x: 1 } (x itself is an optional default)
```

Most shape builders can also be chained. The [Closed](#closed-builder)
prevents additional properties from being added to an object. To also
make the object required you can use either of these expressions:

```
const { Required, Closed } = Gubu // shape builders are also properties of Gubu
Gubu(Closed({ a: 1, b: 2 }).Required())
Gubu(Required({ a: 1, b: 2 }).Closed())
```

Most shape builders can be composed (check their expected arguments!),
so the following are also equivalent:

```
Gubu(Closed(Required({ a: 1, b: 2 })))
Gubu(Required(Closed({ a: 1, b: 2 })))
```

This flexibility allows you to adjust shapes without too much
refactoring.


### Shape Builder Reference

[API](#api) | 
[Shapes](#shape) | 
[Errors](#errors) | 
[Custom Validation](#custom-validation) |
[Builders](#shape-builder-reference)

The built-in shape builders are:
* [Above](#above-builder): Match a value (or length of value) greater than the given amount.
* [After](#after-builder): Define a custom validation function called after a value is processed.
* [All](#all-builder): All shapes must match value.
* [Any](#any-builder): This shape will match any value.
* [Before](#before-builder): Define a custom validation function called before a value is processed.
* [Below](#below-builder): Match a value (or length of value) less than the given amount.
* [Closed](#closed-builder): Allow only explicitly defined properties in an object.
* [Define](#define-builder): Define a name for a value.
* [Empty](#empty-builder): Allow string values to be empty.
* [Exact](#exact-builder): The value must one of an exact list of values.
* [Max](#max-builder): Match a value (or length of value) less than or equal to the given amount.
* [Min](#min-builder): Match a value (or length of value) greater than or equal to the given amount.
* [Never](#never-builder): This shape will never match anything.
* [One](#one-builder): Exactly one shape (and no more) must match value.
* [Optional](#optional-builder): Make a value explicitly optional (no default created).
* [Refer](#refer-builder): Refer to a defined value by name.
* [Rename](#rename-builder): Rename the key of a property.
* [Required](#required-builder): Make a value required.
* [Some](#some-builder): Some shapes (at least one) must match value.
* [Value](#value-builder): all non-explicit values of an object must match this shape.



---
#### Above Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Above( value: number|string, child?: any )
```

* **Standalone:** `Above(2)`
* **As Parent:** `Above(2, Number)`
* **As Child:** `Optional(Above(2))`
* **Chainable:** `Required(Number).Above(2)`

Only allow values that are above the given value in length. "Length" means:
* Arrays: array length; 
* Strings: string length; 
* Objects: number of keys;
* Numbers: numeric value;
* Object with property `length`: numeric value of `length`;
* Anything else fails.

If the given value is a `string`, then a lexical comparison is made
(thus, `'b'` is above `'a'` as `'b' > 'a'`)


```js
const { Above } = Gubu
let shape = Gubu(Above(2))

shape(3) // PASS: 3 > 2; returns 3
shape(2) // FAIL: throws 'Value "2" for path "" must be above 2 (was 2).'

shape('abc') // PASS: 'abc'.length 3 > 2; returns 'abc'
shape('ab')  // FAIL: 'Value "ab" for path "" must have length above 2 (was 2).'

shape([1, 2, 3]) // PASS: array length 3 > 2; returns [1, 2, 3]
shape([1, 2])    // FAIL: throws: 'Value "[1,2]" for path "" must have length above 2 (was 2).'
```


---
#### After Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
After( validate: Validate, child?: any )
```

* **Standalone:** `After(() => true)`
* **As Parent:** `After({() => true, {x: 1})`
* **As Child:** `Required(After(() => true))`
* **Chainable:** `Optional({x: 1}).After(() => true)`

Provide a validation function that will run after the value has been
processed normally. The validation function has the form:

```
Validate(value: any, update?: Update, state?: State): boolean
```

Return `true` if the value is valid, `false` otherwise. See the 
[Custom Validations](#custom-validation) section.


```js
const { After } = Gubu
let shape = Gubu(After(v => 0 === v%2)) // Pass if value is even

shape(1) // FAIL: 1 is not even
shape(2) // PASS: 2 is even; returns 2
shape()  // PASS: returns undefined

shape = Gubu(After(v => 0 === v.x%2, Required({x: Number})))
shape({x: 1}) // FAIL: 1 is not even
shape({x: 2)) // PASS: 2 is even; returns 2
shape({x: 'X'}) // FAIL: 'X' is not a number
shape({}) // FAIL: x is required
shape() // FAIL: {x: Number} is required
```

See also: [Update](#update-type), [State](#state-type).


---
#### All Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
All( ...children: any[] )
```

* **Standalone:** `All(Number, v => v>10)`
* **As Parent:** INVALID
* **As Child:** `Optional(All({x: 1}, Min(2)))`
* **Chainable:** INVALID

To be valid, the source value must match all of the shapes given as
arguments. All shapes are always evaluated, even if some fail, to
ensure all errors are collected.

This shape builder implicitly creates a [Required](#required-builder)
value. Use the shape builder [Optional](#optional-builder) to make the
value explicitly optional.


```js
const { All } = Gubu
let shape = Gubu(All(Number, v => v>10))

shape(11) // PASS: 11 is a number, and 11 > 10 
shape(9)  // FAIL: 9 is a number, but 9 < 10 
shape()   // FAIL: a value is required (implicitly)

shape = Gubu({ a: Optional(All({ b: String }, Min(2))) })
shape({ a: { b: 'X', c: 1 } }) // PASS: returns same object
shape({}) // PASS: `a` is optional, returns {}
```


---
#### Any Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Any( child?: any )
```

* **Standalone:** `Any`
* **As Parent:** `Any({x: 1})`
* **As Child:** `Required(Any())`
* **Chainable:** `Optional({x: 1}).Any()`

TODO

```js
const { Any } = Gubu
let shape = Gubu(Any())

shape(1) // PASS:
shape(2) // FAIL:

    let shape_AnyB0 = Gubu(Any())
    expect(shape_AnyB0(11)).toEqual(11)
    expect(shape_AnyB0(10)).toEqual(10)
    expect(shape_AnyB0()).toEqual(undefined)
    expect(shape_AnyB0(null)).toEqual(null)
    expect(shape_AnyB0(NaN)).toEqual(NaN)
    expect(shape_AnyB0({})).toEqual({})
    expect(shape_AnyB0([])).toEqual([])
```


---
#### Before Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Before( validate: Validate, child?: any )
```

* **Standalone:** `Before(() => true)`
* **As Parent:** `Before({() => true, {x: 1})`
* **As Child:** `Required(Before(() => true))`
* **Chainable:** `Optional({x: 1}).Before(() => true)`

Provide a validation function that will run before the value has been
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


```js
const { Before } = Gubu
let shape = Gubu(Before(v => 0 === v%2)) // Pass if value is even

shape(1) // FAIL: 1 is not even
shape(2) // PASS: 2 is even; returns 2
shape()  // PASS: returns undefined

shape = Gubu(Before(v => 0 === v.x%2, Required({x: Number})))
shape({x: 1}) // FAIL: 1 is not even
shape({x: 2)) // PASS: 2 is even; returns 2
shape({x: 'X'}) // FAIL: 'X' is not a number
shape({}) // FAIL: x is required
shape() // FAIL: {x: Number} is required
```

See also: [Update](#update-type), [State](#state-type).


---
#### Below Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Below( value: number|string, child?: any )
```

* **Standalone:** `Below(2)`
* **As Parent:** `Below(2, Number)`
* **As Child:** `Optional(Below(2))`
* **Chainable:** `Required(Number).Below(2)`

Only allow values that are below the given value in length. "Length" means:
* Arrays: array length; 
* Strings: string length; 
* Objects: number of keys;
* Numbers: numeric value;
* Object with property `length`: numeric value of `length`;
* Anything else fails.

If the given value is a `string`, then a lexical comparison is made
(thus, `'b'` is below `'a'` as `'b' > 'a'`)


```js
const { Below } = Gubu
let shape = Gubu(Below(2))

shape(1) // PASS: 1 < 2; returns 1
shape(2) // FAIL: throws 'Value "2" for path "" must be below 2 (was 2).'

shape('abc') // PASS: 'abc'.length 1 < 2; returns 'abc' 
shape('ab')  // FAIL: 'Value "ab" for path "" must have length below 2 (was 2).'

shape([1])    // PASS: array length 1 < 2; returns [1]
shape([1, 2]) // FAIL: throws: 'Value "[1, 2]" for path "" must have length below 2 (was 2).'
```


---
#### Closed Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Closed( child?: any )
```

* **Standalone:** `Closed`
* **As Parent:** `Closed({x: 1})`
* **As Child:** `Required(Closed())`
* **Chainable:** `Optional({x: 1}).Closed()`

TODO

```js
const { Closed } = Gubu
let shape = Gubu(Closed())

shape(1) // PASS:
shape(2) // FAIL:

    let shape_ClosedB0 = Gubu(Closed({ a: 11 }))
    expect(shape_ClosedB0({ a: 10 })).toEqual({ a: 10 })
    expect(() => shape_ClosedB0({ a: 10, b: 11 })).toThrow('Validation failed for path "" with value "{a:10,b:11}" because the property "b" is not allowed.')
```


---
#### Define Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Define( child?: any )
```

* **Standalone:** `Define`
* **As Parent:** `Define({x: 1})`
* **As Child:** `Required(Define())`
* **Chainable:** `Optional({x: 1}).Define()`

TODO
depth first order, define before refer

```js
const { Define } = Gubu
let shape = Gubu(Define())

shape(1) // PASS:
shape(2) // FAIL:

    let shape_DefineB0 = Gubu({ a: Define('foo', 11), b: Refer('foo') })
    expect(shape_DefineB0({ a: 10, b: 12 })).toEqual({ a: 10, b: 12 })
    expect(() => shape_DefineB0({ a: 'A', b: 'B' })).toThrow(`Validation failed for path "a" with value "A" because the value is not of type number.
Validation failed for path "b" with value "B" because the value is not of type number.`)
```


---
#### Empty Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Empty( child?: any )
```

* **Standalone:** `Empty`
* **As Parent:** `Empty({x: 1})`
* **As Child:** `Required(Empty())`
* **Chainable:** `Optional({x: 1}).Empty()`

TODO

```js
const { Empty } = Gubu
let shape = Gubu(Empty())

shape(1) // PASS:
shape(2) // FAIL:

    let shape_EmptyB0 = Gubu({ a: Empty(String), b: String })
    expect(shape_EmptyB0({ a: '', b: 'ABC' })).toEqual({ a: '', b: 'ABC' })
    expect(() => shape_EmptyB0({ a: '', b: '' })).toThrow('Validation failed for path "b" with value "" because the value is required.')
```


---
#### Exact Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Exact( child?: any )
```

* **Standalone:** `Exact`
* **As Parent:** `Exact({x: 1})`
* **As Child:** `Required(Exact())`
* **Chainable:** `Optional({x: 1}).Exact()`

TODO

```js
const { Exact } = Gubu
let shape = Gubu(Exact())

shape(1) // PASS:
shape(2) // FAIL:

    let shape_ExactB0 = Gubu(Exact(11, 12, true))
    expect(shape_ExactB0(11)).toEqual(11)
    expect(shape_ExactB0(12)).toEqual(12)
    expect(shape_ExactB0(true)).toEqual(true)
    expect(() => shape_ExactB0(10)).toThrow('Value "10" for path "" must be exactly one of: 11,12,true.')
    expect(() => shape_ExactB0(false)).toThrow('Value "false" for path "" must be exactly one of: 11,12,true.')
```


---
#### Max Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Max( value: number|string, child?: any )
```

* **Standalone:** `Max(2)`
* **As Parent:** `Max(2, Number)`
* **As Child:** `Optional(Max(2))`
* **Chainable:** `Required(Number).Max(2)`

Only allow values that have length greater than or equal to the given
maximum value. "Length" means:
* Arrays: array length; 
* Strings: string length; 
* Objects: number of keys;
* Numbers: numeric value;
* Object with property `length`: numeric value of `length`;
* Anything else fails.

If the given value is a `string`, then a lexical comparison is made
(thus, `'b'` is greater than `'a'` as `'b' > 'a'`)


```js
const { Max } = Gubu
let shape = Gubu(Max(2))

shape(1) // PASS: 1 <= 1; returns 1
shape(2) // PASS: 1 <= 2; returns 2
shape(3) // FAIL: throws 'Value "3" for path "" must be a maximum of 2 (was 3).'

shape('a')   // PASS: 'a'.length 1 <= 2; returns 'a'
shape('ab')  // PASS: 'ab'.length 2 <= 2 ; returns 'ab'
shape('abc') // FAIL: 'Value "abc" for path "" must be a maximum length of 2 (was 3).'

shape([1])       // PASS: array length 1 <= 2; returns [1]
shape([1, 2])    // PASS: array length 2 <= 2; returns [1, 2]
shape([1, 2, 3]) // FAIL: throws: 'Value "[1, 2, 3]" for path "" must be a maximum length of 2 (was 3).'


---
#### Min Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Min( value: number|string, child?: any )
```

* **Standalone:** `Min(2)`
* **As Parent:** `Min(2, Number)`
* **As Child:** `Optional(Min(2))`
* **Chainable:** `Required(Number).Min(2)`

Only allow values that have length greater than or equal to the given
minimum value. "Length" means:
* Arrays: array length; 
* Strings: string length; 
* Objects: number of keys;
* Numbers: numeric value;
* Object with property `length`: numeric value of `length`;
* Anything else fails.

If the given value is a `string`, then a lexical comparison is made
(thus, `'b'` is greater than `'a'` as `'b' > 'a'`)


```js
const { Min } = Gubu
let shape = Gubu(Min(2))

shape(3) // PASS: 3 >= 2; returns 3
shape(2) // PASS: 2 >= 2; returns 2
shape(1) // FAIL: throws 'Value "1" for path "" must be a minimum of 2 (was 1).'

shape('abc') // PASS: 'abc'.length 3 >= 2; returns 'abc'
shape('ab')  // PASS: 'ab'.length 2 >= 2 ; returns 'ab'
shape('a')   // FAIL: 'Value "a" for path "" must be a minimum length of 2 (was 1).'

shape([1, 2, 3]) // PASS: array length 3 >= 2; returns [1, 2, 3]
shape([1, 2])    // PASS: array length 2 >= 2; returns [1, 2]
shape([1])       // FAIL: throws: 'Value "[1]" for path "" must be a minimum length of 2 (was 1).'
```


---
#### Never Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Never( child?: any )
```

* **Standalone:** `Never`
* **As Parent:** `Never({x: 1})`
* **As Child:** `Required(Never())`
* **Chainable:** `Optional({x: 1}).Never()`

TODO

```js
const { Never } = Gubu
let shape = Gubu(Never())

shape(1) // PASS:
shape(2) // FAIL:

    let shape_NeverB0 = Gubu(Never())
    expect(() => shape_NeverB0(10)).toThrow('Validation failed for path "" with value "10" because no value is allowed.')
    expect(() => shape_NeverB0(true)).toThrow('Validation failed for path "" with value "true" because no value is allowed.')
```


---
#### One Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
One( ...children: any[] )
```

* **Standalone:** `One(Number, String)`
* **As Parent:** INVALID
* **As Child:** `Optional(One({x: 1}, {x: 2}))`
* **Chainable:** INVALID

To be valid, the source value must match exactly one of the shapes
given as arguments. All shapes are always evaluated, to ensure all
errors are collected.

This shape builder implicitly creates a [Required](#required-builder)
value. Use the shape builder [Optional](#optional-builder) to make the
value explicitly optional.

To match exact values, use the shape builder [Exact](#exact-builder)
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


---
#### Optional Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Optional( child?: any )
```

* **Standalone:** `Optional`
* **As Parent:** `Optional({x: 1})`
* **As Child:** `Required(Optional())`
* **Chainable:** `Optional({x: 1}).Optional()`

TODO

```js
const { Optional } = Gubu
let shape = Gubu(Optional())

shape(1) // PASS:
shape(2) // FAIL:

    let shape_OptionalB0 = Gubu({ a: Optional(11) })
    expect(shape_OptionalB0({ a: 10 })).toEqual({ a: 10 })
    expect(shape_OptionalB0({})).toEqual({})
```


---
#### Refer Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Refer( child?: any )
```

* **Standalone:** `Refer`
* **As Parent:** `Refer({x: 1})`
* **As Child:** `Required(Refer())`
* **Chainable:** `Optional({x: 1}).Refer()`

TODO
depth first order, define before refer

```js
const { Refer } = Gubu
let shape = Gubu(Refer())

shape(1) // PASS:
shape(2) // FAIL:

    let shape_ReferB0 = Gubu({ a: Define('foo', 11), b: Refer('foo') })
    expect(shape_ReferB0({ a: 10, b: 12 })).toEqual({ a: 10, b: 12 })
    expect(() => shape_ReferB0({ a: 'A', b: 'B' })).toThrow(`Validation failed for path "a" with value "A" because the value is not of type number.
Validation failed for path "b" with value "B" because the value is not of type number.`)
    // TODO: also recursive
```


---
#### Rename Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Rename( child?: any )
```

* **Standalone:** `Rename`
* **As Parent:** `Rename({x: 1})`
* **As Child:** `Required(Rename())`
* **Chainable:** `Optional({x: 1}).Rename()`

TODO

```js
const { Rename } = Gubu
let shape = Gubu(Rename())

shape(1) // PASS:
shape(2) // FAIL:

    let shape_RenameB0 = Gubu({ a: Rename('b', Number) })
    expect(shape_RenameB0({ a: 10 })).toEqual({ b: 10 })
    expect(() => shape_RenameB0({})).toThrow('Validation failed for path "a" with value "" because the value is required.')

    let shape_RenameB1 = Gubu({ a: Rename({ name: 'b', keep: true }, 123) })
    expect(shape_RenameB1({ a: 10 })).toEqual({ a: 10, b: 10 })
    expect(shape_RenameB1({})).toEqual({ a: 123, b: 123 })
```


---
#### Required Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Required( child?: any )
```

* **Standalone:** `Required`
* **As Parent:** `Required({x: 1})`
* **As Child:** `Required(Required())`
* **Chainable:** `Optional({x: 1}).Required()`

TODO

```js
const { Required } = Gubu
let shape = Gubu(Required())

shape(1) // PASS:
shape(2) // FAIL:

    let shape_RequiredB0 = Gubu(Required(11))
    expect(shape_RequiredB0(11)).toEqual(11)
    expect(() => shape_RequiredB0()).toThrow('Validation failed for path "" with value "" because the value is required.')
```


---
#### Some Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Some( ...children: any[] )
```

* **Standalone:** `Some({x: 1}, {y: 2})`
* **As Parent:** INVALID
* **As Child:** `Optional(Some({x: 1}, {y: 2}))`
* **Chainable:** INVALID

To be valid, the source value must match some of the shapes given as
arguments (at least one). All shapes are always evaluated, even if
some fail, to ensure all errors are collected.

This shape builder implicitly creates a [Required](#required-builder)
value. Use the shape builder [Optional](#optional-builder) to make the
value explicitly optional.


```js
const { Some } = Gubu
let shape = Gubu(Some({x: 1}, {y: 2}))

shape({ x: 1 }) // PASS: { x: 1 } matches; returns { x: 1 }
shape({ y: 2 }) // PASS: { y: 2 } matches; returns { y: 2 }
shape({ x: 1, y: 2 }) // PASS: { x: 1, y: 2 } matches; returns { x: 1, y: 2 }
shape({ z: 3 })  // FAIL: does not match { x: 1 } or { y: 2 }
```


---
#### Value Builder
<sub><sup>[builders](#shape-builder-reference) [api](#api) [top](#top)</sup></sub>

```ts
Value( child?: any )
```

* **Standalone:** `Value`
* **As Parent:** `Value({x: 1})`
* **As Child:** `Required(Value())`
* **Chainable:** `Optional({x: 1}).Value()`

TODO

```js
const { Value } = Gubu
let shape = Gubu(Value())

shape(1) // PASS:
shape(2) // FAIL:

    let shape_ValueB0 = Gubu(Value({}, Number))
    expect(shape_ValueB0({ x: 10 })).toEqual({ x: 10 })
    expect(shape_ValueB0({ x: 10, y: 11 })).toEqual({ x: 10, y: 11 })
    expect(() => shape_ValueB0({ x: true })).toThrow('Validation failed for path "x" with value "true" because the value is not of type number.')
    // TODO: with explicits
```



### Custom Builders

You can write your shape builders. A shape builder is a function that
generates the internal [Shape Node](#shape-nodes) data structure,
possibly using parameters.

Here is the actual source code for the [Optional](#optional-builder) shape builder:

```ts
const Optional: Builder = function(this: Node, shape?: any) {
  let node = buildize(this, shape)
  node.r = false

  // Mark Optional as explicit => do not insert empty arrays and objects.
  node.o = true

  return node
}
```

A shape builder function has the form:

```
Builder( options?: any, ...values?: any[] ): Node
```

You can use the utility function `buildize` to create an initial
[Shape Node](#shape-nodes) instance. To make your builder chainable,
pass in the `this` variable (NOTE: not supported in this version, but
please do so anyway to future proof!). To accept a child shape, pass
in the first shape value provided to your `Builder`:

```
const Optional: Builder = function(this: Node, shape?: any) {
  let node = buildize(this, shape)
  ...
```

Once you have a `Node`, you can manipulate it directly:

```
  node.r = false

  // Mark Optional as explicit => do not insert empty arrays and objects.
  node.o = true
```

The `Node` structure is deliberately kept small. Most custom behavior
is implemented using the [Before](#custom-builders) and
[After](#custom-builders) extension hook [Validate](#custom-validation)
functions.

To add your own extension hooks, append `Validate` functions to the
`a` and `b` array properties of the `Node` structure, to add *before*
and *after* hooks, respectively. Here is a custom validator that
capitalizes strings, and then modifies them:

```ts
// NOTE: This example code is TypeScript
const Hyperbole: Builder = function(this: Node, shape0?: any) {
  let node = buildize(this, shape0)

  // Append a before hook  
  node.b.push((v: any, u: Update) => {
    if ('string' === typeof (v)) {
      u.val = v.toUpperCase()
    }
    return true // always pass, just alters strings
  })

  // Append an after hook  
  node.a.push((v: any, u: Update) => {
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

shape = Gubu(Optional(Hyperbole(One(String, Number))))
shape('a') // PASS; returns 'A!'
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

TODO

### Contributing

TODO


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
      allow empty strings (as a required value), use `Empty(String)`. See [Empty
      Strings](#empty-strings).

[^3]: An empty string is not considered to match the `string` type. To
      allow empty strings (as an optional value), use
      `Empty('some-default')` or just `''`. See [Empty
      Strings](#empty-strings).

