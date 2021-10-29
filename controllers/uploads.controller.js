const response = require('express');

const Supplier = require('../models/supplier.model');

const { uploadImage , deleteImage } = require('../helpers/uploadImage');

const updateProfileImage = async ( req , res=response) => {
    try{
        // const { collection  } = req.params;
        const id = req.supplier._id;

        const supplier = await Supplier.findById(id);

        // const avatar = supplier.avatar;

        //ya tiene asociada una imagen , eliminar la imagen
        // if(avatar!==''){
        //     //su public id está definido en las options cuando subes
        //     deleteImage(id);
        // }

        //Extraer un path para mandar a cloudinary
        const { tempFilePath } = req.files.file;
        
        const url = await uploadImage(tempFilePath , id);

        supplier.avatar = url;

        await supplier.save();

        res.json({
            ok: true,
            supplier
        })

    }catch(err){
        console.log(err);
        res.status(500).json({
            ok:false,
            mssg : err.message
        })
    }
}

module.exports = {
    updateProfileImage
}