
const {
  MakeArgu,
  Rest,
  Skip,
  Min,
  Ignore,
} = require('../gubu')


let Argu = MakeArgu('QAZ')

// function foo() {
//   let args = Argu(arguments, 'foo', {
//     a: 1,
//     b: 'B'
//   })
//   console.log(arguments, args)
// }


// foo(2,'X')
// try { foo(2,3) } catch(e) { console.log(e.message) }



// function bar() {
//   let args = Argu(arguments, 'bar', {
//     'a: One(String,{})': {},
//     'b: Ignore(One(String,{}))': {},
//     c: Function,
//   })
//   console.log(arguments, args)
// }


// // bar('a','b',()=>{})
// // bar('a',()=>{})
// // bar({x:1}) // ,'b',()=>{})
// // bar(true) // ,'b',()=>{})


// function zed() {
//   let args = Argu(arguments, 'bar', {
//     a: String,
//     b: Rest(Number),
//   })
//   console.log(arguments, args)
// }

// zed('a')
// zed('a',1)
// zed('a',1,2)
// zed('a',1,2,'x')



function qaz() {
  let args = Argu(arguments, 'bar', {
    a: Skip(String),
    // a: String,
    // b: Skip(Object),
    b: Skip(Object),
    c: Function,
  })
  console.log(arguments, args)
}

function f0(){}


qaz('s',{b:1},f0)
qaz({b:1},f0)
qaz('s',f0)
qaz(f0)
// qaz('s',{x:1},f0)
// qaz({x:1},f0)
