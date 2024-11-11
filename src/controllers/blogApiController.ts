import { Blog } from "../models/blog"
import { Request, Response } from "express"

const blogs_all = async(req: Request, res: Response) => {
    try{
        const result = await Blog.find();
        res.json({result});
      }catch(e){
          if (e instanceof Error) {
              res.status(500).json({ error: e.message });
          } else {
              res.status(500).json({ error: 'An unknown error occurred' });
          }
      }
}

const blog_by_id = async(req: Request, res: Response) => {
    const {id: blogId} = req.params;
    try{
        const result = await Blog.findById(blogId);
        if(!result){
            res.status(400).json({error: `Blog with id ${blogId} not found`});
        } else {
            res.json({result});
        }
    }catch(e){
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
}

const blog_create = async(req: Request, res: Response) => {
    const blog = new Blog(req.body);
    try{
        await blog.save();
        res.status(201).json({blog});
    }catch(e){
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
}

const blog_replace = async(req: Request, res: Response) => {
    const {id: blogId} = req.params;
    try{
        const result = await Blog.findOneAndReplace({_id: blogId} ,req.body, {new: true});
        res.json({result});
    }catch(e){
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
}

const blog_update = async(req: Request, res: Response) => {
    const {id: blogId} = req.params;
    try{
      const result = await Blog.findByIdAndUpdate({_id: blogId}, req.body, {new: true});
      res.json({result});
    }catch(e){
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
} 

const blog_delete = async(req: Request, res: Response) => {
    const {id: blogId} = req.params;
    try{
      const result = await Blog.deleteOne({_id: blogId});
      res.json({deletedCount: result.deletedCount});
    }catch(e){
        if (e instanceof Error) {
            res.status(500).json({ error: e.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
}

export {blogs_all, blog_by_id, blog_create, blog_replace, blog_update, blog_delete};