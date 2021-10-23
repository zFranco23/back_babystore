const { response } = require("express");

const Product = require('../models/product.model');



const getProducts = async ( req , res=response ) => {
    try{
        
        const { skip=0 , limit=5 } = req.query;
        const query = { active : true } ;

        const [ total , products ] = await Promise.all([
            Product.countDocuments(query),
            Product.find( query )
                .skip(Number(skip)) 
                .limit(Number(limit))
        ])

        res.json({
            ok : true,
            total,
            products
        })


    }catch(err){
        console.log(err);
        res.status(500).json({
            ok : false,
            message : err.message
        })
    }
}


const addProduct = async ( req , res = response ) => {
    try{
        const { name , price , quantity } = req.body;

        console.log(req.supplier);
        const supplier = req.supplier._id;
        const product = new Product({
            name,
            price,
            quantity,
            supplier
        })

        await product.save();

        res.json({
            ok : true,
            created : product
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            ok : false,
            mssg : err.message
        })
    }
}

module.exports = {
    addProduct ,
    getProducts
};