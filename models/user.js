const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
const passportLocalMongoose = require('passport-local-mongoose')

const productSchema = require('./product').productSchema;

const Schema = mongoose.Schema;

const userSchema =new Schema({
    name: { 
        type: String,
        
    },
    googleId: {
        type: String,
        
    },
    phoneNo: {
        type: Number,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    cartItems: {

        type: [productSchema],
        default: null
    },
    wishlistItems: {

        type: [productSchema],
        default: null
    },
    
        // toJSON: { virtuals: true },
        // toObject: { virtuals: true },
      },
      );

    userSchema.virtual('wishlist', {
        ref: 'Product',
        localField: '_id',
        foreignField: 'userId',
    });
userSchema.plugin(passportLocalMongoose)
userSchema.plugin(findOrCreate)

module.exports = new mongoose.model('User', userSchema);
