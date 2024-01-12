

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
} = require('../gubu')


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


// let g0 = Gubu(Min(1,{}))
// console.log(g0.spec())
// console.log(g0({x:1}))

// let g1 = Gubu({})
// console.log(g1.spec())
// console.log(g1({x:1}))

let g2 = Gubu({a:1})
console.log(g2.spec())


let g3 = Gubu({})
console.log('a',g3({a:1}))
console.log('b',g3({b:2}))
console.log('c',g3({c:3}))


//let g0 = Gubu({
  // 'a': Open({x:1}),
  // 'b': {x:1},
  // 'x: Min(1) Max(4)': 2,
  // 'y: Min(1).Max(4)': 2,
  //'y: Min(1)': 2,
  // 'z: Min(1,Max(4))': 2,
  // 'z: Required(Min(1) Max(4))': 2,
  // 'z: Required(min(1,Max(4)))': 2,
  // 'k:Exact(0,"q",true,","," ")':"q"

  // 'a: Check(/a/)': [String]
  // 'a: Child(Len(3))': [String]
  // 'a: Value(Check(/a/))': [String]
  // a: Value(Check(/a/), [String])
  // 'a: Value(Check(/a/))':[String]
  
// },{keyexpr:{active:true}})

// FIX: spec is string!
// REFACTOR: Value(child,val) -> Value(val, child) - consistent

// console.log(g0.spec())
// try {
//   console.log(g0('x'))
// }catch(e) {
//   console.log(e)
//   console.dir(e.desc(),{depth:null})
// }
// console.log(g0({x:0}))
// console.log(g0({x:5}))

// console.log(g0({ a: ['zaz'] }))
// console.log(g0({ a: ['zbz'] }))


// let g0 = Gubu({
//   // '$$ a Open': {
//   // '$$["a","Open"]': {
//   '$$ a Open Required': {
//   // a: {
//     // a: Open({
//     // x: 1,
//     '$$ x Min(1)': Number,
//   }
//   // })
// })

// // console.log('=============')

// console.log(g0({
//   a: {
//     x: 1,
//     y: 2
//   }
// },{log:null}))


// let a1 = Gubu({
//   // a: 11,
//   // b: { c: 22 },
//   // m: {},
//   d: { e: { f: 33, g: { h: 3333 } } },
//   d2: { e2: { f2: 333 } },
//   // g: [],
//   // h: [44],
//   // i: [55,66],
// })
// J(a1(undefined,{err:false,log}))
// console.log(a1({h:['a']}))
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
// J(o0({a:undefined}))
// J(o0({a:'x'}))
// J(o0({a:1}))
// J(o0({a:true}))


// let o0 = Gubu(One(String,Number))
// let o0 = Gubu(Skip(One(Number,String)))
// console.log(o0())



// let o1 = Gubu({ a: One({x:Exact(1)},{y:Exact(2)}) })
// J(o1(tmp.a1={a:{x:11}})); console.log(tmp.a1)
// J(o1(tmp.a1={a:{y:22}})); console.log(tmp.a1)
// J(o1(tmp.a1={a:{x:11,y:22}})) // fails
// J(o1({a:true})) // fails



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


// let o0 = Gubu({ a: Skip({x:1}) })
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


// let d0 = Gubu({a:1})
// console.log(d0({a:/x/}))


// let s0 = Gubu({a:'foo'})
// console.log(s0({a:''}))

// let s1 = Gubu({a:Empty('foo')})
// console.log(s1({a:''}))

// let s2 = Gubu({a:Empty('')})
// console.log(s2({a:''}))
// console.log(s2({a:'x'}))

// let s3 = Gubu({a:''})
// console.log(s3({a:''}))
// console.log(s3({a:'x'}))


// let x0 = Gubu(Exact(1,'a'))
// console.log(x0(1))
// console.log(x0('a'))
// console.log(x0(2))


// let a0 = Gubu([{x:1}])
// console.log(a0(['q',{x:99}]))
// console.log(a0([{x:99},'q']))


// let a0 = Gubu(All({x:1},{y:2}))
// console.log(a0)
// console.log(a0.spec())
// console.log(a0({x:11,y:22}))
// // console.log(a0({x:'X',y:22}))
// console.log(a0({x:11,y:'Y'}))



