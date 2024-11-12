import { Request, Response } from "express";
import { User } from "../models/user";

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
    .catch((e) => res.status(400).json({error: e.message}))
}

const login_post = (req: Request, res: Response) => {
    const {email, password} = req.body;
    res.send('user logged in');
}

export { signup_get, login_get, signup_post, login_post }