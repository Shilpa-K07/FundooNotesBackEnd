const userService = require('../services/user.svc.js')
const bcrypt = require('bcrypt');
const Joi = require('joi');
const logger = require('../../logger.js')

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
        const response = {
        }

        const validationResult = inputPattern.validate(userRegistrationData)

        if (validationResult.error) {
            return res.status(400).send({
                success: response.success = false,
                message: response.message = validationResult.error.message
            });
        }

        userService.register(userRegistrationData, (error, data) => {
            if (error) {
                if (error.name === 'MongoError' && error.code === 11000) {
                    logger.error("User with this email Id is alreday exists")
                    return res.status(409).send({
                        success: response.success = false,
                        message: response.message = "User with this email Id is alreday exists"
                    })
                }
                logger.error("Some error occured while registering")
                console.log("error: "+error)
                return res.status(500).send({
                    success: response.success = false,
                    message: response.message = "Some error occured while registering"
                })
            }

            logger.info("Registration is done successfully !")
            res.send({
                success: response.success = true,
                message: response.message = "Registration is done successfully !",
                data: response.data = data
            })
        })
    }

    /**
     * @description User login
     */
    login = (req, res) => {
        const userLoginData = {
            emailId: req.body.emailId,
            password: req.body.password
        }
        const response = {
        }

        userService.login(userLoginData, (error, data) => {
            if (error) {
                logger.error("Some error occured while logging in")
                
                return res.status(500).send({
                    success: response.success = false,
                    message: response.message = "Some error occured while logging in"
                })
            }
            if (!data) {
                return res.status(401).send({
                    success: response.success = false,
                    message: response.message = "Authorization failed"
                })
            }
            bcrypt.compare(userLoginData.password, data.password, (eror, result) => {
                if (result) {
                    logger.info("Login Successfull !")
                    res.send({
                        success: response.success = true,
                        message: response.message = "Login Successfull !",
                        data: response.data = data
                    })
                }
                return res.status(401).send({
                    success: response.success = false,
                    message: response.message = "Authorization failed"
                })
            });
        })
    }
}
module.exports = new UserController();