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
                .populate('supplier','name')
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

const getProductOfSupplier = async ( req , res=response ) => {
    try{

        const idSupplier = req.supplier._id;
        const products = await Product.find({ supplier : idSupplier}).populate('supplier','name');

        
        if(products.length >0 ){
            return res.json({ ok : true , products })
        }

        res.json({
            ok : true,
            mssg : 'No products'
        })


        
    }catch(err){
        console.log(err);
        res.status(500).json({
            ok : false,
            mssg : err.message
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

const updateProductOfSupplier = async (req , res= response )=> {
    try{
        //TODO : ACTUALIZAR IMAGEN CUANDO SE INTEGRE CLOUDINARY
        const { supplier , active , img , available , ...infoProduct} = req.body;
        const { idProduct } = req.params;

        const product = await Product.findById(idProduct);

        //Mapear los campos
        const arrayKeys =Object.keys(infoProduct);
        
        //Actualizar solo los campos que me envia
        arrayKeys.forEach(( field , i) => {
            product[field]=infoProduct[field];
        })

        //Si tiene el descuento y no lo envia , setearlo como el precio real
        if(product.haveDiscount ){
            if(!product.promoPrice){
                product.promoPrice = product.price;
            }
        }else{
            delete product.promoPrice;
        }

        const updated = await Product.findByIdAndUpdate( idProduct , product, { new : true } );

        res.json({
            ok : true,
            updated
        })


    }catch(err){
        console.log(err);
        res.status(500).json({
            ok : false,
            mssg : err.message
        })
    }
}

const changeStateProductOfSupplier = async ( req , res = response) => {
    try{
        
        const { active , available } = req.body;
        const { idProduct } = req.params;

        //Traer al producto y actualizar
        const product = await Product.findById(idProduct);
        product.active = active;
        product.available = available;

        const updated = await Product.findByIdAndUpdate( idProduct , product , { new : true });
        res.json({
            ok : true,
            updated
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
    addProduct,
    getProducts,
    getProductOfSupplier,
    updateProductOfSupplier,
    changeStateProductOfSupplier
};