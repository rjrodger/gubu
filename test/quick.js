
const { gubu } = require('../gubu')


function J(x) {
  console.log(null == x ? '' : JSON.stringify(x).replace(/"/g, ''))
}


let a1 = gubu({ a: 1 })
J(a1({}))

let ab1 = gubu({ a: { b: 1 } })
J(ab1({}))

let abc1 = gubu({ a: { b: { c: 1 } } })
J(abc1({}))

let ab1cd2 = gubu({ a: { b: 1 }, c: { d: 2 } })
J(ab1cd2({}))

let abc1de2 = gubu({ a: { b: { c: 1 } }, d: { e: 2 } })
J(abc1de2({}))

let abcd1ef2 = gubu({ a: { b: { c: { d: 1 } } }, e: { f: 2 } })
J(abcd1ef2({}))


let x0 = gubu({ a: { b: { c: { d: 1 }, x: { y: 3 } } }, e: { f: 2 } })
J(x0({}))


let x1 = gubu({ a: { b: { c: { d: 1 }, x: { y: 3 } } }, e: { f: 2 }, g: { h: 4 } })
J(x1({}))


let x2 = gubu({ a: { b: { c: { d: 1 }, x: { y: 3 } } }, e: { f: {m:5}, ff:{mm:55} }, g: { h: 4 } })
J(x2({}))


