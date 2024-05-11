import { Schema, model } from "mongoose";

const authorSchema = new Schema(
    {
        nome: {
            type : String,
            required: false
        },
        cognome: {
            type : String,
            required: false
        },
        email: {
            type : String,
            required: true
        },password :{
            type: String
        },
        data_di_nascita: {
            type : String,
            required: false
        },
        avatar: {
            type : String,
        },
        googleId:{
            type: String,
            required : false
        }
    },{
        collection : 'authors',
    }
)

export default model('Author',authorSchema);