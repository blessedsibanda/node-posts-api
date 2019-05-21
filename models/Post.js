import mongoose from 'mongoose';

import { commentSchema } from './Comment'
import creationInfo from './plugins/creationInfo'
import modifiedOn from './plugins/modifiedOn'


const postSchema = mongoose.Schema({
    title: { type: String, required: true, unique: true },
    body: { type: String, required: true },
    comments: [commentSchema],
})

postSchema.plugin(creationInfo)
postSchema.plugin(modifiedOn)

const Post = mongoose.model('Post', postSchema);

export default Post;