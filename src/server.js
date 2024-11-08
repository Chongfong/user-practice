const http = require('http');

const server = http.createServer((req, res) => {
    //set response header
    res.setHeader('Content-Type', 'text/html');
    
    //send response
    res.write('<head><link rel="stylesheet" href="#"></head>');
    res.write('<h1>Hello World</h1>');
    res.end();  // remember to end the response
})

server.listen(3000, 'localhost', () => {
    console.log('Server running on port 3000');
})