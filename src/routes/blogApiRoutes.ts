const express = require('express');

const router = express.Router();
import { blogs_all, blog_by_id, blog_create, blog_replace, blog_update, blog_delete } from '../controllers/blogApiController';

router.get('/', blogs_all);
router.get('/:id', blog_by_id);
router.post('/', blog_create);
router.put('/:id', blog_replace);
router.patch(':id', blog_update);
router.delete('/:id', blog_delete)

export default router;
