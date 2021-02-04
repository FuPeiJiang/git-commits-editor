
// function foo(string) {
//
//   return
// }

const foo = createStartsWith()
foo('567567')

function createStartsWith() {
  const before = 'ayt lolz'
  return function(str) {
    console.log(`${before} ${str} `)
  }
}
