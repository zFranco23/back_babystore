const { response } = require("express");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const Supplier = require('../models/supplier.model');
const Client = require('../models/client.model');

const generateJWT = require("../helpers/generateJWT");


const authLogin = async ( req, res = response) => {
    try{

        const { email , password } = req.body;
        const { collection } = req.params;

        let model;
        let signValidation;

        switch(collection){
            case 'supplier':
                signValidation = process.env.SECRET_JWT_TOKEN_SUPPLIER ;
                model = await Supplier.findOne({ email });
                break;
            case 'client' :
                signValidation = process.env.SECRET_JWT_TOKEN_CLIENT ;
                model = await Client.findOne({ email });
                break;
        }

        if(!model){
            return res.status(400).json({
                ok : false,
                mssg : 'User || Password incorrect - Email'
            })
        }

        if(!model.active){
            return res.status(400).json({
                ok : false,
                mssg : 'User || Password incorrect - Disabled'
            })
        }

        const isSamePassword = bcrypt.compareSync(password, model.password);

        if(!isSamePassword){
            return res.status(400).json({
                ok : false,
                mssg : 'User || Password incorrect - Password'
            })
        }

        //Ya pasó la autenticacion , devolver token

        const token = await generateJWT(model._id , signValidation);

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

const authValidate = ( req , res=response) => {
    try{
        
        const token = req.header('Bearer');
        const { collection } = req.params;

        if(!token){
            //Unauthorized
            return res.status(401).json({
                ok : false,
                mssg : 'Token left'
            })
        }

        let secret;
        switch (collection) {
            case 'supplier':
                secret = process.env.SECRET_JWT_TOKEN_SUPPLIER;
                break;
           case 'client':
                secret = process.env.SECRET_JWT_TOKEN_CLIENT;
                break;
        }


        const val = jwt.verify(token, secret);

        //Si existe , si esta mal formateado o no expiró , dispara el error
        if(val){
            return res.json({
                ok : true,
                mssg : 'Authenticated',
                token
            })
        }else{
            return res.status(500).json({
                ok : true,
                mssg : 'Error'
            })
        }

    }catch(err){
        console.log(err);
        res.status(500).json({
            ok : false,
            mssg : 'Invalid or expired token'
        })
    }
}

module.exports = {
    authLogin,
    authValidate
};