// const print = Args(
//   // {bar:String,foo:Number,},
//   // {foo:Number,bar:String},
//   // {foo:Number,barx:'x'},
//   // {foo:Number,bar:String,zed:Boolean},
//   {foo:0,bar:0},
//   function print(args) {
//   console.log('PRINT')
//   console.dir(args, {depth:null})
// })

// // print(2,'y')
// // print('y',2)
// // print(2,'y',true)
// print(11,22)
// print(11)
// print()



// let d0 = Gubu({a:{b:1,c:2},d:(v,u,s)=>(u.val=s.src.a.c,true)})
// console.log(d0({a:{b:11,c:22}}))
// console.log(d0({a:{b:11}}))

// let d1 = Gubu(1)
// console.log(d1(2))
// console.log(d1())

// let d2 = Gubu({a:{b:1,c:2},d:3})
// console.log(d2({a:{b:11,c:22},d:33}))

// let d3 = Gubu({x:1})
// console.log(d3({}))
// console.log(d3())


// console.log( Gubu((v, u) => (u.val = 1, true))(null) )
// console.log( Gubu({a:{b:1}})({}) )

// console.log(Gubu([Never(), 1, 'x'])([2,'y',true]))


// let g1 = Gubu([
//   Never(),
//   Rename('a', String),
//   Rename('b', 2),
//   Rename({ name: 'c', keep: false }, true)
// ])
// console.log(g1(['x', 22]))


// console.dir(Gubu({a:1}).spec(), {depth:null})

// console.dir(Gubu(Value({a:1,b:true},String))({a:2,b:false,c:'x',d:'y',e:1}), {depth:null})



// let a3 = Args({ a: 0, 'b:a': 1 })
// // console.dir(a3.spec(),{depth:null})

// console.log(a3([11,22]))
// console.log(a3([33]))
// console.log(a3([]))
// // console.log(a3(['x',1]))


// let a4 = Args({ a: {x:1}, 'b:a': Skip(Function) })
// // console.dir(a3.spec(),{depth:null})

// function f0(){}

// console.log(a4([{x:2},f0]))
// console.log(a4([f0]))
// console.log(a4([]))


// let obj01 = Gubu({
//   a: { x: 1 },
//   b: Skip({ y: 2 }),
//   c: Skip({ z: Skip({ k: 3 }) }),
//   d: Skip(9)
// })
// console.log(obj01({}))
// console.log(obj01({ b: {} }))
// console.log(obj01({ c: {} }))
// console.log(obj01({ c: { z: {} } }))



// let obj11 = Gubu({
//   people: Required({}).Value({ name: String, age: Number }),
// })

// console.dir(obj11({
//   people: {
//     alice: { name: 'Alice', age: 99 },
//     bob: { name: 'Bob' }
//   },
// }), {depth:null})

// let p0 = Gubu({
//   // a: Value({q:'Q'},Number),
//   a: Value({},Number),
//   b: { m:3, n:4 },
// })

// console.dir(p0({
//   a:{ x:1, y:2 }
// }))


// let g0 = Gubu(Value({ a: 1 }, String))
// console.log(g0({a:true,b:'x'}))


// console.log(Gubu({a:Rename('a',1)})({a:2}))

// console.log(Gubu([Never()])(new Array(3)))
//console.log(Gubu(Closed([1]))([2,3]))

// console.log(Gubu(Above(3,[1]))([2,3,4,5]))


// let g4 = Gubu({ a: Skip({ b: String }) })
// console.log(g4())
// console.dir(g4.spec(),{depth:null})


// let m0 = Gubu({a:{b:1}})
// console.log(m0(tmp.a0={}),tmp.a0)
// console.log(m0.match(tmp.a1={}),tmp.a1)
// console.log(m0.match(tmp.a2={a:2}),tmp.a2)

// console.log(stringify(NaN))

// console.log(Gubu(Exact(1))(1))
// // console.log(Gubu(Exact(1))(undefined))
// console.log(Gubu(Exact(1))(NaN))
// // console.log(Gubu(Exact(1))())



