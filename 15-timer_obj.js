
const EventEmitter = require('events');
const readline = require('readline');

class MyEmitter extends EventEmitter {};

const myEmitter = new MyEmitter();

myEmitter.on('event', () => {
  console.log('an event occurred!');
}).on('event2', () => {
  console.log('a 600ms event_2 occurred');
}).on('event3', (linea) => {
  console.log('Has tecleado {' + linea + '}');
});

setInterval( ()=>myEmitter.emit('event'), 1000); 
setInterval( ()=>myEmitter.emit('event2'), 600); 

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '\nType something: '
});
rl.on('line', (line) => {
  myEmitter.emit('event3', line);
})