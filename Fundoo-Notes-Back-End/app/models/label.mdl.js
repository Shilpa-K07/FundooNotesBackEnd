/**
 * @description Model class interacts with dataBase to perform tasks
 * @param labelSchema is the schema for the label created by the users
 */
const { boolean } = require('joi')
const mongoose = require('mongoose')
const user = require('./user.mdl')

const LabelSchema = mongoose.Schema({
    name: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timeStamps: true
})

const Label = mongoose.model('Label', LabelSchema)

class LabelModel {
    // Create a new label
    create = (labelData) => {
        const label = new Label({
            name: labelData.name
        })

        return label.save({})
            .then(data => {
                if (data) {
                    return user.User.findOneAndUpdate({ emailId: labelData.emailId }, { $push: { labels: data._id } }, { new: true })
                }
            })
    }

    // Retrieve all labels
    findAll = () => {
        return Label.find()
    }

    // Update label
    update = (labelData) => {
        return user.User.find({ emailId: labelData.emailId, labels: labelData.labelID })
            .then(data => {
                if (data.length == 1) {
                    return Label.findByIdAndUpdate(labelData.labelID, { name: labelData.name }, { new: true })
                }
            })
    }

    // Delete label
    delete = (labelData) => {
        return user.User.find({ emailId: labelData.emailId, labels: labelData.labelID })
            .then(data => {
                console.log("data 1: " + data)
                if (data.length == 1) {
                    Label.findById(labelData.labelID)
                        .then(label => {
                            console.log("label data: " + label)
                            if (!label.isDeleted) {
                                return label.updateOne({isDeleted: true},{new: true})
                            }
                            else
                                return null
                        })
                }
            })
    }

    // Find user by email Id
    findByEmailId = (labelData) => {
        return user.User.findOne({ emailId: labelData.emailId })
    }
}
module.exports = {
    labelModel: new LabelModel(),
    Label: Label
}