// let a0 = Gubu(Skip(Number).After((v) => 0 === v % 2))
// console.log(a0.spec())
// console.log(a0())



// let d01 = Gubu(One(String,1))
// console.log(d01('a'))
// console.log(d01(2))

// try {
//   console.log(d01())
// }
// catch(e) {
//   console.log(e.desc())
// }



// let d02 = Gubu(Some(String,1))
// console.log(d02('a'))
// console.log(d02(2))

// try {
//   console.log(d02())
// }
// catch(e) {
//   console.log(e.desc())
// }


// console.log(Gubu({a:Skip(String)})())


// let g0 = Gubu({a:Boolean})
// let o0 = {}
// try {
//   g0(o0)
// }
// catch(e) {
//   console.log(e.desc())
//   console.log(o0)
// }


// // let a0 = Gubu([1,'a'])
// let a0 = Gubu([1,{a:true}])
// // console.log(a0([2,'b',true]))
// // console.log(a0([2,'b']))
// // console.log(a0([2,{a:false},'x']))
// console.log(a0([3]))
// console.log(a0([undefined,{a:false}]))




// let g = Gubu([Required({x:1})])
// console.log(g([{x:11}]))
// console.log(g([]))


// let g = Gubu([])
// console.log(g())
// console.log(g([]))
// console.log(g([1]))
// console.log(g([1,2]))
// console.log(g([1,2,3]))

// let g1 = Gubu([Number])
// console.log(g1())
// console.log(g1([]))
// console.log(g1([1]))
// console.log(g1([1,2]))
// console.log(g1([1,2,3]))
// // console.log(g1(['a']))

// let gc1 = Gubu(Value([],Number))
// console.log(gc1())
// console.log(gc1([]))
// console.log(gc1([1]))
// console.log(gc1([1,2]))
// console.log(gc1([1,2,3]))
// // console.log(gc1(['b']))
// // console.log(gc1([1,'a']))


// let gc2 = Gubu([String,Boolean])
// // console.log(gc2())
// // console.log(gc2([]))
// // console.log(gc2([1]))
// // console.log(gc2([1,2]))
// // console.log(gc2([1,2,3]))
// console.log(gc2(['a',true]))
// // console.log(gc2(['a',true,1]))
// // console.log(gc2(['a',true,1,2]))


// let gc3 = Gubu(Value([String,Boolean],Number))
// // console.log(gc3())
// // console.log(gc3([]))
// // console.log(gc3([1]))
// // console.log(gc3([1,2]))
// // console.log(gc3([1,2,3]))
// console.log(gc3(['a',true]))
// console.log(gc3(['a',true,1]))
// console.log(gc3(['a',true,1,2]))
// console.log(gc3(['a',true,1,2,'x']))



// let c = Gubu(Closed([Number]))
// // let c = Gubu(Closed([2]))
// console.log(c())
// // console.log(c([]))
// console.log(c([1]))
// // console.log(c([1,2]))
// // console.log(c(['a']))
// console.log(c([1, 'a']))


// let a = Gubu([Any()])
// console.log(a())
// console.log(a([]))

// let a1 = Gubu(Closed([Any()]))
// console.log(a1())
// console.log(a1([]))

// console.log(stringify('"a"'))
// console.log(stringify('"b"',null,true))


// let a = Gubu(All(Number, Check((v) => v > 10)))
// // let a = Gubu(All(Check((v) => v > 10)))
// // let a = Gubu(Check((v) => v > 10))
// console.log(a('x'))



// let g1 = Gubu(Check((_v, u, _s) => (u.uval = undefined, true)))
// let g2 = Gubu([Check((_v, u, _s) => (u.uval = 1, true))])
// let g3 = Gubu({
//   a: Check((_v, u, _s) => (u.uval = undefined, true))
// })

// console.log('1',g1('A'))
// console.log('2',g2(['A']))
// console.log('3',g3({ a: 'A' }))
// // console.log(g1({ a: 'A', b: undefined })


// let o = {}
// try { Gubu({a:Boolean})(o) } catch (e) { console.log(e.message) }
// console.log(o)

