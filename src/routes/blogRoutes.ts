const express = require('express');

const router = express.Router();
import { Blog } from '../models/blog';
import { Request, Response } from 'express';

router.get('/', (req: Request, res: Response) => {
    // res.send('Hello World!');
    // res.sendFile('./views/index.html', { root: __dirname }); // absolute path, so we need to add the root
    Blog.find().sort({updatedAt: 1}) // newest first
      .then((result) => {
        console.log(result)
        res.render('index', {title: 'All Blogs', blogs: result}); // ejs
    }).catch((e) => {
        res.json({error: e.message});
    })
})

router.post('/', (req: Request, res: Response) => {
    console.log(req.body);
    const blog = new Blog(req.body);
    console.log(blog);
    blog.save()
      .then((result) => {
        res.redirect('/blogs');
    }).catch((e) => {
        res.json({error: e.message});
    })
})

router.delete('/:id', (req: Request, res: Response) => {
    const {id: blogId} = req.params;
    Blog.findByIdAndDelete(blogId)
    .then(() => {
        // NOTE with frontend AJAX, redirect does nothing
        // res.redirect('/blogs'); 
        res.json({redirect: '/blogs'});
    }).catch((e) => {
        res.json({error: e.message});
    })
}) 

router.get('/create', (req: Request, res: Response) => {
    res.render('create', {title: 'Create a new blog'});
})

// NOTE: check if there is a id in the url

router.get('/:id', (req: Request, res: Response) => {
    const {id: blogId} = req.params;
    Blog.findById(blogId)
    .then((result) => {
        res.render('details', {title: 'Blog Details', blog: result});
    }).catch((e) => {
        res.json({error: e.message});
    })
})

export default router;
