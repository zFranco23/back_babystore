const jwt = require('jsonwebtoken');

const Supplier = require('../models/supplier.model'); 


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

module.exports = validateToken;