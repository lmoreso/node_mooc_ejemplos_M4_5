
console.log(`\nEnumerable global properties
obtained with Object.keys(global):\n`);

console.log(Object.keys(global));


Object.keys(global).forEach((unaProp) => console.log(unaProp, global[unaProp]));