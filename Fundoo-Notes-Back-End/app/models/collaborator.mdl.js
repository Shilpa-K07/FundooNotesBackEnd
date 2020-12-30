/**
 * @description Model class interacts with dataBase to perform tasks
 * @param CollaboratorSchema is the schema for the label created by the users
 */
const mongoose = require('mongoose')
const User = require('../models/user.mdl').User
const Note = require('../models/note.mdl').Note

const CollaboratorSchema = mongoose.Schema({
    noteId: {
        type: String
    },
    collaboratorUserId: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timeStamps: true
})

const Collaborator = mongoose.model('Collaborator', CollaboratorSchema)

class CollaboratorModel {

    /**
     * @description Create new collaborator
     * @method Note.findByIdAndUpdate updates note with collaborator Id
     */
    create = (collaboratorData) => {
        return User.findOne({ _id: collaboratorData.userId })
            .then(data => {
                if (data) {
                    const collaborator = new Collaborator({
                        noteId: collaboratorData.noteId,
                        collaboratorUserId: collaboratorData.collaboratorUserId
                    })
                    return collaborator.save({})
                    .then(data => {
                        if(data)
                            Note.findByIdAndUpdate(collaboratorData.noteId, { $push: { collaboratorId: data._id } }, { new: true })
                            .then(data)
                    })
                }
            })
    }

    /**
     * @description delete collabortaor
     */
    delete = (collaboratorData) => {
        return User.findOne({ _id: collaboratorData.decodeData.userId })
            .then(data => {
                if (data) {
                    return Collaborator.find({ _id: collaboratorData.collaboratorId })
                        .then(collaborator => {
                            if (collaborator.length == 1 && !(collaborator[0].isDeleted))
                                return Collaborator.findByIdAndUpdate(collaboratorData.collaboratorId, { isDeleted: true }, { new: true })
                        })
                }
            })
    }
}
module.exports = {
    collaboratorModel: new CollaboratorModel(),
    collaboratorSchema: Collaborator
}