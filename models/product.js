const mongoose = require('mongoose');
 const productSchema =new mongoose.Schema({
     name:String,
     price:Number,
     pattern:String,
     category:String,
     occassion:String,
     description:String,
     imageUrl:{
        type:String,
        require:true
     }
 });

exports.productSchema =productSchema
exports.Product =new mongoose.model('Product',productSchema)



