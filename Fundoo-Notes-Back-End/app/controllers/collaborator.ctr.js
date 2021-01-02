/**
 * @description controller class takes request from routes and sends response back to client
 * @var inputPattern is used for validating inputs using joi validation
 * @method createCollaborator for creating collaborator
 */
const Joi = require('joi');
const logger = require('../logger/logger')
const collaboratorService = require('../services/collaborator.svc')

const inputPattern = Joi.object({
    noteId: Joi.string().trim().required().messages({
        'string.empty': 'noteId can not be empty'
    })
}).unknown(true)

class CollaboratorController {
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

            const validationResult = inputPattern.validate(collaboratorData)

            if (validationResult.error) {
                const response = { success: false, message: validationResult.error.message };
                return res.status(400).send(response);
            }

            collaboratorService.createCollaborator(collaboratorData)
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
            return res.status(500).send(response)
        }
    }

    /**
     * @description delete colloaborator
     * @method collaboratorService.deleteCollaborator is service class method
     */
    deleteCollaborator = (req, res) => {
        /*  try { */
        const collaboratorData = {
            collaboratorId: req.body.collaboratorId,
            noteId: req.body.noteId,
            noteCreatorId: req.decodeData.userId
        }
        console.log("input: "+JSON.stringify(collaboratorData))
        collaboratorService.deleteCollaborator(collaboratorData)
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
                console.log("Error: " + error)
                logger.info("Some error occurred while deleting collaborator")
                const response = { success: false, message: "Some error occurred while deleting collaborator" }
                return res.status(200).send(response)
            })
    }
    /* catch (error) {console.log("error: "+error)
        const response = { success: false, message: "Some error occurred" }
        return res.status(500).send(response)
    } 
}*/
}
module.exports = new CollaboratorController()