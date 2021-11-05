const jwt = require('jsonwebtoken');


const generateJWT = ( uid='' , signValidation) => {

    return new Promise ( ( resolve , reject ) => {
        const payload = { uid };

        jwt.sign(payload , signValidation , {
            expiresIn : '4h'
        }, (err , token ) => {
            if(err) return reject('Error generating JWT')

            resolve(token)
        })
    }) 
}


module.exports = { 
    generateJWT 
};