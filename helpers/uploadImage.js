//Configuracion de cloudinary
const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );



const uploadImage = async ( tempPath, id  ) => {
    try{

        const { secure_url } = await cloudinary.uploader.upload( tempPath ,{
            public_id : `babystore/perfil_images/${id}`
        });

        return secure_url;

    }catch(err){
        console.log(err);
    }
}
const deleteImage = async ( id ) => {
    try{
        const flag = await cloudinary.uploader.destroy(`babystore/perfil_images/${id}`);
        console.log(flag);
    }catch(err){
        console.log(err);
    }
}

module.exports = {
    uploadImage,
    deleteImage
};