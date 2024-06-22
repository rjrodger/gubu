

const {
  Gubu,
  Args,
  G$,
  nodize,
  stringify,
  One,
  Some,
  All,
  Closed,
  Rename,
  Required,
  Define,
  Default,
  Refer,
  Skip,
  Empty,
  Exact,
  Never,
  Value,
  Min,
  Max,
  Above,
  Below,
  Any,
  Check,
  Open,
  Key,
  Child,
  Optional,
  expr,
  build,
} = require('../gubu')

function D(x) { console.dir(x,{depth:null}) }

function J(x,s) {
  console.log(null == x ? '' : JSON.stringify(x,null,s).replace(/"/g, ''))
}

let tmp = {}


let log = (point,state)=>{
  console.log(
    'LOG',
    point,
    'd='+state.dI,
    // 'p='+state.pI,
    state.path.slice(1,state.dI+1).join('.'),
    'kv'===point?(state.key+'='+state.val):'',
    // 'kv'===point?state:'',
    ''
  )
}


// // class Foo {}

// let aR = /a/
// console.log(typeof aR)
// console.log(aR.constructor)


// // console.log(RegExp)
// // console.log(RegExp.constructor)


// let g1 = Gubu({a:Optional(/x/)})
// // let g1 = Gubu({a:Foo})
// // let g1 = Gubu({a:RegExp})

// console.log(g1.stringify())
// D(g1.spec())
// console.log(g1({a:'x'}))
// console.log(g1({}))
// // console.log(g1({a:1}))
// console.log(g1({a:'y'}))


// console.dir(Gubu({a:expr({src:'Min(2,Max(4, String))'})}).spec(),{depth:null})
// console.log(Gubu({a:expr({src:'Min(2,Max(4, String))'})}).stringify(null,true))

// console.log(Gubu({a:expr({src:'Min(2) Max(4) String'})}).stringify(null,true))
//console.log(Gubu({a:expr({src:'Min(2) Max(4) String()'})}).spec())

// console.log(Gubu({a:expr({src:'Min(2).Max(4).String'})}).stringify(null,true))
// console.log(Gubu({a:expr({src:'Min(2).Max(4).String'})}).spec())



// does Min(1, Max(2)) == Min(1).Max(2) ?


// console.log(Gubu(Min(1, Max(2, String))).spec())
// console.log(Gubu(Min(1).Max(2, String)).spec())
// console.log(Gubu(Min(1)).spec())


// console.dir(Gubu({a:expr({src:'Child(Number)'})}).spec(),{depth:null})

// const g2 = Gubu({a: Child(Number,{x:'q'})})
// const g2 = Gubu({'a: Child(Number)':{x:'q'}})
// const g2 = Gubu({'a: Number':1})
// const g2 = Gubu({a:1})
// const g2 = Gubu({'a:Number':1})
// const g2 = Gubu({a:Min(1,2)})
// const g2 = Gubu({'a:Min(1) Max(3)':1})
// const g2 = Gubu({a:2})
// console.dir(g2.spec(),{depth:null})
// console.log('==========')
// console.log(g2({ a: 3 }))
// console.log(g2({}))



// const s0 = build('Min(1)')
// // console.log(s0)
// const g0 = Gubu(s0)
// console.log(g0.stringify())


// const s1 = build('Min(1).Max(3)')
// // console.log(s1)
// const g1 = Gubu(s1)
// console.log(g1.stringify())


// const s2 = build({a:'Min(1)'})
// // console.log(s2)
// const g2 = Gubu(s2)
// console.log(g2.stringify())


// const s3 = build({a:'String().Min(1)'})
// // console.log(s3)
// const g3 = Gubu(s3)
// console.log(g3.stringify())


// const s3a = build({a:'String.Min(1)'})
// // console.log(s3a)
// const g3a = Gubu(s3a)
// console.log(g3a.stringify())


// const s3b = build({a:'Min(1).String()'})
// // console.log(s3b)
// const g3b = Gubu(s3b)
// console.log(g3b.stringify())


// const s3c = build({a:'Min(1).String'})
// // console.log(s3c)
// const g3c = Gubu(s3c)
// console.log(g3c.stringify())


// const s3d = build({a:'Min(1,String)'})
// // console.log(s3d)
// const g3d = Gubu(s3d)
// console.log(g3d.stringify())


// const s4 = build(['String().Min(1)'])
// // console.log(s4)
// const g4 = Gubu(s4)
// // console.log(g4.spec())
// console.log(g4.stringify())


// const s5 = build(['String.Min(1)'])
// // console.log(s5)
// const g5 = Gubu(s5)
// console.log(g5.stringify())

// let gr = Gubu(Child(Number))
// let gx = Gubu.expr('Child(Number)')
// console.log(gx)
// let gr = Gubu(gx)
// console.log(gr.spec())
// console.log(gr({x:1}))

// let g1 = Gubu({
//   // a: Child(Number,{}),
//   'a: Child(Number)': {}
//   // 'a: Number':1
// })
// console.dir(g1.spec(),{depth:null})
// // console.log(g1({ a: { x: 1 } }))

/*
let g1 =
    // Gubu(Open({
    //   a: 1,
    //   b: 2,
    // }))
    Gubu({
      a: 1,
      // $$: 'Open',
      b: 2,
      // 'd:Child($$z)':0,
      d:{
      $$:'Child($$z)',
      $$z: {x:Number},
      e:3
      },

    }, {keyspec:{active:true}})

// console.dir(g1,{depth:null})
// console.dir(g1.spec(),{depth:null})
console.log(g1.stringify())
console.log(g1({ a: 11 }))
console.log(g1({ a: 11, d: {f:{x:22}} }))
console.log(g1({ a: 11, d: {f:{x:'X'}} }))
*/

let m0 =
    // Child(Number)
    // Max(2,Number)
    // One(Number,String)
    One(Number,{x:1})
let g0 = Gubu({a:m0})
console.dir(g0.spec(),{depth:null})
console.dir(g0.node(),{depth:null})
// console.dir(g0.node().v.a.b,{depth:null})
let j0 = g0.jsonify()
console.log(j0)
//let s0 = g0.stringify()
//console.log(s0)
let b0 = Gubu.build(j0)
console.dir(b0.spec(),{depth:null})
console.log(b0.jsonify())
