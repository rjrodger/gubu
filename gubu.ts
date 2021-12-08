/* Copyright (c) 2021 Richard Rodger, MIT License */

/*
 * NOTE: `undefined` is not considered a value or type, and thus means 'any'.
 */

// TODO: test Some, or drop?
// TODO: BigInt spec roundtrip test
// TODO: Only - builder, exact values
// TODO: Min,Max - builder, depends on value

import Pkg from './package.json'


const GUBU$ = Symbol.for('gubu$')
const GUBU = { gubu$: GUBU$, v$: Pkg.version }


type Options = {
  name?: string // Name this Gubu shape.
}

type Context = Record<string, any> & {
  err?: ErrDesc[] // Provide an array to collect errors, instead of throwing.
}

type ValType =
  'any' |
  'none' |
  'node' |
  'custom' |
  'null' |
  'list' |
  'string' |
  'number' |
  'boolean' |
  'object' |
  'array' |
  'bigint' |
  'symbol' |
  'function' |
  'instance' |
  'nan'

type ValSpec = {
  $: typeof GUBU
  t: ValType
  d: number    // Depth.
  v: any
  r: boolean   // Value is required.
  k: string    // Key of this node.
  u?: any      // Custom meta data
  b?: Validate // Custom before validation function.
  a?: Validate // Custom after vaidation function.
}


type Builder = (opts?: any, ...specs: any[]) =>
  ValSpec & { [name: string]: Builder | any }

type Validate = (val: any, update: Update, state: State) => boolean


type State = {
  key: string
  node: ValSpec
  src: any
  dI: number
  nI: number
  sI: number
  pI: number
  cN: number
  nodes: (ValSpec | number)[]
  srcs: any[]
  path: string[]
  terr: any[] // Term errors (for One,Some,All).
  err: any[]
  ctx: any
}

type Update = {
  pass: boolean
  done?: boolean
  val?: any
  node?: ValSpec
  type?: ValType
  nI?: number
  sI?: number
  pI?: number
  cN?: number
  err?: boolean | ErrDesc | ErrDesc[]
  why?: string
}


