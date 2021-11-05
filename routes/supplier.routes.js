const { Router } = require('express');
const { check } = require('express-validator');


const { emailAlreadyInUse } = require('../middlewares/verifyDatabase');
const validateFields = require('../middlewares/validateFields');
const { validateToken } = require('../middlewares/validateToken');

const { addSupplier, getSupplier, getSuppliers } = require('../controllers/supplier.controller');

const router = Router();


router
    .get('/all', getSuppliers)

    .get('/one', [
        validateToken
    ], getSupplier)
    
    .post('/new' , [ 
        check('name' , 'Name is mandatory').not().isEmpty(),
        check('email', 'Incorrect email').isEmail(),
        check('email').custom( email => emailAlreadyInUse( email , 'supplier' )),
        check('password' , 'Password is mandatory').not().isEmpty(),
        validateFields
    ]  ,addSupplier);


module.exports = router;