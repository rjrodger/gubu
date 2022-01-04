/* Copyright (c) 2021-2022 Richard Rodger and other contributors, MIT License */


// TODO: spread shape for all object values:  Value(vshape)
// TODO: validator on completion of object or array

import { inspect } from 'util'
import Pkg from './package.json'


const GUBU$ = Symbol.for('gubu$')
const GUBU = { gubu$: GUBU$, v$: Pkg.version }


// Options for creating a GubuShape.
type Options = {
  name?: string // Name this Gubu shape.
}


// User context for a given Gubu validation run.
// Add your own references here for use in your own custom validations.
// The reserved properties are: `err`.
type Context = Record<string, any> & {
  err?: ErrDesc[] // Provide an array to collect errors, instead of throwing.
}


// The semantic types recognized by Gubu.
// Not that Gubu considers values to be subtypes.
type ValType =
  'any' |       // Any type.
  'array' |     // An array.
  'bigint' |    // A BigInt value.
  'boolean' |   // The values `true` or `false`.
  'custom' |    // Custom type defined by a validation function.
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
  v: any                 // Default value.
  r: boolean             // Value is required.
  o: boolean             // Value is explicitly optional.
  k: string              // Key of this node.
  u: Record<string, any> // Custom meta data
  b: Validate[]          // Custom before validation functions.
  a: Validate[]          // Custom after vaidation functions.
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
  dI: number = 0  // Node depth.
  nI: number = 2  // Next free slot in nodes.
  pI: number = 0  // Pointer to current node.
  sI: number = -1 // Pointer to next sibling node.
  pass: boolean = true
  err: any[] = []
  terr: any[] = []
  nextSibling: boolean = true

  node: Node
  key: string
  val: any
  parent: any
  nodes: (Node | number)[]
  srcs: any[]
  parents: Node[]
  path: string[]
  ctx: any
  oval: any

  constructor(
    root: any,
    top: Node,
    ctx: Context,
  ) {
    this.srcs = [root, -1]
    this.node = top
    this.nodes = [top, -1]
    this.parents = []
    this.path = []
    this.key = top.k
    this.ctx = ctx
  }
}


// Return updates to the validation state.
type Update = {
  pass: boolean
  done?: boolean
  val?: any
  node?: Node
  type?: ValType
  nI?: number
  sI?: number
  pI?: number
  err?: boolean | ErrDesc | ErrDesc[]
  why?: string
}


// Validation error description.
type ErrDesc = {
  n: Node    // Failing spec node.
  s: any        // Failing src value.
  p: string     // Key path to src value.
  w: string     // Error code ("why").
  m: number     // Error mark for debugging.
  t: string     // Error message text.
}


