const jwt = require('jsonwebtoken');

const Supplier = require('../models/supplier.model'); 
const Client = require('../models/client.model'); 


const validateToken = async ( req , res , next) => {

    const token = req.header('Bearer');

    if(!token){
        //Unauthorized
        return res.status(401).json({
            ok : false,
            mssg : 'Token left'
        })
    }

    try{

        const { uid } = jwt.verify(token , process.env.SECRET_JWT_TOKEN_SUPPLIER);

        const supplier = await Supplier.findById(uid); 
        //Si el supplier es eliminado fisicamente de la db pero aun mantiene el token
        //Se debe rechazar

        if(!supplier){
            return res.status(401).json({
                ok : false,
                mssg : 'Supplier does not exist'
            })
        }
        //Si el usuario está activo
        if (!supplier.active ){
            return res.status(401).json({
                ok : false,
                mssg : 'Invalid token , supplier is disabled'
            })
        }

        //Envio todo el supplier
        req.supplier = supplier;

        next();//Seguir con el siguiente middleware

    }catch(err){
        console.log(err);
        res.status(401).json({
            ok : false,
            mssg : 'Invalid token'
        })
    }
}

const validateTokenClient = async ( req , res , next) => {

    const token = req.header('Bearer');

    if(!token){
        //Unauthorized
        return res.status(401).json({
            ok : false,
            mssg : 'Token left'
        })
    }

    try{

        const { uid } = jwt.verify(token , process.env.SECRET_JWT_TOKEN_CLIENT);

        const supplier = await Client.findById(uid); 
        //Si el supplier es eliminado fisicamente de la db pero aun mantiene el token
        //Se debe rechazar

        if(!supplier){
            return res.status(401).json({
                ok : false,
                mssg : 'Supplier does not exist'
            })
        }
        //Si el usuario está activo
        if (!supplier.active ){
            return res.status(401).json({
                ok : false,
                mssg : 'Invalid token , supplier is disabled'
            })
        }

        //Envio todo el supplier
        req.supplier = supplier;

        next();//Seguir con el siguiente middleware

    }catch(err){
        console.log(err);
        res.status(401).json({
            ok : false,
            mssg : 'Invalid token'
        })
    }
}

const validateTokenMultiple = async ( req , res , next ) => {
    const token = req.header('Bearer');

    const { collection } = req.params;

    if(!token){
        //Unauthorized
        return res.status(401).json({
            ok : false,
            mssg : 'Token left'
        })
    }

    try{

        let secret;
        let MODEL;
        switch(collection) {
            case 'supplier' : 
                secret = process.env.SECRET_JWT_TOKEN_SUPPLIER;
                MODEL = Supplier;
                break;
            case 'client' : 
                secret = process.env.SECRET_JWT_TOKEN_CLIENT;
                MODEL = Client;
                break;
        }

        const { uid } = jwt.verify(token , secret);

        const entity = await MODEL.findById(uid); 
        //Si el supplier es eliminado fisicamente de la db pero aun mantiene el token
        //Se debe rechazar

        if(!entity){
            return res.status(401).json({
                ok : false,
                mssg : `User does not exist`
            })
        }
        //Si el usuario está activo
        if (!entity.active ){
            return res.status(401).json({
                ok : false,
                mssg : `Invalid token , ${collection} is disabled`
            })
        }

        //Envio todo el supplier
        req.entity = entity;

        next();//Seguir con el siguiente middleware

    }catch(err){
        console.log(err);
        res.status(401).json({
            ok : false,
            mssg : 'Invalid token'
        })
    }
} 

const validateTokenForgot = async ( req , res = response , next) => {

    const { token , id } = req.params;
    if(!token){
        //Unauthorized
        return res.status(401).json({
            ok : false,
            mssg : 'Token left'
        })
    }

    try{

        const supplier = await Supplier.findById(id);

        if(!supplier){
            return res.status(400).json({
                ok : false,
                mssg : 'Supplier doesnt exist'
            })
        }

        const signature = process.env.SECRET_JWT_TOKEN_SUPPLIER + supplier.password;
        const val = jwt.verify(token , signature );
        req.supplier = supplier;

        next();

    }catch(err){
        console.log(err);
        res.status(401).json({
            ok : false,
            mssg : 'Invalid token'
        })
    }   
}
 
module.exports = {
    validateToken,
    validateTokenClient,
    validateTokenMultiple,
    validateTokenForgot
};