import { Request, Response } from "express";
import { User } from "../models/user";
import jwt from 'jsonwebtoken';
import { Types } from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.SECRET_KEY as string;

interface ValidationError {
    message: string;
    code?: string | number;
    errors?: { [key: string]: { message: string; path: string } };
}

const handleErrors = (err: ValidationError) => {
    let errors = { email: '', password: '' };

    // duplicate email error
    if (err.code === 11000) {
        errors.email = 'This email is already registered';
        return errors;
    }

    // validation errors
    if (err.message.includes('user validation failed') && err.errors) {
        Object.values(err.errors).forEach((properties) => {
            errors[properties.path as keyof typeof errors] = properties.message;
        });
    }
    return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id: Types.ObjectId) => {
    return jwt.sign({id}, SECRET, {
        expiresIn: maxAge  // 3 days
    })
}

const signup_get = (req: Request, res: Response) => {
    res.render('auths/signup', {title: 'Sign Up'});
}

const login_get = (req: Request, res: Response) => {
    res.render('auths/login', {title: 'Log In'});
}

const signup_post = (req: Request, res: Response) => {
    const { email, password } = req.body;
    User.create({email, password})
    .then((user) => {
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000}); // 3 days in ms
        res.status(201).json({user: user._id});
    })  
    .catch((e) => {
        const errors = handleErrors(e);
        res.status(400).json({errors});
    })
}

const login_post = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    try {
        const user = await User.login(email, password);
        res.status(200).json({user: user._id});
    } catch (e) {
        if (e instanceof Error) {
            res.status(400).json({ error: e.message });
        } else {
            res.status(400).json({ error: 'An unknown error occurred' });
        }
    }
}

export { signup_get, login_get, signup_post, login_post }