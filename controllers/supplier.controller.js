const { response } = require('express');
const bcrypt = require('bcryptjs');

const Supplier = require('../models/supplier.model');



const addSupplier = async( req , res=response) => {
    try{

        const { name , email , password } = req.body;

        const supplier = new Supplier({
            name,
            email,
            password
        });

        const SALT = bcrypt.genSaltSync(10);
        const HASH = bcrypt.hashSync(password, SALT);
        
        supplier.password = HASH;

        await supplier.save();


        res.json({
            ok : true,
            created : supplier
        })

    }catch(err){
        console.log(err);
        res.status(500).json({
            ok : false,
            mssg : err.message
        })
    }
}

const getSupplier = async ( req , res = response) => {
    try{

        const id = req.supplier._id;

        const supplier = await Supplier.findById(id);

        res.json({
            ok : true,
            supplier
        })
        
    }catch(err){
        console.log(err);
        res.status(500).json({
            ok : false,
            message : err.message
        })
    }
}

const getSuppliers = async ( req , res = response ) => {

    try{
        
        const { skip=0 , limit=5 } = req.query;
        const query = { active : true } ;

        const [ total , suppliers ] = await Promise.all([
            Supplier.countDocuments(query),
            Supplier.find( query )
                .skip(Number(skip)) 
                .limit(Number(limit))
        ])

        res.json({
            ok : true,
            total,
            suppliers
        })


    }catch(err){
        console.log(err);
        res.status(500).json({
            ok : false,
            message : err.message
        })
    }
}

module.exports = {
    addSupplier,
    getSupplier,
    getSuppliers
}