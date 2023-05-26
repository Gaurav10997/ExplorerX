const nodemailer = require('nodemailer')

const sendEmail = options =>{
    //1 create a transporter 
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'avdhika@example.com',
            pass: 'password'
            }

            // active in gmail "less secure appnode "

    })
}