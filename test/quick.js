

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


// class Foo {}

let aR = /a/
console.log(typeof aR)
console.log(aR.constructor)


// console.log(RegExp)
// console.log(RegExp.constructor)


let g1 = Gubu({a:Optional(/x/)})
// let g1 = Gubu({a:Foo})
// let g1 = Gubu({a:RegExp})

console.log(g1.stringify())
D(g1.spec())
console.log(g1({a:'x'}))
console.log(g1({}))
// console.log(g1({a:1}))
console.log(g1({a:'y'}))

