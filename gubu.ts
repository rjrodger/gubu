/* Copyright (c) 2021-2022 Richard Rodger and other contributors, MIT License */

// FEATURE: validator on completion of object or array
// FEATURE: support non-index properties on array shape
// FEATURE: state should indicate if value was present, not just undefined
// FEATURE: support custom builder registration so that can chain on builtins
// FEATURE: merge shapes (allows extending given shape - e.g. adding object props)

// TODO: Validation of Builder parameters
// TODO: GubuShape.d is damaged by composition
// TODO: Better stringifys for builder shapes
// TODO: Error messages should state property is missing, not `value ""`
// TODO: node.s can be a lazy function to avoid unnecessary string building
// TODO: Finish Default shape-builder

// DOC: Skip also makes value optional - thus Skip() means any value, or nonexistent
// DOC: Optional


import { inspect } from 'util'


// Package version.
const VERSION = '3.0.0'

// Unique symbol for marking and recognizing Gubu shapes.
const GUBU$ = Symbol.for('gubu$')

// A singleton for fast equality checks.
const GUBU = { gubu$: GUBU$, v$: VERSION }

// A special marker for property abscence.
const GUBU$NIL = Symbol.for('gubu$nil')

// RegExp: first letter is upper case
const UPPER_CASE_FIRST_RE = /^[A-Z]/

// Options for creating a GubuShape.
type Options = {
  name?: string // Name this Gubu shape.
}


// User context for a given Gubu validation run.
// Add your own references here for use in your own custom validations.
// The reserved properties are: `err`.
type Context = Record<string, any> & {
  err?: ErrDesc[] | boolean // Provide an array to collect errors, instead of throwing.
}


// The semantic types recognized by Gubu.
// Not that Gubu considers values to be subtypes.
type ValType =
  'any' |       // Any type.
  'array' |     // An array.
  'bigint' |    // A BigInt value.
  'boolean' |   // The values `true` or `false`.
  'function' |  // A function.
  'instance' |  // An instance of a constructed object.
  'list' |      // A list of types under a given logical rule.
  'nan' |       // The `NaN` value.
  'never' |     // No type.
  'null' |      // The `null` value.
  'number' |    // A number.
  'object' |    // A plain object.
  'string' |    // A string (but *not* the empty string).
  'symbol' |    // A symbol reference.
  'undefined'   // The `undefined` value.


// A node in the validation tree structure.
type Node = {
  $: typeof GUBU         // Special marker to indicate normalized.
  t: ValType             // Value type name.
  d: number              // Depth.
  v: any                 // Defining value (used as default).
  r: boolean             // Value is required.
  p: boolean             // Value is skippable - can be missing or undefined.
  n: number              // Number of keys in default value
  c: any                 // Default child.
  u: Record<string, any> // Custom user meta data
  b: Validate[]          // Custom before validation functions.
  a: Validate[]          // Custom after vaidation functions.
  s?: string             // Custom stringification. 
}


// A validation Node builder.
type Builder = (
  opts?: any,     // Builder options.
  ...vals: any[]  // Values for the builder. 
) =>
  Node & // Builders build Nodes.
  { [name: string]: Builder | any } // Chained builders for convenience.


// Validate a given value, potentially updating the value and state.
type Validate = (val: any, update: Update, state: State) => boolean


// The current validation state.
class State {
  match: boolean = false

  dI: number = 0  // Node depth.
  nI: number = 2  // Next free slot in nodes.
  cI: number = -1 // Pointer to next node.
  pI: number = 0  // Pointer to current node.
  sI: number = -1 // Pointer to next sibling node.

  valType: string = 'never'
  isRoot: boolean = false

  key: string = ''
  type: string = 'never'

  stop: boolean = true
  nextSibling: boolean = true

  fromDefault: boolean = false

  // NOTE: tri-valued; undefined = soft ignore
  ignoreVal: boolean | undefined = undefined

  err: any[] = []
  parents: Node[] = []
  keys: string[] = []
  path: string[] = []

  node: Node

  root: any

  val: any
  parent: any
  nodes: (Node | number)[]
  vals: any[]
  ctx: any
  oval: any

  constructor(
    root: any,
    top: Node,
    ctx?: Context,
    match?: boolean
  ) {
    this.root = root
    this.vals = [root, -1]
    this.node = top
    this.nodes = [top, -1]
    this.ctx = ctx || {}
    this.match = !!match
  }

  next() {
    // Uncomment for debugging (definition below).
    // this.printStacks()

    this.stop = false
    this.fromDefault = false
    this.ignoreVal = undefined
    this.isRoot = 0 === this.pI

    // Dereference the back pointers to ancestor siblings.
    // Only objects|arrays can be nodes, so a number is a back pointer.
    // NOTE: terminates because (+{...} -> NaN, +[] -> 0) -> false (JS wat FTW!)
    let nextNode = this.nodes[this.pI]

    while (+nextNode) {
      this.pI = +nextNode
      nextNode = this.nodes[this.pI]
      this.dI--
    }

    if (!nextNode) {
      this.stop = true
      return
    }
    else {
      this.node = (nextNode as Node)
    }

    this.updateVal(this.vals[this.pI])
    this.key = this.keys[this.pI]

    this.cI = this.pI
    this.sI = this.pI + 1
    this.parent = this.parents[this.pI]

    this.nextSibling = true

    this.type = this.node.t

    this.path[this.dI] = this.key

    this.oval = this.val
  }


  updateVal(val: any) {
    this.val = val
    this.valType = typeof (this.val)
    if ('number' === this.valType && isNaN(this.val)) {
      this.valType = 'nan'
    }
    if (this.isRoot && !this.match) {
      this.root = this.val
    }
  }



