
const Supplier = require('../models/supplier.model');
const Product = require('../models/product.model');
const Client = require('../models/client.model');
const Store = require('../models/store.model');


const emailAlreadyInUse = async (  email='' , collection='') =>{
    
    let exists;
    switch (collection) {
        case 'supplier':
            exists = await Supplier.findOne({ email });
            break;
        case 'client' :    
            exists = await Client.findOne({ email });
            break;
        default:
            break;
    }

    if(exists){
        throw new Error(`Email ${email} already in use`);
    }

    return true;

}

const notRepeatProduct = async ( name='' ) => {

    const existsProduct = await Product.findOne( { name  : name.trim()});
    
    if(existsProduct){
        throw new Error(`Product ${name} already exists`);
    }
    return true;
}

const existSupplierWithThisId = async ( id='') => {
    const existSupplier = await Supplier.findById(id);
    
    if(!existSupplier){
        throw new Error(`There is no a supplier with that id`);
    }
    return true;
}

const existsProduct = async ( id='') => {

    const existsProduct = await Product.findById(id);
    if(!existsProduct){
        throw new Error(`There is no product with that id`);
    }
    return true;
}

const existsStore = async ( id='') => {

    const existsStore = await Store.findById(id);
    if(!existsStore){
        throw new Error(`There is no store with that id`);
    }
    return true;
}


const allowedCollections = ( collection='' , collections = [ ]) => {

    const included = collections.includes(collection);
    if(!included){
        throw new Error(`Collection ${collection} not allowed - ${collections}`);
    }

    //Como recibo otros argumentos
    //ya no se da el return implícito

    return true;
}

module.exports = {
    emailAlreadyInUse,
    notRepeatProduct,
    existsProduct,
    existsStore,
    allowedCollections,
    existSupplierWithThisId
};