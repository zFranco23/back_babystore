const { Schema, model } = require('mongoose');

const supplierSchema = new Schema({

    name : {
        type : 'String',
        required : [ true , 'Name of supplier is required']
    },
    email : {
        type : 'String',
        required : [true , 'Email is mandatory'],
        unique : true //Mongo te avisa
    },
    password : {
        type : String,
        required : [ true , 'Password is mandatory']
    },
    avatar : {
        type : String,
        default :'',
    },
    active :{
        type : Boolean,
        default : true,
    }

},{
    versionKey : false
})

/*
    SE PUEDEN AGREGAR O SOBREESCRIBIR LOS METODOS QUE EXISTEN PARA EL SCHEMA
 */
//Cuando llamas al modelo y quieres imprimir
//Se llama el metodo toJSON
//Entonces lo sobreescribimos a nuestra manera

//Entonces aplicaria para cuando yo quiera enviar el json por respuesta
supplierSchema.methods.toJSON = function () {
    const { password , _id , ...data} = this.toObject();//Esto genera la instancia con el valor respectivo
    //Con el operador rest , los otros campos se ponen dentro de un objeto llamado ahora : user
    return {
        sid : _id,
        ...data
    };
}

module.exports = model( 'Supplier' , supplierSchema);