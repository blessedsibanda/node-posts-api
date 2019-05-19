import mongoose from 'mongoose';

const PostSchema = mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    
})