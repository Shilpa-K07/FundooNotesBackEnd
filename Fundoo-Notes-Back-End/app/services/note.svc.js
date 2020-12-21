/**
 * @description service class takes request from controller and sends this request to model
*/
const noteModel = require('../models/note.mdl')
/* const bcrypt = require('bcrypt'); */

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
            if(error)
                return callBack(new Error("Some error occurred while updating note"))
            return callBack(null, data)
        })
    }

    // Delete note
    deleteNote = (noteData, callBack) => {
        noteModel.delete(noteData, (error, data) => {
            if(error)
                return callBack(new Error("Some error occurred while deleting note"))
            return callBack(null, data)
        })
    }

    // Validate user
    validateUser = (noteData, callBack) => {
        noteModel.findByEmailId(noteData, (error, user) => {
            if(error)
                return callBack(new Error("Some error occurred while finding user"), null)
            else if (!user)
                return callBack(new Error("Authorization failed"), null)
            else
                return callBack(null, user)
            /* else {
                bcrypt.compare(noteData.password, user.password, (error, result) => {
                    if (result) 
                        return callBack(null, result)
                    return callBack(new Error("Authorization failed"), null)
                })
            } */
        })
    }
}
module.exports = new NoteService()