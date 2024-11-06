// const mongoose = require('mongoose');
import { HydratedDocument, Schema, model } from "mongoose";

interface IOrder {
    description: string;
    price?: number;
}
interface ICustomer {
    name: string;
    industry?: string;
    orders?: IOrder[];
}

// remember to define the schema if any property is added
const customerSchema = new Schema<ICustomer>({
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

export const Customer = model('customer', customerSchema);

// test the interface
// const t: HydratedDocument<ICustomer> = new Customer({ name: 'John Doe', industry: 'Retail' });
// console.log(t.name);

// export default model('customer', customerSchema);
// then => import {anything} from './models/customer';
