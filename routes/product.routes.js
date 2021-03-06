const { Router } = require('express');
const { check } = require('express-validator');

const { validateToken } = require('../middlewares/validateToken');
const validateFields = require('../middlewares/validateFields');
const validateSupplierProduct = require('../middlewares/validateSupplierProduct');
const { notRepeatProduct ,existsProduct } = require('../middlewares/verifyDatabase');

const { 
    addProduct , 
    getProducts, 
    getOneProductOfSupplier,
    getProductOfSupplier, 
    updateProductOfSupplier, 
    changeStateProductOfSupplier, 
} = require('../controllers/product.controller');

const router = Router();

router
    .get('/all', getProducts)

    .get('/supplier', [
        validateToken
    ] , getProductOfSupplier)

    .get('/one/:idProduct' , [
        validateToken,
        check('idProduct', 'That id is not valid ').isMongoId(),
        check('idProduct').custom(existsProduct),
        validateFields,
        validateSupplierProduct,
    ] , getOneProductOfSupplier)

    .post('/new' , [
        validateToken,
        check('name' ,'Name is mandatory').not().isEmpty(),
        check('name').custom( notRepeatProduct ),
        check('desc' ,'Description is mandatory').not().isEmpty(),
        check('quantity' , 'Quantity is mandatory').not().isEmpty(),
        validateFields
     ] ,addProduct)

     .put('/supplier/:idProduct', [ 
        validateToken,
        check('idProduct', 'That id is not valid ').isMongoId(),
        check('idProduct').custom(existsProduct),
        validateFields,
        validateSupplierProduct,
     ],updateProductOfSupplier)

     .patch('/supplier/:idProduct' , [
        validateToken,
        check('idProduct', 'That id is not valid ').isMongoId(),
        check('idProduct').custom(existsProduct),
        validateFields,
        validateSupplierProduct,
     ], changeStateProductOfSupplier)

module.exports = router;