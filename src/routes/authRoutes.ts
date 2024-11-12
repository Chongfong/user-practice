const express = require('express');

const router = express.Router();
import { signup_get, signup_post, login_get, login_post } from '../controllers/authController';

router.get('/signup', signup_get);
router.post('/signup', signup_post);
router.get('/login', login_get);
router.post('/login', login_post);

export default router;
