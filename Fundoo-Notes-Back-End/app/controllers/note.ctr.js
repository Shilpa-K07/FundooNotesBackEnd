/**
 * @description Controller class takes request from the routes and sends response back
 * @method createNote creates a new note for the particular user
 */
const noteService = require('../services/note.svc')
const logger = require('../logger/logger')
const Joi = require('joi')
const util = require('../utility/util')

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
        try {
            const noteData = {
                title: req.body.title,
                description: req.body.description,
            }

            const token = req.session.fundoNotes.token

            noteService.validateUser(token, (error, user) => {
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

                    noteData.userId = user._id
                    noteService.createNote(noteData, (error, data) => {
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
            })
        }
        catch (error) {console.log(error)
            const response = { success: false, message: "Some error occurred !" }
            return res.send(response)
        }
    }

    // Retrieve all the notes
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
            return res.send(response)
        }
    }

    // Update note
    updateNote = (req, res) => {
        try {
            const noteData = {
                noteID: req.params.noteID,
                title: req.body.title,
                description: req.body.description,
            }

            const token = req.session.fundoNotes.token

            noteService.validateUser(token, (error, user) => {
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

                    noteData.userId = user._id
                    noteService.updateNote(noteData, (error, data) => {
                        if (error) {
                            logger.error(error.message)
                            const response = { success: false, message: error.message }
                            return res.status(500).send(response)
                        }

                        if (!data) {
                            logger.error("Note not found with id :" + noteData.noteID)
                            const response = { success: false, message: "Note not found with id :" + noteData.noteID }
                            return res.status(404).send(response)
                        }

                        logger.error("Note updated successfully !")
                        const response = { success: true, message: "Note updated successfully !", data: data }
                        return res.status(200).send(response)
                    })
                }
            })
        }
        catch (error) {
            const response = { success: false, message: "Some error occurred !" }
            return res.send(response)
        }
    }

    // Delete note
    deleteNote = (req, res) => {
        try {
            const noteData = {
                noteID: req.params.noteID,
            }

            const token = req.session.fundoNotes.token
            
            noteService.validateUser(token, (error, user) => {
                if (error) {
                    const response = { success: false, message: error.message };
                    logger.error(error.message)
                    return res.status(401).send(response)
                }
                else {
                    noteData.userId = user._id
                    noteService.deleteNote(noteData, (error, data) => {
                        if (error) {
                            logger.error(error.message)
                            const response = { success: false, message: error.message }
                            return res.status(500).send(response)
                        }

                        if (!data) {
                            logger.error("Note not found with id :" + noteData.noteID)
                            const response = { success: false, message: "Note not found with id :" + noteData.noteID }
                            return res.status(404).send(response)
                        }

                        logger.error("Note deleted successfully !")
                        const response = { success: true, message: "Note deleted successfully !", data: data }
                        return res.status(200).send(response)
                    })
                }
            })
        }
        catch (error) {
            const response = { success: false, message: "Some error occurred !" }
            return res.send(response)
        }
    }
}
module.exports = new NoteController()