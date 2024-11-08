const fs = require('fs');

// const readStream = fs.createReadStream('./src/docs/text2.txt');
const readStream = fs.createReadStream('./src/docs/text2.txt', { encoding: 'utf-8' });
const writeStream = fs.createWriteStream('./src/docs/text3.txt');


// every time we get a chunk of data, we can do something with the chunk
readStream.on('data', (chunk) => {  // on is like addEventListener
  console.log('--- NEW CHUNK ---');
  console.log(chunk); // Buffer
//   console.log(chunk.toString());
  writeStream.write('\n -------- NEW CHUNK -------- \n');
  writeStream.write(chunk);
})

// piping
// opening readStream reading data, ever time we get a chunk, we pipe it to writeStream
readStream.pipe(writeStream);