const userService = require('../services/user.svc.js')
const Joi = require('joi');
const logger = require('../../logger.js')

const inputPattern = Joi.object({
    name: Joi.string().regex(/^[a-zA-Z ]+$/).min(3).required().messages({
        'string.pattern.base': 'name should contain only characters.',
        'string.min': 'name must have minimum 2 characters.',
        'string.empty': 'name can not be empty'
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
            name: req.body.name,
            emailId: req.body.emailId,
            password: req.body.password
        }

        const userRegistrationResponse = {

        }

        const validationResult = inputPattern.validate(userRegistrationData)

        if (validationResult.error) {
            return res.status(400).send({
                success: userRegistrationResponse.success = false,
                message: userRegistrationResponse.message = validationResult.error.message
            });
        }

        userService.register(userRegistrationData, (error, data) => {
            if (error) {
                if (error.name === 'MongoError' && error.code === 11000) {
                    logger.error("User with this email Id is alreday exists")
                    return res.status(409).send({
                        success: userRegistrationResponse.success = false,
                        message: userRegistrationResponse.message = "User with this email Id is alreday exists"
                    })
                }
                logger.error("Some error occured while registering")
                return res.status(500).send({
                    success: userRegistrationResponse.success = false,
                    message: userRegistrationResponse.message = "Some error occured while registering"
                })
            }

            logger.info("Registration is done successfully !")
            res.send({
                success: userRegistrationResponse.success = true,
                message: userRegistrationResponse.message = "Registration is done successfully !",
                data: userRegistrationResponse.data = data
            })
        })
    }
}
module.exports = new UserController();