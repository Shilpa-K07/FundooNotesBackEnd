/**
 * @description Model class interacts with dataBase to perform tasks
 * @param CollaboratorSchema is the schema for the label created by the users
 */
const mongoose = require('mongoose')
const User = require('../models/user.mdl').User
const Note = require('../models/note.mdl').Note

class CollaboratorModel {

    /**
     * @description Create new collaborator
     * @method Note.find searches in note collection for specific noteId and userId
     */
    create = (collaboratorData) => {
        return User.findOne({ _id: collaboratorData.noteCreatorId })
            .then(data => {
                if (data) {
                    return Note.find({ _id: collaboratorData.noteId, collaborator: collaboratorData.userId })
                        .then(note => {
                            if (note.length == 0) {
                                const collaborator = new Collaborator({
                                    userId: collaboratorData.userId
                                })
                                return collaborator.save({})
                                    .then(data => {
                                        if (data) {
                                            Note.findByIdAndUpdate(collaboratorData.noteId, { $push: { collaborator: collaboratorData.userId } }, { new: true })
                                                .then(data)
                                        }
                                        return data
                                    })
                            }
                        })
                }
            })
    }

    /**
     * @description delete collabortaor
     * @method Note.find finds in note collection for specific noteId and collaboratorId
     * @method Note.findOneAndUpdate updates notes by removing specific collaboratorId
     */
    delete = (collaboratorData) => {
        return User.findOne({ _id: collaboratorData.noteCreatorId })
            .then(data => {
                if (data) {
                    return Note.find({ _id: collaboratorData.noteId, collaborator: collaboratorData.collaboratorId })
                        .then(note => {
                            if (note.length == 1) {
                                return Note.findOneAndUpdate({ collaborator: collaboratorData.collaboratorId }, { $pull: { collaborator: collaboratorData.collaboratorId } }, { new: true })
                            }
                        })
                }
            })
    }
}
module.exports = {
    collaboratorModel: new CollaboratorModel()
}