  /* Uncomment for debugging.
  printStacks() {
    console.log('\nNODE',
      'd=' + this.dI,
      'c=' + this.cI,
      'p=' + this.pI,
      'n=' + this.nI,
      +this.node,
      this.node.t,
      this.path,
      this.err.length)

    for (let i = 0;
      i < this.nodes.length ||
      i < this.vals.length ||
      i < this.parents.length;
      i++) {
      console.log(i, '\t',
        isNaN(+this.nodes[i]) ?
          this.keys[i] + ':' + (this.nodes[i] as any)?.t :
          +this.nodes[i], '\t',
        stringify(this.vals[i]), '\t',
        stringify(this.parents[i]))
    }
  }
  */
}


// Return updates to the validation state.
type Update = {
  done?: boolean
  val?: any
  uval?: any // Use for undefined and NaN
  node?: Node
  type?: ValType
  nI?: number
  sI?: number
  pI?: number
  err?: string | ErrDesc | ErrDesc[]
  why?: string
}


// Validation error description.
type ErrDesc = {
  k: string  // Key of failing value.
  n: Node    // Failing shape node.
  v: any     // Failing value.
  p: string  // Key path to value.
  w: string  // Error code ("why").
  m: number  // Error mark for debugging.
  t: string  // Error message text.
  u: any     // User custom info.
}


// Custom Error class.
class GubuError extends TypeError {
  gubu = true
  code: string
  desc: () => ({ name: string, code: string, err: ErrDesc[], ctx: any })

  constructor(
    code: string,
    err: ErrDesc[],
    ctx: any,
  ) {
    super(err.map((e: ErrDesc) => e.t).join('\n'))
    let name = 'GubuError'
    let ge = this as unknown as any
    ge.name = name

    this.code = code
    this.desc = () => ({ name, code, err, ctx, })
  }

  toJSON() {
    return {
      ...this,
      err: (this as any).desc().err,
      name: this.name,
      message: this.message,
    }
  }
}


// Identify JavaScript wrapper types by name.
const IS_TYPE: { [name: string]: boolean } = {
  String: true,
  Number: true,
  Boolean: true,
  Object: true,
  Array: true,
  Function: true,
  Symbol: true,
  BigInt: true,
}


// Empty values for each type.
const EMPTY_VAL: { [name: string]: any } = {
  string: '',
  number: 0,
  boolean: false,
  object: {},
  array: [],
  symbol: Symbol(''),
  bigint: BigInt(0),
  null: null,
}


// Normalize a value into a Node.
function nodize(shape?: any, depth?: number): Node {

  // If using builder as property of Gubu, `this` is just Gubu, not a node.
  if (make === shape) {
    shape = undefined
  }

  // Is this a (possibly incomplete) Node?
  else if (null != shape && shape.$?.gubu$) {

    // Assume complete if gubu$ has special internal reference.
    if (GUBU$ === shape.$.gubu$) {
      shape.d = null == depth ? shape.d : depth
      return shape
    }

    // Normalize an incomplete Node, avoiding any recursive calls to norm.
    else if (true === shape.$.gubu$) {
      let node = { ...shape }
      node.$ = { v$: VERSION, ...node.$, gubu$: GUBU$ }

      node.v =
        (null != node.v && 'object' === typeof (node.v)) ? { ...node.v } : node.v

      // Leave as-is: node.c

      node.t = node.t || typeof (node.v)
      if ('function' === node.t && IS_TYPE[node.v.name]) {
        node.t = (node.v.name.toLowerCase() as ValType)
        node.v = clone(EMPTY_VAL[node.t])
      }

      node.r = !!node.r
      node.p = !!node.p
      node.d = null == depth ? null == node.d ? -1 : node.d : depth

      node.b = node.b || []
      node.a = node.a || []

      node.u = node.u || {}

      return node
    }
  }

  // Not a Node, so build one based on value and its type.
  let t: ValType | 'undefined' = (null === shape ? 'null' : typeof (shape))
  t = ('undefined' === t ? 'any' : t) as ValType

  let v = shape
  let c: any = GUBU$NIL
  let r = false // Not required by default.
  let p = false // Only true when Skip builder is used.
  let u: any = {}

  let a: any[] = []
  let b: any[] = []

  if ('object' === t) {
    if (Array.isArray(v)) {
      t = 'array'
      if (1 === v.length) {
        c = v[0]
        v = []
      }
      // Else no child, thus closed.
    }
    else if (
      null != v &&
      Function !== v.constructor &&
      Object !== v.constructor &&
      null != v.constructor
    ) {
      // console.log('QQQB', v, v.constructor)
      t = 'instance'
      u.n = v.constructor.name
      u.i = v.constructor
    }

    else {
      // c = GUBU$NIL

      // Empty object "{}" is considered Open
      if (0 === Object.keys(v).length) {
        c = Any()
      }
    }
  }

  else if ('function' === t) {
    if (IS_TYPE[shape.name]) {
      t = (shape.name.toLowerCase() as ValType)
      r = true
      v = clone(EMPTY_VAL[t])

      // Required "Object" is considered Open
      if ('Object' === shape.name) {
        c = Any()
      }
    }
    else if (v.gubu === GUBU || true === v.$?.gubu) {
      let gs = v.node ? v.node() : v
      t = gs.t
      v = gs.v
      r = gs.r
      u = { ...gs.u }
      a = [...gs.a]
      b = [...gs.b]
    }

    // Instance of a class.
    // Note: uses the convention that a class name is captialized.
    else if (
      'Function' === v.constructor.name &&
      UPPER_CASE_FIRST_RE.test(v.name)
    ) {
      t = 'instance'
      r = true
      u.n = v.prototype?.constructor?.name
      u.i = v
    }
  }
  else if ('number' === t && isNaN(v)) {
    t = 'nan'
  }
  else if ('string' === t && '' === v) {
    u.empty = true
  }

  let vmap = (null != v && ('object' === t || 'array' === t)) ? { ...v } : v

  let node: Node = {
    $: GUBU,
    t,
    v: vmap,
    n: null != vmap && 'object' === typeof (vmap) ? Object.keys(vmap).length : 0,
    c,
    r,
    p,
    d: null == depth ? -1 : depth,
    u,
    a,
    b,
  }

  return node
}


