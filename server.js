import express from 'express';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import { authorsRoute } from './routes/authors.route.js';
import { blogsRoute } from './routes/blogs.route.js';
import { authRouter } from './routes/auth.route.js';
import session from 'express-session';
import passport from 'passport';
import googleStrategy from './middlewares/passport.js';

config();

const server = express();

server.use(session({
    secret : 'some secret',
    saveUninitialized : false
}));

// Google Strategy
passport.use('google', googleStrategy);
server.use(express.json());


const whitelist = ['https://striveblog-gamma.vercel.app/'];
const corsOptions = {
    origin: 'https://www.nileshblog.tech/',//(https://your-client-app.com)
    optionsSuccessStatus: 200,
  };


server.use(cors(corsOptions));



server.use('/auth',authRouter);
server.use('/authors',authorsRoute);
server.use('/blogPosts',blogsRoute);

server.use(passport.initialize());
server.use(passport.session());

server.use('/', (req,res)=>{
    res.send('Server Listening');
})
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