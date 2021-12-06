const { Schema, model } = require('mongoose');

const productSchema = new Schema({

    name : {
        type : String,
        required : [ true , 'Name of product is required']
    },
    price : {
        type : Number,
        default : 0,
    },
    desc : {
        type : String,
        required : [ true , 'Description is required']
    },
    quantity : {
        type : Number,
        required : [ true , 'Quantity of product is required']
    },
    haveDiscount : {
        type : Boolean,
        default : false
    },
    promoPrice : Number,
    available : {
        type : Boolean,
        default : true
    },
    img : {
        type : String,
        default : process.env.IMG_DEFAULT,
    },
    active :{
        type : Boolean,
        default : true,
    },
    supplier : {
        type : Schema.Types.ObjectId,
        ref : 'Supplier'
    },

},{
    versionKey : false
})

module.exports = model( 'Product' , productSchema);