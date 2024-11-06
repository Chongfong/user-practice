//  @ts-nocheck
const mongoose = require('mongoose');

// remember to define the schema if any property is added
const customerSchema = new mongoose.Schema({
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

module.exports = mongoose.model('customer', customerSchema); // "clients" (automatically pluralize) is the collection name under the database 