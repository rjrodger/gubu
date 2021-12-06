
const {
  gubu,
  Custom,
  G$,
  One,
  Some,
  All,
  Closed,
  Rename,
  Required,
} = require('../gubu')


function J(x) {
  console.log(null == x ? '' : JSON.stringify(x).replace(/"/g, ''))
}


// let a1 = gubu({ a: 1 })
// J(a1({}))
// J(a1({a:'x'}))

// let ab1 = gubu({ a: { b: 1 } })
// J(ab1({}))
// // J(ab1({a:{b:'x'}}))

// let ab1acX = gubu({ a: { b: 1, c: 'X' } })
// J(ab1acX({}))
// // J(ab1acX({a:{b:'y',c:2}}))

// let abc1 = gubu({ a: { b: { c: 1 } } })
// J(abc1({}))

// let ab1cd2 = gubu({ a: { b: 1 }, c: { d: 2 } })
// J(ab1cd2({}))

// let abc1de2 = gubu({ a: { b: { c: 1 } }, d: { e: 2 } })
// J(abc1de2({}))

// let abcd1ef2 = gubu({ a: { b: { c: { d: 1 } } }, e: { f: 2 } })
// J(abcd1ef2({}))


// let x0 = gubu({ a: { b: { c: { d: 1 }, x: { y: 3 } } }, e: { f: 2 } })
// J(x0({}))


// let x1 = gubu({ a: { b: { c: { d: 1 }, x: { y: 3 } } }, e: { f: 2 }, g: { h: 4 } })
// J(x1({}))


// let x2 = gubu({ a: { b: { c: { d: 1 }, x: { y: 3 } } }, e: { f: {m:5}, ff:{mm:55} }, g: { h: 4 } })
// J(x2({}))
// J(x2({}))



// let r0 = gubu({ a: [Boolean] })
// J(r0({a:[false, true]}))


// let r1 = gubu({ a: [{x:1,y:{z:2}}] })
// J(r1({a:[{},{x:11},{x:11,y:{}},{x:11,y:{z:22}}]}))

// let gt10 = (v)=>10<v
// let gt10m2 = (v,u)=>10<v ? !!(u.val=v*2) : false

// // let d0 = gubu({ a: Custom((v)=>10<v) })
// let d0 = gubu({ a: (v)=>10<v })
// let d0 = gubu({ a: gt10m2 })
// J(d0({a:11}))
// J(d0({a:9}))



// let e0 = gubu({ a: { b: 1 } })
// let e0 = gubu({ a: { b: { c: 1, cc: 2 } }, d: { e: 3 } })
// J(e0({d:{e:'x'}}))


// let d0 = gubu({ a: G$({type:'string'}) })
// J(d0({a:'x'}))
// J(d0({a:1}))


// let o0 = gubu({ a: One(String,Number) })
// // let o0 = gubu({ a: One(String) })
// J(o0({a:'x'}))
// J(o0({a:1}))
// J(o0({a:true}))


// let log = []
// let s0 = gubu({ a: Some(
//   Custom((x)=>(log.push(10),x>10)),
//   Custom((x)=>(log.push(20),x>20))
// )})
// J(s0({a:11}))
// console.log(log)

// log = []
// J(s0({a:22}))
// console.log(log)

// J(s0({a:5}))


// let log = []
// let s0 = gubu({ a: All(
//   Custom((x)=>(log.push(10),x>10)),
//   Custom((x)=>(log.push(20),x>20))
// )})

// log = []
// J(s0({a:22}))
// console.log(log)

// // J(s0({a:11}))
// J(s0({a:5}))


// let c0 = gubu({ a: Closed({x:1,y:2}) })
// J(c0({a:{x:1,y:2}}))
// J(c0({a:{x:1,y:2,z:3}}))



// let r0 = gubu({ a: Rename('b',{x:1}) })
// J(r0({a:{x:1}}))


// let r1 = gubu(One(
//   [Number,String],
//   [String]
// ))
// J(r0({a:{x:1}}))



// let a0 = gubu({ a: [String,1,'x'] })
// J(a0({a:[2,'y']}))
// J(a0({a:[2,'y','z']}))
// J(a0({a:[2,'y',true]}))



// let r0 = gubu({ a: Required({x:1}) })
// J(r0({a:{x:2}}))
// J(r0({}))


// let r1 = gubu({ a: Required([Number]) })
// J(r1({a:[1]}))
// J(r1({}))


// let r0 = gubu({ a: {x:1} })
// J(r0({a:{x:2}}))
// J(r0({a:true}))


// let r0 = gubu({ a: [{x:Number}] })
// J(r0({a:[{x:1},{x:2}]}))
// J(r0({a:true}))

let e0 = gubu({ a: Number })

try {
  J(e0({a:'x'}))
}
catch(e) {
  console.log(e)
  console.log(e.desc())
}
