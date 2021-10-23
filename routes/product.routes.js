const { Router } = require('express');
const { check } = require('express-validator');

const validateToken = require('../middlewares/validateToken');
const validateFields = require('../middlewares/validateFields');
const validateSupplierProduct = require('../middlewares/validateSupplierProduct');
const { notRepeatProduct ,existsProduct } = require('../middlewares/verifyDatabase');

const { 
    addProduct , 
    getProducts, 
    getProductOfSupplier, 
    updateProductOfSupplier, 
    changeStateProductOfSupplier 
} = require('../controllers/product.controller');

const router = Router();

router
    .get('/all', getProducts)

    .get('/supplier', [
        validateToken
    ] , getProductOfSupplier)

    .post('/new' , [
        validateToken,
        check('name' ,'Name is mandatory').not().isEmpty(),
        check('name').custom( notRepeatProduct ),
        check('quantity' , 'Quantity is mandatory').not().isEmpty(),
        validateFields
     ] ,addProduct)

     .put('/supplier/:idProduct', [ 
        validateToken,
        check('idProduct', 'That id is not valid ').isMongoId(),
        check('idProduct').custom(existsProduct),
        validateSupplierProduct,
        validateFields
     ],updateProductOfSupplier)

     .patch('/supplier/:idProduct' , [
        validateToken,
        validateSupplierProduct,
     ], changeStateProductOfSupplier)

module.exports = router;