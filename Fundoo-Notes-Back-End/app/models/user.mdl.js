const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const saltRounds = 10;

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

UserSchema.pre('save', function (next) {
    // only hash the password if it has been modified or is new
    if (!this.isModified('password'))
        return next();

    // generate a salt and hash password
    bcrypt.hash(this.password, saltRounds, (error, hash) => {
        if (error)
            return next(error);
        this.password = hash;
        next();
    });

});

const User = mongoose.model('User', UserSchema)

class UserModel {
    /**
     *@description User registration
     *@method save is used to save user details
     */
    register = (userRegistrationData, callBack) => {
        const user = new User({
            firstName: userRegistrationData.firstName,
            lastName: userRegistrationData.lastName,
            emailId: userRegistrationData.emailId,
            password: userRegistrationData.password
        })
        user.save({}, (error, data) => {
            if (error)
                return callBack(error, null);
            else
                return callBack(null, data);
        });
    }

    /**
     *@description User login
     *@method findOne finds document with particular email Id
     *@method callBack makes call back to the service class method
     */
    login = (userLogindata, callBack) => {
        User.findOne({ emailId: userLogindata.emailId }, (error, data) => {
            if (error)
                callBack(error, null)
            callBack(null, data)
        })
    }

    /**
     * @description Forgot password
     */
    forgotPassword = (emailId, callBack) => {
        User.findOne({ emailId: emailId }, (error, data) => {
            if (error)
                callBack(error, null)
            callBack(null, data)
        })
    }

    /**
     * @description Reset password
     */
    resetPassword = (resetPasswordData, callBack) => {
        User.findOne({ emailId: resetPasswordData.emailId }, (error, user) => {
            if (error)
                return callBack(new Error("Some error occurred"), null)
            else {
                user.password = resetPasswordData.newPassword
                user.save((error, data) => {
                    if (error) 
                        return callBack(new Error("Reset password error"), null)
                    else
                    return callBack(null, data)
                })
            }
        })
    }
}
module.exports = new UserModel();