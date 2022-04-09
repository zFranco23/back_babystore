const { Router }  = require('express');
const { check } = require('express-validator');

const { allowedCollections , existEntityWithThisEmail , validExistModel} = require('../middlewares/verifyDatabase');
const { validateTokenMultiple , validateTokenForgot , validateTokenForgotParams } = require('../middlewares/validateToken');
const validateFields = require('../middlewares/validateFields');
const checkSamePassword = require('../middlewares/validatePassword');

const { 
    authLogin,
    authorizeResetPassword,
    authValidate, 
    forgotPassword,
    resetPassword,
    sendEmailTo
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
        validateTokenForgotParams
    ] ,authorizeResetPassword )

    .post('/forgot_password/:collection' , [ 
        check('collection').custom( col => allowedCollections(col, ['client','supplier'])),
        check('email', 'Email is mandatory').not().isEmpty(),
        check('email' , 'Email incorrect').isEmail(),
        validateFields,
        existEntityWithThisEmail
    ] , forgotPassword)

    .post('/reset_password/:collection' , [
        check('collection').custom( col => allowedCollections(col, ['client','supplier'])),
        check('password' , 'Password is mandatory').not().isEmpty(),
        check('password' , 'Password must be at least 5 characters').isLength( { min : 5}),
        check('confirm_password').custom( (password , { req }) =>  checkSamePassword( password, req ) ),
        validateFields,
        validateTokenForgot
    ] , resetPassword ) 

    .post('/email/send', [
        check('name').not().isEmpty(),
        check('email', 'Email is mandatory').not().isEmpty(),
        check('email' , 'Email incorrect').isEmail(),
        check('message' , 'Max 200 characters allowed').isLength( { max : 200}),
    ],sendEmailTo)


module.exports = router;