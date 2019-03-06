
Promise.resolve([{name:'Peter', age:22}, 
                 {name:'Anna',  age:23}, 
                 {name:'John',  age:30}]
)
.then( people => {
  let person = people.find(p => p.name === process.argv[2])
  if (!person) throw "  '" + process.argv[2] + "' is not in DB";
  return person; 
})
.then( person => 
  console.log("  " + person.name + " is " + person.age + " years old")
)
.catch( exception => console.log(exception) );

