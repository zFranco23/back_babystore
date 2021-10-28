const { Router }  = require('express');
const { check } = require('express-validator');

const { allowedCollections } = require('../middlewares/verifyDatabase');
const validateFields = require('../middlewares/validateFields');

const { authLogin , authValidate } = require('../controllers/auth.controller');
const validateToken = require('../middlewares/validateToken');

const router = Router();


router

    .get('/validate/:collection' , [ 
        check('collection').custom( col => allowedCollections(col, ['client','supplier'])),
        validateFields
    ] , authValidate)
    .post('/:collection' , [
        check('collection').custom( col => allowedCollections(col, ['client','supplier'])),
        check('email' , 'Email incorrect').isEmail(),
        check('password' , 'Password incorrect').not().isEmpty(),
        validateFields
    ] , authLogin)

module.exports = router;