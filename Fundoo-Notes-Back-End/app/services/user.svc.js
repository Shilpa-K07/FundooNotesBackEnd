/**
 * @description Controller class recieves request from routes
 * @method registration is for new user to register
 * @method login is for user login
 * @method forgotPassword sends reset password link to registered user
 * @method resetPassword updates password
 */

const userModel = require('../models/user.mdl').userModel
const util = require('../utility/util')
const bcrypt = require('bcrypt')
const consumer = require('../utility/subscriber')
const redis = require('../utility/redisCache')
const logger = require('../logger/logger')

class UserService {
    /**
    * @description New user registration
    * @method  userModel.create calls model class method for saving user
    */
    register = (userRegistrationData, callBack) => {
        userModel.create(userRegistrationData, (error, data) => {
            if (error)
                return callBack(error, null)
            return callBack(null, data)
        })
    }

    /**
     * @description User login
     * @method clent.get is redis implementation to check for emailId
     * @method findOne is model class method
     * @method client.setex is used to set the key in redis cache
     */
    login = (userLoginData, callBack) => {
        const userName = userLoginData.emailId
        const key = 'UserDetails: '

        redis.get(`${key} ${userName}`, (error, data) => {
            if (error) {
                logger.error('Some error occuured while retrieving data from redis')
                return callBack(new Error("Some error occuured while retrieving data from redis"), null)
            }
            else if (data) {
                data = JSON.parse(data)
                const token = util.generateToken(data)
                data.token = token
                return callBack(null, data)
            }
            else {
                userModel.findOne(userLoginData, (error, data) => {
                    if (error) {
                        logger.error('Some error occured while logging in')
                        return callBack(new Error("Some error occured while logging in"), null)
                    }
                    else if (!data) {
                        logger.error('Authorization failed')
                        return callBack(new Error("Authorization failed"), null)
                    }
                    else {
                        bcrypt.compare(userLoginData.password, data.password, (error, result) => {
                            if (result) {
                                if (data.isActivated) {
                                    logger.info('Authorization success')
                                    const token = util.generateToken(data)
                                    data.token = token
                                    redis.set(userName, key, data)
                                    return callBack(null, data)
                                }
                                else {
                                    logger.info('Please verify email before login')
                                    return callBack(new Error("Please verify email before login"))
                                }
                            }
                            logger.error('Authorization failed')
                            return callBack(new Error("Authorization failed"), null)
                        })
                    }
                })
            }
        })
    }

    /**
     * @description Forgot password 
     * @method util.nodeEmailSender is util class method to send reset password link to user
     */
    forgotPassword = (userData, callBack) => {
        userModel.findOne(userData, (error, data) => {
            if (error) {
                logger.error('Some error occurred')
                return callBack(new Error("Some error occurred"), null)
            }
            else if (!data) {
                logger.error('User not found with this email Id')
                return callBack(new Error("User not found with this email Id"), null)
            }
            else {
                const token = util.generateToken(data);
                userData.token = token
                util.nodeEmailSender(userData, (error, data) => {
                    if (error) {
                        logger.error('Some error occurred while sending email')
                        return callBack(new Error("Some error occurred while sending email"), null)
                    }
                    return callBack(null, data)
                })
            }
        })
    }

    /**
     * @description Reset password
     * @method util.encryptData is used to hash password
     */
    resetPassword = (resetPasswordData, callBack) => {
        util.encryptData(resetPasswordData.newPassword, (error, encryptedData) => {
            if (error) {
                logger.error('Some error occurred while encrypting password')
                return callBack(new Error("Some error occurred while encrypting password"), null)
            }
            else {
                resetPasswordData.newPassword = encryptedData
                userModel.findOneAndUpdate(resetPasswordData, (error, data) => {
                    if (error) {
                        logger.error('Some error occurred while resetting password')
                        return callBack(new Error(("Some error occurred while resetting password"), null))
                    }
                    return callBack(null, data)
                })
            }
        })
    }

    // Retrieve user profiles 
    findAll = (userData, callBack) => {
        userModel.findAll(userData, (error, data) => {
            if (error)
                return callBack(error, null)
            var userData = []
            data.forEach((user) => {
                const userMap = {
                    id: user._id,
                    emailId: user.emailId
                }
               userData.push(userMap)
            })
            return callBack(null, userData)
        })
    }

    /**
    * @description reset password
    * @method util.encryptData encrypts new password
    * @method userModel.findOneAndUpdate calls model class method to update password
    */
    resetPassword = (resetPasswordData, callBack) => {
        util.encryptData(resetPasswordData.newPassword, (error, encryptedData) => {
            if (error)
                return callBack(new Error("Some error occurred while encrypting password"), null)
            else {
                resetPasswordData.newPassword = encryptedData
                userModel.findOneAndUpdate(resetPasswordData, (error, data) => {
                    if (error)
                        return callBack(new Error(("Some error occurred while resetting password"), null))
                    return callBack(null, data)
                })
            }
        })
    }

    /**
     * @description Send mail for verification of user email address
     * @method util.generateToken generates token based on userId and emailId
     * @method util.sendEmailVerificationMail sends mail to user for verifying email address
     */
    emailVerification = (userData, callBack) => {
        userModel.findOne(userData, (error, data) => {
            if (error)
                return callBack(new Error("Some error occurred while finding user"), null)
            else if (!data)
                return callBack(new Error("User not found with this email Id"), null)
            else {
                const token = util.generateToken(data)
                userData.token = token
                consumer.consume((error, message) => {
                    if (error)
                        callBack(new Error("Some error occurred while consuming message"), null)
                    else {
                        userData.emailId = message
                        util.sendEmailVerificationMail(userData, (error, data) => {
                            if (error) {
                                return callBack(new Error("Some error occurred while sending email"), null)
                            }
                            return callBack(null, data)
                        })
                    }
                })
            }
        })
    }

    /**
     * @description ACtivate user account
     * @method userModel.findAndUpdate calls model class method for activating user account
     */
    activateAccount = (userData, callBack) => {
        userModel.findAndUpdate(userData, (error, data) => {
            if (error)
                return callBack(new Error(("Some error occurred while activating account"), null))
            return callBack(null, data)
        })
    }
}
module.exports = new UserService()