type ErrDesc = {
  n: ValSpec // Failing spec node.
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





function norm(spec?: any): ValSpec {
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
      vs.d = null == vs.d ? -1 : vs.d

      vs.u = vs.u || {}
      if (vs.u.list?.specs) {
        vs.u.list.specs = [...vs.u.list.specs]
      }

      return vs
    }
  }

  // Not a ValSpec, so build one based on value and its type.

  let t: ValType | 'undefined' = (null === spec ? 'null' : typeof (spec))
  t = (undefined === t ? 'any' : t) as ValType

  // console.log('Nt', t)

  let v = spec
  let r = false // Optional by default
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
      u.n = v.constructor?.name
      u.i = v.constructor
    }
  }

  else if ('function' === t) {
    if (IS_TYPE[spec.name]) {
      t = (spec.name.toLowerCase() as ValType)
      r = true
      v = clone(EMPTY_VAL[t])
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

  // console.log('Nv', v)

  let vs: ValSpec = {
    $: GUBU,
    t,
    // v: (null != v && 'object' === typeof (v)) ? { ...v } : v,
    v: (null != v && ('object' === t || 'array' === t)) ? { ...v } : v,
    r,
    k: '',
    d: -1,
    u,
  }

  if (b) {
    vs.b = b
  }

  // console.log('N', vs)

  return vs
}


function make(inspec?: any, inopts?: Options): GubuShape {
  const opts = null == inopts ? {} : inopts
  opts.name = null == opts.name ? ('' + Math.random()).substring(2) : '' + opts.name

  let top = { '': inspec }
  // let spec: ValSpec = norm(inspec) // Tree of validation nodes.
  let spec: ValSpec = norm(top) // Tree of validation nodes.

  // console.log(spec)

  let gubuShape = function GubuShape<T>(inroot?: T, inctx?: Context): T {
    const ctx: any = inctx || {}
    const root: any =
    {
      // '': (undefined === inroot && null != spec.v['']) ?
      //   clone(EMPTY_VAL[spec.v[''].t]) :
      //   inroot
      '': inroot
    }

    const nodes: (ValSpec | number)[] = [spec, -1]
    const srcs: any[] = [root, -1]
    const path: string[] = [] // Key path to current node.

    // let dI: number = 0  // Node depth.
    let dI: number = -1  // Node depth.
    let nI: number = 2  // Next free slot in nodes.
    let pI: number = 0  // Pointer to current node.
    let sI: number = -1 // Pointer to next sibling node.
    let cN: number = 0  // Number of children of current node.

    let err: any = []   // Errors collected.
    let node: any       // Current node.  
    let src: any        // Current source value to validate.

    // Iterative depth-first traversal of the spec.
    while (true) {

      // Dereference the back pointers to ancestor siblings.
      // Only objects|arrays can be nodes, so a number is a back pointer.
      // NOTE: terminates because (+{...} -> NaN, +[] -> 0) -> false (JS wat FTW!)
      node = nodes[pI]
      while (+node) {
        pI = node
        node = nodes[pI]
        dI--
      }

      sI = pI + 1
      src = srcs[pI]

      if (!node) {
        break
      }

      if (-1 < dI) {
        path[dI] = node.k
      }
      dI++

      cN = 0
      pI = nI

      let keys = Object.keys(node.v)

      // Treat array indexes as keys.
      // Inject missing indexes if present in ValSpec.
      if ('array' === node.t) {
        keys = Object.keys(src)
        for (let vk in node.v) {
          if ('0' !== vk && !keys.includes(vk)) {
            keys.splice(parseInt(vk) - 1, 0, '' + (parseInt(vk) - 1))
          }
        }
      }

      // console.log('KEYS', keys)

      for (let key of keys) {
        path[dI] = key
        let sval = src[key]
        let stype: string = typeof (sval)
        if ('number' === stype && isNaN(sval)) {
          stype = 'nan'
        }

        let n = node.v[key]
        let tvs: ValSpec = null as any


        // NOTE: special case handling for arrays keys.
        if ('array' === node.t) {
          // First array entry is general type spec.
          // Following are special case elements offset by +1.
          // Use these if src has no corresponding element.

          let akey = '' + (parseInt(key) + 1)
          n = node.v[akey]
          if (undefined !== n) {
            tvs = n = GUBU$ === n.$?.gubu$ ? n : (n = node.v[akey] = norm(n))
          }

          if (undefined === n) {
            n = node.v[0]
            key = '' + 0

            // No first element defining element type spec, so use Any.
            if (undefined === n) {
              n = node.v[0] = Any()
            }

            tvs = n = GUBU$ === n.$?.gubu$ ? n : (n = node.v[key] = norm(n))
          }
        }
        else {
          tvs = (null != n && GUBU$ === n.$?.gubu$) ? n : (n = node.v[key] = norm(n))
        }

        tvs.k = key
        tvs.d = dI

        let t = tvs.t

        let vss: ValSpec[]
        let listkind: string = ''
        let failN = 0

        if ('list' === t) {
          vss = tvs.u.list.specs
          listkind = tvs.u.list.kind
        }
        else {
          vss = [tvs]
        }

        let terr: any[] = []

        for (let vsI = 0; vsI < vss.length; vsI++) {
          let vs = vss[vsI]

          // console.log('Ta', vs)
          vs = GUBU$ === vs.$?.gubu$ ? vs : (vss[vsI] = norm(vs))
          // console.log('Tb', vs)

          let t = vs.t
          let pass = true
          let done = false

          // udpate can set t
          if (vs.b) {
            let update = handleValidate(vs.b, sval, {
              dI, nI, sI, pI, cN,
              key, node: vs, src, nodes, srcs, path, terr, err, ctx
            })
            // console.log('BU', update)

            pass = update.pass
            if (undefined !== update.val) {
              sval = src[key] = update.val
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
            nI = undefined === update.nI ? nI : update.nI
            sI = undefined === update.sI ? sI : update.sI
            pI = undefined === update.pI ? pI : update.pI
            cN = undefined === update.cN ? cN : update.cN
          }

          // console.log('M', t, stype, sval, vs.v)
          //   // sval instanceof vs.v,
          //   'C',
          //   'any' !== t,
          //   'custom' !== t,
          //   undefined !== sval,
          //   t !== stype,
          //   !('object' === stype && 'instance' !== t && null != sval),
          //   !('instance' === t && sval instanceof vs.v),
          //   !('null' === t && null === sval)
          // )

          if (!done) {
            if ('none' === t) {
              terr.push(makeErr('none', sval, path, dI, vs, 1070))
            }
            else if ('object' === t) {
              // console.log('SVAL', sval, null === sval)

              // if (vs.r && null == sval) {
              if (vs.r && undefined === sval) {
                terr.push(makeErr('required', sval, path, dI, vs, 1010))
              }
              else if (
                //(null != sval && ('object' !== stype || Array.isArray(sval)))
                undefined !== sval && (
                  null === sval ||

                  'object' !== stype ||
                  Array.isArray(sval)
                )
              ) {
                // console.log('SVAL Q')
                terr.push(makeErr('type', sval, path, dI, vs, 1020))
              }
              else {
                nodes[nI] = vs
                srcs[nI] = src[key] = (src[key] || {})
                nI++
                cN++
              }
            }

            else if ('array' === t) {
              // if (vs.r && null == sval) {
              if (vs.r && undefined === sval) {
                terr.push(makeErr('required', sval, path, dI, vs, 1030))
              }
              // else if (null != sval && !Array.isArray(sval)) {
              else if (undefined !== sval && !Array.isArray(sval)) {
                terr.push(makeErr('type', sval, path, dI, vs, 1040))
              }
              else {
                nodes[nI] = vs
                srcs[nI] = src[key] = (src[key] || [])
                nI++
                cN++
              }
            }

            // Invalid type.
            else if (!(
              'any' === t ||
              'custom' === t ||
              undefined === sval ||
              t === stype ||
              ('instance' === t && vs.u.i && sval instanceof vs.u.i) ||
              // ('instance' !== t && 'object' === stype && null != sval) ||
              ('null' === t && null === sval)
            ))

            // 'any' !== t &&
            // 'custom' !== t &&
            // undefined !== sval &&
            // t !== stype &&
            // !('instance' !== t && 'object' === stype && null != sval) &&
            // !('instance' === t && vs.u.i && sval instanceof vs.u.i) &&
            // !('null' === t && null === sval)
            {
              terr.push(makeErr('type', sval, path, dI, vs, 1050))
              pass = false
            }

            // Value itself, or default.
            else if (undefined === sval) {
              if (vs.r) {
                terr.push(makeErr('required', sval, path, dI, vs, 1060))
                pass = false
              }
              // NOTE: `undefined` is special and cannot be set
              else if (undefined !== vs.v) {
                src[key] = vs.v
              }
            }
          }

          if (vs.a) {
            let update = handleValidate(vs.a, sval, {
              dI, nI, sI, pI, cN,
              key, node: vs, src, nodes, srcs, path, terr, err, ctx
            })
            pass = update.pass
            if (undefined !== update.val) {
              sval = src[key] = update.val
            }
            nI = undefined === update.nI ? nI : update.nI
            sI = undefined === update.sI ? sI : update.sI
            pI = undefined === update.pI ? pI : update.pI
            cN = undefined === update.cN ? cN : update.cN
          }

          if (!pass) {
            failN++
            if ('all' === listkind) {
              break
            }
          }
          else if ('one' === listkind) {
            break
          }
        }

        if (0 < terr.length &&
          !(('one' === listkind || 'some' === listkind) && failN < vss.length)) {
          err.push(...terr)
        }
      }


      if (0 < cN) {
        // Follow pointer back to next parent sibling.
        nodes[nI++] = sI
      }
      else {
        // Next sibling.
        pI = sI
        dI--
      }

      // console.log('***')
      // for (let i = 0; i < nodeStack.length; i++) {
      //   console.log(
      //     ('' + i).padStart(4),
      //     J(nodeStack[i]).substring(0, 111).padEnd(112),
      //     '/',
      //     J(curStack[i]).substring(0, 33).padEnd(34),
      //   )
      // }
      // console.log('END', 'c=' + cN, 's=' + sI, 'p=' + pI, 'n=' + nI)
    }

    if (0 < err.length) {
      if (ctx.err) {
        ctx.err.push(...err)
      }
      else {
        throw new GubuError('shape', err, ctx)
      }
    }

    return root['']
  } as GubuShape


  // TODO: test Number, String, etc also in arrays
  gubuShape.spec = () => {
    // Normalize spec, discard errors.
    gubuShape(undefined, { err: [] })
    // return JSON.parse(JSON.stringify(spec, (_key, val) => {
    return JSON.parse(stringify(spec.v[''], (_key: string, val: any) => {
      if (GUBU$ === val) {
        return true
      }
      return val
    }))
  }


  gubuShape.toString = () => {
    return `[Gubu ${opts.name}]`
  }

  return gubuShape
}

// function J(x: any) {
//   return null == x ? '' : JSON.stringify(x).replace(/"/g, '')
// }


function handleValidate(vf: Validate, sval: any, state: State): Update {
  let update: Update = { pass: true, done: false }
  if (undefined !== sval || state.node.r) {
    let valid = vf(sval, update, state)

    if (!valid || update.err) {
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
        state.terr.push(makeErr(
          w, sval, state.path, state.dI, state.node, 1040))
      }
      update.pass = false
    }
  }

  // console.log('HV', update)
  return update
}


function pathstr(path: string[], dI: number) {
  return path.slice(1, dI + 1).filter(s => null != s).join('.')
}


const Required: Builder = function(this: ValSpec, spec?: any) {
  let vs = buildize(this || spec)
  vs.r = true
  return vs
}

const Optional: Builder = function(this: ValSpec, spec?: any) {
  let vs = buildize(this || spec)
  vs.r = false
  return vs
}


// Optional value provides default.
const Any: Builder = function(this: ValSpec, spec?: any) {
  let vs = buildize(this || spec)
  vs.t = 'any'
  if (undefined !== spec) {
    vs.v = spec
  }
  return vs
}


const None: Builder = function(this: ValSpec, spec?: any) {
  let vs = buildize(this || spec)
  vs.t = 'none'
  return vs
}



const makeListBuilder = function(kind: string) {
  return function(this: ValSpec, ...specs: any[]) {
    let vs = buildize()
    vs.t = 'list'
    vs.u.list = {
      specs: specs.map(s =>
        buildize(s)).map(s => (
          s.u.list = {
            kind
          },
          s)),
      kind
    }
    return vs
  }
}

// Pass on first match. Short circuits.
const One: Builder = makeListBuilder('one')

// Pass if some match, but always check each one - does *not* short circuit.
const Some: Builder = makeListBuilder('some')

// Pass only if all match. Short circuits.
const All: Builder = makeListBuilder('all')




const Before: Builder = function(this: ValSpec, validate: Validate, spec?: any) {
  let vs = buildize(this || spec)
  vs.b = validate
  return vs
}


const After: Builder = function(this: ValSpec, validate: Validate, spec?: any) {
  let vs = buildize(this || spec)
  // vs.t = vs.t || 'custom'
  vs.a = validate
  return vs
}



// TODO: array needs special handling as first entry is type spec
const Closed: Builder = function(this: ValSpec, spec?: any) {
  let vs = buildize(this || spec)

  vs.b = (val: any, update: Update, state: State) => {
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

      for (let k of vkeys) {
        if (undefined === allowed[k]) {
          update.err =
            makeErr('closed', val, state.path, state.dI, vs, 3010, '', { k })
          return false
        }
      }
    }
    return true
  }

  return vs
}


