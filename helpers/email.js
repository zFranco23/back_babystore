const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.USER_EMAIL, // generated ethereal user
      pass: process.env.PASS_EMAIL, // generated ethereal password
    },
});


const sendEmail = async (url , email, message, subject) => {
    try{

        let info = await transporter.sendMail({
            from: '"Info Store" <info.store.contact@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Reset your password", // Subject line
            html: 
            `
                <div>
                    <h3>Here you will find the link to reset your password.</p>
                    <p>It is an one time link, so be careful setting your new password.</p>

                    <p>Please click on the following link, or paste this into your browser to complete the process :</p>
                    <p>${url}</p>
                </div>
            `, // html body
        });

        return { sent : true , info}

    }catch(err){
        console.log(err);
        return { sent : false }
    }
}

const sendNormalEmail = async (name, email , message, subject) => {
    try{

        let info = await transporter.sendMail({
            from: '"Contacto Factor 1 - Consultoria empresarial" <info.contact@gmail.com>', // sender address
            to: 'franco.hermenegildo@unmsm.edu.pe', // list of receivers
            subject: subject ? subject : 'Factor 1 consultoria empresarial', // Subject line
            html: 
            `
                <div>
                    <h1>Nuevo formulario de contacto.</h2>
                    <h4>Un nuevo interesado ha rellenado el contacto con los siguientes datos : </h2>
                    <ul>
                        <li>
                            Asunto : ${subject ? subject : 'No especificado'}
                        </li>
                        <li>
                            Nombre : ${name}
                        </li>
                        <li>
                            Correo : ${email}
                        </li>
                        <li>
                            Mensaje : ${message}
                        </li>
                    </ul>
                    <h4>Fecha de registro: ${new Date().toLocaleDateString()}</h4>
                </div>
            `, // html body
        });

        return { sent : true , info}

    }catch(err){
        console.log(err);
        return { sent : false }
    }
}

module.exports = { 
    sendEmail ,
    sendNormalEmail
}