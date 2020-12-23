const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer")
const bcrypt = require('bcrypt');

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

    verifyToken = (req, res, next) => {
        jwt.verify(req.headers.token, process.env.RESET_PASSWORD_KEY, (error, decodeData) => {
            if (error) {
                const response = { success: false, message: "Incorrect token or token is expired" }
                return res.status(401).send(response)
            }

            req.decodeData = decodeData
            next()
        })
    }

    // decoding token for user verfification using promise
    decodeToken = (token) => {
        return jwt.verify(token, process.env.RESET_PASSWORD_KEY)
    }

    // Validating user
    verifyUser = (token) => {
        return jwt.verify(token, process.env.RESET_PASSWORD_KEY, (error, decodeData) => {
            if (error)
                return null
            return decodeData
        })
    }

    /**
     * @description Encrypting password
     */
    encryptData = (password, callBack) => {
        var saltRounds = 10;
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err)
                return callBack(err, null)
            return callBack(null, hash)
        });
    }
    setCookie = (req, res, next) => {
        console.log("data: " + req.body.emailId)
        this.encryptData(req.body.emailId, (error, decodedEmail) => {
            console.log("h1")
            if (error)
                return next(error)
            else {
                console.log("h2")
                res.cookie("emailId", decodedEmail)
            }
        })
        this.encryptData(req.body.password, (error, decodedPassword) => {
            if (error)
                return next(error)
            else {
                console.log("h3")
                res.cookie("Password", decodedPassword)
                return next()
            }
        })

        /* res.cookie("EmailId", userLoginData.emailId)
        res.cookie("Password", userLoginData.password) */
    }
}
module.exports = new Util();