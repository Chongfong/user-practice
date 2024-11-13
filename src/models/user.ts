import { Schema, model, Model, Types } from "mongoose";
import { isEmail } from "validator";
import bcrypt from 'bcrypt';

interface IUser extends Document {
    email: string;
    password: string;
    _id: Types.ObjectId;
}

interface IUserModel extends Model<IUser> {
    login(email: string, password: string): Promise<IUser>;
}

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
// userSchema.post('save', function(doc, next) {  // POST not post request
//     console.log('New user was saved', doc);
//     next();  // remember to call next
// });

// fire a function before doc saved to db
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// static method to login user
userSchema.statics.login = async function (email, password){  // statics.{anything} = static method
    const user = await User.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password, user.password)
        if(auth){
            return user;
        } else {
            throw Error('Invalid password');
        }
    } else {
        throw Error('User not found');
    }
}

export const User = model<IUser, IUserModel>('User', userSchema);