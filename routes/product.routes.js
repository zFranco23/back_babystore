const { Router } = require('express');
const { check } = require('express-validator');

const { notRepeatProduct } = require('../middlewares/verifyDatabase');
const validateFields = require('../middlewares/validateFields');
const { addProduct , getProducts } = require('../controllers/product.controller');
const validateToken = require('../middlewares/validateToken');

const router = Router();

router
    .get('/all', getProducts)
    .post('/new' , [
        validateToken,
        check('name' ,'Name is mandatory').not().isEmpty(),
        check('name').custom( notRepeatProduct ),
        check('quantity' , 'Quantity is mandatory').not().isEmpty(),
        validateFields
     ] ,addProduct);

module.exports = router;