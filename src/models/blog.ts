import { Schema, model } from "mongoose";

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    snippets: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    } 
}, {
    timestamps: true
})

export const Blog = model('Blog', blogSchema);