import { Jsonic } from 'jsonic'


/*
 * NOTE: `undefined` is not considered a value or type, and thus means 'any'.
 */


// TODO: freeze
const GUBU = { gubu$: true }

type ValType =
  'any' |
  'custom' |
  'null' |   // TODO: test
  'string' |
  'number' |
  'boolean' |
  'object' |
  'array' |
  'bigint' |
  'symbol' |
  'function'

type ArrayKind =
  '' |        // Not an array.
  'fill' |    // Fill empty array with defaults.
  'empty'     // Leave empty array empty.

type ValSpec = {
  $: typeof GUBU
  t: ValType
  a: ArrayKind
  d: number // Depth.
  v: any
  c: {
    r: boolean // Value is required.
  },
  k: string    // Key of this node.
  f?: Validate // Custom validation function.
}


type Builder = (spec?: any) => ValSpec & { [name: string]: Builder | any }


type Validate = (val: any, update: Update, state: State) => boolean

type State = {
  key: string
  node: ValSpec
  dI: number
  nI: number
  sI: number
  pI: number
  cN: number
  nodes: (ValSpec | number)[]
  srcs: any[]
  path: string[]
  err: any[]
}

type Update = {
  val?: any
  nI?: number
  sI?: number
  pI?: number
  cN?: number
  err?: boolean | any // TODO: ErrSpec | ErrSpec[]
}


// TODO: put to work!
type ErrSpec = {}


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



function G$(opts: any): ValSpec {
  let vs = norm()

  if (null != opts) {
    // TODO: self validate to generate a normed spec!
  }

  return vs
}


function norm(spec?: any): ValSpec {
  if (GUBU === spec?.$) return spec

  let t: ValType | 'undefined' = null === spec ? 'null' : typeof (spec)
  t = (undefined === t ? 'any' : t) as ValType

  let v = spec
  let a: ArrayKind = ''
  let r = false // Optional by default
  let d = undefined

  if ('object' === t && Array.isArray(spec)) {
    t = 'array'

    // defaults: [,<spec>] -> [], [<spec>] -> [<spec>]
    a = undefined === spec[0] ? 'empty' : 'fill'
  }

  else if ('function' === t) {
    if (IS_TYPE[spec.name]) {
      t = (spec.name.toLowerCase() as ValType)
      r = true
      v = EMPTY_VAL[t]
    }
    else {
      t = 'custom'
      d = spec
    }
  }

  let vs: ValSpec = {
    $: GUBU,
    t,
    a,
    v,
    c: {
      r
    },
    k: '',
    d: -1,
  }

  if (d) {
    vs.f = d
  }

  return vs
}


function make(inspec?: any) {
  let spec: ValSpec = norm(inspec) // Tree of validation nodes.

  return function gubu<T>(inroot?: T): T {
    const root: any = inroot || {}

    const nodes: (ValSpec | number)[] = [spec, -1]
    const srcs: any[] = [root, -1]
    const path: string[] = []

    let dI: number = 0
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
      if (node.a) {
        if (0 < src.length) {
          keys = Object.keys(src)
        }
        else if ('empty' === node.a) {
          keys = []
        }
      }

      for (let key of keys) {
        path[dI] = key
        let sval = src[key]
        let stype = typeof (sval)

        let n = node.v['array' === node.t ? 0 : key]
        // console.log('VTa', k, sval, stype, n)

        // TODO: add node parent
        let vs: ValSpec = GUBU === n.$ ? n : (node.v[key] = norm(n))
        vs.k = key
        vs.d = dI

        // TODO: won't work with multiple nested arrays - use a path stack
        // let p = n.p + (n.p.endsWith('.') ? k : '')
        // let p = key
        let t = vs.t


        if ('custom' === t && vs.f) {
          let update: Update = {}
          let valid = vs.f(sval, update, {
            dI, nI, sI, pI, cN, key, node: vs, nodes, srcs, path, err
          })

          if (!valid || update.err) {
            let w = 'custom'
            let p = pathstr(path, dI)
            let f = null == vs.f.name || '' === vs.f.name ?
              vs.f.toString().replace(/\r?\n/g, ' ').substring(0, 33) :
              vs.f.name

            if ('object' === typeof (update.err)) {
              err.push(...[update.err].flat().map(e => {
                e.p = null == e.p ? p : e.p
                e.f = null == e.f ? f : e.f
                return e
              }))
            }
            else {
              err.push({ node: vs, s: sval, p, w, f })
            }
          }
          else {
            if (undefined !== update.val) {
              sval = src[key] = update.val
            }
            nI = undefined === update.nI ? nI : update.nI
            sI = undefined === update.sI ? sI : update.sI
            pI = undefined === update.pI ? pI : update.pI
            cN = undefined === update.cN ? cN : update.cN
          }
        }
        else if ('object' === t) {
          nodes[nI] = vs
          // TODO: err if obj required
          srcs[nI] = src[key] = (src[key] || {})
          nI++
          cN++
        }

        else if ('array' === t) {
          nodes[nI] = vs
          srcs[nI] = src[key] = (src[key] || [])
          nI++
          cN++
        }

        // type from default
        else if ('any' !== t && undefined !== sval && t !== stype) {
          err.push({ node: vs, s: sval, p: pathstr(path, dI), w: 'type' })
        }

        // spec= k:1 // default
        else if (undefined === sval) {
          if (vs.c.r) {
            err.push({ node: vs, s: sval, p: pathstr(path, dI), w: 'required' })
          }
          // NOTE: `undefined` is special and cannot be set
          else if (undefined !== vs.v) {
            src[key] = vs.v
          }
        }
      }

      if (0 < cN) {
        nodes[nI++] = sI
      }
      else {
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

    // TODO: collect errors
    if (0 < err.length) {
      throw new Error('gubu: ' + JSON.stringify(err))
    }

    return root
  }
}

function J(x: any) {
  return null == x ? '' : JSON.stringify(x).replace(/"/g, '')
}


function pathstr(path: string[], dI: number) {
  return path.slice(1, dI + 1).filter(s => null != s).join('.')
}


const Required: Builder = function(this: ValSpec, spec?: any) {
  let vs = buildize(this || spec)
  vs.c.r = true
  return vs
}

const Optional: Builder = function(this: ValSpec, spec?: any) {
  let vs = buildize(this || spec)
  vs.c.r = false
  return vs
}


const Any: Builder = function(this: ValSpec, spec?: any) {
  let vs = buildize(this || spec)
  vs.t = 'any'
  vs.c.r = true === spec // Special convenience
  return vs
}




function Custom(validate: Validate) {
  let vs = buildize()
  vs.t = 'custom'
  vs.f = validate
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


Object.assign(make, {
  Required,
  Optional,
  Custom,
})


type Gubu = typeof make & {
  Required: typeof Required,
  Optional: typeof Optional,
  Custom: typeof Custom,
}

Object.defineProperty(make, 'name', { value: 'gubu' })

const gubu: Gubu = (make as Gubu)

export {
  gubu,
  G$,
  norm,
  buildize,
  Required,
  Optional,
  Any,
  Custom
}


