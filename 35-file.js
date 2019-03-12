
var fs = require('fs');

let fileToRead = '35-file.js';

fs.readFile(fileToRead, 
	'ascii',
	function(err, data){ 
		if (data) 
			console.log(data)
		else
			console.log(`Se ha producido un error leyendo el fichero ${fileToRead}: ${err}`)
	}
);

console.log("Fin del Programa principal.");

