let arr = [
  {name:"wangwei",age:8},
  {name:"malin",age:19},
]

console.log(arr.findIndex((item) => {
  return item.name === 'madlin'
}))



var arr1 = [{show:false},{show:false}];
var arr2 = []
arr2.push(arr1[0])

console.log(arr1);
console.log(arr2);

arr2[0].show = true
console.log(arr1);
console.log(arr2);
