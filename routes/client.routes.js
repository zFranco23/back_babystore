const { Router } = require('express');
const { check } = require('express-validator');


const validateFields = require('../middlewares/validateFields');
const { emailAlreadyInUse } = require('../middlewares/verifyDatabase');

const { addClient, getClients } = require('../controllers/client.controller');

const router = Router();


router
    .get('/all' , getClients)
    .post('/new' , [ 
        check('name' , 'Name is mandatory').not().isEmpty(),
        check('email', 'Incorrect email').isEmail(),
        check('email').custom(email => emailAlreadyInUse(email , 'client')),
        check('password' , 'Password is mandatory').not().isEmpty(),
        validateFields
    ]  ,addClient);


module.exports = router;