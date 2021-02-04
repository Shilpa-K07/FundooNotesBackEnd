/*************************************************************************
* Purpose : to recieve request from routes and forward it to service layer
*
* @file : note.ctr.js
* @author : Shilpa K <shilpa07udupi@gmail.com>
* @version : 1.0
* @since : 01/12/2020
*
**************************************************************************/
const noteService = require('../services/note.svc')
const logger = require('../logger/logger')
const Joi = require('joi')

const noteInputPattern = Joi.object({
    title: Joi.string().trim().required().messages({
        'string.empty': 'Title can not be empty'
    }),
    description: Joi.string().required().messages({
        'string.empty': 'Note can not be empty'
    })
}).unknown(true)

const noteId = Joi.string().trim().required().messages({
    'string.empty': 'noteId can not be empty'
})
const collaboratorInputPattern = Joi.object({
    noteId: noteId,
    userId: Joi.string().trim().required().messages({
        'string.empty': 'userId can not be empty'
    })
}).unknown(true)

const labelInputPattern = Joi.object({
    noteID: noteId,
    labelId: Joi.string().trim().required().messages({
        'string.empty': 'userId can not be empty'
    })
}).unknown(true)


class NoteController {
    /**
     * @description Create a new note
     * @method noteService.createNote is service clss method 
     */
    createNote = (req, res) => {console.log("inside ctr")
        try {
            const noteData = {
                title: req.body.title,
                description: req.body.description,
                userId: req.decodeData.userId
            }

            const validationResult = noteInputPattern.validate(noteData)

            if (validationResult.error) {
                const response = { success: false, message: validationResult.error.message };
                return res.status(400).send(response);
            }

            noteService.createNote(noteData, (error, data) => {console.log("error"+error);console.log("data: "+data)
                if (error) {
                    logger.error(error.message)
                    const response = { success: false, message: error.message }
                    return res.status(500).send(response)
                }

                logger.info("Successfully added note !")
                const response = { success: true, message: "Successfully added note !", data: data }
                return res.status(200).send(response)
            })
        }
        catch (error) {
            const response = { success: false, message: "Some error occurred !" }
            logger.error("Some error occurred !")
            return res.status(500).send(response)
        }
    }

    /**
     * @description Retrieve all the notes
     * @method noteService.findAll is service clss method for finding notes which later calls model
     */
    findAll = (req, res) => {
        try {
            noteService.findAll((error, data) => {
                if (error) {
                    logger.error(error.message)
                    const response = { success: false, message: error.message }
                    return res.status(500).send(response)
                }

                logger.error("Successfully retrieved notes !")
                const response = { success: true, message: "Successfully retrieved notes !", data: data }
                return res.status(200).send(response)
            })
        }
        catch (error) {
            const response = { success: false, message: "Some error occurred !" }
            logger.error("Some error occurred !")
            return res.status(500).send(response)
        }
    }

     /**
     * @description Retrieve all the notes by labelId
     * @method noteService.findAll is service clss method for finding notes which later calls model
     */
    findNotesByLabel = (req, res) => {
        try {
            const noteData = {
                labelId: req.params.labelId,
            }
            noteService.findNotesByLabel(noteData,(error, data) => {
                if (error) {
                    logger.error(error.message)
                    const response = { success: false, message: error.message }
                    return res.status(500).send(response)
                }

                logger.error("Successfully retrieved notes !")
                const response = { success: true, message: "Successfully retrieved notes !", data: data }
                return res.status(200).send(response)
            })
        }
        catch (error) {
            const response = { success: false, message: "Some error occurred !" }
            logger.error("Some error occurred !")
            return res.status(500).send(response)
        }
    }

