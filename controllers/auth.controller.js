const { response } = require("express");
const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken');

const Supplier = require('../models/supplier.model');
const Client = require('../models/client.model');

const { generateJWT } = require("../helpers/generateJWT");
const { sendEmail, sendNormalEmail } = require("../helpers/email");


const authLogin = async ( req, res = response) => {
    try{

        const { password } = req.body;
        const { collection } = req.params;

        const entity = req.entity;//client o supplier
        let signValidation;

        switch(collection){
            case 'supplier':
                signValidation = process.env.SECRET_JWT_TOKEN_SUPPLIER ;
                break;
            case 'client' :
                signValidation = process.env.SECRET_JWT_TOKEN_CLIENT ;
                break;
        }

        const isSamePassword = bcrypt.compareSync(password, entity.password);

        if(!isSamePassword){
            return res.status(400).json({
                ok : false,
                mssg : 'User || Password incorrect - Password'
            })
        }

        //Ya pasó la autenticacion , devolver token

        const token = await generateJWT(entity._id , signValidation);

        res.json({
            ok : true,
            type : collection,
            mssg : 'Authenticated',
            token,
            name : entity.name
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
        
        const entity = req.entity;

        if(!entity){
            return res.status(400).json({
                ok : false,
                mssg : 'No existe'
            })
        }

        res.json({
            ok : true,
            mssg :'Token autorizado',
            name : entity.name
        })

    }catch(err){
        console.log(err);
        res.status(500).json({
            ok : false,
            mssg : 'Invalid or expired token'
        })
    }
}


const forgotPassword = async ( req , res = response) => {
    try{

        const { collection } = req.params;
        const entity = req.entity;

        let secret;
        switch (collection) {
            case 'supplier':
                secret = process.env.SECRET_JWT_TOKEN_SUPPLIER;
                break;
           case 'client':
                secret = process.env.SECRET_JWT_TOKEN_CLIENT;
                break;
        }

        //Nueva firma sea supplier o client con el password encriptado
        //Si cambia el password ya no servirá el endpoint
        const signValidation = secret + entity.password;
        const token = await generateJWT(entity._id , signValidation);
        
        const URL = process.env.URL_FORGOT_PASSWORD + token + '/' + entity._id;

        const startSendingEmail = await sendEmail(URL, entity.email);

        if(!startSendingEmail.sent) return res.status(500).json({
            ok : false,
            mssg : 'Error sending the email'
        })

        console.log('INFO-EMAIL: ',startSendingEmail.info);
        console.log(URL);
        res.json({
            ok : true,
            type : collection,
            mssg : `Reset link has been sent to ${entity.email}`
        })

    }catch(err){
        console.log(err);
        res.status(500).json({
            ok : false,
            mssg : err.message
        })
    }
}

const authorizeResetPassword = ( req , res=response) => {
    try{

        //TODO: agregar la validacion por cliente, por ahora solo está por supplier
        //TODO: expiracion maximo 15 minutos
        // const { token } = req.params;

        const { email } = req.supplier;
        res.json({
            ok : true,
            state :'A',
            email 
        })

    }catch(err){
        console.log(err);
        res.status(500).json({
            ok : false,
            state : 'E'
        })
    }
}

const resetPassword = async ( req , res = response) => {
    try{

        const entity = req.entity;

        const { collection } = req.params;
        const { password } = req.body;

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        entity.password = hash;

        let model;
        switch( collection) {
            case 'supplier' :
                model = Supplier;
                break;
            case 'client' :
                model = Client;
                break;
        }

        const user = await model.findByIdAndUpdate(entity._id, entity , { new : true});

        res.json({
            ok : true,
            mssg : 'Password updated'
        })

    }catch(err){
        console.log(err);
        res.status(500).json({
            ok : false,
            mssg : err.message
        })
    }
}

const sendEmailTo = async( req, res = response) => {
    try{
        const startSendingEmail = await sendNormalEmail(req.body.name,req.body.email,req.body.message, req.body.subject);

        if(!startSendingEmail.sent) return res.status(500).json({
            ok : false,
            mssg : 'Error sending the email'
        })


        return res.status(200).json({
            ok : true,
            message :'Email sent'
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
    authLogin,
    authValidate,
    authorizeResetPassword,
    forgotPassword,
    resetPassword,
    sendEmailTo
};