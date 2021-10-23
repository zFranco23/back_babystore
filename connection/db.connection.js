const mongoose = require('mongoose');


const connectDB = async () => {
    try{
        
        await mongoose.connect( process.env.MONGO_ATLAS , {
            useNewUrlParser : true,
            useUnifiedTopology : true,
        })

        console.log('Mongo connected');

    }catch(err){
        console.log(err);
        console.log('Error al conectarse en la base de datos');
    }
}

module.exports = connectDB;