// Create a GubuShape from a shape specification.
function make<S>(intop?: S, inopts?: Options) {
  const opts = null == inopts ? {} : inopts
  opts.name =
    null == opts.name ? 'G' + ('' + Math.random()).substring(2, 8) : '' + opts.name

  let top: Node = nodize(intop, 0)

  function exec(
    root: any,
    ctx?: Context,
    match?: boolean // Suppress errors and return boolean result (true if match)
  ) {
    let s = new State(root, top, ctx, match)

    // Iterative depth-first traversal of the shape using append-only array stacks.
    while (true) {
      s.next()

      if (s.stop) {
        break
      }

      let n = s.node
      let done = false

      // Call Befores
      if (0 < n.b.length) {
        for (let bI = 0; bI < n.b.length; bI++) {
          let update = handleValidate(n.b[bI], s)
          n = s.node
          if (undefined !== update.done) {
            done = update.done
          }
        }
      }

      if (!done) {
        if ('never' === s.type) {
          s.err.push(makeErrImpl('never', s, 1070))
        }
        else if ('object' === s.type) {
          let val
          if (n.r && undefined === s.val) {
            s.ignoreVal = true
            s.err.push(makeErrImpl('required', s, 1010))
          }
          else if (
            undefined !== s.val && (
              null === s.val ||
              'object' !== s.valType ||
              Array.isArray(s.val)
            )
          ) {
            s.err.push(makeErrImpl('type', s, 1020))
            val = Array.isArray(s.val) ? s.val : {}
          }
          else if (!n.p || null != s.val) {
            // Descend into object, constructing child defaults
            s.updateVal(s.val || (s.fromDefault = true, {}))
            val = s.val
          }

          val = null == val && false === s.ctx.err ? {} : val

          if (null != val) {
            let hasKeys = false
            let vkeys = Object.keys(n.v)
            let start = s.nI

            if (0 < vkeys.length) {
              hasKeys = true
              s.pI = start
              for (let k of vkeys) {
                let nvs = n.v[k] = nodize(n.v[k], 1 + s.dI)
                s.nodes[s.nI] = nvs
                s.vals[s.nI] = val[k]
                s.parents[s.nI] = val
                s.keys[s.nI] = k
                s.nI++
              }
            }

            let extra = Object.keys(val).filter(k => undefined === n.v[k])

            if (0 < extra.length) {
              if (GUBU$NIL === n.c) {
                s.ignoreVal = true
                s.err.push(makeErrImpl(
                  'closed', s, 1100, undefined, { k: extra }))
              }
              else {
                hasKeys = true
                s.pI = start
                for (let k of extra) {
                  let nvs = n.c = nodize(n.c, 1 + s.dI)
                  s.nodes[s.nI] = nvs
                  s.vals[s.nI] = val[k]
                  s.parents[s.nI] = val
                  s.keys[s.nI] = k
                  s.nI++
                }
              }
            }

            if (hasKeys) {
              s.dI++
              s.nodes[s.nI++] = s.sI
              s.nextSibling = false
            }
          }
        }

        else if ('array' === s.type) {
          if (n.r && undefined === s.val) {
            s.ignoreVal = true
            s.err.push(makeErrImpl('required', s, 1030))
          }
          else if (undefined !== s.val && !Array.isArray(s.val)) {
            s.err.push(makeErrImpl('type', s, 1040))
          }
          else if (!n.p || null != s.val) {
            s.updateVal(s.val || (s.fromDefault = true, []))

            let hasValueElements = 0 < s.val.length
            let hasChildShape = GUBU$NIL !== n.c
            let elementKeys = Object.keys(n.v).filter(k => !isNaN(+k))
            let hasFixedElements = 0 < elementKeys.length

            if (hasValueElements || hasFixedElements) {
              s.pI = s.nI

              let elementIndex = 0

              // Fixed element array means match shapes at each index only.
              if (hasFixedElements) {
                if (elementKeys.length < s.val.length && !hasChildShape) {
                  s.ignoreVal = true
                  s.err.push(makeErrImpl('closed', s, 1090, undefined,
                    { k: elementKeys.length }))
                }
                else {
                  for (; elementIndex < elementKeys.length; elementIndex++) {
                    let elementShape =
                      n.v[elementIndex] =
                      nodize(n.v[elementIndex], 1 + s.dI)
                    s.nodes[s.nI] = elementShape
                    s.vals[s.nI] = s.val[elementIndex]
                    s.parents[s.nI] = s.val
                    s.keys[s.nI] = '' + elementIndex
                    s.nI++
                  }
                }
              }

              // Single element array shape means 0 or more elements of shape
              if (hasChildShape && hasValueElements) {
                let elementShape: Node = n.c = nodize(n.c, 1 + s.dI)
                for (; elementIndex < s.val.length; elementIndex++) {
                  s.nodes[s.nI] = elementShape
                  s.vals[s.nI] = s.val[elementIndex]
                  s.parents[s.nI] = s.val
                  s.keys[s.nI] = '' + elementIndex
                  s.nI++
                }
              }

              if (!s.ignoreVal) {
                s.dI++
                s.nodes[s.nI++] = s.sI
                s.nextSibling = false
              }
            }
          }
        }

        // Invalid type.
        else if (!(
          'any' === s.type ||
          'list' === s.type ||
          undefined === s.val ||
          s.type === s.valType ||
          ('instance' === s.type && n.u.i && s.val instanceof n.u.i) ||
          ('null' === s.type && null === s.val)
        )) {
          // console.log('QQQA', s.type, s.val, s.valType, n.u)
          s.err.push(makeErrImpl('type', s, 1050))
        }

        // Value itself, or default.
        else if (undefined === s.val) {
          let parentKey = s.path[s.dI]

          if (n.r &&
            ('undefined' !== s.type || !s.parent.hasOwnProperty(parentKey))) {
            s.ignoreVal = true
            s.err.push(makeErrImpl('required', s, 1060))
          }
          else if (
            undefined !== n.v &&
            !n.p ||
            'undefined' === s.type
          ) {
            s.updateVal(n.v)
            s.fromDefault = true
          }
          else if ('any' === s.type) {
            s.ignoreVal = undefined === s.ignoreVal ? true : s.ignoreVal
          }
        }

        // Empty strings fail even if string is optional. Use Empty() to allow.
        else if ('string' === s.type && '' === s.val && !n.u.empty) {
          s.err.push(makeErrImpl('required', s, 1080))
        }
      }

      // Call Afters
      if (0 < n.a.length) {
        for (let aI = 0; aI < n.a.length; aI++) {
          let update = handleValidate(n.a[aI], s)
          n = s.node
          if (undefined !== update.done) {
            done = update.done
          }
        }
      }


      // Explicit ignoreVal overrides Skip
      let ignoreVal = s.node.p ? false === s.ignoreVal ? false : true : !!s.ignoreVal
      let setParent = !s.match && null != s.parent && !done && !ignoreVal

      if (setParent) {
        s.parent[s.key] = s.val
      }

      if (s.nextSibling) {
        s.pI = s.sI
      }
    }

    if (0 < s.err.length) {
      if (Array.isArray(s.ctx.err)) {
        s.ctx.err.push(...s.err)
      }
      else if (!s.match && false !== s.ctx.err) {
        throw new GubuError('shape', s.err, s.ctx)
      }
    }

    return s.match ? 0 === s.err.length : s.root
  }


  function gubuShape<R>(root?: R, ctx?: Context): R & S {
    return (exec(root, ctx, false) as R & S)
  }


  function valid<D>(root?: D, ctx?: Context): root is (D & S) {
    let actx: any = ctx || {}
    actx.err = actx.err || []
    exec(root, actx, false)
    return 0 === actx.err.length
  }
  gubuShape.valid = valid


  gubuShape.match = (root?: any, ctx?: Context): boolean => {
    ctx = ctx || {}
    return (exec(root, ctx, true) as boolean)
  }

  gubuShape.error = (root?: any, ctx?: Context): GubuError[] => {
    let actx: any = ctx || {}
    actx.err = actx.err || []
    exec(root, actx, false)
    return actx.err
  }


  gubuShape.spec = () => {
    // TODO: when c is GUBU$NIL it is not present, should have some indicator value

    // Normalize spec, discard errors.
    gubuShape(undefined, { err: false })
    return JSON.parse(stringify(top, (_key: string, val: any) => {
      if (GUBU$ === val) {
        return true
      }
      return val
    }, false, true))
  }


  gubuShape.node = (): Node => {
    gubuShape.spec()
    return top
  }


  let desc: string = ''
  gubuShape.toString = () => {
    desc = truncate('' === desc ?
      stringify(
        (
          top &&
          top.$ &&
          (GUBU$ === top.$.gubu$ || true === (top.$ as any).gubu$)
        ) ? top.v : top) :
      desc)
    return `[Gubu ${opts.name} ${desc}]`
  }

  if (inspect && inspect.custom) {
    (gubuShape as any)[inspect.custom] = gubuShape.toString
  }


  gubuShape.gubu = GUBU

  return gubuShape
}


