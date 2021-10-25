const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

//Routes
const authRoutes = require('../routes/auth.routes');
const supplierRoutes = require('../routes/supplier.routes');
const productRoutes = require('../routes/product.routes');
const clientRoutes = require('../routes/client.routes');

//Connection
const connectDB = require('../connection/db.connection.js');

class Server { 

    //Constructor 

    constructor(){
        this.app = express();
        this.PORT = process.env.PORT;
        this.paths = {
            auth : '/api/auth',
            supplier : '/api/supplier',
            product : '/api/product',
            client : '/api/client'
        }

        //Conection
        this.dbconnection();

        //Middlewares
        this.middlewares();

        //routes
        this.routes();
    }

    
    dbconnection(){
        connectDB();
    }

    middlewares(){
        this.app.use(cors());
        this.app.use( express.json());
        this.app.use( morgan('dev') );
    }

    routes(){
        this.app.use(this.paths.auth , authRoutes );
        this.app.use(this.paths.supplier , supplierRoutes );
        this.app.use(this.paths.product , productRoutes );
        this.app.use(this.paths.client , clientRoutes );
    }

    listen(){
        this.app.listen( this.PORT , () => {
            console.log(`Backend in ${this.PORT}`);
        })
    }
}

module.exports = Server;