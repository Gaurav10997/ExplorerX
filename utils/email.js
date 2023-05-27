const nodemailer = require('nodemailer')

const sendEmail = async(options) => {
    //1 create a transporter 
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "df91f06bdba12a",
          pass: "6a3d7cb8061f19"
        }
      });

    // 2 ) Define The Email Address 
    const mailOptions = {
        from: '"Gaurav Mandal" <gaurav@natours.io>',
        to: options.email,
        subject: options.subject,
        text: options.text,
        // html: options.html
    }

    await transport.sendMail(mailOptions)
}
module.exports = sendEmail;