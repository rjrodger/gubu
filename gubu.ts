import { Jsonic } from 'jsonic'


/*
 * NOTE: `undefined` is not considered a value or type, and thus means 'any'.
 */


const GUBU = { gubu$: true }

type ValType =
  'any' |
  'null' |
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
  // p: string
  v: any
  c: {
    r: boolean // required
  }
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

  let a: ArrayKind = ''
  let r = false // Optional by default

  if ('object' === t && Array.isArray(spec)) {
    t = 'array'

    // defaults: [,<spec>] -> [], [<spec>] -> [<spec>]
    a = undefined === spec[0] ? 'empty' : 'fill'
  }

  else if ('function' === t) {
    if (IS_TYPE[spec.name]) {
      t = (spec.name.toLowerCase() as ValType)
      r = true
    }
  }

  let vs: ValSpec = {
    $: GUBU,
    t,
    a,
    // p: '',
    v: spec,
    c: {
      r
    }
  }

  return vs
}




function make(inspec?: any) {
  let spec: ValSpec = norm(inspec)


  return function gubu<T>(insrc?: T): T {
    let src: any = insrc || {}

    const root: any = src

    const nodeStack: any[] = [spec, -1]
    const curStack: any[] = [root, -1]

    let nI: number = 2
    let pI: number = 0
    let sI: number = -1
    let cN: number = 0

    let err: any = []
    let node: any
    let cur: any

    // Iterative depth-first traversal of the spec.
    while (true) {

      // Dereference the back pointers to ancestor siblings.
      // Only objects|arrays can be nodes, so a number is a back pointer.
      // NOTE: terminates because (+{...} -> NaN, +[] -> 0) -> false (JS wat FTW!)
      node = nodeStack[pI]
      while (+node) {
        pI = node
        node = nodeStack[pI]
      }

      sI = pI + 1

      cur = curStack[pI]

      // console.log('BB', 'p=' + pI, 's=' + sI, node, cur)

      if (!node) {
        break
      }

      cN = 0
      pI = nI

      let keys = Object.keys(node.v)

      if (node.a) {
        if (0 < cur.length) {
          keys = Object.keys(cur)
        }
        else if ('empty' === node.a) {
          keys = []
        }
      }
      // let keys = Object.keys('array' === node.t ? cur : node.v)
      // console.log('K', keys)

      for (let k of keys) {
        let sval = cur[k]
        let stype = typeof (sval)

        let n = node.v['array' === node.t ? 0 : k]
        // console.log('VTa', k, sval, stype, n)

        if (GUBU !== n.$) {
          n = node.v[k] = norm(n)
        }

        // TODO: won't work with multiple nested arrays - use a path stack
        // let p = n.p + (n.p.endsWith('.') ? k : '')
        let p = k

        if ('object' === n.t) {
          nodeStack[nI] = n
          curStack[nI] = cur[k] = (cur[k] || {})
          nI++
          cN++
        }

        else if ('array' === n.t) {
          nodeStack[nI] = n
          curStack[nI] = cur[k] = (cur[k] || [])
          nI++
          cN++
        }

        // type from default
        else if (undefined !== sval && n.t !== stype) {
          err.push({ ...n, s: sval, p })
        }

        // spec= k:1 // default
        else if (undefined === sval) {
          if (n.c.r) {
            err.push({ ...n, s: sval, p, w: 'required' })
          }
          else {
            cur[k] = n.v
          }
        }
      }

      if (0 < cN) {
        nodeStack[nI++] = sI
      }
      else {
        pI = sI
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


function Required(term?: any) { }

function Optional(term?: any) { }

function Custom(handler?: any) { }


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
  Required,
  Optional,
  Custom
}


