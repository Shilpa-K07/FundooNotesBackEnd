const Joi = require('joi');
const logger = require('../logger/logger')
const collaboratorService = require('../services/collaborator.svc')

const inputPattern = Joi.object({
    noteId: Joi.string().required().messages({
        'string.empty': 'noteId can not be empty'
    })
}).unknown(true)

class CollaboratorController {
    createCollaborator = (req, res) => {
        try {
            const collaboratorData = {
                noteId: req.body.noteId,
                userId: req.body.userId
            }

            const validationResult = inputPattern.validate(collaboratorData)

            if (validationResult.error) {
                const response = { success: false, message: validationResult.error.message };
                return res.status(400).send(response);
            }

            collaboratorService.createCollaborator(collaboratorData)
            .then(data => {
                logger.info("Successfully created collaborator !")
                const response = { success: true, message: "Successfully created collaborator !", data: data }
                return res.status(200).send(response)
            })
            .catch(error => {
                if (error.name === 'MongoError' && error.code === 11000) {
                    logger.error("Collaborator exists with this note")
                    const response = { success: false, message: "Collaborator exists with this note" };
                    return res.status(409).send(response)
                }
                logger.info("Some error occurred while creating collaborator")
                const response = { success: false, message: "Some error occurred while creating collaborator" }
                return res.status(200).send(response)
            })
        }
        catch (error) {console.log("error: "+error)
            const response = { success: false, message: "Some error occurred" }
            return res.status(500).send(response)
        }
    }
}
module.exports = new CollaboratorController()