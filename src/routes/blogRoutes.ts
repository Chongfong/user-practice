const express = require('express');

const router = express.Router();
import { blog_index, blog_details, blog_create_get, blog_create_post, blog_delete } from '../controllers/blogController';

router.get('/', blog_index);
router.post('/', blog_create_post);
router.delete('/:id', blog_delete);
router.get('/create', blog_create_get);

// NOTE: check if there is a id in the url
router.get('/:id', blog_details);

export default router;
