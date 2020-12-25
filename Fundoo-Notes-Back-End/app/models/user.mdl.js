/**
 * @description Model class interacts with dataBase to perform tasks
 * @param UserSchema is the schema for the user created with mongoose
 */

const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const FIRST_NAME_PATTERN = /[a-zA-Z]{2,}/
const LAST_NAME_PATTERN = /[a-zA-Z]{1,}/
const EMAIL_ID_PATTERN = /([0-9A-Za-z])+([-+._][0-9A-Za-z]+)*@([0-9A-Za-z])+[.]([a-zA-Z])+([.][A-Za-z]+)*/
const PASSWORD_PATTERN = /(?=.*[A-Z])(?=.*[0-9])(?=.*\W){1,}.*/

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        validate: {
            validator: (v) => {
                return FIRST_NAME_PATTERN.test(v)
            },
            message: props => `${props.value} is not a valid first name!`
        }
    },
    lastName: {
        type: String,
        required: true,
        validate: {
            validator: (v) => {
                return LAST_NAME_PATTERN.test(v)
            },
            message: props => `${props.value} is not a valid last name!`
        }
    },
    emailId: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: (v) => {
                return EMAIL_ID_PATTERN.test(v)
            },
            message: props => `${props.value} is not a valid email Id!`
        }
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: (v) => {
                return PASSWORD_PATTERN.test(v)
            },
            message: props => `${props.value} is not a valid password!`
        }
    },
    status: {
        type: Boolean,
        default: false
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
    // Add user info
    create = (userRegistrationData, callBack) => {
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

    // Find user with emailId
    findOne = (userData, callBack) => {
        User.findOne({ emailId: userData.emailId }/*) .populate('notes').exec( */,(error, user) => {
            if (error)
                callBack(error, null)
            callBack(null, user)
        })
    }

    // Find user with emailId and update password
    findOneAndUpdate = (userData, callBack) => {
        User.findOneAndUpdate({ emailId: userData.emailId }, { $set: { password: userData.newPassword } }, { new: true }, (error, user) => {
            if (error)
                return callBack(error, null)
            return callBack(null, user)
        })
    }

    // Retrieve user profile
    findAll = (callBack) => {
        User.find((error, user) => {
            if (error)
                return callBack(error, null);
            return callBack(null, user);
        })
    }

    // Find user with emailId and activate account
    findAndUpdate = (userData, callBack) => {
        User.findOneAndUpdate({ emailId: userData.emailId }, { $set: { status: true } }, { new: true }, (error, user) => {
            if (error)
                return callBack(error, null)
            return callBack(null, user)
        })
    }
}
 module.exports = {
    userModel: new UserModel(),
    User: User
}