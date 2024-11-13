import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user';
dotenv.config();

const SECRET = process.env.SECRET_KEY as string;

if (!SECRET) {
    throw new Error('SECRET_KEY is not defined in the environment variables');
}

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, SECRET, (err: jwt.VerifyErrors | null, decodedToken:  JwtPayload | string | undefined) => {
            if(err){
                console.log(err.message);
                res.redirect('/login');
            }else{
                console.log(decodedToken);
                next(); // REMEMBER to call next!
            }
        } )
    } else {
      res.redirect('/login')
    }
}

// check current user

const checkUser = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if(token){
      jwt.verify(token, SECRET, async (err: jwt.VerifyErrors | null, decodedToken:  JwtPayload | string | undefined) => {
        if(err){
          console.log(err.message);
          res.locals.user = null;
          next();
        } else if ( decodedToken && typeof decodedToken !== 'string' ) {
          console.log(decodedToken);
          let user = await User.findById(decodedToken.id);
          res.locals.user = user;  // res.locals.{any} = global variable
          next();
        }
        })
    } else {
      res.locals.user = null;
      next();
    }
}

export { requireAuth, checkUser };