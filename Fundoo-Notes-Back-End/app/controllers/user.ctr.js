const userService = require('../services/user.svc.js')
const bcrypt = require('bcrypt');
const Joi = require('joi');
const logger = require('../../logger.js')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");
const _ = require('lodash')

const inputPattern = Joi.object({
    firstName: Joi.string().regex(/^[a-zA-Z]+$/).min(2).required().messages({
        'string.pattern.base': 'name should contain only characters.',
        'string.min': 'first name must have minimum 2 characters.',
        'string.empty': 'first name can not be empty'
    }),
    lastName: Joi.string().regex(/^[a-zA-Z]+$/).required().messages({
        'string.pattern.base': 'name should contain only characters.',
        'string.empty': 'last name can not be empty'
    }),
    emailId: Joi.string().regex(/^([0-9A-Za-z])+([-+._][0-9A-Za-z]+)*@([0-9A-Za-z])+[.]([a-zA-Z])+([.][A-Za-z]+)*$/).required().messages({
        'string.pattern.base': 'Email Id should be in this pattern ex: abc@gmail.com',
        'string.empty': 'Email Id can not be empty'
    }),
    password: Joi.string().regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*\W){1}.*$/).min(8).required().messages({
        'string.pattern.base': 'password should contain atleast one uppercase, one digit, one special character',
        'string.min': 'password length should be minimum 8',
        'string.empty': 'password can not be empty'
    })
})

class UserController {
    /**
     * @description new user registration
     * 
     */
    register = (req, res) => {
        const userRegistrationData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            emailId: req.body.emailId,
            password: req.body.password
        }

        const validationResult = inputPattern.validate(userRegistrationData)

        if (validationResult.error) {
            const response = { success: false, message: validationResult.error.message };
            return res.status(400).send({
                response
            });
        }

        userService.register(userRegistrationData, (error, data) => {
            if (error) {
                if (error.name === 'MongoError' && error.code === 11000) {
                    logger.error("User with this email Id is alreday exists")
                    const response = { success: false, message: "User with this email Id is alreday exists" };
                    return res.status(409).send({
                        response
                    })
                }

                logger.error("Some error occured while registering")
                const response = { success: false, message: "Some error occured while registering" };
                return res.status(500).send({
                    success: response.success = false,
                    message: response.message = "Some error occured while registering"
                })
            }

            logger.info("Registration is done successfully !")
            const response = { success: true, message: "Registration is done successfully !", data: data };
            res.send({
                response
            })
        })
    }

    /**
     * @description User login
     * @method login invoke service class method
     */
    login = (req, res) => {
        const userLoginData = {
            emailId: req.body.emailId,
            password: req.body.password
        }

        userService.login(userLoginData, (error, data) => {
            if (error) {
                logger.error("Some error occured while logging in")
                const response = { success: false, message: "Some error occured while logging in" };
                return res.status(500).send({
                    response
                })
            }
            if (!data) {
                const response = { success: false, message: "Authorization failed" };
                return res.status(401).send({
                    response
                })
            }
            bcrypt.compare(userLoginData.password, data.password, (eror, result) => {
                if (result) {
                    const token = jwt.sign({
                        emailId: data.emailId,
                        userId: data._id
                    },
                        process.env.JWT_LOGIN_KEY,
                        {
                            expiresIn: "20m"
                        })
                    const response = { success: true, message: "Login Successfull !", token: token, data: data };
                    logger.info("Login Successfull !")
                    return res.send({
                        response
                    })
                }
                const response = { success: false, message: "Authorization failed" };
                return res.status(401).send({
                    response
                })
            });
        })
    }

    forgotPassword = (req, res) => {
        const emailId = req.body.emailId

        userService.forgotPassword(emailId, (error, user) => {
            if (error) {
                logger.error("Some error occured")
                const response = { success: false, message: "Some error occured" };
                return res.status(500).send({
                    response
                })
            }

            if (!user) {
                const response = { success: false, message: "Authorization failed" };
                return res.status(401).send({
                    response
                })
            }

            const token = jwt.sign({
                emailId: user.emailId,
                userId: user._id
            },
                process.env.RESET_PASSWORD_KEY,
                {
                    expiresIn: "2h"
                })

            let mailTransporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'shilpakundapur7@gmail.com',
                    pass: 'sirideepu7'
                }
            });

            let mailDetails = {
                from: 'shilpakundapur7@gmail.com',
                to: 'shilpa07udupi@gmail.com',
                subject: 'Reset Password',
                html: `<p>Please click on below link to reset password</p>
                <a>${process.env.URL}/resetpassword/${token}</a>`
            }

            return user.updateOne({ resetLink: token }, (error, success) => {
                if (error) {
                    const response = { success: false, message: "Reset password link error" };
                    return res.status(400).send({
                        response
                    })
                }

                mailTransporter.sendMail(mailDetails, (error, data) => {
                    if (error) {
                        const response = { success: false, message: "Some error occurred while sending email" };
                        return res.status(500).send({
                            response
                        })
                    }

                    const response = { success: true, message: "Email has been sent !" };
                    logger.info("Email has been sent !")
                    res.send({
                        response
                    })
                })
            })
        })
    }

    resetPassword = (req, res) => {
        const resetPasswordData = {
            resetLink: req.body.resetLink,
            newPassword: req.body.newPassword
        }
        
        if(resetPasswordData.resetLink){
            jwt.verify(resetPasswordData.resetLink, process.env.RESET_PASSWORD_KEY, (error, decodeData) => {
                if(error){
                    const response = { success: false, message: "Incorrect token or token is expired" };
                    return res.status(401).send({
                        response
                    })
                }
                userService.findResetLink(resetPasswordData.resetLink, (error, user) => {
                    if(error){
                        const response = { success: false, message: "Some error occurred" }; 
                        return res.status(400).send({
                            response
                        })
                    }
                    const object = {
                        password: resetPasswordData.newPassword
                    }
                   // user = _.extend(user, object)
                   user.password = resetPasswordData.newPassword
                    user.save((error, data) => {
                        if(error){
                            const response = { success: false, message: "Reset password error"}
                            return res.status(400).send({
                                response
                            })
                        }
                        const response = { success: true, message: "Password has been changed"}
                            return res.send({
                                response
                            })
                        }) 
                    })
                })
            }
        else{
        const response = { success: false, message: "Authentication error !" };
        logger.info("Authentication error !")
        return res.send({
            response
        })
    }
    }
}
module.exports = new UserController();