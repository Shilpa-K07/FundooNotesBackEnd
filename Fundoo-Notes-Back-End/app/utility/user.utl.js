const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer")

class Util {
    generateToken = (user) => {
        const token = jwt.sign({
            emailId: user.emailId,
            userId: user._id
        },
            process.env.RESET_PASSWORD_KEY,
            {
                expiresIn: "20m"
            })
        return token
    }

    nodeEmailSender = (token, callBack) => {
        let mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.AUTH_USER,
                pass: process.env.AUTH_PASSWORD
            }
        });

        let mailDetails = {
            from: process.env.AUTH_USER,
            to: 'shilpa07udupi@gmail.com',
            subject: 'Reset Password',
            html: `<p>Please click on below link to reset password</p>
        <a>${process.env.URL}/resetpassword/${token}</a>`
        }

        mailTransporter.sendMail(mailDetails, (error, data) => {
            if (error) 
               return callBack(error, null)
            return callBack(null, data)
        })
    }

    verifyToken = (resetLink, callBack) => {
        jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY, (error, decodeData) => {
            if (error) 
                return callBack(error, null)
            callBack(null, decodeData)
        })
    }
}
module.exports = new Util();