/**
 * @description Controller class recieves request from routes
 * @method registration is for new user to register
 * @method login is for user login
 * @method forgotPassword sends reset password link to registered user
 * @method resetPassword updates password
 */

const user = require('../models/user.mdl')
const util = require('../utility/util')
const bcrypt = require('bcrypt');
class UserService {
    // New user registration
    register = (userRegistrationData, callBack) => {
        user.userModel.create(userRegistrationData, (error, data) => {
            if (error)
                return callBack(error, null)
            return callBack(null, data)
        })
    }

    // User login
    login = (userLoginData, callBack) => {
        user.userModel.findOne(userLoginData, (error, data) => {
            if (error)
                return callBack(new Error("Some error occured while logging in"), null)
            else if (!data)
                return callBack(new Error("Authorization failed"), null)
            else {
                bcrypt.compare(userLoginData.password, data.password, (error, result) => {
                    if (result) {
                        if(data.isActivated){
                        const token = util.generateToken(data);
                        data.token = token
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

    // Forgot password
    forgotPassword = (userData, callBack) => {
        user.userModel.findOne(userData, (error, data) => {
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

    // Reset password
    resetPassword = (resetPasswordData, callBack) => {
        util.encryptData(resetPasswordData.newPassword, (error, encryptedData) => {
            if (error)
                return callBack(new Error("Some error occurred while encrypting password"), null)
            else {
                resetPasswordData.newPassword = encryptedData
                user.userModel.findOneAndUpdate(resetPasswordData, (error, data) => {
                    if (error)
                        return callBack(new Error(("Some error occurred while resetting password"), null))
                    return callBack(null, data)
                })
            }
        })
    }

    // Retrieve user profiles 
    findAll = ((callBack) => {
        user.userModel.findAll((error, data) => {
            if (error)
                return callBack(error, null)
            return callBack(null, data)
        })
    })

    // Send email for  verification
    emailVerification = (userData, callBack) => {
        user.userModel.findOne(userData, (error, data) => {
            if (error)
                return callBack(new Error("Some error occurred while finding user"), null)
            else if (!data)
                return callBack(new Error("User not found with this email Id"), null)
            else {
                const token = util.generateToken(data)
                userData.token = token
                util.sendEmailVerificationMail(userData, (error, data) => {
                    if (error){
                        return callBack(new Error("Some error occurred while sending email"), null)
                    }
                    return callBack(null, data)
                })
            }
        })
    }

    // Activate account
    activateAccount = (userData, callBack) => {
        user.userModel.findAndUpdate(userData, (error, data) => {
            if (error)
                return callBack(new Error(("Some error occurred while activating account"), null))
            return callBack(null, data)
        })
    }
}
module.exports = new UserService()