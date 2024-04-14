function curry(fn){
let length=fn.length
  return function _curry(...args){
    if(args.length<length){
return function(){
  return _curry(...args,...arguments)
}
    }
    else return fn(...args)
  }
}
function sum(a,b,c){
  return a+b+c
}
const add1=curry(sum)
console.log(add1(1,2)(3))
