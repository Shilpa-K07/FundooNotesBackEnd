const mongoose = require('mongoose')
const userRt = require('../routes/user.rt')

const noteSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: true,
        maxlength: 100
    },
}, {
    timestamps: true
})

const Note = mongoose.model('Note', noteSchema)

class NoteModel {
    /**
     *@description Create new note
     *@method save is used to save user details
     */
    create = (noteData, callBack) => {
        const noteDetails = new Note({
            title: noteData.title,
            note: noteData.note
        })

        noteDetails.save({}, (error, data) => {
            if (error)
                return callBack(error, null)
            return callBack(null, data)
        })
    }

    /**
     * @description Retrieve Notes
     */
    findAll = (callBack) => {
        Note.find((error, data) => {
            if (error)
                return callBack(error, null)
            return callBack(null, data)
        })
    }
}
module.exports = new NoteModel()