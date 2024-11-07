const fs = require('fs');

// log the current directory
console.log(__dirname);

// log the current file path
console.log(__filename);

// reading files
// fs.readFile('filePath', function runs when completed) //async function
fs.readFile('./src/docs/text1.txt', (err, data) => {
  if (err) {
    console.log(err);
  } else {
    // console.log(data);  <Buffer 47 6f 6f 64 20 4d 6f 72 6e 69 6e 67 21>
    console.log(data.toString());
    // Good Morning!
  }
});


// writing files
// replace all the content, instead of adding
fs.writeFile('./src/docs/text1.txt', 'Good Afternoon!', () => {
  console.log('file was written');
})

// if the file doesn't exist, it will be created
fs.writeFile('./src/docs/text2.txt', 'Afternoon tea time!', () => {
  console.log('file was written');
})

// create and delete folders, mkdir = make directory, rmdir = remove directory
if(!fs.existsSync('./src/assets')){
  fs.mkdir('./src/assets', (err) => {
    if(err){
      console.log(err)
    }
    console.log('folder created');
  })
} else {
  fs.rmdir('./src/assets', (err) => {
    if(err){
      console.log(err)
    }
    console.log('folder deleted');
  })
}

// delete files

if(fs.existsSync('./src/docs/deleteme.txt')){
  fs.unlink('./src/docs/deleteme.txt', (err) => {
    if(err){
      console.log(err)
    } 
    console.log('file deleted');
  })
}