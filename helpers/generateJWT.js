const jwt = require('jsonwebtoken');


const generateJWT = ( uid='' ) => {

    return new Promise ( ( resolve , reject ) => {
        const payload = { uid };

        jwt.sign(payload , process.env.SECRET_JWT_TOKEN , {
            expiresIn : '4h'
        }, (err , token ) => {
            if(err) return reject('Error generating JWT')

            resolve(token)
        })
    }) 
}

module.exports = generateJWT;