function handleValidate(vf: Validate, s: State): Update {
  let update: Update = {}

  let valid = false
  let thrown

  try {
    // Check does not have to deal with `undefined`
    valid = undefined === s.val && ((vf as any).gubu$?.Check) ? true :
      vf(s.val, update, s)
  }
  catch (ve: any) {
    thrown = ve
  }

  let hasErrs = Array.isArray(update.err) ? 0 < update.err.length : null != update.err

  if (!valid || hasErrs) {

    // Skip allows undefined
    if (undefined === s.val && (s.node.p || !s.node.r) && true !== update.done) {
      delete update.err
      return update
    }

    let w = update.why || 'check' // 'custom'
    let p = pathstr(s)

    if ('string' === typeof (update.err)) {
      s.err.push(makeErr(s, update.err))
    }
    else if ('object' === typeof (update.err)) {
      // Assumes makeErr already called
      s.err.push(...[update.err].flat().map(e => {
        e.p = null == e.p ? p : e.p
        e.m = null == e.m ? 2010 : e.m
        return e
      }))
    }
    else {
      let fname = vf.name
      if (null == fname || '' == fname) {
        fname = truncate(vf.toString().replace(/[ \t\r\n]+/g, ' '))
      }
      s.err.push(makeErrImpl(
        w, s, 1045, undefined, { thrown }, fname))
    }

    update.done = null == update.done ? true : update.done
  }

  // Use uval for undefined and NaN
  if (update.hasOwnProperty('uval')) {
    s.updateVal(update.uval)
    s.ignoreVal = false
  }
  else if (undefined !== update.val && !Number.isNaN(update.val)) {
    s.updateVal(update.val)
    s.ignoreVal = false
  }

  if (undefined !== update.node) {
    s.node = update.node
  }

  if (undefined !== update.type) {
    s.type = update.type
  }

  return update
}


// Create string description of property path, using "dot notation".
function pathstr(s: State) {
  return s.path.slice(1, s.dI + 1).filter(p => null != p).join('.')
}


const Required: Builder = function(this: Node, shape?: any) {
  let node = buildize(this, shape)
  node.r = true
  node.p = false

  // Handle an explicit undefined.
  if (undefined === shape && 1 === arguments.length) {
    node.t = 'undefined'
    node.v = undefined
  }

  return node
}


const Optional: Builder = function(this: Node, shape?: any) {
  let node = buildize(this, shape)
  node.r = false

  // Handle an explicit undefined.
  if (undefined === shape && 1 === arguments.length) {
    node.t = 'undefined'
    node.v = undefined
  }
  return node
}


const Skip: Builder = function(this: Node, shape?: any) {
  let node = buildize(this, shape)
  node.r = false

  // Do not insert empty arrays and objects.
  node.p = true

  return node
}


const Func: Builder = function(this: Node, shape?: any) {
  let node = buildize(this)
  node.t = 'function'
  node.v = shape
  return node
}


