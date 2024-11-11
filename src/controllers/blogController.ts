import { Blog } from "../models/blog"
import { Request, Response } from "express"

const blog_index = (req: Request, res: Response) => {
    // res.send('Hello World!');
    // res.sendFile('./views/index.html', { root: __dirname }); // absolute path, so we need to add the root
    Blog.find().sort({updatedAt: 1}) // newest first
      .then((result) => {
        res.render('blogs/index', {title: 'All Blogs', blogs: result}); // ejs
    }).catch((e) => {
        res.json({error: e.message});
    })
}

const blog_details = (req: Request, res: Response) => {
    const {id: blogId} = req.params;
    Blog.findById(blogId)
    .then((result) => { // REMEMBER to handle id not found error, the result will be null
        if(result){
            res.render('blogs/details', {title: 'Blog Details', blog: result});
        } else {
            res.status(404).render('404', {title: 'Blog Not Found'});
        }
    }).catch((e) => {
        res.status(404).render('404', {title: 'Blog Not Found'});
    })
}

const blog_create_get = (req: Request, res: Response) => {
    res.render('blogs/create', {title: 'Create a new blog'});
}

const blog_create_post = (req: Request, res: Response) => {
    const blog = new Blog(req.body);
    blog.save()
      .then((result) => {
        res.redirect('/blogs');
    }).catch((e) => {
        res.json({error: e.message});
    })
}

const blog_delete = (req: Request, res: Response) => {
    const {id: blogId} = req.params;
    Blog.findByIdAndDelete(blogId)
    .then(() => {
        // NOTE with frontend AJAX, redirect does nothing
        // res.redirect('/blogs'); 
        res.json({redirect: '/blogs'});
    }).catch((e) => {
        res.json({error: e.message});
    })
}

export { blog_index, blog_details, blog_create_get, blog_create_post, blog_delete }; 