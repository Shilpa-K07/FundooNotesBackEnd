/**
 * @description service class takes request from controller and sends this request to model
*/
const noteModel = require('../models/note.mdl')
const util = require('../utility/util')

class NoteService {
    // Create a new note
    createNote = (noteData, callBack) => {
        noteModel.create(noteData, (error, data) => {
            if (error)
                return callBack(new Error("Some error occurred while adding note"), null)
            return callBack(null, data)
        })
    }

    // Retrieve notes
    findAll = (callBack) => {
        noteModel.findAll((error, data) => {
            if (error)
                return callBack(new Error("Some error occurred while retrieving notes"), null)
            return callBack(null, data)
        })
    }


    // Update note
    updateNote = (noteData, callBack) => {
        noteModel.update(noteData, (error, data) => {
            if (error)
                return callBack(new Error("Some error occurred while updating note"), null)
            return callBack(null, data)
        })
    }

    // Delete note
    deleteNote = (noteData, callBack) => {
        noteModel.delete(noteData, (error, data) => {
            if (error)
                return callBack(new Error("Some error occurred while deleting note"))
            return callBack(null, data)
        })
    }

    // Validate user
    validateUser = (token, callBack) => {
        const decodeData = util.verifyUser(token)
        if (!decodeData)
            return callBack(new Error("In correct token or token is expired"), null)
        noteModel.findById(decodeData, (error, user) => {
            if (error)
                return callBack(new Error("Some error occurred while finding user"), null)
            else if (!user)
                return callBack(new Error("Authorization failed"), null)
            else
                return callBack(null, user)
        })
    }

    // Add label to note
    addLabelToNote = (noteData) => {
        return noteModel.add(noteData)
    }

    // Remove label from note
    removeLabelFromNote = (noteData) => {
        return noteModel.remove(noteData)
    }
}
module.exports = new NoteService()