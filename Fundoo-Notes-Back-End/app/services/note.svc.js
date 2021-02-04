/*************************************************************************
* Purpose : to recieve request from controller and send it to model layer 
    and perform some intermediate business logic
*
* @file : note.svc.js
* @author : Shilpa K <shilpa07udupi@gmail.com>
* @version : 1.0
* @since : 01/12/2020
*
**************************************************************************/
const noteModel = require('../models/note.mdl').noteModel
const util = require('../utility/util')
const logger = require('../logger/logger')

class NoteService {
    /**
     *@description Create a new note
     *@method create calls model class method
     *@param callBack is function which calls controller class method
     */
    createNote = (noteData, callBack) => {
        noteModel.create(noteData, (error, data) => {
            if (error){
                logger.error('Some error occurred while adding note')
                return callBack(new Error("Some error occurred while adding note"), null)
            }
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
            if (error){
                logger.error('Some error occurred while retrieving notes')
                return callBack(new Error("Some error occurred while retrieving notes"), null)
            }
            return callBack(null, data)
        })
    }


    
    /**
     *@description Retrieve notes based on labelId
     *@method findAll calls model class method
     *@param callBack is function which calls controller class method
     */
    findNotesByLabel = (noteData,callBack) => {
        noteModel.findNotesByLabel(noteData,(error, data) => {
            if (error){
                logger.error('Some error occurred while retrieving notes')
                return callBack(new Error("Some error occurred while retrieving notes"), null)
            }
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
            if (error){
                logger.error('Some error occurred while updating note')
                return callBack(new Error("Some error occurred while updating note"), null)
            }
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
            if (error){
                logger.error('Some error occurred while deleting note')
                return callBack(new Error("Some error occurred while deleting note"))
            }
            return callBack(null, data)
        })
    }

     /**
     *@description Restore notes
     *@method delete calls model class method
     *@param callBack is function which calls controller class method
     */
    restoreNote = (noteData, callBack) => {
        noteModel.restoreNote(noteData, (error, data) => {
            if (error){
                logger.error('Some error occurred while restoring note')
                return callBack(new Error("Some error occurred while restoring note"))
            }
            return callBack(null, data)
        })
    }

     /**
     *@description Deletes notes permanently
     *@method delete calls model class method
     *@param callBack is function which calls controller class method
     */
    hardDeleteNote = (noteData, callBack) => {
        noteModel.hardDeleteNote(noteData, (error, data) => {
            if (error){
                logger.error('Some error occurred while deleting note')
                return callBack(new Error("Some error occurred while deleting note"))
            }
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
        if (!decodeData){
            logger.error('In correct token or token is expired')
            return callBack(new Error("In correct token or token is expired"), null)
        }
        noteModel.findById(decodeData, (error, user) => {
            if (error){
                logger.error('Some error occurred while finding user')
                return callBack(new Error("Some error occurred while finding user"), null)
            }
            else if (!user){
                logger.error('Authorization failed')
                return callBack(new Error("Authorization failed"), null)
            }
            else
                return callBack(null, user)
        })
    }

    /**
     * @description adds labels to note
     * @method add calls model class method
     */
    addLabelToNote = (noteData) => {
        return noteModel.add(noteData)
    }

    /**
     * @description remove labels from note
     * @method remove calls model class method
     */
    removeLabelFromNote = (noteData) => {
        return noteModel.remove(noteData)
    }

     /**
     * @description create new collaborator
     * @method create calls model class method
     */
    createCollaborator = (collaboratorData) => {
        return noteModel.createCollaborator(collaboratorData)
    }

    /**
     * @description delete  collaborator
     * @method delete calls model class method
     */
    removeCollaborator = (collaboratorData) => {
        return noteModel.removeCollaborator(collaboratorData)
    }
}
module.exports = new NoteService()