import { Schema, model } from "mongoose";

const commentSchema = new Schema({
    author : {
        type: Schema.Types.ObjectId,
        ref: "Author",
        required : true
    },
    content : {type : String, required : true},
},
{
    timestamps : true,
    collection : 'comment'
});

export default model('Comment',commentSchema);
