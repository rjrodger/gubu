// import { Jsonic } from 'jsonic'


/*
 * NOTE: `undefined` is not considered a value or type, and thus means 'any'.
 */


import Pkg from './package.json'





// TODO: freeze
const GUBU$ = Symbol.for('gubu$')
const GUBU = { gubu$: GUBU$, version: Pkg.version }

type ValType =
  'any' |
  'custom' |
  'null' |   // TODO: test
  'list' |
  'string' |
  'number' |
  'boolean' |
  'object' |
  'array' |
  'bigint' |
  'symbol' |
  'function'

type ValSpec = {
  $: typeof GUBU
  t: ValType
  d: number    // Depth.
  v: any
  r: boolean   // Value is required.
  k: string    // Key of this node.
  f?: Validate // Custom validation function.
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
  val?: any
  nI?: number
  sI?: number
  pI?: number
  cN?: number
  err?: boolean | any // TODO: ErrSpec | ErrSpec[]
  why?: string
}


// TODO: put to work!
type ErrSpec = {
  node: ValSpec // Failing spec node.
  s: any        // Failing src value.
  p: string     // Key path to src value.
  w: string     // Error code ("why").
  m: number     // Error mark for debugging.
  t: string     // Error message text.
}


const IS_TYPE: { [name: string]: boolean } = {
  String: true,
  Number: true,
  Boolean: true,
  Object: true,
  Array: true,
  Function: true,
}


const EMPTY_VAL: { [name: string]: any } = {
  string: '',
  number: 0,
  boolean: false,
  object: {},
  array: [],
  function: () => undefined,
}





function norm(spec?: any): ValSpec {
  if (null != spec && spec.$?.gubu$) {
    if (GUBU$ === spec.$.gubu$) {
      return spec
    }
    else if (true === spec.$.gubu$) {
      let vs = { ...spec }
      vs.$ = { ...vs.$, gubu$: GUBU$ }
      vs.v = (null != vs.v && 'object' === typeof (vs.v)) ? { ...vs.v } : vs.v

      if (vs.u.list?.specs) {
        vs.u.list.specs = [...vs.u.list.specs]
      }
      return vs
    }
  }

  let t: ValType | 'undefined' = null === spec ? 'null' : typeof (spec)
  t = (undefined === t ? 'any' : t) as ValType

  let v = spec
  let r = false // Optional by default
  let f = undefined

  if ('object' === t && Array.isArray(spec)) {
    t = 'array'
  }

  else if ('function' === t) {
    if (IS_TYPE[spec.name]) {
      t = (spec.name.toLowerCase() as ValType)
      r = true
      v = EMPTY_VAL[t]
    }
    else {
      t = 'custom'
      f = spec
    }
  }

  let vs: ValSpec = {
    $: GUBU,
    t,
    v: (null != v && 'object' === typeof (v)) ? { ...v } : v,
    r,
    k: '',
    d: -1,
    u: {},
  }

  if (f) {
    vs.f = f
  }

  return vs
}


