const { Router }  = require('express');
const { check } = require('express-validator');

const { allowedCollections , existEntityWithThisEmail , validExistModel} = require('../middlewares/verifyDatabase');
const validateFields = require('../middlewares/validateFields');
const { validateTokenMultiple , validateTokenForgot } = require('../middlewares/validateToken');

const { 
    authLogin,
    authorizeResetPassword,
    authValidate, 
    forgotPassword
} = require('../controllers/auth.controller');

const router = Router();


router

    .get('/validate/:collection' , [ 
        check('collection').custom( col => allowedCollections(col, ['client','supplier'])),
        validateFields,
        validateTokenMultiple
    ] , authValidate)

    .post('/:collection' , [
        check('collection').custom( col => allowedCollections(col, ['client','supplier'])),
        check('email', 'Email is mandatory').not().isEmpty(),
        check('email' , 'Email incorrect').isEmail(),
        check('password' , 'Password incorrect').not().isEmpty(),
        validateFields,
        existEntityWithThisEmail
    ] , authLogin)

    //Este endpoint es para verificar si aun puede usar para cambiar la cuenta
    .get('/reset_password/:token/:id', [
        validateTokenForgot
    ] ,authorizeResetPassword )

    .post('/forgot_password/:collection' , [ 
        check('collection').custom( col => allowedCollections(col, ['client','supplier'])),
        check('email', 'Email is mandatory').not().isEmpty(),
        check('email' , 'Email incorrect').isEmail(),
        validateFields,
        existEntityWithThisEmail
    ] , forgotPassword)


module.exports = router;