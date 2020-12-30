/**
 * @description service class takes request from controller and sends this request to model
*/
const noteModel = require('../models/note.mdl').noteModel
const util = require('../utility/util')

class NoteService {
    /**
     *@description Create a new note
     *@method create calls model class method
     *@param callBack is function which calls controller class method
     */
    createNote = (noteData, callBack) => {
        noteModel.create(noteData, (error, data) => {
            if (error)
                return callBack(new Error("Some error occurred while adding note"), null)
            return callBack(null, data)
        })
    }

    /**
     *@description Retrieve notes
     *@method findAll calls model class method
     *@param callBack is function which calls controller class method
     */
    findAll = (callBack) => {
        noteModel.findAll((error, data) => {
            if (error)
                return callBack(new Error("Some error occurred while retrieving notes"), null)
            return callBack(null, data)
        })
    }

    /**
     *@description Update notes
     *@method update calls model class method
     *@param callBack is function which calls controller class method
     */
    updateNote = (noteData, callBack) => {
        noteModel.update(noteData, (error, data) => {
            if (error)
                return callBack(new Error("Some error occurred while updating note"), null)
            return callBack(null, data)
        })
    }

    /**
     *@description Deletes notes
     *@method delete calls model class method
     *@param callBack is function which calls controller class method
     */
    deleteNote = (noteData, callBack) => {
        noteModel.delete(noteData, (error, data) => {
            if (error)
                return callBack(new Error("Some error occurred while deleting note"))
            return callBack(null, data)
        })
    }

    /**
     * @description Validate user
     * @method util.verifyUse checks for user existence 
     * @method findById finds the user by Id
     */
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