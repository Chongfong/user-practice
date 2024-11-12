import { Request, Response } from "express";
import { User } from "../models/user";


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


const signup_get = (req: Request, res: Response) => {
    res.render('auths/signup', {title: 'Sign Up'});
}

const login_get = (req: Request, res: Response) => {
    res.render('auths/login', {title: 'Log In'});
}

const signup_post = (req: Request, res: Response) => {
    const { email, password } = req.body;
    User.create({email, password})
    .then((user) => res.status(201).json(user))
    .catch((e) => {
        const errors = handleErrors(e);
        res.status(400).json({error: errors})
    })
}

const login_post = (req: Request, res: Response) => {
    const {email, password} = req.body;
    res.send('user logged in');
}

export { signup_get, login_get, signup_post, login_post }