// FINISH
// const Default: Builder = function(this: Node, dval?: any, shape?: any) {
//   let hasDefaultValue = 2 === arguments.length
//   shape = hasDefaultValue ? shape : dval

//   let node = buildize(this, shape)
//   node.r = false

//   if (hasDefaultValue) {
//     node.f = dval
//   }

//   // Always insert default.
//   node.p = false

//   return node
// }



const Empty: Builder = function(this: Node, shape?: any) {
  let node = buildize(this, shape)
  node.u.empty = true
  return node
}



// Value provides default.
const Any: Builder = function(this: Node, shape?: any) {
  let node = buildize(this, shape)
  node.t = 'any'
  if (undefined !== shape) {
    node.v = shape
  }
  return node
}


const Never: Builder = function(this: Node, shape?: any) {
  let node = buildize(this, shape)
  node.t = 'never'
  return node
}


// Pass only if all match. Does not short circuit (as defaults may be missed).
const All: Builder = function(this: Node, ...inshapes: any[]) {
  let node = buildize()
  node.t = 'list'
  node.r = true

  let shapes = inshapes.map(s => Gubu(s))
  node.u.list = inshapes

  node.b.push(function All(val: any, update: Update, state: State) {
    let pass = true

    // let err: any = []
    for (let shape of shapes) {
      let subctx = { ...state.ctx, err: [] }
      shape(val, subctx)
      if (0 < subctx.err.length) {
        pass = false
      }
    }

    if (!pass) {
      update.why = 'all'
      update.err = [
        makeErr(state,
          `Value "$VALUE" for property "$PATH" does not satisfy all of: ` +
          `${inshapes.map(x => stringify(x, null, true)).join(', ')}`)
      ]
    }

    return pass
  })

  return node
}


// Pass if some match.
// TODO: UDPATE DOC: Does not short circuit (as defaults may be missed).
const Some: Builder = function(this: Node, ...inshapes: any[]) {
  let node = buildize()
  node.t = 'list'
  node.r = true

  let shapes = inshapes.map(s => Gubu(s))
  node.u.list = inshapes

  node.b.push(function Some(val: any, update: Update, state: State) {
    let pass = false

    for (let shape of shapes) {
      let subctx = { ...state.ctx, err: [] }
      let match = shape.match(val, subctx)

      if (match) {
        update.val = shape(val, subctx)
      }

      pass ||= match
    }

    if (!pass) {
      update.why = 'some'
      update.err = [
        makeErr(state,
          `Value "$VALUE" for property "$PATH" does not satisfy any of: ` +
          `${inshapes.map(x => stringify(x, null, true)).join(', ')}`)
      ]
    }

    return pass
  })

  return node
}


// Pass if exactly one matches. Does not short circuit (as defaults may be missed).
const One: Builder = function(this: Node, ...inshapes: any[]) {
  let node = buildize()
  node.t = 'list'
  node.r = true

  let shapes = inshapes.map(s => Gubu(s))
  node.u.list = inshapes

  node.b.push(function One(val: any, update: Update, state: State) {
    let passN = 0

    for (let shape of shapes) {
      let subctx = { ...state.ctx, err: [] }
      if (shape.match(val, subctx)) {
        passN++
        update.val = shape(val, subctx)
        // TODO: update docs - short circuits!
        break
      }
    }

    if (1 !== passN) {
      update.why = 'one'
      update.err = [
        makeErr(state,
          `Value "$VALUE" for property "$PATH" does not satisfy one of: ` +
          `${inshapes.map(x => stringify(x, null, true)).join(', ')}`)
      ]
    }

    return true
  })

  return node
}


const Exact: Builder = function(this: Node, ...vals: any[]) {
  let node = buildize()

  node.b.push(function Exact(val: any, update: Update, state: State) {
    for (let i = 0; i < vals.length; i++) {
      if (val === vals[i]) {
        return true
      }
    }

    update.err =
      makeErr(state,
        `Value "$VALUE" for property "$PATH" must be exactly one of: ` +
        `${state.node.s}.`
      )

    update.done = true

    return false
  })
  node.s = vals.map(v => stringify(v, null, true)).join(', ')

  return node
}


const Before: Builder = function(this: Node, validate: Validate, shape?: any) {
  let node = buildize(this, shape)
  node.b.push(validate)
  return node
}


const After: Builder = function(this: Node, validate: Validate, shape?: any) {
  let node = buildize(this, shape)
  node.a.push(validate)
  return node
}


const Check: Builder = function(
  this: Node,
  check: Validate | RegExp | string,
  shape?: any
) {
  let node = buildize(this, shape)

  if ('function' === typeof check) {
    let c$ = check as any
    c$.gubu$ = c$.gubu$ || {}
    c$.gubu$.Check = true

    node.b.push(check)
    node.s = (null == node.s ? '' : node.s + ';') + stringify(check, null, true)
    node.r = true
  }
  else if ('object' === typeof check) {
    let dstr = Object.prototype.toString.call(check)
    if (dstr.includes('RegExp')) {
      let refn = (v: any) =>
        (null == v || Number.isNaN(v)) ? false : !!String(v).match(check)
      Object.defineProperty(refn, 'name', {
        value: String(check)
      })
      Object.defineProperty(refn, 'gubu$', { value: { Check: true } })
      node.b.push(refn)
      node.s = stringify(check)
      node.r = true
    }
  }
  // string is type name.
  // TODO: validate check is ValType
  else if ('string' === typeof check) {
    node.t = check as ValType
    node.r = true
  }

  return node
}


const Open: Builder = function(this: Node, shape?: any) {
  let node = buildize(this, shape)
  node.c = Any()
  return node
}


const Closed: Builder = function(this: Node, shape?: any) {
  let node = buildize(this, shape)

  // Makes one element array fixed.
  if ('array' === node.t && GUBU$NIL !== node.c && 0 === node.n) {
    node.v = [node.c]
    node.c = GUBU$NIL
  }
  else {
    node.c = GUBU$NIL
  }

  return node
}