function make(inspec?: any): GubuSchema {
  let spec: ValSpec = norm(inspec) // Tree of validation nodes.

  let gubuSchema = function GubuSchema<T>(inroot?: T, inctx?: any): T {
    const ctx: any = inctx || {}
    const root: any = inroot || {}

    const nodes: (ValSpec | number)[] = [spec, -1]
    const srcs: any[] = [root, -1]
    const path: string[] = [] // Key path to current node.

    let dI: number = 0  // Node depth.
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

      path[dI++] = node.k

      cN = 0
      pI = nI

      let keys = Object.keys(node.v)

      // Treat array indexes as keys.
      if ('array' === node.t) {
        keys = Object.keys(src)
      }

      for (let key of keys) {
        path[dI] = key
        let sval = src[key]
        let stype = typeof (sval)

        // First array entry is general type spec.
        // Following are special case elements offset by +1
        let vkey = node.y ? 1 + parseInt(key) : key
        let n = node.v[vkey]

        if (undefined === n && 'array' === node.t) {
          n = node.v[0]

          // No first element defining element type spec, so use Any.
          if (null == n) {
            n = node.v[0] = Any()
          }
          key = '' + 0
        }
        else {
          key = '' + vkey
        }

        let tvs: ValSpec = GUBU$ === n.$?.gubu$ ? n : (n = node.v[key] = norm(n))
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

          vs = GUBU$ === vs.$?.gubu$ ? vs : (vss[vsI] = norm(vs))

          let t = vs.t
          let pass = true

          if (vs.b) {
            let update = handleValidate(vs.b, sval, {
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

          if ('custom' === t && vs.f) {
            let update = handleValidate(vs.f, sval, {
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
          else if ('object' === t) {
            if (vs.r && null == sval) {
              terr.push(makeErr('required', sval, path, dI, vs, 1010))
            }
            else if (null != sval && ('object' !== stype || Array.isArray(sval))) {
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
            if (vs.r && null == sval) {
              terr.push(makeErr('required', sval, path, dI, vs, 1030))
            }
            else if (null != sval && !Array.isArray(sval)) {
              terr.push(makeErr('type', sval, path, dI, vs, 1040))
            }
            else {
              nodes[nI] = vs
              srcs[nI] = src[key] = (src[key] || [])
              nI++
              cN++
            }
          }

          // type from default
          else if ('any' !== t && undefined !== sval && t !== stype) {
            terr.push(makeErr('type', sval, path, dI, vs, 1050))
            pass = false
          }

          // spec= k:1 // default
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
        // TODO: GubuError
        let ex: any = new Error(err.map((e: ErrSpec) => e.t).join('\n'))
        ex.err = err
        throw ex
      }
    }

    return root
  } as GubuSchema


  gubuSchema.spec = () => {
    // Normalize spec, discard errors.
    gubuSchema(undefined, { err: [] })
    return JSON.parse(JSON.stringify(spec, (_key, val) => {
      if (GUBU$ === val) {
        return true
      }
      return val
    }))
  }

  return gubuSchema
}

// function J(x: any) {
//   return null == x ? '' : JSON.stringify(x).replace(/"/g, '')
// }


function handleValidate(vf: Validate, sval: any, state: State): Update {
  let update: Update = { pass: true }
  let valid = vf(sval, update, state)

  if (!valid || update.err) {
    let w = update.why || 'custom'
    let p = pathstr(state.path, state.dI)
    let f = null == vf.name || '' === vf.name ?
      vf.toString().replace(/\r?\n/g, ' ').substring(0, 33) :
      vf.name

    if ('object' === typeof (update.err)) {
      // Assumes makeErr already called
      state.terr.push(...[update.err].flat().map(e => {
        e.p = null == e.p ? p : e.p
        e.f = null == e.f ? f : e.f
        e.m = null == e.m ? 2010 : e.m
        return e
      }))
    }
    else {
      // state.terr.push({ node: state.node, s: sval, p, w, f, m: 2020 })
      state.terr.push(makeErr(w, sval, state.path, state.dI, state.node, 1040))
    }
    update.pass = false
  }

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


const Any: Builder = function(this: ValSpec, spec?: any) {
  let vs = buildize(this || spec)
  vs.t = 'any'
  vs.r = true === spec // Special convenience
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



function Custom(validate: Validate) {
  let vs = buildize()
  vs.t = 'custom'
  vs.f = validate
  return vs
}


// TODO: pure Before, After

// TODO: array needs special handling as first entry is type spec
const Closed: Builder = function(this: ValSpec, spec?: any) {
  let vs = buildize(this || spec)

  vs.b = (val: any, update: Update, state: State) => {
    if (null != val && 'object' === typeof (val)) {
      for (let k in val) {
        if (undefined === vs.v[k]) {
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
  })
}


function makeErr(
  w: string,
  s: any,
  path: string[],
  dI: number,
  n: ValSpec,
  m: number,
  t?: string,
  u?: any
): ErrSpec {
  let err: ErrSpec = {
    node: n,
    s,
    p: pathstr(path, dI),
    w,
    m,
    t: '',
  }

  if (null == t || '' === t) {
    let jstr = undefined === s ? '' : JSON.stringify(s)
    let valstr = jstr.replace(/"/g, '')
    valstr = valstr.substring(0, 77) + (77 < valstr.length ? '...' : '')
    err.t = `Validation failed for path "${err.p}" ` +
      `with value "${valstr}" because ` +

      ('type' === w ? `the value is not of type ${n.t}` :
        'required' === w ? `the value is required` :
          'closed' === w ? `the property "${u?.k}" is not allowed` :
            `checked "${w}" failed`) +
      '.'
  }

  return err
}



type GubuSchema =
  (<T>(inroot?: T, inctx?: any) => T) &
  { spec: () => any }


Object.assign(make, {
  Required,
  Optional,
  Custom,
  Any,
  One,
  Some,
  All,
  Closed,
  Rename,
})


type Gubu = typeof make & {
  desc: () => any
  Required: typeof Required
  Optional: typeof Optional
  Custom: typeof Custom
  Any: typeof Any
  One: typeof One
  Some: typeof Some
  All: typeof All
  Closed: typeof Closed
  Rename: typeof Rename
}

Object.defineProperty(make, 'name', { value: 'gubu' })


const G$type: { [name: string]: boolean } = {
  string: true,
  number: true,
  boolean: true,
  object: true,
  array: true,
  function: true,
}

const G$spec = make({
  type: (v: string, _u: Update, s: State) => {
    if (G$type[v]) {
      s.ctx.vs.t = v
      return true
    }
  },
  value: (v: string, _u: Update, s: State) => {
    s.ctx.vs.v = v
    return true
  },
  required: (v: string, _u: Update, s: State) => {
    s.ctx.vs.r = !!v
    return true
  },
})

function G$(spec: any): ValSpec {
  let vs = norm()

  if (null != spec) {
    G$spec(spec, { vs })
  }

  return vs
}




const gubu: Gubu = (make as Gubu)

export {
  gubu,
  G$,
  norm,
  buildize,
  Required,
  Optional,
  Any,
  Custom,
  One,
  Some,
  All,
  Closed,
  Rename,
}


