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
})

export const User = model('user', userSchema);