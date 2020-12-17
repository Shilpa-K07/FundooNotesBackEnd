/**
 * @description Controller class recieves request from routes
 * @method registration is for new user to register
 * @method login is for user login
 * @method forgotPassword sends reset password link to registered user
 * @method resetPassword updates password
 */

const userModel = require('../models/user.mdl')
const util = require('../utility/user.utl')
const bcrypt = require('bcrypt');
class UserService {
    // New user registration
    register = (userRegistrationData, callBack) => {
        userModel.register(userRegistrationData, (error, data) => {
            if (error)
                return callBack(error, null)
            return callBack(null, data)
        })
    }
    
   /*  encryptPassword = (password, callBack) => {
        var saltRounds = 10;
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err)
                return callBack(error, null)
            return callBack(null, hash)
        });
    } */

   // User login
    login = (userLoginData, callBack) => {
        userModel.login(userLoginData, (error, data) => {
            if (error)
                return callBack(new Error("Some error occured while logging in"), null, null)
            else {
                bcrypt.compare(userLoginData.password, data.password, (error, result) => {
                    if (result) {
                    const token = util.generateToken(data);
                    return callBack(null, data, token)
                    }
                    return callBack(new Error("Authorization failed"),null,null)
                })
            }
        })
    }

    // Forgot password
    forgotPassword = (emailId, callBack) => {
        userModel.forgotPassword(emailId, (error, data) => {
            if (error)
                return callBack(new Error("Some error occurred"), null)
            else {
                const token = util.generateToken(data);
                util.nodeEmailSender(token, (error, data) => {
                    if (error) {
                        return callBack(new Error("Some error occurred while sending email"), null)
                    }
                    return callBack(null, data)
                })
            }
        })
    }

    // Reset password
    resetPassword = (resetPasswordData, callBack) => {
        userModel.resetPassword(resetPasswordData, (error, data) => {
            if (error)
                return callBack(error, null)
            return callBack(null, data)
        })
    }
}
module.exports = new UserService()