const Define: Builder = function(this: Node, inopts: any, shape?: any): Node {
  let node = buildize(this, shape)

  let opts = 'object' === typeof inopts ? inopts || {} : {}
  let name = 'string' === typeof inopts ? inopts : opts.name


  if (null != name && '' != name) {
    node.b.push(function Define(_val: any, _update: Update, state: State) {
      let ref = state.ctx.ref = state.ctx.ref || {}
      ref[name] = state.node
      return true
    })
  }

  return node
}


// TODO: copy option to copy value instead of node - need index of value in stack
const Refer: Builder = function(this: Node, inopts: any, shape?: any): Node {
  let node = buildize(this, shape)

  let opts = 'object' === typeof inopts ? inopts || {} : {}
  let name = 'string' === typeof inopts ? inopts : opts.name

  // Fill should be false (the default) if used recursively, to prevent loops.
  let fill = !!opts.fill

  if (null != name && '' != name) {
    node.b.push(function Refer(val: any, update: Update, state: State) {
      if (undefined !== val || fill) {
        let ref = state.ctx.ref = state.ctx.ref || {}

        if (undefined !== ref[name]) {
          let node = { ...ref[name] }
          node.t = node.t || 'never'

          update.node = node
          update.type = node.t

        }
      }

      // TODO: option to fail if ref not found?
      return true
    })
  }

  return node
}


// TODO: no mutate is State.match
const Rename: Builder = function(this: Node, inopts: any, shape?: any): Node {
  let node = buildize(this, shape)

  let opts = 'object' === typeof inopts ? inopts || {} : {}
  let name = 'string' === typeof inopts ? inopts : opts.name
  let keep = 'boolean' === typeof opts.keep ? opts.keep : undefined

  // NOTE: Rename claims are experimental.
  let claim = Array.isArray(opts.claim) ? opts.claim : []

  if (null != name && '' != name) {

    // If there is a claim, grab the value so that validations
    // can be applied to it.
    let before = (val: any, update: Update, s: State) => {
      if (undefined === val && 0 < claim.length) {
        s.ctx.Rename = (s.ctx.Rename || {})
        s.ctx.Rename.fromDefault = (s.ctx.Rename.fromDefault || {})

        for (let cn of claim) {
          let fromDefault = s.ctx.Rename.fromDefault[cn] || {}

          // Only use claim if it was not a default value.
          if (undefined !== s.parent[cn] && !fromDefault.yes) {
            update.val = s.parent[cn]
            if (!s.match) {
              s.parent[name] = update.val
            }
            update.node = fromDefault.node

            // Old errors on the claimed value are no longer valid.
            for (let eI = 0; eI < s.err.length; eI++) {
              if (s.err[eI].k === fromDefault.key) {
                s.err.splice(eI, 1)
                eI--
              }
            }

            if (!keep) {
              delete s.parent[cn]
            }
            else {
              let j = s.cI + 1

              // Add the default to the end of the node set to ensure it
              // is properly validated.
              s.nodes.splice(j, 0, nodize(fromDefault.dval))
              s.vals.splice(j, 0, undefined)
              s.parents.splice(j, 0, s.parent)
              s.keys.splice(j, 0, cn)
              s.nI++
              s.pI++
            }

            break
          }
        }

        if (undefined === update.val) {
          update.val = s.node.v
        }

      }
      return true
    }
    Object.defineProperty(before, 'name', { value: 'Rename:' + name })
    node.b.push(before)

    let after = (val: any, update: Update, s: State) => {
      s.parent[name] = val

      if (!s.match &&
        !keep &&
        s.key !== name &&
        // Arrays require explicit deletion as validation is based on index
        // and will be lost.
        !(Array.isArray(s.parent) && false !== keep)
      ) {
        delete s.parent[s.key]
        update.done = true
      }

      s.ctx.Rename = (s.ctx.Rename || {})
      s.ctx.Rename.fromDefault = (s.ctx.Rename.fromDefault || {})
      s.ctx.Rename.fromDefault[name] = {
        yes: s.fromDefault,
        key: s.key,
        dval: s.node.v,
        node: s.node
      }

      return true
    }
    Object.defineProperty(after, 'name', { value: 'Rename:' + name })
    node.a.push(after)
  }

  return node
}


function valueLen(val: any) {
  return 'number' === typeof (val) ? val :
    'number' === typeof (val?.length) ? val.length :
      null != val && 'object' === typeof (val) ? Object.keys(val).length :
        NaN
}


function truncate(str?: string, len?: number): string {
  let strval = String(str)
  let outlen = null == len || isNaN(len) ? 30 : len < 0 ? 0 : ~~len
  let strlen = null == str ? 0 : strval.length
  let substr = null == str ? '' : strval.substring(0, strlen)
  substr = outlen < strlen ? substr.substring(0, outlen - 3) + '...' : substr
  return substr.substring(0, outlen)
}



const Min: Builder = function(
  this: Node,
  min: number | string,
  shape?: any
): Node {
  let node = buildize(this, shape)

  node.b.push(function Min(val: any, update: Update, state: State) {
    let vlen = valueLen(val)

    if (min <= vlen) {
      return true
    }

    let errmsgpart = 'number' === typeof (val) ? '' : 'length '
    update.err =
      makeErr(state,
        `Value "$VALUE" for property "$PATH" must be a minimum ${errmsgpart}of ${min} (was ${vlen}).`)
    return false
  })

  node.s = 'Min(' + min + (null == shape ? '' : (',' + stringify(shape))) + ')'

  return node
}


const Max: Builder = function(
  this: Node,
  max: number | string,
  shape?: any
): Node {
  let node = buildize(this, shape)

  node.b.push(function Max(val: any, update: Update, state: State) {
    let vlen = valueLen(val)

    if (vlen <= max) {
      return true
    }

    let errmsgpart = 'number' === typeof (val) ? '' : 'length '
    update.err =
      makeErr(state,
        `Value "$VALUE" for property "$PATH" must be a maximum ${errmsgpart}of ${max} (was ${vlen}).`)
    return false
  })

  node.s = 'Max(' + max + (null == shape ? '' : (',' + stringify(shape))) + ')'

  return node
}


