import { Router } from "express";
import { config } from 'dotenv';
import Blog from "../models/blog.model.js";
import Comment from "../models/comment.model.js";
import blogCover from "../middlewares/blogCover.js";
import { ObjectId } from "mongodb";

// import posts from '../data/posts.json';

export const blogsRoute = Router();
config();

blogsRoute.get('/', async (req,res) => {
    try {
        // let test = JSON.parse(posts);
        // console.log(test);
      let blog = await Blog.find().populate(["author","comments"]);
            // console.log(result)
            res.send(blog);

    } catch (error) {
        
    }
});

blogsRoute.get('/:id', async (req,res) => {
    try {
        // let test = JSON.parse(posts);
        // console.log(test);
      let blog = await Blog.findById(req.params.id);
            // console.log(result)
            res.send(blog);

    } catch (error) {
        
    }
});

blogsRoute.put('/:id', async (req,res,next) => {
    try {
        
      let blog = await Blog.findByIdAndUpdate(req.params.id,req.body,{
        new : true
      });
            // console.log(result)
            res.send(blog);

    } catch (error) {
        next(error)
    }
});


blogsRoute.delete('/:id', async (req,res,next) => {
    try {
        // let test = JSON.parse(posts);
        // console.log(test);
      let blog = await Blog.findByIdAndDelete(req.params.id);
            // console.log(result)
            res.send(blog);

    } catch (error) {
        next(error)
    }
});


blogsRoute.post('/',blogCover, async (req,res,next) => {
    try {
        if (req.body.data) {
            const data = JSON.parse(req.body.data);
            // Utente Default assegnato alla creazione di un post
            let post = await Blog.create({ ...data, cover: req.file.path });
            res.send(post).status(400);
        } else {
            let post = await Blog.create({...req.body})
            res.send(post).status(400);
        }

    } catch (error) {
        next(error)
    }
});

blogsRoute.patch('/:blogId/cover',blogCover, async (req,res,next)=>{
    try {
        // Recuperiamo il blog tramite l'id e gli aggiorniamo la proprietà cover
        let updateBlog = await Blog.findByIdAndUpdate(req.params.blogId,
            {cover : req.file.path},
            {new : true}
        );
        res.send(updateBlog);
    } catch (error) {
        console.log(error)
    }
})



// POST Commento
blogsRoute.post('/:blogId', async (req,res,next)=>{
    try {
        
        let comment = await Comment.create(req.body);
        
        let post  = await Blog.findById(req.params.blogId);
        console.log(post)
        if (post.comments) {
            
            post.comments = [...post.comments , comment];
        }else{
            post.comments = [comment];
        }
        
        // console.log(post)
        let result = await Blog.findByIdAndUpdate(req.params.blogId,post,{
            new : true
        });
        res.send(result);

    } catch (error) {
        next(error)
    }
})



// PUT Commento
blogsRoute.put('/:blogId/comment/:commentId', async (req,res,next)=>{
    try {
        
        console.log(req.body)
        let commentId = req.params.commentId
        let comment = await Comment.findOneAndUpdate({_id : {$eq : commentId}},req.body,{
            new : true
        })
        console.log(comment)
        
       
        res.send(comment);

    } catch (error) {
        next(error)
    }
})

// Delete comments
blogsRoute.delete('/:blogId/comment/:commentId', async (req,res,next)=>{
    try {
        
        let commentDeleted = await Comment.findByIdAndDelete(req.params.commentId);
        if (commentDeleted) {
            let post =  await Blog.findById(req.params.blogId);
            let commenti = post.comments.filter((el) => el._id != req.params.commentId);
            let newPost = post;
            newPost.comments = commenti;

            console.log(newPost);
            
            let result = await Blog.findByIdAndUpdate(req.params.blogId,{...post,comments : commenti},{
                new : true
            });
            console.log(result)
            res.send(result)
        }else{
            // next();
        }



    } catch (error) {
        next(error)
    }
})



