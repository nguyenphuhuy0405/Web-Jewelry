const nodemailer = require('nodemailer')
require('dotenv').config()

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            secure: false,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        })

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            html: text
        })

        console.log('email sent sucessfully')
    } catch (error) {
        console.log(error, 'email not sent')
    }
}

module.exports = sendEmail
