
const {
  MakeArgu,
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



function bar() {
  let args = Argu(arguments, 'bar', {
    'a: One(String,{})': {},
    'b: Ignore(One(String,{}))': {},
    c: Function,
  })
  console.log(arguments, args)
}

bar('a','b',()=>{})
bar('a',()=>{})
// bar({x:1}) // ,'b',()=>{})
// bar(true) // ,'b',()=>{})
