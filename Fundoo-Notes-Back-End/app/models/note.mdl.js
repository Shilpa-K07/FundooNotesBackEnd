/**
 * @description Model class interacts with dataBase to perform tasks
 * @param noteSchema is the schema for the note created by the users
 */
const { update } = require('lodash')
const mongoose = require('mongoose')
const user = require('./user.mdl')

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
    // Create a new note and save
    create = (noteData, callBack) => {
        user.User.findOne({ _id: noteData.userId }, (error, user) => {
            if (error)
                return callBack(error, null)
            else {
                const noteDetails = new Note({
                    title: noteData.title,
                    description: noteData.description,
                    userId: noteData.userId
                })

                noteDetails.save({}, (error, data) => {
                    if (error) {
                        return callBack(error, null)
                    }
                    return callBack(null, data)
                })
            }
            /* else {
                data.updateOne({ $push: { users: noteData.userId } }, { new: true }, (error, user) => {
                    if (error)
                        return callBack(error, null)
                })
            } */
            /*  else {
                 user.User.findOneAndUpdate({ _id: noteData.userId }, { $push: { notes: data._id } }, { new: true }, (error, data) => {
                     if (error)
                         return callBack(error, null)
                 })
                 return callBack(null, data)
             } */
        })
    }

    // Find user by objectId
    findById = (decodeData, callBack) => {
        user.User.findOne({ _id: decodeData.userId }, (error, user) => {
            if (error)
                return callBack(error, null)
            return callBack(null, user)
        })
    }

    // Update note
    update = (noteData, callBack) => {
        user.User.findOne({ _id: noteData.userId }, (error, user) => {
            if (error)
                return callBack(error, null)
            else if(user){
                Note.find({ _id: noteData.noteID, userId: noteData.userId }, (error, note) => {
                    if (error)
                        return callBack(error, null)
                    else if (note.length == 0)
                        return callBack(null, note)
                    else {
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

    // Delete note
    delete = (noteData, callBack) => {debugger;
        user.User.findOne({ _id: noteData.userId }, (error, user) => {
            if (error)
                return callBack(error, null)
            else if (user) {
                Note.find({ _id: noteData.noteID, userId: noteData.userId }, (error, note) => {
                    if (error)
                        return callBack(error, null)
                    else if (note.length == 0)
                        return callBack(null, note)
                    else {
                        if (!(note[0].isDeleted)) {
                            Note.findByIdAndUpdate(noteData.noteID, { isDeleted: true }, { new: true }, (error, data) => {
                                if (error)
                                    return callBack(error, null)
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

    // Find all the notes 
    findAll = (callBack) => {
        Note.find((error, data) => {
            if (error)
                return callBack(error, null)
            return callBack(null, data)
        })
    }

    // Add label to note
    add = (noteData) => {
        return user.User.findOne({ _id: noteData.userId })
        .then(user => {
            if (user) {
                return Note.find({ _id: noteData.noteID, userId: noteData.userId })
                    .then(note => {
                        if (note.length == 1) {
                            return Note.findByIdAndUpdate(noteData.noteID, { $push: { labelId: noteData.labelId } }, { new: true })
                        }
                    })
            }
        })
    }

    // Remove label from note
    remove = (noteData) => {
        return user.User.findOne({ _id: noteData.userId })
        .then(user => {
            if (user) {
                return Note.find({ _id: noteData.noteID, userId: noteData.userId })
                    .then(note => {
                        if (note.length == 1) {
                            return Note.findByIdAndUpdate(noteData.noteID, { $pull: { labelId: noteData.labelId } }, { new: true })
                        }
                    })
            }
        })
    }
}
module.exports = new NoteModel()