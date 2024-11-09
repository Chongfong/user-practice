// use "//  @ts-nocheck" to avoid ts error

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');  // to use .env, if variables are included, also need to add dotenv-expand
dotenv.config();
const app = express();

// register view engine
app.set('view engine', 'ejs');
app.set('views', './src/views'); // set views folder


// const Customer = require('./models/customer');
import { Customer } from './models/customer';
import { Blog } from './models/blog';
import { Request, Response } from 'express';
mongoose.set('strictQuery', false);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.CONNECT_URL

app.use(express.json());  // remember to add this or the result will be undefined
app.use(express.urlencoded({ extended: true }));  // remember to add this or the result will be undefined

// middleware
// 3rd party middleware like: morgan, helmet...

// static files
app.use(express.static('src/public'));

app.use((req: Request, res: Response, next: any) => { // run before every request
    console.log('new request made');
    console.log('host: ', req.hostname);
    console.log('path: ', req.path);
    console.log('method: ', req.method);
    next(); // continue to the next middleware
})


// const customers = [
//     { name: 'Alice Johnson', industry: 'Technology' },
//     { name: 'Bob Smith', industry: 'Finance' },
//     { name: 'Charlie Brown', industry: 'Healthcare' },
//     { name: 'Diana Prince', industry: 'Retail' },
//     { name: 'Ethan Hunt', industry: 'Entertainment' }
// ];

// const customer = new Customer({  // similar to class I think
//     name: 'John Doe',
//     industry: 'Retail'
//     // mongoose will automatically add a new property "_id" with a unique value
// });

// // change connect url mongodb.net/{databaseName}?retryWrites=true to change the database name

// // customer.save(); // every time we save a new customer, it will be added to the database

app.get('/', (req: Request, res: Response) => {
    // res.send('Hello World!');
    // res.sendFile('./views/index.html', { root: __dirname }); // absolute path, so we need to add the root

    const blogs = [
        {title: 'Trump\’s master plan for a radical reformation of the US government', snippet: 'Lorem ipsum dolor sit amet consectetur'},
        {title: 'Ukraine is forced to confront a brutal Trump reality that it hoped would never happen', snippet: 'Ut in quam sagittis, tincidunt augue at, sagittis nisl.'},
        {title: 'Latest on the 2024 election and Trump’s presidential transition', snippet: 'Ut mi nisl, egestas nec dolor ac, venenatis accumsan libero.'},
      ];
    res.render('index', {title: 'Home', blogs}); // ejs
})

app.get('/about', (req: Request, res: Response) => {
    res.render('about', {title: 'About'});
})

// redirect

app.get('/about-us', (req: Request, res: Response) => {
    res.redirect('/about');
})

app.get('/blogs/create', (req: Request, res: Response) => {
    res.render('create', {title: 'Create a new blog'});
})


// api for blogs

app.get('/api/blogs', async(req: Request, res: Response) => {
    try{
      const result = await Blog.find();
      res.json({result});
    }catch(e){
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
});

app.get('/api/blogs/:id', async(req:Request, res:Response) => {
    const {id: blogId} = req.params;
    try{
        const result = await Blog.findById(blogId);
        if(!result){
            res.status(400).json({error: `Blog with id ${blogId} not found`});
        } else {
            res.json({result});
        }
    }catch(e){
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
});

app.post('/api/blogs', async(req: Request, res:Response) => {
    const blog = new Blog(req.body);
    try{
        await blog.save();
        res.status(201).json({blog});
    }catch(e){
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
});

app.put('/api/blogs/:id', async(req:Request, res:Response) => {
    const {id: blogId} = req.params;
    try{
        const result = await Blog.findOneAndReplace({_id: blogId} ,req.body, {new: true});
        res.json({result});
    }catch(e){
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
});

app.patch('/api/blogs/:id', async(req:Request, res:Response) => {
    const {id: blogId} = req.params;
    try{
      const result = await Blog.findByIdAndUpdate({_id: blogId}, req.body, {new: true});
      res.json({result});
    }catch(e){
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
});

app.delete('/api/blogs/:id', async(req:Request, res:Response) => {
    const {id: blogId} = req.params;
    try{
      const result = await Blog.deleteOne({_id: blogId});
      res.json({deletedCount: result.deletedCount});
    }catch(e){
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
})




// apis

app.get('/api/customers', async (req: Request, res: Response) => {
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
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        } // error code and error messages are editable
    }
    
})

app.get('/api/customers/:id', async(req:Request, res:Response) => {
    const {id: customerId} = req.params;
    try{
        const customer = await Customer.findById(customerId);
        if(!customer){ // handle id not found error
            res.status(404).json({error: `Customer with id ${customerId} not found`}); 
        } else {
            res.json({customer});
        }
    }catch(e){
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
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

app.get('/api/orders/:id', async(req:Request, res:Response) => {
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
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
})

app.put('/api/customers/:id', async(req:Request, res:Response) => {
    try{
        const customerId = req.params.id;
        // const result = await Customer.replaceOne({_id: customerId}, req.body); // 1. property to filter  2. obj to replace
        const result = await Customer.findOneAndReplace({_id: customerId}, req.body, {new: true}); //use findOneAndReplace to retrieve updated data
        //  add new property,or it will update the db but return the ORIGINAL data
        // not update, just change entire obj to db 
        res.json({result});
    }catch (e){
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
})

app.patch('/api/customers/:id', async(req:Request, res:Response) => {
    try{
        const customerId = req.params.id;
        const result = await Customer.findOneAndUpdate({_id: customerId}, req.body, {new: true}); //use findOneAndUpdate to update data instead of replacing new one
        res.json({result});
    }catch (e){
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
})

app.patch('/api/orders/:id', async(req:Request, res:Response) => {
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
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
     
})

app.post('/', (req:Request, res:Response) => {
    res.send('This is a post request');
})

app.post('/api/customers', async(req:Request, res:Response) => {
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
        if (e instanceof Error) {
            res.status(400).json({ error: e.message });
        } else {
            res.status(400).json({ error: 'An unknown error occurred' });
        }
    }
})

app.delete('/api/customers/:id', async(req:Request, res:Response) => {
    try{
        const customerId = req.params.id;
        const result = await Customer.deleteOne(({_id: customerId}));
        res.json({deletedCount: result.deletedCount});
    } catch (e){
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
})

// 404 page
// MUST BE AT THE END!!

// check the url is matched from top to bottom, if matched, run the function and stop
app.use((req: Request, res: Response) => {
    res.status(404).render('404', {title: '404'});
})


const start = async() => {
    try{
        await mongoose.connect(MONGO_URI);
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        })
    }catch(e: any){
        console.log(e.message);
    }
    
}

start();