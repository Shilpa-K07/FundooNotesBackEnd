const noteModel = require('../models/note.mdl')
const bcrypt = require('bcrypt');

class NoteService {
    /**
     * @description Create new note
     */
    createNote = (noteData, callBack) => {
        noteModel.create(noteData, (error, data) => {
            if (error)
                return callBack(error, null)
            return callBack(null, data)
        })
    }

    /**
     * @description Retrieve notes
     */
    findAll = (callBack) => {
        noteModel.findAll((error, data) => {
            if (error)
                return callBack(error, data)
            return callBack(null, data)
        })
    }

    //Validate user
    validateUser = (noteData, callBack) => {
        noteModel.findByEmailId(noteData, (error, user) => {
            if(error)
                return callBack(new Error("Authorization falied"), null)
            else if (!user)
                return callBack(new Error("Authorization failed"), null)
            else {
                bcrypt.compare(noteData.password, user.password, (error, result) => {
                    if (result) 
                        return callBack(null, result)
                    return callBack(new Error("Authorization failed"), null)
                })
            }
        })
    }
}
module.exports = new NoteService()