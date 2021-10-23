
const Product = require('../models/product.model');

const validateSupplierProduct = async ( req, res , next) =>{

    const idSupplier = req.supplier._id;
    const { idProduct } = req.params;

    const product = await Product.findOne({ supplier : idSupplier , _id : idProduct });
    // const product = await Product.findById(idProduct);
    if(!product){
        return res.status(400).json({
            ok : false,
            mssg : 'That product is not associated with that supplier'
        })
    }

    next();
}

module.exports = validateSupplierProduct;