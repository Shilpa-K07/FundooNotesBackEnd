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
    // var user = this;

    // only hash the password if it has been modified (or is new)
    if (!this.isModified('password'))
        return next();
    // generate a salt
    /* bcrypt.genSalt(SALT_WORK_FACTOR, function (error, salt) {
        if (error)
            return next(error);

        // hash the password using our new salt
        bcrypt.hash(this.password, salt, function (error, hash) {
            if (error) 
            return next(error);
            // override the cleartext password with the hashed one
            this.password = hash;
            next();
        });
    }); */
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
     */
    login = (userLogindata, callBack) => {
        console.log("email: " + userLogindata.emailId)
        User.findOne({ emailId: userLogindata.emailId }, (error, data) => {
            if (error)
                callBack(error, null)
            callBack(null, data)
        })
    }
}
module.exports = new UserModel();