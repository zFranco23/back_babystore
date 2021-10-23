const { response } = require("express");
const bcrypt = require('bcryptjs')

const Supplier = require('../models/supplier.model');
const generateJWT = require("../helpers/generateJWT");


const authLogin = async ( req, res = response) => {
    try{

        const { email , password } = req.body;

        const supplier = await Supplier.findOne({ email });

        if(!supplier){
            return res.status(400).json({
                ok : false,
                mssg : 'Supplier || Password incorrect - Email'
            })
        }

        if(!supplier.active){
            return res.status(400).json({
                ok : false,
                mssg : 'Supplier || Password incorrect - Disabled'
            })
        }

        const isSamePassword = bcrypt.compareSync(password, supplier.password);

        if(!isSamePassword){
            return res.status(400).json({
                ok : false,
                mssg : 'Supplier || Password incorrect - Password'
            })
        }

        //Ya pasó la autenticacion , devolver token

        const token = await generateJWT(supplier._id);

        res.json({
            ok : true,
            mssg : 'Authenticated',
            token
        })


    }catch(err){
        console.log(err);
        res.status(500).json({
            ok : false,
            mssg : err.message
        })
    }
}

module.exports = authLogin;