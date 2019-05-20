import mongoose from 'mongoose'

const modifiedOn = (schema, options ) => {
    schema.add({ modifiedOn: Date }),
    
    schema.pre('save', next => {
        this.modifiedOn = Date.now();
        next();
    })
}

export default modifiedOn