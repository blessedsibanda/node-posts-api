import mongoose from 'mongoose'

export default modifiedOn = (schema, options ) => {
    schema.add({ modifiedOn: Date }),
    
    schema.pre('save', next => {
        this.modifiedOn = Date.now();
        next();
    })
}