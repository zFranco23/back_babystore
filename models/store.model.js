const { Schema , model } = require('mongoose');

const storeSchema = new Schema({
    name_store : {
        type : String,
        required : [ true , 'Name of store is required']
    },
    avatar_store : {
        type : String,
        default : process.env.IMG_DEFAULT
    },
    slogan : {
        type : String,
        default:'',
        required : [ true , 'Slogan is required']
    },
    website : {
        type : String,
        default:'',
        required : [ true , 'Website is required']
    },
    contact : {
        type : String,
        unique : true,
        default :'',
        required : [ true , 'Email of contact is required']
    },
    CEO : {
        type : String,
        default :'',
        required : [ true , 'CEO name is required']
    },
    active : {
        type : Boolean,
        default : true
    },
    supplier : {
        type : Schema.Types.ObjectId,
        ref : 'Supplier'
    },
    foundation : Date
},{
    versionKey : false,
})

module.exports = model('Store', storeSchema);