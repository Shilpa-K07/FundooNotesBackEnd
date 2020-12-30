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

class UserService {
    // New user registration
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
            if(error)
                return callBack(new Error("Some error occuured while retrieving data from redis"), null)
            else if(data){
                data = JSON.parse(data)
                const token = util.generateToken(data)
                data.token = token
                return callBack(null, data)
            }
            else{
                userModel.findOne(userLoginData, (error, data) => {
                    if (error)
                        return callBack(new Error("Some error occured while logging in"), null)
                    else if (!data)
                        return callBack(new Error("Authorization failed"), null)
                    else {
                        bcrypt.compare(userLoginData.password, data.password, (error, result) => {
                            if (result) {
                                if (data.isActivated) {
                                    const token = util.generateToken(data)
                                    data.token = token
                                    redis.set(userName, key, data)
                                    return callBack(null, data)
                                }
                                else
                                    return callBack(new Error("Please verify email before login"))
                            }
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
            if (error)
                return callBack(new Error("Some error occurred"), null)
            else if (!data)
                return callBack(new Error("User not found with this email Id"), null)
            else {
                const token = util.generateToken(data);
                userData.token = token
                util.nodeEmailSender(userData, (error, data) => {
                    if (error)
                        return callBack(new Error("Some error occurred while sending email"), null)
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

    // Retrieve user profiles 
    findAll = ((callBack) => {
        userModel.findAll((error, data) => {
            if (error)
                return callBack(error, null)
            return callBack(null, data)
        })
    })

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

    // Activate account
    activateAccount = (userData, callBack) => {
        userModel.findAndUpdate(userData, (error, data) => {
            if (error)
                return callBack(new Error(("Some error occurred while activating account"), null))
            return callBack(null, data)
        })
    }

    // find all users by emailId
    findAll = ((callBack) => {
        userModel.findByEmailId((error, data) => {
            if (error)
                return callBack(new Error(("Some error occurred while activating account"), null))
            return callBack(null, data)
        })
    })
}
module.exports = new UserService()