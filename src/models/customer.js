const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: String,
    industry: String,
});

module.exports = mongoose.model('client', customerSchema); // "clients" (automatically pluralize) is the collection name under the database 