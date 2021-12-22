
const {
  Gubu,
  Custom,
  G$,
  One,
  Some,
  All,
  Closed,
  Rename,
  Required,
  Define,
  Refer,
  Optional,
} = require('../gubu')


function J(x,s) {
  console.log(null == x ? '' : JSON.stringify(x,null,s).replace(/"/g, ''))
}


// let a1 = Gubu({ a: 1 })
// J(a1({}))
// J(a1({a:'x'}))

// let ab1 = Gubu({ a: { b: 1 } })
// J(ab1({}))
// // J(ab1({a:{b:'x'}}))

// let ab1acX = Gubu({ a: { b: 1, c: 'X' } })
// J(ab1acX({}))
// // J(ab1acX({a:{b:'y',c:2}}))

// let abc1 = Gubu({ a: { b: { c: 1 } } })
// J(abc1({}))

// let ab1cd2 = Gubu({ a: { b: 1 }, c: { d: 2 } })
// J(ab1cd2({}))

// let abc1de2 = Gubu({ a: { b: { c: 1 } }, d: { e: 2 } })
// J(abc1de2({}))

// let abcd1ef2 = Gubu({ a: { b: { c: { d: 1 } } }, e: { f: 2 } })
// J(abcd1ef2({}))


// let x0 = Gubu({ a: { b: { c: { d: 1 }, x: { y: 3 } } }, e: { f: 2 } })
// J(x0({}))


// let x1 = Gubu({ a: { b: { c: { d: 1 }, x: { y: 3 } } }, e: { f: 2 }, g: { h: 4 } })
// J(x1({}))


// let x2 = Gubu({ a: { b: { c: { d: 1 }, x: { y: 3 } } }, e: { f: {m:5}, ff:{mm:55} }, g: { h: 4 } })
// J(x2({}))
// J(x2({}))



// let r0 = Gubu({ a: [Boolean] })
// J(r0({a:[false, true]}))


// let r1 = Gubu({ a: [{x:1,y:{z:2}}] })
// J(r1({a:[{},{x:11},{x:11,y:{}},{x:11,y:{z:22}}]}))

// let gt10 = (v)=>10<v
// let gt10m2 = (v,u)=>10<v ? !!(u.val=v*2) : false

// // let d0 = Gubu({ a: Custom((v)=>10<v) })
// let d0 = Gubu({ a: (v)=>10<v })
// let d0 = Gubu({ a: gt10m2 })
// J(d0({a:11}))
// J(d0({a:9}))



// let e0 = Gubu({ a: { b: 1 } })
// let e0 = Gubu({ a: { b: { c: 1, cc: 2 } }, d: { e: 3 } })
// J(e0({d:{e:'x'}}))


// let d0 = Gubu({ a: G$({type:'string'}) })
// J(d0({a:'x'}))
// J(d0({a:1}))


// let o0 = Gubu({ a: One(String,Number) })
// // let o0 = Gubu({ a: One(String) })
// J(o0({a:'x'}))
// J(o0({a:1}))
// J(o0({a:true}))


// let log = []
// let s0 = Gubu({ a: Some(
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
// let s0 = Gubu({ a: All(
//   Custom((x)=>(log.push(10),x>10)),
//   Custom((x)=>(log.push(20),x>20))
// )})

// log = []
// J(s0({a:22}))
// console.log(log)

// // J(s0({a:11}))
// J(s0({a:5}))


// let c0 = Gubu({ a: Closed({x:1,y:2}) })
// J(c0({a:{x:1,y:2}}))
// J(c0({a:{x:1,y:2,z:3}}))



// let r0 = Gubu({ a: Rename('b',{x:1}) })
// J(r0({a:{x:1}}))


// let r1 = Gubu(One(
//   [Number,String],
//   [String]
// ))
// J(r0({a:{x:1}}))



// let a0 = Gubu({ a: [String,1,'x'] })
// J(a0({a:[2,'y']}))
// J(a0({a:[2,'y','z']}))
// J(a0({a:[2,'y',true]}))



// let r0 = Gubu({ a: Required({x:1}) })
// J(r0({a:{x:2}}))
// J(r0({}))


// let r1 = Gubu({ a: Required([Number]) })
// J(r1({a:[1]}))
// J(r1({}))


// let r0 = Gubu({ a: {x:1} })
// J(r0({a:{x:2}}))
// J(r0({a:true}))


// let r0 = Gubu({ a: [{x:Number}] })
// J(r0({a:[{x:1},{x:2}]}))
// J(r0({a:true}))

// let e0 = Gubu({ a: Number })

// try {
//   J(e0({a:'x'}))
// }
// catch(e) {
//   console.log(e)
//   console.log(e.desc())
// }



//let d0 = Gubu({ a: Define('A',{x:1}), b: Refer({'A'}) })
//let d0 = Gubu({ a: Define('A',{x:1}), b: Refer({name:'A',fill:true}) })
//J(d0({a:{x:2},b:{}}))
//J(d0({a:{x:2}}))
//J(d0({a:{x:2},b:{x:'z'}}))


// let o0 = Gubu({ a: Optional({x:1}) })
// J(o0({a:{}}))
// J(o0({}))



// let d1 = Gubu({
//   a: Define('A',{
//     b: {
//       c: 1,
//       a: Refer('A')
//       // a:{b:{c:11}}
//     }
//   }),
// })
// J(d1({
//   a:{
//     b: {
//       c: 2,
//       a: {
//         b: {
//           c: '3'
//         }
//       }
//     }
//   }
// }),2)


// let n0 = Gubu(Number)
// console.log(n0(1))


// let n0 = Gubu({a:1})
// console.log(n0({}))
// console.log(n0({a:undefined}))


// let n1 = Gubu({a:undefined})
// console.log(n1({}))
// console.log(n1({a:undefined}))


// let n2 = Gubu({a:Required(null)})
// // console.log(n2({}))
// // console.log(n2({a:undefined}))


// let n3 = Gubu({a:Required(
//   undefined
// )})
// // console.log(n3.spec())
// console.log(n3({a:undefined}))
// // console.log(n3({}))


let d0 = Gubu({a:1})
console.log(d0({a:/x/}))



