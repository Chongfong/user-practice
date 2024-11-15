const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    //set response header
    res.setHeader('Content-Type', 'text/html');

    // //send response
    // res.write('<head><link rel="stylesheet" href="#"></head>');
    // res.write('<h1>Hello World</h1>');
    // res.end();  // remember to end the response

    let path = './src/views';
    switch(req.url){
      case '/':
        path += '/index.html';
        res.statusCode = 200;
        break;
      case '/about':
        path += '/about.html';
        res.statusCode = 200;
        break;
      case '/about-us':
        res.statusCode = 301;
        res.setHeader('Location', '/about');  // redirect
        res.end();
        break;
      default:
        path += '/404.html';
        res.statusCode = 404;
        break;
    }

    // send an html file
    fs.readFile(path, (err, data) => {
        if (err) {
            console.log(err);
            res.writeHead(500);
            res.end('Error');
        } else {
            // res.write(data);
            res.end(data); // if there's only one line, can put the data inside the end
        }
    });

})

server.listen(3000, 'localhost', () => {
    console.log('Server running on port 3000');
})