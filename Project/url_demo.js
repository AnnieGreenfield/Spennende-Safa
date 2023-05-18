const url = require('url');

const myUrl = new URL('https://docs.google.com/presentation/d/1POVRdoby6PPUKBBXPxxjf0gGEEmRD8ClNFmteGrUch0/edit#slide=id.g716c66ae72_0_134');

// URl - univercal resorce locator 
//Serialized URL - распознавание номера. Из строки получаем объект.

console.log(myUrl.href); //http reference
console.log(myUrl.toString()); //

//Host (root domain) 
console.log(myUrl.host); // domain

console.log(myUrl.hostname); //без порта 

console.log(myUrl.pathname);

console.log(myUrl.search);

console.log(myUrl.searchParams);
//После "?" идут параметры. Передаётся методом get