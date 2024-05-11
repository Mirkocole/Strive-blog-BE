import { Router } from "express";
import  bcrypt  from "bcryptjs";
import Author from '../models/author.model.js'
import { authMiddleware, generateJWT } from "../middlewares/auth.js";
import passport from "passport";

export const authRouter = Router();

authRouter.get('/', async(req,res,next) =>{
    res.send('Login Page');
});

authRouter.post('/register', async (req,res,next)=>{
    try {
        let author = await Author.create({...req.body, password : await bcrypt.hash(req.body.password,10)})
        res.send(author);

    } catch (error) {
        next(error);
    }
})

authRouter.post('/login', async (req,res,next)=>{
    try {
        let userFound = await Author.findOne({
            email: req.body.email
        });

        if (userFound) {
            const isPasswordMatching = await bcrypt.compare(
                req.body.password,
                userFound.password
            );

            if (isPasswordMatching) {
                
                // Genera Token
                const token = await generateJWT({
                    _id : userFound._id
                })
                

                // Mandiamo in risposta l'utente trovato ed il token assegnato
                res.send({user: userFound,token});
            } else {
                res.status(400).send('Password non corretta');
            }
        } else {
            res.status(404).send('Utente non trovato');
        }

    } catch (error) {
        next(error);
    }
});


authRouter.get('/profile', authMiddleware, async (req,res,next)=>{
    try {
        
        let user = await Author.findById(req.user._id);
        
        res.send(user);


    } catch (error) {
        next(error)
    }
});

authRouter.get('/me', authMiddleware, async (req,res,next) =>{
    try {
        
        
        let admin = await Author.findById(req.user._id);
        if (admin) {
            
            res.send(admin);
        } else {
            res.status(400).send('Utente non trovato')
        }
    } catch (error) {
        next(error)
    }
})


authRouter.get('/googleLogin', passport.authenticate('google',{scope:['profile','email']}));

authRouter.get('/callback', passport.authenticate('google',{session:false}), (req,res,next)=>{

    try {
        res.redirect('http://localhost:3000/profile?accessToken='+req.user.accToken);
    } catch (error) {
        next(error);
    }


});
