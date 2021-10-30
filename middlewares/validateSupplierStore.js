

const Store = require('../models/store.model');

const validateSupplierStore = async ( req, res , next) => {

    const { idStore } = req.params;
    
    const store = await Store.findById(idStore);

    if(!store){
        res.status(400).json({
            ok : false,
            mssg : 'That store is not associated with that supplier'
        })
    }

    req.store = store;
    next();
}

module.exports = validateSupplierStore;