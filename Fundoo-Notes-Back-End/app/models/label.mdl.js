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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timeStamps: true
})

const Label = mongoose.model('Label', LabelSchema)

class LabelModel {
    // Create a new label
    create = (labelData) => {
        const label = new Label({
            name: labelData.name,
            user: labelData.userId
        })

        return label.save({})
    }

    // Retrieve all labels
    findAll = () => {
        return Label.find()
    }

    // Update label
    update = (labelData) => {
            return Label.find({ _id: labelData.labelID, user: labelData.userId })
            .then(label => {
                if(label.length == 1){
                    return Label.findByIdAndUpdate(labelData.labelID, {
                        name: labelData.name
                    }, { new: true })
                }
            })
    }

    // Delete label
    delete = (labelData) => {
        return Label.find({ _id: labelData.labelID, user: labelData.userId })
            .then(label => {
                if (label.length == 1 && !(label[0].isDeleted)) {
                    return Label.findByIdAndUpdate(labelData.labelID,{isDeleted: true},{new: true})
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