const { response } = require("express");
const { productState } = require("../helpers/constants");

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

        const { skip=0 , limit=5 , state ='A' } = req.query;
        const idSupplier = req.supplier._id;

        //Verificar el estado que desea
        let active=true;
        if(state === productState.ACTIVE){
            active = true;
        }else if (state === productState.INACTIVE){
            active = false;
        }else{
            return res.status(400).json({
                ok : false,
                mssg : 'Incorrect state'
            })
        }

        const query = { supplier : idSupplier , active  };


        const [ total , products ] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
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
            mssg : err.message
        })
    }
}

const getOneProductOfSupplier = async ( req , res = response) => {
    try{

        const product = req.product;
        res.json({
            ok : true,
            product
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
        const { name , price , quantity ,desc } = req.body;

        const supplier = req.supplier._id;
        const product = new Product({
            name,
            desc,
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
        //TODO: ACTUALIZAR IMAGEN CUANDO SE INTEGRE CLOUDINARY
        const { supplier , active , img , available , ...infoProduct} = req.body;

        const product = req.product;

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
            delete product.promoPrice;//aunque borre ,existe en el modelo de la bd
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
        const product = req.product;
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
    getOneProductOfSupplier,
    getProductOfSupplier,
    updateProductOfSupplier,
    changeStateProductOfSupplier
};