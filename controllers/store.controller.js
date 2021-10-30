const { response } = require('express');

const Store = require('../models/store.model');


const getAllStores = async ( req , res=response ) => {

    try{

        const { skip=0 , limit=5 } = req.query;
        const query = { active : true } ;

        const [ total , stores ] = await Promise.all([
            Store.countDocuments(query),
            Store.find( query )
                .skip(Number(skip)) 
                .limit(Number(limit))
                .populate('supplier','name')
        ])

        res.json({
            ok : true,
            total,
            stores
        })

    }catch(err){
        console.log(err);
        res.status(500).json({
            ok : false,
            mssg : err.message
        })
    }
}

const getStoreOfSupplier = async ( req , res=response ) => {

    try{

        const id = req.supplier._id;

        const store = await Store.findOne({ supplier : id }).populate('supplier', 'name')

        if(store){
            return res.json({
                ok : true , 
                store
            })
        }

        res.json({
            ok : true,
            mssg : 'This supplier doesnt have a store yet'
        })

    }catch(err){
        console.log(err);
        res.status(500).json({
            ok : false,
            mssg : err.message
        })
    }
}


const addStore = async ( req , res=response ) => {

    try{

        const supplierModel = req.supplier; 

        const { active , supplier , avatar_store , ...restInfo  } = req.body;

        const store = new Store(restInfo);

        store.supplier = supplierModel._id;
        supplierModel.store = store._id;

        // await Promise.all([
        //     supplierModel.save(),
        //     store.save()
        // ])

        await store.save();
        await supplierModel.save();

        res.json({
            ok : true,
            store
        })

    }catch(err){
        console.log(err);
        res.status(500).json({
            ok : false,
            mssg : err.message
        })
    }
}
const updateStore = async ( req , res=response ) => {

    try{
        const store = req.store;

        const { active , supplier , avatar_store , ...restInfo  } = req.body;

        const updated = await Store.findByIdAndUpdate(store.id, restInfo , {
            new : true
        })

        res.json({
            ok : true,
            updated
        })


    }catch(err){
        console.log(err);
        res.status(500).json({
            ok : false,
            mssg : err.message
        })
    }
}



module.exports = {
    getAllStores,
    getStoreOfSupplier,
    addStore,
    updateStore
}