const Define: Builder = function(this: ValSpec, inopts: any, spec?: any): ValSpec {
  let vs = buildize(this || spec)

  let opts = 'object' === typeof inopts ? inopts || {} : {}
  let name = 'string' === typeof inopts ? inopts : opts.name


  if (null != name && '' != name) {
    vs.b = (_val: any, _update: Update, state: State) => {
      let ref = state.ctx.ref = state.ctx.ref || {}
      ref[name] = state.node
      return true
    }
  }

  return vs
}


const Refer: Builder = function(this: ValSpec, inopts: any, spec?: any): ValSpec {
  let vs = buildize(this || spec)

  let opts = 'object' === typeof inopts ? inopts || {} : {}
  let name = 'string' === typeof inopts ? inopts : opts.name

  // Fill should be false (the default) if used recursively, to prevent loops.
  let fill = !!opts.fill

  // console.log('R0', opts, name, fill)

  if (null != name && '' != name) {
    vs.b = (val: any, update: Update, state: State) => {
      if (undefined !== val || fill) {
        let ref = state.ctx.ref = state.ctx.ref || {}

        if (undefined !== ref[name]) {
          // console.log('R1', ref[name])

          let node = { ...ref[name] }
          node.k = state.node.k
          node.t = node.t || 'none'

          update.node = node
          update.type = node.t

          // console.log('R3', update)
        }
      }

      // TODO: option to fail if ref not found?
      return true
    }
  }

  return vs
}


