// const data=[
//     {
//         name:"Sonu",
//         age:32
//     },
//     {
//         add:"Kalinagar",
//         phone:1234567890
//     },
// ]
// let tempObject={
//             name:"NA",
//             age:"NA",
//         }
// let newData=[]

// // let newData2=newData.reduce((acc,data)=>{

// // })

// data.map((item)=>{
//         let itemdata= {...tempObject, ...item};
//         newData.push(itemdata);
// })

// console.log(newData)


let arr1=[2,3,4,5,6]

let arr3=[];

arr1.forEach((item)=>{
    arr3.push(item+1);
})

let arr2 = arr1.map((item)=>{
    return item=item+1
})

console.log(arr1)
console.log("This is using map",arr2)
console.log("This is using foreach",arr3)