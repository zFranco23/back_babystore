const { response } = require("express");
const bcrypt = require('bcryptjs');

const Client = require('../models/client.model');

const getClients = async ( req , res = response) => {
    try{

        const { skip=0 , limit=5 } = req.query;
        const query = { active : true } ;

        const [ total , clients ] = await Promise.all([
            Client.countDocuments(query),
            Client.find( query )
                .skip(Number(skip)) 
                .limit(Number(limit))
        ])

        res.json({
            ok : true,
            total,
            clients
        })

    }catch(err){
        console.log(err);
        res.json({
            ok : false,
            message : err.message
        })
    }
}
const addClient = async ( req , res = response) => {
    try{

        const { name , email , password } = req.body;
        
        const client = new Client({
            name,
            email,
            password
        })

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password,salt);

        client.password = hash;

        await client.save();

        res.json({
            ok : true,
            created : client
        })

    }catch(err){
        console.log(err);
        res.json({
            ok : false,
            message : err.message
        })
    }
}


module.exports = {
    getClients,
    addClient,
}