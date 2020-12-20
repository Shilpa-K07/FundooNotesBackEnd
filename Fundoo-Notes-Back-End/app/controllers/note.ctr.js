/**
 * @description Controller class takes request from the routes and sends response back
 * @method createNote creates a new note for the particular user
 */
const noteService = require('../services/note.svc')
const logger = require('../logger/logger')
const Joi = require('joi')

const inputPattern = Joi.object({
    title: Joi.string().required().messages({
        'string.empty': 'Title can not be empty'
    }),
    description: Joi.string().required().messages({
        'string.empty': 'Note can not be empty'
    })
}).unknown(true)

class NoteController {
    // Create a new note
    createNote = (req, res) => {
        const noteData = {
            emailId: req.body.emailId,
            password: req.body.password,
            title: req.body.title,
            description: req.body.description,
            isArchived: req.body.isArchived
        }

        noteService.validateUser(noteData, (error, user) => {
            if (error) {
                const response = { success: false, message: error.message };
                logger.error(error.message)
                return res.status(401).send(response)
            }
            else {
                const validationResult = inputPattern.validate(noteData)
                if (validationResult.error) {
                    const response = { success: false, message: validationResult.error.message };
                    return res.status(400).send(response);
                }

                noteService.createNote(noteData, (error, data) => {
                    if (error) {
                        logger.error("Some error occurred while adding note")
                        const response = { success: false, message: "Some error occurred while adding note" }
                        return res.status(500).send(response)
                    }

                    logger.info("Successfully added note !")
                    const response = { success: true, message: "Successfully added note !", data: data }
                    return res.status(200).send(response)
                })
            }
        })
    }

    // Retrieve all the notes
    findAll = (req, res) => {
        noteService.findAll((error, data) => {
            if (error) {
                logger.error("Some error occurred while retrieving notes")
                const response = { success: false, message: "Some error occurred while retrieving notes" }
                return res.status(500).send(response)
            }

            logger.error("Successfully retrieved notes !")
            const response = { success: true, message: "Successfully retrieved notes !", data: data }
            return res.status(200).send(response)
        })
    }

    // Update note
    updateNote = (req, res) => {
        const noteData = {
            noteID: req.params.noteID,
            emailId: req.body.emailId,
            password: req.body.password,
            title: req.body.title,
            description: req.body.description,
            isArchived: req.body.isArchived
        }
        noteService.validateUser(noteData, (error, user) => {
            if (error) {
                const response = { success: false, message: error.message };
                logger.error(error.message)
                return res.status(401).send(response)
            }
            else {
                const validationResult = inputPattern.validate(noteData)
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

                    if (!data) {
                        logger.error("Note not found with id :" + noteData.noteId)
                        const response = { success: false, message: "Note not found with id :" + noteData.noteId }
                        return res.status(404).send(response)
                    }

                    logger.error("Note updated successfully !")
                    const response = { success: true, message: "Note updated successfully !", data: data }
                    return res.status(200).send(response)
                })
            }
        })
    }

    // Delete note
    deleteNote = (req, res) => {
        const noteData = {
            noteID: req.params.noteID,
            emailId: req.body.emailId,
            password: req.body.password
        }

        noteService.validateUser(noteData, (error, user) => {
            if (error) {
                const response = { success: false, message: error.message };
                logger.error(error.message)
                return res.status(401).send(response)
            }
            else {
                noteService.deleteNote(noteData, (error, data) => {
                    if (error) {
                        logger.error(error.message)
                        const response = { success: false, message: error.message }
                        return res.status(500).send(response)
                    }

                    if (!data) {
                        logger.error("Note not found with id :" + noteData.noteId)
                        const response = { success: false, message: "Note not found with id :" + noteData.noteId }
                        return res.status(404).send(response)
                    }

                    logger.error("Note deleted successfully !")
                    const response = { success: true, message: "Note deleted successfully !", data: data }
                    return res.status(200).send(response)
                })
            }
        })
    }
}
module.exports = new NoteController()