const { Router } = require('express');
const { check } = require('express-validator');


const validateToken = require('../middlewares/validateToken');
const validateFields = require('../middlewares/validateFields');
const validateSupplierStore = require('../middlewares/validateSupplierStore');
const { existsStore } = require('../middlewares/verifyDatabase');

const { 
    getAllStores, 
    getStoreOfSupplier, 
    updateStore,
    addStore,
} = require('../controllers/store.controller');


const router = Router();


router
    .get('/all', getAllStores)

    .get('/supplier', [ 
        validateToken
    ] ,getStoreOfSupplier)

    .post('/new' , [ 
        validateToken,
        check('name_store','Name store is mandatory').not().isEmpty(),
        check('slogan','Slogan is mandatory').not().isEmpty(),
        check('website','Website is mandatory').isURL(),
        check('contact','Contact email is mandatory').not().isEmpty(),
        check('contact','Incorrect email').isEmail(),
        validateFields,
    ] , addStore)

    .put('/supplier/:idStore', [
        validateToken,
        check('idStore', 'That id is not valid ').isMongoId(),
        check('idStore').custom(existsStore),
        validateFields,
        validateSupplierStore
    ] , updateStore)


module.exports = router;