const Rename: Builder = function(this: ValSpec, inopts: any, spec?: any): ValSpec {
  let vs = buildize(this || spec)

  let opts = 'object' === typeof inopts ? inopts || {} : {}
  let name = 'string' === typeof inopts ? inopts : opts.name

  if (null != name && '' != name) {
    vs.a = (val: any, _update: Update, state: State) => {
      state.src[name] = val

      if (!opts.keep) {
        delete state.src[state.key]
      }

      return true
    }
  }

  return vs
}




function buildize(invs?: any): ValSpec {
  let vs = norm(invs)
  return Object.assign(vs, {
    Required,
    Optional,
    Any,
    Closed,
    Before,
    After,
  })
}


function gubuError(val: any, state: State, text?: string, why?: string) {
  return makeErr(
    why || 'custom',
    val,
    state.path,
    state.dI,
    state.node,
    4000,
    text,
  )
}

function makeErr(
  why: string,
  sval: any,
  path: string[],
  dI: number,
  node: ValSpec,
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
            'none' === why ? 'no value is allowed' :
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
    return JSON.stringify(x, (key: any, val: any) => {
      if (r) {
        val = r(key, val)
      }
      if ('bigint' === typeof (val)) {
        val = val.toString()
      }
      return val
    })
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
  { spec: () => any }


Object.assign(make, {
  After,
  All,
  Any,
  Before,
  Closed,
  Define,
  None,
  One,
  Optional,
  Rename,
  Required,
  Some,
})


type Gubu = typeof make & {
  desc: () => any

  After: typeof After
  All: typeof All
  Any: typeof Any
  Before: typeof Before
  Closed: typeof Closed
  Define: typeof Define
  None: typeof None
  One: typeof One
  Optional: typeof Optional
  Refer: typeof Refer
  Rename: typeof Rename
  Required: typeof Required
  Some: typeof Some
}

Object.defineProperty(make, 'name', { value: 'gubu' })


const G$ = (spec: any): ValSpec => norm({ ...spec, $: { gubu$: true } })


const gubu: Gubu = (make as Gubu)


const GAfter = After
const GAll = All
const GAny = Any
const GBefore = Before
const GClosed = Closed
const GDefine = Define
const GNone = None
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
  ValSpec,
  State,
}

export {
  gubu,
  G$,
  norm,
  buildize,
  gubuError,

  After,
  All,
  Any,
  Before,
  Closed,
  Define,
  None,
  One,
  Optional,
  Refer,
  Rename,
  Required,
  Some,

  GAfter,
  GAll,
  GAny,
  GBefore,
  GClosed,
  GDefine,
  GNone,
  GOne,
  GOptional,
  GRefer,
  GRename,
  GRequired,
  GSome,

}


