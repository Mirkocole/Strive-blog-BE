import { Router } from "express";
import { config } from 'dotenv';
import Author from "../models/author.model.js";
import CloudinaryMiddleware from '../middlewares/ multer.js';
import {authMiddleware} from '../middlewares/auth.js'

// import posts from '../data/posts.json';

export const authorsRoute = Router();
config();

authorsRoute.get('/',authMiddleware, async (req, res) => {
    try {
        // let test = JSON.parse(posts);
        // console.log(test);
        let authors = await Author.find();
        // console.log(result)
        res.send(authors);

    } catch (error) {

    }
});

authorsRoute.get('/:id',authMiddleware, async (req, res) => {
    try {
        // let test = JSON.parse(posts);
        // console.log(test);
        let authors = await Author.findById(req.params.id);
        // console.log(result)
        res.send(authors);

    } catch (error) {

    }
});

authorsRoute.put('/:id',authMiddleware, async (req, res, next) => {
    try {
        
        
        let authors = await Author.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        // console.log(result)
        res.send(authors);

    } catch (error) {
        next(error)
    }
});


authorsRoute.delete('/:id',authMiddleware, async (req, res, next) => {
    try {
        // let test = JSON.parse(posts);
        // console.log(test);
        let authors = await Author.findByIdAndDelete(req.params.id);
        // console.log(result)
        res.send(authors);

    } catch (error) {
        next(error)
    }
});


authorsRoute.post('/',authMiddleware, CloudinaryMiddleware, async (req, res, next) => {
    try {
        const data = JSON.parse(req.body.data);
        let authors = await Author.create({ ...data, avatar: req.file.path }, {
            new: true
        })
        res.send(authors).status(400);

    } catch (error) {
        next(error)
    }
});


authorsRoute.patch('/:authorId/avatar',authMiddleware, CloudinaryMiddleware, async (req, res, next) => {
    try {
        // Recuperiamo l'utente tramite l'id e gli aggiorniamo la proprietà avatar

        let updateUser = await Author.findByIdAndUpdate(req.params.authorId,
            { avatar: req.file.path },
            { new: true }
        );
        res.send(updateUser);
    } catch (error) {
        console.log(error)
    }
})


