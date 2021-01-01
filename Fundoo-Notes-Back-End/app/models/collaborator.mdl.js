/**
 * @description Model class interacts with dataBase to perform tasks
 * @param CollaboratorSchema is the schema for the label created by the users
 */
const mongoose = require('mongoose')
const User = require('../models/user.mdl').User
const Note = require('../models/note.mdl').Note

const CollaboratorSchema = mongoose.Schema({
    userId: {
        type: String,
        trim: true
    }
}, {
    timeStamps: true
})

CollaboratorSchema.set('versionKey', false)
const Collaborator = mongoose.model('Collaborator', CollaboratorSchema)

class CollaboratorModel {

    /**
     * @description Create new collaborator
     * @method Note.findByIdAndUpdate updates note with collaborator Id
     */
    create = (collaboratorData) => {
        return User.findOne({ _id: collaboratorData.noteCreatorId })
            .then(data => {
                if (data) {
                    return Note.findOne({ _id: collaboratorData.noteId }).populate('collaboratorId')
                        .then(data => {
                            if (data.collaboratorId) {
                                for (var index = 0; index < data.collaboratorId.length; index++) {
                                    if (data.collaboratorId[index].userId === collaboratorData.userId) {
                                        return
                                    }
                                }
                            }
                            const collaborator = new Collaborator({
                                userId: collaboratorData.userId
                            })
                            return collaborator.save({})
                                .then(data => {
                                    if (data){
                                        Note.findByIdAndUpdate(collaboratorData.noteId, { $push: { collaboratorId: data._id } }, { new: true })
                                            .then(data)
                                    }
                                    return data
                                })
                        })
                }
            })
    }

    /**
     * @description delete collabortaor
     * @method Collaborator.find find collaborator with given Id
     * @method Note.findOneAndUpdate updates notes by removing specific collaborator Id
     * @method Collaborator.findByIdAndRemove removes collaborator 
     */
    delete = (collaboratorData) => {
        return User.findOne({ _id: collaboratorData.noteCreatorId })
            .then(data => {
                if (data) {
                    return Collaborator.find({ _id: collaboratorData.collaboratorId })
                        .then(collaborator => {
                            if (collaborator.length == 1 /* && !(collaborator[0].isDeleted) */){
                                Note.findOneAndUpdate({collaboratorId:collaboratorData.collaboratorId}, { $pull: { collaboratorId: collaboratorData.collaboratorId } }, { new: true })
                                .then(data => {console.log("data: "+data)})
                                return Collaborator.findByIdAndRemove(collaboratorData.collaboratorId)
                            }
                        })
                }
            })
    }
}
module.exports = {
    collaboratorModel: new CollaboratorModel(),
    collaboratorSchema: Collaborator
}