class GubuError extends TypeError {
  constructor(
    code: string,
    err: ErrDesc[],
    ctx: any,
  ) {
    let message = err.map((e: ErrDesc) => e.t).join('\n')
    super(message)
    let name = 'GubuError'
    let ge = this as unknown as any
    ge.gubu = true
    ge.name = name
    ge.code = code
    ge.desc = () => ({ name, code, err, ctx, })
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


const EMPTY_VAL: { [name: string]: any } = {
  string: '',
  number: 0,
  boolean: false,
  object: {},
  array: [],
  function: () => undefined,
  symbol: Symbol(''),
  bigint: BigInt(0),
  null: null,
}


function norm(spec?: any): Node {

  // Is this a (possibly incomplete) ValSpec?
  if (null != spec && spec.$?.gubu$) {

    // Assume complete if gubu$ has special internal reference.
    if (GUBU$ === spec.$.gubu$) {
      return spec
    }

    // Normalize an incomplete ValSpec, avoiding any recursive calls to norm.
    else if (true === spec.$.gubu$) {
      let vs = { ...spec }
      vs.$ = { v$: Pkg.version, ...vs.$, gubu$: GUBU$ }

      vs.v = (null != vs.v && 'object' === typeof (vs.v)) ? { ...vs.v } : vs.v

      vs.t = vs.t || typeof (vs.v)
      if ('function' === vs.t && IS_TYPE[vs.v.name]) {
        vs.t = (vs.v.name.toLowerCase() as ValType)
        vs.v = clone(EMPTY_VAL[vs.t])
      }

      vs.k = null == vs.k ? '' : vs.k
      vs.r = !!vs.r
      vs.o = !!vs.o
      vs.d = null == vs.d ? -1 : vs.d

      vs.b = vs.b || []
      vs.a = vs.a || []

      vs.u = vs.u || {}
      if (vs.u.list?.specs) {
        vs.u.list.specs = [...vs.u.list.specs]
      }

      return vs
    }
  }

  // Not a ValSpec, so build one based on value and its type.
  let t: ValType | 'undefined' = (null === spec ? 'null' : typeof (spec))
  t = ('undefined' === t ? 'any' : t) as ValType

  let v = spec
  let r = false // Optional by default.
  let o = false // Only true when Optional builder is used.
  let b = undefined
  let u: any = {}

  if ('object' === t) {
    if (Array.isArray(spec)) {
      t = 'array'
    }
    else if (
      null != v &&
      Function !== v.constructor &&
      Object !== v.constructor &&
      null != v.constructor
    ) {
      t = 'instance'
      u.n = v.constructor.name
      u.i = v.constructor
    }
  }

  else if ('function' === t) {
    if (IS_TYPE[spec.name]) {
      t = (spec.name.toLowerCase() as ValType)
      r = true
      v = clone(EMPTY_VAL[t])
    }
    else if (spec.gubu === GUBU || true === spec.$?.gubu) {
      let gs = spec.spec ? spec.spec() : spec
      t = (gs as Node).t
      v = gs.v
      r = gs.r
      u = gs.u
    }
    else if (
      (undefined === spec.prototype && Function === spec.constructor) ||
      Function === spec.prototype?.constructor
    ) {
      t = 'custom'
      b = v
    }
    else {
      t = 'instance'
      r = true
      u.n = v.prototype?.constructor?.name
      u.i = v
    }
  }
  else if ('number' === t && isNaN(v)) {
    t = 'nan'
  }

  let vs: Node = {
    $: GUBU,
    t,
    v: (null != v && ('object' === t || 'array' === t)) ? { ...v } : v,
    r,
    o,
    k: '',
    d: -1,
    u,
    a: [],
    b: [],
  }

  if (b) {
    // vs.b = b
    vs.b.push(b)
  }

  return vs
}


function make(inspec?: any, inopts?: Options): GubuShape {
  const opts = null == inopts ? {} : inopts
  opts.name =
    null == opts.name ? 'G' + ('' + Math.random()).substring(2, 8) : '' + opts.name

  // let top = { '': inspec }
  let top = inspec
  let spec: Node = norm(top) // Tree of validation nodes.

  // TODO: move to norm?
  spec.d = 0

  let gubuShape = function GubuShape<T>(inroot?: T, inctx?: Context): T {
    const ctx: any = inctx || {}
    let root: any = inroot

    let s = new State(root, spec, ctx)


    // Iterative depth-first traversal of the spec.
    while (true) {
      let isRoot = 0 === s.pI

      // printStacks(nodes, srcs, parents)

      // Dereference the back pointers to ancestor siblings.
      // Only objects|arrays can be nodes, so a number is a back pointer.
      // NOTE: terminates because (+{...} -> NaN, +[] -> 0) -> false (JS wat FTW!)
      let nextNode = s.nodes[s.pI]
      // console.log('NODE-0', 'd=' + dI, pI, nI, +node, node.k, node.t)

      while (+nextNode) {
        s.pI = +nextNode
        nextNode = s.nodes[s.pI]
        s.dI--
      }

      // console.log('NODE-1', 'd=' + dI, pI, nI, +node, node?.k, node?.t)

      if (!nextNode) {
        break
      }
      else {
        s.node = (nextNode as Node)
      }

      s.sI = s.pI + 1
      let sval = s.srcs[s.pI]
      s.parent = s.parents[s.pI]

      s.pI = s.nI

      s.nextSibling = true

      // let s_key = s.node.k
      s.key = s.node.k
      let t = s.node.t
      s.path[s.dI] = s.key
      // console.log('PATH', dI, pathstr(path, dI), 'KEY', key)

      let oval = sval
      let stype: string = typeof (sval)
      if ('number' === stype && isNaN(sval)) {
        stype = 'nan'
      }

      let terr: any[] = []
      let vs = s.node

      let pass = true
      let done = false

      if (0 < vs.b.length) {
        for (let bI = 0; bI < vs.b.length; bI++) {
          let update = handleValidate(vs.b[bI], sval, {
            dI: s.dI, nI: s.nI, sI: s.sI, pI: s.pI,
            key: s.key, node: vs, val: sval, parent: s.parent, nodes: s.nodes, srcs: s.srcs, path: s.path, terr, err: s.err, ctx,
            pass, oval, parents: s.parents, nextSibling: s.nextSibling
          })

          pass = update.pass
          if (undefined !== update.val) {
            sval = update.val
            if (isRoot) {
              root = sval
            }
            stype = typeof (sval)
          }
          if (undefined !== update.node) {
            vs = update.node
          }
          if (undefined !== update.type) {
            t = update.type
          }
          if (undefined !== update.done) {
            done = update.done
          }
          s.nI = undefined === update.nI ? s.nI : update.nI
          s.sI = undefined === update.sI ? s.sI : update.sI
          s.pI = undefined === update.pI ? s.pI : update.pI
        }
      }

      if (!done) {
        if ('never' === t) {
          terr.push(makeErrImpl('never', sval, s.path, s.dI, vs, 1070))
        }
        else if ('object' === t) {
          if (vs.r && undefined === sval) {
            terr.push(makeErrImpl('required', sval, s.path, s.dI, vs, 1010))
          }
          else if (
            undefined !== sval && (
              null === sval ||
              'object' !== stype ||
              Array.isArray(sval)
            )
          ) {
            terr.push(makeErrImpl('type', sval, s.path, s.dI, vs, 1020))
          }

          // else if (null != src[key] || !vs.o) {
          else if (!vs.o) {
            sval = sval || {}
            if (isRoot) {
              root = sval
            }

            let vkeys = Object.keys(vs.v)
            if (0 < vkeys.length) {
              s.pI = s.nI
              for (let k of vkeys) {
                let nvs = vs.v[k] = norm(vs.v[k])

                // TODO: move to norm?
                nvs.k = k
                nvs.d = 1 + s.dI

                s.nodes[s.nI] = nvs
                s.srcs[s.nI] = sval[k]
                s.parents[s.nI] = sval
                s.nI++
              }

              s.dI++
              s.nodes[s.nI++] = s.sI

              s.nextSibling = false
            }
          }
        }

        else if ('array' === t) {
          if (vs.r && undefined === sval) {
            terr.push(makeErrImpl('required', sval, s.path, s.dI, vs, 1030))
          }
          else if (undefined !== sval && !Array.isArray(sval)) {
            terr.push(makeErrImpl('type', sval, s.path, s.dI, vs, 1040))
          }
          else if (!vs.o) {
            sval = sval || []
            if (isRoot) {
              root = sval
            }

            let vkeys = Object.keys(vs.v).filter(k => !isNaN(+k))

            if (0 < sval.length || 1 < vkeys.length) {
              s.pI = s.nI
              let nvs = undefined === vs.v[0] ? Any() : vs.v[0] = norm(vs.v[0])
              nvs.k = '0'
              nvs.d = 1 + s.dI

              // Special elements
              let j = 1
              if (1 < vkeys.length) {
                for (; j < vkeys.length; j++) {
                  let jvs = vs.v[j] = norm(vs.v[j])

                  // TODO: move to norm?
                  jvs.k = '' + (j - 1)
                  jvs.d = 1 + s.dI

                  s.nodes[s.nI] = { ...jvs, k: '' + (j - 1) }
                  s.srcs[s.nI] = sval[(j - 1)]
                  s.parents[s.nI] = sval
                  s.nI++
                }
              }

              for (let i = j - 1; i < sval.length; i++) {
                s.nodes[s.nI] = { ...nvs, k: '' + i }
                s.srcs[s.nI] = sval[i]
                s.parents[s.nI] = sval
                s.nI++
              }

              s.dI++
              s.nodes[s.nI++] = s.sI

              s.nextSibling = false
            }
          }
        }

        // Invalid type.
        else if (!(
          'any' === t ||
          'custom' === t ||
          'list' === t ||
          undefined === sval ||
          t === stype ||
          ('instance' === t && vs.u.i && sval instanceof vs.u.i) ||
          ('null' === t && null === sval)
        )) {
          terr.push(makeErrImpl('type', sval, s.path, s.dI, vs, 1050))
          pass = false
        }

        // Value itself, or default.
        else if (undefined === sval) {
          let parentKey = s.path[s.dI]

          if (vs.r && ('undefined' !== t || !s.parent.hasOwnProperty(parentKey))) {
            terr.push(makeErrImpl('required', sval, s.path, s.dI, vs, 1060))
            pass = false
          }
          else if (undefined !== vs.v && !vs.o || 'undefined' === t) {
            sval = vs.v
            if (isRoot) {
              root = sval
            }
          }
        }

        // Empty strings fail even if string is optional. Use Empty to allow.
        else if ('string' === t && '' === sval) {
          if (!vs.u.empty) {
            terr.push(makeErrImpl('required', sval, s.path, s.dI, vs, 1080))
          }
        }
      }

      //   // console.log('KEY3', key, pass, done, vs.a)
      if (0 < vs.a.length) {
        for (let aI = 0; aI < vs.a.length; aI++) {
          let update = handleValidate(vs.a[aI], sval, {
            dI: s.dI, nI: s.nI, sI: s.sI, pI: s.pI,
            key: s.key, node: vs, val: sval, parent: s.parent, nodes: s.nodes, srcs: s.srcs, path: s.path, terr, err: s.err, ctx,
            pass, oval, parents: s.parents, nextSibling: s.nextSibling
          })
          if (undefined !== update.val) {
            sval = update.val
            if (isRoot) {
              root = sval
            }
            stype = typeof (sval)
          }
          if (undefined !== update.done) {
            done = update.done
          }
          s.nI = undefined === update.nI ? s.nI : update.nI
          s.sI = undefined === update.sI ? s.sI : update.sI
          s.pI = undefined === update.pI ? s.pI : update.pI
        }
      }

      if (0 < terr.length) {
        s.err.push(...terr)
      }

      if (s.parent && !done) {
        s.parent[s.key] = sval
      }

      if (s.nextSibling) {
        s.pI = s.sI
      }
    }

    if (0 < s.err.length) {
      if (ctx.err) {
        ctx.err.push(...s.err)
      }
      else {
        throw new GubuError('shape', s.err, ctx)
      }
    }

    return root
  } as GubuShape


  // TODO: test Number, String, etc also in arrays
  gubuShape.spec = () => {
    // Normalize spec, discard errors.
    gubuShape(undefined, { err: [] })
    return JSON.parse(stringify(spec, (_key: string, val: any) => {
      if (GUBU$ === val) {
        return true
      }
      return val
    }))
  }


  let desc: string = ''
  gubuShape.toString = (gubuShape as any)[inspect.custom] = () => {
    desc = '' === desc ?
      stringify(
        (
          inspec &&
          inspec.$ &&
          (GUBU$ === inspec.$.gubu$ || true === inspec.$.gubu$)
        ) ? inspec.v : inspec) :
      desc
    desc = desc.substring(0, 33) + (33 < desc.length ? '...' : '')
    return `[Gubu ${opts.name} ${desc}]`
  }


  gubuShape.gubu = GUBU

  return gubuShape
}


/*
function printStacks(nodes: any[], srcs: any[], parents: any[]) {
  for (let i = 0; i < nodes.length || i < srcs.length || i < parents.length; i++) {
    console.log(i, '\t',
      isNaN(+nodes[i]) ? nodes[i].k + ':' + nodes[i].t : +nodes[i],
      '\t', srcs[i], '\t', parents[i])
  }
}
*/


function handleValidate(vf: Validate, sval: any, state: State): Update {
  let update: Update = { pass: true, done: false }

  let valid = vf(sval, update, state)

  if (!valid || update.err) {

    // Explicit Optional allows undefined
    if (undefined === sval && (state.node.o || !state.node.r)) {
      delete update.err
      update.pass = true
      return update
    }

    let w = update.why || 'custom'
    let p = pathstr(state.path, state.dI)

    if ('object' === typeof (update.err)) {
      // Assumes makeErr already called
      state.terr.push(...[update.err].flat().map(e => {
        e.p = null == e.p ? p : e.p
        e.m = null == e.m ? 2010 : e.m
        return e
      }))
    }
    else {
      let fname = vf.name
      if (null == fname || '' == fname) {
        fname = vf.toString().replace(/[ \t\r\n]+/g, ' ')
        fname = 33 < fname.length ? fname.substring(0, 30) + '...' : fname
      }
      state.terr.push(makeErrImpl(
        w, sval, state.path, state.dI, state.node, 1045, undefined, {}, fname))
    }
    update.pass = false
  }

  return update
}


function pathstr(path: string[], dI: number) {
  return path.slice(1, dI + 1).filter(s => null != s).join('.')
}


const Required: Builder = function(this: Node, spec?: any) {
  let vs = buildize(this, spec)
  vs.r = true

  if (undefined === spec && 1 === arguments.length) {
    vs.t = 'undefined'
    vs.v = undefined
  }

  return vs
}

const Optional: Builder = function(this: Node, spec?: any) {
  let vs = buildize(this, spec)
  vs.r = false

  // Mark Optional as explicit, this do not insert empty arrays and objects.
  vs.o = true

  return vs
}

const Empty: Builder = function(this: Node, spec?: any) {
  let vs = buildize(this, spec)
  vs.u.empty = true
  return vs
}



// Optional value provides default.
const Any: Builder = function(this: Node, spec?: any) {
  let vs = buildize(this, spec)
  vs.t = 'any'
  if (undefined !== spec) {
    vs.v = spec
  }
  return vs
}


const Never: Builder = function(this: Node, spec?: any) {
  let vs = buildize(this, spec)
  vs.t = 'never'
  return vs
}


// Pass only if all match. Does not short circuit (as defaults may be missed).
const All: Builder = function(this: Node, ...specs: any[]) {
  let vs = buildize()
  vs.t = 'list'
  let shapes = specs.map(s => Gubu(s))
  vs.u.list = specs

  vs.b.push(function All(val: any, update: Update, state: State) {
    let pass = true

    let err: any = []
    for (let shape of shapes) {
      let subctx = { ...state.ctx, err: [] }
      shape(val, subctx)
      if (0 < subctx.err.length) {
        pass = false
        err.push(...subctx.err)
      }
    }

    if (!pass) {
      update.why = 'all'
      update.err = [
        makeErr(val, state,
          `Value "$VALUE" for path "$PATH" does not satisfy All shape:`),
        ...err]
    }

    return pass
  })

  return vs
}


// Pass if some match. Does not short circuit (as defaults may be missed).
const Some: Builder = function(this: Node, ...specs: any[]) {
  let vs = buildize()
  vs.t = 'list'
  let shapes = specs.map(s => Gubu(s))
  vs.u.list = specs

  vs.b.push(function Some(val: any, update: Update, state: State) {
    let pass = false

    let err: any = []
    for (let shape of shapes) {
      let subctx = { ...state.ctx, err: [] }
      shape(val, subctx)
      if (0 < subctx.err.length) {
        pass ||= false
        err.push(...subctx.err)
      }
      else {
        pass = true
      }
    }

    if (!pass) {
      update.why = 'some'
      update.err = [
        makeErr(val, state,
          `Value "$VALUE" for path "$PATH" does not satisfy Some shape:`),
        ...err]
    }

    return pass
  })

  return vs
}


// Pass if exactly one matches. Does not short circuit (as defaults may be missed).
const One: Builder = function(this: Node, ...specs: any[]) {
  let vs = buildize()
  vs.t = 'list'
  let shapes = specs.map(s => Gubu(s))
  vs.u.list = specs

  vs.b.push(function One(val: any, update: Update, state: State) {
    let passN = 0

    let err: any = []
    for (let shape of shapes) {
      let subctx = { ...state.ctx, err: [] }
      shape(val, subctx)
      if (0 < subctx.err.length) {
        passN++
        err.push(...subctx.err)
      }
    }

    if (1 !== passN) {
      update.why = 'one'
      update.err = [
        makeErr(val, state,
          `Value "$VALUE" for path "$PATH" does not satisfy One shape:`),
        ...err]
    }

    return true
  })

  return vs
}



const Exact: Builder = function(this: Node, ...vals: any[]) {
  let vs = buildize()
  vs.b.push(function Exact(val: any, update: Update, state: State) {
    for (let i = 0; i < vals.length; i++) {
      if (val === vals[i]) {
        return true
      }
    }
    update.err =
      makeErr(val, state,
        `Value "$VALUE" for path "$PATH" must be exactly one of: ` +
        `${vals.map(v => stringify(v)).join(', ')}.`)

    return false
  })

  return vs
}



const Before: Builder = function(this: Node, validate: Validate, spec?: any) {
  let vs = buildize(this, spec)
  vs.b.push(validate)
  return vs
}


const After: Builder = function(this: Node, validate: Validate, spec?: any) {
  let vs = buildize(this, spec)
  vs.a.push(validate)
  return vs
}


const Closed: Builder = function(this: Node, spec?: any) {
  let vs = buildize(this, spec)

  vs.b.push(function Closed(val: any, update: Update, state: State) {
    if (null != val && 'object' === typeof (val)) {
      let vkeys = Object.keys(val)
      let allowed = vs.v

      // For arrays, handle non-index properties, and special element offset.
      if ('array' === state.node.t) {
        allowed = Object.keys(vs.v).slice(1)
          .map((x: any) => {
            let i = parseInt(x)
            if (isNaN(i)) {
              return x
            }
            else {
              return i - 1
            }
          })
          .reduce((a: any, i: any) => (a[i] = true, a), {})
      }

      update.err = []
      for (let k of vkeys) {
        if (undefined === allowed[k]) {
          update.err.push(
            makeErrImpl('closed', val, state.path, state.dI, vs, 3010, '', { k })
          )
        }
      }

      return 0 === update.err.length
    }
    return true
  })

  return vs
}


const Define: Builder = function(this: Node, inopts: any, spec?: any): Node {
  let vs = buildize(this, spec)

  let opts = 'object' === typeof inopts ? inopts || {} : {}
  let name = 'string' === typeof inopts ? inopts : opts.name


  if (null != name && '' != name) {
    vs.b.push(function Define(_val: any, _update: Update, state: State) {
      let ref = state.ctx.ref = state.ctx.ref || {}
      ref[name] = state.node
      return true
    })
  }

  return vs
}


const Refer: Builder = function(this: Node, inopts: any, spec?: any): Node {
  let vs = buildize(this, spec)

  let opts = 'object' === typeof inopts ? inopts || {} : {}
  let name = 'string' === typeof inopts ? inopts : opts.name

  // Fill should be false (the default) if used recursively, to prevent loops.
  let fill = !!opts.fill

  if (null != name && '' != name) {
    vs.b.push(function Refer(val: any, update: Update, state: State) {
      if (undefined !== val || fill) {
        let ref = state.ctx.ref = state.ctx.ref || {}

        if (undefined !== ref[name]) {
          let node = { ...ref[name] }
          node.k = state.node.k
          node.t = node.t || 'never'

          update.node = node
          update.type = node.t

        }
      }

      // TODO: option to fail if ref not found?
      return true
    })
  }

  return vs
}


const Rename: Builder = function(this: Node, inopts: any, spec?: any): Node {
  let vs = buildize(this, spec)

  let opts = 'object' === typeof inopts ? inopts || {} : {}
  let name = 'string' === typeof inopts ? inopts : opts.name
  let keep = 'boolean' === typeof opts.keep ? opts.keep : undefined
  let claim = Array.isArray(opts.claim) ? opts.claim : []

  if (null != name && '' != name) {

    // If there is a claim, grab the value so that validations
    // can be applied to it.
    let vsb = (val: any, update: Update, state: State) => {
      if (undefined === val) {
        for (let cn of claim) {
          if (undefined !== state.parent[cn]) {
            update.val = state.parent[name] = state.parent[cn]
            delete state.parent[cn]
          }
        }
      }
      return true
    }
    Object.defineProperty(vsb, 'name', { value: 'Rename:' + name })
    vs.b.push(vsb)

    let vsa = (val: any, update: Update, state: State) => {
      // state.src[name] = val
      state.parent[name] = val

      if (!keep &&
        // Arrays require explicit deletion as validation is based on index
        // and will be lost.
        !(Array.isArray(state.parent) && false !== keep)
      ) {
        delete state.parent[state.key]
        update.done = true
      }

      return true
    }
    Object.defineProperty(vsa, 'name', { value: 'Rename:' + name })
    vs.a.push(vsa)
  }

  return vs
}


function valueLen(val: any) {
  return 'number' === typeof (val) ? val :
    'number' === typeof (val?.length) ? val.length :
      null != val && 'object' === typeof (val) ? Object.keys(val).length :
        NaN
}


const Min: Builder = function(
  this: Node,
  min: number | string,
  spec?: any
): Node {
  let vs = buildize(this, spec)

  vs.b.push(function Min(val: any, update: Update, state: State) {
    let vlen = valueLen(val)

    if (min <= vlen) {
      return true
    }

    let errmsgpart = 'number' === typeof (val) ? '' : 'length '
    update.err =
      makeErr(val, state,
        `Value "$VALUE" for path "$PATH" must be a minimum ${errmsgpart}of ${min} (was ${vlen}).`)
    return false
  })

  return vs
}


const Max: Builder = function(
  this: Node,
  max: number | string,
  spec?: any
): Node {
  let vs = buildize(this, spec)

  vs.b.push(function Max(val: any, update: Update, state: State) {
    let vlen = valueLen(val)

    if (vlen <= max) {
      return true
    }

    let errmsgpart = 'number' === typeof (val) ? '' : 'length '
    update.err =
      makeErr(val, state,
        `Value "$VALUE" for path "$PATH" must be a maximum ${errmsgpart}of ${max} (was ${vlen}).`)
    return false
  })

  return vs
}


const Above: Builder = function(
  this: Node,
  above: number | string,
  spec?: any
): Node {
  let vs = buildize(this, spec)

  vs.b.push(function Above(val: any, update: Update, state: State) {
    let vlen = valueLen(val)

    if (above < vlen) {
      return true
    }

    let errmsgpart = 'number' === typeof (val) ? 'be' : 'have length'
    update.err =
      makeErr(val, state,
        `Value "$VALUE" for path "$PATH" must ${errmsgpart} above ${above} (was ${vlen}).`)
    return false
  })

  return vs
}


const Below: Builder = function(
  this: Node,
  below: number | string,
  spec?: any
): Node {
  let vs = buildize(this, spec)

  vs.b.push(function Below(val: any, update: Update, state: State) {
    let vlen = valueLen(val)

    if (vlen < below) {
      return true
    }

    let errmsgpart = 'number' === typeof (val) ? 'be' : 'have length'
    update.err =
      makeErr(val, state,
        `Value "$VALUE" for path "$PATH" must ${errmsgpart} below ${below} (was ${vlen}).`)
    return false
  })

  return vs
}



function buildize(invs0?: any, invs1?: any): Node {
  let invs = undefined === invs0 ? invs1 : invs0.window === invs0 ? invs1 : invs0

  let vs = norm(invs)
  return Object.assign(vs, {
    Above,
    After,
    All,
    Any,
    Before,
    Below,
    Closed,
    Define,
    Empty,
    Exact,
    Max,
    Min,
    Never,
    One,
    Optional,
    Refer,
    Rename,
    Required,
    Some,
  })
}


// External utility to make ErrDesc objects.
function makeErr(val: any, state: State, text?: string, why?: string) {
  return makeErrImpl(
    why || 'custom',
    val,
    state.path,
    state.dI,
    state.node,
    4000,
    text,
  )
}


// Internal utility to make ErrDesc objects.
function makeErrImpl(
  why: string,
  sval: any,
  path: string[],
  dI: number,
  node: Node,
  mark: number,
  text?: string,
  user?: any,
  fname?: string,
): ErrDesc {
  let err: ErrDesc = {
    n: node,
    s: sval,
    p: pathstr(path, dI),
    w: why,
    m: mark,
    t: '',
  }

  let jstr = undefined === sval ? '' : stringify(sval)
  let valstr = jstr.replace(/"/g, '')
  valstr = valstr.substring(0, 77) + (77 < valstr.length ? '...' : '')

  if (null == text || '' === text) {
    err.t = `Validation failed for path "${err.p}" ` +
      `with value "${valstr}" because ` +

      ('type' === why ? (
        'instance' === node.t ? `the value is not an instance of ${node.u.n}` :
          `the value is not of type ${node.t}`) :
        'required' === why ? `the value is required` :
          'closed' === why ? `the property "${user?.k}" is not allowed` :
            'never' === why ? 'no value is allowed' :
              `check "${why + (fname ? ': ' + fname : '')}" failed`) +
      '.'
  }
  else {
    err.t = text
      .replace(/\$VALUE/g, valstr)
      .replace(/\$PATH/g, err.p)
  }

  return err
}


function stringify(x: any, r?: any) {
  try {
    let str = JSON.stringify(x, (key: any, val: any) => {
      if (r) {
        val = r(key, val)
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
        if ('function' === typeof ((make as any)[val.name])) {
          val = undefined
        }
        else {
          val = val.name
        }
      }
      else if ('bigint' === typeof (val)) {
        val = String(val.toString())
      }
      return val
    })

    return String(str)
  }
  catch (e: any) {
    return JSON.stringify(String(x))
  }
}


function clone(x: any) {
  return null == x ? x : 'object' !== typeof (x) ? x : JSON.parse(JSON.stringify(x))
}




type GubuShape =
  (<T>(inroot?: T, inctx?: any) => T) &
  {
    spec: () => any,
    gubu: typeof GUBU
  }


const G$ = (spec: any): Node => norm({ ...spec, $: { gubu$: true } })


Object.assign(make, {
  Above,
  After,
  All,
  Any,
  Before,
  Below,
  Closed,
  Define,
  Empty,
  Exact,
  Max,
  Min,
  Never,
  One,
  Optional,
  Refer,
  Rename,
  Required,
  Some,

  G$,
  buildize,
  makeErr,
  Args,
})


type Gubu = typeof make & {
  desc: () => any

  G$: typeof G$,
  buildize: typeof buildize,
  makeErr: typeof makeErr,
  Args: typeof Args,

  Above: typeof Above
  After: typeof After
  All: typeof All
  Any: typeof Any
  Before: typeof Before
  Below: typeof Below
  Closed: typeof Closed
  Define: typeof Define
  Empty: typeof Empty
  Exact: typeof Exact
  Max: typeof Max
  Min: typeof Min
  Never: typeof Never
  One: typeof One
  Optional: typeof Optional
  Refer: typeof Refer
  Rename: typeof Rename
  Required: typeof Required
  Some: typeof Some
}

Object.defineProperty(make, 'name', { value: 'gubu' })


const Gubu: Gubu = (make as Gubu)


// TODO: claim not working
function Args(spec: any, wrapped?: any) {
  let restArg: any = undefined
  let argsSpec: any =
    Object.keys(spec)
      .reduce((as: any[], name, index, keys) => {
        if (name.startsWith('...') && index + 1 === keys.length) {
          restArg = { name: name.substring(3), spec: spec[name] }
        }
        else {
          let claim: any = (name.split(':')[1] || '').split(',').filter(c => '' !== c)
          if (0 < claim.length) {
            name = name.split(':')[0]
          }
          else {
            claim = undefined
          }
          // console.log('NAME', name, claim)
          as[index + 1] = Rename({ name, claim }, spec[name])
        }
        return as
      }, [Never()])

  if (restArg) {
    argsSpec[0] = After((v: any, _u: Update, s: State) => {
      s.parent[restArg.name] = (s.parent[restArg.name] || [])
      s.parent[restArg.name].push(v)
      return true
    }, restArg.spec)

    // TODO: should use Complete
    argsSpec = After((v: any, _u: Update, _s: State) => {
      if (v) {
        v[restArg.name] = (v[restArg.name] || [])
      }
      return true
    }, argsSpec)
  }

  let argsShape = Gubu(argsSpec)

  if (wrapped) {
    let argsWrap = function(this: any) {
      let inargs = Array.prototype.slice.call(arguments)
      let args = argsShape(inargs)
      return wrapped.call(this, args)
    }

    if (null != wrapped.name && '' != wrapped.name) {
      Object.defineProperty(argsWrap, 'name', { value: wrapped.name + '_args' })
    }
    return argsWrap
  }

  return argsShape
}



const GAbove = Above
const GAfter = After
const GAll = All
const GAny = Any
const GBefore = Before
const GBelow = Below
const GClosed = Closed
const GDefine = Define
const GEmpty = Empty
const GExact = Exact
const GMax = Max
const GMin = Min
const GNever = Never
const GOne = One
const GOptional = Optional
const GRefer = Refer
const GRename = Rename
const GRequired = Required
const GSome = Some


export type {
  Validate,
  Update,
  Context,
  Builder,
  Node,
  State,
}

export {
  Gubu,
  G$,
  norm,
  buildize,
  makeErr,
  Args,

  Above,
  After,
  All,
  Any,
  Before,
  Below,
  Closed,
  Define,
  Empty,
  Exact,
  Max,
  Min,
  Never,
  One,
  Optional,
  Refer,
  Rename,
  Required,
  Some,

  GAbove,
  GAfter,
  GAll,
  GAny,
  GBefore,
  GBelow,
  GClosed,
  GDefine,
  GEmpty,
  GExact,
  GMax,
  GMin,
  GNever,
  GOne,
  GOptional,
  GRefer,
  GRename,
  GRequired,
  GSome,
}




