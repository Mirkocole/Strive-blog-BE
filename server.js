import express from 'express';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import { authorsRoute } from './routes/authors.route.js';
import { blogsRoute } from './routes/blogs.route.js';
import { authRouter } from './routes/auth.route.js';
import passport from 'passport';
import googleStrategy from './middlewares/passport.js';

config();

const server = express();

passport.use('google', googleStrategy);
server.use(express.json());

server.use(cors({
    origin : 'https://mongo1-c6e3sl0mm-mirko-colellas-projects.vercel.app/',
}))

// Google Strategy


server.use('/auth',authRouter);
server.use('/authors',authorsRoute);
server.use('/blogPosts',blogsRoute);

server.use(passport.initialize());
server.use(passport.session());

const initServer = async ()=>{
    try {
        mongoose.connect(process.env.MONGO_URL_REMOTE);

        console.log('Connesso al Database');
        
        server.listen(process.env.PORT, ()=>{
            console.log('Server in ascolto alla porta '+process.env.PORT)
        })

    } catch (error) {
        
        console.log('errore di connessione al Database');
    }
}

initServer();