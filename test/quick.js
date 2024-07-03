

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

/*
let m0 =
    Open({})
    // Number
    //    Min(2,String)
    // Max(3, Min(1, Default(2)))
    // Max(3, Min(1, Required(Default(2))))
    // Max(3, Min(1, Default(2, Required())))
    // Min(2)
    // Child(Number)
    // Max(2,Number)
    // One(Number,String)
    // One(Number,{x:1}) // FIX
    // [Number]
    // [Number,String]
    // [{x:1}]
    // [{x:1},{y:Number}]
let g0 = Gubu({a:m0})
console.log(g0.node())
// console.dir(g0.spec(),{depth:null})
// console.log(g0({a:'AAA'}))
//console.dir(g0.spec(),{depth:null})
//console.dir(g0.node(),{depth:null})
// console.dir(g0.node().v.a.b,{depth:null})
let j0 = g0.jsonify()
console.log(j0)
// let s0 = g0.stringify()
//console.log(s0)
// let j0 = { a: 'Min(1).String()' }
// let j0 = { a: 'String().Min(1)' }
// let j0 = ['String.Min(1)']
// let j0 = {a:'Open({})'}
*/

// console.log('======')
// let b0 = Gubu.build({"x":"11","$$":"Min(1).Max(3)"})
// console.dir(b0.spec(),{depth:null})
// console.log(b0.jsonify())

// console.log(Gubu(b0).spec())




/*
let g1 = Gubu({
  // 'x:Min(1,Max(4))': 2,
  // 'x:Min(1).Max(4)': 2,
  // x: 'Min(1, Max(4, 2))',
  'a: Open': {x:1,y:2}
}
,{
  keyexpr: { active: true }
//  keyspec: { active: true }
})

D(g1.spec())
console.log(g1({a:{x:3}}))
*/



//console.log(Min(1,Max(4)))



/*
let d5 = Gubu(
  //2
  // Default(2)
  // Default(2, Required())
  Max(3, Min(1, Default(2, Required())))

  
  // Min(1,{z:11}).Max(2,{y:22})
  // Min(1).Max(2,{y:22})
  // Max(2)
  // Max(2,{x:11,y:22})
  // Max(2,{x:11,y:22}).Min(1)
  // Min(1).Max(2,{x:11,y:22})
  // Min(1, Max(2,{x:11,y:22}))
  
  // Object
  // Default(Object)
  // Default({ a: null }, { a: Number })
  // Max(2).Min(1,{x:2})
  )

// let d5 = Gubu.build('String')
console.log('===========')
console.log(d5.spec())
console.log('QQQ',d5.stringify())
// console.dir(d5.node())


// console.log(d5({x:1,y:2}))

// console.log(d5.spec())
*/


//console.log(nodize({x:Number}))
//console.log(nodize({x:1}))

// D(Child({ x: String }))
// D(Required({ b: 1 }).Child({ x: String }))
// D( Child({ x: String }).Required({b:1}) )

/*
let g0 = Gubu({ a: Required({ b: 1 }).Child({ x: String }) })
// let g0 = Gubu({ a: Required({ b: 1 })})
// let g0 = Gubu({ a: Child({ x: String },{b:1})})
// let g0 = Gubu({ a: Child({ x: String },Required({b:1}))})
// let g0 = Gubu({ a: Required(Child({ x: String },{b:1}))})
// let g0 = Gubu({ a: Child({ x: String },{b:1}).Required() })
// let g0 = Gubu({ a: Child({ x: String }).Required({b:1}) })
// let g0 = Gubu({ a: Required().Child({ x: String },{b:1}) })
*/


// let g0 = Gubu({ a: One(Number,String) })
// let g0 = Gubu({ a: All(Number,String) })
// let g0 = Gubu({ a: Some(Number,String) })
// let g0 = Gubu({ a: Some({x:1}) })    
// let g0 = Gubu({ a: Child({ x: String }).Required({ b: 1 }) })    
// let g0 = Gubu(Child(Number))
//let g= Gubu({a:Child({x:Number})})
// let g0 = Gubu.build({"a":{"$$":"Some($$ref0)","$$ref0":{"x":"1"}}})
//D(g0.node())
//D(g0.spec())
//console.log(g0.stringify())
//let g0 = Gubu(All(Open({ x: 1 }), Open({ y: 'a' })))
// let g0 = Gubu(Closed(Required({ x: 1 })), { name: 'cr0' })
// let g0 = Gubu(Required({ x: 1 }), { name: 'cr0' })
//console.log(stringify({a:'A'}))
// console.log(g0.node())
// console.log(g0.spec())
//D(g.node())
//D(g.spec())
// console.log(g.stringify())
//let j0 = g.jsonify()
//console.log(j0)
// let g1= Gubu.build(j0)
// console.log(g1.stringify())

// console.log(JSON.stringify(Skip()))
// console.log(JSON.stringify(Gubu.Skip()))


// let g0 = Gubu(Open({a:1}))
// let c0 = Gubu(Check((v) => v === 1))
// let g0 = Gubu(Default('foo', c0))
// let g0 = Gubu(Check((v) => !!v, Number))
// let g0 = Gubu({ a: Exact(null) })
// let g0 = Gubu(Optional(Required('a')))
//let g0 = Gubu({ a: Child({ x: String }).Required({ b: 1 }) })
// let g0 = Gubu({ a: Required({ b: 1 }) })
let g0 = Gubu({ a: Child({ x: String }) })

///let g0 = Gubu({ a: Default({ b: 'B' }, All(Open({ b: String }), Max(2))) })
// let g0 = Gubu({ a: All(Open({ b: String }), Max(2)) })

// let g0 = Gubu(Exact('red'))

console.log('=========')
// console.log(c0.stringify())
// console.log(c0(1))
console.dir(g0.spec(),{depth:null})
console.log(g0.stringify())
// console.log(g0())
// console.log(g0())
//console.log(g0('a'))

// console.log(stringify(1,null,true))

// console.log(g0({}))
// console.log(g0({ a: {} }))
console.log(g0({ a: { b: { x: 'X' } } }))
//console.log(g0({ a: { b: 'X', c: 'Y' } }))


