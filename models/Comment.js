import { Schema, model } from 'mongoose';

import creationInfo from './plugins/creationInfo'
import modifiedOn from './plugins/modifiedOn'


let commentSchema = new Schema()
commentSchema.add({
    body: { type: String, required: true },
})

commentSchema.plugin(creationInfo);
commentSchema.plugin(modifiedOn)


const Comment = model('Comment', commentSchema);

module.exports = {
    Comment,
    commentSchema
}