// console.log(Gubu({b:Skip(Check((v, u) => (u.val = v * 2, true)))})({b:1}))


// console.log(Gubu(Check('number'))(1))
// console.log(Gubu(Check('number'))())


// console.log(Gubu({a:1})({a:1}))
// // console.log(Gubu({a:1})({a:1,b:2}))
// // console.log(Gubu({a:1})({a:1,b:2,c:3}))


// console.log(Gubu({x:{a:1},y:1})({x:{a:1},y:1}))
// // console.log(Gubu({x:{a:1},y:1})({x:{a:1,b:2},y:1}))
// // console.log(Gubu({x:{a:1},y:1})({x:{a:1},y:1,z:2}))
// console.log(Gubu({x:{a:1},y:1})({x:{a:1,b:3},y:1,z:2}))


// console.log(Gubu(Open({a:1}))({a:1}))
// console.log(Gubu(Open({a:1}))({a:1,b:2}))
// console.log(Gubu(Open({a:1}))({a:1,b:2,c:3}))

// console.log(Gubu(Value(Number,{a:1}))({a:1}))
// console.log(Gubu(Value(Number,{a:1}))({a:1,b:2}))
// console.log(Gubu(Value(Number,{a:1}))({a:1,b:2,c:3}))
// console.log(Gubu(Value(Number,{a:1}))({a:1,b:2,c:3,d:true}))


// console.log(Gubu({}))
// console.log(Gubu({k:{}})({x:99,y:88}))
// console.log(Gubu({k:{}})({y:88}))


// let g = Gubu({x:1,y:{z:2}})
// console.log(g)
// console.log(g.toString())
// g()
// console.log(g)
// console.log(g.toString())

// let n0 = nodize(Check(x=>true))
// console.log(n0)
// console.log(stringify(n0))

// let n1 = nodize({a:Check(x=>true)})
// console.log(n1)
// console.log(stringify(n1))

// let n1 = nodize({x:nodize(22)})
// console.log(n1)
// console.log(stringify(n1))

// let n2 = nodize({x:nodize({y:nodize(33)})})
// console.log(n2)
// console.log(stringify(n2))

// let n3 = nodize({x:nodize({y:nodize({z:nodize(44)})})})
// console.log(n3)
// console.log(stringify(n3))

// let n0 = nodize(Required())
// console.log(n0)
// console.log(stringify(n0))
// // console.log(Gubu({a:Required()})())

// let n1 = nodize({a:Required()})
// console.log(n1)
// console.log(stringify(n1))



// console.dir(Gubu(Skip(Required(1))).spec())

// let x0 = Gubu({x:1})
// console.log(x0.match({x:1}))
// console.log(x0.match({y:2}))


// let g = Gubu(Some({ x: 1 }, { y: 2 }))
// console.log(g({ x: 1 }))
// console.log(g({ y: 2 }))


// console.log(Gubu(Skip(String))('a'))
// // console.log(Gubu(Skip(String))(''))
// console.log(Gubu(Skip(String))())
// console.log(Gubu(Skip(String))(undefined))
// // console.log(Gubu(Skip(String))(null))


// function a() {}
// let b = ()=>false

// console.log(Gubu(()=>true).spec())
// console.log(Gubu(a).spec())
// console.log(Gubu(b).spec())
// console.log(Gubu(Function).spec())
// console.log(Gubu(new Function()).spec())

// console.log(new a())
// // console.log(new b())
// console.log(''===((()=>true).name))


// console.log(Gubu(Default(Number))(11))
// console.log(Gubu(Default(Number))(undefined))
// console.log(Gubu(Default(Number))())

// console.log(Gubu({a:Default(Number)})({a:11}))
// console.log(Gubu({a:Default(Number)})({a:undefined}))
// console.log(Gubu({a:Default(Number)})())

// console.log('---')

// console.log(Gubu(Default(Object))({x:1}))
// console.log(Gubu(Default(Object))({}))
// console.log(Gubu(Default(Object))())

// console.log(Gubu({a:Default(Object)})({a:{x:2}}))
// console.log(Gubu({a:Default(Object)})({a:{}}))
// console.log(Gubu({a:Default(Object)})({a:undefined}))
// console.log(Gubu({a:Default(Object)})({}))
// console.log(Gubu({a:Default(Object)})())


