const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');  // to use .env, if variables are included, also need to add dotenv-expand
dotenv.config();
const app = express();
const Customer = require('./models/customer');

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

const customer = new Customer({  // similar to class I think
    name: 'John Doe',
    industry: 'Retail'
    // mongoose will automatically add a new property "_id" with a unique value
});

// change connect url mongodb.net/{databaseName}?retryWrites=true to change the database name

customer.save(); // every time we save a new customer, it will be added to the database

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.get('/api/customers', async (req, res) => {
    // console.log(await mongoose.connection.db.listCollections().toArray()); for debug
    // {
    //     name: 'customers',
    //     type: 'collection',
    //     options: {},
    //     info: {
    //       readOnly: false,
    //       uuid: new UUID('7934b2ed-510b-4e66-817d-60241cc80c97')
    //     },
    //     idIndex: { v: 2, key: [Object], name: '_id_' }
    //   },
    try{
        const result = await Customer.find(); // Customer is the model with the Capital C
        res.send({"customers": result});  // res.json() also works
    } catch(e) {
        res.status(500).json({error: e.message}) // error code and error messages are editable
    }
    
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