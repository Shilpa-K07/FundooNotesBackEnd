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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
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
        const noteDetails = new Note({
            title: noteData.title,
            description: noteData.description,
            user: noteData.userId
        })

        noteDetails.save({}, (error, data) => {
            if (error) {
                return callBack(error, null)
            }
            return callBack(null, data)
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

        Note.find({ _id: noteData.noteID, user: noteData.userId }, (error, note) => {
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

    // Delete note
    delete = (noteData, callBack) => {
        Note.find({ _id: noteData.noteID, user: noteData.userId }, (error, note) => {
            if (error)
                return callBack(error, null)
            else if (note.length == 0)
                return callBack(null, note)
            else {
                if (!(note[0].isDeleted)) {
                    Note.findByIdAndUpdate(noteData.noteID,{isDeleted: true},{new: true}, (error, data) => {
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

    // Find all the notes 
    findAll = (callBack) => {
        Note.find((error, data) => {
            if (error)
                return callBack(error, null)
            return callBack(null, data)
        })
    }
}
module.exports = new NoteModel()