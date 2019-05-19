import mongoose from 'mongoose';

import creationInfo from './plugins/creationInfo'
import modifiedOn from './plugins/modifiedOn'

const commentSchema = mongoose.Schema({
    body: { type: String, required: true },
    postId: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
})

commentSchema.plugin(creationInfo);
commentSchema.plugin(modifiedOn)

export default commentSchema;

