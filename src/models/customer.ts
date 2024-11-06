// const mongoose = require('mongoose');
import { Schema, model } from "mongoose";

// remember to define the schema if any property is added
const customerSchema = new Schema({
    name: {
        type: String,
        required: true, // add "ed", if there's no name field, show error: "customer validation failed: name: Path `name` is required."
    },
    industry: String,
    orders: [
        {
            description: String,
            price: Number
        }
    ]
});

export const Customer = model('customer', customerSchema); // "clients" (automatically pluralize) is the collection name under the database 
// export default model('customer', customerSchema);
// then => import {anything} from './models/customer';