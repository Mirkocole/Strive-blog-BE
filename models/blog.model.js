import { Schema, model } from "mongoose";

const blogSchema = new Schema(
    {
        category: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        cover: {
            type: String,
        },
        readTime: {
            value:
            {
                type: Number,
            },
            unit: {
                type: String
            }
        },
        author: {
            type : Schema.Types.ObjectId,
            ref : "Author"
        },
        content: {
            type: String,
        },
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: "Comment",
            }
        ]
    }, {
    collection: 'blogs',
}
)

export default model('Blog', blogSchema);