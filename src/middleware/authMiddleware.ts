import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
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

export default requireAuth;