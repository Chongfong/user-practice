const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');  // to use .env, if variables are included, also need to add dotenv-expand
dotenv.config();
const app = express();
mongoose.set('strictQuery', false);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.CONNECT_URL

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

const start = async() => {
    try{
        await mongoose.connect(MONGO_URI);
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        })
    }catch(e){
        console.log(e.message);
    }
    
}

start();