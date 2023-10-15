
const {
  MakeArgu,
  Rest,
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


// bar('a','b',()=>{})
// bar('a',()=>{})
// bar({x:1}) // ,'b',()=>{})
// bar(true) // ,'b',()=>{})


function zed() {
  let args = Argu(arguments, 'bar', {
    a: String,
    b: Rest(Number),
  })
  console.log(arguments, args)
}

zed('a')
zed('a',1)
zed('a',1,2)
zed('a',1,2,'x')
