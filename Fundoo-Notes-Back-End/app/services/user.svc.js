const userModel = require('../models/user.registartion.mdl')

class UserService {
    /**
     * new registration
     * @param callBack is the callback for controller
     */
    register = (userRegistrationData, callBack) => {
        userModel.register(userRegistrationData, (error, data) => {
            if(error)
                return callBack(error, null)
            return callBack(null, data)
        })
    }
}
module.exports = new UserService()