// console.log('---')

// console.log(Gubu(Default(All(Open({a:1}),Open({b:'B'}))))())
// console.log(Gubu(Default(All(Open({a:1}),Open({b:'B'}))))({a:11}))
// console.log(Gubu(Default(All(Open({a:1}),Open({b:'B'}))))({b:'B'}))
// console.log(Gubu(Default(All(Open({a:1}),Open({b:'B'}))))({a:11,b:'B'}))

// console.log(Gubu(Default({},All(Open({a:1}),Open({b:'B'}))))())
// console.log(Gubu(Default('x',All(Open({a:1}),Open({b:'B'}))))())


// console.log(stringify(Gubu(Number).spec()))
// console.log(stringify(Gubu({a:Number}).spec()))



// console.log(Gubu({a:{b:1}}).node())



// let c0 = Gubu(Check(v => 1 === v))
// // let c1 = Gubu(Skip(Check(v => 1 === v)))
// let c2 = Gubu(Skip(c0))

// console.log(c0.spec())
// // console.log(c1.spec())
// console.log(c2.spec())


// // console.log(c0)
// // console.log(c0(1))
// // console.log(c0.error(1))
// // console.log(c0.error())


// // console.log(c1)
// // console.log(c1.spec())
// // console.log(c1(1))
// // console.log(c1(2))
// // console.log(c1.error(1))
// // console.log(c1.error())

// let c3 = Gubu(Default(c0))
// console.log(c3)
// console.log(c3(1))
// console.log(c3(2))
// console.log(c3())
// console.log(c3.error(1))
// console.log(c3.error())


// let d0 = Gubu(Default(Number))
// console.log(d0.node())

// console.log(Gubu({a:Number}).node())


// let d8 = Gubu(Default({ a: Number }))
// let d8 = Gubu(Default({ a: Number }, {a:null}))
// let d8 = Gubu(Default({ a: null }, { a: Number }))
// console.log(d8.node())
// console.log(d8({ a: 1 }))
// console.log(d8())
// (d8()).toEqual({ a: null })
//(d8({ a: 'x' })).toThrow('type')



// console.log(Skip())
// console.log(Gubu.Skip())


// let f0t = () => true

// function f1t() { return true }
// function f1f() { return false }

// let f2t = () => true

// let g0 = Gubu(f0t)
// let g1 = Gubu(f1t)

// console.dir(g0.spec())
// console.dir(g1.spec())


// try {
//   console.log(g1(f1f).toString())
// }
// catch(e) {
//   console.log(e.desc())
// }
// // console.log(g1(f2t).toString())

// // let g2 = Gubu({ a: f1t })
// // console.log(g2({ a: f1f }).a.toString())

// // let g3 = Gubu({ a: f2t })
// // console.log(g3({ a: f1f }).a.toString())


// console.dir(Gubu(()=>true).spec())
// console.dir(Gubu(function() {}).spec())
// console.dir(Gubu(function AAA() {}).spec())
// console.dir(Gubu(Error).spec())
// console.dir(Gubu(RegExp).spec())


// console.log(Default(Object))
// console.log(g=Gubu(Default(Object)),g())
// console.dir(g.spec(),{depth:null})



// let d5 = Gubu(Default({ a: null }, { a: Number }))
// console.dir(d5.spec(),{depth:null})
// console.log(d5())



// console.log(Gubu({a:{name:Key()}})({a:{}}))
// console.dir(Gubu({a:{b:{c:{name:Key(2)}}}})({a:{b:{c:{}}}}),{depth:null})
// console.dir(Gubu({a:{b:{c:{name:Key(2,'.')}}}})({a:{b:{c:{}}}}),{depth:null})
// console.dir(Gubu({a:{b:{c:{name:Key((path,state)=>{
//   console.log('QQQ', path, state)
//   return 2
// })}}}})({a:{b:{c:{}}}}),{depth:null})



// console.log(Gubu.isShape(Gubu(Number)))
// console.log(Gubu.isShape(Number))

