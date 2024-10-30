const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());  // remember to add this or the result will be undefined
app.use(express.urlencoded({ extended: true }));  // remember to add this or the result will be undefined

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

app.post('/api/customers', (req, res) => {
    const customer = req.body;
    console.log(customer);
    res.send(customer);
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})