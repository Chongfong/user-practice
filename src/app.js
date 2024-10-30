const express = require('express');
const app = express();
const PORT = 3000;

const customers = [
    { name: 'Alice Johnson', industry: 'Technology' },
    { name: 'Bob Smith', industry: 'Finance' },
    { name: 'Charlie Brown', industry: 'Healthcare' },
    { name: 'Diana Prince', industry: 'Retail' },
    { name: 'Ethan Hunt', industry: 'Entertainment' }
];

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.get('/api/customers', (req, res) => {
    res.send({"customers": customers});
})

app.post('/', (req, res) => {
    res.send('This is a post request');
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})