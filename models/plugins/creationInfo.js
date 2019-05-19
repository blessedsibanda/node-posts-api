import mongoose from 'mongoose'

export default creationInfo = (schema, options ) => {
    schema.add({ createdOn: { type: Date, default: Date.now }}),
    schema.add({ createdBy: { type: mongoose.Schema.Types.ObjectId, 
        ref='User', required: true }}),
}