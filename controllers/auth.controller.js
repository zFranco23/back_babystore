const { response } = require("express");
const bcrypt = require('bcryptjs')

const Supplier = require('../models/supplier.model');
const Client = require('../models/client.model');

const generateJWT = require("../helpers/generateJWT");


const authLogin = async ( req, res = response) => {
    try{

        const { email , password } = req.body;
        const { collection } = req.params;

        let model;
        switch(collection){
            case 'supplier':
                model = await Supplier.findOne({ email });
                break;
            case 'client' :
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

        const token = await generateJWT(model._id);

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