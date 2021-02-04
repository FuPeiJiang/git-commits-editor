

class Bar {
  constructor() {
    this.foo()
    console.log(this)
  }
  foo() {
    console.log('hello')
  }
  createStartsWith() {
    const before = 'ayt lolz'
    return function(str) {
      console.log(`${before} ${str} `)
    }
  }
}

const ok = new Bar()
console.log(ok)
const startsWith = ok.createStartsWith()
console.log(startsWith)
startsWith('56456')
