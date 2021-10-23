const { Router }  = require('express');
const { check } = require('express-validator');

const authLogin = require('../controllers/auth.controller');

const router = Router();


router
    .post('/' , [ 
        check('email' , 'Email incorrect').isEmail(),
        check('password' , 'Password incorrect').not().isEmpty(),
    ] , authLogin)

module.exports = router;