const { Router } = require('express');
const { check } = require('express-validator');


const validateFields = require('../middlewares/validateFields');
const { emailAlreadyInUse } = require('../middlewares/verifyDatabase');

const { addSupplier, getSuppliers } = require('../controllers/supplier.controller');

const router = Router();


router
    .get('/all' , getSuppliers)
    .post('/new' , [ 
        check('name' , 'Name is mandatory').not().isEmpty(),
        check('email', 'Incorrect email').isEmail(),
        check('email').custom(emailAlreadyInUse),
        check('password' , 'Password is mandatory').not().isEmpty(),
        validateFields
    ]  ,addSupplier);


module.exports = router;