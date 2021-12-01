import { Jsonic } from 'jsonic'



type ValKind = 'any' | 'string' | 'number' | 'boolean' | 'object'

type ValSpec = {
  $: 1
  t: ValKind
  p: string
  v: any
}


function make(inspec?: any) {
  let spec: ValSpec = {
    $: 1, // TODO: move to prototype
    t: 'object',
    p: '',
    v: inspec || {}
  }
  console.log('\n===', J(spec))



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

      node = nodeStack[pI]

      while (+node) {
        pI = node
        node = nodeStack[pI]
      }

      sI = pI + 1

      cur = curStack[pI]

      console.log('BB', 'p=' + pI, 's=' + sI, node, cur)

      if (!node) {
        break
      }

      cN = 0
      pI = nI

      let keys = Object.keys(node.v)
      // console.log('K', keys)

      for (let k of keys) {
        let sval = cur[k]
        let stype = typeof (sval)

        let n = node.v[k]
        console.log('VTa', k, sval, stype, n)

        if (!n.$) {
          let nval = n
          let ntype = typeof (nval)

          n = node.v[k] = {
            $: 1,
            t: 'any',
            p: node.p + (0 < node.p.length ? '.' : '') + k,
            v: nval
          }

          if ('object' === ntype) {
            n.t = 'object'
          }
          else if ('function' === ntype) {
            n.t = nval.name.toUpperCase().substring(0, 3)
          }
          else if ('string' === ntype || 'number' === ntype || 'boolean' === ntype) {
            n.t = ntype
          }
        }

        // console.log('VTb', k, sval, stype, n)

        if ('object' === n.t) {
          nodeStack[nI] = n
          curStack[nI] = cur[k] = (cur[k] || {})
          nI++
          cN++
        }

        // type from default
        else if (undefined !== sval && n.t !== stype) {
          err.push({ ...n, s: sval })
        }

        // spec= k:1 // default
        else if (undefined === sval) {
          cur[k] = n.v
        }
      }

      if (0 < cN) {
        nodeStack[nI++] = sI
      }
      else {
        pI = sI
      }

      console.log('***')
      for (let i = 0; i < nodeStack.length; i++) {
        console.log(
          ('' + i).padStart(4),
          J(nodeStack[i]).substring(0, 111).padEnd(112),
          '/',
          J(curStack[i]).substring(0, 33).padEnd(34),
        )
      }

      console.log('END', 'c=' + cN, 's=' + sI, 'p=' + pI, 'n=' + nI)
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

export { gubu, Required, Optional, Custom }


