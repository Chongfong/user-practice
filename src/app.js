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

// customer.save(); // every time we save a new customer, it will be added to the database

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

app.get('/api/customers/:id', async(req, res) => {
    const {id: customerId} = req.params;
    try{
        const customer = await Customer.findById(customerId);
        if(!customer){ // handle id not found error
            res.status(404).json({error: `Customer with id ${customerId} not found`}); 
        } else {
            res.json({customer});
        }
    }catch(e){
        res.status(500).json({error: e.message})
    }
    // res.json({
    //     requestParams: req.params,  // id, test
    //     requestQuery: req.query, // ?name=John&industry=Technology the statement after ? mark
    // });
})

// http://localhost:3005/api/customers/12345/test?age=30&gender=male
// {
//     "requestParams": {
//       "id": "12345",
//       "test": "test"
//     },
//     "requestQuery": {
//       "age": "30",
//       "gender": "male"
//     }
//   }

app.get('/api/orders/:id', async(req, res) => {
    const {id: orderId} = req.params;
    console.log(orderId)
    try{
        const result = await Customer.findOne({'orders._id': orderId});
        if(!result){
            res.status(404).json({error: `Order with id ${orderId} not found`}); 
        } else {
            res.json({result});
        }
    }catch(e){
        res.status(500).json({error: e.message})
    }
})

app.put('/api/customers/:id', async(req, res) => {
    try{
        const customerId = req.params.id;
        // const result = await Customer.replaceOne({_id: customerId}, req.body); // 1. property to filter  2. obj to replace
        const result = await Customer.findOneAndReplace({_id: customerId}, req.body, {new: true}); //use findOneAndReplace to retrieve updated data
        //  add new property,or it will update the db but return the ORIGINAL data
        // not update, just change entire obj to db 
        res.json({result});
    }catch (e){
        res.status(500).json({error: e.message})
    }
})

app.patch('/api/customers/:id', async(req, res) => {
    try{
        const customerId = req.params.id;
        const result = await Customer.findOneAndUpdate({_id: customerId}, req.body, {new: true}); //use findOneAndUpdate to update data instead of replacing new one
        res.json({result});
    }catch (e){
        res.status(500).json({error: e.message})
    }
})

app.patch('/api/orders/:id', async(req, res) => {
    const orderId = req.params.id;
    // to prevent id changes every time
    req.body._id = orderId;
    try{
        const result = await Customer.findOneAndUpdate(
            { 'orders._id': orderId},  // use quote
            { $set: { 'orders.$': req.body }},  // use $
            {new: true});
        if(result){
            res.json({result});
        } else {
            res.status(404).json({error: `Order with id ${orderId} not found`});
        }
    }catch (e){
        res.status(500).json({error: e.message})
    }
     
})

app.post('/', (req, res) => {
    res.send('This is a post request');
})

app.post('/api/customers', async(req, res) => {
    const customer = new Customer(req.body);
    console.log(customer);
    // = new Customer({ name: req.body.name, industry: req.body.industry });
    try{
        await customer.save();
        // res.status(201).json(customer); // customizable code
        // {
        //     "name": "Donald J. Trump",
        //     "industry": "finance",
        //     "_id": "67289092077e9cdcda7feb09",
        //     "__v": 0
        //   }
        // res.status(201).json({customer})
        res.status(201).json({customer});
        // {
        //     "customer": {
        //       "name": "Donald J. Trump",
        //       "industry": "finance",
        //       "_id": "672891e6ad5fa838fc5857aa",
        //       "__v": 0
        //     }
        //   }
    } catch(e) {
        res.status(400).json({error: e.message})
    }
})

app.delete('/api/customers/:id', async(req, res) => {
    try{
        const customerId = req.params.id;
        const result = await Customer.deleteOne(({_id: customerId}));
        res.json({deletedCount: result.deletedCount});
    } catch (e){
        res.status(500).json({error: e.message})
    }
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