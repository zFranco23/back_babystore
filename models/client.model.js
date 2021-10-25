const { Schema , model } = require('mongoose');

const clientSchema = new Schema({
    name : {
        type : String,
        required : [ true , 'Name is mandatory']
    },
    email : {
        type : String,
        required : [ true , 'Email is mandatory'],
        unique : true
    },
    password : {
        type : String,
        required : [true , 'Password is mandatory']
    },
    avatar : {
        type : String,
        default :''
    },
    active : {
        type : Boolean,
        default : true,
    },
    updated : {
        type : Boolean,
        default : false
    }
} , {
    versionKey : false,
})


clientSchema.methods.toJSON = function (){
    const { password , _id , avatar, ...data} = this.toObject();

    return {
        uid : _id,
        ...data
    }
}

module.exports = model('Client', clientSchema);