    /**
    * @description Update note
    * @method noteService.updateNote is service class method for updating note
    */
    updateNote = (req, res) => {
        try {
            const noteData = {
                noteID: req.params.noteID,
                title: req.body.title,
                description: req.body.description,
                userId: req.decodeData.userId
            }

            const validationResult = noteInputPattern.validate(noteData)

            if (validationResult.error) {
                const response = { success: false, message: validationResult.error.message };
                return res.status(400).send(response);
            }

            noteService.updateNote(noteData, (error, data) => {
                if (error) {
                    logger.error(error.message)
                    const response = { success: false, message: error.message }
                    return res.status(500).send(response)
                }

                if (!data || data.length == 0) {
                    logger.error("Note not found with id :" + noteData.noteID)
                    const response = { success: false, message: "Note not found with id :" + noteData.noteID }
                    return res.status(404).send(response)
                }

                logger.error("Note updated successfully !")
                const response = { success: true, message: "Note updated successfully !", data: data }
                return res.status(200).send(response)
            })
        }
        catch (error) {
            const response = { success: false, message: "Some error occurred !" }
            logger.error("Some error occurred !")
            return res.status(500).send(response)
        }
    }

    /**
     * @description Delete note
     * @param noteData contains noteId and userId. userId is retrieved from decoded data
     */
    deleteNote = (req, res) => {
        try {
            const noteData = {
                noteID: req.params.noteID,
                userId: req.decodeData.userId
            }

            noteService.deleteNote(noteData, (error, data) => {
                if (error) {
                    logger.error(error.message)
                    const response = { success: false, message: error.message }
                    return res.status(500).send(response)
                }

                else if (!data || (data.length == 0)) {
                    logger.error("Note not found with id :" + noteData.noteID)
                    const response = { success: false, message: "Note not found with id :" + noteData.noteID }
                    return res.status(404).send(response)
                }

                logger.error("Note deleted successfully !")
                const response = { success: true, message: "Note deleted successfully !" }
                return res.status(200).send(response)
            })
        }
        catch (error) {
            const response = { success: false, message: "Some error occurred !" }
            logger.error("Some error occurred !")
            return res.status(500).send(response)
        }
    }

     /**
     * @description Delete note
     * @param noteData contains noteId and userId. userId is retrieved from decoded data
     */
    restoreNote = (req, res) => {
        try {
            const noteData = {
                noteID: req.params.noteID,
                userId: req.decodeData.userId
            }

            noteService.restoreNote(noteData, (error, data) => {
                if (error) {
                    logger.error(error.message)
                    const response = { success: false, message: error.message }
                    return res.status(500).send(response)
                }

                else if (!data || (data.length == 0)) {
                    logger.error("Note not found with id :" + noteData.noteID)
                    const response = { success: false, message: "Note not found with id :" + noteData.noteID }
                    return res.status(404).send(response)
                }

                logger.error("Note restored successfully !")
                const response = { success: true, message: "Note restored successfully !" }
                return res.status(200).send(response)
            })
        }
        catch (error) {
            const response = { success: false, message: "Some error occurred !" }
            logger.error("Some error occurred !")
            return res.status(500).send(response)
        }
    }

     /**
     * @description Delete note permanently
     * @param noteData contains noteId and userId. userId is retrieved from decoded data
     */
    hardDeleteNote = (req, res) => {
        try {
            const noteData = {
                noteID: req.params.noteID,
                userId: req.decodeData.userId
            }

            noteService.hardDeleteNote(noteData, (error, data) => {
                if (error) {
                    logger.error(error.message)
                    const response = { success: false, message: error.message }
                    return res.status(500).send(response)
                }

                else if (!data || (data.length == 0)) {
                    logger.error("Note not found with id :" + noteData.noteID)
                    const response = { success: false, message: "Note not found with id :" + noteData.noteID }
                    return res.status(404).send(response)
                }

                logger.error("Note deleted successfully !")
                const response = { success: true, message: "Note deleted successfully !" }
                return res.status(200).send(response)
            })
        }
        catch (error) {
            const response = { success: false, message: "Some error occurred !" }
            logger.error("Some error occurred !")
            return res.status(500).send(response)
        }
    }

