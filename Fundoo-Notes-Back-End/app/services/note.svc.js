const noteModel = require('../models/note.mdl')

class NoteService {
    /**
     * @description Create new note
     */
    create = (noteData, callBack) => {
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
}
module.exports = new NoteService()