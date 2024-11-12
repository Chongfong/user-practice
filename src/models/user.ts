import { Schema, model } from "mongoose";
import { isEmail } from "validator";

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true, // do not support direct error message, use error code instead
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email'] // function, error message
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minLength: [6, 'Minimum password length is 6 characters']
    }
});

// fire a function after doc saved to db
userSchema.post('save', function(doc, next) {  // POST not post request
    console.log('New user was saved', doc);
    next();  // remember to call next
});

// fire a function before doc saved to db
userSchema.pre('save', async function(next) {
    console.log('user about to be created and saved', this) // this = user instance
    next();
});

export const User = model('user', userSchema);