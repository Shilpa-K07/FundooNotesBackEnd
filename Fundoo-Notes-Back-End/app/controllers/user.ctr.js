/**
 * @description Controller class recieves request from routes
 * @method registration is for new user to register
 * @method login is for user login
 * @method forgotPassword sends reset password link to registered user
 * @method resetPassword updates password
 */
const userService = require('../services/user.svc.js')
const Joi = require('joi');
const logger = require('../logger/logger')
const publisher = require('../utility/publisher')

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
}).unknown(true)

class UserController {
    //new user registration
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
            return res.status(400).send(response);
        }

        userService.register(userRegistrationData, (error, data) => {
            if (error) {
                if (error.name === 'MongoError' && error.code === 11000) {
                    logger.error("User with this email Id is alreday exists")
                    const response = { success: false, message: "User with this email Id is alreday exists" };
                    return res.status(409).send(response)
                }

                logger.error("Some error occured while registering")
                const response = { success: false, message: "Some error occured while registering" };
                return res.status(500).send(response)
            }

            logger.info("Registration is done successfully !")
            const response = { success: true, message: "Registration is done successfully !", data: data };
            res.send(response)
        })
    }

    // User login
    login = (req, res) => {
       /*  console.log("session: "+JSON.stringify(req.session))
        console.log("session: "+req.session.id) */
        const userLoginData = {
            emailId: req.body.emailId,
            password: req.body.password
        }

        userService.login(userLoginData, (error, data) => {
            if (error) {
                logger.error(error.message)
                const response = { success: false, message: error.message };
                return res.status(500).send(response)
            }
            if (!data) {
                const response = { success: false, message: "Authorization failed" };
                return res.status(401).send(response)
            }
            else {
                const response = { success: true, message: "Login Successfull !", token: data.token,data: data };
                logger.info("Login Successfull !")
                req.session.isAuth = true
                req.session.fundoNotes = {
                    token: data.token
                }
                return res.status(200).send(response)
            }
        })
    }


    // Sends resetpassword links to user's emailId
    forgotPassword = (req, res) => {
        const userData = { emailId: req.body.emailId }

        userService.forgotPassword(userData, (error, user) => {
            if (error) {
                logger.error(error.message)
                const response = { success: false, message: error.message };
                return res.status(500).send(response)
            }

            else if (!user) {
                logger.error("Authorization failed")
                const response = { success: false, message: "Authorization failed" };
                return res.status(401).send(response)
            }
            else {
                const response = { success: true, message: "Email has been sent !" };
                logger.info("Email has been sent !")
                res.status(200).send(response)
            }
        })
    }

    // New password will get updated after verifying token successfully
    resetPassword = (req, res)/* , decodeData) */ => {
        const resetPasswordData = {
            emailId: req.decodeData.emailId,
            newPassword: req.body.newPassword
        }
        userService.resetPassword(resetPasswordData, (error, data) => {
            if (error) {
                logger.error(error.message)
                const response = { success: false, message: error.message };
                return res.status(500).send(response)
            }

            else if (!data) {
                logger.error("Authorization failed")
                const response = { success: false, message: "Authorization failed" };
                return res.status(401).send(response)
            }
            else {
                const response = { success: true, message: "Password has been changed !" };
                logger.info("Password has benn changed !")
                res.status(200).send(response)
            }
        })
    }

    // Get user profile
    findAll = (req, res) => {
        userService.findAll((error, data) => {
            if (error) {
                logger.error(error.message)
                const response = { success: false, message: error.message };
                return res.status(500).send(response)
            }
            else if (!data) {
                logger.error("No users found")
                const response = { success: false, message: "Authorization failed" };
                return res.status(404).send(response)
            }
            else {
                const response = { success: true, message: "Successfully retrieved user profiles !", data: data };
                logger.info("Successfully retrieved user profiles !")
                res.status(200).send(response)
            }
        })
    }

     // Sends email verification links to user's emailId
     emailVerification = (req, res) => {
        const userData = { emailId: req.body.emailId }
        
        publisher.publish(userData, (error, data) => {
            if(error){
                logger.error("Some error occurred while addig to queue")
                const response = { success: false, message: "Some error occurred while addig to queue" };
                return res.status(500).send(response)
            }
        })

        userService.emailVerification(userData, (error, user) => {
            if (error) {
                logger.error(error.message)
                const response = { success: false, message: error.message };
                return res.status(500).send(response)
            }

            else if (!user) {
                logger.error("This email is not registered")
                const response = { success: false, message: "This email is not registered" };
                return res.status(401).send(response)
            }
            else {
                const response = { success: true, message: "Verification email has been sent !. Please verify your account" };
                logger.info("Verification email has been sent !. Please verify your account")
                res.status(200).send(response)
            }
        })
    }

    activateAccount = (req, res) => {
        const userData = {
            emailId: req.decodeData.emailId
        }
        userService.activateAccount(userData, (error, data) => {
            if (error) {
                logger.error(error.message)
                const response = { success: false, message: error.message };
                return res.status(500).send(response)
            }

            else if (!data) {
                logger.error("User not found with this email Id")
                const response = { success: false, message: "User not found with this email Id" };
                return res.status(401).send(response)
            }
            else {
                const response = { success: true, message: "Account has been activated !" };
                logger.info("Account has been activated !")
                res.status(200).send(response)
            }
        })
    }
}
module.exports = new UserController();