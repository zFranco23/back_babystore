const { response } = require("express");

const Supplier = require('../models/supplier.model');
const Product = require('../models/product.model');


const emailAlreadyInUse = async (  email='' ) =>{
    
    const exists = await Supplier.findOne({ email });

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

module.exports = {
    emailAlreadyInUse,
    notRepeatProduct,
    existSupplierWithThisId
};