

const checkSamePassword = ( password , req) => {
    //Si no matchea
    if(password !== req.body.password){

        throw new Error('Password doesnt match');
    } 

    return true;
}

module.exports = checkSamePassword;