const Above: Builder = function(
  this: Node,
  above: number | string,
  shape?: any
): Node {
  let node = buildize(this, shape)

  node.b.push(function Above(val: any, update: Update, state: State) {
    let vlen = valueLen(val)

    if (above < vlen) {
      return true
    }

    let errmsgpart = 'number' === typeof (val) ? 'be' : 'have length'
    update.err =
      makeErr(state,
        `Value "$VALUE" for property "$PATH" must ${errmsgpart} above ${above} (was ${vlen}).`)
    return false
  })

  node.s = 'Above(' + above + (null == shape ? '' : (',' + stringify(shape))) + ')'

  return node
}


const Below: Builder = function(
  this: Node,
  below: number | string,
  shape?: any
): Node {
  let node = buildize(this, shape)

  node.b.push(function Below(val: any, update: Update, state: State) {
    let vlen = valueLen(val)

    if (vlen < below) {
      return true
    }

    let errmsgpart = 'number' === typeof (val) ? 'be' : 'have length'
    update.err =
      makeErr(state,
        `Value "$VALUE" for property "$PATH" must ${errmsgpart} below ${below} (was ${vlen}).`)
    return false
  })

  node.s = 'Below(' + below + (null == shape ? '' : (',' + stringify(shape))) + ')'

  return node
}


const Value: Builder = function(
  this: Node,
  value?: any,
  shape?: any
): Node {
  let node = undefined == shape ? buildize(this) : buildize(shape)
  let child = nodize(value)
  node.c = child
  return node
}


function buildize(node0?: any, node1?: any): Node {
  // Detect chaining. If not chained, ignore `this` if it is the global context.
  let node =
    nodize(null == node0 || node0.window === node0 || node0.global === node0
      ? node1 : node0)

  // NOTE: One, Some, All not chainable.
  return Object.assign(node, {
    Above,
    After,
    Any,
    Before,
    Below,
    Check,
    Closed,
    Open,
    Define,
    Empty,
    Exact,
    Max,
    Min,
    Never,
    Refer,
    Rename,
    Required,
    Skip,
    Value,
  })
}


// External utility to make ErrDesc objects.
function makeErr(state: State, text?: string, why?: string, user?: any) {
  return makeErrImpl(
    why || 'check',
    state,
    4000,
    text,
    user,
  )
}


