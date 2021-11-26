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


const sendEmail = async (url , email) => {
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

module.exports = { 
    sendEmail 
}