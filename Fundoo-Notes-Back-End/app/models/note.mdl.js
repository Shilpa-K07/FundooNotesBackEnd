/**
 * @description Model class interacts with dataBase to perform tasks
 * @param noteSchema is the schema for the note created by the users
 */
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
module.exports = Note
class NoteModel {
    // Create a new note and save
    create = (noteData, callBack) => {
        const noteDetails = new Note({
            title: noteData.title,
            description: noteData.description
        })

        noteDetails.save({}, (error, data) => {console.log("save error: "+error)
            if (error) {
                return callBack(error, null)
            }
            else {
                user.User.findOneAndUpdate({ emailId: noteData.emailId }, {$push:{notes: data._id}}, { new: true },(error, data) => {
                    if (error)
                        return callBack(error, null)
                })
            }
            return callBack(null, data)
        })
    }

    //
    findByEmailId = (noteData, callBack) => {
        user.User.findOne({emailId: noteData.emailId}, (error, user) => {
            if(error)
                return callBack(error, null)
            return callBack(null, user)
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