// TODO: optional message prefix from ctx
// Internal utility to make ErrDesc objects.
function makeErrImpl(
  why: string,
  s: State,
  mark: number,
  text?: string,
  user?: any,
  fname?: string,
): ErrDesc {
  let err: ErrDesc = {
    k: s.key,
    n: s.node,
    v: s.val,
    p: pathstr(s),
    w: why,
    m: mark,
    t: '',
    u: user || {},
  }

  let jstr = undefined === s.val ? '' : stringify(s.val)
  let valstr = truncate(jstr.replace(/"/g, ''))

  if (null == text || '' === text) {
    let valkind = valstr.startsWith('[') ? 'array' :
      valstr.startsWith('{') ? 'object' : 'value'
    let propkind = (valstr.startsWith('[') || Array.isArray(s.parents[s.pI])) ?
      'index' : 'property'
    let propkindverb = 'is'
    let propkey = user?.k

    propkey = Array.isArray(propkey) ?
      (propkind = (1 < propkey.length ?
        (propkindverb = 'are', 'properties') : propkind),
        propkey.join(', ')) :
      propkey

    err.t = `Validation failed for ` +
      (0 < err.p.length ? `${propkind} "${err.p}" with ` : '') +
      `${valkind} "${valstr}" because ` +

      ('type' === why ? (
        'instance' === s.node.t ?
          `the ${valkind} is not an instance of ${s.node.u.n} ` :
          `the ${valkind} is not of type ${s.node.t}`) :
        'required' === why ? ('' === s.val ? 'an empty string is not allowed' :
          `the ${valkind} is required`) :
          'closed' === why ?
            `the ${propkind} "${propkey}" ${propkindverb} not allowed` :
            'never' === why ? 'no value is allowed' :
              `check "${null == fname ? why : fname}" failed`) +
      (err.u.thrown ? ' (threw: ' + err.u.thrown.message + ')' : '.')
  }
  else {
    err.t = text
      .replace(/\$VALUE/g, valstr)
      .replace(/\$PATH/g, err.p)
  }

  return err
}


function node2str(n: Node): string {
  return (null != n.s && '' !== n.s) ? n.s :
    (!n.r && undefined !== n.v) ? n.v : n.t
}


function stringify(src: any, replacer?: any, dequote?: boolean, expand?: boolean) {
  let str: string

  if (!expand &&
    src && src.$ && (GUBU$ === src.$.gubu$ || true === (src.$ as any).gubu$)) {
    src = node2str(src)
  }

  try {
    str = JSON.stringify(src, (key: any, val: any) => {
      if (replacer) {
        val = replacer(key, val)
      }

      if (
        null != val &&
        'object' === typeof (val) &&
        val.constructor &&
        'Object' !== val.constructor.name &&
        'Array' !== val.constructor.name
      ) {
        val =
          'function' === typeof val.toString ? val.toString() : val.constructor.name
      }
      else if ('function' === typeof (val)) {
        if ('function' === typeof ((make as any)[val.name]) && isNaN(+key)) {
          val = undefined
        }
        else if (null != val.name && '' !== val.name) {
          val = val.name
        }
        else {
          val = truncate(val.toString().replace(/[ \t\r\n]+/g, ' '))
        }
      }
      else if ('bigint' === typeof (val)) {
        val = String(val.toString())
      }
      else if (Number.isNaN(val)) {
        return 'NaN'
      }
      else if (true !== expand &&
        (true === val?.$?.gubu$ || GUBU$ === val?.$?.gubu$)) {
        val = node2str(val)
      }

      return val
    })

    str = String(str)
  }
  catch (e: any) {
    str = JSON.stringify(String(src))
  }

  if (true === dequote) {
    str = str.replace(/^"/, '').replace(/"$/, '')
  }

  return str
}


function clone(x: any) {
  return null == x ? x : 'object' !== typeof (x) ? x : JSON.parse(JSON.stringify(x))
}





type GubuShape = ReturnType<typeof make> &
{
  valid: <D, S>(root?: D, ctx?: any) => root is (D & S),
  match: (root?: any, ctx?: any) => boolean,
  error: (root?: any, ctx?: Context) => GubuError[],
  spec: () => any,
  node: () => Node,
  gubu: typeof GUBU
}



const G$ = (node: any): Node => nodize({ ...node, $: { gubu$: true } })


// Fix builder names after terser mangles them.
/* istanbul ignore next */
if ('undefined' !== typeof (window)) {
  let builds: { b: Builder, n: string }[] = [

    { b: Above, n: 'Above' },
    { b: After, n: 'After' },
    { b: All, n: 'All' },
    { b: Any, n: 'Any' },
    { b: Before, n: 'Before' },
    { b: Below, n: 'Below' },
    { b: Check, n: 'Check' },
    { b: Closed, n: 'Closed' },
    { b: Define, n: 'Define' },
    { b: Empty, n: 'Empty' },
    { b: Exact, n: 'Exact' },
    { b: Func, n: 'Func' },
    { b: Max, n: 'Max' },
    { b: Min, n: 'Min' },
    { b: Never, n: 'Never' },
    { b: One, n: 'One' },
    { b: Open, n: 'Open' },
    { b: Optional, n: 'Optional' },
    { b: Refer, n: 'Refer' },
    { b: Rename, n: 'Rename' },
    { b: Required, n: 'Required' },
    { b: Skip, n: 'Skip' },
    { b: Some, n: 'Some' },
    { b: Value, n: 'Value' },

  ]
  for (let build of builds) {
    Object.defineProperty(build.b, 'name', { value: build.n })
  }
}


Object.assign(make, {

  Above,
  After,
  All,
  Any,
  Before,
  Below,
  Check,
  Closed,
  Define,
  Empty,
  Exact,
  Func,
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
  Value,

  GAbove: Above,
  GAfter: After,
  GAll: All,
  GAny: Any,
  GBefore: Before,
  GBelow: Below,
  GCheck: Check,
  GClosed: Closed,
  GDefine: Define,
  GEmpty: Empty,
  GExact: Exact,
  GFunc: Func,
  GMax: Max,
  GMin: Min,
  GNever: Never,
  GOne: One,
  GOpen: Open,
  GOptional: Optional,
  GRefer: Refer,
  GRename: Rename,
  GRequired: Required,
  GSkip: Skip,
  GSome: Some,
  GValue: Value,

  G$,
  buildize,
  makeErr,
  stringify,
  truncate,
  nodize,
})


type Gubu = typeof make & {
  G$: typeof G$,
  buildize: typeof buildize,
  makeErr: typeof makeErr,
  stringify: typeof stringify,
  truncate: typeof truncate,
  nodize: typeof nodize,

  Above: typeof Above
  After: typeof After
  All: typeof All
  Any: typeof Any
  Before: typeof Before
  Below: typeof Below
  Check: typeof Check
  Closed: typeof Closed
  Define: typeof Define
  Empty: typeof Empty
  Exact: typeof Exact
  Func: typeof Func
  Max: typeof Max
  Min: typeof Min
  Never: typeof Never
  One: typeof One
  Open: typeof Open
  Optional: typeof Optional
  Refer: typeof Refer
  Rename: typeof Rename
  Required: typeof Required
  Skip: typeof Skip
  Some: typeof Some
  Value: typeof Value

  GAbove: typeof Above
  GAfter: typeof After
  GAll: typeof All
  GAny: typeof Any
  GBefore: typeof Before
  GBelow: typeof Below
  GCheck: typeof Check
  GClosed: typeof Closed
  GDefine: typeof Define
  GEmpty: typeof Empty
  GExact: typeof Exact
  GFunc: typeof Func
  GMax: typeof Max
  GMin: typeof Min
  GNever: typeof Never
  GOne: typeof One
  GOpen: typeof Open
  GOptional: typeof Optional
  GRefer: typeof Refer
  GRename: typeof Rename
  GRequired: typeof Required
  GSkip: typeof Skip
  GSome: typeof Some
  GValue: typeof Value
}

Object.defineProperty(make, 'name', { value: 'gubu' })


// The primary export.
const Gubu: Gubu = (make as Gubu)


// "G" Namespaced builders for convenient use in case of conflicts.
const GAbove = Above
const GAfter = After
const GAll = All
const GAny = Any
const GBefore = Before
const GBelow = Below
const GCheck = Check
const GClosed = Closed
const GDefine = Define
const GEmpty = Empty
const GExact = Exact
const GFunc = Func
const GMax = Max
const GMin = Min
const GNever = Never
const GOne = One
const GOpen = Open
const GOptional = Optional
const GRefer = Refer
const GRename = Rename
const GRequired = Required
const GSkip = Skip
const GSome = Some
const GValue = Value


export type {
  Validate,
  Update,
  Context,
  Builder,
  Node,
  State,
  GubuShape,
}

export {
  Gubu,
  G$,
  nodize,
  buildize,
  makeErr,
  stringify,
  truncate,

  Above,
  After,
  All,
  Any,
  Before,
  Below,
  Check,
  Closed,
  Define,
  Empty,
  Exact,
  Func,
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
  Value,

  GAbove,
  GAfter,
  GAll,
  GAny,
  GBefore,
  GBelow,
  GCheck,
  GClosed,
  GDefine,
  GEmpty,
  GExact,
  GFunc,
  GMax,
  GMin,
  GNever,
  GOne,
  GOpen,
  GOptional,
  GRefer,
  GRename,
  GRequired,
  GSkip,
  GSome,
  GValue,
}

