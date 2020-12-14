const userModel = require('../models/user.mdl')
const bcrypt = require('bcrypt');
class UserService {
    /**
     * new registration
     * @param callBack is the callback for controller
     */
    register = (userRegistrationData, callBack) => {
        /* this.encryptPassword(userRegistrationData.password, (error, hash) => {
            if (hash) { */
               // userRegistrationData.password = hash
                userModel.register(userRegistrationData, (error, data) => {
                    if (error)
                        return callBack(error, null)
                    return callBack(null, data)
         /*        })
            } */
        })
    }
    /**
     * @description Password encryption
     */
    encryptPassword = (password, callBack) => {
        var saltRounds = 10;
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err)
                return callBack(error, null)
            return callBack(null, hash)
        });
    }

    /**
     * @description User login
     */
    login = (userLogindata, callBack) => {
        userModel.login(userLogindata, (error, data) => {
            if(error)
                return callBack(error, data)
            return callBack(null, data)
        })
    }
}
module.exports = new UserService()