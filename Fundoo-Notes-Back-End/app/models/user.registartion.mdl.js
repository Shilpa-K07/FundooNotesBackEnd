const mongoose = require('mongoose')

const UserRegistrationSchema = mongoose.Schema({
    name: String,
    emailId: {
        type: String,
        unique: true
    },
    password: String
}, {
    timestamps: true
})

const userRegistartion = mongoose.model('userRegistartion', UserRegistrationSchema)

class UserModel {
    register = (userRegistrationData, callBack) => {
        const registration = new userRegistartion({
            name: userRegistrationData.name,
            emailId: userRegistrationData.emailId,
            password: userRegistrationData.password
        })
        registration.save({}, (error, data) => {
            if (error)
                return callBack(error, null);
            else
                return callBack(null, data);
        });
    }
}
module.exports = new UserModel();