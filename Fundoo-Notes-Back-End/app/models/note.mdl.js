/**
 * @description Model class interacts with dataBase to perform tasks
 * @param noteSchema is the schema for the note created by the users
 */
const mongoose = require('mongoose')
const User = require('./user.mdl').User
const logger = require('../logger/logger')

const NoteSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    labelId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Label"
    }],
    collaborator: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    color: {
        type: String
    },
    reminder: {
        type: String
    }
}, {
    timestamps: true
})

const Note = mongoose.model('Note', NoteSchema)

class NoteModel {
    /**
     * @description Create a new note and save
     * @method User.findOne checks for user authorization
     * @method noteDetails.save saves note to note collection
     */
    create = (noteData, callBack) => {
        User.findOne({ _id: noteData.userId }, (error, user) => {
            if (error) {
                logger.error('Error occurred while finding user')
                return callBack(error, null)
            }
            else {
                logger.error('user found')
                const noteDetails = new Note({
                    title: noteData.title,
                    description: noteData.description,
                    userId: noteData.userId
                })

                noteDetails.save({}, (error, data) => {
                    if (error) {
                        logger.error('Error occurred while saving user')
                        return callBack(error, null)
                    }
                    return callBack(null, data)
                })
            }
        })
    }

    /**
     * @description Find user by objectId
     * @method User.findOne checks for user in user collection
     */
    findById = (decodeData, callBack) => {
        User.findOne({ _id: decodeData.userId }, (error, user) => {
            if (error) {
                logger.error('Error occurred while finding user')
                return callBack(error, null)
            }
            return callBack(null, user)
        })
    }

    /**
     * @description Update note
     * @method User.findOne checks for user in user collection
     * @method Note.find finds specific noteId and userId in note collection
     * @method Note.findByIdAndUpdate updates note
     */
    update = (noteData, callBack) => {
        User.findOne({ _id: noteData.userId }, (error, user) => {
            if (error) {
                logger.error('Error occurred while finding user')
                return callBack(error, null)
            }
            else if (user) {
                Note.find({ _id: noteData.noteID, userId: noteData.userId }, (error, note) => {
                    if (error)
                        return callBack(error, null)
                    else if (note.length == 0)
                        return callBack(null, note)
                    else {
                        logger.info('Note found updating note')
                        Note.findByIdAndUpdate(noteData.noteID, {
                            title: noteData.title,
                            description: noteData.description
                        }, { new: true }, (error, data) => {
                            if (error)
                                return callBack(error, null)
                            return callBack(null, data)
                        })
                    }
                })
            }
            else
                return callBack(error, null)
        })
    }

    /**
     * @description Delete note
     * @method User.findOne checks for user in user collection
     * @method Note.find finds specific noteId and userId in note collection
     * @method Note.findByIdAndUpdate updates note by setting isDeleted fied to true
     */
    delete = (noteData, callBack) => {
        User.findOne({ _id: noteData.userId }, (error, user) => {
            if (error) {
                logger.error('Error occurred while finding user')
                return callBack(error, null)
            }
            else if (user) {
                Note.find({ _id: noteData.noteID, userId: noteData.userId }, (error, note) => {
                    if (error)
                        return callBack(error, null)
                    else if (note.length == 0)
                        return callBack(null, note)
                    else {
                        logger.info('Note found')
                        if (!(note[0].isDeleted)) {
                            Note.findByIdAndUpdate(noteData.noteID, { isDeleted: true }, { new: true }, (error, data) => {
                                if (error) {
                                    logger.error('Error occurred while deleting note')
                                    return callBack(error, null)
                                }
                                return callBack(null, data)
                            })
                        }
                        else
                            return callBack(null, null)
                    }
                })
            }
            else
                return callBack(error, null)
        })
    }

    /**
    * @description Find all the notes 
    * @method Note.find finds all the notes in note collection
    */
    findAll = (callBack) => {
        Note.find((error, data) => {
            if (error) {
                logger.error('error occurred while finding all the users')
                return callBack(error, null)
            }
            return callBack(null, data)
        })
    }

    /**
     * @description Add label to note
     * @method User.findOne checks for user in user collection
     * @method Note.find finds specific noteId and userId in note collection
     * @method Note.findByIdAndUpdate updates note by pushing labelId to labelId
     */
    add = (noteData) => {
        return User.findOne({ _id: noteData.userId })
            .then(user => {
                if (user) {
                    logger.info('User found')
                    return Note.find({ _id: noteData.noteID, userId: noteData.userId })
                        .then(note => {
                            if (note.length == 1) {
                                logger.info('Note found updating note')
                                return Note.findByIdAndUpdate(noteData.noteID, { $push: { labelId: noteData.labelId } }, { new: true })
                            }
                        })
                }
            })
    }

    /**
     * @description Remove label from note
     * @method User.findOne checks for user in user collection
     * @method Note.find finds specific noteId and userId in note collection
     * @method Note.findByIdAndUpdate updates note by pulling labelId from labelId
     */
    remove = (noteData) => {
        return User.findOne({ _id: noteData.userId })
            .then(user => {
                if (user) {
                    logger.info('User found')
                    return Note.find({ _id: noteData.noteID, userId: noteData.userId })
                        .then(note => {
                            if (note.length == 1) {
                                logger.info('Note found updating note by removing label')
                                return Note.findByIdAndUpdate(noteData.noteID, { $pull: { labelId: noteData.labelId } }, { new: true })
                            }
                        })
                }
            })
    }

    /**
    * @description Create new collaborator
    * @method Note.find searches in note collection for specific noteId and userId
    */
    createCollaborator = (collaboratorData) => {
        return User.findOne({ _id: collaboratorData.noteCreatorId })
            .then(data => {
                if (data) {
                    logger.info('User found')
                    return Note.find({ _id: collaboratorData.noteId, collaborator: collaboratorData.userId })
                        .then(note => {
                            if (note.length == 0) {
                                logger.info('Note found creating collaborator')
                                return Note.findByIdAndUpdate(collaboratorData.noteId, { $push: { collaborator: collaboratorData.userId } }, { new: true })
                                    .then(data)
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
    removeCollaborator = (collaboratorData) => {
        return User.findOne({ _id: collaboratorData.noteCreatorId })
            .then(data => {
                if (data) {
                    logger.info('User found')
                    return Note.find({ _id: collaboratorData.noteId, collaborator: collaboratorData.userId })
                        .then(note => {
                            if (note.length == 1) {
                                logger.info('Note found updating note by removing collaboratorId')
                                return Note.findByIdAndUpdate(collaboratorData.noteId, { $pull: { collaborator: collaboratorData.userId } }, { new: true })
                            }
                        })
                }
            })
    }
}
module.exports = {
    noteModel: new NoteModel(),
    Note: Note
}