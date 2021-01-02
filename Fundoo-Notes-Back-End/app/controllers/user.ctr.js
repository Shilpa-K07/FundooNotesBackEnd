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

const emailPattern = Joi.string().trim()
    .regex(/^([0-9A-Za-z])+([-+._][0-9A-Za-z]+)*@([0-9A-Za-z])+[.]([a-zA-Z])+([.][A-Za-z]+)*$/)
    .required().messages({
        'string.pattern.base': 'Email Id should be in this pattern ex: abc@gmail.com',
        'string.empty': 'Email Id can not be empty'
    })

const passwordPattern = Joi.string().trim()
    .regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*\W){1}.*$/).min(8)
    .required().messages({
        'string.pattern.base': 'password should contain atleast one uppercase, one digit, one special character',
        'string.min': 'password length should be minimum 8',
        'string.empty': 'password can not be empty'
    })

const inputPattern = Joi.object({
    firstName: Joi.string().trim().regex(/^[a-zA-Z]+$/).min(2).required().messages({
        'string.pattern.base': 'name should contain only characters.',
        'string.min': 'first name must have minimum 2 characters.',
        'string.empty': 'first name can not be empty'
    }),
    lastName: Joi.string().trim().regex(/^[a-zA-Z]+$/).required().messages({
        'string.pattern.base': 'name should contain only characters.',
        'string.empty': 'last name can not be empty'
    }),
    emailId: emailPattern,
    password: passwordPattern
})

const loginDetailsPattern = Joi.object({
    emailId: emailPattern,
    password: passwordPattern
})

class UserController {
    /**
     * @description Registering new users
     * @method register is a service class method
     * @method validate validates inputs using Joi
     */
    register = (req, res) => {
        try {
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
        catch (error) {console.log("error: "+error)
            logger.error("Some error occurred !")
            const response = { success: false, message: "Some error occurred !" };
            res.status(500).send(response)
        }
    }

    /**
     * @description User login API
     * @method login is service class method
     */
    login = (req, res) => {
        try {
            const userLoginData = {
                emailId: req.body.emailId,
                password: req.body.password
            }

            const validationResult = loginDetailsPattern.validate(userLoginData)

            if (validationResult.error) {
                const response = { success: false, message: validationResult.error.message };
                return res.status(400).send(response);
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
                    const response = { success: true, message: "Login Successfull !", token: data.token };
                    logger.info("Login Successfull !")
                    req.session.isAuth = true
                    req.session.token = data.token
                    /* req.session.fundoNotes = {
                        token: data.token
                    } */
                    return res.status(200).send(response)
                }
            })
        }
        catch (error) {
            logger.error("Some error occurred !")
            const response = { success: false, message: "Some error occurred !" };
            res.status(500).send(response)
        }
    }


    /**
     * @description Sends resetpassword links to user's emailId
     * @param req holds user email id
     * @method forgotPassword is service class method
     */
    forgotPassword = (req, res) => {
        try {
            const userData = { emailId: req.body.emailId }

            const validationResult = emailPattern.validate(userData.emailId)

            if (validationResult.error) {
                const response = { success: false, message: validationResult.error.message };
                return res.status(400).send(response);
            }

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
        catch (error) {
            logger.error("Some error occurred !")
            const response = { success: false, message: "Some error occurred !" };
            res.status(500).send(response)
        }
    }

    /**
     * @description New password will get updated after verifying token successfully
     * @param req holds emailId and newPassword
     * @param res sends the response 
     */
    resetPassword = (req, res)/* , decodeData) */ => {
        try {
            const resetPasswordData = {
                emailId: req.decodeData.emailId,
                newPassword: req.body.newPassword
            }

            const validationResult = passwordPattern.validate(resetPasswordData.newPassword)

            if (validationResult.error) {
                const response = { success: false, message: validationResult.error.message };
                return res.status(400).send(response);
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
        catch (error) {
            logger.error("Some error occurred !")
            const response = { success: false, message: "Some error occurred !" };
            res.status(500).send(response)
        }
    }

    /**
     * @description Get user profile
     * @method userService.findAll is service class method for finding users based on emailId
     */
    findAll = (req, res) => {
        const userData = {
            emailId : req.body.emailId
        }
        userService.findAll(userData, (error, data) => {
            if (error) {
                logger.error(error.message)
                const response = { success: false, message: error.message };
                return res.status(500).send(response)
            }
            else if (!data) {
                logger.error("Authorization failed")
                const response = { success: false, message: "Authorization failed" };
                return res.status(404).send(response)
            }
            else if (data.length == 0) {
                logger.error("No users found")
                const response = { success: false, message: "No users found" };
                return res.status(404).send(response)
            }
            else {
                const response = { success: true, message: "Successfully retrieved user profiles !", data: data };
                logger.info("Successfully retrieved user profiles !")
                res.status(200).send(response)
            }
        })
    }

    /**
     * @description Sends email verification links to user's emailId
     * @param req holds emailId of user
     */
    emailVerification = (req, res) => {
        try {
            const userData = { emailId: req.body.emailId }

            const validationResult = emailPattern.validate(userData.emailId)

            if (validationResult.error) {
                const response = { success: false, message: validationResult.error.message };
                return res.status(400).send(response);
            }

            publisher.publish(userData, (error, data) => {
                if (error) {
                    logger.error("Some error occurred while addig to queue")
                    const response = { success: false, message: "Some error occurred while adding to queue" };
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
        catch (error) {
            logger.error("Some error occurred !")
            const response = { success: false, message: "Some error occurred !" };
            res.status(500).send(response)
        }
    }

    /**
     * @description To activate user account 
     * @param req holds user emailId
     */
    activateAccount = (req, res) => {
        try {
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
        catch (error) {
            logger.error("Some error occurred !")
            const response = { success: false, message: "Some error occurred !" };
            res.status(500).send(response)
        }
    }
}
module.exports = new UserController();