    /**
     * @description Adding label to note
     * @var userId is retrieved from decoded data
     * @method noteService.addLabelToNote return promise
     */
    addLabelToNote = (req, res) => {
        try {
            const noteData = {
                noteID: req.params.noteID,
                labelId: req.body.labelId,
                userId: req.decodeData.userId
            }

            const validationResult = labelInputPattern.validate(noteData)

            if (validationResult.error) {
                const response = { success: false, message: validationResult.error.message };
                return res.status(400).send(response);
            }

            noteService.addLabelToNote(noteData)
                .then(data => {
                    if (!data) {
                        const response = { success: false, message: "Note not found with this id" };
                        logger.error("Note not found with this id")
                        return res.status(404).send(response)
                    }
                    logger.info("Successfully added label to note !")
                    const response = { success: true, message: "Successfully added label to note!", data: data }
                    return res.status(200).send(response)
                })
                .catch(error => {console.log(error)
                    const response = { success: false, message: "Some error occurred while label to note" };
                    logger.error("Some error occurred while label to note")
                    return res.status(500).send(response)
                })
        }
        catch (error) {console.log(error)
            const response = { success: false, message: "Some error occurred !" }
            logger.error("Some error occurred !")
            return res.status(500).send(response)
        }
    }

    /**
     * @description Remove label from notes
     * @method noteService.removeLabelFromNote is service class method returns promise
     */
    removeLabelFromNote = (req, res) => {
        try {
            const noteData = {
                noteID: req.params.noteID,
                labelId: req.body.labelId,
                userId: req.decodeData.userId
            }

            noteService.removeLabelFromNote(noteData)
                .then(data => {
                    if (!data) {
                        const response = { success: false, message: "Note not found with this id" };
                        logger.error("Note not found with this id")
                        return res.status(404).send(response)
                    }
                    logger.info("Successfully removed label from note !")
                    const response = { success: true, message: "Successfully removed label from note !", data: data }
                    return res.status(200).send(response)
                })
                .catch(error => {
                    const response = { success: false, message: "Some error occurred while removing label from note" };
                    logger.error("Some error occurred while removing label from note")
                    return res.status(500).send(response)
                })
        }
        catch (error) {
            const response = { success: false, message: "Some error occurred !" }
            logger.error("Some error occurred !")
            return res.status(500).send(response)
        }
    }

    /**
    *@description create new collaborator
    *@method validate is for validating request data using joi validation
    *@method createCollaborator is service class method
    */
    createCollaborator = (req, res) => {
        try {
            const collaboratorData = {
                noteId: req.body.noteId,
                userId: req.body.userId,
                noteCreatorId: req.decodeData.userId
            }

            const validationResult = collaboratorInputPattern.validate(collaboratorData)

            if (validationResult.error) {
                const response = { success: false, message: validationResult.error.message };
                return res.status(400).send(response);
            }

            noteService.createCollaborator(collaboratorData)
                .then(data => {
                    if (!data) {
                        logger.error("Collaborator exists or Note not found")
                        const response = { success: false, message: "Collaborator exists or Note not found" };
                        return res.status(409).send(response)
                    }
                    logger.info("Successfully created collaborator !")
                    const response = { success: true, message: "Successfully created collaborator !", data: data }
                    return res.status(200).send(response)
                })
                .catch(error => {console.log(error)
                    logger.info("Some error occurred while creating collaborator")
                    const response = { success: false, message: "Some error occurred while creating collaborator" }
                    return res.status(200).send(response)
                })
        }
        catch (error) {
            const response = { success: false, message: "Some error occurred" }
            logger.error("Some error occurred !")
            return res.status(500).send(response)
        }
    }

    /**
     * @description delete colloaborator
     * @method collaboratorService.deleteCollaborator is service class method
     */
    removeCollaborator = (req, res) => {
        try {
            const collaboratorData = {
                userId: req.body.userId,
                noteId: req.body.noteId,
                noteCreatorId: req.decodeData.userId
            }

            noteService.removeCollaborator(collaboratorData)
                .then(data => {
                    if (!data) {
                        const response = { success: false, message: "Collaborator or Note not found with this id" };
                        logger.error("Collaborator or Note not found with this id")
                        return res.status(404).send(response)
                    }
                    logger.info("Successfully deleted Collaborator !")
                    const response = { success: true, message: "Successfully deleted Collaborator!" }
                    return res.status(200).send(response)
                })
                .catch(error => {
                    logger.info("Some error occurred while deleting collaborator")
                    const response = { success: false, message: "Some error occurred while deleting collaborator" }
                    return res.status(200).send(response)
                })
        }
        catch (error) {
            const response = { success: false, message: "Some error occurred" }
            logger.error("Some error occurred !")
            return res.status(500).send(response)
        }
    }
}
module.exports = new NoteController()