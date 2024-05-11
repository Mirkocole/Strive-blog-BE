import jwt from 'jsonwebtoken'
import Author from '../models/author.model.js'
import dotenv from 'dotenv'

export const generateJWT = (payload) => {
    return new Promise((res, rej) => {
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1 day' },
            (err, token) => {
                if (err) {
                    rej(err);
                } else {
                    res(token);
                }
            }
        )
    })
}


export const verifyJWT = (token) => {
    return new Promise((res, rej) => {
        jwt.verify(
            token,
            process.env.JWT_SECRET,
            (err, decoded) => {
                if (err) {
                    rej(err);
                } else {
                    res(decoded);
                }
            }
        )
    })
}


// Middleware da utilizzare nelle richieste che necessitano di autorizzazione
export const authMiddleware = async (req, res, next) => {
    try {
        // Non è stato fornito il token nell'header
        if (!req.headers.authorization) {
            res.status(400).send('Effettua il login');
        } else {
            // Andiamo a togliere la scritta Bearer e lo spazio dal Token
            const decoded = await verifyJWT(
                req.headers.authorization.replace('Bearer ', '')
            );

            // Il Token esiste? Verifichiamo attraverso la sua proprietà
            if(decoded.exp){
                // Andiamo ad eliminare dal token issuedAt e expiredAt
                delete decoded.iat;
                delete decoded.exp;

                // Andiamo a trovare l'utente con i dati del Payload

                const me = await Author.findOne(
                    {...decoded}
                )

                if(me){
                    req.user = me;
                    next();
                }else{
                    res.status(401).send('Utente non trovato');
                }
            }else{
                res.status(401).send('Rieffettua il login');
            }
        }
    } catch (error) {
        next(error);
    }
}