const noteService = require('../services/note.svc')
const logger = require('../logger/logger')
const Joi = require('joi')

const inputPattern = Joi.object({
    title: Joi.string().required().messages({
        'string.empty': 'Title can not be empty'
    }),
    note: Joi.string().required().messages({
        'string.empty': 'Note can not be empty'
    })
})

class NoteController {
    /**
     * @description Create new note
     */
    create = (req, res) => {
        const noteData = {
            title: req.body.title,
            note: req.body.note
        }

        const validationResult = inputPattern.validate(noteData)
        if (validationResult.error) {
            const response = { success: false, message: validationResult.error.message };
            return res.status(400).send(response);
        }

        noteService.create(noteData, (error, data) => {
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

    /**
     * @description Retrieve notes
     * @method findAll is service class method
     */
    findAll = (req, res) => {
        noteService.findAll((error, data) => {
            if (error) {
                logger.error("Some error occurred while retrieving notes")
                const response = { success: false, message: "Some error occurred while retrieving notes" }
                return res.status(500).send(response)
            }

            logger.error("Successfully retrieved notes !")
            const response = { success: true, message: "Successfully retrieved notes !", data:data}
            return res.status(200).send(response)
        })
    }
}
module.exports = new NoteController()