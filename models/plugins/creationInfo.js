import mongoose from 'mongoose'

const creationInfo = (schema, options ) => {
    schema.add({ createdOn: { type: Date, default: Date.now }}),
    schema.add({ createdBy: { type: mongoose.Schema.Types.ObjectId, ref:'User', required: true }})
}

export default creationInfo