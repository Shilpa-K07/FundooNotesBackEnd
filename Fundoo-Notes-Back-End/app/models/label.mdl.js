/**
 * @description Model class interacts with dataBase to perform tasks
 * @param labelSchema is the schema for the label created by the users
 */
const mongoose = require('mongoose')
const user = require('./user.mdl')

const LabelSchema = mongoose.Schema({
    name: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timeStamps: true
})

const Label = mongoose.model('Label', LabelSchema)

class LabelModel {
    /**
     * @description Create a new label
     * @method User.findOne finds user with specific Id
     * @method save will save object into DB
     */
    create = (labelData) => {
        return user.User.findOne({ _id: labelData.userId })
            .then(user => {
                if (user) {
                    const label = new Label({
                        name: labelData.name,
                        userId: labelData.userId
                    })
                    return label.save({})
                }
            })
    }

    // Retrieve all labels
    findAll = () => {
        return Label.find()
    }

    /**
     * @description Update label
     * @method User.findOne finds User with specific Id
     * @method Label.find finds label with specific label Id and user Id
     * @method Label.findByIdAndUpdate updates label 
     */
    update = (labelData) => {
        return user.User.findOne({ _id: labelData.userId })
            .then(user => {
                if (user) {
                    return Label.find({ _id: labelData.labelID, userId: labelData.userId })
                        .then(label => {
                            if (label.length == 1) {
                                return Label.findByIdAndUpdate(labelData.labelID, {
                                    name: labelData.name
                                }, { new: true })
                            }
                        })
                }
            })
    }

    /**
     * @description Delete label
     * @method User.findOne finds user with specific Id
     * @method Label.find finds label with specific label Id and user Id
     * @method Label.findByIdAndUpdate sets isDeleted flag to true
     */
    delete = (labelData) => {
        return user.User.findOne({ _id: labelData.userId })
            .then(user => {
                if (user) {
                    return Label.find({ _id: labelData.labelID, userId: labelData.userId })
                        .then(label => {
                            if (label.length == 1 && !(label[0].isDeleted))
                                return Label.findByIdAndUpdate(labelData.labelID, { isDeleted: true }, { new: true })
                        })
                }
            })
    }

    // Find user by email Id
    findById = (decodeData) => {
        return user.User.findOne({ _id: decodeData.userId })
    }
}
module.exports = {
    labelModel: new LabelModel(),
    Label: Label
}